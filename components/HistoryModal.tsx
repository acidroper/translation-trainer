
import React from 'react';
import { createPortal } from 'react-dom';
import { PracticeSession } from '../types';
import { TOPICS, DIFFICULTIES, STYLES } from '../constants';
import XIcon from './icons/XIcon';
import TrashIcon from './icons/TrashIcon';

interface HistoryModalProps {
  isOpen: boolean;
  history: PracticeSession[];
  onClose: () => void;
  onClear: () => void;
}

const getTopicLabel = (value: string) => {
    const topic = TOPICS.find(t => t.value === value);
    return topic ? topic.label : value;
};

const getTopicEmoji = (value: string) => {
  switch (value) {
    case 'technology': return '💻';
    case 'history': return '📜';
    case 'nature': return '🌿';
    case 'travel': return '✈️';
    case 'food': return '🍳';
    case 'business': return '💼';
    case 'arts': return '🎨';
    case 'science': return '🔬';
    case 'custom': return '✨';
    default: return '📝';
  }
};

const getDifficultyLabel = (value: string) => {
    const diff = DIFFICULTIES.find(d => d.value === value);
    return diff ? diff.label : value;
};

const getStyleLabel = (value: string) => {
    const style = STYLES.find(s => s.value === value);
    return style ? style.label : value;
};

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, history, onClose, onClear }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-zinc-900/20 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                История тренировок
            </h3>
            <button 
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
                <XIcon className="w-5 h-5" />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3">
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-zinc-400 text-sm">
                    <p>История пуста</p>
                </div>
            ) : (
                history.map((session) => (
                    <div key={session.id} className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-start gap-3 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors">
                        <div className="text-2xl flex-shrink-0 mt-1">
                            {getTopicEmoji(session.topic)}
                        </div>
                        <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-semibold text-zinc-900 dark:text-white text-sm truncate pr-2">
                                    {getTopicLabel(session.topic)}
                                </h4>
                                <span className="text-xs text-zinc-400 whitespace-nowrap">
                                    {new Date(session.timestamp).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                                </span>
                             </div>
                             <div className="flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                                <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                    {getDifficultyLabel(session.difficulty)}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                    {getStyleLabel(session.style)}
                                </span>
                             </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {history.length > 0 && (
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                 <span className="text-xs text-zinc-400">
                    Всего сессий: {history.length}
                 </span>
                 <button 
                    onClick={onClear}
                    className="flex items-center text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                 >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Очистить
                 </button>
            </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default HistoryModal;
