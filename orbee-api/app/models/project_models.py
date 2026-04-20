from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class ProjectModel(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) 
    subject = Column(String, nullable=True)
    study_hours = Column(Integer, nullable=True)
    description = Column(String, default="")
    progress = Column(Float, default=0.0)
    meta_data = Column(JSON, default={}) 
    target_hours = Column(Float, nullable=True)
    
    # Segurança
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="projects")
    