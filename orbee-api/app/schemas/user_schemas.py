from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    display_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    display_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    display_name: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None


class PreferencesUpdate(BaseModel):
    main_goal: Optional[str] = None
    daily_hours_goal: Optional[int] = None
    focus_mode: Optional[str] = None
    notifications_enabled: Optional[bool] = None
    insight_frequency: Optional[str] = None


class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str
