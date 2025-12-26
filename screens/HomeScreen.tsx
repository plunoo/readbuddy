
import React, { useEffect } from 'react';
import RobotAvatar from '../components/RobotAvatar';
import { UserProgress, Screen } from '../types';
import { speak } from '../services/voiceService';

interface HomeScreenProps {
  progress: UserProgress;
  onPlay: () => void;
  onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ progress, onPlay, onNavigate }) => {
  useEffect(() => {
    speak("Hi Read Buddy! Ready to play?");
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-transparent to-white/50">
      {/* Top Header & Progress */}
      <div className="w-full space-y-4 pt-8">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-blue-900">Day {progress.currentStreak}</span>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-sm text-gray-600">Goal</div>
              <div className="text-blue-600 font-bold">{progress.masteredToday}/{progress.dailyGoal}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Sounds</div>
              <div className="text-blue-600 font-bold">{progress.soundsUnlocked}</div>
            </div>
          </div>
        </div>
        
        {/* Daily Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Daily Goal Progress</span>
            <span>{Math.round((progress.masteredToday / progress.dailyGoal) * 100)}%</span>
          </div>
          <div className="h-4 w-full bg-white rounded-full p-1 shadow-inner border border-blue-100">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                progress.masteredToday >= progress.dailyGoal ? 'bg-green-400' : 'bg-yellow-400'
              }`}
              style={{ width: `${Math.min((progress.masteredToday / progress.dailyGoal) * 100, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Streak Counter */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-sm text-orange-700">Learning Streak</div>
                <div className="font-black text-orange-900">{progress.currentStreak} days</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-orange-700">Difficulty</div>
              <div className={`font-bold px-2 py-1 rounded text-xs ${
                progress.difficulty === 'easy' ? 'bg-green-200 text-green-800' :
                progress.difficulty === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                'bg-red-200 text-red-800'
              }`}>
                {progress.difficulty.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Robot */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-400/20 rounded-full animate-pulse" />
          <RobotAvatar expression="idle" size="lg" />
        </div>
        <button 
          onClick={() => {
            speak("Let's go!");
            onPlay();
          }}
          className="h-[80px] px-12 bg-blue-500 hover:bg-blue-600 hover:scale-105 text-white text-2xl font-black rounded-full shadow-[0_8px_0_#1E40AF] hover:shadow-[0_10px_0_#1E40AF] active:shadow-none active:translate-y-2 transition-all duration-200 flex items-center gap-4 transform"
        >
          <span>PLAY TODAY'S LESSON</span>
          <span className="text-3xl animate-bounce">🚀</span>
        </button>
      </div>

      {/* Bottom Nav */}
      <nav className="w-full bg-white rounded-3xl p-4 shadow-xl border border-blue-50 flex justify-around items-center">
        <button 
          onClick={() => { 
            speak("Games"); 
            onNavigate('GAMES');
          }} 
          className="flex flex-col items-center space-y-1 p-2 h-[80px] justify-center rounded-2xl hover:bg-blue-50 hover:scale-105 transition-all duration-200 transform active:scale-95"
        >
          <div className="text-3xl">🎮</div>
          <span className="text-xs font-bold text-slate-500">GAMES</span>
        </button>
        <button 
          onClick={() => { 
            speak("Reading Library"); 
            onNavigate('READING');
          }} 
          className="flex flex-col items-center space-y-1 p-2 h-[80px] justify-center rounded-2xl hover:bg-blue-50 hover:scale-105 transition-all duration-200 transform active:scale-95"
        >
          <div className="text-3xl">📚</div>
          <span className="text-xs font-bold text-slate-500">READ</span>
        </button>
        <button 
          onClick={() => { 
            speak("Your Prizes!"); 
            onNavigate('REWARDS');
          }} 
          className="flex flex-col items-center space-y-1 p-2 h-[80px] justify-center rounded-2xl hover:bg-blue-50 hover:scale-105 transition-all duration-200 transform active:scale-95 relative"
        >
          <div className="text-3xl">🏆</div>
          <span className="text-xs font-bold text-slate-500">REWARDS</span>
          {progress.badges.length > 1 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {progress.badges.length}
            </div>
          )}
        </button>
      </nav>
    </div>
  );
};

export default HomeScreen;
