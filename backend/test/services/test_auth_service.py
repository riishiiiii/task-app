import pytest
from .conftest import AuthServiceTestDriver, unique_user_data
import sys, os

sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../src"))
)
from service.authservice import AuthService, UserAlreadyExists, UserNotFound
from contextlib import suppress
from sqlalchemy.exc import NoResultFound


class TestAuthService:
    @pytest.mark.asyncio
    async def test_should_register_user(self, database):
        print(database)
        async with AuthServiceTestDriver(database) as driver:
            username, email, password = unique_user_data("user")
            user = await driver.register_user(username, email, password)
            assert user.email == email
            assert user.username == username
            assert await driver.auth_service.check_user_exists(user.email)

    @pytest.mark.asyncio
    async def test_should_not_register_user_with_existing_email(self, database):
        async with AuthServiceTestDriver(database) as driver:
            username, email, password = unique_user_data("user")
            await driver.register_user(username, email, password)

            with pytest.raises(UserAlreadyExists):
                await driver.register_user(username, email, password)

    @pytest.mark.asyncio
    async def test_should_not_register_user_with_existing_username(self, database):
        async with AuthServiceTestDriver(database) as driver:
            username, email, password = unique_user_data("user")
            await driver.register_user(username, email, password)
            with pytest.raises(UserAlreadyExists):
                await driver.register_user(username, "email@example.com", "password")

    @pytest.mark.asyncio
    async def test_should_not_register_user_with_invalid_email(self, database):
        authservice = AuthService(database)
        try:
            with pytest.raises(ValueError):
                await authservice.register_user("username", "invalid_email", "password")
        finally:
            with suppress(UserNotFound):
                await authservice.delete_user_by_email("invalid_email")

    @pytest.mark.asyncio
    async def test_should_not_register_user_with_empty_password(self, database):
        authservice = AuthService(database)
        try:
            with pytest.raises(ValueError):
                await authservice.register_user("username", "email@example.com", "")
        finally:
            with suppress(UserNotFound):
                await authservice.delete_user_by_email("email@example.com")

    @pytest.mark.asyncio
    async def test_should_not_register_user_with_empty_username(self, database):
        authservice = AuthService(database)
        try:
            with pytest.raises(ValueError):
                await authservice.register_user("", "email@example.com", "password")
        finally:
            with suppress(UserNotFound):
                await authservice.delete_user_by_email("email@example.com")

    @pytest.mark.asyncio
    async def test_should_not_register_user_with_empty_email(self, database):
        authservice = AuthService(database)
        try:
            with pytest.raises(ValueError):
                await authservice.register_user("username", "", "password")
        finally:
            with suppress(UserNotFound):
                await authservice.delete_user_by_email("username")

    @pytest.mark.asyncio
    async def test_should_not_register_user_with_invalid_username(self, database):
        authservice = AuthService(database)
        try:
            with pytest.raises(ValueError):
                await authservice.register_user(123456, "email@example.com", "password")
        finally:
            with suppress(UserNotFound):
                await authservice.delete_user_by_email("email@example.com")

    @pytest.mark.asyncio
    async def test_should_login_user(self, database):
        async with AuthServiceTestDriver(database) as driver:
            username, email, password = unique_user_data("user")
            user = await driver.register_user(username, email, password)
            token = await driver.auth_service.login_user(username, password)
            assert token is not None
            import jwt

            JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]
            jwt_payload = jwt.decode(
                token["todoToken"], JWT_SECRET_KEY, algorithms=["HS256"]
            )

            assert str(jwt_payload["user_id"]) == str(user.user_id)

    @pytest.mark.asyncio
    async def test_should_not_login_user_with_invalid_username(self, database):
        async with AuthServiceTestDriver(database) as driver:
            username, email, password = unique_user_data("user")
            await driver.register_user(username, email, password)
            with pytest.raises(NoResultFound):
                await driver.auth_service.login_user("invalid_username", password)

    @pytest.mark.asyncio
    async def test_should_not_login_user_with_invalid_password(self, database):
        async with AuthServiceTestDriver(database) as driver:
            username, email, password = unique_user_data("user")
            await driver.register_user(username, email, password)
            with pytest.raises(NoResultFound):
                await driver.auth_service.login_user(username, "invalid_password")
