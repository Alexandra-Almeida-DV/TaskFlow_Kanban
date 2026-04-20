from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Date, Time
from sqlalchemy.orm import relationship
from app.core.database import Base

class ColumnModel(Base):
    __tablename__ = "columns"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    owner = relationship("User", back_populates="columns")
    tasks = relationship("TaskModel", back_populates="column", cascade="all, delete-orphan")

class TaskModel(Base):
    __tablename__ = "tasks"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    priority = Column(String, default="medium")
    status = Column(String, default="todo")

    date = Column(Date, nullable=True)
    time = Column(Time, nullable=True)
    category = Column(String, nullable=True, default="Geral")

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    column_id = Column(Integer, ForeignKey("columns.id"), nullable=False)

    column = relationship("ColumnModel", back_populates="tasks")
    owner = relationship("User", back_populates="tasks")
    