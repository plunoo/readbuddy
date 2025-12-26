
<<<<<<< HEAD
export type AvatarType = 'Robot' | 'Cat' | 'Bear' | 'Owl';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: AvatarType;
  color: string;
  currentLevel: number;
  xp: number;
  stars: number;
  badges: Badge[];
  streak: number;
  lastPlayed: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  unlockedAt: string;
}

export interface Lesson {
  id: string;
  level: number;
  title: string;
  sounds: string[];
  words: string[];
  type: 'isolation' | 'blending' | 'segmenting' | 'manipulation';
}

export interface AppSettings {
  dyslexiaFriendly: boolean;
  voiceVolume: number;
  isAudioEnabled: boolean;
}

export interface MasteryRecord {
  soundId: string;
  score: number; // 0-100
  attempts: number;
=======
export type Screen = 'HOME' | 'LESSON' | 'REWARDS' | 'GAMES' | 'READING';

export interface PhonicsLesson {
  word: string;
  targetSound: string;
  choices: string[];
  correctIndex: number;
}

export interface UserProgress {
  soundsUnlocked: number;
  stickers: string[];
  masteredToday: number;
  currentStreak: number;
  longestStreak: number;
  dailyGoal: number;
  lastPlayedDate: string;
  badges: Achievement[];
  difficulty: 'easy' | 'medium' | 'hard';
  recentPerformance: number[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'streak' | 'mastery' | 'daily' | 'special';
}

export interface AppSettings {
  dyslexiaMode: boolean;
  voiceVolume: number;
>>>>>>> 3efe4a8ba51b2caf4678c0cfefe30431b1f1ce7c
}
