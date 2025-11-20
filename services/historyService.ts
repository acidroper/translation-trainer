import { PracticeSession } from '../types';

const STORAGE_KEY = 'lingotrainer_history';

export const getHistory = (): PracticeSession[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load history', error);
    return [];
  }
};

export const saveSession = (session: PracticeSession): void => {
  try {
    const history = getHistory();
    const updated = [session, ...history].slice(0, 50); // Keep last 50 sessions
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save session', error);
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history', error);
  }
};
