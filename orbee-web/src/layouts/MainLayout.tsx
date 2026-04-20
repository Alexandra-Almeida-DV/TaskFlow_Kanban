import { useState, useEffect } from 'react';
import { parseISO } from 'date-fns';
import { Menu, Home, StickyNote, FileCog, Utensils, Settings, LogOut } from 'lucide-react';

// Components & Views
import { TopBar } from '../components/TopBar';
import { SideBar } from '../components/SideBar';
import { HomeView } from '../components/views/HomeView';
import { MonthlyView } from '../components/views/MonthlyView'; 
import { WeeklyView } from '../components/views/WeeklyView';
import { DailyView } from '../components/views/DailyView'; 
import { NotesView } from '../components/views/NotesView';
import { ProjectsView } from '../components/views/ProjectView';
import { RecipesView } from '../components/views/RecipesView';
import { SettingsView } from '../components/views/SettingsView';
import { LoginView } from '../components/Login/LoginView';

// Hooks & Types
import { ViewType } from '../types/View';
import { useAuth } from '../hooks/useAuth';

// Interface Task sincronizada com HomeView (incluindo priority)
interface Task {
  id: number;
  title: string;
  date: string;
  time: string;
  category: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function MainLayout() {
  const logoAbelha = new URL('../assets/Logoorbee.png', import.meta.url).href;
  
  // Estados Principais
  const [activeView, setActiveView] = useState<ViewType>('Home');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estado de Tarefas com LocalStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('@OrBee:tasks');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { logout } = useAuth();

  // Persistência das tarefas
  useEffect(() => {
    localStorage.setItem('@OrBee:tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Função unificada para navegação (fecha menu e muda aba)
  const navigateTo = (view: ViewType, date?: Date) => {
    setActiveView(view);
    if (date) setSelectedDate(date);
    setIsMenuOpen(false);
  };

  const renderView = () => {
    switch (activeView) {
      case 'Home':
        return <HomeView tasks={tasks} onViewChange={navigateTo} />;
      
      case 'Daily':
        return <DailyView date={selectedDate} tasks={tasks} setTasks={setTasks} />;
      
      case 'Weekly':
        return <WeeklyView tasks={tasks} setTasks={setTasks} />;
      
      case 'Monthly':
        return (
          <MonthlyView
            onDateClick={(dateStr: string) => {
              const newDate = parseISO(dateStr);
              navigateTo('Daily', newDate);
            }}
            onGoToLogin={() => navigateTo('Login')}
          />
        );
      
      case 'Login':
        return <LoginView onViewChange={(view) => navigateTo(view as ViewType)} />;
      
      case 'Notas': 
        return <NotesView />;
      
      case 'Project': 
        return <ProjectsView />;
      
      case 'Receitas': 
        return <RecipesView />;
      
      case 'Settings': 
        return <SettingsView />;
      
      default:
        return <HomeView tasks={tasks} onViewChange={navigateTo} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#A5A3C8] overflow-hidden font-sans relative">
      
      {/* 1. BOTÃO HAMBÚRGUER (MOBILE) */}
      {!isMenuOpen && (
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-[#7C7AB8]/60 backdrop-blur-xl border border-white/20 text-[#cff178] rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          <Menu size={24} />
        </button>
      )}

      {/* 2. DRAWER MOBILE COMPLETO */}
      <div className={`fixed inset-0 z-[100] lg:hidden ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)} 
        />
        <aside className={`absolute top-4 left-4 h-[calc(100vh-32px)] w-60 bg-[#7C7AB8]/60 backdrop-blur-xl border 
          border-white/20 rounded-[40px] shadow-2xl flex flex-col items-center py-10 transition-all duration-500 
          ease-in-out ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
          
          <div className="mb-3 flex flex-col items-center gap-1">
             <img src={logoAbelha} alt="OrBee Logo" className="w-12 h-15 object-contain"/>
            <h1 className="text-4xl tracking-tighter select-none flex items-center gap-1">
              <span className="font-black text-white drop-shadow-md">Or</span>
              <span className="font-light text-white/90 italic tracking-tight">Bee</span>
              <div className="w-2 h-2 mt-3 bg-[#cff178] rounded-full animate-pulse shadow-[0_0_15px_#cff178]" />
            </h1>
          </div>

          <nav className="flex flex-col gap-3 items-center flex-1 w-full">
            <DrawerButton icon={<Home size={24} />} active={activeView === 'Home'} onClick={() => navigateTo('Home')}/>
            
            <div className="flex flex-col gap-4 py-2 bg-white/5 rounded-3xl items-center w-16">
              <button onClick={() => navigateTo('Daily')} className={`text-[10px] font-black uppercase ${activeView === 'Daily' ? 'text-[#cff178]' : 'text-white/40'}`}>Dia</button>
              <button onClick={() => navigateTo('Weekly')} className={`text-[10px] font-black uppercase ${activeView === 'Weekly' ? 'text-[#cff178]' : 'text-white/40'}`}>Sem</button>
              <button onClick={() => navigateTo('Monthly')} className={`text-[10px] font-black uppercase ${activeView === 'Monthly' ? 'text-[#cff178]' : 'text-white/40'}`}>Mês</button>
            </div>

            <DrawerButton icon={<StickyNote size={24} />} active={activeView === 'Notas'} onClick={() => navigateTo('Notas')} />
            <DrawerButton icon={<FileCog size={24} />} active={activeView === 'Project'} onClick={() => navigateTo('Project')} />
            <DrawerButton icon={<Utensils size={24} />} active={activeView === 'Receitas'} onClick={() => navigateTo('Receitas')} />
            
            <div className="w-12 h-[1px] bg-white/10 my-2" />
            
            <DrawerButton icon={<Settings size={24} />} active={activeView === 'Settings'} onClick={() => navigateTo('Settings')} />
          </nav>

          <button onClick={logout} className="p-4 rounded-3xl text-white/40 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300">
            <LogOut size={26} />
          </button>       
        </aside>
      </div>

      {/* 3. SIDEBAR DESKTOP */}
      <div className="hidden lg:flex h-full items-center">
        <SideBar activeView={activeView} onViewChange={navigateTo} />
      </div>

      {/* 4. CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar 
          activeView={activeView} 
          onViewChange={navigateTo} 
          isMenuOpen={isMenuOpen} 
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-2 flex flex-col">
          <div className="max-w-[1600px] mx-auto w-full flex-1">
            <div key={activeView} className="h-full animate-in fade-in duration-500">
              {renderView()}
            </div>
          </div>

          <footer className="mt-8 py-10 flex flex-col items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-1">
              <img src={logoAbelha} alt="OrBee" className="w-4 h-4 grayscale brightness-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                OrBee <span className="font-light">Colmeia</span>
              </span>
            </div>
            <p className="text-[13px] text-white/60 font-medium text-center">
              &copy; {new Date().getFullYear()} — Desenvolvido com 💜 por Alexandra Almeida
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

function DrawerButton({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-3xl transition-all duration-300 ${active ? 'bg-[#4C4A72] text-white shadow-lg scale-110' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
    >
      {icon}
    </button>
  ); 
}