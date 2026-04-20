import { useEffect, useState, useMemo } from "react";
import { api } from "../../services/api";
import {
  Target, 
  Calendar as CalendarIcon,
  ChevronRight,
  Zap,
  Clock,
  Sparkles,
  X,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

type Insight = {
  type: 'positive' | 'neutral' | 'warning';
  message: string;
};

type Goal = {
  title: string;
  progress: number;
  color: string;
};

type DashboardData = {
  success: boolean;
  data: {
    total_tasks: number;
    completed_tasks: number;
    productivity_score: number;
    total_hours_invested: number;
    top_category: string;
    insights: Insight[];
    goals: Goal[];
    calendar_heatmap: Record<string, number>;
  };
  period: string;
};

const mockDashboardData: DashboardData = {
  success: true,
  period: "Abril 2026",
  data: {
    total_tasks: 42,
    completed_tasks: 31,
    productivity_score: 78,
    total_hours_invested: 56,
    top_category: "Desenvolvimento",
    insights: [
      {
        type: "positive",
        message: "Você foi mais produtiva nas manhãs — continue explorando isso."
      }
    ],
    goals: [
      { title: "Projeto SaaS", progress: 70, color: "#CFF178" },
      { title: "Estudos React", progress: 55, color: "#A5A3C8" },
      { title: "Saúde", progress: 40, color: "#FCA5A5" }
    ],
    calendar_heatmap: {
      "2026-04-01": 2,
      "2026-04-02": 4,
      "2026-04-05": 1,
      "2026-04-10": 3,
      "2026-04-15": 5
    }
  }
};

interface MonthlyViewProps {
  onDateClick: (dateStr: string) => void;
  onGoToLogin: () => void; // Prop para mudar a View para 'Login'
}

export function MonthlyView({ onDateClick, onGoToLogin }: MonthlyViewProps) {
  const { signed } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await api.get("/analytics/dashboard-summary");
        if (res.data.success) setData(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    if (signed) {
      fetchData();
    } else {
      setData(mockDashboardData);
      setLoading(false);
      
      // Surge o modal após 1.5 segundos para usuários não logados
      const timer = setTimeout(() => setShowDemoModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [signed]);

  const calendarDays = useMemo(() => {
    if (!data?.data.calendar_heatmap) return [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayCount = data.data.calendar_heatmap[dateStr] || 0;
      const isToday = i === today.getDate();

      days.push(
        <button
          key={dateStr}
          onClick={() => onDateClick(dateStr)}
          className={`h-12 w-full rounded-2xl flex items-center justify-center text-sm font-bold transition-all relative
            ${isToday 
              ? 'bg-white/40 text-white shadow-lg backdrop-blur-md border border-white/30' 
              : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
        >
          {i}
          {dayCount > 0 && !isToday && (
            <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-[#CFF178] shadow-[0_0_8px_#CFF178]" />
          )}
        </button>
      );
    }
    return days;
  }, [data, onDateClick]);

  if (loading) return (
    <div className="p-20 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-white mb-4"></div>
      <p className="font-black text-white/50 tracking-widest text-xs uppercase">Sincronizando Colméia...</p>
    </div>
  );

  const score = data?.data.productivity_score || 0;

  return (
    <div className="p-6 md:p-10 pb-20 pt-8 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* MODAL DE AVISO (GLASSMORPHISM) */}
      {showDemoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-[#3A385F]/40 backdrop-blur-md" onClick={() => setShowDemoModal(false)} />
          <div className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowDemoModal(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-[#CFF178] transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#CFF178] p-4 rounded-3xl shadow-lg mb-6 text-[#3A385F]">
                <Sparkles size={32} />
              </div>
              <h3 className="text-white text-3xl font-black tracking-tighter mb-4">
                Modo <span className="text-[#CFF178]">Demonstração</span>
              </h3>
              <p className="text-white/70 text-sm font-bold leading-relaxed mb-8">
                Você está explorando a interface do OrBee. Para salvar seu progresso e personalizar sua colméia, acesse seu perfil.
              </p>
              
              <button 
                onClick={() => { 
                  setShowDemoModal(false); 
                  onGoToLogin(); // Redireciona para a View de Login
                }}
                className="w-full bg-[#CFF178] text-[#3A385F] font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Começar Agora <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="flex items-center gap-6 mb-10">
         <div className="bg-[#cff178] p-3 rounded-2xl shadow-lg shadow-orange-100">
           <CalendarIcon className="text-white" size={28} />
         </div>
         <div className="flex flex-col justify-center">
           <h2 className="text-4xl font-black text-[#5D5A88] leading-none">
             Como está sendo  <span className="text-[#cff178]">Meu mês?</span>
           </h2>
           <p className="text-[#8A88B6] font-bold text-sm uppercase tracking-widest">
             minha produtividade, insights e lembretes
           </p>
         </div>
       </header>
      
      {/* GRID SUPERIOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="flex flex-col items-center justify-center p-8 min-h-[280px]">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/10" strokeWidth="3" />
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#CFF178]" strokeWidth="3" 
                strokeDasharray={`${score}, 100`} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #CFF178)' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black text-white tracking-tighter">{score}%</span>
            </div>
          </div>
          <h3 className="font-bold text-white/90 text-sm uppercase tracking-widest">Produtividade</h3>
          <p className="text-white/40 text-[10px] font-bold mt-1 uppercase">Foco na Colméia</p>
        </GlassCard>

        {/* CARD INSIGHT */}
        <div className="bg-[#CFF178] p-8 rounded-[40px] shadow-2xl flex flex-col justify-between relative overflow-hidden transition-transform hover:scale-[1.02]">
           <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#5D5A88]/10 rounded-full blur-2xl" />
           <div className="z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} className="text-[#5D5A88]" />
                <span className="text-[#5D5A88] text-[10px] font-black uppercase tracking-widest">Insight Ativo</span>
              </div>
              <h3 className="text-[#5D5A88] text-2xl font-black leading-tight tracking-tighter">
                "{data?.data.insights[0]?.message || "Substitua a culpa pela consciência de que estás a dar o teu melhor."}"
              </h3>
           </div>
           <button className="bg-[#5D5A88] w-12 h-12 rounded-2xl flex items-center justify-center text-white mt-6 shadow-lg hover:bg-[#5D5A88]/90 transition-colors">
             <ChevronRight size={20} />
           </button>
        </div>

        {/* CARD TOTAL HOURS */}
        <GlassCard className="p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-white/90 text-sm uppercase tracking-widest">Tempo Total</h3>
            <Clock className="text-white/30" size={18} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-white tracking-tighter">{Math.floor(data?.data.total_hours_invested || 0)}h</span>
            <span className="text-[#CFF178] font-black uppercase text-[10px]">investidas</span>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between text-[9px] font-bold text-white/40 uppercase">
                <span>Meta Mensal</span>
                <span>75%</span>
             </div>
             <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white/40 rounded-full" style={{ width: '75%' }} />
             </div>
          </div>
        </GlassCard>

        {/* CARD TOP CATEGORY */}
        <GlassCard className="p-8 flex flex-col gap-6">
          <h3 className="font-bold text-white/90 text-sm uppercase tracking-widest">Destaque</h3>
          <div className="bg-white/10 p-5 rounded-[30px] border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#CFF178] rounded-2xl flex items-center justify-center text-[#5D5A88] shadow-[0_0_15px_rgba(207,241,120,0.3)]">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Categoria</p>
              <p className="text-lg font-black text-white tracking-tight">{data?.data.top_category || "---"}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* GRID INFERIOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-white font-black text-2xl flex items-center gap-3 tracking-tighter">
              <CalendarIcon size={24} className="text-[#CFF178]" /> {data?.period || 'Abril 2026'}
            </h2>
            <div className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">5 semanas no período</div>
          </div>
          <div className="grid grid-cols-7 gap-4">
            {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
              <div key={d} className="text-center text-[10px] font-black text-white/30 uppercase mb-2 tracking-widest">{d}</div>
            ))}
            {calendarDays}
          </div>
        </GlassCard>

        <GlassCard className="p-10 flex flex-col gap-8">
          <h2 className="text-white font-black text-2xl flex items-center gap-3 tracking-tighter">
            <Target size={24} className="text-[#CFF178]" /> Objetivos
          </h2>
          <div className="space-y-6">
            {data?.data.goals.map((goal, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{goal.title}</span>
                  <span className="text-[10px] font-black text-[#CFF178]">{goal.progress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-white/30 transition-all duration-1000 group-hover:bg-[#CFF178]/50" 
                    style={{ width: `${goal.progress}%`, backgroundColor: goal.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto p-4 rounded-2xl bg-white/5 border border-white/5">
             <p className="text-white/40 text-[10px] font-bold leading-relaxed uppercase tracking-tighter text-center">
               Continue polinizando seus projetos para alcançar a colheita!
             </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] shadow-xl ${className}`}>
      {children}
    </div>
  );
}