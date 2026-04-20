from sqlalchemy.orm import Session
from app.models.project_models import ProjectModel
from app.schemas.project_schemas import ProjectCreate, ProjectUpdate


class ProjectService:

    @staticmethod
    def get_all_projects(db: Session, user_id: int):
        return db.query(ProjectModel).filter(ProjectModel.user_id == user_id).all()

    @staticmethod
    def create_project(db: Session, project_data: ProjectCreate, user_id: int):
        db_project = ProjectModel(**project_data.model_dump(), user_id=user_id)
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project

    @staticmethod
    def update_project(db: Session, project_id: int, project_data: ProjectUpdate, user_id: int):
        db_project = db.query(ProjectModel).filter(
            ProjectModel.id == project_id,
            ProjectModel.user_id == user_id
        ).first()

        if not db_project:
            return None

        update_dict = project_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(db_project, key, value)

        if db_project.progress is not None:
            db_project.progress = max(0.0, min(100.0, db_project.progress))

        db.commit()
        db.refresh(db_project)
        return db_project

    @staticmethod
    def delete_project(db: Session, project_id: int, user_id: int):
        db_project = db.query(ProjectModel).filter(
            ProjectModel.id == project_id,
            ProjectModel.user_id == user_id
        ).first()
        if db_project:
            db.delete(db_project)
            db.commit()
            return True
        return False

    @staticmethod
    def checkin_habit(db: Session, project_id: int, user_id: int):
        db_project = db.query(ProjectModel).filter(
            ProjectModel.id == project_id,
            ProjectModel.user_id == user_id
        ).first()

        if not db_project:
            return None

        meta = db_project.meta_data or {}
        meta["streak"] = meta.get("streak", 0) + 1
        habit_goal = meta.get("habit_goal", 30)
        db_project.progress = min(100.0, round((meta["streak"] / habit_goal) * 100, 2))
        db_project.meta_data = meta

        db.commit()
        db.refresh(db_project)
        return db_project
     