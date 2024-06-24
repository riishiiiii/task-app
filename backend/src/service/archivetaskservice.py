from fastapi import Depends
from database import models
from database.database import get_db
from sqlalchemy.orm import Session
import uuid
from .taskservice import TaskNotFound
from schemas.task import AllTasks, SingleTask
from datetime import datetime
from collections import defaultdict


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

    async def get_all_archive_task_for_user(self, user: models.User) -> AllTasks:
        tasks = (
            self.db.query(models.ArchiveTask)
            .filter(models.ArchiveTask.user_id == user.user_id)
            .order_by(models.ArchiveTask.created_at.desc())
            .all()
        )

        all_tasks = defaultdict(list)
        today = datetime.now().date()

        for task in tasks:
            key = (
                "today"
                if task.created_at.date() == today
                else task.created_at.date().strftime("%d-%m-%Y")
            )
            all_tasks[key].append(SingleTask.from_orm(task))

        return AllTasks(tasks=dict(all_tasks))

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
