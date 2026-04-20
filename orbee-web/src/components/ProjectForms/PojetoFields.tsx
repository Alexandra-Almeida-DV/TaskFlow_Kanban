import React from 'react';
import { Plus, X, ArrowUpRight } from 'lucide-react';
interface ProjetoFieldsProps {
  category: string;
  setCategory: (val: string) => void;
  priority: string;
  setPriority: (val: string) => void;
  newStartDate: string;
  setNewStartDate: (val: string) => void;
  newEndDate: string;
  setNewEndDate: (val: string) => void;
  newDescription: string;
  setNewDescription: (val: string) => void;
  // Estados de Links
  links: { id: string; url: string }[];
  setLinks: (links: { id: string; url: string }[]) => void;
  newLinkUrl: string;
  setNewLinkUrl: (val: string) => void;
  // Estados de Tarefas
  tasks: { id: string; text: string; completed: boolean }[];
  setTasks: (tasks: { id: string; text: string; completed: boolean }[]) => void;
  newTaskText: string;
  setNewTaskText: (val: string) => void;
  projectProgress: number;
}

export const ProjetoFields: React.FC<ProjetoFieldsProps> = ({
  category, setCategory,
  priority, setPriority,
  newStartDate, setNewStartDate,
  newEndDate, setNewEndDate,
  newDescription, setNewDescription,
  links, setLinks,
  newLinkUrl, setNewLinkUrl,
  tasks, setTasks,
  newTaskText, setNewTaskText,
  projectProgress
}) => {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
      
      {/* Categoria e Prioridade */}
      <div className="flex gap-3">
        <div className="flex-1">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Categoria</p>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold outline-none"
          >
            <option value="trabalho">💻 Trabalho</option>
            <option value="estudos">🎓 Estudos</option>
            <option value="pessoal">👤 Pessoal</option>
            <option value="saúde">🧘‍♀️ Saúde</option>
            <option value="criativo">🎨 Criativo</option>
          </select>
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Prioridade</p>
          <select 
            value={priority} 
            onChange={e => setPriority(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold outline-none"
          >
            <option value="baixa">Baixa</option>
            <option value="média">Média</option>
            <option value="alta">Alta 🔥</option>
          </select>
        </div>
      </div>

      {/* Datas */}
      <div className="flex gap-3">
        <div className="flex-1">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Início</p>
          <input 
            type="date" 
            value={newStartDate} 
            onChange={e => setNewStartDate(e.target.value)} 
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold" 
          />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Previsão Fim</p>
          <input 
            type="date" 
            value={newEndDate} 
            onChange={e => setNewEndDate(e.target.value)} 
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold" 
          />
        </div>
      </div>

      {/* Links de Referência */}
      <div className="space-y-3">
        <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2">Links Úteis / Referências</p>
        
        <div className="flex gap-2">
          <input 
            placeholder="Cole qualquer URL aqui (Figma, Notion, Docs...)" 
            value={newLinkUrl} 
            onChange={e => setNewLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newLinkUrl.trim()) {
                setLinks([...links, { id: Date.now().toString(), url: newLinkUrl.trim() }]);
                setNewLinkUrl('');
              }
            }}
            className="flex-1 p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-medium text-sm outline-none"
          />
          <button 
            type="button"
            onClick={() => {
              if (newLinkUrl.trim()) {
                setLinks([...links, { id: Date.now().toString(), url: newLinkUrl.trim() }]);
                setNewLinkUrl('');
              }
            }}
            className="p-4 bg-[#5D5A88] text-white rounded-2xl hover:bg-[#4a4770] transition-all active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-2 bg-white/60 p-2 pl-4 pr-2 rounded-xl border border-white shadow-sm animate-in zoom-in-95 duration-200">
              <a 
                href={link.url.startsWith('http') ? link.url : `https://${link.url}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#5D5A88] hover:text-blue-600 flex items-center gap-1"
              >
                {link.url.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0].substring(0, 20)}
                <ArrowUpRight size={14} className="opacity-60" />
              </a>
              <button 
                onClick={() => setLinks(links.filter(l => l.id !== link.id))}
                className="p-1 hover:bg-red-50 rounded-lg text-red-300 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist de Tarefas */}
      <div className="bg-white/40 p-5 rounded-[30px] border border-white/60">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-1">Lista de Tarefas</p>
          <span className="text-[10px] font-black bg-[#cff178] px-2 py-0.5 rounded-full text-[#5D5A88]">
            {projectProgress}% concluído
          </span>
        </div>
        
        <div className="flex gap-2 mb-4">
          <input 
            placeholder="Adicionar item a lista..." 
            value={newTaskText}
            onChange={e => setNewTaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTaskText.trim()) {
                setTasks([...tasks, { id: Date.now().toString(), text: newTaskText, completed: false }]);
                setNewTaskText('');
              }
            }}
            className="flex-1 p-3 rounded-xl bg-white border-none shadow-inner text-sm"
          />
          <button 
            type="button"
            onClick={() => {
              if (newTaskText.trim()) {
                setTasks([...tasks, { id: Date.now().toString(), text: newTaskText, completed: false }]);
                setNewTaskText('');
              }
            }}
            className="p-3 bg-[#5D5A88] text-white rounded-xl hover:bg-[#4a4770]"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center gap-3 bg-white/60 p-3 rounded-xl">
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => {
                  setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
                }}
                className="w-4 h-4 accent-[#cff178]"
              />
              <span className={`text-sm font-bold ${task.completed ? 'line-through opacity-40' : 'text-[#5D5A88]'}`}>
                {task.text}
              </span>
              <button 
                type="button"
                onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                className="ml-auto text-red-300 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Descrição Final */}
      <textarea
        placeholder="Descrição detalhada e insights..."
        value={newDescription}
        onChange={e => setNewDescription(e.target.value)}
        className="w-full p-5 rounded-3xl bg-white border-none shadow-sm font-medium text-[#5D5A88] min-h-[100px] resize-none"
      />
    </div>
  );
};