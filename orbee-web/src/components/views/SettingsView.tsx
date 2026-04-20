import React, { useState, useRef, useEffect } from 'react';
import {
  Settings, User, ShieldCheck, Target,
  ArrowRight, Bell, Clock, BrainCircuit, Camera, UserCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface Preferences {
  main_goal?: string;
  daily_hours_goal?: number;
  focus_mode?: string;
  notifications_enabled?: boolean;
  insight_frequency?: string;
}

export function SettingsView() {
  const { user, login } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('Perfil');
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Estados de perfil
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');

  // Estados de preferências
  const [preferences, setPreferences] = useState<Preferences>({
    main_goal: 'Produtividade Acadêmica',
    daily_hours_goal: 4,
    focus_mode: 'Deep Work',
    notifications_enabled: true,
    insight_frequency: 'daily',
  });

  // Estados de segurança
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Carrega dados atuais do backend ao montar
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/users/me');
        const u = res.data;
        setFullName(u.full_name || '');
        setDisplayName(u.display_name || '');
        setBio(u.bio || '');
        setPhone(u.phone || '');
        if (u.preferences) setPreferences(u.preferences);
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
      }
    };
    load();
  }, []);

  // Upload de foto
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview imediato
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Envia para o backend
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.patch('/users/me/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Atualiza contexto com nova photo_url
      if (user) {
        const token = localStorage.getItem('access_token') || '';
        await login(token, { ...user, photo_url: res.data.photo_url ?? res.data.data?.photo_url });
      }
    } catch (err) {
      console.error('Erro ao enviar foto:', err);
      alert('Não foi possível salvar a foto.');
    }
  };

  // Salvar perfil
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.patch('/users/me', { full_name: fullName, display_name: displayName, bio, phone });
      if (user) {
        const token = localStorage.getItem('access_token') || '';
        await login(token, { ...user, full_name: res.data.full_name, display_name: res.data.display_name });
      }
      alert('Perfil atualizado!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar perfil.');
    } finally {
      setSaving(false);
    }
  };

  // Salvar preferências
  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      await api.patch('/users/me/preferences', preferences);
      alert('Preferências salvas!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar preferências.');
    } finally {
      setSaving(false);
    }
  };

  // Alterar senha
  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setSaving(true);
    try {
      await api.patch('/users/me/password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Senha atualizada com sucesso!');
    } catch (err: unknown) {
      let msg = 'Erro ao alterar senha.';
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err
      ) {
        const error = err as {
          response?: { data?: { detail?: string } };
        };
        msg = error.response?.data?.detail ?? msg;
      }
      alert(msg);
    }
  }

  const handleSave = () => {
    if (activeTab === 'Perfil') handleSaveProfile();
    else if (activeTab === 'Foco & Objetivos') handleSavePreferences();
    else if (activeTab === 'Segurança') handleSavePassword();
  };

  const navItems = [
    { name: 'Perfil', icon: User },
    { name: 'Foco & Objetivos', icon: Target },
    { name: 'Notificações', icon: Bell },
    { name: 'Segurança', icon: ShieldCheck },
  ];

  const avatarSrc = photoPreview || user?.photo_url || null;

  return (
    <div className="p-4 md:p-8 lg:p-12 min-h-screen font-sans relative overflow-hidden animate-in fade-in duration-700">
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#CFF178]/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#3A385F]/10 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">

        <header className="flex items-center gap-6 mb-10">
          <div className="bg-[#cff178] p-3 rounded-2xl shadow-lg">
            <Settings className="text-white" size={28} />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-black text-[#5D5A88] leading-none">
              Central de Controle <span className="text-[#cff178]">OrBee</span>
            </h2>
            <p className="text-[#8A88B6] font-bold text-sm uppercase tracking-widest">
              minhas preferências OrBee
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* NAV LATERAL */}
          <nav className="lg:col-span-3 space-y-2 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-[40px] shadow-xl h-fit">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full text-left px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-4 group ${
                    isActive
                      ? 'bg-[#CFF178] text-[#5D5A88] shadow-lg scale-[1.02]'
                      : 'text-[#3A385F]/60 hover:bg-white/10 hover:text-[#3A385F]'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-[#3A385F]' : 'text-[#CFF178]'} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* CONTEÚDO PRINCIPAL */}
          <main className="lg:col-span-9 bg-white/10 backdrop-blur-2xl border border-white/30 p-10 lg:p-14 rounded-[50px] shadow-2xl space-y-12">

            {/* ABA: PERFIL */}
            {activeTab === 'Perfil' && (
              <section className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="pb-4 border-b border-[#5D5A88]/10">
                  <h3 className="text-[#5D5A88] text-3xl font-black tracking-tight">Informações do Perfil</h3>
                  <p className="text-[#CFF178] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Sua identidade na Colméia.</p>
                </div>

                {/* AVATAR */}
                <div className="flex flex-col md:flex-row items-center gap-8 bg-white/10 p-8 rounded-[40px] border border-white/20 shadow-inner">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-[#CFF178] blur-2xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity" />
                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[#5D5A88]/10 border-4 border-[#CFF178]/30 backdrop-blur-sm">
                      {avatarSrc ? (
                        <img src={avatarSrc} className="w-full h-full object-cover" alt="Avatar" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserCircle size={64} className="text-[#5D5A88]/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-[#5D5A88]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="text-[10px] text-white font-black uppercase tracking-tighter">Alterar</span>
                      </div>
                    </div>
                    <label className="absolute bottom-1 right-1 bg-[#CFF178] text-#5D5A88] p-2.5 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-[#9A94C5]">
                      <Camera size={18} strokeWidth={2.5} />
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-[#5D5A88] text-2xl font-black tracking-tight leading-none">
                      {displayName || fullName || 'Sua Colméia'}
                    </h4>
                    <p className="text-[#8A88B6] text-xs font-bold mt-1">{user?.email}</p>
                  </div>
                </div>

                {/* INPUTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput label="Nome Completo" value={fullName} onChange={setFullName} />
                  <FormInput label="Nome de Exibição" value={displayName} onChange={setDisplayName} />
                  <FormInput label="Telefone" value={phone} onChange={setPhone} />
                </div>

                <div className="space-y-3">
                  <label className="text-[#5D5A88]/50 text-[10px] font-black uppercase tracking-widest ml-5">Bio / Objetivo</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-white/20 backdrop-blur-sm border border-white/20 rounded-[35px] py-6 px-8 text-[#5D5A88] font-bold outline-none h-40 resize-none focus:border-[#CFF178] focus:bg-white/30 transition-all shadow-inner"
                    placeholder="Conte um pouco sobre seus objetivos..."
                  />
                </div>
              </section>
            )}

            {/* ABA: FOCO & OBJETIVOS */}
            {activeTab === 'Foco & Objetivos' && (
              <section className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="pb-4 border-b border-[#5D5A88]/10">
                  <h3 className="text-[#5D5A88] text-3xl font-black tracking-tight">Estratégia de Foco</h3>
                  <p className="text-[#CFF178] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Ajuste o que você definiu no início.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/20 p-6 rounded-[30px] border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="text-[#CFF178]" size={20} />
                      <span className="text-[10px] font-black text-[#5D5A88]/40 uppercase tracking-widest">Objetivo Atual</span>
                    </div>
                    <select
                      value={preferences.main_goal || ''}
                      onChange={(e) => setPreferences({ ...preferences, main_goal: e.target.value })}
                      className="w-full bg-transparent text-xl font-black text-[#5D5A88] outline-none"
                    >
                      <option>Produtividade Acadêmica</option>
                      <option>Foco Profissional</option>
                      <option>Saúde & Bem-estar</option>
                      <option>Projetos Pessoais</option>
                    </select>
                  </div>

                  <div className="bg-white/20 p-6 rounded-[30px] border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="text-[#CFF178]" size={20} />
                      <span className="text-[10px] font-black text-[#5D5A88]/40 uppercase tracking-widest">Meta Diária</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min={1}
                        max={24}
                        value={preferences.daily_hours_goal ?? 4}
                        onChange={(e) => setPreferences({ ...preferences, daily_hours_goal: Number(e.target.value) })}
                        className="bg-transparent text-3xl font-black text-[#5D5A88] w-16 outline-none"
                      />
                      <span className="text-sm font-bold text-[#5D5A88]/60 uppercase">horas / dia</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/20 p-6 rounded-[30px] border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="text-[#CFF178]" size={20} />
                    <span className="text-[10px] font-black text-[#5D5A88]/40 uppercase tracking-widest">Notificações de Insight</span>
                  </div>
                  <select
                    value={preferences.insight_frequency || 'daily'}
                    onChange={(e) => setPreferences({ ...preferences, insight_frequency: e.target.value })}
                    className="w-full bg-transparent text-lg font-black text-[#5D5A88] outline-none"
                  >
                    <option value="daily">Diário</option>
                    <option value="weekly">Semanal</option>
                    <option value="never">Nunca</option>
                  </select>
                </div>

                <div className="p-6 bg-[#5D5A88] rounded-[30px] flex items-start gap-5">
                  <div className="bg-[#CFF178]/10 p-3 rounded-2xl">
                    <BrainCircuit className="text-[#CFF178]" size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Mudança de Comportamento</h4>
                    <p className="text-white/50 text-xs mt-1 leading-relaxed">
                      Alterar sua meta diária ou objetivo principal afetará seus cálculos de produtividade a partir de amanhã. O histórico passado será preservado.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* ABA: NOTIFICAÇÕES */}
            {activeTab === 'Notificações' && (
              <section className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="pb-4 border-b border-[#5D5A88]/10">
                  <h3 className="text-[#5D5A88] text-3xl font-black tracking-tight">Notificações</h3>
                  <p className="text-[#CFF178] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Controle o que você recebe.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Notificações gerais', key: 'notifications_enabled' },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex items-center justify-between bg-white/20 p-6 rounded-[30px] border border-white/20">
                      <span className="text-[#5D5A88] font-bold text-sm">{label}</span>
                      <button
                        onClick={() => setPreferences({ ...preferences, [key]: !preferences[key as keyof Preferences] })}
                        className={`w-14 h-7 rounded-full transition-colors flex items-center px-1 ${
                          preferences[key as keyof Preferences] ? 'bg-[#CFF178]' : 'bg-white/20'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          preferences[key as keyof Preferences] ? 'translate-x-7' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ABA: SEGURANÇA */}
            {activeTab === 'Segurança' && (
              <section className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="pb-4 border-b border-[#5D5A88]/10">
                  <h3 className="text-[#5D5A88] text-3xl font-black tracking-tight">Segurança</h3>
                  <p className="text-[#CFF178] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Altere sua senha de acesso.</p>
                </div>
                <div className="space-y-6 max-w-md">
                  <FormInput label="Senha Atual" value={currentPassword} onChange={setCurrentPassword} type="password" />
                  <FormInput label="Nova Senha" value={newPassword} onChange={setNewPassword} type="password" />
                  <FormInput label="Confirmar Nova Senha" value={confirmPassword} onChange={setConfirmPassword} type="password" />
                </div>
              </section>
            )}

            {/* BOTÃO SALVAR */}
            <div className="flex justify-end pt-10 border-t border-[#5D5A88]/10">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#CFF178] text-[#5D5A88] font-black px-12 py-5 rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Confirmar Configurações'}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function FormInput({
  label, value, onChange, type = 'text'
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-3">
      <label className="text-[#5D5A88]/50 text-[10px] font-black uppercase tracking-widest ml-5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl py-5 px-7 text-[#5D5A88] font-bold outline-none focus:border-[#CFF178] transition-all"
      />
    </div>
  );
}
