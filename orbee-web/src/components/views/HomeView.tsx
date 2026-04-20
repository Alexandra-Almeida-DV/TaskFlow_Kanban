import { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Timer, Zap, Quote, BrainCircuit } from 'lucide-react';
import { Calendar } from '../Calendar';
import { ViewType } from '../../types/View';
import { getDailyQuote } from '../../data/quotes';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface Task {
  id: number;
  title: string;
  time: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  category: string | null;
  date: string;
}

interface TodaySummary {
  total: number;
  completed: number;
  pending: number;
  next: Task | null;
}

interface AnalyticsData {
  summary: {
    total: number;
    completed: number;
    rate: number;
    best_day: string;
    insight_message: string;
  };
  today: TodaySummary;
  goals: Array<{ title: string; progress: number; color: string }>;
  calendar_heatmap: Record<string, number>;
}

interface HomeViewProps {
  tasks: Task[];
  onViewChange: (view: ViewType, date?: Date) => void;
}

export function HomeView({ onViewChange }: HomeViewProps) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fraseDoDia = useMemo(() => getDailyQuote(), []);
  const { signed } = useAuth();

  useEffect(() => {
    if (!signed) { setLoading(false); return; }

    const carregar = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard-summary');
        setAnalytics(res.data.data);
      } catch (err) {
        console.error('Erro ao buscar dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [signed]);

  useEffect(() => {
    let interval: number | undefined;
    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) { clearInterval(interval); setIsActive(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const today = analytics?.today;
  const proximo = today?.next ?? null;
  const totalHoje = today?.total ?? 0;
  const concluidasHoje = today?.completed ?? 0;
  const pendentesHoje = today?.pending ?? 0;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white font-bold">
        Carregando seu OrBee... 🐝
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-8 items-stretch">

        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">

          {/* Card de Frase */}
          <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-[40px] p-8 border border-white/5 shadow-xl flex flex-col justify-center relative overflow-hidden group min-h-[200px]">
            <Quote size={80} className="absolute -right-4 -top-4 text-white/5 rotate-12 group-hover:text-[#cff178]/5 transition-all duration-500" />
            <div className="relative z-10 space-y-3">
              <span className="text-[#cff178] font-black text-[10px] uppercase tracking-[0.2em]">Inspiração OrBee</span>
              <p className="text-white text-xl font-medium leading-relaxed italic tracking-wide">
                "{fraseDoDia.texto}"
              </p>
              <p className="text-white/40 text-sm font-bold tracking-tight text-right">
                — {fraseDoDia.autor}
              </p>
            </div>
          </div>

          {/* Resumo Inteligente */}
          <div className="flex-[1.5] bg-white/10 backdrop-blur-md rounded-[40px] p-8 border border-white/10 shadow-2xl flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-[#cff178] font-bold text-xs uppercase tracking-widest mb-1">Resumo Inteligente</h3>
              <h4 className="text-white text-3xl font-black tracking-tight">
                {analytics?.summary
                  ? `${analytics.summary.rate}% de Foco`
                  : 'Sua OrBee hoje'}
              </h4>
            </div>

            {/* Insight do backend */}
            <div className="bg-[#cff178] p-5 rounded-[30px] flex items-center gap-3 shadow-lg shadow-[#cff178]/10 transition-transform hover:scale-[1.02]">
              <BrainCircuit className="text-[#3A385F] shrink-0" />
              <p className="text-[#3A385F] text-[11px] font-black leading-tight uppercase">
                {analytics?.summary?.insight_message || 'Analisando sua produtividade...'}
              </p>
            </div>

            {/* Próximo compromisso real */}
            <div
              className="bg-[#cff178]/10 border border-[#cff178]/20 p-6 rounded-[35px] flex items-center justify-between cursor-pointer hover:bg-[#cff178]/20 transition-all active:scale-95"
              onClick={() => onViewChange('Daily', new Date())}
            >
              <div className="flex flex-col gap-1">
                <span className="text-[#cff178] font-black text-[10px] uppercase tracking-wider flex items-center gap-2">
                  <Zap size={14} />
                  {proximo ? `Próximo às ${proximo.time}` : 'Sem compromissos'}
                </span>
                <h5 className="text-white font-bold text-xl leading-tight">
                  {proximo ? proximo.title : 'Tudo em ordem!'}
                </h5>
                {proximo?.category && (
                  <span className="text-white/30 text-[10px] font-bold uppercase">{proximo.category}</span>
                )}
              </div>
              <div className="bg-[#cff178] text-[#3A385F] px-4 py-2 rounded-2xl font-black text-lg shadow-lg flex-shrink-0">
                {proximo ? proximo.time : '--:--'}
              </div>
            </div>

            {/* Pendentes e Status reais */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-5 rounded-[30px] border border-white/5 flex flex-col items-center justify-center">
                <p className="text-white/40 text-[10px] font-bold uppercase mb-1">Pendentes (Hoje)</p>
                <p className="text-white text-4xl font-black">{pendentesHoje}</p>
              </div>
              <div className="bg-white/5 p-5 rounded-[30px] border border-white/5 flex flex-col items-center justify-center text-center">
                <p className="text-white/40 text-[10px] font-bold uppercase mb-1">Status (Hoje)</p>
                <div className="flex flex-col items-center text-[#cff178]">
                  <span className="text-xl font-black leading-tight">{concluidasHoje} de {totalHoje}</span>
                  <span className="text-white/20 text-[10px] font-bold uppercase">concluídas</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsActive(!isActive)}
                className={`p-4 rounded-[25px] flex items-center justify-center gap-3 transition-all active:scale-95 border border-white/10 ${
                  isActive ? 'bg-[#cff178] text-[#3A385F]' : 'bg-[#5D5A88] text-white'
                }`}
              >
                <Timer size={18} />
                <span className="font-black text-sm">{isActive ? formatTime(seconds) : 'Foco'}</span>
              </button>
              <button
                onClick={() => onViewChange('Daily', new Date())}
                className="bg-[#cff178] hover:bg-[#bde85d] p-4 rounded-[25px] flex items-center justify-center gap-3 transition-all active:scale-95 text-[#3A385F]"
              >
                <PlusCircle size={18} />
                <span className="font-black text-sm">Novo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calendário com heatmap real */}
        <div className="col-span-12 lg:col-span-7 bg-white/5 backdrop-blur-sm rounded-[45px] p-1 border border-white/10 flex flex-col h-full shadow-2xl">
          <div className="flex-1 p-2">
            <Calendar
              onDateClick={(date: Date) => onViewChange('Daily', date)}
              heatmap={analytics?.calendar_heatmap ?? {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
