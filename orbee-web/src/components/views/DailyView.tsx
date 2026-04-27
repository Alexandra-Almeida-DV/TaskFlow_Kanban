import React, { useState } from 'react';
import { Clock, Plus, Circle, CheckCircle2, Trash2, AlignLeft, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task } from '../../types/Tasks';

interface DailyViewProps {
  date:     Date;
  tasks:    Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export function DailyView({ date, tasks, setTasks }: DailyViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title:    '',
    date:     format(date, 'yyyy-MM-dd'),
    time:     '',
    category: 'Geral',
  });

  const handleSaveTask = () => {
    if (!newTask.title || !newTask.time) return;

    // ✅ priority é obrigatório no tipo Task — usamos 'medium' como padrão
    const taskToAdd: Task = {
      id:       Date.now(),
      ...newTask,
      category: newTask.category ?? null,
      completed: false,
      priority:  'medium',
    };

    setTasks(prev =>
      [...prev, taskToAdd].sort((a, b) => a.time.localeCompare(b.time))
    );
    setIsModalOpen(false);
    setNewTask({ title: '', date: newTask.date, time: '', category: 'Geral' });
  };

  const toggleTask = (id: number) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const deleteTask = (id: number) =>
    setTasks(prev => prev.filter(t => t.id !== id));

  const selectedDateStr  = format(date, 'yyyy-MM-dd');
  const filteredTasks    = tasks.filter(task => task.date === selectedDateStr);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-4xl mx-auto px-4 py-8 md:p-8">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="flex items-center gap-4 md:gap-6">
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
              {format(date, 'dd')}
            </h2>
            <div className="flex flex-col border-l-2 border-[#cff178] pl-4 md:pl-6 py-1">
              <span className="text-[#cff178] font-black text-xl md:text-2xl uppercase tracking-widest">
                {format(date, 'MMMM', { locale: ptBR })}
              </span>
              <span className="text-white/40 font-bold text-base md:text-lg uppercase">
                {format(date, 'eeee', { locale: ptBR })}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-[#cff178] hover:bg-[#bde85d] text-[#5D5A88] px-8 py-4 md:px-10 md:py-5 rounded-2xl md:rounded-[25px] font-black flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#cff178]/10"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
            <span className="text-xs md:text-sm uppercase tracking-wider">Nova Tarefa</span>
          </button>
        </header>

        {/* LISTA */}
        <div className="relative space-y-4">
          <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-white/5" />

          {filteredTasks.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[#cff178] italic text-xl md:text-2xl font-light opacity-60">
                Nada por aqui... bora descansar? ✨
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="relative flex items-center group">
                {/* Checkbox */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-10 h-10 min-w-[40px] rounded-full border-4 flex items-center justify-center z-10 transition-all duration-300
                    ${task.completed
                      ? 'bg-[#cff178] border-[#cff178] shadow-[0_0_15px_rgba(207,241,120,0.3)]'
                      : 'bg-[#7C7AB8] border-white/10 hover:border-[#cff178]/50'}`}
                >
                  {task.completed
                    ? <CheckCircle2 size={20} className="text-[#5D5A88]" />
                    : <Circle size={20} className="text-white/10 group-hover:text-white/30" />}
                </button>

                {/* Card */}
                <div className={`ml-4 md:ml-8 flex-1 p-4 md:p-6 rounded-[25px] md:rounded-[35px] flex items-center justify-between transition-all duration-300 border
                  ${task.completed
                    ? 'bg-white/5 border-transparent opacity-40 grayscale'
                    : 'bg-white/10 border-white/5 hover:bg-white/15 hover:border-white/10 md:hover:translate-x-2'}`}
                >
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <div className="flex items-center gap-2 text-[#cff178] font-black text-[9px] md:text-[10px] uppercase tracking-widest">
                      <Clock size={12} strokeWidth={3} />
                      {task.time}
                    </div>
                    <h3 className={`text-base md:text-xl font-bold text-white tracking-tight truncate ${task.completed ? 'line-through decoration-2' : ''}`}>
                      {task.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="ml-2 text-white/10 hover:text-red-400 hover:bg-red-400/10 p-2 md:p-3 rounded-2xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#5D5A88]/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xl p-6 md:p-10 rounded-[30px] md:rounded-[50px] shadow-2xl flex flex-col gap-6 md:gap-8 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-[#5D5A88]">Agendar Tarefa</h3>
                  <p className="text-[#8A88B6] text-xs md:text-sm">O que a OrBee vai te lembrar?</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#8A88B6] hover:rotate-90 transition-transform">
                  <X className="w-6 h-6 md:w-7 md:h-7" />
                </button>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="relative">
                  <AlignLeft className="absolute left-5 top-5 text-[#8A88B6]" size={20} />
                  <textarea
                    className="w-full h-28 md:h-36 pl-14 md:pl-16 pr-6 md:pr-8 py-5 md:py-6 rounded-2xl md:rounded-[35px] bg-[#5D5A88]/5 border-2 border-transparent focus:border-[#cff178] focus:bg-white text-[#5D5A88] font-bold text-base md:text-lg outline-none resize-none"
                    placeholder="Descreva sua missão..."
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="time"
                    required
                    className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[25px] bg-[#5D5A88]/5 border-2 border-transparent focus:border-[#cff178] text-[#5D5A88] font-bold outline-none"
                    value={newTask.time}
                    onChange={e => setNewTask({ ...newTask, time: e.target.value })}
                  />
                  <div className="flex items-center justify-center bg-[#5D5A88]/5 rounded-xl md:rounded-[25px] text-[#8A88B6] font-bold text-sm py-4">
                    {format(date, 'dd/MM/yyyy')}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveTask}
                className="w-full py-5 md:py-6 bg-[#cff178] hover:bg-[#bde85d] text-[#5D5A88] rounded-2xl md:rounded-[30px] font-black text-base md:text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Plus size={24} /> Confirmar na OrBee
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
