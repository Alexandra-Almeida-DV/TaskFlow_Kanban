import React from 'react';


interface LeituraFieldsProps {
  author: string;
  setAuthor: (val: string) => void;
  currentPage: number;
  setCurrentPage: (val: number) => void;
  totalPages: number;
  setTotalPages: (val: number) => void;
  dailyGoal: number;
  setDailyGoal: (val: number) => void;
  newNotes: string;
  setNewNotes: (val: string) => void;
  readingProgress: number; 
}

export const LeituraFields: React.FC<LeituraFieldsProps> = ({
  author,
  setAuthor,
  currentPage,
  setCurrentPage,
  totalPages,
  setTotalPages,
  dailyGoal,
  setDailyGoal,
  newNotes,
  setNewNotes,
  readingProgress
}) => {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
      
      {/* Autor do Livro */}
      <div>
        <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Autor</p>
        <input
          placeholder="Autor do livro..."
          value={author || ''}
          onChange={e => setAuthor(e.target.value)}
          className="w-full p-5 rounded-3xl bg-white border-none shadow-sm font-bold text-[#5D5A88] outline-none focus:ring-2 focus:ring-[#cff178]/50"
        />
      </div>

      {/* Gestão de Páginas */}
      <div className="flex gap-3">
        <div className="flex-1">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Pág. Atual</p>
          <input 
            type="number" 
            value={currentPage} 
            onChange={e => setCurrentPage(Number(e.target.value))} 
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold outline-none" 
          />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Total Páginas</p>
          <input 
            type="number" 
            value={totalPages} 
            onChange={e => setTotalPages(Number(e.target.value))} 
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold outline-none" 
          />
        </div>
      </div>

      {/* Meta Diária e Progresso Visual */}
      <div className="bg-[#cff178]/20 p-5 rounded-[30px] border border-[#cff178]/40">
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-col">
            <p className="text-[10px] font-black text-[#5D5A88] uppercase opacity-60">Meta Diária</p>
            <span className="text-sm font-black text-[#5D5A88]">{dailyGoal} páginas/dia</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-[#5D5A88] uppercase opacity-60">Progresso</p>
            <span className="text-sm font-black text-[#5D5A88]">{readingProgress}%</span>
          </div>
        </div>
        
        <input
          type="range"
          min="1"
          max="100"
          value={dailyGoal}
          onChange={(e) => setDailyGoal(Number(e.target.value))}
          className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-[#5D5A88]"
        />
        
        <p className="text-[9px] font-bold text-[#5D5A88]/60 mt-3 italic text-center">
          {readingProgress >= 100 
            ? "🎉 Leitura concluída!" 
            : `Faltam ${Math.max(0, totalPages - currentPage)} páginas para terminar.`
          }
        </p>
      </div>

      {/* Notas de Leitura */}
      <div className="space-y-1">
        <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2">Insights & Citações</p>
        <textarea
          placeholder="O que você aprendeu hoje? Alguma citação favorita?"
          value={newNotes}
          onChange={e => setNewNotes(e.target.value)}
          className="w-full p-5 rounded-3xl bg-white border-none shadow-sm font-medium text-[#5D5A88] min-h-[120px] resize-none outline-none focus:ring-2 focus:ring-[#cff178]/50"
        />
      </div>
    </div>
  );
};