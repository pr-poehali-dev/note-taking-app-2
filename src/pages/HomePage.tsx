import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '@/store/notesStore';
import { CATEGORIES, NoteCategory } from '@/types/notes';
import NoteCard from '@/components/NoteCard';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const navigate = useNavigate();
  const { notes, deleteNote, togglePin, searchNotes } = useNotesStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<NoteCategory | 'all'>('all');

  const filtered = useMemo(
    () => searchNotes(search, activeCategory),
    [notes, search, activeCategory]
  );

  const pinned = filtered.filter(n => n.isPinned);
  const rest = filtered.filter(n => !n.isPinned);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 px-4 pt-6 pb-3" style={{ background: 'hsl(230 20% 6% / 0.95)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-neon-purple" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>ALEX_ЗАМЕТКИ</h1>
              <p className="text-xs text-gray-500">{notes.length} заметок</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/settings')}
                className="p-2 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
              >
                <Icon name="Settings" size={20} />
              </button>
              <button
                onClick={() => navigate('/note/new')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 neon-glow-purple"
                style={{
                  background: 'linear-gradient(135deg, hsl(270 100% 65%), hsl(290 100% 60%))',
                  color: 'white',
                }}
              >
                <Icon name="Plus" size={16} />
                Новая
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по заметкам..."
              className="pl-9 bg-secondary border-border text-sm focus:border-purple-500/50 focus:ring-purple-500/20"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <Icon name="X" size={14} />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setActiveCategory('all')}
              className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
              style={
                activeCategory === 'all'
                  ? { background: 'hsl(270 100% 65%)', color: 'white' }
                  : { background: 'hsl(230 15% 14%)', color: 'hsl(215 20% 60%)' }
              }
            >
              Все
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
                style={
                  activeCategory === cat.value
                    ? { background: cat.color, color: 'hsl(230 20% 6%)' }
                    : { background: 'hsl(230 15% 14%)', color: 'hsl(215 20% 60%)' }
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Notes */}
      <main className="flex-1 px-4 pb-24 max-w-2xl mx-auto w-full">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'hsl(270 100% 65% / 0.1)', border: '1px solid hsl(270 100% 65% / 0.2)' }}
            >
              <Icon name="FileText" size={28} className="text-neon-purple" />
            </div>
            <p className="text-gray-400 font-medium">Заметок не найдено</p>
            <p className="text-gray-600 text-sm mt-1">Создай первую заметку</p>
          </div>
        ) : (
          <>
            {pinned.length > 0 && (
              <section className="mt-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Pin" size={13} className="text-yellow-400" />
                  <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">Закреплённые</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {pinned.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={id => navigate(`/note/${id}`)}
                      onDelete={deleteNote}
                      onTogglePin={togglePin}
                    />
                  ))}
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section className={pinned.length > 0 ? '' : 'mt-4'}>
                {pinned.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="FileText" size={13} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Остальные</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {rest.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={id => navigate(`/note/${id}`)}
                      onDelete={deleteNote}
                      onTogglePin={togglePin}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => navigate('/note/new')}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 neon-glow-purple"
        style={{
          background: 'linear-gradient(135deg, hsl(270 100% 65%), hsl(290 100% 60%))',
          color: 'white',
        }}
      >
        <Icon name="Plus" size={24} />
      </button>
    </div>
  );
}