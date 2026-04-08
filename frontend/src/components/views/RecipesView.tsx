import React, { useState, useRef, useEffect } from 'react'; 
import { Clock, Flame, Save, BookOpen, Image as ImageIcon, X, Utensils, Trash2 } from 'lucide-react';
import api from '../../services/api';

interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  prepTime: string;
  ovenTime: string;
  image: string | null;
}

export const RecipesView: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedViewRecipe, setSelectedViewRecipe] = useState<Recipe | null>(null);

  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [ovenTime, setOvenTime] = useState('');
  const [image, setImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const paperLines = {
    backgroundImage: 'linear-gradient(#e1e1e1 1px, transparent 1px)',
    backgroundSize: '100% 28px',
    lineHeight: '28px',
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get('/recipes/');
        setRecipes(response.data);
      } catch (err) {
        console.error("Erro ao carregar receitas", err);
      }
    };
    fetchRecipes();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!title) return alert("Dê um nome para sua obra prima culinária!");
    
    const payload = {
      title,
      ingredients,
      instructions,
      prepTime,
      ovenTime,
      category: "Geral",
      image: image
    };

    try {
      const response = await api.post('/recipes/', payload);
      setRecipes(prev => [response.data, ...prev]);
      
      setTitle('');
      setIngredients('');
      setInstructions('');
      setPrepTime('');
      setOvenTime('');
      setImage(null);
    } catch (error) {
      console.error("Erro ao salvar no banco:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Deseja apagar esta receita?")) return;

    try {
      await api.delete(`/recipes/${id}`);
      setRecipes(recipes.filter(r => r.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  return (
    <div className="p-8 pb-24 animate-in fade-in duration-700">
      <header className="flex items-center gap-4 mb-10">
        <div className="bg-[#FFB085] p-3 rounded-2xl shadow-lg shadow-orange-100">
          <Utensils className="text-white" size={28} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-[#5D5A88]">Minhas <span className="text-[#FFB085]">Receitas</span></h1>
          <p className="text-[#8A88B6] font-bold text-sm uppercase tracking-widest">Guarde seus segredos gastronômicos</p>
        </div>
      </header>

      {/* --- CARD CRIADOR --- */}
<div className="max-w-4xl mx-auto mb-16 px-4 md:px-0">
  <div className="bg-white rounded-[30px] md:rounded-[40px] shadow-2xl border border-white overflow-hidden relative">
    {/* Faixa decorativa superior */}
    <div className="h-3 md:h-4 bg-[#FFB085] w-full" />
    
    <div className="p-5 md:p-10 pt-6 md:pt-8">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* LADO DA IMAGEM */}
        <div className="w-full md:w-1/3">
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
          {image ? (
            <div className="relative w-full h-48 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden group">
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
              <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={16} />
              </button>
            </div>
          ) : (
            <button onClick={() => fileInputRef.current?.click()} className="w-full h-40 md:h-64 border-4 border-dashed border-orange-50 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center text-[#FFB085] hover:bg-orange-50 transition-colors gap-2 md:gap-3">
              <ImageIcon size={32} className="md:w-10 md:h-10" strokeWidth={1} />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-tight">Adicionar Foto</span>
            </button>
          )}
        </div>

        {/* LADO DAS INFOS RÁPIDAS */}
        <div className="flex-1 space-y-4 md:space-y-6">
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Nome da Receita..." 
            className="w-full bg-transparent border-b-2 border-orange-100 text-xl md:text-3xl font-black text-[#5D5A88] outline-none pb-2 focus:border-[#FFB085] transition-all" 
          />
          
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-orange-50/50 p-3 md:p-4 rounded-2xl md:rounded-3xl border border-orange-100">
              <div className="flex items-center gap-2 mb-1 md:mb-2 text-[#FFB085]">
                <Clock size={14} className="md:w-4 md:h-4" />
                <span className="text-[9px] md:text-[10px] font-black uppercase">Preparo</span>
              </div>
              <input value={prepTime} onChange={(e) => setPrepTime(e.target.value)} placeholder="20 min" className="bg-transparent w-full text-sm md:text-base text-[#5D5A88] font-bold outline-none" />
            </div>
            
            <div className="bg-orange-50/50 p-3 md:p-4 rounded-2xl md:rounded-3xl border border-orange-100">
              <div className="flex items-center gap-2 mb-1 md:mb-2 text-[#FFB085]">
                <Flame size={14} className="md:w-4 md:h-4" />
                <span className="text-[9px] md:text-[10px] font-black uppercase">Forno</span>
              </div>
              <input value={ovenTime} onChange={(e) => setOvenTime(e.target.value)} placeholder="40 min" className="bg-transparent w-full text-sm md:text-base text-[#5D5A88] font-bold outline-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DE TEXTO (INGREDIENTES E PREPARO) */}
      <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="relative bg-[#FDFDFD] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[1px] bg-red-100" />
          <h3 className="text-[10px] font-black text-[#8A88B6] uppercase mb-4 pl-4 md:pl-6 flex items-center gap-2">
            <BookOpen size={14} /> Ingredientes
          </h3>
          <textarea 
            value={ingredients} 
            onChange={(e) => setIngredients(e.target.value)} 
            style={paperLines} 
            className="w-full bg-transparent border-none text-sm md:text-base text-[#5D5A88] min-h-[120px] md:min-h-[150px] outline-none pl-4 md:pl-6 resize-none" 
          />
        </div>

        <div className="relative bg-[#FDFDFD] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[1px] bg-red-100" />
          <h3 className="text-[10px] font-black text-[#8A88B6] uppercase mb-4 pl-4 md:pl-6">👩‍🍳 Modo de Preparo</h3>
          <textarea 
            value={instructions} 
            onChange={(e) => setInstructions(e.target.value)} 
            style={paperLines} 
            className="w-full bg-transparent border-none text-sm md:text-base text-[#5D5A88] min-h-[120px] md:min-h-[150px] outline-none pl-4 md:pl-6 resize-none" 
          />
        </div>
      </div>

      {/* BOTÃO SALVAR */}
      <div className="mt-6 md:mt-8 flex justify-center md:justify-end">
        <button onClick={handleSave} className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#FFB085] hover:bg-[#ff9d66] text-white px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black transition-all shadow-lg active:scale-95">
          <Save size={20} /> Salvar Receita
        </button>
      </div>
    </div>
  </div>
</div>

      {/* --- GRID DE RECEITAS SALVAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <div key={recipe.id} onClick={() => setSelectedViewRecipe(recipe)} className="group bg-white rounded-[40px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border border-white overflow-hidden flex flex-col relative">
            <button 
              onClick={(e) => handleDelete(recipe.id, e)}
              className="absolute top-4 left-4 z-10 p-2 bg-white/80 backdrop-blur-sm text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
            >
              <Trash2 size={18} />
            </button>

            <div className="w-full h-48 overflow-hidden relative bg-orange-50 flex items-center justify-center">
              {recipe.image ? (
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <Utensils size={40} className="text-orange-200" />
              )}
            </div>

            <div className="p-8 pt-6 flex-1 flex flex-col">
              <h3 className="text-2xl font-black text-[#5D5A88] mb-4">{recipe.title}</h3>
              <div className="flex gap-3 mb-6">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl text-[#8A88B6] text-xs font-bold">
                  <Clock size={14} /> {recipe.prepTime || '--'}
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl text-[#8A88B6] text-xs font-bold">
                  <Flame size={14} /> {recipe.ovenTime || '--'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

 {/* --- MODAL DE VISUALIZAÇÃO (ÚNICO) --- */}
{selectedViewRecipe && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setSelectedViewRecipe(null)}>
    <div className="bg-white rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-10 relative shadow-2xl" onClick={e => e.stopPropagation()}>
      <button onClick={() => setSelectedViewRecipe(null)} className="absolute top-6 right-6 text-[#8A88B6] hover:rotate-90 transition-transform p-2 bg-gray-50 rounded-full z-10">
        <X size={24} />
      </button>

      {/* --- BLOCO DA IMAGEM ADICIONADO AQUI --- */}
      {selectedViewRecipe.image && (
        <div className="w-full h-64 mb-8 rounded-[30px] overflow-hidden shadow-inner bg-orange-50">
          <img 
            src={selectedViewRecipe.image} 
            alt={selectedViewRecipe.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <h2 className="text-4xl font-black text-[#5D5A88] mb-6 pr-10">{selectedViewRecipe.title}</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-orange-50 p-4 rounded-2xl flex items-center gap-3 text-[#FFB085]">
            <Clock size={20} /> <span className="font-bold">{selectedViewRecipe.prepTime || 'N/A'}</span>
         </div>
         <div className="bg-orange-50 p-4 rounded-2xl flex items-center gap-3 text-[#FFB085]">
            <Flame size={20} /> <span className="font-bold">{selectedViewRecipe.ovenTime || 'N/A'}</span>
         </div>
      </div>

      <div className="space-y-8">
        <div>
          <h4 className="font-black text-[#FFB085] uppercase text-[10px] tracking-widest mb-3 border-b border-orange-100 pb-2">Ingredientes</h4>
          <p className="text-[#5D5A88] whitespace-pre-line leading-relaxed">{selectedViewRecipe.ingredients}</p>
        </div>
        <div>
          <h4 className="font-black text-[#FFB085] uppercase text-[10px] tracking-widest mb-3 border-b border-orange-100 pb-2">Modo de Preparo</h4>
          <p className="text-[#5D5A88] whitespace-pre-line leading-relaxed">{selectedViewRecipe.instructions}</p>
        </div>
      </div>
    </div>
  </div>
)}
    </div> 
  );
};