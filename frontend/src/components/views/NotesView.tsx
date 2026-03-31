import { Plus, Trash2, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react'; 
import api from '../../../../backend/app/scr/services/api';

// 1. Mudamos o nome da Interface para 'Note' para evitar conflito com o componente
interface Note {
  id: number;
  content: string;
  color: string;
  created_at: string; 
}

export function NotesView() {
  const [notes, setNotes] = useState<Note[]>([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");

  // 2. BUSCAR NOTAS AO CARREGAR (O segredo da persistência)
  useEffect(() => {
    const carregarNotas = async () => {
      try {
        const response = await api.get('/notes/');
        console.log("Dados recebidos do banco:", response.data);
        setNotes(response.data); 
      } catch (error) {
        console.error("Erro ao carregar notas do backend:", error);
      }
    };
    carregarNotas();
  }, []);

  // 3. SALVAR NOTA NO BANCO
  const handleSaveNote = async () => {
    if (newNoteText.trim() === "") return;

    try {
      const response = await api.post<Note>('/notes/', {
        content: newNoteText,
        color: "#cff178" 
      });

      // Atualiza o estado com a nota retornada pelo FastAPI
      setNotes((prev) => [response.data, ...prev]);
      setNewNoteText("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      alert("Não foi possível salvar no banco de dados. O backend está rodando?");
    }
  };

  // 4. DELETAR NO BANCO
  const deleteNote = async (id: number) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative min-h-screen">
      <h2 className="text-3xl font-black text-[#5D5A88] mb-10">Notas Pessoais</h2>
      
      <div className="flex flex-wrap gap-8">
        {/* CARD CRIADOR */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-72 h-72 rounded-[40px] border-2 border-dashed border-white/40 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center text-[#5D5A88] hover:bg-white/20 hover:border-[#cff178] transition-all group active:scale-95 shadow-sm"
        >
          <div className="p-5 bg-white/20 rounded-full group-hover:bg-[#cff178] group-hover:text-white transition-all">
            <Plus size={36} />
          </div>
          <span className="mt-4 font-black uppercase text-[11px] tracking-[0.2em] opacity-60">Nova Nota</span>
        </button>

        {/* LISTA DE NOTAS */}
        {notes.map((note) => (
          <div key={note.id} className="w-72 h-72 p-8 rounded-[40px] bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl flex flex-col justify-between hover:scale-105 transition-all group">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-[#8A88B6] uppercase tracking-widest bg-white/30 px-3 py-1 rounded-full">
                <span className="text-[10px] font-black text-[#8A88B6] uppercase tracking-widest bg-white/30 px-3 py-1 rounded-full">
                {new Date(note.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </span>
              </span>
              <button onClick={() => deleteNote(note.id)} className="text-[#8A88B6] hover:text-red-400 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
            <p className="text-[#5D5A88] font-bold leading-relaxed text-lg italic overflow-y-auto pr-2">
              "{note.content}"
            </p>
            <div className="h-1 w-full bg-[#4ADE80]/20 rounded-full mt-4" />
          </div>
        ))}
      </div>

      {/* MODAL DE DIGITAÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#5D5A88]/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white/90 backdrop-blur-2xl w-full max-w-lg p-10 rounded-[50px] shadow-2xl border border-white flex flex-col gap-6 scale-in-center">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-[#5D5A88]">Escreva sua nota</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8A88B6] hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>

            <textarea 
              autoFocus
              className="w-full h-40 p-6 rounded-[30px] bg-[#5D5A88]/5 border-none focus:ring-2 focus:ring-[#4ADE80] text-[#5D5A88] font-medium resize-none placeholder:text-[#8A88B6]/50"
              placeholder="O que você está pensando?"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
            />

            <button 
              onClick={handleSaveNote}
              className="w-full py-5 bg-[#cff178] hover:bg-[#3ec972] text-white rounded-[30px] font-black flex items-center justify-center gap-2 shadow-lg shadow-[#4ADE80]/30 transition-all active:scale-95"
            >
              <Check size={20} /> Salvar Nota
            </button>
          </div>
        </div>
      )}
    </div>
  );
}