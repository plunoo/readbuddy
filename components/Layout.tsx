
import React from 'react';
import { ChildProfile, AppSettings } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeProfile: ChildProfile | null;
  settings: AppSettings;
  onNavigate: (view: 'dashboard' | 'lessons' | 'library' | 'parent' | 'games') => void;
  activeView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeProfile, onNavigate, activeView }) => {
  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Clean Status Bar */}
      <header className="bg-white border-b-2 border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-sm">B</div>
          <span className="font-bold text-gray-800 hidden sm:inline">ReadBuddy</span>
        </div>
        
        {activeProfile && (
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200">
               <span className="text-lg">⭐</span>
               <span className="font-bold text-yellow-700">{activeProfile.stars}</span>
             </div>
             <button 
                onClick={() => onNavigate('parent')}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 hover:bg-gray-100 transition-colors"
             >
               ⚙️
             </button>
           </div>
        )}
      </header>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {children}
      </main>

      {/* Standard Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 px-4 py-2 flex items-center justify-around z-50">
        <NavBtn icon="🏠" label="Home" active={activeView === 'dashboard'} onClick={() => onNavigate('dashboard')} />
        <NavBtn icon="📖" label="Learn" active={activeView === 'lessons'} onClick={() => onNavigate('lessons')} />
        <NavBtn icon="📚" label="Stories" active={activeView === 'library'} onClick={() => onNavigate('library')} />
        <NavBtn icon="🎮" label="Games" active={activeView === 'games'} onClick={() => onNavigate('games')} />
      </footer>
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}
  >
    <span className="text-2xl leading-none">{icon}</span>
    <span className="text-[10px] font-bold uppercase">{label}</span>
  </button>
);

export default Layout;
