import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; 
import { Search, UserCircle } from 'lucide-react';
import { ViewType } from '../types/View'; 
import { useAuth } from '../hooks/useAuth'
import { NotificationBell } from '../components/NotificationBell';
import { useNotifications } from '../hooks/useNotification';

interface TopBarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  isMenuOpen: boolean;
  user?: {
    display_name: string;
    photo_url?: string;
  } | null;
}

export function TopBar({ activeView, onViewChange, isMenuOpen }: TopBarProps) {
  const logoAbelha = new URL('../assets/Logoorbee.png', import.meta.url).href;
  const { user, signed } = useAuth();

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(signed);

  const saudacaoNome = signed && user 
    ? (user.display_name || user.full_name) 
    : 'Visitante';
  const dataHoje = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });
  const dataFormatada = dataHoje.charAt(0).toUpperCase() + dataHoje.slice(1);
  
  const subtituloConteudo = activeView === 'Home' ? (
    <>
      Hoje é <span className="text-white">{dataFormatada}</span>. 
    </>
  ) : (
    `Planejamento > ${activeView}`
  );
  
  return (
    <header className="w-full p-6 flex items-center justify-between bg-transparent">

      <div className="flex items-center gap-8">
        <div className={`hidden lg:flex items-center gap-1 select-none transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
          <img 
          src={logoAbelha} 
          alt="OrBee Logo" 
          className="w-12 h-15 object-contain" // w-8 é um tamanho ótimo para barra superior
        />
          <h1 className="text-4xl tracking-tighter flex items-center gap-1">
            <span className="font-black text-white drop-shadow-md">Or</span>
            <span className="font-light text-white/90 italic tracking-tight">Bee</span>
          </h1>
          <div className="w-2 h-2 bg-[#cff178] rounded-full mt-4 animate-pulse shadow-[0_0_10px_#4ADE80]" />
        </div>
        <div className="flex flex-col pl-16 lg:pl-0">
          <h1 className="text-xl font-black text-white tracking-tight leading-none mb-1">
            Olá, {saudacaoNome}! 👋
          </h1>
          <p className="text-sm font-bold text-white/60">
          {subtituloConteudo}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* NAVEGAÇÃO DE PERÍODO */}
        <nav className="hidden xl:flex items-center bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/10">
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

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-white/20 border border-white/20 px-4 py-2 rounded-2xl focus-within:bg-white transition-all group">
            <Search size={18} className="text-white group-focus-within:text-primary-700" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="bg-transparent border-none outline-none px-3 text-sm font-bold text-white placeholder:text-white/50 focus:text-primary-700 w-24 lg:w-32"
            />
          </div>

            <NotificationBell
                      notifications={notifications}
                      unreadCount={unreadCount}
                      onMarkAsRead={markAsRead}
                      onMarkAllAsRead={markAllAsRead}
                    />
          
          {/* BOTÃO DE PERFIL / LOGIN */}
          <button 
            onClick={() => onViewChange('Login')}
            className="focus:outline-none transition-all hover:scale-105 active:scale-95 hover:bg-[#CFF178] hover:text-[#3A385F] p-2 rounded-full"
          >
            {user?.photo_url ? (
              <img 
                src={user.photo_url.startsWith('http') 
                  ? user.photo_url 
                  : `http://localhost:8000${user.photo_url}`}
                className="w-12 h-12 rounded-2xl border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl border-4 border-white bg-white/10 flex items-center justify-center text-white shadow-lg">
                <UserCircle size={28} />
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

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