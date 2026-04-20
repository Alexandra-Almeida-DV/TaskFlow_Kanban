from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.services.project_service import ProjectService
from app.models.user_models import User
from app.schemas.project_schemas import ProjectCreate, ProjectResponse, ProjectUpdate

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("/", response_model=list[ProjectResponse])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ProjectService.get_all_projects(db, user_id=current_user.id)


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ProjectService.create_project(db, project, user_id=current_user.id)


@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated = ProjectService.update_project(db, project_id, project, user_id=current_user.id)
    if not updated:
        raise HTTPException(status_code=404, detail="Projeto não encontrado ou acesso negado")
    return updated


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = ProjectService.delete_project(db, project_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Projeto não encontrado ou acesso negado")


@router.post("/{project_id}/checkin", response_model=ProjectResponse)
def checkin_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated = ProjectService.checkin_habit(db, project_id, user_id=current_user.id)
    if not updated:
        raise HTTPException(status_code=404, detail="Projeto não encontrado ou acesso negado")
    return updated
