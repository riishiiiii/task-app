from fastapi import Depends
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.project import CreateProject, SingleProject
from database import models
from datetime import datetime, timezone
import uuid


class ProjectNotFound(Exception):
    def __init__(self) -> None:
        super().__init__(f"Project  not found")


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
