from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date
from calendar import monthrange

from app.models.kanban import TaskModel, Goal


class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    # =========================
    # 📊 DASHBOARD MENSAL
    # =========================
    def get_monthly_dashboard(self):
        today = date.today()
        first_day = today.replace(day=1)
        last_day = today.replace(day=monthrange(today.year, today.month)[1])
        month_prefix = today.strftime('%Y-%m')

        tasks = self.db.query(TaskModel).filter(
            func.date(TaskModel.date) >= first_day.isoformat(),
            func.date(TaskModel.date) <= last_day.isoformat(),
            TaskModel.date.like(f"{month_prefix}%")
        ).all()

        # =========================
        # 📊 SUMMARY
        # =========================
        total = len(tasks)
        completed = sum(1 for t in tasks if t.completed)
        rate = round((completed / total * 100), 1) if total > 0 else 0

        # =========================
        # 📅 HEATMAP
        # =========================
        calendar_heatmap = {}

        for task in tasks:
            # Garante que a chave seja apenas YYYY-MM-DD para o React bater o mapa
            day_str = task.date.split('T')[0] if isinstance(task.date, str) else task.date.isoformat()

            if day_str not in calendar_heatmap:
                calendar_heatmap[day_str] = {
                    "count": 0,
                    "completed": 0,
                    "status": "vazio",
                    "tasks": []
                }

            day_data = calendar_heatmap[day_str]
            day_data["count"] += 1

            if task.completed:
                day_data["completed"] += 1

            day_data["tasks"].append({
                "title": task.title,
                "completed": task.completed
            })

        # 🔹 Definir status do dia
        for day in calendar_heatmap.values():
            if day["count"] == 0:
                day["status"] = "vazio"
            elif day["completed"] == day["count"]:
                day["status"] = "concluido"
            elif day["completed"] > 0:
                day["status"] = "parcial"
            else:
                day["status"] = "pendente"

        # =========================
        # 📈 MELHOR DIA DA SEMANA
        # =========================
        productivity_by_day = (
            self.db.query(
                func.strftime('%w', TaskModel.date).label('day_of_week'),
                func.count(TaskModel.id)
            )
            .filter(
                func.date(TaskModel.date) >= first_day.isoformat(),
                func.date(TaskModel.date) <= last_day.isoformat(),
                TaskModel.completed == True
            )
            .group_by('day_of_week')
            .all()
        )

        days_map = {
            "0": "Dom", "1": "Seg", "2": "Ter",
            "3": "Qua", "4": "Qui", "5": "Sex", "6": "Sáb"
        }

        best_day = "---"
        if productivity_by_day:
            best_day_idx = max(productivity_by_day, key=lambda x: x[1])[0]
            best_day = days_map.get(best_day_idx, "---")

        # =========================
        # 🎯 GOALS (Referência do mês)
        # =========================
        db_goals = self.db.query(Goal).filter(
            Goal.month_reference == first_day
        ).all()

        goals = [
            {
                "title": g.title,
                "progress": round((g.current_value / g.target_value * 100), 1) if g.target_value > 0 else 0,
                "color": g.color
            }
            for g in db_goals
        ]

        insight = self._generate_insight(rate, best_day)

        return {
            "summary": {
                "total": total,
                "completed": completed,
                "rate": rate,
                "best_day": best_day,
                "insight_message": insight
            },
            "goals": goals,
            "calendar_heatmap": calendar_heatmap
        }

    def _generate_insight(self, rate: float, best_day: str) -> str:
        if rate >= 85:
            return f"Excelente consistência. {best_day} é seu dia mais forte."
        elif rate >= 60:
            return f"Bom progresso. Você rende melhor na {best_day}."
        elif rate >= 30:
            return f"Ritmo moderado. Tente organizar sua {best_day}."
        return "Baixa consistência. Comece com pequenas tarefas para ganhar ritmo."  