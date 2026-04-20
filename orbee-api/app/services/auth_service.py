from sqlalchemy.orm import Session
from app.core import security
from app.models.user_models import User
from app.core.security import create_access_token

class AuthService:

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str):
        user = db.query(User).filter(User.email == email).first()

        if not user:
            return None

        if not security.verify_password(password, user.hashed_password):
            return None

        return user

    @staticmethod
    def create_token(user):
        return create_access_token({"sub": user.email})
        
        