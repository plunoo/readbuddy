import React, { useState } from 'react';
import { ChildProfile } from '../types';

const GamesView: React.FC<{ profile: ChildProfile | null }> = ({ profile }) => {
  const [activeGame, setActiveGame] = useState<'letter-match' | 'sound-hunt' | null>(null);

  const games = [
    { id: 'letter-match', name: 'Letter Match', icon: '🧩', desc: 'Find the twins!', color: 'btn-edu-blue' },
    { id: 'sound-hunt', name: 'Sound Hunt', icon: '🔍', desc: 'Find the sound!', color: 'btn-edu-purple' },
    { id: 'word-builder', name: 'Word Builder', icon: '🧱', desc: 'Build a word!', color: 'btn-edu-yellow' }
  ];

  if (activeGame === 'letter-match') {
    return <LetterMatchGame onExit={() => setActiveGame(null)} />;
  }

  return (
    <div className="space-y-6 py-2 animate-in fade-in duration-500">
      <header className="px-1">
        <h2 className="text-2xl font-extrabold text-gray-800">Mini-Games</h2>
        <p className="text-gray-500 font-medium text-sm">Have fun and earn stars!</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {games.map(game => (
          <div 
            key={game.id}
            className="edu-card p-6 flex flex-col items-center text-center group transition-all cursor-pointer active:scale-95"
            onClick={() => game.id === 'letter-match' && setActiveGame('letter-match')}
          >
            <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
              {game.icon}
            </div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-1 tracking-tight uppercase">{game.name}</h3>
            <p className="text-gray-400 text-xs font-bold mb-6 uppercase tracking-widest">{game.desc}</p>
            <button className={`btn-edu ${game.color} px-8 py-3 text-sm w-full`}>
              Play
            </button>
          </div>
        ))}
      </div>

      {/* Rewards Progress Section */}
      <div className="edu-card p-6 border-dashed border-gray-300 bg-gray-50/50">
        <h4 className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Achievement Gallery</h4>
        <div className="flex justify-around items-center">
          {['🏆', '🌟', '🎸', '🎓'].map((icon, i) => (
            <div key={i} className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl border-2 border-gray-100 opacity-30 grayscale shadow-sm">
              {icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LetterMatchGame = ({ onExit }: { onExit: () => void }) => {
  const [score, setScore] = useState(0);
  const target = 'A';
  const options = ['A', 'B', 'C', 'D'];

  const handleMatch = (opt: string) => {
    if (opt === target) {
      setScore(s => s + 10);
      if ((window as any).confetti) {
        (window as any).confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      }
    } else {
      setScore(s => Math.max(0, s - 5));
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-300 py-2">
      <div className="flex justify-between items-center px-1">
        <button onClick={onExit} className="btn-edu btn-edu-red px-6 py-2 text-xs uppercase">Exit</button>
        <div className="bg-white px-5 py-2 rounded-2xl border-2 border-gray-100 font-extrabold text-blue-600 text-lg shadow-[0_3px_0_#E5E7EB]">
          STARS: {score}
        </div>
      </div>

      <div className="edu-card p-10 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-blue-50/30">
        <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em] mb-8">Match this letter</p>
        
        <div className="text-[10rem] font-black text-gray-900 mb-12 animate-bounce-soft leading-none">
          {target}
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full">
          {options.map(opt => (
            <button 
              key={opt}
              onClick={() => handleMatch(opt)}
              className="btn-edu btn-edu-blue py-8 text-5xl font-extrabold italic"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesView;