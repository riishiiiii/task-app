from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional
import enum


class CreateProject(BaseModel):
    project_name: str


class SingleProject(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    project_id: UUID
    project_name: str
    created_at: datetime
    owner_id: UUID
    owner_name: str

    @classmethod
    def from_orm(cls, project_orm):
        return cls(
            project_id=project_orm.project_id,
            project_name=project_orm.project_name,
            created_at=project_orm.created_at,
            owner_id=project_orm.owner_id,
            owner_name=project_orm.owner.username,
        )


class CreateProjectLabel(BaseModel):
    label_name: str


class SingleProjectLabel(BaseModel):
    label_id: UUID
    label_name: str
    project_id: UUID

    @classmethod
    def from_orm(cls, label_orm):
        return cls(
            label_id=label_orm.label_id,
            label_name=label_orm.label,
            project_id=label_orm.project_id,
        )


class ProjectLabels(BaseModel):
    labels: list[SingleProjectLabel]


class CreateProjectTask(BaseModel):
    task_name: str
    label_id: UUID


class ProjectTask(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    project_task_id: UUID
    task: str
    label_id: UUID
    label: str
    created_by: UUID
    created_by_name: str
    created_at: datetime
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    note: Optional[str] = None

    @classmethod
    def from_orm(cls, task_orm):
        return cls(
            project_task_id=task_orm.project_task_id,
            task=task_orm.task,
            label_id=task_orm.label_id,
            label=task_orm.label.label,
            created_by=task_orm.created_by,
            created_by_name=task_orm.created_by_user.username,
            created_at=task_orm.created_at,
            description=task_orm.description,
            priority=task_orm.priority.priority if task_orm.priority else None,
            due_date=task_orm.due_date,
            note=task_orm.note,
        )


class ProjectLabelTasks(BaseModel):
    label_id: UUID
    label_name: str
    tasks: list[ProjectTask]


class ProjectTasks(BaseModel):
    labels: list[ProjectLabelTasks]


class ChangeProjectLabel(BaseModel):
    label: UUID


class TaskPrioity(enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    URGENT = "Urgent"
    IMMEDIATE = "Immediate"
    CRITICAL = "Critical"
    BLOCKER = "Blocker"


class UpdateProjectTask(BaseModel):
    task: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[int] = None
    due_date: Optional[datetime] = None
    note: Optional[str] = None
    priority: Optional[TaskPrioity] = None
