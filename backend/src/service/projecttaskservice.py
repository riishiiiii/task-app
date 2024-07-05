from fastapi import Depends
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.project import (
    CreateProjectTask,
    ProjectTasks,
    ProjectLabelTasks,
    ProjectTask,
    ChangeProjectLabel,
    UpdateProjectTask,
    TaskNote,
)
from database import models
from datetime import datetime, timezone
import uuid
from service.projectservice import ProjectNotFound
from service.projectlabelservice import LabelNotFound


class TaskNotFound(Exception):
    def __init__(self, message: str = "Task not found") -> None:
        self.message = message


class ProjectTaskService:
    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.db = db

    def check_if_project_exists(self, project_id: uuid.UUID) -> models.Project | bool:
        project = (
            self.db.query(models.Project)
            .filter(models.Project.project_id == project_id)
            .first()
        )
        return project if project else False

    def check_if_task_exists(self, task_id: uuid.UUID) -> models.ProjectTask | bool:
        task = (
            self.db.query(models.ProjectTask)
            .filter(models.ProjectTask.project_task_id == task_id)
            .first()
        )
        return task if task else False

    async def create_project_task(
        self, project_id: uuid.UUID, user: models.User, task: CreateProjectTask
    ) -> ProjectTask:
        project = self.check_if_project_exists(project_id)
        if not project:
            raise ProjectNotFound()
        task_to_add = models.ProjectTask(
            project_task_id=uuid.uuid4(),
            task=task.task_name,
            project_id=project_id,
            label_id=task.label_id,
            created_by=user.user_id,
            created_at=datetime.now(timezone.utc),
        )
        try:
            self.db.add(task_to_add)
            self.db.commit()
            return ProjectTask.from_orm(task_to_add)
        except Exception as e:
            self.db.rollback()
            raise e

    async def get_project_tasks(
        self, project_id: uuid.UUID
    ) -> list[models.ProjectTask]:
        project = self.check_if_project_exists(project_id)
        if not project:
            raise ProjectNotFound()

        labels_and_tasks = (
            self.db.query(models.ProjectLabels, models.ProjectTask)
            .outerjoin(
                models.ProjectTask,
                models.ProjectLabels.label_id == models.ProjectTask.label_id,
            )
            .filter(models.ProjectLabels.project_id == project_id)
            .order_by(
                models.ProjectLabels.created_at.asc(),
                models.ProjectTask.created_at.asc(),
            )
            .all()
        )
        label_task_map = {}
        for label, task in labels_and_tasks:
            if label.label_id not in label_task_map:
                label_task_map[label.label_id] = {
                    "label_id": label.label_id,
                    "label_name": label.label,
                    "tasks": [],
                }
            if task:
                label_task_map[label.label_id]["tasks"].append(
                    ProjectTask.from_orm(task)
                )

        project_tasks = ProjectTasks(
            labels=[
                ProjectLabelTasks(**label_task_map[label_id])
                for label_id in label_task_map
            ]
        )

        return project_tasks

    async def update_project_task_label(
        self, task_id: uuid.UUID, label: ChangeProjectLabel
    ) -> None:
        task = (
            self.db.query(models.ProjectTask)
            .filter(models.ProjectTask.project_task_id == task_id)
            .first()
        )
        label = (
            self.db.query(models.ProjectLabels)
            .filter(models.ProjectLabels.label_id == label.label)
            .first()
        )
        if not label:
            raise LabelNotFound()
        try:
            task.label = label
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e

    async def get_project_task_by_id(
        self, project_id: uuid.UUID, task_id: uuid.UUID
    ) -> ProjectTask:
        if not self.check_if_project_exists(project_id):
            raise ProjectNotFound()
        if not self.check_if_task_exists(task_id):
            raise TaskNotFound()
        task = self.check_if_task_exists(task_id)
        return ProjectTask.from_orm(task)

    async def update_project_task(
        self, project_id: uuid.UUID, task_id: uuid.UUID, task: UpdateProjectTask
    ) -> ProjectTask:
        if not self.check_if_project_exists(project_id):
            raise ProjectNotFound()
        if not self.check_if_task_exists(task_id):
            raise TaskNotFound()
        update_dict = {}
        if task.task is not None:
            update_dict["task"] = task.task
        if task.description is not None:
            update_dict["description"] = task.description
        if task.priority is not None:
            update_dict["priority"] = task.priority
        if task.due_date is not None:
            update_dict["due_date"] = task.due_date
        if task.note is not None:
            update_dict["note"] = task.note
        try:
            self.db.query(models.ProjectTask).filter(
                models.ProjectTask.project_task_id == task_id
            ).update(update_dict)
            self.db.commit()
            return await self.get_project_task_by_id(project_id, task_id)
        except Exception as e:
            self.db.rollback()
            raise e

    async def delete_project_task(
        self, project_id: uuid.UUID, task_id: uuid.UUID
    ) -> None:
        if not self.check_if_project_exists(project_id):
            raise ProjectNotFound()
        if not self.check_if_task_exists(task_id):
            raise TaskNotFound()
        try:
            self.db.query(models.ProjectTask).filter(
                models.ProjectTask.project_task_id == task_id
            ).delete()
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e
