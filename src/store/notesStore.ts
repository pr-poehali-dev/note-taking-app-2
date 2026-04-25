import { useState, useEffect } from 'react';
import { Note, NoteCategory } from '@/types/notes';

const STORAGE_KEY = 'neon-notes-data';

const defaultNotes: Note[] = [
  {
    id: '1',
    title: 'Добро пожаловать в NeonNotes!',
    content: 'Это твоё первое приложение для заметок с тёмной темой и неоновыми акцентами. Создавай, редактируй и организуй свои мысли.',
    category: 'personal',
    tags: ['старт', 'пример'],
    reminder: null,
    isPinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    color: 'hsl(230 18% 9%)',
  },
  {
    id: '2',
    title: 'Идеи для проекта',
    content: 'Список идей которые хочу реализовать в ближайшее время.',
    category: 'ideas',
    tags: ['проект', 'идеи'],
    reminder: {
      id: 'r1',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '10:00',
      enabled: true,
    },
    isPinned: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    color: 'hsl(320 30% 11%)',
  },
  {
    id: '3',
    title: 'Список задач на неделю',
    content: '- Завершить отчёт\n- Встреча с командой\n- Написать статью\n- Проверить почту',
    category: 'tasks',
    tags: ['задачи', 'работа'],
    reminder: null,
    isPinned: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    color: 'hsl(150 25% 9%)',
  },
];

export function useNotesStore() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultNotes;
    } catch {
      return defaultNotes;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote.id;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const getNoteById = (id: string) => notes.find(n => n.id === id);

  const searchNotes = (query: string, category?: NoteCategory | 'all') => {
    return notes.filter(note => {
      const matchesQuery =
        !query ||
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory = !category || category === 'all' || note.category === category;
      return matchesQuery && matchesCategory;
    });
  };

  return { notes, addNote, updateNote, deleteNote, togglePin, getNoteById, searchNotes };
}
