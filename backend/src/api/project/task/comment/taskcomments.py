from fastapi import APIRouter, Depends, HTTPException
from service.taskcommentservice import TaskCommentsService, CommentNotFound
from service.taskservice import TaskNotFound
from service.jwtservice import JWTBearerService
from schemas.taskcomment import CreateTaskComment, SingleComment
from database import models
import uuid

router = APIRouter()


@router.post("/{task_id}", dependencies=[Depends(JWTBearerService())])
async def create_comment(
    task_id: uuid.UUID,
    comment: CreateTaskComment,
    service: TaskCommentsService = Depends(TaskCommentsService),
    user: models.User = Depends(JWTBearerService().get_current_user),
) -> SingleComment:
    try:
        return await service.create_comment(task_id, comment, user)
    except TaskNotFound:
        raise HTTPException(status_code=404, detail="Task not found")


@router.get("/{task_id}", dependencies=[Depends(JWTBearerService())])
async def get_comments(
    task_id: uuid.UUID,
    current_user: models.User = Depends(JWTBearerService().get_current_user),
    service: TaskCommentsService = Depends(TaskCommentsService),
) -> list[SingleComment]:
    try:
        return await service.get_comments(task_id, current_user)
    except TaskNotFound:
        raise HTTPException(status_code=404, detail="Task not found")


@router.delete("/{comment_id}", dependencies=[Depends(JWTBearerService())])
async def delete_comment(
    comment_id: uuid.UUID,
    service: TaskCommentsService = Depends(TaskCommentsService),
) -> None:
    try:
        await service.delete_comment(comment_id)
    except CommentNotFound:
        raise HTTPException(status_code=404, detail="Comment not found")
