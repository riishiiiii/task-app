from fastapi import Depends
from database.database import get_db
from database import models
from sqlalchemy.orm import Session
import uuid
from passlib.hash import bcrypt
from sqlalchemy.exc import IntegrityError
from .jwtservice import validate_user
import re


class UserAlreadyExists(Exception):
    def __init__(self, message: str = "User already exists"):
        self.message = message


class UserNotFound(Exception):
    def __init__(self, message: str = "User not found"):
        self.message = message


class AuthService:
    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.db = db

    async def register_user(self, username: str, email: str, password: str) -> dict:
        try:
            if not isinstance(username, str) or not username.strip():
                raise ValueError("Username must be a non-empty string.")
            email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
            if not re.match(email_pattern, email):
                raise ValueError("Invalid email format.")
            if not password:
                raise ValueError("Password cannot be empty.")
            user_to_create = models.User(
                user_id=uuid.uuid4(),
                username=username,
                email=email,
                password=bcrypt.hash(password),
            )
            self.db.add(user_to_create)
            self.db.commit()
            self.db.refresh(user_to_create)
            return user_to_create
        except IntegrityError:
            self.db.rollback()
            raise UserAlreadyExists()
        except Exception as e:
            self.db.rollback()
            raise

    async def login_user(self, username: str, password: str) -> dict:
        return validate_user(self.db, username, password)

    async def delete_user_by_email(self, email: str) -> None:
        user = self.db.query(models.User).filter(models.User.email == email).first()
        if not user:
            raise UserNotFound()
        self.db.delete(user)
        self.db.commit()

    async def check_user_exists(self, email: str) -> bool:
        user = self.db.query(models.User).filter(models.User.email == email).first()
        return bool(user)
