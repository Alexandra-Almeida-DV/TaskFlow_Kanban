from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user_models import User
from app.schemas.user_schemas import UserCreate, ProfileUpdate, PreferencesUpdate, PasswordUpdate
from app.core.security import get_password_hash, verify_password

class UserService:

    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User | None:
        return db.query(User).filter(User.id == user_id).first()    

    @staticmethod
    def create_user(db: Session, user):
        hashed_pwd = get_password_hash(user.password)

        db_user = User(
            email=user.email,
            hashed_password=hashed_pwd,
            full_name=user.full_name,
            display_name=user.display_name,
            phone=user.phone,
            bio=user.bio
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return db_user

    @staticmethod
    def update_profile(db: Session, user: User, data: ProfileUpdate) -> User:
        update_dict = data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(user, key, value)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def update_preferences(db: Session, user: User, data: PreferencesUpdate) -> User:
        current = user.preferences or {}
        current.update(data.model_dump(exclude_unset=True))
        user.preferences = current
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update_password(db: Session, user: User, data: PasswordUpdate) -> User:
        if not verify_password(data.current_password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Senha atual incorreta")
        if len(data.new_password) < 6:
            raise HTTPException(status_code=400, detail="A nova senha deve ter no mínimo 6 caracteres")
        user.hashed_password = get_password_hash(data.new_password)
        db.commit()
        return user
