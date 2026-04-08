import React from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, CheckCircle2, Circle } from 'lucide-react';
import {
  DndContext, 
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor, 
  useSensor,
  useSensors,
  DragOverEvent,
  DragEndEvent,
  useDroppable
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
  id: number;
  title: string;
  date: string;
  time: string;
  category: string;
  completed: boolean;
}

interface WeeklyViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

interface DayColumnProps {
  id: string;
  dayName: string;
  dayNumber: string;
  isToday: boolean;
  children: React.ReactNode;
}

interface SortableTaskCardProps {
  task: Task;
  colorClass: string;
  onToggle: (id: number) => void;
}

function DayColumn({ id, dayName, dayNumber, isToday, children }: DayColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div 
      ref={setNodeRef}
      className={`flex-shrink-0 w-[82vw] md:w-auto md:flex-1 flex flex-col h-full rounded-[35px] p-5 md:p-3 border transition-all snap-center ${
        isToday 
        ? 'bg-white/25 border-[#cff178]/40 shadow-[0_0_30px_rgba(207,241,120,0.1)]' 
        : 'bg-white/5 border-white/5'
      }`}
    >
      <div className="mb-4 px-2 shrink-0">
        <span className={`text-[10px] md:text-[9px] font-black uppercase tracking-[0.1em] ${isToday ? 'text-[#cff178]' : 'text-white/30'}`}>
          {dayName}
        </span>
        <h3 className="text-3xl md:text-xl font-black text-white">{dayNumber}</h3>
      </div>
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar min-h-[150px]">
        {children}
      </div>
    </div>
  );
}

function SortableTaskCard({ task, colorClass, onToggle }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style: React.CSSProperties = { 
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'none', // ISSO AQUI: Impede o scroll do browser de "roubar" o movimento
  };
  return (
    <div 
      ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={`p-4 md:p-3 rounded-[22px] shadow-sm cursor-grab active:cursor-grabbing transition-all ${
        task.completed ? 'opacity-40 bg-white/10' : colorClass
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] md:text-[9px] font-black flex items-center gap-1 opacity-70">
            <Clock size={12} /> {task.time}
          </span>
          <button onPointerDown={(e) => e.stopPropagation()} onClick={() => onToggle(task.id)}>
            {task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} className="opacity-40" />}
          </button>
        </div>
        <h4 className={`text-[14px] md:text-[12px] font-bold leading-tight ${task.completed ? 'line-through opacity-50' : ''}`}>
          {task.title}
        </h4>
      </div>
    </div>
  );
}

export function WeeklyView({ tasks, setTasks }: WeeklyViewProps) {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const cardColors = ['bg-[#cff178] text-[#5D5A88]', 'bg-[#A5A3C8] text-white', 'bg-[#FFB085] text-[#5D5A88]'];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 280,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    let overDate = "";
    if (days.some(d => format(d, 'yyyy-MM-dd') === overId)) {
      overDate = overId as string;
    } else {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) overDate = overTask.date;
    }

    if (overDate && activeTask.date !== overDate) {
      setTasks(prev => prev.map(t => t.id === activeId ? { ...t, date: overDate } : t));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setTasks((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragOver={handleDragOver} 
      onDragEnd={handleDragEnd}
    >
      <div className="h-[calc(100vh-160px)] flex flex-col p-4 animate-in fade-in duration-700">
        <header className="mb-6 shrink-0 px-2">
          <h2 className="text-white text-3xl font-black tracking-tight">Visão Semanal</h2>
          <p className="text-[#cff178] font-bold uppercase tracking-widest text-[10px] mt-1">
            {format(days[0], 'dd MMM')} — {format(days[6], 'dd MMM')}
          </p>
        </header>

        <div className="flex-1 flex gap-4 md:gap-3 min-h-0 overflow-x-auto md:overflow-x-hidden snap-x snap-mandatory px-6 md:px-0 pb-6 custom-scrollbar">
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayTasks = tasks
            .filter(t => t.date === dateStr)
            .sort((a, b) => a.time.localeCompare(b.time));

            return (
              <DayColumn 
                key={dateStr}
                id={dateStr}
                dayName={format(day, 'eeee', { locale: ptBR })}
                dayNumber={format(day, 'dd')}
                isToday={isSameDay(day, new Date())}
              >
                <SortableContext items={dayTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {dayTasks.map((task, index) => (
                    <SortableTaskCard 
                      key={task.id} 
                      task={task} 
                      colorClass={cardColors[index % cardColors.length]}
                      onToggle={(id: number) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))}
                    />
                  ))}
                </SortableContext>
              </DayColumn>
            );
          })}
          
          <div className="flex-shrink-0 w-2 md:hidden" />
        </div>
      </div>
    </DndContext>
  );
}