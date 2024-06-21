from fastapi import Depends
from database.database import get_db
from database import models
from sqlalchemy.orm import Session
import uuid
from passlib.hash import bcrypt
from sqlalchemy.exc import IntegrityError
from .jwtservice import validate_user


class UserAlreadyExists(Exception):
    def __init__(self, message: str = "User already exists"):
        self.message = message


class AuthService:
    def __init__(self, db: Session = Depends(get_db)) -> None:
        self.db = db

    async def register_user(self, username: str, email: str, password: str) -> dict:
        try:
            user_to_create = models.User(
                user_id=uuid.uuid4(),
                username=username,
                email=email,
                password=bcrypt.hash(password),
            )
            self.db.add(user_to_create)
            self.db.commit()
            self.db.refresh(user_to_create)
            return {"message": "User created successfully"}
        except IntegrityError:
            self.db.rollback()
            raise UserAlreadyExists()
        except Exception as e:
            self.db.rollback()
            raise

    async def login_user(self, username: str, password: str) -> dict:
        return validate_user(self.db, username, password)
