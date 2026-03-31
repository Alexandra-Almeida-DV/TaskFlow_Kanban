import { Clock, Plus, Circle, CheckCircle2, Trash2, CalendarIcon, AlignLeft, X } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Task {
  id: number;
  title: string;
  date: string;
  time: string;
  category: string;
  completed: boolean;
}

interface DailyViewProps {
  date: Date;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export function DailyView({ date, tasks, setTasks }: DailyViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    date: format(date, 'yyyy-MM-dd'),
    time: '',
    category: 'Geral'
  });

  const handleSaveTask = () => {
    if (!newTask.title || !newTask.time) return;
    const taskToAdd: Task = { id: Date.now(), ...newTask, completed: false };
    setTasks(prev => [...prev, taskToAdd].sort((a, b) => a.time.localeCompare(b.time)));
    setIsModalOpen(false);
    setNewTask({ title: '', date: newTask.date, time: '', category: 'Geral' });
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const selectedDateStr = format(date, 'yyyy-MM-dd');
  const filteredTasks = tasks.filter(task => task.date === selectedDateStr);

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between mb-12 text-white">
        <div className="flex items-center gap-4">
          <h2 className="text-6xl font-black">{format(date, 'dd')}</h2>
          <div className="flex flex-col">
            <span className="text-[#cff178] font-black text-xl uppercase">{format(date, 'MMMM', { locale: ptBR })}</span>
            <span className="text-white/40 font-bold text-sm uppercase">{format(date, 'eeee', { locale: ptBR })}</span>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-[#cff178] text-[#5D5A88] px-8 py-4 rounded-[25px] font-black flex items-center gap-2">
          <Plus size={20} /> Nova Task
        </button>
      </header>

      <div className="space-y-6 font-light ">
        {filteredTasks.length === 0 ? (
          <p className="text-[#cff178] italic ml-6 text-xl">Nenhum compromisso para este dia... aproveite! ✨</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="relative flex items-center group">
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-10 h-10 rounded-full border-4 flex items-center justify-center z-10 ${task.completed ? 'bg-[#cff178] border-[#cff178]' : 'bg-[#7C7AB8] border-white/10'}`}
              >
                {task.completed ? <CheckCircle2 size={20} className="text-[#5D5A88]" /> : <Circle size={20} className="text-white/20" />}
              </button>
              <div className={`ml-6 flex-1 p-6 rounded-[30px] flex items-center justify-between ${task.completed ? 'bg-white/5 opacity-40' : 'bg-white/15'}`}>
                <div className="flex flex-col">
                  <span className="text-[#cff178] font-black text-xs flex items-center gap-1"><Clock size={12} /> {task.time}</span>
                  <h3 className={`text-xl font-bold text-white ${task.completed ? 'line-through' : ''}`}>{task.title}</h3>
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-white/20 hover:text-red-400 p-2"><Trash2 size={18} /></button>
              </div>
            </div>
          ))
        )}
      </div>

{/* MODAL DE AGENDAMENTO ESTILIZADO */}
{isModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#5D5A88]/60 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white/95 w-full max-w-xl p-10 rounded-[50px] shadow-2xl flex flex-col gap-8 animate-in zoom-in-95 duration-300">
      
      {/* Header do Modal */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="text-2xl font-black text-[#5D5A88] tracking-tight">Agendar Tarefa</h3>
          <p className="text-[#8A88B6] text-sm font-medium">O que a OrBee vai te lembrar de fazer?</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(false)} 
          className="p-2 text-[#8A88B6] hover:bg-[#5D5A88]/5 rounded-full transition-transform hover:rotate-90"
        >
          <X size={28} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Campo de Descrição (Textarea) */}
        <div className="relative group">
          <AlignLeft className="absolute left-6 top-6 text-[#8A88B6] group-focus-within:text-[#5D5A88] transition-colors" size={22} />
          <textarea 
            className="w-full h-36 pl-16 pr-8 py-6 rounded-[35px] bg-[#5D5A88]/5 border-2 border-transparent focus:border-[#cff178] focus:bg-white text-[#5D5A88] font-bold text-lg placeholder:text-[#8A88B6]/50 placeholder:font-medium transition-all outline-none resize-none shadow-inner"
            placeholder="Descreva aqui sua missão..."
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
          />
        </div>

        {/* Inputs de Data e Hora */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <CalendarIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8A88B6] group-focus-within:text-[#5D5A88] transition-colors" size={20} />
            <input 
              type="date" 
              className="w-full pl-16 pr-6 py-5 rounded-[25px] bg-[#5D5A88]/5 border-2 border-transparent focus:border-[#cff178] focus:bg-white text-[#5D5A88] font-bold transition-all outline-none"
              value={newTask.date} 
              onChange={(e) => setNewTask({...newTask, date: e.target.value})} 
            />
          </div>
          <div className="relative group">
            <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8A88B6] group-focus-within:text-[#5D5A88] transition-colors" size={20} />
            <input 
              type="time" 
              className="w-full pl-16 pr-6 py-5 rounded-[25px] bg-[#5D5A88]/5 border-2 border-transparent focus:border-[#cff178] focus:bg-white text-[#5D5A88] font-bold transition-all outline-none"
              value={newTask.time} 
              onChange={(e) => setNewTask({...newTask, time: e.target.value})} 
            />
          </div>
        </div>
      </div>

      {/* Botão de Ação */}
      <button 
        onClick={handleSaveTask} 
        className="w-full py-6 bg-[#cff178] hover:bg-[#bde85d] text-[#5D5A88] rounded-[30px] font-black text-lg shadow-xl shadow-[#cff178]/20 transition-all active:scale-95 flex items-center justify-center gap-3 group"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform" />
        <span>Confirmar na OrBee</span>
      </button>
    </div>
  </div>
)}
  </div>
);
}
