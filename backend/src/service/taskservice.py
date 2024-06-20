from fastapi import Depends
from sqlalchemy.orm import Session
from database import models
from database.database import get_db
from schemas.task import CreateTask, SingleTask, UpdateTask
import uuid

class TaskNotFound(Exception):
    def __init__(self, message: str) -> None:
        self.message = message

class TaskService:
    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.db = db

    async def create_task(self, task: CreateTask, user: models.User) -> models.Task:
        try:
            new_task = models.Task(
                task_id=str(uuid.uuid4()),
                task=task.task,
                user_id=user.user_id,
                completed=False,
            )
            self.db.add(new_task)
            self.db.commit()
            return new_task
        except Exception as e:
            self.db.rollback()
            raise

    async def get_task_by_id(self, task_id: uuid.UUID) -> SingleTask:
        task = self.db.query(models.Task).filter(models.Task.task_id == task_id).first()
        return SingleTask(**task)

    async def get_task_by_user_id(self, user_id: uuid.UUID) -> list[SingleTask]:
        tasks = self.db.query(models.Task).filter(models.Task.user_id == user_id).all()
        return [
            SingleTask(
                task_id=task.task_id,
                task=task.task,
                completed=task.completed,
                user_id=task.user_id,
            )
            for task in tasks
        ]

    async def delete_task(self, task_id: uuid.UUID) -> None:
        task = self.db.query(models.Task).filter(models.Task.task_id == task_id).first()
        if task is None:
            raise TaskNotFound(f"Task not found")
        self.db.delete(task)
        self.db.commit()

    
    async def update_task(self, task_id: uuid.UUID, updatetask: UpdateTask) -> models.Task:
        task = self.db.query(models.Task).filter(models.Task.task_id == task_id).first()
        if task is None:
            raise TaskNotFound(f"Task not found")
        task.completed = updatetask.completed
        self.db.commit()
        return task