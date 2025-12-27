
import React, { useState } from 'react';
import { ChildProfile, AppSettings } from '../types';
import AudioSettings from './AudioSettings';

interface LayoutProps {
  children: React.ReactNode;
  activeProfile: ChildProfile | null;
  settings: AppSettings;
  onNavigate: (view: any) => void;
  activeView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeProfile, onNavigate, activeView }) => {
  const [showAudioSettings, setShowAudioSettings] = useState(false);

  return (
    <div className="min-h-screen flex flex-col pb-24">
      <header className="bg-gradient-to-r from-blue-400 to-purple-500 px-6 py-5 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 hover:bg-white/30 transition-all active:scale-95"
        >
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 text-2xl font-bold shadow-lg">
            📚
          </div>
          <span className="font-extrabold text-white text-xl tracking-tight">ReadBuddy</span>
        </button>
        
        {activeProfile && (
           <div className="flex items-center gap-3">
             <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/30">
               <span className="text-2xl">⭐</span>
               <span className="font-extrabold text-white text-lg">{activeProfile.stars}</span>
             </div>
             <button 
                onClick={() => setShowAudioSettings(true)}
                className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all active:scale-95 text-2xl"
                title="Sound Settings"
             >
               🔊
             </button>
           </div>
        )}
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl px-4 py-4 flex items-center justify-around z-50 border-t-4 border-blue-100">
        <NavBtn icon="🏠" label="Home" active={activeView === 'dashboard'} onClick={() => onNavigate('dashboard')} />
        <NavBtn icon="📖" label="Learn" active={activeView === 'lessons'} onClick={() => onNavigate('lessons')} />
        <NavBtn icon="🎮" label="Games" active={activeView === 'games'} onClick={() => onNavigate('games')} />
        <NavBtn icon="📺" label="Watch" active={activeView === 'videos'} onClick={() => onNavigate('videos')} />
        <NavBtn icon="📚" label="Stories" active={activeView === 'library'} onClick={() => onNavigate('library')} />
      </footer>

      <AudioSettings 
        isOpen={showAudioSettings} 
        onClose={() => setShowAudioSettings(false)} 
      />
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-2 px-3 py-3 rounded-3xl transition-all duration-300 min-w-[64px] ${
      active 
        ? 'bg-gradient-to-b from-blue-400 to-blue-500 text-white shadow-lg scale-110 shadow-blue-300/50' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 active:scale-95'
    }`}
  >
    <span className={`text-3xl leading-none transition-all ${active ? 'animate-bounce-soft' : ''}`}>
      {icon}
    </span>
    <span className={`text-[9px] font-bold uppercase tracking-wider ${active ? 'text-white' : 'text-gray-400'}`}>
      {label}
    </span>
  </button>
);

export default Layout;
