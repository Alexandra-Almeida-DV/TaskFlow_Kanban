from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.services.notes_service import NoteService
from app.models.user_models import User
from app.schemas.notes_schemas import NoteCreate, NoteResponse

router = APIRouter(prefix="/notes", tags=["Notes"])

@router.get("/", response_model=list[NoteResponse])
def list_notes(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return NoteService.get_all_notes_from_user(db, user_id=current_user.id)


@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return NoteService.create_note(db, note_data=note, user_id=current_user.id)


@router.delete("/{note_id}")
def delete_note(
    note_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    success = NoteService.delete_note(db, note_id, user_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Nota não encontrada ou acesso negado"
        )
    return {"success": True, "message": "Nota excluída com sucesso"}

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_note = NoteService.update_note(
        db=db,
        note_id=note_id,
        note_data=note,
        user_id=current_user.id
    )

    if not updated_note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nota não encontrada ou acesso negado"
        )

    return updated_note
    