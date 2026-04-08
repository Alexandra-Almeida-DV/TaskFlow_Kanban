from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional, List

# --- BASE CONFIG ---
class TunedBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# --- SCHEMAS DE NOTAS ---
class NoteBase(BaseModel):
    title: str
    content: str
    color: Optional[str] = "#FFFFFF"

class NoteCreate(NoteBase):
    pass

class NoteResponse(NoteBase, TunedBase):
    id: int
    date: str  

# --- SCHEMAS DO KANBAN ---
class TaskBase(BaseModel):
    title: str
    completed: bool
    description: Optional[str] = None
    priority: Optional[str] = "medium"
    date: Optional[str] = None

class TaskCreate(TaskBase):
    column_id: int

class Task(TaskBase, TunedBase):
    id: int
    column_id: int

class ColumnBase(BaseModel):
    title: str

class ColumnCreate(ColumnBase):
    pass

class ColumnResponse(ColumnBase, TunedBase):
    id: int
    tasks: List[Task] = []

# --- SCHEMAS DE PROJETOS ---
class ProjectBase(BaseModel):
    name: str
    type: str  
    description: Optional[str] = ""
    meta_data: Optional[dict] = {} 

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase, TunedBase):
    id: int
    progress: float

# --- SCHEMAS DE RECEITAS ---
class RecipeBase(BaseModel):
    title: str
    ingredients: str
    instructions: str
    prepTime: Optional[str] = None
    ovenTime: Optional[str] = None
    category: Optional[str] = "Geral"
    image: Optional[str] = None 

class RecipeCreate(RecipeBase):
    pass

class Recipe(RecipeBase, TunedBase):
    id: int

class GoalCreate(BaseModel):
    title: str
    target_value: float
    current_value: Optional[float] = 0.0
    color: str
    month_reference: date

class GoalResponse(BaseModel):
    title: str
    progress: float
    color: str

    class Config:
        from_attributes = True
