import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { 
  TrendingUp, 
  CheckCircle2, 
  Target, 
  BrainCircuit, 
  BarChart3, 
  Calendar as CalendarIcon 
} from 'lucide-react';

// --- TYPES ---
type Task = {
  title: string;
  completed: boolean;
};

type DayData = {
  count: number;
  completed: number;
  status: "vazio" | "concluido" | "parcial" | "pendente";
  tasks: Task[];
};

type Goal = {
  title: string;
  progress: number;
  color: string;
};

type DashboardData = {
  summary: {
    total: number;
    completed: number;
    rate: number;
    best_day: string;
    insight_message: string;
  };
  goals: Goal[];
  calendar_heatmap: Record<string, DayData>;
};

interface MonthlyViewProps {
  tasks: Task[]; 
  onDateClick: (dateStr: string) => void;
}

export function MonthlyView({ tasks, onDateClick }: MonthlyViewProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true); // Controle de loading explícito

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/analytics/month");
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Erro ao buscar dados do backend:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [tasks]); 

  function getColor(status: string | undefined) {
    if (!status) return "bg-white/5 text-white/50";
    switch (status) {
      case "concluido": return "bg-[#cff178] text-[#3A385F]"; 
      case "parcial": return "bg-[#cff178]/30 text-white"; 
      case "pendente": return "bg-[#FFB5CF]/30 text-white"; 
      default: return "bg-white/5 text-white/50"; 
    }
  }

  const calendarDays = useMemo(() => {
    if (!data?.calendar_heatmap) return []; // Segurança caso o heatmap venha nulo

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dateStr = dayDate.toLocaleDateString('sv-SE'); 
      const dayData = data.calendar_heatmap[dateStr];

      days.push(
        <button
          key={dateStr}
          onClick={() => {
            onDateClick(dateStr);
            if (dayData) setSelectedDay(dayData);
          }}
          className={`h-16 md:h-20 rounded-[20px] md:rounded-[25px] transition-all duration-300 flex flex-col items-center justify-center gap-1 border-2 border-transparent hover:border-white/20 active:scale-95
            ${getColor(dayData?.status)}`}
        >
          <span className="text-base md:text-lg font-black">{i}</span>
          {dayData && dayData.count > 0 && (
             <div className="w-1 h-1 rounded-full bg-current opacity-60" />
          )}
        </button>
      );
    }
    return days;
  }, [data, onDateClick]);

  // Renderização condicional de segurança
  if (loading || !data) return (
    <div className="h-full flex items-center justify-center min-h-[400px]">
      <p className="text-[#cff178] font-black animate-pulse uppercase tracking-widest text-xs">Carregando OrBee...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Foco" icon={<TrendingUp size={14}/>} color="text-[#cff178]">
          {data.summary?.rate ?? 0}%
        </StatCard>
        <StatCard title="Tasks" icon={<BarChart3 size={14}/>} color="text-white">
          {data.summary?.completed ?? 0}/{data.summary?.total ?? 0}
        </StatCard>
        <StatCard title="Melhor" icon={<CheckCircle2 size={14}/>} color="text-[#A5A3C8]">
          {data.summary?.best_day?.split(' ')[0] ?? "---"} 
        </StatCard>
        <div className="col-span-2 md:col-span-1 bg-[#cff178] p-4 md:p-5 rounded-[30px] flex items-center gap-3 shadow-lg shadow-[#cff178]/5">
           <BrainCircuit className="text-[#5D5A88] shrink-0" size={20} />
           <p className="text-[#5D5A88] text-[9px] md:text-[10px] font-bold leading-tight uppercase">
             {data.summary?.insight_message ?? "Continue focado!"}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <div className="lg:col-span-2 bg-white/5 p-5 md:p-8 rounded-[35px] md:rounded-[45px] border border-white/5">
          <h2 className="text-white font-black text-xl md:text-2xl mb-6 flex items-center gap-3">
            <CalendarIcon className="text-[#cff178]" size={20} /> Visão Mensal
          </h2>
          <div className="grid grid-cols-7 gap-2 md:gap-3">
            {['S','T','Q','Q','S','S','D'].map((d, index) => (
              <div key={`day-header-${index}`} className="text-center text-[10px] font-black text-white/20 uppercase mb-2">
                {d}
              </div>
            ))}
            {calendarDays}
          </div>
        </div>

        <div className="bg-white/5 p-6 md:p-8 rounded-[35px] md:rounded-[45px] border border-white/5">
          <h2 className="text-white font-black text-xl md:text-2xl mb-6 flex items-center gap-3">
            <Target className="text-[#FFB5CF]" size={20} /> Metas
          </h2>
          <div className="space-y-5">
            {data.goals?.map((goal, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-white/60 uppercase">
                  <span>{goal.title}</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 border border-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${goal.progress}%`, backgroundColor: goal.color }}
                  />
                </div>
              </div>
            )) ?? <p className="text-white/20 text-xs">Nenhuma meta definida.</p>}
          </div>
        </div>
      </div>

      {selectedDay && (
        <div className="fixed inset-0 bg-[#3A385F]/90 backdrop-blur-sm flex items-end md:items-center justify-center z-[110] p-0 md:p-4" onClick={() => setSelectedDay(null)}>
          <div className="bg-white w-full max-w-sm p-8 rounded-t-[40px] md:rounded-[40px] shadow-2xl animate-in slide-in-from-bottom md:zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 md:hidden" />
            <h3 className="text-[#5D5A88] font-black text-xl mb-4">Tarefas do Dia</h3>
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {selectedDay.tasks?.map((task, i) => (
                <li key={i} className={`flex items-center gap-3 text-sm font-bold ${task.completed ? "text-gray-300 line-through" : "text-[#5D5A88]"}`}>
                  <div className={`w-2 h-2 rounded-full ${task.completed ? "bg-gray-200" : "bg-[#cff178]"}`} />
                  {task.title}
                </li>
              )) ?? <li>Sem tarefas.</li>}
            </ul>
            <button onClick={() => setSelectedDay(null)} className="mt-8 w-full bg-[#5D5A88] text-white rounded-2xl py-4 font-black text-sm">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, icon, children, color }: { title: string, icon: React.ReactNode, children: React.ReactNode, color: string }) {
  return (
    <div className="bg-white/5 border border-white/5 p-4 md:p-5 rounded-[25px] md:rounded-[30px] flex flex-col gap-1">
      <div className="flex justify-between items-center text-white/30">
        <span className="text-[9px] font-black uppercase tracking-widest">{title}</span>
        {icon}
      </div>
      <p className={`text-xl md:text-2xl font-black ${color}`}>{children}</p>
    </div>
  );
}