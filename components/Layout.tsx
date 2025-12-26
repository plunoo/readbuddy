
import React from 'react';
import { ChildProfile, AppSettings } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeProfile: ChildProfile | null;
  settings: AppSettings;
  onNavigate: (view: any) => void;
  activeView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeProfile, onNavigate, activeView }) => {
  return (
    <div className="min-h-screen flex flex-col pb-24">
      <header className="bg-white border-b-2 border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-[0_4px_0_#1D4ED8]">B</div>
          <span className="font-extrabold text-gray-800 hidden sm:inline tracking-tight">ReadBuddy</span>
        </div>
        
        {activeProfile && (
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full border-2 border-yellow-200">
               <span className="text-lg">⭐</span>
               <span className="font-bold text-yellow-700">{activeProfile.stars}</span>
             </div>
             <button 
                onClick={() => onNavigate('parent')}
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border-2 border-gray-200 hover:bg-gray-100 transition-all active:translate-y-0.5"
             >
               ⚙️
             </button>
           </div>
        )}
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {children}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 px-4 py-3 flex items-center justify-around z-50">
        <NavBtn icon="🏠" label="Home" active={activeView === 'dashboard'} onClick={() => onNavigate('dashboard')} />
        <NavBtn icon="📖" label="Learn" active={activeView === 'lessons'} onClick={() => onNavigate('lessons')} />
        <NavBtn icon="📺" label="Watch" active={activeView === 'videos'} onClick={() => onNavigate('videos')} />
        <NavBtn icon="📚" label="Stories" active={activeView === 'library'} onClick={() => onNavigate('library')} />
        <NavBtn icon="🎮" label="Games" active={activeView === 'games'} onClick={() => onNavigate('games')} />
      </footer>
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all ${active ? 'bg-blue-50 text-blue-600 scale-105' : 'text-gray-400 hover:bg-gray-50'}`}
  >
    <span className="text-2xl leading-none">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

export default Layout;
