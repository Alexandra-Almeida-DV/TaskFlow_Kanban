export const WeeklyView = () => {
  // Aqui futuramente entrará o mapeamento das colunas do Backend
  const columns = [
    { title: "A fazer", color: "bg-amber-100" },
    { title: "Em progresso", color: "bg-emerald-100" },
    { title: "Concluído", color: "bg-purple-100" }
  ];

  return (
    <div className="flex gap-8 h-full overflow-x-auto pb-4">
      {columns.map((col, idx) => (
        <div key={idx} className="min-w-[300px] bg-white/40 backdrop-blur-sm rounded-[2.5rem] p-6 border border-white/60">
          <div className="flex justify-between items-center mb-6 px-2">
            <h3 className="font-bold text-slate-700">{col.title}</h3>
            <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded-full">2</span>
          </div>

          <div className="space-y-4">
            {/* Post-it Estilo Foto 1 */}
            <div className={`p-6 rounded-[2rem] shadow-sm transform hover:-rotate-1 transition-all cursor-grab ${col.color}`}>
              <p className="font-semibold text-slate-800">Ajustar identação do Python</p>
              <p className="text-xs text-slate-600 mt-2">Corrigir o app/main.py</p>
              <div className="mt-4 flex justify-end">
                <div className="w-6 h-6 rounded-full bg-white/50 border border-white" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};