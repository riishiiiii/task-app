from fastapi import Depends
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.project import (
    CreateProject,
    SingleProject,
    CreateProjectLabel,
    SingleProjectLabel,
    ProjectLabels,
    CreateProjectTask,
    ProjectTasks,
    ProjectLabelTasks,
    ProjectTask,
    ChangeProjectLabel
)
from database import models
from datetime import datetime, timezone
import uuid
from sqlalchemy.exc import IntegrityError


class ProjectNotFound(Exception):
    def __init__(self) -> None:
        super().__init__(f"Project  not found")


class LabelNotFound(Exception):
    def __init__(self) -> None:
        super().__init__(f"Label not found")

class LabelAlreadyExists(Exception):
    def __init__(self) -> None:
        super().__init__(f"Label already exists")

class ProjectService:
    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.db = db

    async def create_project(
        self, project: CreateProject, user: models.User
    ) -> models.Project:
        try:
            project_to_add = models.Project(
                project_id=uuid.uuid4(),
                project_name=project.project_name,
                owner_id=user.user_id,
                created_at=datetime.now(timezone.utc),
            )
            self.db.add(project_to_add)
            self.db.commit()
            self.db.refresh(project_to_add)
            add_project_member = models.ProjectMembers(
                project_id=project_to_add.project_id,
                user_id=user.user_id,
            )
            self.db.add(add_project_member)
            self.db.commit()
            return project_to_add
        except Exception as e:
            self.db.rollback()
            raise e

    async def get_projects(self, user: models.User) -> list[SingleProject]:
        projects = (
            self.db.query(models.Project)
            .join(
                models.ProjectMembers,
                models.Project.project_id == models.ProjectMembers.project_id,
            )
            .filter(models.ProjectMembers.user_id == user.user_id)
            .all()
        )

        return [SingleProject.from_orm(project) for project in projects]

    async def get_project_by_project_id(self, project_id: uuid.UUID) -> SingleProject:
        project = (
            self.db.query(models.Project)
            .filter(models.Project.project_id == project_id)
            .first()
        )
        if project is None:
            raise ProjectNotFound()
        return SingleProject.from_orm(project)

    async def delete_project(self, project_id: uuid.UUID) -> None:
        project = (
            self.db.query(models.Project)
            .filter(models.Project.project_id == project_id)
            .first()
        )
        if project is None:
            raise ProjectNotFound()

        project_members = (
            self.db.query(models.ProjectMembers)
            .filter(models.ProjectMembers.project_id == project_id)
            .all()
        )
        try:
            for member in project_members:
                self.db.delete(member)
            self.db.commit()

            self.db.delete(project)
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e

    async def update_project(
        self, project_id: uuid.UUID, project: CreateProject
    ) -> None:
        project_to_update = (
            self.db.query(models.Project)
            .filter(models.Project.project_id == project_id)
            .first()
        )
        if project_to_update is None:
            raise ProjectNotFound()
        project_to_update.project_name = project.project_name
        self.db.commit()

    def check_if_project_exists(self, project_id: uuid.UUID) -> models.Project | bool:
        project = (
            self.db.query(models.Project)
            .filter(models.Project.project_id == project_id)
            .first()
        )
        return project if project else False

    async def create_label(
        self, project_id: uuid.UUID, label: CreateProjectLabel
    ) -> SingleProjectLabel:
        project = self.check_if_project_exists(project_id)
        if not project:
            raise ProjectNotFound()
        label_to_add = models.ProjectLabels(
            label_id=uuid.uuid4(),
            label=label.label_name,
            project_id=project_id,
        )
        try:
            self.db.add(label_to_add)
            self.db.commit()
            return SingleProjectLabel.from_orm(label_to_add)
        except IntegrityError as e:
            self.db.rollback()
            raise LabelAlreadyExists()
        except Exception as e:
            self.db.rollback()
            raise e

    async def get_labels(self, project_id: uuid.UUID) -> ProjectLabels:
        labels = (
            self.db.query(models.ProjectLabels)
            .filter(models.ProjectLabels.project_id == project_id)
            .all()
        )
        return ProjectLabels(
            labels=[SingleProjectLabel.from_orm(label) for label in labels]
        )

    async def delete_label(self, label_id: uuid.UUID) -> None:
        label = (
            self.db.query(models.ProjectLabels)
            .filter(models.ProjectLabels.label_id == label_id)
            .first()
        )
        if label is None:
            raise LabelNotFound()
        self.db.delete(label)
        self.db.commit()

    async def update_label(self, label_id: uuid.UUID, label: CreateProjectLabel) -> None:
        label_to_update = (
            self.db.query(models.ProjectLabels)
            .filter(models.ProjectLabels.label_id == label_id)
            .first()
        )
        if label_to_update is None:
            raise LabelNotFound()
        label_to_update.label = label.label_name
        self.db.commit()


    async def create_project_task(self, project_id: uuid.UUID,user: models.User, task: CreateProjectTask) -> None:
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
        except Exception as e:
            self.db.rollback()
            raise e
        
    async def get_project_tasks(self, project_id: uuid.UUID) -> list[models.ProjectTask]:
        project = self.check_if_project_exists(project_id)
        if not project:
            raise ProjectNotFound()
        
        labels_and_tasks = (
            self.db.query(models.ProjectLabels, models.ProjectTask)
            .outerjoin(models.ProjectTask, models.ProjectLabels.label_id == models.ProjectTask.label_id)
            .filter(models.ProjectLabels.project_id == project_id)
            .all()
        )
        
        label_task_map = {}
        for label, task in labels_and_tasks:
            if label.label_id not in label_task_map:
                label_task_map[label.label_id] = {
                    "label_id": label.label_id,
                    "label_name": label.label,
                    "tasks": []
                }
            if task:
                label_task_map[label.label_id]["tasks"].append(ProjectTask.from_orm(task))
        
        project_tasks = ProjectTasks(
            labels=[ProjectLabelTasks(**label_task_map[label_id]) for label_id in label_task_map]
        )
        
        return project_tasks

    async def update_project_task_label(self, task_id: uuid.UUID, label: ChangeProjectLabel) -> None:
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