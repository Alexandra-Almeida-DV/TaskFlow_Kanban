from sqlalchemy import Column, Integer, String, Float, JSON, Text, ForeignKey, DateTime 
from sqlalchemy.orm import relationship
from app.database import Base
import datetime
import enum

class ColumnModel(Base):
    __tablename__ = "columns"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50), nullable=False)
    order = Column(Integer, default=0)
    
    tasks = relationship("TaskModel", back_populates="column", cascade="all, delete-orphan")

class TaskModel(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String(20), default="medium")
    position = Column(Integer, default=0)
    
    column_id = Column(Integer, ForeignKey("columns.id"))
    column = relationship("ColumnModel", back_populates="tasks")

class NoteModel(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    color = Column(String, default="#cff178")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# --- ENUMS PARA PROJETOS ---
class ProjectType(enum.Enum):
    PROJECT = "projeto"
    READING = "leitura"
    STUDY = "estudo"
    HABIT = "habito"
    GOAL = "meta"

class ProjectStatus(enum.Enum):
    ACTIVE = "ativo"
    PAUSED = "pausado"
    COMPLETED = "concluido"

# --- NOVO MODELO DE PROJETOS ---
class ProjectModel(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    description = Column(String, default="")
    progress = Column(Float, default=0.0)
    # AQUI ESTÁ O SEGREDO:
    meta_data = Column(JSON, default={}) 
        