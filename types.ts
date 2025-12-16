export interface Word {
  id: string;
  russian: string;
  azerbaijani: string;
  transcription?: string; // e.g. [saba'ka]
  example_ru?: string;
  example_az?: string;
  level: string; // A1, A2, etc. (Visual label)
  learned: boolean;
  nextReviewDate?: number;
  difficulty?: 'hard' | 'normal' | 'easy';
}

export interface User {
  id: string;
  name: string;
  xp: number;
  streak: number;
  wordsLearned: number;
  totalWords: number;
  joinedDate: string;
  role: 'user' | 'admin';
  // Daily tracking & Energy
  lastActivityDate: string; // ISO date string YYYY-MM-DD
  dailyNewWords: number;
  dailyReviewCount: number;
  streakUpdatedToday: boolean;
  // Level System
  currentLevel: number; // Starts at 1
  dailyEnergy: number; // Max 2 per day
}

export interface GrammarLesson {
  id: string;
  title: string;
  subtitle: string; // Translation or subtitle
  content: string;
  status: 'locked' | 'unlocked' | 'completed';
  progress: number; // 0 to 1
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  timestamp: number;
}

export enum AppView {
  HOME = 'HOME',
  LEARN = 'LEARN', // Shows Level List
  GAME = 'GAME',   // Shows Active Flashcards
  GRAMMAR = 'GRAMMAR',
  // Hidden/Admin views
  CHAT = 'CHAT',
  ADMIN = 'ADMIN',
}