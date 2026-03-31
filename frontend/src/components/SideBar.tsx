import { Home, Settings, LogOut, StickyNote, FileCog } from 'lucide-react'; 
import { ViewType } from '../types/View'; 

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function SideBar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-24 bg-[#7C7AB8] m-4 rounded-[40px] flex flex-col items-center py-8 shadow-2xl h-[calc(100vh-32px)] z-50">

      <nav className="flex flex-col gap-6 items-center flex-1 w-full">
        {/* Home */}
        <SidebarButton 
          icon={<Home size={24} />} 
          active={activeView === 'Home'} 
          onClick={() => onViewChange('Home')}
        />
        
        {/* Notas */}
        <SidebarButton 
          icon={<StickyNote size={24} />} 
          active={activeView === 'Notas'}
          onClick={() => onViewChange('Notas')}
        />

        {/* PROJETOS (Substituindo o anterior pelo ícone de gerenciamento) */}
        <SidebarButton 
          icon={<FileCog size={24} />} // Ou use <FileCog size={24} />
          active={activeView === 'Project'}
          onClick={() => onViewChange('Project')}
        />
        
        <div className="w-8 h-[1px] bg-white/10 my-2" />
    
        {/* Configurações */}
        <SidebarButton 
          icon={<Settings size={24} />} 
          active={activeView === 'Configuracoes'}
          onClick={() => onViewChange('Configuracoes')} 
        />
      </nav>

      {/* Logout */}
      <button className="text-white/40 hover:text-[#FF7A00] transition-colors mt-auto pb-4">
        <LogOut size={24} />
      </button>
    </aside>
  );
}

// Sub-componente SidebarButton (Mantido)
function SidebarButton({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-3xl transition-all duration-300 ${
        active 
          ? 'bg-[#4C4A72] text-white shadow-lg scale-110' 
          : 'text-white/60 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
    </button>
  ); 
}