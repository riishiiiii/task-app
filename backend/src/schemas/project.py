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
