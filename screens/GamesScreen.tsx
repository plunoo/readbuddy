import React, { useState, useEffect } from 'react';
import { speak } from '../services/voiceService';
import LetterMatchGame from '../components/LetterMatchGame';
import SoundHuntGame from '../components/SoundHuntGame';
import WordBuilderGame from '../components/WordBuilderGame';
import RobotAvatar from '../components/RobotAvatar';

interface GamesScreenProps {
  onBack: () => void;
}

const GamesScreen: React.FC<GamesScreenProps> = ({ onBack }) => {
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  useEffect(() => {
    if (!currentGame) {
      speak("Welcome to the game zone! Pick a fun game to play!");
    }
  }, [currentGame]);

  const games = [
    {
      id: 'letter-match',
      name: 'Letter Match',
      description: 'Match letters with words!',
      icon: '🔤',
      difficulty: 'Easy'
    },
    {
      id: 'sound-hunt',
      name: 'Sound Hunt',
      description: 'Find the hidden sounds!',
      icon: '🔍',
      difficulty: 'Medium'
    },
    {
      id: 'word-builder',
      name: 'Word Builder', 
      description: 'Build words with letters!',
      icon: '🏗️',
      difficulty: 'Hard'
    }
  ];

  const handleGameSelect = (gameId: string) => {
    setCurrentGame(gameId);
    speak(`Let's play ${games.find(g => g.id === gameId)?.name}!`);
  };

  const handleGameComplete = () => {
    setCurrentGame(null);
    speak("Fantastic job! You're getting better and better!");
  };

  if (currentGame === 'letter-match') {
    return (
      <LetterMatchGame 
        onComplete={handleGameComplete}
        onBack={() => setCurrentGame(null)}
      />
    );
  }

  if (currentGame === 'sound-hunt') {
    return (
      <SoundHuntGame 
        onComplete={handleGameComplete}
        onBack={() => setCurrentGame(null)}
      />
    );
  }

  if (currentGame === 'word-builder') {
    return (
      <WordBuilderGame 
        onComplete={handleGameComplete}
        onBack={() => setCurrentGame(null)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-y-auto">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-green-400 to-blue-500 text-white flex justify-between items-center">
        <button onClick={onBack} className="text-2xl font-bold hover:scale-110 transition-transform">⬅ Back</button>
        <h1 className="text-2xl font-black">🎮 GAME ZONE</h1>
        <div className="w-8" />
      </div>

      <div className="p-6 space-y-6">
        {/* Robot Guide */}
        <div className="text-center mb-8">
          <RobotAvatar expression="excited" size="md" />
          <div className="mt-4 bg-green-100 p-4 rounded-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-green-100" />
            <p className="text-lg font-bold text-green-700">
              Let's play some fun learning games! 🎯
            </p>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => handleGameSelect(game.id)}
              className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100 hover:border-green-300 hover:scale-105 transition-all duration-300 transform active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="text-6xl">{game.icon}</div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-black text-gray-800">{game.name}</h3>
                  <p className="text-gray-600">{game.description}</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                    game.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {game.difficulty}
                  </div>
                </div>
                <div className="text-3xl text-green-500">▶️</div>
              </div>
            </button>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6 border-2 border-dashed border-purple-300">
          <div className="text-center">
            <div className="text-4xl mb-2">🚀</div>
            <h3 className="text-lg font-black text-purple-800">More Games Coming Soon!</h3>
            <p className="text-purple-600">We're working on exciting new games just for you!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesScreen;