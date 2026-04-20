from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.services.goals_service import GoalService
from app.models.user_models import User
from app.schemas.goals_schemas import GoalsCreate, GoalResponse

router = APIRouter(prefix="/goals", tags=["Goals"])

@router.get("/")
def get_goals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goals = GoalService.get_user_goals(db, user_id=current_user.id)
    return {"success": True, "data": goals, "message": "Metas recuperadas"}

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_goals(goals: GoalsCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"success": True, "data": GoalsService.create_goal(db, goals, user_id=current_user.id)}

@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not GoalService.delete_goal(db, goal_id, user_id=current_user.id):
        raise HTTPException(status_code=404, detail="Meta não encontrada")
    return {"success": True, "message": "Meta removida"}
    