from sqlalchemy.orm import Session
from datetime import date
from collections import Counter, defaultdict
from app.models.kanban_models import TaskModel

class AnalyticsService:

    @staticmethod
    def get_dashboard_summary(db: Session, user_id: int, month: int, year: int) -> dict:
        today = date.today()
        today_str = today.isoformat()

        all_tasks = db.query(TaskModel).filter(TaskModel.user_id == user_id).all()

        # Tarefas do mês
        tasks_month = [
            t for t in all_tasks
            if t.date and t.date.month == month and t.date.year == year
        ]

        total = len(tasks_month)
        completed_count = sum(1 for t in tasks_month if t.status == "done")
        rate = round((completed_count / total * 100), 1) if total > 0 else 0.0

        # Tarefas de hoje
        tasks_today = [t for t in all_tasks if t.date and t.date.isoformat() == today_str]
        completed_today = sum(1 for t in tasks_today if t.status == "done")
        pending_today = [t for t in tasks_today if t.status != "done"]

        # Próximo compromisso (pendente, com horário, mais próximo)
        proximos = sorted(
            [t for t in pending_today if t.time],
            key=lambda t: t.time
        )
        proximo = proximos[0] if proximos else None

        # Heatmap: contagem de tarefas concluídas por dia
        heatmap: dict = defaultdict(int)
        for t in tasks_month:
            if t.date and t.status == "done":
                heatmap[t.date.isoformat()] += 1

        best_day = max(heatmap, key=heatmap.get) if heatmap else ""

        categories = [t.category for t in tasks_month if t.category]
        top_category = Counter(categories).most_common(1)[0][0] if categories else "Geral"

        goals = [
            {"title": "Conclusão Mensal", "progress": rate, "color": "#CFF178"},
            {"title": "Tarefas Hoje", "progress": min(round((completed_today / len(tasks_today) * 100), 1), 100) if tasks_today else 0, "color": "#A5A3C8"},
        ]

        insights = []
        if rate >= 80:
            insights.append({"type": "positive", "message": "Foco total! Você é uma abelha operária exemplar este mês. 🐝", "icon": "Sparkles"})
        elif rate >= 50:
            insights.append({"type": "neutral", "message": f"Bom ritmo! {completed_count} de {total} tarefas concluídas.", "icon": "TrendingUp"})
        elif total > 0:
            insights.append({"type": "warning", "message": "Ritmo lento. Que tal dividir suas tarefas em partes menores?", "icon": "AlertCircle"})
        else:
            insights.append({"type": "neutral", "message": "Nenhuma tarefa este mês ainda. Comece a voar! 🐝", "icon": "Info"})

        return {
            "total_tasks": total,
            "completed_tasks": completed_count,
            "completion_rate": rate,
            "total_hours_invested": 0.0,
            "productivity_score": int(rate),
            "top_category": top_category,
            "best_day": best_day,
            "insights": insights,
            "goals": goals,
            "calendar_heatmap": dict(heatmap),
            "today": {
                "total": len(tasks_today),
                "completed": completed_today,
                "pending": len(pending_today),
                "next": {
                    "id": proximo.id,
                    "title": proximo.title,
                    "time": proximo.time.strftime("%H:%M"),
                    "category": proximo.category,
                } if proximo else None,
            }
        }
