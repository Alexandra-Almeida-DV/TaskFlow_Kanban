import { useState } from 'react';
import {
  format, addMonths, subMonths,
  startOfMonth, endOfMonth,
  startOfWeek, endOfWeek,
  isSameMonth, isSameDay,
  eachDayOfInterval
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  onDateClick: (date: Date) => void;
  heatmap?: Record<string, number>; // { "2026-04-18": 3, ... }
}

// Retorna cor de intensidade baseada na quantidade de tarefas concluídas
function getHeatColor(count: number): string {
  if (count === 0) return '';
  if (count === 1) return 'shadow-[0_0_8px_rgba(207,241,120,0.3)]';
  if (count === 2) return 'shadow-[0_0_12px_rgba(207,241,120,0.5)]';
  return 'shadow-[0_0_20px_rgba(207,241,120,0.8)]';
}

function getDotColor(count: number): string {
  if (count === 0) return '';
  if (count === 1) return 'bg-[#cff178]/50';
  if (count === 2) return 'bg-[#cff178]/80';
  return 'bg-[#cff178]';
}

export function Calendar({ onDateClick, heatmap = {} }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Total de tarefas concluídas no mês atual
  const totalMes = Object.entries(heatmap).reduce((acc, [dateStr, count]) => {
    const d = new Date(dateStr);
    if (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()) {
      return acc + count;
    }
    return acc;
  }, 0);

  return (
    <div className="w-full h-full flex flex-col p-2 animate-in fade-in duration-700 relative">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="flex flex-col">
          <h3 className="text-3xl font-black text-[#5D5A88] capitalize tracking-tight">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-[11px] font-bold text-[#8A88B6] uppercase tracking-[0.3em]">
              {Math.ceil(calendarDays.length / 7)} semanas
            </p>
            {totalMes > 0 && (
              <span className="text-[10px] font-black text-[#cff178] bg-[#cff178]/10 px-2 py-0.5 rounded-full">
                {totalMes} concluída{totalMes > 1 ? 's' : ''} no mês
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-white rounded-xl transition-all text-[#5D5A88]">
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 text-[11px] font-black uppercase text-[#5D5A88] hover:text-[#cff178] transition-colors"
          >
            Hoje
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-white rounded-xl transition-all text-[#5D5A88]">
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* DIAS DA SEMANA */}
      <div className="grid grid-cols-7 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-[#8A88B6] pb-4">
            {day}
          </div>
        ))}
      </div>

      {/* GRID DE DIAS */}
      <div className="grid grid-cols-7 gap-2 flex-1">
        {calendarDays.map(day => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          const dateStr = format(day, 'yyyy-MM-dd');
          const count = heatmap[dateStr] ?? 0;
          const heatClass = (!isToday && count > 0) ? getHeatColor(count) : '';
          const dotClass = getDotColor(count);

          return (
            <div
              key={dateStr}
              onClick={() => onDateClick(day)}
              onMouseEnter={(e) => {
                if (count > 0 && !isToday) {
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  setTooltip({
                    text: `${count} tarefa${count > 1 ? 's' : ''} concluída${count > 1 ? 's' : ''}`,
                    x: rect.left + rect.width / 2,
                    y: rect.top - 8,
                  });
                }
              }}
              onMouseLeave={() => setTooltip(null)}
              className={`
                group relative flex flex-col items-center justify-center rounded-[28px] transition-all duration-300 cursor-pointer
                min-h-[64px] border border-white/30
                ${!isCurrentMonth ? 'opacity-20 scale-95 pointer-events-none' : ''}
                ${isToday
                  ? 'bg-[#cff178] border-[#cff178] text-[#5D5A88] shadow-[0_0_25px_rgba(207,241,120,0.5)] scale-105 z-10'
                  : `bg-white/40 backdrop-blur-sm hover:bg-white/80 hover:scale-105 text-[#5D5A88] shadow-sm ${heatClass}`
                }
              `}
            >
              <span className={`text-base ${isToday ? 'font-black' : 'font-bold'}`}>
                {format(day, 'd')}
              </span>

              {/* Indicador de heatmap */}
              {isCurrentMonth && !isToday && count > 0 && (
                <div className={`absolute bottom-2.5 flex gap-0.5`}>
                  {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* TOOLTIP */}
      {tooltip && (
        <div
          className="fixed z-50 bg-[#3A385F] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl pointer-events-none shadow-xl"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
        >
          {tooltip.text}
        </div>
      )}

      {/* LEGENDA */}
      {totalMes > 0 && (
        <div className="flex items-center gap-3 justify-end px-4 mt-4">
          <span className="text-[10px] text-[#8A88B6] font-bold uppercase tracking-wider">Tarefas concluídas</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#cff178]/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#cff178]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#cff178]" />
          </div>
          <span className="text-[10px] text-[#8A88B6] font-bold">1 · 2 · 3+</span>
        </div>
      )}
    </div>
  );
}
