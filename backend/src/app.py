from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.auth.auth import router as auth_router
from api.task.task import router as task_router
from api.project.project import router as project_router
from api.project.task.projecttask import router as project_task_router
from api.project.label.projectlabels import router as project_label_router
from api.task.archivetask import router as archive_task_router
from api.project.task.comment.taskcomments import router as task_comment_router

app = FastAPI()


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(task_router, prefix="/api/task", tags=["task"])
app.include_router(archive_task_router, prefix="/api/archive", tags=["archive"])
app.include_router(project_router, prefix="/api/project", tags=["project"])
app.include_router(
    project_label_router, prefix="/api/project/label", tags=["project_label"]
)
app.include_router(
    project_task_router, prefix="/api/project/task", tags=["project_task"]
)
app.include_router(
    task_comment_router, prefix="/api/project/taskcomment", tags=["task_comment"]
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
