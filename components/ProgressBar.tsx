
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex justify-between mb-2 items-end">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Прогресс</span>
        <span className="text-xs font-medium text-zinc-900 dark:text-white">
          {current} / {total}
        </span>
      </div>
      <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-zinc-900 dark:bg-white h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
