
import React, { useState, useCallback } from 'react';
import { TranslationFeedback, AppState } from './types';
import { evaluateTranslation, generateText } from './services/geminiService';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import SentenceCard from './components/SentenceCard';
import FeedbackCard from './components/FeedbackCard';
import CompletionScreen from './components/CompletionScreen';
import SetupScreen from './components/SetupScreen';
import ChevronLeftIcon from './components/icons/ChevronLeftIcon';
import PreviewScreen from './components/PreviewScreen';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Setup);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userTranslation, setUserTranslation] = useState('');
  const [feedback, setFeedback] = useState<TranslationFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trainingConfig, setTrainingConfig] = useState<{topic: string, difficulty: string, size: string} | null>(null);

  const handleStartTraining = useCallback(async (topic: string, difficulty: string, size: string) => {
    setIsLoading(true);
    setError(null);
    setTrainingConfig({ topic, difficulty, size });
    try {
      const generatedSentences = await generateText(topic, difficulty, size);
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
        const { topic, difficulty, size } = trainingConfig;
        const generatedSentences = await generateText(topic, difficulty, size);
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
      setAppState(AppState.Completed);
    }
  }, [currentSentenceIndex, sentences.length]);
  
  const handleRestart = useCallback(() => {
    setSentences([]);
    setCurrentSentenceIndex(0);
    setUserTranslation('');
    setFeedback(null);
    setError(null);
    setTrainingConfig(null);
    setAppState(AppState.Setup);
  }, []);

  const handleBackToSetup = useCallback(() => {
    if (window.confirm('Вы уверены, что хотите вернуться? Ваш прогресс будет потерян.')) {
        handleRestart();
    }
  }, [handleRestart]);

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        <main className="mt-8">
           {showBackButton && (
              <button 
                  onClick={handleBackToSetup}
                  className="flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-brand-light-blue mb-4 transition-colors"
                  aria-label="Вернуться к выбору темы"
              >
                  <ChevronLeftIcon className="w-4 h-4 mr-1" />
                  К выбору темы
              </button>
           )}
          {showProgressBar && sentences.length > 0 && (
            <ProgressBar current={currentSentenceIndex + 1} total={sentences.length} />
          )}
          <div className="mt-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
