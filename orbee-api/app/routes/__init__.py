from fastapi import APIRouter
from .auth_routes import router as auth_router
from .kanban_routes import router as kanban_router
from .notes_routes import router as notes_router
from .project_routes import router as project_router
from .recipes_routes import router as recipes_router
from .monthly_routes import router as monthly_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(kanban_router)
api_router.include_router(notes_router)
api_router.include_router(project_router)
api_router.include_router(recipes_router)
api_router.include_router(monthly_router)
