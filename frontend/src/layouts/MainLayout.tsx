import { useState, useEffect } from 'react';
import { TopBar } from '../components/TopBar';
import { HomeView } from '../components/views/HomeView';
import { MonthlyView } from '../components/views/MonthlyView'; 
import { WeeklyView } from '../components/views/WeeklyView';
import { DailyView } from '../components/views/DailyView'; 
import { NotesView } from '../components/views/NotesView';
import { SideBar } from '../components/SideBar';
import { ProjectsView } from '../components/views/ProjectView';
import { RecipesView } from '../components/views/RecipesView';
import { ViewType } from '../types/View';
import { parseISO } from 'date-fns';
import { Menu, Home, StickyNote, FileCog, Utensils, Settings, LogOut } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  date: string;
  time: string;
  category: string;
  completed: boolean;
}

export default function MainLayout() {
  const [activeView, setActiveView] = useState<ViewType>('Home');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('@OrBee:tasks');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('@OrBee:tasks', JSON.stringify(tasks));
  }, [tasks]);

  const renderView = () => {
    switch (activeView) {
      case 'Home':
        return (
          <HomeView
            tasks={tasks}
            onViewChange={(view, date) => {
              setActiveView(view);
              if (date) setSelectedDate(date);
            }}
          />
        );
      case 'Daily':
        return <DailyView date={selectedDate} tasks={tasks} setTasks={setTasks} />;
      case 'Weekly':
        return <WeeklyView tasks={tasks} setTasks={setTasks} />;
      case 'Monthly':
        return (
          <MonthlyView
            tasks={tasks} 
            onDateClick={(dateStr: string) => {
              const newDate = parseISO(dateStr);
              setSelectedDate(newDate);
              setActiveView('Daily');
            }}
          />
        );
      case 'Notas': return <NotesView />;
      case 'Project': return <ProjectsView />;
      case 'Receitas': return <RecipesView />;
      default:
        return <HomeView tasks={tasks} onViewChange={setActiveView}/>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#A5A3C8] overflow-hidden font-sans relative">
      
      {/* 1. BOTÃO HAMBÚRGUER */}
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
        <aside className={`absolute top-2 left-4 h-[calc(100vh-32px)] w-60 bg-[#7C7AB8]/60 backdrop-blur-xl border 
          border-white/20 rounded-[40px] shadow-2xl flex flex-col items-center py-10 transition-all duration-500 
          ease-in-out ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
          <div className="mb-12 flex flex-col items-center gap-1">
            <h1 className="text-4xl tracking-tighter select-none flex items-center gap-1">
              <span className="font-black text-white drop-shadow-md">Or</span>
              <span className="font-light text-white/90 italic tracking-tight">Bee</span>
              <div className="w-2 h-2 mt-3 bg-[#cff178] rounded-full animate-pulse shadow-[0_0_15px_#cff178]" />
            </h1>
          </div>

          <nav className="flex flex-col gap-3 items-center flex-1 w-full">
            <DrawerButton icon={<Home size={24} />} active={activeView === 'Home'} onClick={() => { setActiveView('Home'); setIsMenuOpen(false); }}/>
            <div className="flex flex-col gap-4 py-2 bg-white/5 rounded-3xl items-center w-16">
            <button onClick={() => { setActiveView('Daily'); setIsMenuOpen(false); }} 
            className={`text-[10px] font-black uppercase ${activeView === 'Daily' ? 'text-[#cff178]' : 'text-white/40'}`}>
              Dia
            </button>
            <button onClick={() => { setActiveView('Weekly'); setIsMenuOpen(false); }}
            className={`text-[10px] font-black uppercase ${activeView === 'Weekly' ? 'text-[#cff178]' : 'text-white/40'}`}>
              Sem
            </button>
            <button onClick={() => { setActiveView('Monthly'); setIsMenuOpen(false); }}
            className={`text-[10px] font-black uppercase ${activeView === 'Monthly' ? 'text-[#cff178]' : 'text-white/40'}`}>
              Mês
            </button>
            </div>
            <DrawerButton icon={<StickyNote size={24} />} active={activeView === 'Notas'}
            onClick={() => { setActiveView('Notas'); setIsMenuOpen(false); }}/>
            <DrawerButton icon={<StickyNote size={24} />} active={activeView === 'Notas'} onClick={() => { setActiveView('Notas'); setIsMenuOpen(false); }} />
            <DrawerButton icon={<FileCog size={24} />} active={activeView === 'Project'} onClick={() => { setActiveView('Project'); setIsMenuOpen(false); }} />
            <DrawerButton icon={<Utensils size={24} />} active={activeView === 'Receitas'} onClick={() => { setActiveView('Receitas'); setIsMenuOpen(false); }} />
            <div className="w-12 h-[1px] bg-white/10 my-2" />
            <DrawerButton icon={<Settings size={24} />} active={activeView === 'Configuracoes'} onClick={() => { setActiveView('Configuracoes'); setIsMenuOpen(false); }} />
          </nav>

          <button className="text-white/40 hover:text-[#FF7A00] transition-colors pb-4 flex flex-col items-center gap-1">
            <LogOut size={24} />
          </button>
        </aside>
      </div>

      <div className="hidden lg:flex h-full items-center">
        <SideBar activeView={activeView} onViewChange={setActiveView} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar 
          activeView={activeView} 
          onViewChange={setActiveView} 
          isMenuOpen={isMenuOpen} 
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-2">
          <div className="max-w-[1600px] mx-auto h-full">
            <div key={activeView} className="h-full animate-in fade-in duration-500">
              {renderView()}
            </div>
          </div>
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