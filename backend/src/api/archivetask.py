from fastapi import APIRouter, Depends, HTTPException
from service.archivetaskservice import ArchiveTaskService
from service.taskservice import TaskNotFound
import uuid
from service.jwtservice import JWTBearerService
from database import models

router = APIRouter()


@router.post("/{task_id}", dependencies=[Depends(JWTBearerService())])
async def add_task_to_archive(
    task_id: uuid.UUID, service: ArchiveTaskService = Depends(ArchiveTaskService)
):
    try:
        return await service.add_task_to_archive(task_id)
    except TaskNotFound as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/", dependencies=[Depends(JWTBearerService())])
async def get_all_archive_task_for_user(
    service: ArchiveTaskService = Depends(ArchiveTaskService),
    user: models.User = Depends(JWTBearerService().get_current_user),
):
    return await service.get_all_archive_task_for_user(user)


@router.delete("/{task_id}", dependencies=[Depends(JWTBearerService())])
async def remove_from_archive(
    task_id: uuid.UUID, service: ArchiveTaskService = Depends(ArchiveTaskService)
):
    try:
        await service.remove_from_archive(task_id)
    except TaskNotFound as e:
        raise HTTPException(status_code=404, detail=str(e))
