import React, { useState, useRef, useEffect } from 'react';
import { Clock, Flame, Save, BookOpen, Image as ImageIcon, X, Utensils, Trash2, Pencil, Check } from 'lucide-react';
import { api } from '../../services/api';

interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  prep_time: string | null;
  oven_time: string | null;
  category: string;
  image: string | null;
  created_at?: string;
}

const paperLines = {
  backgroundImage: 'linear-gradient(#e1e1e1 1px, transparent 1px)',
  backgroundSize: '100% 28px',
  lineHeight: '28px',
};

export const RecipesView: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedViewRecipe, setSelectedViewRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [saving, setSaving] = useState(false);

  // Estados do formulário de criação
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [ovenTime, setOvenTime] = useState('');
  const [image, setImage] = useState<string | null>(null);

  // Estados do formulário de edição
  const [editTitle, setEditTitle] = useState('');
  const [editIngredients, setEditIngredients] = useState('');
  const [editInstructions, setEditInstructions] = useState('');
  const [editPrepTime, setEditPrepTime] = useState('');
  const [editOvenTime, setEditOvenTime] = useState('');
  const [editImage, setEditImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get('/recipes/').then(res => setRecipes(res.data)).catch(console.error);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, forEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (forEdit) setEditImage(reader.result as string);
      else setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // CRIAR
  const handleSave = async () => {
    if (!title.trim()) return alert('Dê um nome para sua obra prima culinária!');
    setSaving(true);
    try {
      const res = await api.post('/recipes/', {
        title, ingredients, instructions,
        prep_time: prepTime, oven_time: ovenTime,
        category: 'Geral', image,
      });
      setRecipes(prev => [res.data, ...prev]);
      setTitle(''); setIngredients(''); setInstructions('');
      setPrepTime(''); setOvenTime(''); setImage(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar receita.');
    } finally {
      setSaving(false);
    }
  };

  // ABRIR EDIÇÃO
  const handleOpenEdit = (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRecipe(recipe);
    setEditTitle(recipe.title);
    setEditIngredients(recipe.ingredients);
    setEditInstructions(recipe.instructions);
    setEditPrepTime(recipe.prep_time || '');
    setEditOvenTime(recipe.oven_time || '');
    setEditImage(recipe.image);
  };

  // SALVAR EDIÇÃO
  const handleSaveEdit = async () => {
    if (!editingRecipe) return;
    setSaving(true);
    try {
      const res = await api.patch(`/recipes/${editingRecipe.id}`, {
        title: editTitle, ingredients: editIngredients,
        instructions: editInstructions,
        prep_time: editPrepTime, oven_time: editOvenTime,
        image: editImage,
      });
      setRecipes(prev => prev.map(r => r.id === editingRecipe.id ? res.data : r));
      setEditingRecipe(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao editar receita.');
    } finally {
      setSaving(false);
    }
  };

  // DELETAR
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Deseja apagar esta receita?')) return;
    try {
      await api.delete(`/recipes/${id}`);
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
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

      {/* CARD CRIADOR */}
      <div className="max-w-4xl mx-auto mb-16 px-4 md:px-0">
        <div className="bg-white rounded-[30px] md:rounded-[40px] shadow-2xl border border-white overflow-hidden relative">
          <div className="h-3 md:h-4 bg-[#FFB085] w-full" />
          <div className="p-5 md:p-10 pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">

              {/* FOTO */}
              <div className="w-full md:w-1/3">
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => handleImageChange(e)} />
                {image ? (
                  <div className="relative w-full h-40 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden">
                    <img src={image} className="w-full h-full object-cover" alt="Preview" />
                    <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-400 hover:text-red-600">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()} className="w-full h-40 md:h-64 border-4 border-dashed border-orange-50 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center text-[#FFB085] hover:bg-orange-50 transition-colors gap-2 md:gap-3">
                    <ImageIcon size={32} strokeWidth={1} />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-tight">Adicionar Foto</span>
                  </button>
                )}
              </div>

              {/* INFOS */}
              <div className="flex-1 space-y-4 md:space-y-6">
                <input
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nome da Receita..."
                  className="w-full bg-transparent border-b-2 border-orange-100 text-xl md:text-3xl font-black text-[#5D5A88] outline-none pb-2 focus:border-[#FFB085] transition-all"
                />
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-orange-50/50 p-3 md:p-4 rounded-2xl md:rounded-3xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-1 md:mb-2 text-[#FFB085]">
                      <Clock size={14} />
                      <span className="text-[9px] md:text-[10px] font-black uppercase">Preparo</span>
                    </div>
                    <input value={prepTime} onChange={(e) => setPrepTime(e.target.value)} placeholder="20 min" className="bg-transparent w-full text-sm md:text-base text-[#5D5A88] font-bold outline-none" />
                  </div>
                  <div className="bg-orange-50/50 p-3 md:p-4 rounded-2xl md:rounded-3xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-1 md:mb-2 text-[#FFB085]">
                      <Flame size={14} />
                      <span className="text-[9px] md:text-[10px] font-black uppercase">Forno</span>
                    </div>
                    <input value={ovenTime} onChange={(e) => setOvenTime(e.target.value)} placeholder="40 min" className="bg-transparent w-full text-sm md:text-base text-[#5D5A88] font-bold outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* INGREDIENTES E MODO DE PREPARO */}
            <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="relative bg-[#FDFDFD] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100">
                <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[1px] bg-red-100" />
                <h3 className="text-[10px] font-black text-[#8A88B6] uppercase mb-4 pl-4 md:pl-6 flex items-center gap-2">
                  <BookOpen size={14} /> Ingredientes
                </h3>
                <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} style={paperLines} className="w-full bg-transparent border-none text-sm md:text-base text-[#5D5A88] min-h-[120px] md:min-h-[150px] outline-none pl-4 md:pl-6 resize-none" />
              </div>
              <div className="relative bg-[#FDFDFD] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100">
                <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[1px] bg-red-100" />
                <h3 className="text-[10px] font-black text-[#8A88B6] uppercase mb-4 pl-4 md:pl-6">👩‍🍳 Modo de Preparo</h3>
                <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} style={paperLines} className="w-full bg-transparent border-none text-sm md:text-base text-[#5D5A88] min-h-[120px] md:min-h-[150px] outline-none pl-4 md:pl-6 resize-none" />
              </div>
            </div>

            <div className="mt-6 md:mt-8 flex justify-center md:justify-end">
              <button onClick={handleSave} disabled={saving} className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#FFB085] hover:bg-[#ff9d66] text-white px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black transition-all shadow-lg active:scale-95 disabled:opacity-50">
                <Save size={20} /> {saving ? 'Salvando...' : 'Salvar Receita'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GRID DE RECEITAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <div key={recipe.id} onClick={() => setSelectedViewRecipe(recipe)} className="group bg-white rounded-[40px] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border border-white overflow-hidden flex flex-col relative">

            {/* Botões de ação */}
            <div className="absolute top-4 left-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => handleDelete(recipe.id, e)} className="p-2 bg-white/80 backdrop-blur-sm text-red-400 rounded-full hover:bg-red-50">
                <Trash2 size={16} />
              </button>
              <button onClick={(e) => handleOpenEdit(recipe, e)} className="p-2 bg-white/80 backdrop-blur-sm text-[#5D5A88] rounded-full hover:bg-[#5D5A88]/10">
                <Pencil size={16} />
              </button>
            </div>

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
                  <Clock size={14} /> {recipe.prep_time || '--'}
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl text-[#8A88B6] text-xs font-bold">
                  <Flame size={14} /> {recipe.oven_time || '--'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL VISUALIZAÇÃO */}
      {selectedViewRecipe && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setSelectedViewRecipe(null)}>
          <div className="bg-white rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-10 relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedViewRecipe(null)} className="absolute top-6 right-6 text-[#8A88B6] hover:rotate-90 transition-transform p-2 bg-gray-50 rounded-full z-10">
              <X size={24} />
            </button>
            {selectedViewRecipe.image && (
              <div className="w-full h-64 mb-8 rounded-[30px] overflow-hidden shadow-inner bg-orange-50">
                <img src={selectedViewRecipe.image} alt={selectedViewRecipe.title} className="w-full h-full object-cover" />
              </div>
            )}
            <h2 className="text-4xl font-black text-[#5D5A88] mb-6 pr-10">{selectedViewRecipe.title}</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-orange-50 p-4 rounded-2xl flex items-center gap-3 text-[#FFB085]">
                <Clock size={20} /> <span className="font-bold">{selectedViewRecipe.prep_time || 'N/A'}</span>
              </div>
              <div className="bg-orange-50 p-4 rounded-2xl flex items-center gap-3 text-[#FFB085]">
                <Flame size={20} /> <span className="font-bold">{selectedViewRecipe.oven_time || 'N/A'}</span>
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

      {/* MODAL EDIÇÃO */}
      {editingRecipe && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setEditingRecipe(null)}>
          <div className="bg-white rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-10 relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setEditingRecipe(null)} className="absolute top-6 right-6 text-[#8A88B6] hover:rotate-90 transition-transform p-2 bg-gray-50 rounded-full z-10">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black text-[#5D5A88] mb-8">Editar Receita</h2>

            {/* Foto de edição */}
            <div className="mb-6">
              <input type="file" accept="image/*" className="hidden" ref={editFileInputRef} onChange={(e) => handleImageChange(e, true)} />
              {editImage ? (
                <div className="relative w-full h-48 rounded-[25px] overflow-hidden mb-2">
                  <img src={editImage} className="w-full h-full object-cover" alt="Preview" />
                  <button onClick={() => setEditImage(null)} className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-400">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button onClick={() => editFileInputRef.current?.click()} className="w-full h-32 border-4 border-dashed border-orange-100 rounded-[25px] flex items-center justify-center gap-3 text-[#FFB085] hover:bg-orange-50 transition-colors">
                  <ImageIcon size={24} strokeWidth={1} />
                  <span className="text-xs font-black uppercase">Trocar Foto</span>
                </button>
              )}
            </div>

            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Nome da Receita..." className="w-full bg-transparent border-b-2 border-orange-100 text-2xl font-black text-[#5D5A88] outline-none pb-2 mb-6 focus:border-[#FFB085] transition-all" />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-2 mb-2 text-[#FFB085]"><Clock size={14} /><span className="text-[10px] font-black uppercase">Preparo</span></div>
                <input value={editPrepTime} onChange={(e) => setEditPrepTime(e.target.value)} placeholder="20 min" className="bg-transparent w-full text-[#5D5A88] font-bold outline-none" />
              </div>
              <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                <div className="flex items-center gap-2 mb-2 text-[#FFB085]"><Flame size={14} /><span className="text-[10px] font-black uppercase">Forno</span></div>
                <input value={editOvenTime} onChange={(e) => setEditOvenTime(e.target.value)} placeholder="40 min" className="bg-transparent w-full text-[#5D5A88] font-bold outline-none" />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="relative bg-[#FDFDFD] p-5 rounded-2xl border border-gray-100">
                <div className="absolute left-7 top-0 bottom-0 w-[1px] bg-red-100" />
                <h4 className="text-[10px] font-black text-[#8A88B6] uppercase mb-3 pl-5 flex items-center gap-2"><BookOpen size={12} /> Ingredientes</h4>
                <textarea value={editIngredients} onChange={(e) => setEditIngredients(e.target.value)} style={paperLines} className="w-full bg-transparent border-none text-sm text-[#5D5A88] min-h-[100px] outline-none pl-5 resize-none" />
              </div>
              <div className="relative bg-[#FDFDFD] p-5 rounded-2xl border border-gray-100">
                <div className="absolute left-7 top-0 bottom-0 w-[1px] bg-red-100" />
                <h4 className="text-[10px] font-black text-[#8A88B6] uppercase mb-3 pl-5">👩‍🍳 Modo de Preparo</h4>
                <textarea value={editInstructions} onChange={(e) => setEditInstructions(e.target.value)} style={paperLines} className="w-full bg-transparent border-none text-sm text-[#5D5A88] min-h-[100px] outline-none pl-5 resize-none" />
              </div>
            </div>

            <button onClick={handleSaveEdit} disabled={saving} className="w-full flex items-center justify-center gap-3 bg-[#FFB085] hover:bg-[#ff9d66] text-white py-4 rounded-2xl font-black transition-all shadow-lg active:scale-95 disabled:opacity-50">
              <Check size={20} /> {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
