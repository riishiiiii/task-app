from fastapi import APIRouter, Depends, HTTPException
from schemas.auth import UserRegister, UserLogin
from service.authservice import AuthService, UserAlreadyExists
from sqlalchemy.exc import NoResultFound

router = APIRouter()


@router.post("/register")
async def register(
    user: UserRegister, auth_service: AuthService = Depends(AuthService)
):
    try:
        return await auth_service.register_user(
            user.username, user.email, user.password
        )
    except UserAlreadyExists as e:
        raise HTTPException(status_code=409, detail=e.message)


@router.post("/login")
async def login(user: UserLogin, auth_service: AuthService = Depends(AuthService)):
    try:
        return await auth_service.login_user(user.email, user.password)
    except NoResultFound as e:
        raise HTTPException(status_code=404, detail=str(e))
