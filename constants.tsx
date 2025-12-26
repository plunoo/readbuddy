
import React from 'react';
import { Lesson, AvatarType } from './types';

export const AVATARS: Record<AvatarType, string> = {
  Robot: '🤖',
  Cat: '🐱',
  Bear: '🐻',
  Owl: '🦉'
};

export const COLORS = [
  'bg-purple-500', 'bg-blue-500', 'bg-pink-500', 'bg-green-500',
  'bg-yellow-500', 'bg-orange-500', 'bg-indigo-500', 'bg-red-500'
];

export const PHONICS_LEVELS = [
  { level: 1, title: 'Letter Fundamentals', sounds: ['s', 'a', 't', 'p', 'i', 'n', 'm', 'd'] },
  { level: 2, title: 'Bouncing Sounds', sounds: ['g', 'o', 'c', 'k', 'ck', 'e', 'u', 'r'] },
  { level: 3, title: 'The Loud Crowd', sounds: ['h', 'b', 'f', 'ff', 'l', 'll', 'ss'] },
  { level: 4, title: 'Wiggly Waves', sounds: ['j', 'v', 'w', 'x', 'y', 'z', 'zz', 'qu'] },
  { level: 5, title: 'Dynamic Digraphs', sounds: ['ch', 'sh', 'th', 'ng'] },
  { level: 6, title: 'Vowel Victories', sounds: ['ai', 'ee', 'igh', 'oa', 'oo'] }
];

export const BADGE_TIERS = [
  { id: 'pioneer', name: 'Phoneme Pioneer', threshold: 50, icon: '🏆' },
  { id: 'buddy', name: 'Blending Buddy', threshold: 200, icon: '🌟' },
  { id: 'rockstar', name: 'Reading Rockstar', threshold: 500, icon: '🎸' },
  { id: 'professor', name: 'Phonics Professor', threshold: 1000, icon: '🎓' }
];

export const generateLessonsForLevel = (level: number): Lesson[] => {
  const info = PHONICS_LEVELS.find(l => l.level === level);
  if (!info) return [];

  return [
    {
      id: `l${level}-1`,
      level,
      title: 'Sound Recognition',
      sounds: info.sounds,
      words: [],
      type: 'isolation'
    },
    {
      id: `l${level}-2`,
      level,
      title: 'Blending Magic',
      sounds: info.sounds,
      words: info.sounds.map(s => s + 'at'), // simplified mock
      type: 'blending'
    }
  ];
};
