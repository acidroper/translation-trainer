
import React, { useState } from 'react';
import { TOPICS, DIFFICULTIES, SIZES, STYLES } from '../constants';

interface SetupScreenProps {
  onStart: (topic: string, difficulty: string, size: string, style: string) => void;
  isLoading: boolean;
  error: string | null;
}

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

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading, error }) => {
  const [topic, setTopic] = useState(TOPICS[0].value);
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1].value);
  const [size, setSize] = useState(SIZES[1].value);
  const [style, setStyle] = useState(STYLES[3].value); // Default to Random

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = topic === 'custom' ? customTopic : topic;
    if (!finalTopic.trim()) return;
    onStart(finalTopic, difficulty, size, style);
  };

  const isSubmitDisabled = isLoading || (topic === 'custom' && !customTopic.trim());

  return (
    <div className="animate-fade-in">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">Настройка</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Выберите параметры тренировки.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* Topic Selection */}
        <div>
          <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-500 mb-4 uppercase tracking-wider">
            Темы
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TOPICS.map((t) => {
              const isSelected = topic === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTopic(t.value)}
                  disabled={isLoading}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <span className="text-2xl mb-2">{getTopicEmoji(t.value)}</span>
                  <span className="text-sm font-medium">
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Topic Input */}
          {topic === 'custom' && (
            <div className="mt-4 animate-fade-in">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                disabled={isLoading}
                className="block w-full px-4 py-3 text-sm border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white rounded-xl bg-white dark:bg-zinc-900 dark:text-white placeholder-zinc-400 transition-all"
                placeholder="Например: Квантовая физика..."
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Difficulty Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-500 mb-4 uppercase tracking-wider">
              Сложность
            </label>
            <div className="flex flex-col gap-2">
              {DIFFICULTIES.map((d) => {
                 const isSelected = difficulty === d.value;
                 return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDifficulty(d.value)}
                    disabled={isLoading}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 text-sm ${
                        isSelected 
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white font-semibold' 
                        : 'bg-transparent border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>{d.label}</span>
                    {isSelected && <div className="w-2 h-2 bg-zinc-900 dark:bg-white rounded-full" />}
                  </button>
                 )
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-500 mb-4 uppercase tracking-wider">
              Объем
            </label>
             <div className="flex flex-col gap-2">
              {SIZES.map((s) => {
                 const isSelected = size === s.value;
                 return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSize(s.value)}
                    disabled={isLoading}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 text-sm ${
                        isSelected 
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white font-semibold' 
                        : 'bg-transparent border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>{s.label}</span>
                    {isSelected && <div className="w-2 h-2 bg-zinc-900 dark:bg-white rounded-full" />}
                  </button>
                 )
              })}
            </div>
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-500 mb-4 uppercase tracking-wider">
              Стиль
            </label>
             <div className="flex flex-col gap-2">
              {STYLES.map((s) => {
                 const isSelected = style === s.value;
                 return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStyle(s.value)}
                    disabled={isLoading}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-200 text-sm ${
                        isSelected 
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white font-semibold' 
                        : 'bg-transparent border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>{s.label}</span>
                    {isSelected && <div className="w-2 h-2 bg-zinc-900 dark:bg-white rounded-full" />}
                  </button>
                 )
              })}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium animate-fade-in">
            {error}
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-zinc-900 dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Генерируем...</span>
              </>
            ) : (
              <span>Начать тренировку</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupScreen;
