import { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Timer, Zap, Quote } from 'lucide-react';
import { Calendar } from '../Calendar';
import { ViewType } from '../../types/View';
import { getDailyQuote } from '../../data/quotes';
import api from '../../../../backend/app/scr/services/api'; 

interface Task {
  id: number;
  title: string;
  date: string;
  time: string;
  category: string;
  completed: boolean;
}

interface HomeViewProps {
  onViewChange: (view: ViewType, date?: Date) => void;
  tasks?: Task[]; // Tornamos opcional pois agora buscamos do banco
}

export function HomeView({ onViewChange }: HomeViewProps) {
  const hojeStr = new Date().toISOString().split('T')[0];
  
  // ESTADOS
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [listaTarefas, setListaTarefas] = useState<Task[]>([]);

  // LÓGICA DA FRASE
  const fraseDoDia = useMemo(() => getDailyQuote(), []);

  // BUSCA DE DADOS NO BACKEND (PERSISTÊNCIA)
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const response = await api.get('/tasks/');
        setListaTarefas(response.data); 
      } catch (error) {
        console.error("Erro ao buscar dados do banco:", error);
      }
    };
    carregarDados();
  }, []);

  // TIMER POMODORO
  useEffect(() => {
    let interval: number | undefined;
    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            alert("Tempo de foco encerrado! 🐝");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive]);

  // FORMATADORES E FILTROS
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const tarefasDeHoje = listaTarefas.filter((t) => t.date === hojeStr);
  const total = tarefasDeHoje.length;
  const concluidas = tarefasDeHoje.filter((t) => t.completed).length;
  const pendentes = total - concluidas;
  const proximoCompromisso = tarefasDeHoje
    .filter((t) => !t.completed)
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  return (
    <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 items-stretch">
      
      {/* COLUNA ESQUERDA: Frase + Resumo */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
        
        {/* CARD FRASE MOTIVACIONAL */}
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

        {/* CARD RESUMO INTELIGENTE */}
        <div className="flex-[1.5] bg-white/10 backdrop-blur-md rounded-[40px] p-8 border border-white/10 shadow-2xl flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-white/60 font-bold text-xs uppercase tracking-widest mb-1">Resumo Inteligente</h3>
            <h4 className="text-white text-3xl font-black tracking-tight">Sua OrBee hoje</h4>
          </div>

          {/* Próximo Compromisso */}
          <div 
            className="bg-[#cff178]/10 border border-[#cff178]/20 p-6 rounded-[35px] flex items-center justify-between group cursor-pointer hover:bg-[#cff178]/20 transition-all active:scale-95"
            onClick={() => onViewChange('Daily', new Date())}
          >
            <div className="flex flex-col gap-1">
              <span className="text-[#cff178] font-black text-[10px] uppercase tracking-wider flex items-center gap-2">
                <Zap size={14} /> {proximoCompromisso ? `Próximo às ${proximoCompromisso.time}` : "Sem compromissos"}
              </span>
              <h5 className="text-white font-bold text-xl leading-tight">
                {proximoCompromisso ? proximoCompromisso.title : "Tudo em ordem!"}
              </h5>
            </div>
            <div className="bg-[#cff178] text-[#5D5A88] px-4 py-2 rounded-2xl font-black text-lg shadow-lg">
              {proximoCompromisso ? proximoCompromisso.time : "--:--"}
            </div>
          </div>

          {/* Grid de Pendentes e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-5 rounded-[30px] border border-white/5 flex flex-col items-center justify-center">
              <p className="text-white/40 text-[10px] font-bold uppercase mb-1">Pendentes</p>
              <p className="text-white text-4xl font-black">{pendentes}</p>
            </div>
            <div className="bg-white/5 p-5 rounded-[30px] border border-white/5 flex flex-col items-center justify-center text-center">
              <p className="text-white/40 text-[10px] font-bold uppercase mb-1">Status do Dia</p>
              <div className="flex flex-col items-center text-[#cff178]">
                <span className="text-xl font-black leading-tight">{concluidas} de {total}</span>
                <span className="text-white/20 text-[10px] font-bold uppercase">concluídas</span>
              </div>
            </div>
          </div>

          {/* Botões Foco e Novo */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`p-4 rounded-[25px] flex items-center justify-center gap-3 transition-all active:scale-95 border border-white/10 ${
                isActive ? 'bg-[#cff178]/20 border-[#cff178]/50' : 'bg-[#5D5A88]'
              }`}
            >
              <Timer size={18} className="text-[#cff178]" />
              <span className="text-white font-black text-sm">{isActive ? formatTime(seconds) : "Foco"}</span>
            </button>
            <button 
              onClick={() => onViewChange('Daily', new Date())}
              className="bg-[#cff178] hover:bg-[#bde85d] p-4 rounded-[25px] flex items-center justify-center gap-3 transition-all active:scale-95 text-[#5D5A88]"
            >
              <PlusCircle size={18} />
              <span className="font-black text-sm">Novo</span>
            </button>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: CALENDÁRIO */}
      <div className="col-span-12 lg:col-span-7 bg-white/5 backdrop-blur-sm rounded-[45px] p-1 border border-white/10 flex flex-col h-full">
        <div className="flex-1 p-2">
          <Calendar onDateClick={(date: Date) => onViewChange('Daily', date)} />
        </div>
      </div>
    </div>
  );
}