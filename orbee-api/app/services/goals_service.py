from sqlalchemy.orm import Session
from app.models.goals_models import Goal
from app import schemas
from datetime import datetime
from fastapi import HTTPException

class GoalService:
    @staticmethod
    def get_user_goals(db: Session, user_id: int):
        return db.query(Goal).filter(Goal.user_id == user_id).all()

    @staticmethod
    def create_goal(db: Session, goal_data: schemas.GoalCreate, user_id: int):
        # 1. Normalização e Validação de Datas
        today = datetime.now().date().replace(day=1)
        # Normalizamos para o dia 1º para que o Analytics agrupe por mês corretamente
        normalized_date = goal_data.month_reference.replace(day=1)

        if normalized_date < today:
            raise HTTPException(
                status_code=400, 
                detail="Não é possível criar metas para meses que já passaram."
            )

        db_goal = Goal(
            **goal_data.dict(exclude={"month_reference"}),
            month_reference=normalized_date,
            user_id=user_id
        )
        
        db.add(db_goal)
        db.commit()
        db.refresh(db_goal)
        return db_goal

    @staticmethod
    def update_goal(db: Session, goal_id: int, goal_data: schemas.GoalUpdate, user_id: int):
        db_goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == user_id).first()
        
        if not db_goal:
            return None
        
        update_data = goal_data.dict(exclude_unset=True)
        
        for key, value in update_data.items():
            if key == "month_reference":
                # Mantém a normalização no update também
                value = value.replace(day=1)
            setattr(db_goal, key, value)
        
        db.commit()
        db.refresh(db_goal)
        return db_goal

    @staticmethod
    def delete_goal(db: Session, goal_id: int, user_id: int):
        db_goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == user_id).first()
        if db_goal:
            db.delete(db_goal)
            db.commit()
            return True
        return False
        