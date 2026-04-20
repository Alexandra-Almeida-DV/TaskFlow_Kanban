from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, time
from app.schemas.base_schemas import TunedBase

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[str] = "medium"
    status: Optional[str] = "todo"
    date: Optional[date] = None  
    time: Optional[time] = None  
    category: Optional[str] = "Geral"
    column_id: int

class TaskCreate(TaskBase):
    column_id: int

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    date: Optional[date] = None
    time: Optional[time] = None
    category: Optional[str] = None
    column_id: Optional[int] = None    

class TaskResponse(TaskBase, TunedBase):
    id: int
    column_id: int

class ColumnBase(BaseModel):
    title: str

class ColumnCreate(ColumnBase):
    pass

class ColumnResponse(ColumnBase, TunedBase):
    id: int
    user_id: int
    tasks: List[TaskResponse] = Field(default_factory=list)
