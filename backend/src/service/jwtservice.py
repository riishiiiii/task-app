from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Request, HTTPException, Depends
import jwt
import os
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from database import models
from database.database import get_db

import uuid
from sqlalchemy.exc import NoResultFound

JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]


class JWTBearerService(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request, db: Session = Depends(get_db)):
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)

        if not credentials and self.auto_error:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=403, detail="Invalid authentication scheme."
                )

            try:
                jwt_payload = jwt.decode(
                    credentials.credentials, JWT_SECRET_KEY, algorithms=["HS256"]
                )
                user_id = jwt_payload["user_id"]
                user = (
                    db.query(models.User).filter(models.User.user_id == user_id).first()
                )
                if not user:
                    raise HTTPException(
                        status_code=403, detail="Invalid token or user not found."
                    )
            except jwt.ExpiredSignatureError:
                raise HTTPException(status_code=403, detail="Token has expired.")
            except jwt.PyJWTError:
                raise HTTPException(
                    status_code=403, detail="Invalid token or user not found."
                )

            return credentials.credentials

    async def get_current_user(
        self, request: Request, db: Session = Depends(get_db)
    ) -> models.User:
        credentials: HTTPAuthorizationCredentials = await super(
            JWTBearerService, self
        ).__call__(request)
        if not credentials:
            raise HTTPException(status_code=403)
        try:
            jwt_payload = jwt.decode(
                credentials.credentials,
                JWT_SECRET_KEY,
                algorithms=["HS256"],
            )
            user_id = jwt_payload.get("user_id")
            if not user_id:
                raise HTTPException(status_code=403)
            user = (
                db.query(models.User)
                .filter(models.User.user_id == uuid.UUID(user_id))
                .first()
            )
            if not user:
                raise HTTPException(status_code=403)
            return user
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=403)
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=403)


def validate_user(db: Session, username: str, password: str) -> bool:
    existing_user = (
        db.query(models.User).filter(models.User.username == username).first()
    )
    if existing_user is None:
        raise NoResultFound("User with this username does not exist")
    if bcrypt.verify(password, existing_user.password):
        _todoToken = jwt.encode(
            {"user_id": str(existing_user.user_id)},
            JWT_SECRET_KEY,
            algorithm="HS256",
        )
        return {
            "todoToken": _todoToken,
        }
    else:
        raise NoResultFound("Password is incorrect")
