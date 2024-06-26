from fastapi import APIRouter, Depends, HTTPException
from schemas.project import CreateProject, SingleProject
from service.projectservice import ProjectService, ProjectNotFound
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
) -> dict:
    await service.update_project(project_id, project)
    return {"message": "Project updated successfully"}
