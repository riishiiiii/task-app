from fastapi import APIRouter, Depends, HTTPException
from schemas.project import (
    CreateProjectLabel,
    ProjectLabels,
)
from service.projectlabelservice import (
    ProjectLabelService,
    LabelNotFound,
    LabelAlreadyExists,
)

from service.projectservice import ProjectNotFound
from service.jwtservice import JWTBearerService
from uuid import UUID

router = APIRouter()


@router.post("/{project_id}", dependencies=[Depends(JWTBearerService())])
async def create_label(
    project_id: UUID,
    label: CreateProjectLabel,
    service: ProjectLabelService = Depends(ProjectLabelService),
) -> None:
    try:
        return await service.create_label(project_id, label)
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")
    except LabelAlreadyExists:
        raise HTTPException(status_code=409, detail="Label already exists")


@router.get("/{project_id}", dependencies=[Depends(JWTBearerService())])
async def get_labels(
    project_id: UUID, service: ProjectLabelService = Depends(ProjectLabelService)
) -> ProjectLabels:
    return await service.get_labels(project_id)


@router.delete("/{label_id}", dependencies=[Depends(JWTBearerService())])
async def delete_label(
    label_id: UUID, service: ProjectLabelService = Depends(ProjectLabelService)
) -> None:
    try:
        await service.delete_label(label_id)
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")
    except LabelNotFound:
        raise HTTPException(status_code=404, detail="Label not found")


@router.put("/{label_id}", dependencies=[Depends(JWTBearerService())])
async def update_label(
    label_id: UUID,
    label: CreateProjectLabel,
    service: ProjectLabelService = Depends(ProjectLabelService),
) -> None:
    try:
        await service.update_label(label_id, label)
    except LabelNotFound:
        raise HTTPException(status_code=404, detail="Label not found")
