from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import engine, Base, get_db
from app.models import kanban
from pydantic import BaseModel
from typing import List, Optional
from app import schemas
import datetime
from fastapi.middleware.cors import CORSMiddleware

# Cria as tabelas no banco
Base.metadata.create_all(bind=engine)

app = FastAPI(title="OrBee API - TaskFlow")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False, 
    allow_methods=["*"],
    allow_headers=["*"],
)
TYPE_MAPPER = {
    "projeto": "PROJECT", "project": "PROJECT",
    "leitura": "READING", "reading": "READING",
    "estudo": "STUDY", "study": "STUDY",
    "habito": "HABIT", "habit": "HABIT",
    "meta": "GOAL", "goal": "GOAL"
}

# --- ROTAS DE STATUS ---
@app.get("/")
def home():
    return {"status": "ok", "message": "Backend da OrBee rodando!"}

# --- ROTAS DE COLUNAS (KANBAN) ---
@app.get("/columns/", response_model=List[schemas.ColumnResponse], tags=["Kanban"])
def get_columns(db: Session = Depends(get_db)):
    return db.query(kanban.ColumnModel).all()

@app.post("/columns/", response_model=schemas.ColumnResponse, tags=["Kanban"])
def create_column(column: schemas.ColumnCreate, db: Session = Depends(get_db)):
    new_col = kanban.ColumnModel(title=column.title)
    db.add(new_col)
    db.commit()
    db.refresh(new_col)
    return new_col

# --- ROTAS DE TAREFAS (HOME E KANBAN) ---
@app.get("/tasks/", response_model=List[schemas.Task], tags=["Tarefas"])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(kanban.TaskModel).all()

@app.post("/tasks/", response_model=schemas.Task, status_code=201, tags=["Tarefas"])
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_column = db.query(kanban.ColumnModel).filter(kanban.ColumnModel.id == task.column_id).first()
    if not db_column:
        raise HTTPException(status_code=404, detail="Coluna do Kanban não encontrada")

    new_task = kanban.TaskModel(
        title=task.title,
        description=task.description,
        column_id=task.column_id,
    )
    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

# --- ROTAS DE NOTAS ---
@app.get("/notes/", response_model=List[schemas.Note], tags=["Notas"])
def get_notes(db: Session = Depends(get_db)):
    return db.query(kanban.NoteModel).all() 

@app.post("/notes/", response_model=schemas.Note, tags=["Notas"])
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    db_note = kanban.NoteModel(
        content=note.content,
        color=note.color
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.delete("/notes/{note_id}", tags=["Notas"])
def delete_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(kanban.NoteModel).filter(kanban.NoteModel.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    
    db.delete(db_note)
    db.commit()
    return {"message": "Nota removida com sucesso"}

# --- ROTAS DE PROJETOS (A Camada Estratégica) ---

@app.get("/projects/", response_model=List[schemas.ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return db.query(kanban.ProjectModel).all()

@app.post("/projects/", response_model=schemas.ProjectResponse)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    # 1. Fallback caso o tipo venha nulo
    raw_type = project.type.lower() if project.type else "projeto"
    
    # 2. Busca no Mapper (Garanta que o TYPE_MAPPER esteja no topo do arquivo!)
    db_type = TYPE_MAPPER.get(raw_type, "PROJECT")
    
    # 3. Criação do Objeto
    db_project = kanban.ProjectModel(
        name=project.name,
        type=db_type,
        description=project.description or "",
        meta_data=project.meta_data or {},
        progress=0.0
    )
    
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = db.query(kanban.ProjectModel).filter(kanban.ProjectModel.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Não encontrado")
    db.delete(db_project)
    db.commit()
    return {"status": "success"}      