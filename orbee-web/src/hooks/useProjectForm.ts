import { useState, useCallback } from 'react';
import { api } from '../services/api';

export interface MetaData {
  current_page?: number;
  total_pages?: number;
  target_value?: number;
  current_value?: number;
  unit?: string;
  streak?: number;
  last_done?: string | null;
  start_date?: string;
  end_date?: string;
  insights?: string;
  notes?: string;
  purpose?: string;
  author?: string;
  daily_goal?: number;
  meta_type?: string;
  category?: string;
  priority?: string;
  links?: { id: string; url: string }[];
  tasks?: { id: string; text: string; completed: boolean }[];
  ingredients?: string;
  instructions?: string;
  habit_goal?: number;
}

export interface Project {
  id: number;
  name: string;
  type: string;
  progress: number;
  description: string;
  meta_data: MetaData;
}

export function useProjectForm(onSuccess: () => void) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState('projeto');
  const [author, setAuthor] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(10);
  const [currentValue, setCurrentValue] = useState(0);
  const [targetValue, setTargetValue] = useState(0);
  const [unit, setUnit] = useState('R$');
  const [metaType, setMetaType] = useState<'quantitativa' | 'qualitativa'>('quantitativa');
  const [habitGoal, setHabitGoal] = useState(21);
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newGoalPurpose, setNewGoalPurpose] = useState('');
  const [priority, setPriority] = useState('média');
  const [category, setCategory] = useState('pessoal');
  const [links, setLinks] = useState<{ id: string; url: string }[]>([]);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [subject, setSubject] = useState('');

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProject(null);
    setName('');
    setType('projeto');
    setAuthor('');
    setCurrentPage(0);
    setTotalPages(0);
    setDailyGoal(10);
    setCurrentValue(0);
    setTargetValue(0);
    setUnit('R$');
    setMetaType('quantitativa');
    setHabitGoal(21);
    setNewStartDate('');
    setNewEndDate('');
    setNewDescription('');
    setNewNotes('');
    setNewGoalPurpose('');
    setPriority('média');
    setCategory('pessoal');
    setLinks([]);
    setNewLinkUrl('');
    setTasks([]);
    setNewTaskText('');
    setIngredients('');
    setInstructions('');
    setSubject('');
  }, []);

  const handleOpenEdit = useCallback((project: Project) => {
    const meta = project.meta_data || {};
    const lowerType = project.type.toLowerCase();

    setSelectedProject(project);
    setName(project.name);
    setType(lowerType);
    setNewStartDate(meta.start_date || '');
    setNewEndDate(meta.end_date || '');
    setNewDescription(meta.insights || project.description || '');
    setNewNotes(meta.notes || '');
    setNewGoalPurpose(meta.purpose || '');
    setAuthor(meta.author || '');
    setCurrentPage(meta.current_page || 0);
    setTotalPages(meta.total_pages || 0);
    setDailyGoal(meta.daily_goal || 10);
    setCurrentValue(meta.current_value || 0);
    setTargetValue(meta.target_value || 0);
    setUnit(meta.unit || 'R$');
    setMetaType((meta.meta_type as 'quantitativa' | 'qualitativa') || 'quantitativa');
    setHabitGoal(meta.habit_goal || meta.target_value || 21);
    setCategory(meta.category || 'pessoal');
    setPriority(meta.priority || 'média');
    setLinks(meta.links || []);
    setTasks(meta.tasks || []);
    setIngredients(meta.ingredients || '');
    setInstructions(meta.instructions || '');
    setSubject(lowerType === 'estudo' ? (meta.category || '') : '');
    setIsModalOpen(true);
  }, []);

  const handleSaveProject = async () => {
    if (!name.trim()) return;
    const lowerType = type.toLowerCase();

    const meta_data: MetaData = {
      start_date: newStartDate,
      end_date: newEndDate,
      insights: newDescription,
      notes: newNotes,
      purpose: newGoalPurpose,
      author,
      daily_goal: dailyGoal,
      total_pages: totalPages,
      current_page: currentPage,
      current_value: currentValue,
      target_value: lowerType === 'habito' ? habitGoal : targetValue,
      unit: lowerType === 'estudo' ? 'horas' : lowerType === 'habito' ? 'dias' : unit,
      meta_type: metaType,
      streak: selectedProject?.meta_data?.streak || 0,
      last_done: selectedProject?.meta_data?.last_done || null,
      habit_goal: lowerType === 'habito' ? habitGoal : undefined,
      category: lowerType === 'estudo' ? subject : category,
      priority,
      links,
      tasks,
      ingredients,
      instructions,
    };

    const payload = {
      name,
      type: lowerType,
      meta_data,
      description: newDescription || newGoalPurpose || '',
    };

    try {
      if (selectedProject) {
        await api.patch(`/projects/${selectedProject.id}`, payload);
      } else {
        await api.post('/projects/', payload);
      }
      onSuccess();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    }
  };

  // Cálculos de progresso
  const projectProgress = tasks.length > 0
    ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
    : 0;

  const readingProgress = totalPages > 0
    ? Math.min(Math.round((currentPage / totalPages) * 100), 100)
    : 0;

  const metaProgress = targetValue > 0
    ? Math.min(Math.round((currentValue / targetValue) * 100), 100)
    : 0;

  const studyProgress = targetValue > 0
    ? Math.min(Math.round((currentValue / targetValue) * 100), 100)
    : 0;

  return {
    states: {
      isModalOpen, selectedProject,
      name, type, author, currentPage, totalPages, dailyGoal,
      currentValue, targetValue, unit, metaType, habitGoal,
      newStartDate, newEndDate, newDescription, newNotes, newGoalPurpose,
      priority, category, links, newLinkUrl, tasks, newTaskText,
      ingredients, instructions, subject,
      studyHours: currentValue,
      targetHours: targetValue,
    },
    progress: { projectProgress, readingProgress, metaProgress, studyProgress },
    actions: {
      setIsModalOpen, setName, setType, setAuthor,
      setCurrentPage, setTotalPages, setDailyGoal,
      setCurrentValue, setTargetValue, setUnit, setMetaType, setHabitGoal,
      setNewStartDate, setNewEndDate, setNewDescription, setNewNotes, setNewGoalPurpose,
      setPriority, setCategory, setLinks, setNewLinkUrl, setTasks, setNewTaskText,
      setIngredients, setInstructions, setSubject,
      setStudyHours: setCurrentValue,
      setTargetHours: setTargetValue,
      closeModal, handleOpenEdit, handleSaveProject,
    },
  };
}