from fastapi import Depends
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.project import (
    CreateProjectLabel,
    SingleProjectLabel,
    ProjectLabels,
)
from service.projectservice import ProjectNotFound
from database import models
import uuid
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timezone


class LabelNotFound(Exception):
    def __init__(self) -> None:
        super().__init__(f"Label not found")


class LabelAlreadyExists(Exception):
    def __init__(self) -> None:
        super().__init__(f"Label already exists")


class ProjectLabelService:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def check_if_project_exists(self, project_id: uuid.UUID) -> models.Project | bool:
        project = (
            self.db.query(models.Project)
            .filter(models.Project.project_id == project_id)
            .first()
        )
        return project

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
            created_at=datetime.now(timezone.utc),
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

    async def update_label(
        self, label_id: uuid.UUID, label: CreateProjectLabel
    ) -> None:
        label_to_update = (
            self.db.query(models.ProjectLabels)
            .filter(models.ProjectLabels.label_id == label_id)
            .first()
        )
        if label_to_update is None:
            raise LabelNotFound()
        label_to_update.label = label.label_name
        self.db.commit()
