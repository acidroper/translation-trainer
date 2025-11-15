
import React, { useState, useRef, useLayoutEffect } from 'react';
import CheckIcon from './icons/CheckIcon';
import WordTooltip from './WordTooltip';
import { getWordTranslations } from '../services/geminiService';

interface SentenceCardProps {
  sentence: string;
  userTranslation: string;
  setUserTranslation: (value: string) => void;
  onCheckTranslation: () => void;
  isLoading: boolean;
  error: string | null;
}

const SentenceCard: React.FC<SentenceCardProps> = ({
  sentence,
  userTranslation,
  setUserTranslation,
  onCheckTranslation,
  isLoading,
  error,
}) => {
  const [tooltipState, setTooltipState] = useState<{
    word: string | null;
    cleanedWord: string | null;
    translations: string[];
    isLoading: boolean;
    position: { top: number; left: number } | null;
  }>({
    word: null,
    cleanedWord: null,
    translations: [],
    isLoading: false,
    position: null,
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [userTranslation]);

  const handleCloseTooltip = () => {
    setTooltipState({ word: null, cleanedWord: null, translations: [], isLoading: false, position: null });
  };

  const handleWordClick = async (word: string, event: React.MouseEvent<HTMLSpanElement>) => {
    const cleanedWord = word.replace(/[.,!?;:()"“”—-]/g, '').toLowerCase();
    if (!cleanedWord) return;

    if (cleanedWord === tooltipState.cleanedWord) {
      handleCloseTooltip();
      return;
    }

    const targetRect = event.currentTarget.getBoundingClientRect();
    const cardRect = cardRef.current?.getBoundingClientRect();
    if (!cardRect) return;

    setTooltipState({
      word: word.replace(/[.,!?;:()"“”—-]/g, ''),
      cleanedWord: cleanedWord,
      translations: [],
      isLoading: true,
      position: {
        top: targetRect.bottom - cardRect.top + 8,
        left: targetRect.left - cardRect.left,
      },
    });

    const translations = await getWordTranslations(cleanedWord);

    setTooltipState(prevState => {
      if (prevState.cleanedWord === cleanedWord) {
        return { ...prevState, translations, isLoading: false };
      }
      return prevState;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onCheckTranslation();
    }
  };

  const handleTextareaFocus = () => {
    if (tooltipState.position) {
      handleCloseTooltip();
    }
  };

  return (
    <div ref={cardRef} className="relative bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      {tooltipState.position && tooltipState.word && (
        <WordTooltip
          word={tooltipState.word}
          translations={tooltipState.translations}
          isLoading={tooltipState.isLoading}
          position={tooltipState.position}
          onClose={handleCloseTooltip}
        />
      )}
      <div>
        <label htmlFor="original-sentence" className="block text-sm font-medium text-slate-500 dark:text-slate-400">
          Предложение на русском (нажмите на слово для перевода)
        </label>
        <p id="original-sentence" className="mt-2 text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
          {sentence.split(/(\s+)/).map((segment, index) => {
            if (segment.trim().length > 0) {
              return (
                <span
                  key={index}
                  className="cursor-pointer hover:bg-blue-100 dark:hover:bg-slate-700 rounded p-1 -m-1 transition-colors"
                  onClick={(e) => handleWordClick(segment, e)}
                >
                  {segment}
                </span>
              );
            }
            return <span key={index}>{segment}</span>;
          })}
        </p>
      </div>
      <div className="mt-6">
        <label htmlFor="user-translation" className="block text-sm font-medium text-slate-500 dark:text-slate-400">
          Ваш перевод на английский
        </label>
        <div className="relative mt-1">
          <textarea
            ref={textareaRef}
            id="user-translation"
            rows={2}
            className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-brand-light-blue focus:ring-2 focus:ring-brand-light-blue/50 sm:text-sm bg-slate-50 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 p-3 resize-none overflow-hidden transition-shadow"
            placeholder="Введите ваш перевод на английский..."
            value={userTranslation}
            onChange={(e) => setUserTranslation(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleTextareaFocus}
            disabled={isLoading}
          ></textarea>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-brand-red">{error}</p>}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onCheckTranslation}
          disabled={isLoading || !userTranslation.trim()}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light-blue disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Проверка...
            </>
          ) : (
            <>
              <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
              Проверить
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SentenceCard;