import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';

export interface Notification {
  id: number;
  task_id: number | null;
  type: 'overdue' | 'due_today';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos

export function useNotifications(signed: boolean) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const check = useCallback(async () => {
    if (!signed) return;
    try {
      const res = await api.post('/notifications/check');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unread_count);
    } catch (err) {
      console.error('Erro ao verificar notificações:', err);
    }
  }, [signed]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erro ao marcar como lida:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err);
    }
  }, []);

  // Verifica ao montar e configura polling
  useEffect(() => {
    if (!signed) return;

    check();

    intervalRef.current = window.setInterval(check, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [signed, check]);

  return { notifications, unreadCount, loading, check, markAsRead, markAllAsRead };
}
