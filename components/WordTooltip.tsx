import React from 'react';
import XIcon from './icons/XIcon';

interface WordTooltipProps {
  word: string;
  translations: string[];
  isLoading: boolean;
  position: { top: number; left: number };
  onClose: () => void;
}

const WordTooltip: React.FC<WordTooltipProps> = ({ word, translations, isLoading, position, onClose }) => {
  return (
    <div
      className="absolute z-10 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-3 w-48 animate-fade-in"
      style={{ ...position, maxWidth: '200px' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 break-words">{word}</h4>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2 flex-shrink-0">
          <XIcon className="w-4 h-4" />
        </button>
      </div>
      {isLoading ? (
        <div className="text-sm text-slate-500 dark:text-slate-400">Загрузка...</div>
      ) : (
        <ul className="space-y-1">
          {translations.length > 0 ? (
            translations.map((t, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300">
                &bull; {t}
              </li>
            ))
          ) : (
            <li className="text-sm text-slate-500 dark:text-slate-400">Перевод не найден.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default WordTooltip;