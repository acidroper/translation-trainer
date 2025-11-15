
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
