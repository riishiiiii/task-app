from fastapi import Depends
from sqlalchemy.orm import Session
from database.database import get_db
from service.taskservice import TaskNotFound
from schemas.taskcomment import CreateTaskComment, SingleComment, UpdateTaskComment
from database import models
from datetime import datetime, timezone
import uuid


class CommentNotFound(Exception):
    def __init__(self) -> None:
        super().__init__(f"Comment not found")


class TaskCommentsService:
    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.db = db

    async def create_comment(
        self, task_id: uuid.UUID, comment: CreateTaskComment, user: models.User
    ) -> SingleComment:
        task = (
            self.db.query(models.ProjectTask)
            .filter(models.ProjectTask.project_task_id == task_id)
            .first()
        )
        if not task:
            raise TaskNotFound()
        try:
            comment_to_add = models.TaskComments(
                comment_id=uuid.uuid4(),
                project_task_id=task_id,
                comment=comment.comment,
                created_by=user.user_id,
                created_at=datetime.now(timezone.utc),
            )
            self.db.add(comment_to_add)
            self.db.commit()
            self.db.refresh(comment_to_add)
            return SingleComment.from_orm(comment_to_add)
        except Exception as e:
            self.db.rollback()
            raise e

    async def get_comments(
        self, task_id: uuid.UUID, user: models.User
    ) -> list[SingleComment]:
        task = (
            self.db.query(models.ProjectTask)
            .filter(models.ProjectTask.project_task_id == task_id)
            .first()
        )
        if not task:
            raise TaskNotFound()
        comments = (
            self.db.query(models.TaskComments)
            .filter(models.TaskComments.project_task_id == task_id)
            .all()
        )
        return [
            SingleComment(
                comment_id=comment.comment_id,
                comment=comment.comment,
                project_task_id=comment.project_task_id,
                created_at=comment.created_at,
                created_by=comment.created_by
                if comment.created_by != user.user_id
                else "You",
                created_by_username=comment.created_by_user.username,
            )
            for comment in comments
        ]

    async def delete_comment(self, comment_id: uuid.UUID) -> None:
        comment = (
            self.db.query(models.TaskComments)
            .filter(models.TaskComments.comment_id == comment_id)
            .first()
        )
        if not comment:
            raise CommentNotFound()
        try:
            self.db.delete(comment)
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e
