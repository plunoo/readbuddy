
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
  { level: 1, title: 'Vowels First - A, E, I, O, U', sounds: ['a', 'e', 'i', 'o', 'u'] },
  { level: 2, title: 'Easy Consonants', sounds: ['b', 'c', 'd', 'f', 'g', 'h', 'j'] },
  { level: 3, title: 'More Consonants', sounds: ['k', 'l', 'm', 'n', 'p', 'q', 'r'] },
  { level: 4, title: 'Final Consonants', sounds: ['s', 't', 'v', 'w', 'x', 'y', 'z'] },
  { level: 5, title: 'Dynamic Digraphs', sounds: ['ch', 'sh', 'th', 'ng'] },
  { level: 6, title: 'Long Vowel Patterns', sounds: ['ai', 'ee', 'igh', 'oa', 'oo'] }
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
