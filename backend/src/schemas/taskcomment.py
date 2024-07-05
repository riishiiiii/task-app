from pydantic import BaseModel
import uuid
import datetime


class CreateTaskComment(BaseModel):
    comment: str


class UpdateTaskComment(BaseModel):
    comment: str


class SingleComment(BaseModel):
    comment_id: uuid.UUID
    comment: str
    project_task_id: uuid.UUID
    created_at: datetime.datetime
    created_by: uuid.UUID | str
    created_by_username: str

    @classmethod
    def from_orm(cls, comment_orm):
        return cls(
            comment_id=comment_orm.comment_id,
            comment=comment_orm.comment,
            project_task_id=comment_orm.project_task_id,
            created_at=comment_orm.created_at,
            created_by=comment_orm.created_by,
            created_by_username=comment_orm.created_by_user.username,
        )
