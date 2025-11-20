
import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import MonitorIcon from './icons/MonitorIcon';
import ClockIcon from './icons/ClockIcon';
import { ThemeMode } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenHistory: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onOpenHistory }) => {
  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <SunIcon className="w-4 h-4" />;
      case 'dark': return <MoonIcon className="w-4 h-4" />;
      case 'system': return <MonitorIcon className="w-4 h-4" />;
    }
  };

  return (
    <header className="w-full flex items-center justify-between py-4">
      <div className="flex items-center gap-2.5 select-none">
        <div className="text-zinc-900 dark:text-white">
          <SparklesIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
            LingoTrainer
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
            onClick={onOpenHistory}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
            title="История тренировок"
            aria-label="Open History"
        >
            <ClockIcon className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
          title={`Тема: ${theme === 'system' ? 'Системная' : theme === 'light' ? 'Светлая' : 'Темная'}`}
          aria-label="Toggle theme"
        >
          {getThemeIcon()}
        </button>
      </div>
    </header>
  );
};

export default Header;
