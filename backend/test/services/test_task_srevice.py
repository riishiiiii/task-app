import pytest

from .conftest import AuthServiceTestDriver, unique_user_data, TaskServiceTestDriver
import sys, os

sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../src"))
)

from service.taskservice import TaskService, TaskNotFound
from service.authservice import UserNotFound
from schemas.task import CreateTask, UpdateTask
from database.models import Task as TaskModel
import uuid


class TestTaskService:
    @pytest.mark.asyncio
    async def test_should_create_task(self, database):
        task_service = TaskService(database)
        async with AuthServiceTestDriver(database) as driver:
            username, email, password = unique_user_data("user")
            user = await driver.register_user(username, email, password)

            try:
                task = CreateTask(task="Test Task")
                task = await task_service.create_task(task, user)
                assert isinstance(task, TaskModel)
                assert task.task_id is not None
                assert task.task == "Test Task"
                assert task.user_id == user.user_id

                task = await task_service.get_task_by_id(task.task_id)
                assert task.task_id == task.task_id
                assert task.task == "Test Task"
                assert task.user_id == user.user_id

            finally:
                await task_service.delete_task(task.task_id)

    @pytest.mark.asyncio
    async def test_should_get_all_the_tasks_for_user(self, database):
        async with (
            AuthServiceTestDriver(database) as auth_driver,
            TaskServiceTestDriver(database) as task_driver,
        ):
            username, email, password = unique_user_data("user")
            user = await auth_driver.register_user(username, email, password)

            created_task = await task_driver.create_task(
                CreateTask(task="Test Task"), user
            )
            tasks = await task_driver.task_service.get_task_by_user_id(user.user_id)

            task_found = False
            for task in tasks.tasks["today"]:
                if task.task_id == created_task.task_id:
                    task_found = True
                    break
            assert task_found

    @pytest.mark.asyncio
    async def test_should_not_get_tasks_for_wrong_user_id(self, database):
        task_service = TaskService(database)
        with pytest.raises(UserNotFound):
            await task_service.get_task_by_user_id(uuid.uuid4())

    @pytest.mark.asyncio
    async def test_should_not_get_tasks_for_wrong_user(self, database):
        task_service = TaskService(database)
        with pytest.raises(UserNotFound):
            await task_service.get_task_by_user_id(uuid.uuid4())

    @pytest.mark.asyncio
    async def test_should_get_task_by_id(self, database):
        async with (
            AuthServiceTestDriver(database) as auth_driver,
            TaskServiceTestDriver(database) as task_driver,
        ):
            username, email, password = unique_user_data("user")
            user = await auth_driver.register_user(username, email, password)

            created_task = await task_driver.create_task(
                CreateTask(task="Test Task"), user
            )
            task = await task_driver.task_service.get_task_by_id(created_task.task_id)
            assert task.task_id == created_task.task_id
            assert task.task == "Test Task"
            assert task.user_id == user.user_id

    @pytest.mark.asyncio
    async def test_should_not_get_task_by_wrong_id(self, database):
        task_service = TaskService(database)
        with pytest.raises(TaskNotFound):
            await task_service.get_task_by_id(uuid.uuid4())

    @pytest.mark.asyncio
    async def test_should_update_task(self, database):
        async with (
            AuthServiceTestDriver(database) as auth_driver,
            TaskServiceTestDriver(database) as task_driver,
        ):
            username, email, password = unique_user_data("user")
            user = await auth_driver.register_user(username, email, password)

            created_task = await task_driver.create_task(
                CreateTask(task="Test Task"), user
            )
            assert created_task.completed is False
            updated_task = await task_driver.task_service.update_task(
                created_task.task_id, UpdateTask(completed=True)
            )
            assert updated_task.task_id == created_task.task_id
            assert updated_task.task == "Test Task"
            assert updated_task.user_id == user.user_id
            assert updated_task.completed is True

            task = await task_driver.task_service.get_task_by_id(created_task.task_id)
            assert task.task_id == created_task.task_id
            assert task.task == "Test Task"
            assert task.user_id == user.user_id
            assert task.completed is True

    @pytest.mark.asyncio
    async def test_should_not_update_task_for_wrong_user(self, database):
        task_service = TaskService(database)
        with pytest.raises(TaskNotFound):
            await task_service.update_task(uuid.uuid4(), UpdateTask(completed=True))
