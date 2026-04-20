from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user_models import User
from app.services.notification_service import NotificationService
from pydantic import BaseModel

router = APIRouter(prefix="/notifications", tags=["Notifications"])

class NotificationOut(BaseModel):
    id: int
    task_id: Optional[int] = None
    type: str
    title: str
    message: str
    is_read: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

@router.get("/", response_model=list[NotificationOut])
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return NotificationService.get_all(db, user_id=current_user.id)


@router.post("/check")
def check_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    created = NotificationService.check_and_generate(db, user_id=current_user.id)
    all_notifs = NotificationService.get_all(db, user_id=current_user.id)
    unread_count = sum(1 for n in all_notifs if not n.is_read)

    return {
        "new": len(created),
        "unread_count": unread_count,
        "notifications": [NotificationOut.model_validate(n) for n in all_notifs],
    }

@router.patch("/{notification_id}/read")
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = NotificationService.mark_as_read(db, notification_id, user_id=current_user.id)
    return {"success": success}


@router.patch("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    count = NotificationService.mark_all_as_read(db, user_id=current_user.id)
    return {"success": True, "marked": count}
