from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.analytics_service import AnalyticsService

router = APIRouter(tags=["Analytics"])

@router.get("/dashboard-summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    now = datetime.now()
    data = AnalyticsService.get_dashboard_summary(
        db, user_id=current_user.id, month=now.month, year=now.year
    )
    today = data.get("today", {})

    return {
        "success": True,
        "data": {
            "summary": {
                "total": data["total_tasks"],
                "completed": data["completed_tasks"],
                "rate": data["completion_rate"],
                "best_day": data["best_day"],
                "insight_message": data["insights"][0]["message"] if data["insights"] else "Continue assim! 🐝",
            },
            "today": {
                "total": today.get("total", 0),
                "completed": today.get("completed", 0),
                "pending": today.get("pending", 0),
                "next": today.get("next"),
            },
            "goals": data["goals"],
            "calendar_heatmap": data["calendar_heatmap"],
        },
        "period": now.strftime("%B %Y")
    }


@router.get("/analytics/month")
def get_month(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    now = datetime.now()
    data = AnalyticsService.get_dashboard_summary(
        db, user_id=current_user.id, month=now.month, year=now.year
    )
    return {"success": True, "data": data}
