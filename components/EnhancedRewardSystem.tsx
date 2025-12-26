import React, { useState, useEffect } from 'react';
import { Achievement, UserProgress } from '../types';
import { speak } from '../services/voiceService';

interface RewardTier {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirements: {
    streak?: number;
    phonemes?: number;
    accuracy?: number;
    consistency?: number; // days per week
  };
  rewards: {
    stickers: string[];
    certificates: string[];
    unlocks: string[];
  };
}

// Research-based reward tiers that motivate without over-rewarding
const REWARD_TIERS: RewardTier[] = [
  {
    id: 'phoneme_pioneer',
    name: 'Phoneme Pioneer',
    description: 'Master your first 5 letter sounds!',
    icon: '🔤',
    requirements: { phonemes: 5 },
    rewards: {
      stickers: ['📚', '⭐', '🎯'],
      certificates: ['First Sounds Certificate'],
      unlocks: ['New story unlocked!']
    }
  },
  {
    id: 'blending_buddy',
    name: 'Blending Buddy', 
    description: 'Successfully blend 10 words!',
    icon: '🌊',
    requirements: { phonemes: 10, accuracy: 80 },
    rewards: {
      stickers: ['🌈', '🎪', '🏆'],
      certificates: ['Blending Master Certificate'],
      unlocks: ['Advanced games unlocked!']
    }
  },
  {
    id: 'reading_rockstar',
    name: 'Reading Rockstar',
    description: 'Read for 7 days straight!',
    icon: '🎸',
    requirements: { streak: 7, consistency: 7 },
    rewards: {
      stickers: ['🎸', '⚡', '🌟', '🎵'],
      certificates: ['Weekly Champion Certificate'],
      unlocks: ['New robot expressions!', 'Custom avatar colors!']
    }
  },
  {
    id: 'phonics_professor',
    name: 'Phonics Professor',
    description: 'Master 25 phonemes with 90% accuracy!',
    icon: '🎓',
    requirements: { phonemes: 25, accuracy: 90 },
    rewards: {
      stickers: ['🎓', '📖', '🧠', '💎', '👑'],
      certificates: ['Phonics Expert Certificate'],
      unlocks: ['Teacher mode unlocked!', 'Create your own lessons!']
    }
  }
];

interface ProgressCelebrationProps {
  progress: UserProgress;
  onClose: () => void;
  newAchievements: Achievement[];
}

const ProgressCelebration: React.FC<ProgressCelebrationProps> = ({ progress, onClose, newAchievements }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [currentAchievement, setCurrentAchievement] = useState(0);

  useEffect(() => {
    if (newAchievements.length > 0) {
      speak(`Incredible! You earned ${newAchievements.length} new ${newAchievements.length > 1 ? 'achievements' : 'achievement'}!`);
    }
  }, [newAchievements]);

  const nextAchievement = () => {
    if (currentAchievement < newAchievements.length - 1) {
      setCurrentAchievement(currentAchievement + 1);
    } else {
      onClose();
    }
  };

  if (newAchievements.length === 0) return null;

  const achievement = newAchievements[currentAchievement];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '✨', '🌟', '🎊', '🏆'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Achievement Card */}
      <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl border-4 border-yellow-400">
        <div className="text-8xl mb-4 animate-pulse">{achievement.icon}</div>
        
        <h2 className="text-3xl font-black text-purple-800 mb-2">
          {achievement.name}
        </h2>
        
        <p className="text-lg text-purple-600 mb-6">
          {achievement.description}
        </p>

        {/* Progress stats */}
        <div className="bg-purple-50 rounded-2xl p-4 mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="font-bold text-purple-700">Reading Streak:</span>
            <span className="text-purple-800">{progress.currentStreak} days 🔥</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-purple-700">Sounds Mastered:</span>
            <span className="text-purple-800">{progress.soundsUnlocked} 🔤</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold text-purple-700">Total Badges:</span>
            <span className="text-purple-800">{progress.badges.length} 🏆</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={nextAchievement}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95"
          >
            {currentAchievement < newAchievements.length - 1 ? 'Next' : 'Amazing!'}
          </button>
        </div>

        {/* Progress indicator */}
        {newAchievements.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {newAchievements.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentAchievement ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface MotivationalMessagesProps {
  progress: UserProgress;
  onMotivate: () => void;
}

const MotivationalMessages: React.FC<MotivationalMessagesProps> = ({ progress, onMotivate }) => {
  const getMotivationalMessage = (): string => {
    const accuracy = progress.recentPerformance.reduce((a, b) => a + b, 0) / progress.recentPerformance.length;
    const streak = progress.currentStreak;
    
    if (accuracy >= 0.9) {
      return "You're absolutely crushing it! Your reading skills are amazing! 🌟";
    } else if (accuracy >= 0.7) {
      return "Great progress! You're getting stronger every day! 💪";
    } else if (streak >= 5) {
      return "Your dedication is incredible! Keep up the fantastic work! 🔥";
    } else if (progress.masteredToday >= progress.dailyGoal) {
      return "Goal achieved! You're becoming a reading superstar! ⭐";
    } else {
      return "Every great reader started just like you! You've got this! 📚";
    }
  };

  const message = getMotivationalMessage();

  return (
    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl p-6 border-2 border-yellow-300 shadow-lg">
      <div className="text-center">
        <div className="text-4xl mb-3">🌟</div>
        <p className="text-lg font-bold text-orange-800 mb-4">{message}</p>
        <button
          onClick={() => {
            speak(message);
            onMotivate();
          }}
          className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95"
        >
          Keep Going! 🚀
        </button>
      </div>
    </div>
  );
};

// Progress visualization component
interface ProgressVisualizationProps {
  progress: UserProgress;
}

const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({ progress }) => {
  const weeklyGoal = progress.dailyGoal * 7;
  const weeklyProgress = progress.masteredToday; // This would be enhanced to track weekly

  return (
    <div className="space-y-6">
      {/* Phoneme mastery progress */}
      <div className="bg-blue-50 rounded-2xl p-4">
        <h3 className="font-bold text-blue-800 mb-3">Phoneme Journey</h3>
        <div className="relative">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-blue-600">Beginner</span>
            <span className="text-sm text-blue-600">Expert</span>
          </div>
          <div className="h-4 bg-blue-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((progress.soundsUnlocked / 44) * 100, 100)}%` }}
            />
          </div>
          <div className="text-center mt-2 text-blue-700 font-bold">
            {progress.soundsUnlocked}/44 Phonemes
          </div>
        </div>
      </div>

      {/* Consistency tracker */}
      <div className="bg-green-50 rounded-2xl p-4">
        <h3 className="font-bold text-green-800 mb-3">Weekly Consistency</h3>
        <div className="grid grid-cols-7 gap-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-green-600 mb-1">{day}</div>
              <div className={`h-8 rounded ${index <= 4 ? 'bg-green-400' : 'bg-green-200'}`} />
            </div>
          ))}
        </div>
        <div className="text-center mt-2 text-green-700 font-bold">
          5/7 Days This Week
        </div>
      </div>
    </div>
  );
};

export { ProgressCelebration, MotivationalMessages, ProgressVisualization, REWARD_TIERS };