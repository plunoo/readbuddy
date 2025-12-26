import React, { useState, useEffect } from 'react';
import { speak } from '../services/voiceService';
import RobotAvatar from './RobotAvatar';

interface SoundHuntGameProps {
  onComplete: () => void;
  onBack: () => void;
}

const SOUND_HUNT_LEVELS = [
  {
    targetSound: 'B',
    words: ['Ball', 'Cat', 'Book', 'Dog', 'Bat'],
    correctWords: ['Ball', 'Book', 'Bat']
  },
  {
    targetSound: 'S',
    words: ['Sun', 'Moon', 'Star', 'Tree', 'Snake'],
    correctWords: ['Sun', 'Star', 'Snake']
  },
  {
    targetSound: 'T',
    words: ['Tiger', 'Fish', 'Table', 'Car', 'Top'],
    correctWords: ['Tiger', 'Table', 'Top']
  }
];

const SoundHuntGame: React.FC<SoundHuntGameProps> = ({ onComplete, onBack }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const currentGame = SOUND_HUNT_LEVELS[currentLevel];
  const shuffledWords = [...currentGame.words].sort(() => Math.random() - 0.5);

  useEffect(() => {
    speak(`Sound Hunt! Find all words that start with the sound ${currentGame.targetSound}. Listen carefully!`);
  }, [currentLevel]);

  const handleWordClick = (word: string) => {
    if (foundWords.includes(word)) return;

    setSelectedWord(word);
    const isCorrect = currentGame.correctWords.includes(word);

    if (isCorrect) {
      speak(`Great! ${word} starts with ${currentGame.targetSound}!`);
      const newFoundWords = [...foundWords, word];
      setFoundWords(newFoundWords);
      setScore(score + 10);

      // Check if level complete
      if (newFoundWords.length === currentGame.correctWords.length) {
        setTimeout(() => {
          if (currentLevel < SOUND_HUNT_LEVELS.length - 1) {
            speak("Level complete! Let's try the next one!");
            setCurrentLevel(currentLevel + 1);
            setFoundWords([]);
            setSelectedWord(null);
          } else {
            speak("Amazing! You completed Sound Hunt! You're a sound detective!");
            setGameComplete(true);
            setTimeout(onComplete, 2000);
          }
        }, 1500);
      }
    } else {
      speak(`${word} doesn't start with ${currentGame.targetSound}. Keep hunting!`);
      setTimeout(() => setSelectedWord(null), 1000);
    }
  };

  return (
    <div className="h-full flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4">
        <button onClick={onBack} className="text-3xl hover:scale-110 transition-transform">⬅️</button>
        <div className="text-center">
          <h1 className="text-2xl font-black text-purple-700">🔍 Sound Hunt!</h1>
          <div className="text-sm text-gray-600">Level {currentLevel + 1} of {SOUND_HUNT_LEVELS.length}</div>
        </div>
        <div className="text-2xl font-bold text-purple-600">Score: {score}</div>
      </div>

      {/* Robot */}
      <div className="mb-4">
        <RobotAvatar 
          expression={gameComplete ? 'celebrating' : selectedWord && currentGame.correctWords.includes(selectedWord) ? 'happy' : selectedWord ? 'confused' : 'excited'} 
          size="md" 
        />
      </div>

      {/* Target Sound */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold mb-2 text-purple-700">Find words that start with:</h2>
        <div className="bg-purple-500 text-white text-6xl font-black w-20 h-20 rounded-full flex items-center justify-center mx-auto animate-pulse">
          {currentGame.targetSound}
        </div>
        <div className="text-sm text-purple-600 mt-2">
          Found: {foundWords.length}/{currentGame.correctWords.length}
        </div>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {shuffledWords.map((word, index) => {
          const isFound = foundWords.includes(word);
          const isSelected = selectedWord === word;
          const isCorrect = currentGame.correctWords.includes(word);
          
          return (
            <button
              key={index}
              onClick={() => handleWordClick(word)}
              disabled={isFound}
              className={`
                p-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 relative
                ${isFound 
                  ? 'bg-green-400 text-white scale-110' 
                  : isSelected && isCorrect
                  ? 'bg-green-300 text-white animate-pulse'
                  : isSelected && !isCorrect
                  ? 'bg-red-300 text-white animate-pulse'
                  : 'bg-white text-purple-700 border-2 border-purple-200 hover:border-purple-400 shadow-lg'
                }
              `}
            >
              {word}
              {isFound && (
                <div className="absolute -top-2 -right-2 text-2xl">🎯</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mt-6">
        <div className="bg-gray-200 rounded-full h-3">
          <div 
            className="bg-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(foundWords.length / currentGame.correctWords.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Feedback */}
      {selectedWord && (
        <div className="mt-4 text-center">
          {currentGame.correctWords.includes(selectedWord) ? (
            <div className="text-green-600 text-xl font-black animate-bounce flex items-center gap-2">
              <span>🎯</span>
              <span>Found it!</span>
              <span>🎯</span>
            </div>
          ) : (
            <div className="text-orange-500 text-lg font-bold animate-pulse">
              Keep hunting! 🔍
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SoundHuntGame;