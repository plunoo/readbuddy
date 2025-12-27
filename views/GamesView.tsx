import React, { useState, useEffect } from 'react';
import { ChildProfile } from '../types';
import { audioService } from '../services/audioService';

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
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  
  const [score, setScore] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  const target = letters[currentLetterIndex];
  
  // Generate 3 random wrong letters + the correct one, then shuffle
  const generateOptions = (correctLetter: string) => {
    const wrongLetters = letters.filter(l => l !== correctLetter);
    const randomWrong = wrongLetters.sort(() => Math.random() - 0.5).slice(0, 3);
    return [correctLetter, ...randomWrong].sort(() => Math.random() - 0.5);
  };
  
  const [options, setOptions] = useState(() => generateOptions(target));

  // Auto-speak the letter sound when target changes using audioService
  useEffect(() => {
    const timer = setTimeout(async () => {
      await audioService.speakLetterSound(target);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [target]);

  const handleMatch = async (opt: string) => {
    if (opt === target) {
      setScore(s => s + 10);
      
      // Play success sound using audioService
      await audioService.speakFeedback('Excellent!', 'success');
      
      if ((window as any).confetti) {
        (window as any).confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      }
      
      // Progress to next letter
      setTimeout(() => {
        const nextIndex = currentLetterIndex + 1;
        if (nextIndex >= letters.length) {
          setGameCompleted(true);
          if ((window as any).confetti) {
            (window as any).confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          }
        } else {
          setCurrentLetterIndex(nextIndex);
          setOptions(generateOptions(letters[nextIndex]));
        }
      }, 1000);
    } else {
      setScore(s => Math.max(0, s - 5));
      
      // Play try again sound and repeat the target sound using audioService
      await audioService.speakFeedback('Try again', 'error');
      
      setTimeout(async () => {
        await audioService.speakLetterSound(target);
      }, 1500);
    }
  };

  if (gameCompleted) {
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-300 py-2">
        <div className="edu-card p-10 flex flex-col items-center justify-center text-center bg-gradient-to-b from-green-50 to-green-100">
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-3xl font-extrabold text-green-600 mb-4">Amazing!</h2>
          <p className="text-gray-600 font-medium mb-6">You matched all 26 letters!</p>
          <div className="bg-white px-6 py-3 rounded-2xl border-2 border-green-200 font-extrabold text-green-600 text-xl shadow-[0_3px_0_#BBF7D0] mb-8">
            FINAL SCORE: {score} ⭐
          </div>
          <button onClick={onExit} className="btn-edu btn-edu-green px-8 py-3 text-lg uppercase font-extrabold">
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-300 py-2">
      <div className="flex justify-between items-center px-1">
        <button 
          onClick={onExit} 
          className="btn-edu btn-edu-red px-8 py-4 text-lg rounded-3xl shadow-lg active:scale-95 hover:shadow-xl transition-all flex items-center gap-2"
        >
          🏠 <span className="font-bold">Home</span>
        </button>
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-2xl border-2 border-blue-200 font-bold text-blue-700 text-lg shadow-lg">
            {currentLetterIndex + 1} / 26
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-3 rounded-2xl border-2 border-yellow-300 font-extrabold text-white text-xl shadow-lg">
            ⭐ {score}
          </div>
        </div>
      </div>

      <div className="edu-card p-10 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-blue-50/30">
        <div className="flex items-center gap-4 mb-8">
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">Listen and match this letter</p>
          <button 
            onClick={async () => await audioService.speakLetterSound(target)}
            className="btn-edu btn-edu-yellow px-6 py-4 text-2xl font-extrabold flex items-center gap-3 relative rounded-3xl shadow-lg active:scale-95 hover:shadow-xl transition-all"
          >
            🔊 <span className="text-lg">Listen Again</span>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center border-2 border-white shadow-md">
              <span className="text-[8px] text-white font-bold">
                {audioService.getCurrentMode() === 'premium' ? '✨' :
                 audioService.getCurrentMode() === 'elevenlabs' ? 'AI' : '🔊'}
              </span>
            </div>
          </button>
        </div>
        
        <div className="text-[10rem] font-black text-gray-900 mb-6 animate-bounce-soft leading-none">
          {target}
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl px-6 py-4 mb-8">
          <div className="text-center space-y-3">
            <p className="text-orange-600 font-bold text-sm">
              {audioService.getLetterlandCharacter(target)}
            </p>
            <p className="text-yellow-700 font-bold text-sm">
              Sound: <span className="font-extrabold text-lg">{audioService.getPhoneticNotation(target)}</span>
            </p>
            <div className="text-xs text-gray-600">
              <p className="font-bold mb-1">Example words:</p>
              <div className="flex justify-center gap-1 flex-wrap">
                {audioService.getExampleWords(target).map((word, i) => (
                  <span key={i} className="bg-white px-2 py-1 rounded text-gray-700 font-medium">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 w-full">
          {options.map(opt => (
            <button 
              key={opt}
              onClick={() => handleMatch(opt)}
              className="btn-edu btn-edu-blue py-12 text-7xl font-extrabold italic rounded-3xl shadow-xl active:scale-95 hover:shadow-2xl transition-all duration-200 border-4 border-blue-200 hover:border-blue-300"
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