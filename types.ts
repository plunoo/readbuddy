
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
  completedVideos: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  unlockedAt: string;
}

export interface VideoLesson {
  id: string;
  title: string;
  level: number;
  thumbnail: string;
  videoUrl: string;
  duration: string;
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
  elevenLabsVoiceId: string;
}

export interface MasteryRecord {
  soundId: string;
  score: number; // 0-100
  attempts: number;
}
