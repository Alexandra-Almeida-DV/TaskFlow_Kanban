import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; 
import { Search, Bell } from 'lucide-react';
import { ViewType } from '../types/View'; 

interface TopBarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function TopBar({ activeView, onViewChange }: TopBarProps) {
  const dataHoje = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });
  const dataFormatada = dataHoje.charAt(0).toUpperCase() + dataHoje.slice(1);
  const subtituloConteudo = activeView === 'Home' ? (
    <>
      Hoje é <span className="text-white">{dataFormatada}</span>. 
      <span className="text-accent-500 ml-1">O que temos para hoje?</span>
    </>
  ) : (
    `Planejamento > ${activeView}`
  );
  
  return (
    <header className="w-full p-6 flex items-center justify-between bg-transparent">

      <div className="flex items-center gap-1 select-none group cursor-default">
        <h1 className="text-4xl tracking-tighter">
          {/* Parte "Or" - Mais grossa e imponente */}
          <span className="font-black text-white drop-shadow-md">
            Or
          </span>
          {/* Parte "Bee" - Mais fina e elegante */}
          <span className="font-light text-white/90 italic tracking-tight">
            Bee
          </span>
        </h1>
        
        {/* Um detalhe sutil: um pontinho verde da Orbee */}
        <div className="w-2 h-2 bg-[#cff178] rounded-full mt-4 animate-pulse shadow-[0_0_10px_#4ADE80]" />
      </div>

      <div className="flex items-center gap-12">
        <div className="flex flex-col">
        <h1 className="text-xl font-black text-white tracking-tight leading-none mb-1">
          Olá, Alexandra! 👋
        </h1>
        <p className="text-sm font-bold text-white/60">
          {subtituloConteudo}
        </p>
        </div>

        {/* --- LINKS DE NAVEGAÇÃO DE PERÍODO --- */}
        <nav className="hidden lg:flex items-center bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10">
          <NavTab 
            label="Diário" 
            active={activeView === 'Daily'} 
            onClick={() => onViewChange('Daily')} 
          />
          <NavTab 
            label="Semanal" 
            active={activeView === 'Weekly'} 
            onClick={() => onViewChange('Weekly')} 
          />
          <NavTab 
            label="Mensal" 
            active={activeView === 'Monthly'} 
            onClick={() => onViewChange('Monthly')} 
          />
        </nav>
      </div>

      {/* LADO DIREITO: BUSCA E PERFIL */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-white/20 border border-white/20 px-4 py-2 rounded-2xl focus-within:bg-white transition-all group">
          <Search size={18} className="text-white group-focus-within:text-primary-700" />
          <input 
            type="text" 
            placeholder="Buscar tarefa..." 
            className="bg-transparent border-none outline-none px-3 text-sm font-bold text-white placeholder:text-white/50 focus:text-primary-700 w-48"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 bg-white rounded-2xl text-primary-700 shadow-sm hover:scale-110 transition-all relative">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-accent-500 rounded-full border-2 border-white"></span>
          </button>
          
          <img 
            src="https://github.com/Alexandra-Almeida-DV.png" 
            alt="Alexandra"
            className="w-12 h-12 rounded-2xl border-4 border-white shadow-lg cursor-pointer hover:scale-105 transition-all object-cover"
          />
        </div>
      </div>
    </header>
  );
}

// --- SUB-COMPONENTE PARA AS ABAS DA TOPBAR ---
function NavTab({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 rounded-xl text-xs font-black transition-all duration-300 ${
        active 
          ? 'bg-white text-primary-700 shadow-sm' 
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  );
}