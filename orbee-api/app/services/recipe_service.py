from sqlalchemy.orm import Session
from app.models.recipes_models import RecipeModel
from app.schemas.recipes_schemas import RecipeCreate, RecipeUpdate


class RecipeService:

    @staticmethod
    def get_all_recipes(db: Session, user_id: int):
        return (
            db.query(RecipeModel)
            .filter(RecipeModel.user_id == user_id)
            .order_by(RecipeModel.created_at.desc())
            .all()
        )

    @staticmethod
    def create_recipe(db: Session, recipe_data: RecipeCreate, user_id: int):
        db_recipe = RecipeModel(**recipe_data.model_dump(), user_id=user_id)
        db.add(db_recipe)
        db.commit()
        db.refresh(db_recipe)
        return db_recipe

    @staticmethod
    def update_recipe(db: Session, recipe_id: int, recipe_data: RecipeUpdate, user_id: int):
        db_recipe = db.query(RecipeModel).filter(
            RecipeModel.id == recipe_id,
            RecipeModel.user_id == user_id
        ).first()
        if not db_recipe:
            return None
        for key, value in recipe_data.model_dump(exclude_unset=True).items():
            setattr(db_recipe, key, value)
        db.commit()
        db.refresh(db_recipe)
        return db_recipe

    @staticmethod
    def delete_recipe(db: Session, recipe_id: int, user_id: int):
        db_recipe = db.query(RecipeModel).filter(
            RecipeModel.id == recipe_id,
            RecipeModel.user_id == user_id
        ).first()
        if db_recipe:
            db.delete(db_recipe)
            db.commit()
            return True
        return False
