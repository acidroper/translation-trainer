
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
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg animate-slide-in-up">
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-100 dark:bg-green-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
          {isCorrect ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div>
          <h2 className={`text-xl font-bold ${isCorrect ? 'text-brand-green' : 'text-brand-yellow'}`}>
            {isCorrect ? 'Отличная работа!' : 'Есть над чем поработать'}
          </h2>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            {feedback.feedback}
          </p>
        </div>
      </div>
      
      <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ваш перевод:</p>
          <p className="text-slate-700 dark:text-slate-200 pl-2 border-l-2 border-slate-300 dark:border-slate-600 ml-2">"{userTranslation}"</p>
        </div>
        
        {feedback.correctedTranslation && (
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Исправленный вариант:</p>
            <p className="text-brand-green dark:text-green-400 font-semibold pl-2 border-l-2 border-green-500 dark:border-green-400 ml-2">"{feedback.correctedTranslation}"</p>
          </div>
        )}

        {feedback.alternatives && feedback.alternatives.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              Другие возможные варианты:
            </h3>
            <ul className="space-y-2">
              {feedback.alternatives.map((alt, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-brand-light-blue mr-2 mt-1">&#8226;</span>
                  <span className="text-slate-700 dark:text-slate-200">{alt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onNext}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light-blue transition-colors"
        >
          Далее
          <ChevronRightIcon className="ml-2 -mr-1 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default FeedbackCard;
