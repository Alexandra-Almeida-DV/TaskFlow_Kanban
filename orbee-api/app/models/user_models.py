from sqlalchemy import Column, Integer, String, Boolean, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    full_name = Column(String, nullable=True)
    display_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)

    # Preferências armazenadas como JSON — evita nova tabela
    preferences = Column(JSON, default={})

    is_active = Column(Boolean, default=True)

    notes = relationship("NoteModel", back_populates="owner")
    projects = relationship("ProjectModel", back_populates="owner")
    goals = relationship("Goal", back_populates="owner")
    columns = relationship("ColumnModel", back_populates="owner", cascade="all, delete-orphan")
    tasks = relationship("TaskModel", back_populates="owner", cascade="all, delete-orphan")
    recipes = relationship("RecipeModel", back_populates="author")
    notifications = relationship("NotificationModel", back_populates="user")
