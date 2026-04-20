from pydantic import BaseModel, EmailStr
from typing import Generic, Optional, TypeVar
from pydantic.generics import GenericModel

T = TypeVar("T")

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserData(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    display_name: Optional[str] = None
    photo_url: Optional[str] = None

class AuthData(BaseModel):
    access_token: str
    user: UserData

class ApiResponse(GenericModel, Generic[T]):
    success: bool
    data: T
    message: str
