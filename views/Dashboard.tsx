
import React from 'react';
import { ChildProfile } from '../types';
import { PHONICS_LEVELS, AVATARS } from '../constants';

interface DashboardProps {
  profile: ChildProfile | null;
  onNavigate: (view: 'dashboard' | 'lessons' | 'library' | 'parent' | 'games') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, onNavigate }) => {
  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <div className="edu-card p-6 flex items-center gap-6">
        <div className={`w-20 h-20 ${profile.color} rounded-2xl flex items-center justify-center text-4xl shadow-sm border-2 border-white`}>
          {AVATARS[profile.avatar]}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Hi, {profile.name}!</h2>
          <div className="flex gap-3 mt-1 text-sm font-medium text-gray-500">
            <span>🔥 {profile.streak} Day streak</span>
            <span>🏆 Level {profile.currentLevel}</span>
          </div>
        </div>
      </div>

      {/* Daily Progress */}
      <div className="edu-card p-6 space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="font-bold text-gray-700">Level Progress</h3>
          <span className="text-xs font-bold text-blue-500 uppercase">{1000 - (profile.xp % 1000)} XP to Next Level</span>
        </div>
        <div className="progress-track h-4">
          <div 
            className="progress-fill" 
            style={{ width: `${(profile.xp % 1000) / 10}%`, backgroundColor: '#3B82F6' }} 
          />
        </div>
      </div>

      {/* Level Selection Grid */}
      <div className="grid grid-cols-1 gap-4">
        <h3 className="font-bold text-gray-800 text-lg px-2">Phonics Journey</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PHONICS_LEVELS.map((level) => {
            const isLocked = level.level > profile.currentLevel;
            const isDone = level.level < profile.currentLevel;

            return (
              <button
                key={level.level}
                disabled={isLocked}
                onClick={() => onNavigate('lessons')}
                className={`p-5 rounded-2xl text-left transition-all flex items-center justify-between border-2 ${
                  isLocked 
                    ? 'bg-gray-50 border-gray-100 text-gray-400' 
                    : 'bg-white border-gray-200 text-gray-800 hover:border-blue-400 hover:shadow-md active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    isLocked ? 'bg-gray-200' : isDone ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {isLocked ? '🔒' : isDone ? '✅' : level.level}
                  </div>
                  <div>
                    <p className="font-bold">{level.title}</p>
                    <p className="text-xs font-medium text-gray-400 uppercase">{level.sounds.length} Sounds</p>
                  </div>
                </div>
                <span className="text-gray-300 text-xl">›</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
