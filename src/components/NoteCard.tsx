import { Note, CATEGORIES } from '@/types/notes';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from '@/lib/dateUtils';

interface NoteCardProps {
  note: Note;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  const category = CATEGORIES.find(c => c.value === note.category);

  return (
    <div
      className="group relative rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
      style={{
        background: note.color || 'hsl(230 18% 9%)',
        border: '1px solid hsl(230 15% 18%)',
      }}
      onClick={() => onEdit(note.id)}
    >
      {note.reminder?.enabled && (
        <div className="absolute top-3 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Icon name="Bell" size={14} className="text-yellow-400" />
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm leading-tight text-white line-clamp-2 flex-1">
          {note.title || 'Без названия'}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onTogglePin(note.id); }}
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <Icon
              name="Pin"
              size={13}
              className={note.isPinned ? 'text-yellow-400' : 'text-gray-400'}
            />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(note.id); }}
            className="p-1 rounded-md hover:bg-red-500/20 transition-colors"
          >
            <Icon name="Trash2" size={13} className="text-red-400" />
          </button>
        </div>
      </div>

      {note.content && (
        <p className="text-xs text-gray-400 line-clamp-3 mb-3 leading-relaxed">
          {note.content}
        </p>
      )}

      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1 flex-wrap">
          {category && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{
                background: category.color + '22',
                color: category.color,
                border: `1px solid ${category.color}44`,
              }}
            >
              {category.label}
            </span>
          )}
          {note.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-400"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 2 && (
            <span className="text-[10px] text-gray-500">+{note.tags.length - 2}</span>
          )}
        </div>
        <span className="text-[10px] text-gray-500 shrink-0">
          {formatDistanceToNow(note.updatedAt)}
        </span>
      </div>

      {note.isPinned && (
        <div
          className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full"
          style={{ background: 'hsl(40 100% 60%)' }}
        />
      )}
    </div>
  );
}
