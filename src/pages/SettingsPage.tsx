import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '@/store/notesStore';
import Icon from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { notes } = useNotesStore();
  const [name, setName] = useState(() => localStorage.getItem('user-name') || '');
  const [notifEnabled, setNotifEnabled] = useState(() => localStorage.getItem('notif-enabled') === 'true');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('user-name', name);
    localStorage.setItem('notif-enabled', String(notifEnabled));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const stats = {
    total: notes.length,
    pinned: notes.filter(n => n.isPinned).length,
    withReminder: notes.filter(n => n.reminder?.enabled).length,
    categories: new Set(notes.map(n => n.category)).size,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3"
        style={{ background: 'hsl(230 20% 6% / 0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid hsl(230 15% 16%)' }}
      >
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
        >
          <Icon name="ArrowLeft" size={20} />
        </button>
        <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Настройки
        </h1>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Profile */}
        <section
          className="rounded-2xl p-5"
          style={{ background: 'hsl(230 18% 9%)', border: '1px solid hsl(230 15% 16%)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'hsl(270 100% 65% / 0.15)', border: '1px solid hsl(270 100% 65% / 0.3)' }}
            >
              <Icon name="User" size={20} className="text-neon-purple" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Профиль</p>
              <p className="text-xs text-gray-500">Персональные данные</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-500 mb-1.5 block">Имя</Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Как тебя зовут?"
                className="bg-secondary border-border"
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section
          className="rounded-2xl p-5"
          style={{ background: 'hsl(230 18% 9%)', border: '1px solid hsl(230 15% 16%)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'hsl(180 100% 50% / 0.1)', border: '1px solid hsl(180 100% 50% / 0.25)' }}
            >
              <Icon name="BarChart3" size={20} className="text-neon-cyan" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Статистика</p>
              <p className="text-xs text-gray-500">Твои заметки</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Всего заметок', value: stats.total, color: 'hsl(270 100% 65%)' },
              { label: 'Закреплено', value: stats.pinned, color: 'hsl(40 100% 60%)' },
              { label: 'С напоминанием', value: stats.withReminder, color: 'hsl(180 100% 50%)' },
              { label: 'Категорий', value: stats.categories, color: 'hsl(320 100% 65%)' },
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-xl p-3"
                style={{ background: `${stat.color}0d`, border: `1px solid ${stat.color}22` }}
              >
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section
          className="rounded-2xl p-5"
          style={{ background: 'hsl(230 18% 9%)', border: '1px solid hsl(230 15% 16%)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'hsl(40 100% 60% / 0.1)', border: '1px solid hsl(40 100% 60% / 0.25)' }}
            >
              <Icon name="Bell" size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Уведомления</p>
              <p className="text-xs text-gray-500">Напоминания о заметках</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300">Включить напоминания</p>
              <p className="text-xs text-gray-500 mt-0.5">Уведомления об важных заметках</p>
            </div>
            <Switch checked={notifEnabled} onCheckedChange={setNotifEnabled} />
          </div>
        </section>

        {/* About */}
        <section
          className="rounded-2xl p-5"
          style={{ background: 'hsl(230 18% 9%)', border: '1px solid hsl(230 15% 16%)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center gradient-border"
              style={{ background: 'linear-gradient(135deg, hsl(270 100% 65% / 0.2), hsl(180 100% 50% / 0.2))' }}
            >
              <Icon name="Sparkles" size={20} className="text-neon-purple" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">NeonNotes</p>
              <p className="text-xs text-gray-500">Версия 1.0 · Тёмная тема</p>
            </div>
          </div>
        </section>

        {/* Save */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 neon-glow-purple"
          style={{
            background: saved
              ? 'linear-gradient(135deg, hsl(150 100% 40%), hsl(160 100% 35%))'
              : 'linear-gradient(135deg, hsl(270 100% 65%), hsl(290 100% 60%))',
            color: 'white',
          }}
        >
          {saved ? '✓ Сохранено' : 'Сохранить настройки'}
        </button>
      </main>
    </div>
  );
}
