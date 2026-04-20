from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.database import engine, Base

# Routers
from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router
from app.routes.notes_routes import router as notes_router
from app.routes.kanban_routes import router as kanban_router
from app.routes.project_routes import router as project_router
from app.routes.goals_routes import router as goals_router
from app.routes.recipes_routes import router as recipes_router
from app.routes.analytics_routes import router as analytics_router
from app.routes.notification_routes import router as notifications_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OrBee API 🐝",
    description="Sistema de Gestão de Produtividade e Estilo de Vida",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(notes_router)
app.include_router(kanban_router)
app.include_router(project_router)
app.include_router(goals_router)
app.include_router(recipes_router)
app.include_router(analytics_router)
app.include_router(notifications_router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def health_check():
    return {"status": "online", "message": "OrBee Backend is buzzing! 🐝"}
    