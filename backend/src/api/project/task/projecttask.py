from fastapi import APIRouter, Depends, HTTPException
from schemas.project import (
    CreateProjectTask,
    ProjectTasks,
    ProjectTask,
    ChangeProjectLabel,
    UpdateProjectTask,
)
from service.projectservice import ProjectNotFound
from service.projectlabelservice import LabelNotFound
from service.projecttaskservice import ProjectTaskService, TaskNotFound
from service.jwtservice import JWTBearerService
from database import models
from uuid import UUID

router = APIRouter()


@router.post("/{project_id}", dependencies=[Depends(JWTBearerService())])
async def create_project_task(
    project_id: UUID,
    task: CreateProjectTask,
    service: ProjectTaskService = Depends(ProjectTaskService),
    user: models.User = Depends(JWTBearerService().get_current_user),
) -> ProjectTask:
    return await service.create_project_task(project_id, user, task)


@router.get("/{project_id}/{task_id}", dependencies=[Depends(JWTBearerService())])
async def get_project_task_by_id(
    project_id: UUID,
    task_id: UUID,
    service: ProjectTaskService = Depends(ProjectTaskService),
) -> ProjectTask:
    try:
        return await service.get_project_task_by_id(project_id, task_id)
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")
    except TaskNotFound:
        raise HTTPException(status_code=404, detail="Task not found")


@router.get("/{project_id}", dependencies=[Depends(JWTBearerService())])
async def get_project_tasks(
    project_id: UUID, service: ProjectTaskService = Depends(ProjectTaskService)
) -> ProjectTasks:
    try:
        return await service.get_project_tasks(project_id)
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")


@router.put("/{project_id}/{task_id}/label", dependencies=[Depends(JWTBearerService())])
async def update_project_task_label(
    task_id: UUID,
    label: ChangeProjectLabel,
    service: ProjectTaskService = Depends(ProjectTaskService),
) -> None:
    try:
        await service.update_project_task_label(task_id, label)
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")
    except LabelNotFound:
        raise HTTPException(status_code=404, detail="Label not found")


@router.put("/{project_id}/{task_id}", dependencies=[Depends(JWTBearerService())])
async def update_project_task(
    project_id: UUID,
    task_id: UUID,
    task: UpdateProjectTask,
    service: ProjectTaskService = Depends(ProjectTaskService),
) -> None:
    try:
        return await service.update_project_task(project_id, task_id, task)
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")
    except TaskNotFound:
        raise HTTPException(status_code=404, detail="Task not found")


@router.delete("/{project_id}/{task_id}", dependencies=[Depends(JWTBearerService())])
async def delete_project_task(
    project_id: UUID,
    task_id: UUID,
    service: ProjectTaskService = Depends(ProjectTaskService),
) -> None:
    try:
        await service.delete_project_task(project_id, task_id)
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")
    except TaskNotFound:
        raise HTTPException(status_code=404, detail="Task not found")
