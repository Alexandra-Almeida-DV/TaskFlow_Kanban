from pydantic import BaseModel, ConfigDict
from datetime import datetime, date
from typing import Optional, List

# --- SCHEMAS DE NOTAS ---
class NoteBase(BaseModel):
    content: str
    color: Optional[str] = "#cff178"

class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- SCHEMAS DO KANBAN ---
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[str] = "medium"

class TaskCreate(TaskBase):
    column_id: int

class Task(TaskBase):
    id: int
    column_id: int
    model_config = ConfigDict(from_attributes=True)

class ColumnBase(BaseModel):
    title: str

class ColumnCreate(ColumnBase):
    pass

class ColumnResponse(ColumnBase):
    id: int
    tasks: List[Task] = []
    model_config = ConfigDict(from_attributes=True)

# --- SCHEMAS DE PROJETOS (Sincronizados) ---
class ProjectCreate(BaseModel):
    name: str
    type: str  # Aceita 'leitura', 'projeto', etc.
    description: Optional[str] = ""
    meta_data: Optional[dict] = {}
    end_date: Optional[date] = None

class ProjectResponse(BaseModel):
    id: int
    name: str
    type: str # Retorna 'READING', 'PROJECT', etc.
    description: Optional[str] = ""
    progress: float
    meta_data: dict
    model_config = ConfigDict(from_attributes=True)