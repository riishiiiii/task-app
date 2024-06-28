from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime


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


# {
#   "labels": [
#     {
#       "label_id": "1",
#       "label_name": "Backlog",
#       "tasks": [
#         { "id": "task1", "content": "Task 1" },
#         { "id": "task2", "content": "Task 2" }
#       ]
#     },
#     {
#       "label_id": "2",
#       "label_name": "Ready to start",
#       "tasks": [
#         { "id": "task3", "content": "Task 3" },
#         { "id": "task4", "content": "Task 4" }
#       ]
#     },
#     {
#       "label_id": "3",
#       "label_name": "In progress",
#       "tasks": [
#         { "id": "task5", "content": "Task 5" },
#         { "id": "task6", "content": "Task 6" }
#       ]
#     },
#     {
#       "label_id": "4",
#       "label_name": "Done / Rejected",
#       "tasks": [
#         { "id": "task7", "content": "Task 7" },
#         { "id": "task8", "content": "Task 8" }
#       ]
#     }
#   ]
# }

class ProjectTask(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    project_task_id: UUID
    task: str
    label_id: UUID
    created_by: UUID
    created_at: datetime

    @classmethod
    def from_orm(cls, task_orm):
        return cls(
            project_task_id=task_orm.project_task_id,
            task=task_orm.task,
            label_id=task_orm.label_id,
            created_by=task_orm.created_by,
            created_at=task_orm.created_at,
        )

class ProjectLabelTasks(BaseModel):
    label_id: UUID
    label_name: str
    tasks: list[ProjectTask]

class ProjectTasks(BaseModel):
    labels: list[ProjectLabelTasks]


class ChangeProjectLabel(BaseModel):
    label: UUID