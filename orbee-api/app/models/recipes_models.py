from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class RecipeModel(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    ingredients = Column(Text, nullable=False)
    instructions = Column(Text, nullable=False)
    prep_time = Column(String(50), nullable=True)
    oven_time = Column(String(50), nullable=True)
    category = Column(String(50), default="Geral")
    image = Column(Text, nullable=True)  # base64 ou URL
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    author = relationship("User", back_populates="recipes")
