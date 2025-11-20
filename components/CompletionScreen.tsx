
import React from 'react';

interface CompletionScreenProps {
  onRestart: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onRestart }) => {
  return (
    <div className="text-center bg-white dark:bg-zinc-900 p-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-soft animate-fade-in">
      <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full mx-auto flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Готово</h2>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        Тренировка завершена.
      </p>
      <div className="mt-8">
        <button
          onClick={onRestart}
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-zinc-900 dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
        >
          Начать заново
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen;
