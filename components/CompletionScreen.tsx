
import React from 'react';

interface CompletionScreenProps {
  onRestart: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onRestart }) => {
  return (
    <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg animate-fade-in">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Поздравляем!</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Вы успешно перевели все предложения. Отличная работа!
      </p>
      <div className="mt-6">
        <button
          onClick={onRestart}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light-blue transition-colors"
        >
          Новая тренировка
        </button>
      </div>
    </div>
  );
};

export default CompletionScreen;
