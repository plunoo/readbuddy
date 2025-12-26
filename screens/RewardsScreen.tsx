
import React, { useEffect } from 'react';
import { UserProgress, Achievement } from '../types';
import { speak } from '../services/voiceService';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface RewardsScreenProps {
  progress: UserProgress;
  onBack: () => void;
}

const DATA = [
  { day: 'M', score: 3 },
  { day: 'T', score: 5 },
  { day: 'W', score: 2 },
  { day: 'T', score: 4 },
  { day: 'F', score: 1 },
];

const RewardsScreen: React.FC<RewardsScreenProps> = ({ progress, onBack }) => {
  useEffect(() => {
    speak("Look at all your stickers! You are a superstar!");
  }, []);

  const handleShare = () => {
    speak("Sending your success to Mom and Dad!");
    if (navigator.share) {
      navigator.share({
        title: 'ReadBuddy Progress!',
        text: `Look what I learned today! I have ${progress.soundsUnlocked} sounds mastered!`,
      }).catch(console.error);
    } else {
      alert("Shared with parents! ✉️");
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-yellow-50 via-white to-purple-50 overflow-y-auto">
      {/* Header */}
      <div className="p-6 bg-yellow-400 text-white flex justify-between items-center">
        <button onClick={onBack} className="text-2xl font-bold">⬅ Home</button>
        <h1 className="text-2xl font-black">MY TROPHIES</h1>
        <div className="w-8" />
      </div>

      <div className="p-6 space-y-8">
        {/* Achievement Badges */}
        <section>
          <h2 className="text-xl font-black text-blue-900 mb-4 flex items-center gap-2">
            <span>Achievement Badges</span>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">{progress.badges.length}</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {progress.badges.map((badge, i) => (
              <div 
                key={badge.id} 
                className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-2xl border-2 border-purple-200 hover:scale-105 transition-all duration-300 transform"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2 animate-bounce">{badge.icon}</div>
                  <div className="text-lg font-black text-purple-900">{badge.name}</div>
                  <div className="text-sm text-purple-600">{badge.description}</div>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold mt-2 ${
                    badge.category === 'streak' ? 'bg-orange-100 text-orange-700' :
                    badge.category === 'daily' ? 'bg-green-100 text-green-700' :
                    badge.category === 'mastery' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {badge.category.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stickers */}
        <section>
          <h2 className="text-xl font-black text-blue-900 mb-4 flex items-center gap-2">
            <span>Sticker Collection</span>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{progress.stickers.length}/24</span>
          </h2>
          <div className="grid grid-cols-4 gap-4 bg-slate-50 p-6 rounded-3xl min-h-[200px] border-4 border-dashed border-slate-200">
            {progress.stickers.map((emoji, i) => (
              <div key={i} className="text-4xl flex items-center justify-center bg-white rounded-2xl aspect-square shadow-sm hover:scale-110 transition-transform duration-200 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                {emoji}
              </div>
            ))}
            {Array.from({ length: Math.max(0, 8 - progress.stickers.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-slate-200 rounded-2xl aspect-square opacity-50" />
            ))}
          </div>
        </section>

        {/* Weekly Chart */}
        <section>
          <h2 className="text-xl font-black text-blue-900 mb-4">Mastered This Week</h2>
          <div className="h-48 w-full bg-blue-50 rounded-3xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <Bar dataKey="score" radius={[10, 10, 0, 0]}>
                  {DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === DATA.length - 1 ? '#3B82F6' : '#93C5FD'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Share Button */}
        <button 
          onClick={handleShare}
          className="w-full h-[70px] bg-green-500 hover:bg-green-600 hover:scale-105 text-white text-xl font-black rounded-2xl shadow-[0_6px_0_#15803D] hover:shadow-[0_8px_0_#15803D] active:shadow-none active:translate-y-1 transition-all duration-200 transform flex items-center justify-center gap-4"
        >
          <span>SHARE WITH PARENT</span>
          <span className="text-2xl animate-bounce">👨‍👩‍👧</span>
        </button>
        
        <div className="h-12" />
      </div>
    </div>
  );
};

export default RewardsScreen;
