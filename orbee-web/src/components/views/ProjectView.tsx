import { Plus, Trash2, X, Check, Book, Briefcase, GraduationCap, Zap, TrendingUp, LucideIcon, FileCog } from 'lucide-react';
import { useEffect, useCallback, useState } from 'react';
import { api } from '../../services/api';
import { useProjectForm, Project } from '../../hooks/useProjectForm';
// Subcomponentes
import { ProjetoFields } from '../ProjectForms/PojetoFields';
import { LeituraFields } from '../ProjectForms/LeituraFields';
import { MetaFields } from '../ProjectForms/MetaFields';
import { HabitoFields } from '../ProjectForms/HabitoFields';
import { EstudoFields } from '../ProjectForms/EstudoFields';

type TypeConfig = { icon: LucideIcon; color: string; bg: string; };

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);

  const typeConfig: Record<string, TypeConfig> = {
    projeto: { icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-100' },
    leitura: { icon: Book, color: 'text-orange-500', bg: 'bg-orange-100' },
    estudo: { icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-100' },
    habito: { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    meta: { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100' }
  };

  const carregarProjetos = useCallback(async () => {
    try {
      const response = await api.get('/projects/');
      setProjects(response.data);
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  }, []);

  const { states, actions, progress } = useProjectForm(carregarProjetos);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await api.get('/projects/');
        if (isMounted) setProjects(response.data);
      } catch (error) {
        console.error("Erro na busca inicial:", error);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const deleteProject = async (id: number) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const handleCheckIn = async (projectId: string | number) => {
    try {
      const id = typeof projectId === 'string' ? parseInt(projectId) : projectId;
      await api.post(`/projects/${id}/checkin`);
      await carregarProjetos();
    } catch (error) {
      console.error("Erro ao realizar check-in:", error);
    }
  };

  const renderFormFields = () => {
    switch (states.type) {
      case 'projeto':
        return <ProjetoFields {...states} {...actions} projectProgress={progress.projectProgress} />;
      case 'leitura':
        return <LeituraFields {...states} {...actions} readingProgress={progress.readingProgress} />;
      case 'meta':
        return <MetaFields {...states} {...actions} metaProgress={progress.metaProgress} />;
      case 'habito':
        return <HabitoFields name={states.name} setName={actions.setName} habitGoal={states.habitGoal} selectedProject={states.selectedProject} setHabitGoal={actions.setHabitGoal} handleCheckIn={handleCheckIn} />;
      default:
        return null;
      case 'estudo':
      return (
        <EstudoFields 
          subject={states.category} 
          setSubject={actions.setCategory}
          studyHours={states.currentValue} 
          setStudyHours={actions.setCurrentValue}
          targetHours={states.targetValue} 
          setTargetHours={actions.setTargetValue}
          newStartDate={states.newStartDate}
          setNewStartDate={actions.setNewStartDate}
          newEndDate={states.newEndDate}
          setNewEndDate={actions.setNewEndDate}
          newDescription={states.newDescription}
          setNewDescription={actions.setNewDescription}
          studyProgress={progress.metaProgress} 
        />
      );  
    }
  };

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative min-h-screen">
      <header className="flex items-center gap-4 mb-10">
        <div className="bg-[#cff178] p-3 rounded-2xl shadow-lg shadow-orange-100 flex-shrink-0">
          <FileCog className="text-white" size={28} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-[#5D5A88]">
            Meus <span className="text-[#cff178]">Projetos</span>
          </h2>
          <p className="text-[#8A88B6] font-bold text-sm uppercase tracking-widest">
            Gerencie seu fluxo de trabalho
          </p>
        </div>
      </header>

      {/* CONTAINER ALINHADO */}
      <div className="flex flex-wrap gap-8 items-start">
        
        {/* CARD CRIADOR (PASTA PONTILHADA) */}
        <button
          onClick={() => actions.setIsModalOpen(true)}
          className="relative w-72 h-72 mt-9 rounded-[40px] rounded-tl-none border-2 border-dashed border-white/40 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center text-[#5D5A88] hover:bg-white/20 hover:border-[#cff178] transition-all group active:scale-95 shadow-sm"
        >
          {/* Aba do card criador */}
          <div className="absolute top-0 left-[-2px] h-9 w-32 border-t-2 border-l-2 border-r-2 border-dashed border-white/40 group-hover:bg-white/10 rounded-t-2xl group-hover:border-[#cff178] transition-all -translate-y-full" />
          
          <div className="p-5 bg-white/20 rounded-full group-hover:bg-[#cff178] group-hover:text-[#5D5A88] transition-all shadow-inner">
            <Plus size={36} />
          </div>
          <span className="mt-4 font-black uppercase text-[11px] tracking-[0.2em] opacity-60">Nova Iniciativa</span>
        </button>

        {/* LISTA DE PROJETO */}
        {projects.map((project) => {
          const lowerType = project.type.toLowerCase();
          const Config = typeConfig[lowerType] || typeConfig['projeto'];
          const Icon = Config.icon;

          return (
            <div
              key={project.id}
              onClick={() => actions.handleOpenEdit(project)}
              className="relative w-72 h-72 mt-9 rounded-[40px] rounded-tl-none bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl flex flex-col justify-between hover:scale-105 transition-all group cursor-pointer p-8"
            >
              {/* ABA DA PASTA DO PROJETO */}
              <div className={`absolute top-0 left-[-1px] h-9 w-32 ${Config.bg} opacity-80 rounded-t-2xl border-t border-l border-r border-white/50 -translate-y-full flex items-center justify-center`}>
                 <span className={`text-[9px] font-black uppercase tracking-tighter ${Config.color}`}></span>
              </div>

              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${Config.bg} ${Config.color}`}><Icon size={20} /></div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                  className="text-[#8A88B6] hover:text-red-400 transition-colors z-10"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-4">
                <h3 className="text-[#5D5A88] font-black text-xl mb-1 truncate">{project.name}</h3>
                <p className="text-[10px] font-black text-[#8A88B6] uppercase tracking-widest opacity-70">{project.type}</p>
              </div>

              <div className="space-y-3">
                <div className="h-1.5 w-full bg-[#5D5A88]/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${Config.color.replace('text', 'bg')}`} 
                    style={{ width: `${project.progress}%` }} 
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
      {states.isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#5D5A88]/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-[#F4F1EA] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-tr-[40px] rounded-br-[40px] rounded-bl-[40px] shadow-2xl p-10 flex flex-col gap-6 border border-white">
            
            <div className="absolute top-0 left-0 h-12 w-40 bg-[#F4F1EA] rounded-t-3xl flex items-center justify-center border-t border-l border-white/50 shadow-sm -translate-y-full">
              <span className="font-black text-[#5D5A88] text-[10px] uppercase tracking-widest">Iniciativa</span>
            </div>
            
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-[#5D5A88]">
                {states.selectedProject ? 'Detalhes do Objetivo' : 'Novo Objetivo'}
              </h3>
              <button onClick={actions.closeModal} className="text-[#8A88B6] hover:rotate-90 transition-transform"><X size={24} /></button>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Nome do objetivo..."
                value={states.name}
                onChange={e => actions.setName(e.target.value)}
                className="w-full p-5 rounded-3xl bg-white border-none shadow-sm font-bold text-[#5D5A88] outline-none"
              />

              <select
                value={states.type}
                onChange={e => actions.setType(e.target.value)}
                className="w-full p-5 rounded-3xl bg-white/50 border-none text-[#5D5A88] font-bold outline-none"
              >
                <option value="projeto">🎯 Projeto</option>
                <option value="leitura">📚 Leitura</option>
                <option value="meta">💡 Meta</option>
                <option value="habito">💪 Hábito</option>
                <option value="estudo">🎓 Estudo</option>
              </select>

              {renderFormFields()}
            </div>

            <button
              onClick={actions.handleSaveProject}
              className="w-full py-5 bg-[#cff178] text-[#5D5A88] rounded-[30px] font-black flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-auto"
            >
              {states.selectedProject ? <Check size={20} /> : <Plus size={20} />}
              {states.selectedProject ? 'Salvar Alterações' : 'Criar Agora'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}