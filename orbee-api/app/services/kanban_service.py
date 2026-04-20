from sqlalchemy.orm import Session
from app.models.kanban_models import TaskModel
from app.models.goals_models import Goal 
from app.models.kanban_models import ColumnModel, TaskModel
from app.schemas.kanban_schemas import TaskCreate, TaskUpdate
from fastapi import HTTPException

class KanbanService:
    @staticmethod
    def get_user_tasks(db: Session, user_id: int):
        return db.query(TaskModel).filter(TaskModel.user_id == user_id).all()

    @staticmethod
    def _update_goal_progress(db: Session, goal_id: int, increment: bool):
        """Lógica Interna: Atualiza o valor atual da meta"""
        db_goal = db.query(Goal).filter(Goal.id == goal_id).first()
        if not db_goal:
            return

        if increment:
            db_goal.current_value += 1
        else:
            if db_goal.current_value > 0:
                db_goal.current_value -= 1
        
        db.commit()

    @staticmethod
    def update_task_status(db: Session, task_id: int, new_status: str, user_id: int):
        db_task = db.query(TaskModel).filter(
            TaskModel.id == task_id, 
            TaskModel.user_id == user_id
        ).first()

        if not db_task:
            raise HTTPException(status_code=404, detail="Tarefa não encontrada")

        old_status = db_task.status
        db_task.status = new_status.lower()
        db.commit()

        if db_task.project_id:
            KanbanService._update_project_progress(db, db_task.project_id)

        if db_task.goal_id:
            if old_status != "done" and new_status == "done":
                KanbanService._update_goal_progress(db, db_task.goal_id, increment=True)
            elif old_status == "done" and new_status != "done":
                KanbanService._update_goal_progress(db, db_task.goal_id, increment=False)

        return db_task