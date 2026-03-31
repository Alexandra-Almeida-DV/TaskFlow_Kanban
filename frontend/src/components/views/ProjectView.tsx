import { Plus, Trash2, X, Check, Book, Briefcase, GraduationCap, Zap, TrendingUp, LucideIcon } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import api from '../../../../backend/app/scr/services/api';

// --- Interfaces de Tipagem ---
interface MetaData {
  current_page?: number;
  total_pages?: number;
  target_value?: number;
  current_value?: number;
  unit?: string;
  streak?: number;
  last_done?: string | null;
  start_date?: string;
  end_date?: string;
  insights?: string;
  notes?: string;
  purpose?: string; 
}

interface Project {
  id: number;
  name: string;
  type: string;
  progress: number;
  meta_data: MetaData;
}

type TypeConfig = { icon: LucideIcon; color: string; bg: string; };

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados do Formulário
  const [name, setName] = useState('');
  const [type, setType] = useState('projeto');
  const [totalPages, setTotalPages] = useState(0);
  const [targetValue, setTargetValue] = useState(0);
  const [unit, setUnit] = useState('R$');
  
  // Estados Dinâmicos
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newGoalPurpose, setNewGoalPurpose] = useState('');

  const typeConfig: Record<string, TypeConfig> = {
    projeto: { icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-100' },
    leitura: { icon: Book, color: 'text-orange-500', bg: 'bg-orange-100' },
    estudo: { icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-100' },
    habito: { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    meta: { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100' },
    PROJECT: { icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-100' },
    READING: { icon: Book, color: 'text-orange-500', bg: 'bg-orange-100' },
    STUDY: { icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-100' },
    HABIT: { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    GOAL: { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100' },
  };

  const carregarProjetos = useCallback(async () => {
    try {
      const response = await api.get('/projects/');
      setProjects(response.data);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (isMounted) await carregarProjetos();
    };
    fetchData();
    return () => { isMounted = false; };
  }, [carregarProjetos]);

  const handleSaveProject = async () => {
    if (!name.trim()) return;

    let meta_data: MetaData = {};
    const lowerType = type.toLowerCase();

    if (lowerType === 'leitura') {
      meta_data = { 
        current_page: 0, 
        total_pages: totalPages, 
        start_date: newStartDate, 
        notes: newNotes 
      };
    } else if (lowerType === 'projeto') {
      meta_data = { 
        start_date: newStartDate, 
        end_date: newEndDate, 
        insights: newDescription 
      };
    } else if (lowerType === 'meta') {
      meta_data = { 
        current_value: 0, 
        target_value: targetValue, 
        unit: unit,
        start_date: newStartDate,
        end_date: newEndDate,
        purpose: newGoalPurpose 
      };
    } else if (lowerType === 'habito') {
      meta_data = { 
      streak: 0, 
      last_done: null,
      target_value: habitGoal, 
      unit: 'dias'
      };
    }

    try {
      const response = await api.post('/projects/', { 
        name, 
        type: lowerType, 
        meta_data, 
        description: newDescription || newGoalPurpose || "" 
      });
      
      setProjects(prev => [response.data, ...prev]);
      
      // Resetar tudo
      setIsModalOpen(false);
      setName('');
      setType('projeto');
      setTotalPages(0);
      setTargetValue(0);
      setUnit('R$');
      setNewStartDate('');
      setNewEndDate('');
      setNewDescription('');
      setNewNotes('');
      setNewGoalPurpose('');
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const [habitGoal, setHabitGoal] = useState(21);
  

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative min-h-screen">
      <h2 className="text-3xl font-black text-[#5D5A88] mb-10">Projetos & Metas</h2>

      <div className="flex flex-wrap gap-8">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative w-72 h-72 mt-8 rounded-tr-[40px] rounded-br-[40px] rounded-bl-[40px] border-2 border-dashed border-white/40 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center text-[#5D5A88] hover:bg-white/20 hover:border-[#cff178] transition-all group active:scale-95 shadow-sm"
        >
          <div className="absolute -top-[34px] left-[-2px] h-9 w-32 border-t-2 border-l-2 border-r-2 border-dashed border-white/40 group-hover:bg-white/10 rounded-t-2xl group-hover:border-[#cff178] transition-all" />
          <div className="p-5 bg-white/20 rounded-full group-hover:bg-[#cff178] group-hover:text-[#5D5A88] transition-all shadow-inner">
            <Plus size={36} />
          </div>
          <span className="mt-4 font-black uppercase text-[11px] tracking-[0.2em] opacity-60">Nova Iniciativa</span>
        </button>

        {projects.map((project) => {
          const Config = typeConfig[project.type] || typeConfig['projeto'];
          const Icon = Config.icon;
          return (
            <div key={project.id} className="w-72 h-72 p-8 rounded-[40px] bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl flex flex-col justify-between hover:scale-105 transition-all group relative">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${Config.bg} ${Config.color}`}><Icon size={20} /></div>
                <button onClick={() => deleteProject(project.id)} className="text-[#8A88B6] hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
              </div>
              
              <div className="mt-4">
                <h3 className="text-[#5D5A88] font-black text-xl mb-1 truncate">{project.name}</h3>
                <p className="text-[10px] font-black text-[#8A88B6] uppercase tracking-widest opacity-70">{project.type}</p>
              </div>

              <div className="space-y-3">
                <div className="h-1.5 w-full bg-[#5D5A88]/5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${Config.color.replace('text', 'bg')}`} style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#5D5A88]/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-[#F4F1EA] w-full max-w-lg min-h-[450px] rounded-tr-[40px] rounded-br-[40px] rounded-bl-[40px] shadow-2xl p-10 flex flex-col gap-6 border border-white">
            <div className="absolute -top-10 left-0 h-12 w-40 bg-[#F4F1EA] rounded-t-3xl flex items-center justify-center border-t border-l border-white/50 shadow-sm">
              <span className="font-black text-[#5D5A88] text-[10px] uppercase tracking-widest">Iniciativa</span>
            </div>
            
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-[#5D5A88]">Novo Objetivo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8A88B6] hover:rotate-90 transition-transform"><X size={24} /></button>
            </div>

            <div className="space-y-4">
              <input 
                placeholder="Nome do objetivo..." 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full p-5 rounded-3xl bg-white border-none shadow-sm font-bold text-[#5D5A88]" 
              />
              
              <select 
                value={type} 
                onChange={e => setType(e.target.value)} 
                className="w-full p-5 rounded-3xl bg-white/50 border-none text-[#5D5A88] font-bold"
              >
                <option value="projeto">🎯 Projeto</option>
                <option value="leitura">📚 Leitura</option>
                <option value="meta">💡 Meta</option>
                <option value="habito">💪 Hábito</option>
              </select>

              {type === 'projeto' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Início</p>
                      <input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Previsão Fim</p>
                      <input type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold" />
                    </div>
                  </div>
                  <textarea 
                    placeholder="O que será necessário? Insights do projeto..." 
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    className="w-full p-5 rounded-3xl bg-white border-none shadow-sm font-medium text-[#5D5A88] min-h-[100px] resize-none"
                  />
                </div>
              )}

              {type === 'leitura' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Início da Leitura</p>
                      <input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold" />
                    </div>
                    <input type="number" placeholder="Total Pgs" className="w-32 p-5 rounded-3xl bg-white text-[#5D5A88] font-bold border-none shadow-sm" onChange={e => setTotalPages(Number(e.target.value))} />
                  </div>
                  <textarea 
                    placeholder="Notas importantes sobre este livro..." 
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    className="w-full p-5 rounded-3xl bg-white border-none shadow-sm font-medium text-[#5D5A88] min-h-[100px] resize-none"
                  />
                </div>
              )}

              {type === 'meta' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex gap-3">
                    <div className="flex-[2]">
                      <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Alvo</p>
                      <input type="number" placeholder="Ex: 5000" className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold" onChange={e => setTargetValue(Number(e.target.value))} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Unidade</p>
                      <input value={unit} onChange={e => setUnit(e.target.value)} className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-center font-bold text-[#5D5A88]" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Começa em</p>
                      <input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} className="w-full p-4 rounded-2xl bg-white/80 border-none text-[#5D5A88] font-bold" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Até quando?</p>
                      <input type="date" value={newEndDate} onChange={e => setNewEndDate(e.target.value)} className="w-full p-4 rounded-2xl bg-white/80 border-none text-[#5D5A88] font-bold" />
                    </div>
                  </div>
                  <textarea 
                    placeholder="Para que serve essa meta?" 
                    value={newGoalPurpose}
                    onChange={e => setNewGoalPurpose(e.target.value)}
                    className="w-full p-5 rounded-3xl bg-white border-none shadow-sm font-medium text-[#5D5A88] min-h-[100px] resize-none"
                  />
                </div>
              )}

             {type === 'habito' && (
  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
    <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Sugestões de Rotina</p>
    
    <div className="grid grid-cols-2 gap-2">
      {[
        { id: 'skincare', label: '✨ Skincare', name: 'Skincare (Manhã/Noite)' },
        { id: 'agua', label: '💧 Beber Água', name: 'Beber Água (Meta Diária)' },
        { id: 'organizar', label: '🧹 Organizar Ambiente', name: 'Organizar ambiente (5–10 min/dia)' },
        { id: 'cabelo', label: '💇‍♀️ Cuidar do Cabelo', name: 'Cuidar do cabelo' },
        { id: 'looks', label: '👗 Planejar Looks', name: 'Planejar looks' },
        { id: 'matinal', label: '☀️ Rotina Matinal', name: 'Rotina matinal consistente' },
        { id: 'journaling', label: '✍️ Journaling', name: 'Journaling (5-10 min)' },
        { id: 'offline', label: '📱 Tempo Offline', name: 'Tempo Offline (Sem Tela)' },
      ].map((habit) => (
        <button
          key={habit.id}
          type="button"
          onClick={() => setName(habit.name)}
          className={`p-3 rounded-2xl text-[10px] font-bold transition-all border-2 ${
            name === habit.name 
              ? 'bg-[#cff178] border-[#cff178] text-[#5D5A88]' 
              : 'bg-white border-transparent text-[#8A88B6] hover:border-[#cff178]/50 shadow-sm'
          }`}
        >
          {habit.label}
        </button>
      ))}
    </div>

    {/* Nível de Consistência / Meta de Dias */}
    <div className="bg-white/50 p-4 rounded-3xl border border-white/60">
      <div className="flex justify-between items-center mb-2">
        <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2">Meta de Consistência</p>
        <span className="text-xs font-black text-[#5D5A88] bg-[#cff178] px-2 py-0.5 rounded-full">
          {habitGoal} dias
        </span>
      </div>
      <input 
        type="range" 
        min="7" 
        max="100" 
        value={habitGoal} 
        onChange={(e) => setHabitGoal(Number(e.target.value))}
        className="w-full h-2 bg-[#5D5A88]/10 rounded-lg appearance-none cursor-pointer accent-[#cff178]"
      />
      <div className="flex justify-between text-[9px] font-bold text-[#8A88B6] mt-1 px-1">
        <span>7 DIAS (FOCO)</span>
        <span>21 DIAS (HÁBITO)</span>
        <span>100 DIAS (ESTILO DE VIDA)</span>
      </div>
    </div>

    <input 
      placeholder="Ou dê um nome personalizado..." 
      value={name} 
      onChange={e => setName(e.target.value)} 
      className="w-full p-5 rounded-3xl bg-white border-none shadow-sm font-bold text-[#5D5A88]" 
    />
  </div>
)} 
            </div>

            <button 
              onClick={handleSaveProject} 
              className="w-full py-5 bg-[#cff178] text-[#5D5A88] rounded-[30px] font-black flex items-center justify-center gap-2 shadow-lg shadow-[#cff178]/30 hover:scale-[1.02] active:scale-95 transition-all mt-auto"
            >
              <Check size={20} /> Criar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}