from fastapi import Depends
from database import models
from database.database import get_db
from sqlalchemy.orm import Session
import uuid
from .taskservice import TaskNotFound


class ArchiveTaskService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    async def add_task_to_archive(self, task_id: uuid.UUID) -> models.ArchiveTask:
        task = self.db.query(models.Task).filter(models.Task.task_id == task_id).first()
        if not task:
            raise TaskNotFound()
        task_to_archive = models.ArchiveTask(
            task_id=task.task_id,
            user_id=task.user_id,
            task=task.task,
            completed=task.completed,
            created_at=task.created_at,
        )
        try:
            self.db.add(task_to_archive)
            self.db.delete(task)
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e
        return task_to_archive

    async def get_all_archive_task_for_user(
        self, user: models.User
    ) -> list[models.ArchiveTask]:
        return (
            self.db.query(models.ArchiveTask)
            .filter(models.ArchiveTask.user_id == user.user_id)
            .all()
        )

    async def remove_from_archive(self, task_id: uuid.UUID) -> None:
        task = (
            self.db.query(models.ArchiveTask)
            .filter(models.ArchiveTask.task_id == task_id)
            .first()
        )
        if not task:
            raise TaskNotFound()
        self.db.delete(task)
        self.db.commit()
