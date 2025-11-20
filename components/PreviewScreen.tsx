
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
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-soft animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-zinc-900 dark:text-white tracking-tight">Обзор</h2>
      <p className="mt-2 text-center text-zinc-500 dark:text-zinc-400">Ознакомьтесь с текстом перед началом.</p>
      
      <div className="mt-8 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl p-8 min-h-[10rem] flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
        {isLoading && sentences.length === 0 ? (
            <div className="flex flex-col items-center gap-3 text-zinc-400">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium">Загрузка...</span>
            </div>
        ) : (
             <div className="max-w-none text-justify leading-relaxed">
                <p className="text-lg sm:text-xl font-serif text-zinc-800 dark:text-zinc-200 leading-relaxed">{sentences.join(' ')}</p>
            </div>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-center text-red-600 dark:text-red-400">{error}</p>}

      <div className="mt-10 flex flex-col sm:flex-row-reverse gap-3 justify-center">
        <button
          onClick={onStart}
          disabled={isLoading || error !== null || sentences.length === 0}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-zinc-900 dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-all"
        >
          Начать
          <ChevronRightIcon className="ml-2 -mr-1 h-4 w-4" />
        </button>
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <RefreshIcon className="-ml-1 mr-2 h-4 w-4" />
          )}
          Другой текст
        </button>
      </div>
    </div>
  );
};

export default PreviewScreen;
