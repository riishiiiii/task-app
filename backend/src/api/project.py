from fastapi import APIRouter, Depends, HTTPException
from schemas.project import (
    CreateProject,
    SingleProject,
    CreateProjectLabel,
    ProjectLabels,
    CreateProjectTask,
    ProjectTasks,
    ChangeProjectLabel
)
from service.projectservice import ProjectService, ProjectNotFound, LabelNotFound, LabelAlreadyExists
from service.jwtservice import JWTBearerService
from database import models
from uuid import UUID

router = APIRouter()


@router.post("/", dependencies=[Depends(JWTBearerService())])
async def create_project(
    project: CreateProject,
    service: ProjectService = Depends(ProjectService),
    user: models.User = Depends(JWTBearerService().get_current_user),
) -> dict:
    await service.create_project(project, user)
    return {"message": "Project created successfully"}


@router.get("/", dependencies=[Depends(JWTBearerService())])
async def get_projects(
    service: ProjectService = Depends(ProjectService),
    user: models.User = Depends(JWTBearerService().get_current_user),
) -> list[SingleProject]:
    return await service.get_projects(user)


@router.get("/{project_id}", dependencies=[Depends(JWTBearerService())])
async def get_project(
    project_id: UUID, service: ProjectService = Depends(ProjectService)
) -> SingleProject:
    try:
        return await service.get_project_by_project_id(project_id)
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")


@router.delete("/{project_id}", dependencies=[Depends(JWTBearerService())])
async def delete_project(
    project_id: UUID,
    service: ProjectService = Depends(ProjectService),
) -> dict:
    try:
        await service.delete_project(project_id)
        return {"message": "Project deleted successfully"}
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")


@router.put("/{project_id}", dependencies=[Depends(JWTBearerService())])
async def update_project(
    project_id: UUID,
    project: CreateProject,
    service: ProjectService = Depends(ProjectService),
) -> None:
    try:
        await service.update_project(project_id, project)
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")


@router.post("/{project_id}/label", dependencies=[Depends(JWTBearerService())])
async def create_label(
    project_id: UUID,
    label: CreateProjectLabel,
    service: ProjectService = Depends(ProjectService),
) -> None:
    try:
        return await service.create_label(project_id, label)
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")
    except LabelAlreadyExists:
        raise HTTPException(status_code=409, detail="Label already exists")


@router.get("/{project_id}/label", dependencies=[Depends(JWTBearerService())])
async def get_labels(
    project_id: UUID, service: ProjectService = Depends(ProjectService)
) -> ProjectLabels:
    return await service.get_labels(project_id)


@router.delete("/label/{label_id}", dependencies=[Depends(JWTBearerService())])
async def delete_label(
    label_id: UUID, service: ProjectService = Depends(ProjectService)
) -> None:
    try:
        await service.delete_label(label_id)
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")
    except LabelNotFound:
        raise HTTPException(status_code=404, detail="Label not found")


@router.put("/label/{label_id}", dependencies=[Depends(JWTBearerService())])
async def update_label(
    label_id: UUID,
    label: CreateProjectLabel,
    service: ProjectService = Depends(ProjectService),
) -> None:
    try:
        await service.update_label(label_id, label)
    except LabelNotFound:
        raise HTTPException(status_code=404, detail="Label not found")

@router.post("/{project_id}/task", dependencies=[Depends(JWTBearerService())])
async def create_project_task(
    project_id: UUID,
    task: CreateProjectTask,
    service: ProjectService = Depends(ProjectService),
    user: models.User = Depends(JWTBearerService().get_current_user),
) -> None:
    await service.create_project_task(project_id, user, task)


@router.get("/{project_id}/task", dependencies=[Depends(JWTBearerService())])
async def get_project_tasks(
    project_id: UUID, service: ProjectService = Depends(ProjectService)
) -> ProjectTasks:
    return await service.get_project_tasks(project_id)


@router.put("/{project_id}/task/{task_id}", dependencies=[Depends(JWTBearerService())])
async def update_project_task_label(
    project_id: UUID, task_id: UUID, label: ChangeProjectLabel, service: ProjectService = Depends(ProjectService)
) -> None:
    try:
        await service.update_project_task_label(task_id, label)
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")
    except LabelNotFound:
        raise HTTPException(status_code=404, detail="Label not found")