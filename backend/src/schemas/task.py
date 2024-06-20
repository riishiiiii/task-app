from pydantic import BaseModel
import uuid


class CreateTask(BaseModel):
    task: str


class SingleTask(BaseModel):
    task_id: uuid.UUID
    user_id: uuid.UUID
    task: str
    completed: bool

class UpdateTask(BaseModel):
    completed: bool