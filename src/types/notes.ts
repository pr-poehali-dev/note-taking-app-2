export type NoteCategory = 'work' | 'personal' | 'ideas' | 'tasks' | 'other';

export interface Reminder {
  id: string;
  date: string;
  time: string;
  enabled: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  reminder: Reminder | null;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  color: string;
}

export const CATEGORIES: { value: NoteCategory; label: string; color: string }[] = [
  { value: 'work', label: 'Работа', color: 'hsl(270 100% 65%)' },
  { value: 'personal', label: 'Личное', color: 'hsl(180 100% 50%)' },
  { value: 'ideas', label: 'Идеи', color: 'hsl(320 100% 65%)' },
  { value: 'tasks', label: 'Задачи', color: 'hsl(150 100% 50%)' },
  { value: 'other', label: 'Другое', color: 'hsl(40 100% 60%)' },
];

export const NOTE_COLORS = [
  'hsl(230 18% 9%)',
  'hsl(270 30% 12%)',
  'hsl(180 30% 9%)',
  'hsl(320 30% 11%)',
  'hsl(150 25% 9%)',
  'hsl(40 25% 10%)',
];
