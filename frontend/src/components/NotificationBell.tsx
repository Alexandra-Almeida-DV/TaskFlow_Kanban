import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, AlertCircle, X } from 'lucide-react';
import { Notification } from '../hooks/useNotification';

interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationBell({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
      if (diffMin < 1) return 'agora';
      if (diffMin < 60) return `${diffMin}min atrás`;
      const diffH = Math.floor(diffMin / 60);
      if (diffH < 24) return `${diffH}h atrás`;
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BOTÃO SINO */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-3 bg-white rounded-2xl text-[#5D5A88] shadow-sm hover:scale-105 transition-transform"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 top-14 w-80 bg-white/95 backdrop-blur-xl rounded-[24px] shadow-2xl border border-white/60 z-[200] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-black text-[#5D5A88] text-sm">Notificações</h3>
              {unreadCount > 0 && (
                <p className="text-[10px] text-[#8A88B6] font-bold">{unreadCount} não lida{unreadCount > 1 ? 's' : ''}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="flex items-center gap-1 text-[10px] font-black text-[#CFF178] bg-[#5D5A88] px-3 py-1.5 rounded-xl hover:bg-[#4a4770] transition-colors"
                  title="Marcar todas como lidas"
                >
                  <CheckCheck size={12} /> Lidas
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-[#8A88B6] hover:text-[#5D5A88] transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* LISTA */}
          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Bell size={32} className="text-[#8A88B6]/30" />
                <p className="text-[#8A88B6] text-xs font-bold">Tudo em dia! Nenhuma notificação.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => { if (!notif.is_read) onMarkAsRead(notif.id); }}
                  className={`w-full text-left px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 items-start group ${
                    notif.is_read ? 'opacity-50' : ''
                  }`}
                >
                  {/* Ícone por tipo */}
                  <div className={`mt-0.5 p-2 rounded-xl flex-shrink-0 ${
                    notif.type === 'overdue'
                      ? 'bg-red-50 text-red-500'
                      : 'bg-amber-50 text-amber-500'
                  }`}>
                    {notif.type === 'overdue'
                      ? <AlertCircle size={14} />
                      : <Clock size={14} />
                    }
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs font-black text-[#5D5A88] leading-tight ${!notif.is_read ? '' : 'font-bold'}`}>
                        {notif.title}
                      </p>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#CFF178] flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#8A88B6] mt-0.5 leading-snug">{notif.message}</p>
                    <p className="text-[10px] text-[#8A88B6]/60 mt-1 font-bold">{formatTime(notif.created_at)}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* FOOTER */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 bg-gray-50/50 flex justify-center">
              <p className="text-[10px] text-[#8A88B6] font-bold">
                Mostrando últimas {notifications.length} notificações
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
