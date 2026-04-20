from pydantic import BaseModel
from typing import Optional, Dict, Any


class ProjectBase(BaseModel):
    name: str
    type: str
    description: Optional[str] = ""
    progress: Optional[float] = 0.0
    meta_data: Optional[Dict[str, Any]] = {}
    subject: Optional[str] = None
    study_hours: Optional[int] = None
    target_hours: Optional[int] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    progress: Optional[float] = None
    meta_data: Optional[Dict[str, Any]] = None


class ProjectResponse(ProjectBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
             