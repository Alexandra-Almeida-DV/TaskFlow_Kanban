from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import date, datetime
from app.models.notification_models import NotificationModel
from app.models.kanban_models import TaskModel


class NotificationService:

    @staticmethod
    def check_and_generate(db: Session, user_id: int) -> list[NotificationModel]:
        today = date.today()
        today_str = today.isoformat()

        # Busca todas as tarefas não concluídas do usuário
        tasks = db.query(TaskModel).filter(
            TaskModel.user_id == user_id,
            TaskModel.status != "done",
        ).all()

        created = []

        for task in tasks:
            task_date_raw = getattr(task, "date", None) or getattr(task, "due_date", None)
            if not task_date_raw:
                continue

            # Normaliza para string YYYY-MM-DD
            try:
                if hasattr(task_date_raw, "isoformat"):
                    task_date_str = task_date_raw.isoformat()[:10]
                else:
                    task_date_str = str(task_date_raw)[:10]
                task_date = date.fromisoformat(task_date_str)
            except Exception:
                continue

            notification_type = None
            if task_date < today:
                notification_type = "overdue"
            elif task_date == today:
                notification_type = "due_today"

            if not notification_type:
                continue

            # Evita duplicatas — só cria se não existe notificação desse tipo para essa tarefa hoje
            existing = db.query(NotificationModel).filter(
                and_(
                    NotificationModel.user_id == user_id,
                    NotificationModel.task_id == task.id,
                    NotificationModel.type == notification_type,
                )
            ).first()

            if existing:
                continue

            title = task.title if hasattr(task, "title") else f"Tarefa #{task.id}"

            if notification_type == "overdue":
                days_late = (today - task_date).days
                msg = f'"{title}" venceu há {days_late} dia{"s" if days_late > 1 else ""}.'
                notif_title = "Tarefa vencida"
            else:
                msg = f'"{title}" vence hoje. Não deixe para depois!'
                notif_title = "Vence hoje"

            notif = NotificationModel(
                user_id=user_id,
                task_id=task.id,
                type=notification_type,
                title=notif_title,
                message=msg,
                is_read=False,
            )
            db.add(notif)
            created.append(notif)

        if created:
            db.commit()
            for n in created:
                db.refresh(n)

        return created

    @staticmethod
    def get_unread(db: Session, user_id: int) -> list[NotificationModel]:
        return (
            db.query(NotificationModel)
            .filter(
                NotificationModel.user_id == user_id,
                NotificationModel.is_read == False,
            )
            .order_by(NotificationModel.created_at.desc())
            .all()
        )

    @staticmethod
    def get_all(db: Session, user_id: int) -> list[NotificationModel]:
        return (
            db.query(NotificationModel)
            .filter(NotificationModel.user_id == user_id)
            .order_by(NotificationModel.created_at.desc())
            .limit(50)
            .all()
        )

    @staticmethod
    def mark_as_read(db: Session, notification_id: int, user_id: int) -> bool:
        notif = db.query(NotificationModel).filter(
            NotificationModel.id == notification_id,
            NotificationModel.user_id == user_id,
        ).first()
        if not notif:
            return False
        notif.is_read = True
        db.commit()
        return True

    @staticmethod
    def mark_all_as_read(db: Session, user_id: int) -> int:
        updated = (
            db.query(NotificationModel)
            .filter(
                NotificationModel.user_id == user_id,
                NotificationModel.is_read == False,
            )
            .all()
        )
        for n in updated:
            n.is_read = True
        db.commit()
        return len(updated)
