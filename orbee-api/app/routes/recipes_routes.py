from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user_models import User
from app.schemas.recipes_schemas import RecipeCreate, RecipeResponse, RecipeUpdate
from app.services.recipe_service import RecipeService

router = APIRouter(prefix="/recipes", tags=["Recipes"])

@router.get("/", response_model=List[RecipeResponse])
def list_recipe(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return RecipeService.get_all_recipes(db, user_id=current_user.id)


@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
def create_recipe(
    recipe: RecipeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return RecipeService.create_recipe(db, recipe, user_id=current_user.id)


@router.patch("/{recipe_id}", response_model=RecipeResponse)
def update_recipe(
    recipe_id: int,
    recipe: RecipeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated = RecipeService.update_recipe(db, recipe_id, recipe, user_id=current_user.id)
    if not updated:
        raise HTTPException(status_code=404, detail="Receita não encontrada")
    return updated


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not RecipeService.delete_recipe(db, recipe_id, user_id=current_user.id):
        raise HTTPException(status_code=404, detail="Receita não encontrada")
