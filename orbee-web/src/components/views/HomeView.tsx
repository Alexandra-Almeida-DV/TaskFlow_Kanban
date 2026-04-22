import { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Timer, Zap, Quote, BrainCircuit } from 'lucide-react';
import { Calendar }    from '../Calendar';
import { ViewType }    from '../../types/View';
import { getDailyQuote } from '../../data/quotes';
import { api }         from '../../services/api';
import { useAuth }     from '../../hooks/useAuth';
import { GlassCard, GlassPanel } from '../effects';

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
  const [seconds,   setSeconds]   = useState(25 * 60);
  const [isActive,  setIsActive]  = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [beeActive, setBeeActive] = useState(false);
  const fraseDoDia = useMemo(() => getDailyQuote(), []);
  const { signed } = useAuth();

  useEffect(() => {
    if (!signed) { setLoading(false); return; }
    const load = async () => {
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
    load();
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

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const today          = analytics?.today;
  const proximo        = today?.next        ?? null;
  const totalHoje      = today?.total       ?? 0;
  const concluidasHoje = today?.completed   ?? 0;
  const pendentesHoje  = today?.pending     ?? 0;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white font-bold">
        Carregando seu OrBee... 🐝
      </div>
    );
  }

  return (
    <div className="relative" style={{ zIndex: 2 }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-8 items-stretch">

        {/* ── Coluna esquerda ── */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">

          {/* Card Inspiração */}
          <GlassCard
            radius="40px"
            revealDelay={0}
            className="flex-1 min-h-[200px] p-8 flex flex-col justify-center"
            onMouseEnter={() => setBeeActive(true)}
            onMouseLeave={() => setBeeActive(false)}
          >
            {/* Abelha animada */}
            <div
              className="absolute right-4 top-1/1 -translate-y-1/2 text-4xl select-none pointer-events-none z-10"
              style={{
                filter: beeActive
                  ? 'drop-shadow(0 0 20px #cff178)'
                  : 'drop-shadow(0 0 5px rgba(207,241,120,0.15))',
                animation: beeActive
                  ? 'beeFly 1.4s ease-in-out infinite'
                  : 'beeFloat 3s ease-in-out infinite',
                transition: 'filter 0.4s ease',
              }}
            >
              🐝
            </div>

            <Quote
              size={80}
              className="absolute -right-4 -top-4 rotate-12 transition-colors duration-500"
              style={{ color: beeActive ? 'rgba(207,241,120,0.07)' : 'rgba(255,255,255,0.03)' }}
            />

            <div className="relative z-10 space-y-3">
              <span className="text-[#cff178] font-black text-[10px] uppercase tracking-[0.2em]">
                ✦ Inspiração OrBee
              </span>
              <p className="text-white text-xl font-medium leading-relaxed italic tracking-wide max-w-[75%]">
                "{fraseDoDia.texto}"
              </p>
              <p className="text-white/40 text-sm font-bold tracking-tight text-right">
                — {fraseDoDia.autor}
              </p>
            </div>
          </GlassCard>

          {/* Resumo Inteligente */}
          <GlassPanel
            radius="40px"
            revealDelay={80}
            className="flex-[1.5] p-8 flex flex-col justify-between gap-6"
          >
            <div>
              <h3 className="text-[#cff178] font-bold text-xs uppercase tracking-widest mb-1">
                Resumo Inteligente
              </h3>
              <h4 className="text-white text-3xl font-black tracking-tight">
                {analytics?.summary
                  ? `${analytics.summary.rate}% de Foco`
                  : 'Sua OrBee hoje'}
              </h4>
            </div>

            {/* Insight */}
            <div className="bg-[#cff178] p-5 rounded-[30px] flex items-center gap-3 shadow-lg shadow-[#cff178]/20 transition-transform hover:scale-[1.02]">
              <BrainCircuit className="text-[#3A385F] shrink-0" />
              <p className="text-[#3A385F] text-[11px] font-black leading-tight uppercase">
                {analytics?.summary?.insight_message || 'Analisando sua produtividade...'}
              </p>
            </div>

            {/* Próximo compromisso */}
            <GlassCard
              radius="35px"
              revealDelay={120}
              className="p-6 flex items-center justify-between"
              style={{
                background: 'rgba(207,241,120,0.06)',
                border:     '1px solid rgba(207,241,120,0.15)',
              }}
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
                  <span className="text-white/30 text-[10px] font-bold uppercase">
                    {proximo.category}
                  </span>
                )}
              </div>
              <div className="bg-[#cff178] text-[#3A385F] px-4 py-2 rounded-2xl font-black text-lg shadow-lg flex-shrink-0">
                {proximo ? proximo.time : '--:--'}
              </div>
            </GlassCard>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Pendentes (Hoje)', value: String(pendentesHoje), sub: null       },
                { label: 'Status (Hoje)',    value: `${concluidasHoje} de ${totalHoje}`, sub: 'concluídas' },
              ].map(({ label, value, sub }, i) => (
                <GlassCard
                  key={label}
                  radius="30px"
                  revealDelay={160 + i * 60}
                  className="p-5 flex flex-col items-center justify-center text-center"
                >
                  <p className="text-white/40 text-[10px] font-bold uppercase mb-1">{label}</p>
                  <p className="text-white text-3xl font-black leading-tight">{value}</p>
                  {sub && <p className="text-white/20 text-[10px] font-bold uppercase mt-0.5">{sub}</p>}
                </GlassCard>
              ))}
            </div>

            {/* Botões */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsActive(!isActive)}
                className={`p-4 rounded-[25px] flex items-center justify-center gap-3 transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#cff178] text-[#3A385F]'
                    : 'text-white border border-white/10 hover:border-white/20'
                }`}
                style={
                  isActive ? {} : {
                    background:     'rgba(93,90,136,0.5)',
                    backdropFilter: 'blur(10px)',
                  }
                }
              >
                <Timer size={18} />
                <span className="font-black text-sm">
                  {isActive ? formatTime(seconds) : 'Foco'}
                </span>
              </button>

              <button
                onClick={() => onViewChange('Daily', new Date())}
                className="bg-[#cff178] hover:bg-[#bde85d] p-4 rounded-[25px] flex items-center justify-center gap-3 transition-all active:scale-95 text-[#3A385F]"
              >
                <PlusCircle size={18} />
                <span className="font-black text-sm">Novo</span>
              </button>
            </div>
          </GlassPanel>
        </div>

        {/* ── Coluna direita ── */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 h-full">

          {/* Calendário */}
          <GlassPanel radius="45px" revealDelay={40} className="flex-1 p-3">
            <Calendar
              onDateClick={(date: Date) => onViewChange('Daily', date)}
              heatmap={analytics?.calendar_heatmap ?? {}}
            />
          </GlassPanel>

          {/* Card Hoje */}
          <GlassCard radius="35px" revealDelay={140} className="p-7">
            <div className="flex items-center gap-4">
              <span className="text-3xl select-none">⚙️</span>
              <div>
                <p className="text-white text-2xl font-black">Hoje</p>
                <p className="text-white/40 text-sm">Sua colmeia está pronta para novos voos.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <style>{`
        @keyframes beeFloat {
          0%, 100% { transform: translateY(-50%) rotate(-5deg); }
          50%       { transform: translateY(calc(-50% - 10px)) rotate(5deg); }
        }
        @keyframes beeFly {
          0%   { transform: translateY(-50%) rotate(-10deg) scale(1.0); }
          25%  { transform: translateY(calc(-50% - 14px)) rotate(10deg) scale(1.06); }
          50%  { transform: translateY(-50%) rotate(-4deg) scale(1.0); }
          75%  { transform: translateY(calc(-50% + 8px)) rotate(8deg) scale(1.05); }
          100% { transform: translateY(-50%) rotate(-10deg) scale(1.0); }
        }
      `}</style>
    </div>
  );
}
