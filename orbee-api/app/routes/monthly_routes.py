from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.services.analytics_service import AnalyticsService
from app.models.user_models import User

router = APIRouter(prefix="/analytics", tags=["Monthly Analytics"])

@router.get("/dashboard-summary")
def get_monthly_dashboard(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user),
    month: int = Query(default=datetime.now().month),
    year: int = Query(default=datetime.now().year)
):
    summary = AnalyticsService.get_dashboard_summary(
        db, 
        user_id=current_user.id,
        month=month,
        year=year
    )
    
    return {
        "success": True,
        "data": summary,
        "period": f"{month:02d}/{year}"
    }
    