import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotesStore } from '@/store/notesStore';
import { CATEGORIES, NOTE_COLORS, NoteCategory, Reminder } from '@/types/notes';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function NoteEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getNoteById, addNote, updateNote } = useNotesStore();

  const isNew = id === 'new';
  const existing = isNew ? null : getNoteById(id!);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [content, setContent] = useState(existing?.content ?? '');
  const [category, setCategory] = useState<NoteCategory>(existing?.category ?? 'personal');
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [color, setColor] = useState(existing?.color ?? NOTE_COLORS[0]);
  const [isPinned, setIsPinned] = useState(existing?.isPinned ?? false);
  const [reminder, setReminder] = useState<Reminder | null>(existing?.reminder ?? null);
  const [showReminder, setShowReminder] = useState(!!existing?.reminder);

  const handleSave = () => {
    const data = {
      title: title.trim() || 'Без названия',
      content,
      category,
      tags,
      color,
      isPinned,
      reminder: showReminder && reminder ? reminder : null,
    };

    if (isNew) {
      addNote(data);
    } else if (id) {
      updateNote(id, data);
    }
    navigate('/');
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t)) {
      setTags(prev => [...prev, t]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const toggleReminder = (enabled: boolean) => {
    setShowReminder(enabled);
    if (enabled && !reminder) {
      const tomorrow = new Date(Date.now() + 86400000);
      setReminder({
        id: Date.now().toString(),
        date: tomorrow.toISOString().split('T')[0],
        time: '09:00',
        enabled: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: color }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
        style={{ background: color, borderBottom: '1px solid hsl(230 15% 16% / 0.5)' }}
      >
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
        >
          <Icon name="ArrowLeft" size={20} />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPinned(p => !p)}
            className="p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <Icon name="Pin" size={18} className={isPinned ? 'text-yellow-400' : 'text-gray-400'} />
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 neon-glow-purple"
            style={{
              background: 'linear-gradient(135deg, hsl(270 100% 65%), hsl(290 100% 60%))',
              color: 'white',
            }}
          >
            <Icon name="Check" size={16} />
            Сохранить
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-8 max-w-2xl mx-auto w-full">
        {/* Title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Заголовок заметки..."
          className="w-full bg-transparent text-xl font-bold text-white placeholder:text-gray-600 outline-none mt-4 mb-2"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        />

        {/* Textarea */}
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Начни писать..."
          className="w-full bg-transparent border-none text-gray-300 text-sm leading-relaxed placeholder:text-gray-600 outline-none resize-none focus:ring-0 min-h-[200px] p-0"
        />

        {/* Divider */}
        <div className="h-px bg-white/5 my-5" />

        {/* Category */}
        <section className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Категория</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className="text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
                style={
                  category === cat.value
                    ? { background: cat.color, color: 'hsl(230 20% 6%)' }
                    : { background: 'hsl(230 15% 14%)', color: 'hsl(215 20% 60%)', border: '1px solid hsl(230 15% 20%)' }
                }
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Tags */}
        <section className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Теги</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{ background: 'hsl(270 100% 65% / 0.15)', color: 'hsl(270 100% 75%)', border: '1px solid hsl(270 100% 65% / 0.3)' }}
              >
                #{tag}
                <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
                  <Icon name="X" size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Добавить тег..."
              className="bg-secondary border-border text-sm h-8 text-xs"
            />
            <button
              onClick={addTag}
              className="px-3 h-8 rounded-md text-xs font-medium transition-colors"
              style={{ background: 'hsl(270 100% 65% / 0.2)', color: 'hsl(270 100% 75%)' }}
            >
              +
            </button>
          </div>
        </section>

        {/* Color */}
        <section className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Цвет заметки</p>
          <div className="flex gap-2">
            {NOTE_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-7 h-7 rounded-lg transition-all duration-200"
                style={{
                  background: c,
                  border: color === c ? '2px solid hsl(270 100% 65%)' : '2px solid hsl(230 15% 20%)',
                  transform: color === c ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </section>

        {/* Reminder */}
        <section className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon name="Bell" size={16} className={showReminder ? 'text-yellow-400' : 'text-gray-500'} />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Напоминание</p>
            </div>
            <Switch
              checked={showReminder}
              onCheckedChange={toggleReminder}
            />
          </div>

          {showReminder && reminder && (
            <div
              className="rounded-xl p-4 space-y-3"
              style={{ background: 'hsl(40 100% 60% / 0.08)', border: '1px solid hsl(40 100% 60% / 0.2)' }}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Дата</Label>
                  <Input
                    type="date"
                    value={reminder.date}
                    onChange={e => setReminder(r => r ? { ...r, date: e.target.value } : r)}
                    className="bg-secondary border-border text-sm h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Время</Label>
                  <Input
                    type="time"
                    value={reminder.time}
                    onChange={e => setReminder(r => r ? { ...r, time: e.target.value } : r)}
                    className="bg-secondary border-border text-sm h-9"
                  />
                </div>
              </div>
              <p className="text-xs text-yellow-500/70">
                Напоминание сохранится вместе с заметкой
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
