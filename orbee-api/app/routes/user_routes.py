from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import shutil, os, uuid

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user_models import User
from app.schemas.user_schemas import UserResponse, ProfileUpdate, PreferencesUpdate, PasswordUpdate
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])

UPLOAD_DIR = "uploads/photos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserResponse)
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return UserService.update_profile(db, current_user, data)

@router.patch("/me/preferences")
def update_preferences(
    data: PreferencesUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated = UserService.update_preferences(db, current_user, data)
    return {"success": True, "preferences": updated.preferences}

@router.patch("/me/password")
def update_password(
    data: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    UserService.update_password(db, current_user, data)
    return {"success": True, "message": "Senha alterada com sucesso"}

@router.patch("/me/photo", response_model=UserResponse)
def upload_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Use JPG, PNG ou WebP.")

    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    path = f"{UPLOAD_DIR}/{filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if current_user.photo_url:
        old = current_user.photo_url.lstrip("/")
        if os.path.exists(old):
            try:
                os.remove(old)
            except Exception:
                pass

    current_user.photo_url = f"/{path}"
    db.commit()
    db.refresh(current_user)

    return current_user
