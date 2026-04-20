from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.notes_models import NoteModel
from app.schemas.notes_schemas import NoteCreate

class NoteService:

    @staticmethod
    def get_all_notes_from_user(db: Session, user_id: int):
        return db.query(NoteModel).filter(NoteModel.user_id == user_id).all()

    @staticmethod
    def create_note(db: Session, note_data: NoteCreate, user_id: int):
        if not note_data.content.strip() or not note_data.title.strip():
            raise HTTPException(
                status_code=400,
                detail="Título e conteúdo não podem estar vazios."
            )
        note_dict = note_data.model_dump()
        note_dict["title"] = note_dict["title"].strip()
        note_dict["content"] = note_dict["content"].strip()
        db_note = NoteModel(**note_dict, user_id=user_id)
        db.add(db_note)
        db.commit()
        db.refresh(db_note)
        return db_note

    @staticmethod
    def delete_note(db: Session, note_id: int, user_id: int):
        db_note = db.query(NoteModel).filter(
            NoteModel.id == note_id,
            NoteModel.user_id == user_id
        ).first()
        if db_note:
            db.delete(db_note)
            db.commit()
            return True
        return False

    @staticmethod
    def update_note(db: Session, note_id: int, note_data: NoteCreate, user_id: int):
        db_note = db.query(NoteModel).filter(
            NoteModel.id == note_id,
            NoteModel.user_id == user_id
        ).first()
        if not db_note:
            return None
        if not note_data.title.strip() or not note_data.content.strip():
            raise HTTPException(status_code=400, detail="Título e conteúdo não podem estar vazios.")
        db_note.title = note_data.title.strip()
        db_note.content = note_data.content.strip()
        db_note.category = note_data.category or "Geral"
        db_note.color = note_data.color or "#FFFFFF"
        db_note.date = note_data.date or ""
        db.commit()
        db.refresh(db_note)
        return db_note
        