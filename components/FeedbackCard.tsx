
import React from 'react';
import { TranslationFeedback } from '../types';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface FeedbackCardProps {
  originalSentence: string;
  userTranslation: string;
  feedback: TranslationFeedback;
  onNext: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ originalSentence, userTranslation, feedback, onNext }) => {
  const isCorrect = feedback.isCorrect && !feedback.correctedTranslation;

  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-soft animate-slide-in-up">
      <div className="flex items-start gap-5">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${isCorrect ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900' : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900'}`}>
          {isCorrect ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>
        <div className="flex-1 pt-1">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            {isCorrect ? 'Верно' : 'Требует внимания'}
          </h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
            {feedback.feedback}
          </p>
        </div>
      </div>
      
      <div className="mt-8 border-t border-zinc-100 dark:border-zinc-800 pt-6 space-y-6">
        <div>
          <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Ваш перевод</p>
          <p className="text-base text-zinc-800 dark:text-zinc-200">"{userTranslation}"</p>
        </div>
        
        {feedback.correctedTranslation && (
          <div>
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Исправление</p>
            <p className="text-base text-emerald-600 dark:text-emerald-400 font-medium">"{feedback.correctedTranslation}"</p>
          </div>
        )}

        {feedback.alternatives && feedback.alternatives.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
              Альтернативы
            </h3>
            <ul className="space-y-1.5">
              {feedback.alternatives.map((alt, index) => (
                <li key={index} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start">
                  <span className="mr-2 text-zinc-300 dark:text-zinc-600">•</span>
                  {alt}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-zinc-900 dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
        >
          Далее
          <ChevronRightIcon className="ml-2 -mr-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default FeedbackCard;
