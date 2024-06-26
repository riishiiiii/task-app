import pytest
import os
import hashlib
import sys
import os

sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../src"))
)
from database.database import get_db
from service.authservice import AuthService
from service.taskservice import TaskService


@pytest.fixture
def database():
    return next(get_db())


def current_test() -> str:
    return os.environ["PYTEST_CURRENT_TEST"]


def current_test_hash() -> str:
    return hashlib.sha1(current_test().encode("utf8")).hexdigest()


def unique_user_data(username):
    test_hash = current_test_hash()
    username = f"{username}_{test_hash[:5]}"
    email = f"{username}@example.com"
    password = f"password"
    return username, email, password


class AuthServiceTestDriver:
    def __init__(self, database):
        self.database = database
        self.auth_service = AuthService(database)
        self.created_users = []

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_value, traceback):
        await self.delete_users()

    async def register_user(self, username, email, password):
        user = await self.auth_service.register_user(username, email, password)
        self.created_users.append(user)
        return user

    async def delete_users(self):
        for user in self.created_users:
            await self.auth_service.delete_user_by_email(user.email)
        self.created_users = []


class TaskServiceTestDriver:
    def __init__(self, database):
        self.database = database
        self.task_service = TaskService(database)
        self.created_tasks = []

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_value, traceback):
        await self.delete_tasks()

    async def create_task(self, task, user):
        task = await self.task_service.create_task(task, user)
        self.created_tasks.append(task)
        return task

    async def delete_tasks(self):
        for task in self.created_tasks:
            await self.task_service.delete_task(task.task_id)
        self.created_tasks = []
