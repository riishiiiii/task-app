from fastapi import FastAPI
from api.auth import router as auth_router
from api.task import router as task_router
from fastapi.middleware.cors import CORSMiddleware
from api.archivetask import router as archive_task_router

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

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
