from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import schemas, models
from app.models.kanban import Goal

router = APIRouter(
    prefix="/kanban",
    tags=["Kanban"]
)

# --- ROTAS DE COLUNAS ---

@router.get("/columns/", response_model=List[schemas.ColumnResponse])
def get_columns(db: Session = Depends(get_db)):
    """Retorna todas as colunas e suas respectivas tarefas."""
    return db.query(models.kanban.ColumnModel).all()

@router.post("/columns/", response_model=schemas.ColumnResponse)
def create_column(column: schemas.ColumnCreate, db: Session = Depends(get_db)):
    """Cria uma nova coluna no quadro Kanban."""
    new_col = models.kanban.ColumnModel(title=column.title)
    db.add(new_col)
    db.commit()
    db.refresh(new_col)
    return new_col

@router.delete("/columns/{column_id}")
def delete_column(column_id: int, db: Session = Depends(get_db)):
    """Remove uma coluna (e todas as tarefas dentro dela via cascade)."""
    db_col = db.query(models.kanban.ColumnModel).filter(models.kanban.ColumnModel.id == column_id).first()
    if not db_col:
        raise HTTPException(status_code=404, detail="Coluna não encontrada")
    db.delete(db_col)
    db.commit()
    return {"status": "success", "message": "Coluna removida"}

# --- ROTAS DE TAREFAS ---

@router.post("/tasks/", response_model=schemas.Task, status_code=201)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    """Cria uma tarefa vinculada a uma coluna específica."""
    # Verifica se a coluna existe antes de criar a tarefa
    db_column = db.query(models.kanban.ColumnModel).filter(models.kanban.ColumnModel.id == task.column_id).first()
    if not db_column:
        raise HTTPException(status_code=404, detail="Coluna de destino não existe")

    new_task = models.kanban.TaskModel(
        title=task.title,
        description=task.description,
        priority=task.priority,
        date=task.date,
        completed=False,
        column_id=task.column_id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.patch("/tasks/{task_id}/move", response_model=schemas.Task)
def move_task(task_id: int, new_column_id: int, db: Session = Depends(get_db)):
    """Rota essencial para o Drag-and-Drop do React: move a tarefa de coluna."""
    db_task = db.query(models.kanban.TaskModel).filter(models.kanban.TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    
    db_task.column_id = new_column_id
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/tasks", response_model=List[schemas.Task])
def get_all_tasks(db: Session = Depends(get_db)):
    return db.query(models.kanban.TaskModel).all()

@router.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    db.delete(task)
    db.commit()
    return None

@router.post("/goals", response_model=schemas.GoalCreate)
def create_goal(goal: schemas.GoalCreate, db: Session = Depends(get_db)):
    """Cria uma nova meta mensal."""
    # Usamos o model correto para salvar no banco
    db_goal = models.kanban.Goal(
        title=goal.title,
        target_value=goal.target_value,
        current_value=goal.current_value,
        color=goal.color,
        month_reference=goal.month_reference
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.patch("/tasks/{task_id}/toggle", response_model=schemas.Task)
def toggle_task_status(task_id: int, db: Session = Depends(get_db)):
    """Inverte o status de conclusão da tarefa (concluída/pendente)."""
    db_task = db.query(models.kanban.TaskModel).filter(models.kanban.TaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    
    db_task.completed = not db_task.completed
    db.commit()
    db.refresh(db_task)
    return db_task    

