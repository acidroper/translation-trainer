import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-3">
        <SparklesIcon className="w-8 h-8 text-brand-blue" />
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-blue to-brand-light-blue text-transparent bg-clip-text">
          Тренажер Перевода
        </h1>
      </div>
      <p className="mt-2 text-md text-slate-500 dark:text-slate-400">
        Практикуйте перевод с русского на английский и получайте мгновенную обратную связь от ИИ.
      </p>
    </header>
  );
};

export default Header;
