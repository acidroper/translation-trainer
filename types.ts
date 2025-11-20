
export interface TranslationFeedback {
  isCorrect: boolean;
  correctedTranslation: string;
  feedback: string;
  alternatives: string[];
}

export enum AppState {
  Setup = 'SETUP',
  Preview = 'PREVIEW',
  Translating = 'TRANSLATING',
  Feedback = 'FEEDBACK',
  Completed = 'COMPLETED',
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface PracticeSession {
  id: string;
  timestamp: number;
  topic: string;
  difficulty: string;
  size: string;
  style: string;
  sentenceCount: number;
}
