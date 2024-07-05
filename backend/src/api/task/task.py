from fastapi import APIRouter, Depends, HTTPException
from schemas.task import CreateTask, SingleTask, UpdateTask, AllTasks
from service.taskservice import TaskService, TaskNotFound
from service.jwtservice import JWTBearerService
from database import models
import uuid

router = APIRouter()


@router.post("/", response_model=SingleTask, dependencies=[Depends(JWTBearerService())])
async def create_task(
    task: CreateTask,
    task_service: TaskService = Depends(TaskService),
    user: models.User = Depends(JWTBearerService().get_current_user),
) -> SingleTask:
    return await task_service.create_task(task, user)


@router.get("/", dependencies=[Depends(JWTBearerService())])
async def get_tasks(
    task_service: TaskService = Depends(TaskService),
    user: models.User = Depends(JWTBearerService().get_current_user),
) -> AllTasks:
    return await task_service.get_task_by_user_id(user.user_id)


@router.delete("/{task_id}", dependencies=[Depends(JWTBearerService())])
async def delete_task(
    task_id: uuid.UUID, task_service: TaskService = Depends(TaskService)
):
    try:
        return await task_service.delete_task(task_id)
    except TaskNotFound as e:
        raise HTTPException(status_code=404, detail=e.message)


@router.put(
    "/{task_id}", response_model=SingleTask, dependencies=[Depends(JWTBearerService())]
)
async def update_task(
    task_id: uuid.UUID,
    task: UpdateTask,
    task_service: TaskService = Depends(TaskService),
):
    try:
        return await task_service.update_task(task_id, task)
    except TaskNotFound as e:
        raise HTTPException(status_code=404, detail=e.message)
