from pydantic import BaseModel
from datetime import date
from typing import Optional

class GoalBase(BaseModel):
    title: str
    target_value: float
    current_value: Optional[float] = 0.0
    color: Optional[str] = "#4F46E5"
    month_reference: date

class GoalsCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    target_value: Optional[float] = None
    current_value: Optional[float] = None
    color: Optional[str] = None
    month_reference: Optional[date] = None

class GoalResponse(GoalBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
        
GoalsCreate.model_rebuild()
        