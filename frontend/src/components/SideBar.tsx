import React from 'react';
import { Home, Settings, LogOut, StickyNote, FileCog, Utensils } from 'lucide-react'; 
import { ViewType } from '../types/View';
import { useAuth } from '../hooks/useAuth'; 
interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function SideBar({ activeView, onViewChange }: SidebarProps) {
  const { logout } = useAuth(); 

  return (
    <aside className="hidden lg:flex w-24 bg-[#7C7AB8] m-4 rounded-[40px] flex flex-col items-center py-8 shadow-2xl h-[calc(100vh-32px)] z-50">

      {/* Navegação Principal */}
      <nav className="flex flex-col gap-6 items-center flex-1 w-full">
        <SidebarButton 
          icon={<Home size={24} />} 
          active={activeView === 'Home'} 
          onClick={() => onViewChange('Home')}
        />
        
        <SidebarButton 
          icon={<StickyNote size={24} />} 
          active={activeView === 'Notas'}
          onClick={() => onViewChange('Notas')}
        />

        <SidebarButton 
          icon={<FileCog size={24} />} 
          active={activeView === 'Project'}
          onClick={() => onViewChange('Project')}
        />

        <SidebarButton 
          icon={<Utensils size={24} />} 
          active={activeView === 'Receitas'}
          onClick={() => onViewChange('Receitas')}
        />
        
        <div className="w-8 h-[1px] bg-white/10 my-2" />
    
        <SidebarButton 
          icon={<Settings size={24} />} 
          active={activeView === 'Settings'}
          onClick={() => onViewChange('Settings')} 
        />
      </nav>

      <div className="mt-auto">
        <button 
          onClick={logout}
          className="p-4 rounded-3xl text-white/40 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
          title="Sair da conta"
        >
          <LogOut size={26} />
        </button>
      </div>
    </aside>
  );
}

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