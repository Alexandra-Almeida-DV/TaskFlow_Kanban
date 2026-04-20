import { Plus, Trash2, X, Check, StickyNote, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import axios, { AxiosError } from 'axios';

interface Note {
  id: number;
  title: string;
  content: string;
  color: string;
  category?: string;
  date?: string;
  created_at?: string;
}

export function NotesView() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);

  const formatarData = (dateStr?: string) => {
    if (!dateStr) return "Hoje";
    const data = new Date(dateStr);
    if (isNaN(data.getTime())) return "Recente";
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  useEffect(() => {
    const carregarNotas = async () => {
      try {
        const response = await api.get('/notes/');
        setNotes(response.data);
      } catch (error) {
        console.error("Erro ao carregar notas:", error);
      }
    };
    carregarNotas();
  }, []);

  // CRIAR
  const handleSaveNote = async () => {
    if (newNoteText.trim() === "") return;
    setLoading(true);
    try {
      const payload = {
        title: newNoteText.slice(0, 30),
        content: newNoteText,
        color: "#cff178",
        category: "Geral",
      };
      const response = await api.post<Note>('/notes/', payload);
      setNotes((prev) => [response.data, ...prev]);
      setNewNoteText("");
      setIsCreateModalOpen(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ detail: unknown }>;
        console.error("Erro ao criar nota:", axiosError.response?.data?.detail);
      }
      alert("Não foi possível salvar a nota.");
    } finally {
      setLoading(false);
    }
  };

  // EDITAR — abre o modal preenchido
  const handleOpenEdit = (note: Note) => {
    setEditingNote(note);
    setEditText(note.content);
  };

  // EDITAR — salva via PUT
  const handleSaveEdit = async () => {
    if (!editingNote || editText.trim() === "") return;
    setLoading(true);
    try {
      const payload = {
        title: editText.slice(0, 30),
        content: editText,
        color: editingNote.color,
        category: editingNote.category || "Geral",
      };
      const response = await api.put<Note>(`/notes/${editingNote.id}`, payload);
      setNotes((prev) =>
        prev.map((n) => (n.id === editingNote.id ? response.data : n))
      );
      setEditingNote(null);
      setEditText("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ detail: unknown }>;
        console.error("Erro ao editar nota:", axiosError.response?.data?.detail);
      }
      alert("Não foi possível editar a nota.");
    } finally {
      setLoading(false);
    }
  };

  // DELETAR
  const deleteNote = async (id: number) => {
    if (!window.confirm("Deseja excluir esta nota?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  return (
     <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative min-h-screen">
       <header className="flex items-center gap-4 mb-10">
         <div className="bg-[#cff178] p-3 rounded-2xl shadow-lg shadow-orange-100">
           <StickyNote className="text-white" size={28} />
         </div>
         <div className="flex flex-col justify-center">
           <h2 className="text-4xl font-black text-[#5D5A88] leading-none">
             Notas <span className="text-[#cff178]">Pessoais</span>
           </h2>
           <p className="text-[#8A88B6] font-bold text-sm uppercase tracking-widest">
             Seus insights e lembretes
           </p>
         </div>
       </header>
 
       <div className="flex flex-wrap gap-8">
         {/* Botão Nova Nota */}
         <button
           onClick={() => setIsCreateModalOpen(true)}
           className="w-72 h-72 rounded-[40px] border-2 border-dashed border-white/40 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center text-[#5D5A88] hover:bg-white/20 hover:border-[#cff178] transition-all group active:scale-95 shadow-sm"
         >
           <div className="p-5 bg-white/20 rounded-full group-hover:bg-[#cff178] group-hover:text-white transition-all">
             <Plus size={36} />
           </div>
           <span className="mt-4 font-black uppercase text-[11px] tracking-[0.2em] opacity-60">Nova Nota</span>
         </button>
 
         {/* Cards de Notas */}
         {notes.map((note) => (
           <div
             key={note.id}
             className="w-72 h-72 p-8 rounded-[40px] bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl flex flex-col justify-between hover:scale-105 transition-all group relative overflow-hidden"
           >
             <div className="flex justify-between items-start relative z-10">
               <span className="text-[10px] font-black text-[#8A88B6] uppercase tracking-widest bg-white/30 px-3 py-1 rounded-full">
                 {formatarData(note.date || note.created_at)}
               </span>
               <div className="flex gap-2">
                 {/* Botão Editar */}
                 <button
                   onClick={() => handleOpenEdit(note)}
                   className="text-[#8A88B6] hover:text-[#5D5A88] transition-colors"
                   title="Editar nota"
                 >
                   <Pencil size={16} />
                 </button>
                 {/* Botão Deletar */}
                 <button
                   onClick={() => deleteNote(note.id)}
                   className="text-[#8A88B6] hover:text-red-400 transition-colors"
                   title="Excluir nota"
                 >
                   <Trash2 size={18} />
                 </button>
               </div>
             </div>
             <p className="text-[#5D5A88] font-bold leading-relaxed text-lg italic overflow-y-auto pr-2 relative z-10">
               "{note.content}"
             </p>
             <div className="h-1 w-full bg-[#cff178] rounded-full mt-4 relative z-10" />
           </div>
         ))}
       </div>
 
       {/* Modal — Criar Nota */}
       {isCreateModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3A385F]/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white/90 backdrop-blur-2xl w-full max-w-lg p-10 rounded-[50px] shadow-2xl border border-white flex flex-col gap-6">
             <div className="flex justify-between items-center">
               <h3 className="text-xl font-black text-[#5D5A88]">Escreva sua nota</h3>
               <button
                 onClick={() => { setIsCreateModalOpen(false); setNewNoteText(""); }}
                 className="text-[#8A88B6] hover:rotate-90 transition-transform"
               >
                 <X size={24} />
               </button>
             </div>
             <textarea
               autoFocus
               className="w-full h-40 p-6 rounded-[30px] bg-[#5D5A88]/5 border-none focus:ring-2 focus:ring-[#cff178] text-[#5D5A88] font-medium resize-none placeholder:text-[#8A88B6]/50"
               placeholder="O que você está pensando?"
               value={newNoteText}
               onChange={(e) => setNewNoteText(e.target.value)}
             />
             <button
               onClick={handleSaveNote}
               disabled={loading}
               className="w-full py-5 bg-[#cff178] hover:bg-[#b8d962] text-[#3A385F] rounded-[30px] font-black flex items-center justify-center gap-2 shadow-lg shadow-[#cff178]/30 transition-all active:scale-95 disabled:opacity-50"
             >
               {loading ? "Salvando..." : <><Check size={20} /> Salvar Nota</>}
             </button>
           </div>
         </div>
       )}
 
       {/* Modal — Editar Nota */}
       {editingNote && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3A385F]/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white/90 backdrop-blur-2xl w-full max-w-lg p-10 rounded-[50px] shadow-2xl border border-white flex flex-col gap-6">
             <div className="flex justify-between items-center">
               <h3 className="text-xl font-black text-[#5D5A88]">Editar nota</h3>
               <button
                 onClick={() => { setEditingNote(null); setEditText(""); }}
                 className="text-[#8A88B6] hover:rotate-90 transition-transform"
               >
                 <X size={24} />
               </button>
             </div>
             <textarea
               autoFocus
               className="w-full h-40 p-6 rounded-[30px] bg-[#5D5A88]/5 border-none focus:ring-2 focus:ring-[#cff178] text-[#5D5A88] font-medium resize-none placeholder:text-[#8A88B6]/50"
               value={editText}
               onChange={(e) => setEditText(e.target.value)}
             />
             <button
               onClick={handleSaveEdit}
               disabled={loading}
               className="w-full py-5 bg-[#cff178] hover:bg-[#b8d962] text-[#3A385F] rounded-[30px] font-black flex items-center justify-center gap-2 shadow-lg shadow-[#cff178]/30 transition-all active:scale-95 disabled:opacity-50"
             >
               {loading ? "Salvando..." : <><Check size={20} /> Salvar Alterações</>}
             </button>
           </div>
         </div>
       )}
     </div>
   );
 }
 