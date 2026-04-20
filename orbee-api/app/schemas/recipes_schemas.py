from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class RecipeBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    ingredients: str
    instructions: str
    prep_time: Optional[str] = None
    oven_time: Optional[str] = None
    category: Optional[str] = "Geral"
    image: Optional[str] = None


class RecipeCreate(RecipeBase):
    pass


class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    ingredients: Optional[str] = None
    instructions: Optional[str] = None
    prep_time: Optional[str] = None
    oven_time: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None


class RecipeResponse(RecipeBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
