import React from 'react';
interface MetaFieldsProps {
  metaType: 'quantitativa' | 'qualitativa';
  setMetaType: (type: 'quantitativa' | 'qualitativa') => void;
  currentValue: number;
  setCurrentValue: (val: number) => void;
  targetValue: number;
  setTargetValue: (val: number) => void;
  unit: string;
  setUnit: (val: string) => void;
  newStartDate: string;
  setNewStartDate: (val: string) => void;
  newEndDate: string;
  setNewEndDate: (val: string) => void;
  newGoalPurpose: string;
  setNewGoalPurpose: (val: string) => void;
  metaProgress: number; // Progresso calculado no componente pai
}

export const MetaFields: React.FC<MetaFieldsProps> = ({
  metaType,
  setMetaType,
  currentValue,
  setCurrentValue,
  targetValue,
  setTargetValue,
  unit,
  setUnit,
  newStartDate,
  setNewStartDate,
  newEndDate,
  setNewEndDate,
  newGoalPurpose,
  setNewGoalPurpose,
  metaProgress
}) => {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
      
      {/* Seletor de Tipo de Meta */}
      <div className="flex bg-white/50 p-1 rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setMetaType('quantitativa')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
            metaType === 'quantitativa' 
              ? 'bg-[#5D5A88] text-white shadow-sm' 
              : 'text-[#8A88B6] hover:bg-white/30'
          }`}
        >
          Quantitativa
        </button>
        <button
          type="button"
          onClick={() => setMetaType('qualitativa')}
          className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
            metaType === 'qualitativa' 
              ? 'bg-[#5D5A88] text-white shadow-sm' 
              : 'text-[#8A88B6] hover:bg-white/30'
          }`}
        >
          Qualitativa
        </button>
      </div>

      {/* Valores e Unidade */}
      <div className="flex gap-3">
        <div className="flex-1">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Valor Atual</p>
          <input 
            type="number" 
            value={currentValue} 
            onChange={e => setCurrentValue(Number(e.target.value))} 
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold outline-none focus:ring-2 focus:ring-[#cff178]/50" 
          />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Alvo Final</p>
          <input 
            type="number" 
            value={targetValue} 
            onChange={e => setTargetValue(Number(e.target.value))} 
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-[#5D5A88] font-bold outline-none focus:ring-2 focus:ring-[#cff178]/50" 
          />
        </div>
        <div className="w-20">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Unid.</p>
          <input 
            placeholder="R$" 
            value={unit} 
            onChange={e => setUnit(e.target.value)} 
            className="w-full p-4 rounded-2xl bg-white border-none shadow-sm text-center font-bold text-[#5D5A88] outline-none" 
          />
        </div>
      </div>

      {/* Barra de Progresso Visual */}
      <div className="bg-white/40 p-5 rounded-[30px] border border-white/60 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <div className="flex flex-col">
            <p className="text-[10px] font-black text-[#8A88B6] uppercase">Status do Alvo</p>
            <span className="text-xl font-black text-[#5D5A88]">
              {currentValue} / {targetValue} <span className="text-xs opacity-50">{unit}</span>
            </span>
          </div>
          <span className="text-lg font-black text-[#5D5A88]">{metaProgress}%</span>
        </div>
        <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-[#cff178] transition-all duration-500 ease-out" 
            style={{ width: `${metaProgress}%` }}
          />
        </div>
      </div>

      {/* Datas */}
      <div className="flex gap-3">
        <div className="flex-1">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Data Início</p>
          <input 
            type="date" 
            value={newStartDate} 
            onChange={e => setNewStartDate(e.target.value)} 
            className="w-full p-4 rounded-2xl bg-white/80 border-none text-[#5D5A88] font-bold outline-none shadow-sm" 
          />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2 mb-1">Prazo Final</p>
          <input 
            type="date" 
            value={newEndDate} 
            onChange={e => setNewEndDate(e.target.value)} 
            className="w-full p-4 rounded-2xl bg-white/80 border-none text-[#5D5A88] font-bold outline-none shadow-sm" 
          />
        </div>
      </div>

      {/* Propósito da Meta */}
      <div className="space-y-1">
        <p className="text-[10px] font-black text-[#8A88B6] uppercase ml-2">O seu "Porquê"</p>
        <textarea
          placeholder="Qual o propósito dessa meta?"
          value={newGoalPurpose}
          onChange={e => setNewGoalPurpose(e.target.value)}
          className="w-full p-5 rounded-3xl bg-white border-none shadow-sm font-medium text-[#5D5A88] min-h-[100px] resize-none outline-none focus:ring-2 focus:ring-[#cff178]/50"
        />
      </div>
    </div>
  );
};