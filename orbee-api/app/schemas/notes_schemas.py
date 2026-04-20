from pydantic import BaseModel, Field
from typing import Optional
from datetime import date as date_type

class NoteBase(BaseModel):
    title: str
    content: str
    color: Optional[str] = "#FFFFFF"
    date: str

class NoteCreate(BaseModel):
    title: str
    content: str
    category: Optional[str] = "Geral"
    color: Optional[str] = "#cff178"
    date: str = Field(default_factory=lambda: date_type.today().isoformat())

class NoteResponse(NoteBase):
    id: int
    user_id: int
    category: Optional[str] = "Geral"

    class Config:
        from_attributes = True
        