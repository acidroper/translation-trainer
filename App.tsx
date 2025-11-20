
import React, { useState, useCallback, useEffect } from 'react';
import { TranslationFeedback, AppState, ThemeMode, PracticeSession } from './types';
import { evaluateTranslation, generateText } from './services/geminiService';
import { saveSession, getHistory, clearHistory } from './services/historyService';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import SentenceCard from './components/SentenceCard';
import FeedbackCard from './components/FeedbackCard';
import CompletionScreen from './components/CompletionScreen';
import SetupScreen from './components/SetupScreen';
import ChevronLeftIcon from './components/icons/ChevronLeftIcon';
import PreviewScreen from './components/PreviewScreen';
import ConfirmationModal from './components/ConfirmationModal';
import HistoryModal from './components/HistoryModal';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Setup);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userTranslation, setUserTranslation] = useState('');
  const [feedback, setFeedback] = useState<TranslationFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trainingConfig, setTrainingConfig] = useState<{topic: string, difficulty: string, size: string, style: string} | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<PracticeSession[]>([]);
  
  // Theme Management
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return (savedTheme as ThemeMode) || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (mode: ThemeMode) => {
      root.classList.remove('light', 'dark');
      if (mode === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(mode);
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    // Listener for system theme changes if in system mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
      setHistory(getHistory());
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };


  const handleStartTraining = useCallback(async (topic: string, difficulty: string, size: string, style: string) => {
    setIsLoading(true);
    setError(null);
    setTrainingConfig({ topic, difficulty, size, style });
    try {
      const generatedSentences = await generateText(topic, difficulty, size, style);
      if (!generatedSentences || generatedSentences.length === 0) {
        throw new Error("Generated text was empty or invalid.");
      }
      setSentences(generatedSentences);
      setCurrentSentenceIndex(0);
      setUserTranslation('');
      setFeedback(null);
      setAppState(AppState.Preview);
    } catch (e) {
      setError('Не удалось сгенерировать текст. Пожалуйста, попробуйте еще раз.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRegenerateText = useCallback(async () => {
    if (!trainingConfig) return;
    setIsLoading(true);
    setError(null);
    try {
        const { topic, difficulty, size, style } = trainingConfig;
        const generatedSentences = await generateText(topic, difficulty, size, style);
        if (!generatedSentences || generatedSentences.length === 0) {
            throw new Error("Generated text was empty or invalid.");
        }
        setSentences(generatedSentences);
    } catch (e) {
        setError('Не удалось перегенерировать текст. Пожалуйста, попробуйте еще раз.');
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  }, [trainingConfig]);

  const handleConfirmTextAndStart = useCallback(() => {
      setAppState(AppState.Translating);
  }, []);

  const handleCheckTranslation = useCallback(async () => {
    if (!userTranslation.trim()) return;

    setIsLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const originalSentence = sentences[currentSentenceIndex];
      const result = await evaluateTranslation(originalSentence, userTranslation);
      setFeedback(result);
      setAppState(AppState.Feedback);
    } catch (e) {
      setError('Не удалось получить обратную связь. Пожалуйста, попробуйте еще раз.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [currentSentenceIndex, userTranslation, sentences]);

  const handleNextSentence = useCallback(() => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
      setUserTranslation('');
      setFeedback(null);
      setError(null);
      setAppState(AppState.Translating);
    } else {
      // Session Completed - Save History
      if (trainingConfig) {
          const newSession: PracticeSession = {
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              topic: trainingConfig.topic,
              difficulty: trainingConfig.difficulty,
              size: trainingConfig.size,
              style: trainingConfig.style,
              sentenceCount: sentences.length
          };
          saveSession(newSession);
          setHistory(getHistory());
      }
      setAppState(AppState.Completed);
    }
  }, [currentSentenceIndex, sentences.length, trainingConfig]);
  
  const handleRestart = useCallback(() => {
    setSentences([]);
    setCurrentSentenceIndex(0);
    setUserTranslation('');
    setFeedback(null);
    setError(null);
    setTrainingConfig(null);
    setAppState(AppState.Setup);
    setIsConfirmModalOpen(false);
  }, []);

  const handleBackToSetup = useCallback(() => {
    if (appState === AppState.Preview || appState === AppState.Completed) {
        handleRestart();
    } else {
        setIsConfirmModalOpen(true);
    }
  }, [appState, handleRestart]);

  const handleClearHistory = useCallback(() => {
      clearHistory();
      setHistory([]);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.Setup:
        return <SetupScreen onStart={handleStartTraining} isLoading={isLoading} error={error} />;
      case AppState.Preview:
        return (
          <PreviewScreen
            sentences={sentences}
            onStart={handleConfirmTextAndStart}
            onRegenerate={handleRegenerateText}
            isLoading={isLoading}
            error={error}
          />
        );
      case AppState.Translating:
        return (
          <SentenceCard
            sentence={sentences[currentSentenceIndex]}
            userTranslation={userTranslation}
            setUserTranslation={setUserTranslation}
            onCheckTranslation={handleCheckTranslation}
            isLoading={isLoading}
            error={error}
          />
        );
      case AppState.Feedback:
        return feedback && (
          <FeedbackCard
            originalSentence={sentences[currentSentenceIndex]}
            userTranslation={userTranslation}
            feedback={feedback}
            onNext={handleNextSentence}
          />
        );
      case AppState.Completed:
        return <CompletionScreen onRestart={handleRestart} />;
      default:
        return null;
    }
  };

  const showProgressBar = appState === AppState.Translating || appState === AppState.Feedback;
  const showBackButton = appState === AppState.Preview || appState === AppState.Translating || appState === AppState.Feedback;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300">
      <div className="w-full max-w-3xl mx-auto">
        <Header 
            theme={theme} 
            onToggleTheme={toggleTheme} 
            onOpenHistory={() => setIsHistoryOpen(true)}
        />
        
        <main className="mt-12">
           {showBackButton && (
              <div className="mb-8">
                <button 
                    onClick={handleBackToSetup}
                    className="group flex items-center text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
                    aria-label="Вернуться к выбору темы"
                >
                    <div className="mr-2 p-1 rounded-md bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                      <ChevronLeftIcon className="w-4 h-4" />
                    </div>
                    К выбору темы
                </button>
              </div>
           )}

          {showProgressBar && sentences.length > 0 && (
            <ProgressBar current={currentSentenceIndex + 1} total={sentences.length} />
          )}

          <div className="mt-6">
            {renderContent()}
          </div>
        </main>
      </div>

      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onConfirm={handleRestart}
        onCancel={() => setIsConfirmModalOpen(false)}
        title="Закончить тренировку?"
        message="Ваш текущий прогресс будет потерян."
      />

      <HistoryModal 
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onClear={handleClearHistory}
      />
    </div>
  );
};

export default App;
