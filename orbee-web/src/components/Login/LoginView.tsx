import React, { useState, useRef } from 'react';
import { Mail, Lock, LogIn, ArrowRight, Camera, UserCircle, X, Sparkles } from 'lucide-react';
import{ api } from '../../services/api';
import { AxiosError } from 'axios';
import { useAuth } from '../../hooks/useAuth';
interface LoginViewProps {
  onViewChange: (view: unknown) => void;
}

export function LoginView({ onViewChange }: LoginViewProps) {
  const { login } = useAuth(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', {
              email, password,
              full_name: fullName,
              display_name: displayName,
              phone, bio,
            });
      
      const loginRes = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = loginRes.data.data;
      await login(access_token, userData);
      
      if (fileInputRef.current?.files?.[0]) {
        const formData = new FormData();
        formData.append('file', fileInputRef.current.files[0]);
        const photoRes = await api.patch('/auth/me/photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
              });
              await login(access_token, { ...userData, photo_url: photoRes.data.photo_url });
            }
      
            setIsModalOpen(false);
            onViewChange('Home');
          } catch (error) {
            console.error(error);
            alert('Erro ao cadastrar.');
          } finally {
            setLoading(false);
          }
        };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { 
        email, 
        password
      });
      
      const { access_token, user: user } = response.data.data;
      await login(access_token, user);
      onViewChange('Home');
    } catch (err) {
      const error = err as AxiosError<{ detail: unknown }>;
      console.error("Erro no login:", error);
      const errorMessage = error.response?.data?.detail;
      const message = Array.isArray(errorMessage) 
      ? errorMessage[0].msg 
      : errorMessage || "E-mail ou senha incorretos.";
      alert(message)
    } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#A5A3C8] relative overflow-hidden font-sans">
      <div className="w-full max-w-4xl bg-white/20 backdrop-blur-xl border border-white/30 p-12 md:p-20 rounded-[60px] shadow-2xl relative z-10 transition-all">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="bg-[#CFF178] w-20 h-20 rounded-[30px] flex items-center justify-center shadow-lg shadow-[#CFF178]/20">
              <LogIn className="text-[#3A385F]" size={36} />
            </div>
            <h2 className="text-white text-6xl font-black tracking-tighter leading-none">Bem-vinda!</h2>
            <div className="space-y-2">
              <p className="text-[#CFF178] text-xs font-black uppercase tracking-[0.3em]">Sua Colméia OrBee</p>
              <p className="text-[#3A385F]/60 text-sm font-bold italic leading-relaxed">
                Gerencie sua produtividade com o estilo e a fluidez que você merece.
              </p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[#3A385F]/50 text-[10px] font-black uppercase tracking-widest ml-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3A385F]/30" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#B1AFCE] shadow-[inset_4px_4px_8px_#9795af,inset_-4px_-4px_8px_#cbc9ed] border-none rounded-3xl py-4 pl-14 pr-6 text-[#3A385F] outline-none" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#3A385F]/50 text-[10px] font-black uppercase tracking-widest ml-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3A385F]/30" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#B1AFCE] shadow-[inset_4px_4px_8px_#9795af,inset_-4px_-4px_8px_#cbc9ed] border-none rounded-3xl py-4 pl-14 pr-6 text-[#3A385F] outline-none" 
                  required 
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#CFF178] text-[#3A385F] font-black py-5 rounded-3xl flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] transition-all active:scale-95">
              {loading ? "Entrando..." : "Acessar Dashboard"}
              <ArrowRight size={20} />
            </button>

            <button type="button" onClick={() => setIsModalOpen(true)} className="w-full text-center text-[#3A385F]/40 text-[10px] font-black uppercase tracking-widest hover:text-[#CFF178] transition-colors">
              Ainda não tem conta? <span className="text-[#CFF178] underline">Crie agora</span>
            </button>
          </form>
        </div>
      </div>

      {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
    <div className="absolute inset-0 bg-[#3A385F]/40 backdrop-blur-md" onClick={() => setIsModalOpen(false)} /> 
    <div className="relative w-full max-w-5xl bg-[#B1AFCE] rounded-[40px] md:rounded-[60px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-h-[95vh] h-full scrollbar-thin">
      <div className="lg:col-span-4 bg-[#CFF178] p-8 lg:p-12 flex flex-col justify-between relative shrink-0">
        <Sparkles size={140} className="absolute -right-12 -top-12 text-[#3A385F]/5 rotate-12" />
        <div>
          <h3 className="text-[#3A385F]/70 text-3xl lg:text-5xl font-black tracking-tighter leading-none mb-4 lg:mb-6">Faça parte da Colméia.</h3>
          <p className="text-[#3A385F]/60 font-bold italic text-xs lg:text-sm">"Organize seu caos com inteligência."</p>
        </div>
        <div className="hidden lg:block bg-[#3A385F]/50 text-[#CFF178] p-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center">
          OrBee System v2.0
        </div>
      </div>

      {/* Lado Direito */}
      <div className="lg:col-span-8 p-8 lg:p-14 overflow-y-auto min-h-0 flex-1 relative flex flex-col bg-[#B1AFCE]">
        <button 
          onClick={() => setIsModalOpen(false)} 
          className="sticky top-0 self-end mb-2 text-[#3A385F]/30 hover:text-[#CFF178] transition-colors z-50 bg-[#B1AFCE]/80 backdrop-blur-sm rounded-full p-1"
        >
          <X size={32} />
        </button>

        <div className="mb-10">
          <h4 className="text-white text-3xl font-black tracking-tight">Crie seu Perfil</h4>
          <p className="text-[#CFF178] text-xs font-black uppercase tracking-[0.2em]">Personalização de Usuário</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8 pb-10">
          {/* Foto de Perfil */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#B1AFCE] shadow-[inset_6px_6px_12px_#9795af,inset_-6px_-6px_12px_#cbc9ed] p-6 rounded-[40px]">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl overflow-hidden bg-[#B1AFCE] shadow-lg flex items-center justify-center border-4 border-[#CFF178]/20">
                {photoPreview ? (
                  <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <UserCircle size={50} className="text-[#3A385F]/20" />
                )}
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 bg-[#CFF178] text-[#3A385F] p-2 rounded-xl shadow-xl hover:scale-110 transition-transform">
                <Camera size={18} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[#3A385F]/40 font-black text-lg leading-none">Sua Foto</p>
              <p className="text-[#3A385F]/40 text-[10px] uppercase font-black tracking-widest mt-1">Identidade Visual</p>
            </div>
          </div>

          {/* Grid de Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[#3A385F]/50 text-[10px] font-black uppercase tracking-widest ml-4">Nome Completo</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#B1AFCE] shadow-[inset_4px_4px_8px_#9795af,inset_-4px_-4px_8px_#cbc9ed] border-none rounded-2xl py-4 px-6 text-[#3A385F] outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-[#3A385F]/50 text-[10px] font-black uppercase tracking-widest ml-4">Como quer ser chamada?</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full bg-[#B1AFCE] shadow-[inset_4px_4px_8px_#9795af,inset_-4px_-4px_8px_#cbc9ed] border-none rounded-2xl py-4 px-6 text-[#3A385F] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[#3A385F]/50 text-[10px] font-black uppercase tracking-widest ml-4">Telefone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#B1AFCE] shadow-[inset_4px_4px_8px_#9795af,inset_-4px_-4px_8px_#cbc9ed] border-none rounded-2xl py-4 px-6 text-[#3A385F] outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[#3A385F]/50 text-[10px] font-black uppercase tracking-widest ml-4">Bio / Objetivo</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Conte um pouco sobre seu foco..." className="w-full bg-[#B1AFCE] shadow-[inset_4px_4px_8px_#9795af,inset_-4px_-4px_8px_#cbc9ed] border-none rounded-3xl py-4 px-6 text-[#3A385F] outline-none h-28 resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[#3A385F]/50 text-[10px] font-black uppercase tracking-widest ml-4">E-mail de Acesso</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#B1AFCE] shadow-[inset_4px_4px_8px_#9795af,inset_-4px_-4px_8px_#cbc9ed] border-none rounded-2xl py-4 px-6 text-[#3A385F] outline-none" required />
            </div>
            <div className="space-y-2">
              <label className="text-[#3A385F]/50 text-[10px] font-black uppercase tracking-widest ml-4">Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#B1AFCE] shadow-[inset_4px_4px_8px_#9795af,inset_-4px_-4px_8px_#cbc9ed] border-none rounded-2xl py-4 px-6 text-[#3A385F] outline-none" required />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#CFF178] text-[#3A385F] font-black py-5 rounded-[30px] shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3">
            {loading ? "Processando..." : "Concluir Cadastro OrBee"}
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  </div>
)}
    </div>
  );
}