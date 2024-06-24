from pydantic import BaseModel
import uuid
from datetime import datetime
from typing import Dict


class CreateTask(BaseModel):
    task: str


class SingleTask(BaseModel):
    task_id: uuid.UUID
    user_id: uuid.UUID
    task: str
    completed: bool
    created_at: datetime | str

    @classmethod
    def from_orm(cls, task):
        return cls(
            task_id=task.task_id,
            user_id=task.user_id,
            task=task.task,
            completed=task.completed,
            created_at=task.created_at,
        )


class UpdateTask(BaseModel):
    completed: bool


class AllTasks(BaseModel):
    tasks: Dict[str | datetime, list[SingleTask]]
