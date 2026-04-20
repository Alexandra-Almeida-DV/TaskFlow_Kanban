import React from 'react';
import { Check } from 'lucide-react';

interface HabitoFieldsProps {
  name: string;
  setName: (val: string) => void;
  habitGoal: number;
  setHabitGoal: (val: number) => void;
  selectedProject: {
    id: string | number;
    meta_data?: {
      streak?: number;
    };
  } | null;
  handleCheckIn: (projectId: string | number) => Promise<void>;
}

export const HabitoFields: React.FC<HabitoFieldsProps> = ({
  name,
  setName,
  habitGoal,
  setHabitGoal,
  selectedProject,
  handleCheckIn
}) => {
 
  const suggestions = [
    { id: 'skincare', label: '✨ Skincare', name: 'Skincare (Manhã/Noite)' },
    { id: 'agua', label: '💧 Beber Água', name: 'Beber Água (Meta Diária)' },
    { id: 'organizar', label: '🧹 Organizar Ambiente', name: 'Organizar ambiente (5–10 min/dia)' },
    { id: 'cabelo', label: '💇‍♀️ Cuidar do Cabelo', name: 'Cuidar do cabelo' },
    { id: 'journaling', label: '✍️ Journaling', name: 'Journaling (5-10 min)' },
    { id: 'offline', label: '📱 Tempo Offline', name: 'Tempo Offline (Sem Tela)' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      
   
      <div>
        <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-2">Sugestões de Rotina</p>
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map((habit) => (
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
      </div>

      <div className="bg-white/50 p-4 rounded-3xl border border-white/60 shadow-sm">
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
      </div>

      {selectedProject && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <div className="mb-2 bg-[#cff178] p-6 rounded-[35px] shadow-sm text-center relative overflow-hidden">
           
            <Check className="absolute -right-2 -bottom-2 w-20 h-20 text-[#5D5A88]/5 rotate-12" />
            
            <div className="relative z-10">
              <span className="text-[10px] font-black text-[#5D5A88]/60 uppercase tracking-tighter">Sua Jornada</span>
              <h4 className="text-3xl font-black text-[#5D5A88] my-1">
                {selectedProject.meta_data?.streak || 0} dias 🔥
              </h4>
              
              <button
                type="button"
                onClick={() => handleCheckIn(selectedProject.id)}
                className="mt-3 w-full py-4 bg-white rounded-2xl font-black text-[#5D5A88] text-xs hover:shadow-md transition-all active:scale-95 shadow-sm border border-white"
              >
                MARCAR COMO FEITO HOJE
              </button>
            </div>
          </div>
          

          <p className="text-[9px] font-bold text-[#8A88B6] text-center uppercase tracking-widest">
            {Math.round(((selectedProject.meta_data?.streak || 0) / habitGoal) * 100)}% da meta alcançada
          </p>
        </div>
      )}
    </div>
  );
};