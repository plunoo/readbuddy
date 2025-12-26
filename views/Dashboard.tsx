import React from 'react';
import { ChildProfile } from '../types';
import { PHONICS_LEVELS, AVATARS } from '../constants';

interface DashboardProps {
  profile: ChildProfile | null;
  onNavigate: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, onNavigate }) => {
  if (!profile) return null;

  return (
    <div className="space-y-8 pb-10">
      {/* Profile Summary */}
      <div className="edu-card p-8 flex items-center gap-8 bg-gradient-to-br from-white to-blue-50/20">
        <div className={`w-24 h-24 ${profile.color} rounded-3xl flex items-center justify-center text-5xl shadow-inner border-4 border-white animate-bounce-soft`}>
          {AVATARS[profile.avatar]}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Hi, {profile.name}!</h2>
          <div className="flex gap-4 mt-2 text-xs font-black text-gray-400 uppercase tracking-widest">
            <span className="flex items-center gap-1">🔥 {profile.streak} Day streak</span>
            <span className="flex items-center gap-1">🏆 Level {profile.currentLevel}</span>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="edu-card p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-gray-700 uppercase text-xs tracking-[0.2em]">Next Milestone</h3>
          <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase">
            {1000 - (profile.xp % 1000)} XP to Next Level
          </span>
        </div>
        <div className="progress-track h-6">
          <div 
            className="progress-fill shadow-[0_0_15px_rgba(34,197,94,0.3)]" 
            style={{ width: `${(profile.xp % 1000) / 10}%`, backgroundColor: '#3B82F6' }} 
          />
        </div>
      </div>

      {/* Level Selection Grid */}
      <div className="space-y-5">
        <h3 className="font-black text-gray-900 text-xl px-2 tracking-tight">Your Journey</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PHONICS_LEVELS.map((level) => {
            const isLocked = level.level > profile.currentLevel;
            const isDone = level.level < profile.currentLevel;

            return (
              <button
                key={level.level}
                disabled={isLocked}
                onClick={() => onNavigate('lessons')}
                className={`group edu-card p-6 text-left transition-all flex items-center justify-between border-4 relative overflow-hidden ${
                  isLocked 
                    ? 'bg-gray-50/50 border-gray-100 text-gray-400 opacity-60 shadow-none' 
                    : 'bg-white border-white hover:border-blue-400 hover:-translate-y-1 active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-5 z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110 ${
                    isLocked ? 'bg-gray-100' : isDone ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {isLocked ? '🔒' : isDone ? '✅' : level.level}
                  </div>
                  <div>
                    <p className={`font-black text-lg ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>{level.title}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{level.sounds.length} Phonics Sounds</p>
                  </div>
                </div>
                {!isLocked && <span className="text-gray-200 text-2xl font-black group-hover:text-blue-300 group-hover:translate-x-1 transition-all">›</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;