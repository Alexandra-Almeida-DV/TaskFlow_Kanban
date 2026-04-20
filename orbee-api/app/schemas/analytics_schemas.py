from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class MonthlyInsight(BaseModel):
    type: str  # 'positive', 'neutral', 'warning'
    message: str
    icon: Optional[str] = None

class GoalAnalytics(BaseModel):
    title: str
    progress: float
    color: str

class MonthlySummary(BaseModel):
    total_tasks: int
    completed_tasks: int
    completion_rate: float
    total_hours_invested: float
    productivity_score: int
    top_category: Optional[str] = "Geral"
    insights: List[MonthlyInsight]
    goals: Optional[List[GoalAnalytics]] = []
    calendar_heatmap: Optional[Dict[str, Any]] = {}

class DashboardResponse(BaseModel):
    success: bool
    data: MonthlySummary
    period: str