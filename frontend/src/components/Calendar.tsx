import { useState } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  onDateClick: (date: Date) => void;
}

export function Calendar({ onDateClick }: CalendarProps) {
  // --- TUDO PRECISA ESTAR AQUI DENTRO ---
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="w-full h-full flex flex-col p-2 animate-in fade-in duration-700">
      
      {/* HEADER DINÂMICO */}
      <div className="flex justify-between items-center mb-8 px-4">
        <div className="flex flex-col">
          <h3 className="text-3xl font-black text-[#5D5A88] capitalize tracking-tight">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <p className="text-[11px] font-bold text-[#8A88B6] uppercase tracking-[0.3em]">
            {Math.ceil(calendarDays.length / 7)} Semanas no período
          </p>
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

      {/* CABEÇALHO DOS DIAS */}
      <div className="grid grid-cols-7 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-[#8A88B6] pb-4">
            {day}
          </div>
        ))}
      </div>

      {/* GRADE DE DIAS */}
      <div className="grid grid-cols-7 gap-4 flex-1">
        {calendarDays.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={day.toString()} // Melhor usar a data como key
              onClick={() => onDateClick(day)} 
              className={`
                group relative flex flex-col items-center justify-center rounded-[32px] transition-all duration-300 cursor-pointer 
                min-h-[80px] border border-white/30
                ${!isCurrentMonth ? 'opacity-20 scale-95' : 'opacity-100'}
                ${isToday 
                  ? 'bg-[#cff178] border-[#cff178] text-[#5D5A88] shadow-[0_0_25px_rgba(207,241,120,0.5)] scale-105 z-10' 
                  : 'bg-white/40 backdrop-blur-sm hover:bg-white/80 hover:scale-105 text-[#5D5A88] shadow-sm'
                }
              `} 
            >
              <span className={`text-lg ${isToday ? 'font-black' : 'font-bold'}`}>
                {format(day, 'd')}
              </span>

              {/* Bolinha indicadora sutil */}
              {isCurrentMonth && !isToday && index % 5 === 0 && (
                <div className="absolute bottom-4 w-1.5 h-1.5 bg-[#cff178] rounded-full shadow-[0_0_8px_#cff178]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}