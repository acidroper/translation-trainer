
import React, { useState, useRef, useLayoutEffect } from 'react';
import CheckIcon from './icons/CheckIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import WordTooltip from './WordTooltip';
import { getWordTranslations } from '../services/geminiService';

interface SentenceCardProps {
  sentence: string;
  userTranslation: string;
  setUserTranslation: React.Dispatch<React.SetStateAction<string>>;
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
  const [isListening, setIsListening] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

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
        top: targetRect.bottom - cardRect.top + 10,
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

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Ваш браузер не поддерживает голосовой ввод.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserTranslation((prev: string) => {
        const trimmed = prev.trim();
        return trimmed ? `${trimmed} ${transcript}` : transcript;
      });
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div ref={cardRef} className="relative bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-soft animate-fade-in">
      {tooltipState.position && tooltipState.word && (
        <WordTooltip
          word={tooltipState.word}
          translations={tooltipState.translations}
          isLoading={tooltipState.isLoading}
          position={tooltipState.position}
          onClose={handleCloseTooltip}
        />
      )}
      <div className="mb-10">
        <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 mb-3 uppercase tracking-wider">
          Предложение
        </label>
        <p className="text-xl sm:text-2xl font-serif text-zinc-900 dark:text-white leading-relaxed">
          {sentence.split(/(\s+)/).map((segment, index) => {
            if (segment.trim().length > 0) {
              return (
                <span
                  key={index}
                  className="cursor-pointer hover:text-brand-accent transition-colors border-b border-dotted border-zinc-300 dark:border-zinc-700 hover:border-brand-accent pb-0.5"
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
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-3">
           <label htmlFor="user-translation" className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Перевод
          </label>
        </div>
        
        <div className="relative">
          <textarea
            ref={textareaRef}
            id="user-translation"
            rows={1}
            className="block w-full rounded-xl border border-zinc-300 dark:border-zinc-700 shadow-none focus:border-zinc-900 dark:focus:border-white focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white sm:text-lg bg-transparent text-zinc-900 dark:text-white placeholder-zinc-400 py-4 px-4 pr-12 resize-none overflow-hidden transition-all duration-200 min-h-[60px]"
            placeholder="Введите перевод на английском..."
            value={userTranslation}
            onChange={(e) => setUserTranslation(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleTextareaFocus}
            disabled={isLoading}
          ></textarea>
          
          <button
            onClick={toggleListening}
            className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all duration-200 ${
              isListening 
                ? 'bg-red-50 text-red-600 animate-pulse' 
                : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title={isListening ? "Остановить" : "Голос"}
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="mt-10 flex justify-end">
        <button
          onClick={onCheckTranslation}
          disabled={isLoading || !userTranslation.trim()}
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-zinc-900 dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 dark:focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Проверка
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
