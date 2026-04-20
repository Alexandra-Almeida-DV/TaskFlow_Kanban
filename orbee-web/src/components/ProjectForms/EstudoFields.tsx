import React from 'react';
import { BookOpen } from 'lucide-react';

interface EstudoFieldsProps {
  subject: string;
  setSubject: (val: string) => void;
  studyHours: number;
  setStudyHours: (val: number) => void;
  targetHours: number;
  setTargetHours: (val: number) => void;
  newStartDate: string;
  setNewStartDate: (val: string) => void;
  newEndDate: string;
  setNewEndDate: (val: string) => void;
  newDescription: string;
  setNewDescription: (val: string) => void;
  studyProgress: number;
}

export const EstudoFields: React.FC<EstudoFieldsProps> = ({
  subject,
  setSubject,
  studyHours,
  setStudyHours,
  targetHours,
  setTargetHours,
  newStartDate,
  setNewStartDate,
  newEndDate,
  setNewEndDate,
  newDescription,
  setNewDescription,
  studyProgress,
}) => {
  const suggestions = [
    { id: 'prog', label: '💻 Programação', name: 'Programação' },
    { id: 'idioma', label: '🌍 Idiomas', name: 'Idiomas' },
    { id: 'math', label: '📐 Matemática', name: 'Matemática' },
    { id: 'design', label: '🎨 Design', name: 'Design' },
    { id: 'concurso', label: '📋 Concurso', name: 'Concurso' },
    { id: 'outros', label: '📚 Outros', name: 'Outros' },
  ];
  

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">

      {/* Sugestões de Área */}
      <div>
        <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-2">Área de Estudo</p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSubject(s.name)}
              className={`p-3 rounded-2xl text-[10px] font-bold transition-all border-2 ${
                subject === s.name
                  ? 'bg-[#cff178] border-[#cff178] text-[#5D5A88]'
                  : 'bg-white border-transparent text-[#8A88B6] hover:border-[#cff178]/50 shadow-sm'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <input
          placeholder="Ou escreva a área de estudo..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold outline-none focus:ring-2 focus:ring-[#cff178]/50"
        />
      </div>

      {/* Horas estudadas x meta */}
      <div className="flex gap-3">
        <div className="flex-1">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Horas Estudadas</p>
          <input
            type="number"
            min={0}
            value={studyHours}
            onChange={(e) => setStudyHours(Number(e.target.value))}
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold outline-none"
          />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Meta de Horas</p>
          <input
            type="number"
            min={1}
            value={targetHours}
            onChange={(e) => setTargetHours(Number(e.target.value))}
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold outline-none"
          />
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="bg-white/40 p-5 rounded-[30px] border border-white/60 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <div className="flex flex-col">
            <p className="text-[10px] font-black text-[#8A88B6] uppercase">Progresso</p>
            <span className="text-xl font-black text-[#5D5A88]">
              {studyHours}h <span className="text-xs opacity-50">/ {targetHours}h</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-[#8A88B6]" />
            <span className="text-lg font-black text-[#5D5A88]">{studyProgress}%</span>
          </div>
        </div>
        <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-purple-400 transition-all duration-500 ease-out"
            style={{ width: `${studyProgress}%` }}
          />
        </div>
        <p className="text-[9px] font-bold text-[#5D5A88]/50 mt-2 text-center italic">
          {studyProgress >= 100
            ? '🎓 Meta de estudo concluída!'
            : `Faltam ${Math.max(0, targetHours - studyHours)}h para atingir a meta.`}
        </p>
      </div>

      {/* Datas */}
      <div className="flex gap-3">
        <div className="flex-1">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Início</p>
          <input
            type="date"
            value={newStartDate}
            onChange={(e) => setNewStartDate(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/80 border-none text-[#5D5A88] font-bold outline-none shadow-sm"
          />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Prazo Final</p>
          <input
            type="date"
            value={newEndDate}
            onChange={(e) => setNewEndDate(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/80 border-none text-[#5D5A88] font-bold outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Observações */}
      <div className="space-y-1">
        <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2">Observações / Resumo</p>
        <textarea
          placeholder="O que você está aprendendo? Anotações importantes..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full p-5 rounded-3xl bg-white border-none shadow-sm font-medium text-[#5D5A88] min-h-[100px] resize-none outline-none focus:ring-2 focus:ring-[#cff178]/50"
        />
      </div>
    </div>
  );
};
