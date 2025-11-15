
import React, { useState } from 'react';
import { TOPICS, DIFFICULTIES, SIZES } from '../constants';

interface SetupScreenProps {
  onStart: (topic: string, difficulty: string, size: string) => void;
  isLoading: boolean;
  error: string | null;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading, error }) => {
  const [topic, setTopic] = useState(TOPICS[0].value);
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1].value);
  const [size, setSize] = useState(SIZES[1].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = topic === 'custom' ? customTopic : topic;
    if (!finalTopic.trim()) return;
    onStart(finalTopic, difficulty, size);
  };

  const isSubmitDisabled = isLoading || (topic === 'custom' && !customTopic.trim());

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white">Настройте свою тренировку</h2>
      <p className="mt-2 text-center text-slate-500 dark:text-slate-400">Выберите тему, сложность и размер текста для перевода.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Тема
          </label>
          <select
            id="topic"
            name="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-brand-light-blue focus:border-brand-light-blue sm:text-sm rounded-md bg-slate-50 dark:bg-slate-700 dark:text-white"
          >
            {TOPICS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {topic === 'custom' && (
          <div className="animate-fade-in">
            <label htmlFor="custom-topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 sr-only">
              Введите свою тему
            </label>
            <input
              type="text"
              id="custom-topic"
              name="custom-topic"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              disabled={isLoading}
              className="mt-1 block w-full pl-3 pr-4 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-brand-light-blue focus:border-brand-light-blue sm:text-sm rounded-md bg-slate-50 dark:bg-slate-700 dark:text-white"
              placeholder="Введите свою тему..."
              autoFocus
            />
          </div>
        )}

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Сложность
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-brand-light-blue focus:border-brand-light-blue sm:text-sm rounded-md bg-slate-50 dark:bg-slate-700 dark:text-white"
          >
            {DIFFICULTIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Размер текста
          </label>
          <select
            id="size"
            name="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            disabled={isLoading}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-brand-light-blue focus:border-brand-light-blue sm:text-sm rounded-md bg-slate-50 dark:bg-slate-700 dark:text-white"
          >
            {SIZES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {error && <p className="mt-2 text-sm text-center text-brand-red">{error}</p>}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light-blue disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Генерация текста...
              </>
            ) : (
              'Сгенерировать текст'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupScreen;
