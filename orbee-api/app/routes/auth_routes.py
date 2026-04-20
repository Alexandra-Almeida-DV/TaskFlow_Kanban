from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.responses import api_response
from app.schemas.auth_schemas import LoginRequest, ApiResponse, AuthData
from app.schemas.user_schemas import UserCreate, UserResponse
from app.services.user_service import UserService
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = UserService.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
    return UserService.create_user(db, user)


@router.post("/login", response_model=ApiResponse[AuthData])
def login(user_data: LoginRequest, db: Session = Depends(get_db)):
    user = AuthService.authenticate_user(db, user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos"
        )
    token = AuthService.create_token(user)
    return api_response(
        success=True,
        data={
            "access_token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "display_name": user.display_name,
                "photo_url": user.photo_url,
            }
        },
        message="Login realizado com sucesso"
    )
