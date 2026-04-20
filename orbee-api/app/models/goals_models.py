from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    target_value = Column(Float, nullable=False)
    current_value = Column(Float, default=0.0)
    color = Column(String, default="#4F46E5")
    month_reference = Column(Date, nullable=False) 

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="goals")
    