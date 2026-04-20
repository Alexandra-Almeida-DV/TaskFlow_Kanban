from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.core.responses import api_response
from app.services.kanban_service import KanbanService
from app.models.user_models import User
from app.schemas.kanban_schemas import ColumnResponse, ColumnCreate, TaskResponse, TaskCreate

router = APIRouter(prefix="/kanban", tags=["Kanban"])

@router.get("/tasks")
def list_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tasks = KanbanService.get_user_tasks(db, user_id=current_user.id)

    return api_response(
        success=True,
        date=tasks,
        message="Tarefas carregadas com sucesso"
    )


@router.post("/columns", response_model=ColumnResponse)
def create_column(column: ColumnCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_column = KanbanService.create_column(db, column, user_id=current_user.id)

    return api_response(
        success=True,
        date=new_column,
        message="Coluna criada com sucesso"
    )


@router.post("/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_task = KanbanService.create_task(db, task, user_id=current_user.id)

    if not new_task:
        raise HTTPException(status_code=400, detail="Coluna inválida ou acesso negado")

    return api_response(
        success=True,
        date=new_task,
        message="Tarefa criada com sucesso"
    )


@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not KanbanService.delete_task(db, task_id, user_id=current_user.id):
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")

    return api_response(
        success=True,
        message="Tarefa removida com sucesso"
    )