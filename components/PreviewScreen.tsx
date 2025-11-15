
import React from 'react';
import ChevronRightIcon from './icons/ChevronRightIcon';
import RefreshIcon from './icons/RefreshIcon';

interface PreviewScreenProps {
  sentences: string[];
  onStart: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
  error: string | null;
}

const PreviewScreen: React.FC<PreviewScreenProps> = ({ sentences, onStart, onRegenerate, isLoading, error }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white">Ваш текст для тренировки</h2>
      <p className="mt-2 text-center text-slate-500 dark:text-slate-400">Ознакомьтесь с текстом. Если он вам нравится, начните тренировку.</p>
      
      <div className="mt-6 border-t border-b border-slate-200 dark:border-slate-700 py-6 min-h-[10rem] flex items-center justify-center">
        {isLoading && sentences.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400">Генерация текста...</div>
        ) : (
             <div className="prose prose-slate dark:prose-invert max-w-none text-justify">
                <p>{sentences.join(' ')}</p>
            </div>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-center text-brand-red">{error}</p>}

      <div className="mt-8 flex flex-col sm:flex-row-reverse gap-4 justify-center">
        <button
          onClick={onStart}
          disabled={isLoading || error !== null || sentences.length === 0}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light-blue disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          Начать тренировку
          <ChevronRightIcon className="ml-2 -mr-1 h-5 w-5" />
        </button>
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <RefreshIcon className="-ml-1 mr-2 h-5 w-5" />
          )}
          Сгенерировать заново
        </button>
      </div>
    </div>
  );
};

export default PreviewScreen;
