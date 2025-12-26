import React, { useState, useEffect } from 'react';
import { speak } from '../services/voiceService';
import RobotAvatar from './RobotAvatar';

interface WordBuilderGameProps {
  onComplete: () => void;
  onBack: () => void;
}

const WORD_BUILDER_LEVELS = [
  {
    targetWord: 'CAT',
    letters: ['C', 'A', 'T', 'B', 'D'],
    hint: 'A furry pet that says meow!'
  },
  {
    targetWord: 'DOG',
    letters: ['D', 'O', 'G', 'F', 'M'],
    hint: 'A loyal pet that barks!'
  },
  {
    targetWord: 'SUN',
    letters: ['S', 'U', 'N', 'R', 'K'],
    hint: 'It shines bright in the sky!'
  },
  {
    targetWord: 'BOOK',
    letters: ['B', 'O', 'O', 'K', 'P', 'L'],
    hint: 'You read this to learn!'
  }
];

const WordBuilderGame: React.FC<WordBuilderGameProps> = ({ onComplete, onBack }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const currentGame = WORD_BUILDER_LEVELS[currentLevel];

  useEffect(() => {
    setAvailableLetters([...currentGame.letters].sort(() => Math.random() - 0.5));
    speak(`Build the word! ${currentGame.hint}`);
  }, [currentLevel]);

  const handleLetterClick = (letter: string, index: number) => {
    if (selectedLetters.length < currentGame.targetWord.length) {
      setSelectedLetters([...selectedLetters, letter]);
      setAvailableLetters(availableLetters.filter((_, i) => i !== index));
    }
  };

  const handleRemoveLetter = (index: number) => {
    const removedLetter = selectedLetters[index];
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index));
    setAvailableLetters([...availableLetters, removedLetter]);
    setIsCorrect(null);
  };

  const checkWord = () => {
    const builtWord = selectedLetters.join('');
    const correct = builtWord === currentGame.targetWord;
    setIsCorrect(correct);

    if (correct) {
      speak(`Perfect! You spelled ${currentGame.targetWord}!`);
      setScore(score + 20);
      
      setTimeout(() => {
        if (currentLevel < WORD_BUILDER_LEVELS.length - 1) {
          speak("Great job! Let's build another word!");
          setCurrentLevel(currentLevel + 1);
          setSelectedLetters([]);
          setIsCorrect(null);
        } else {
          speak("Amazing! You're a word building champion!");
          setGameComplete(true);
          setTimeout(onComplete, 2000);
        }
      }, 2000);
    } else {
      speak(`Not quite! Try again. Remember: ${currentGame.hint}`);
      setTimeout(() => {
        setIsCorrect(null);
      }, 1500);
    }
  };

  const clearWord = () => {
    setAvailableLetters([...availableLetters, ...selectedLetters].sort(() => Math.random() - 0.5));
    setSelectedLetters([]);
    setIsCorrect(null);
  };

  return (
    <div className="h-full flex flex-col items-center p-6 bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4">
        <button onClick={onBack} className="text-3xl hover:scale-110 transition-transform">⬅️</button>
        <div className="text-center">
          <h1 className="text-2xl font-black text-orange-700">🏗️ Word Builder!</h1>
          <div className="text-sm text-gray-600">Level {currentLevel + 1} of {WORD_BUILDER_LEVELS.length}</div>
        </div>
        <div className="text-2xl font-bold text-orange-600">Score: {score}</div>
      </div>

      {/* Robot */}
      <div className="mb-4">
        <RobotAvatar 
          expression={
            gameComplete ? 'celebrating' : 
            isCorrect === true ? 'happy' : 
            isCorrect === false ? 'confused' : 
            'excited'
          } 
          size="md" 
        />
      </div>

      {/* Hint */}
      <div className="mb-6 text-center">
        <div className="bg-orange-100 p-4 rounded-2xl border-2 border-orange-200">
          <div className="text-lg font-bold text-orange-700 mb-2">Hint:</div>
          <div className="text-orange-600">{currentGame.hint}</div>
        </div>
      </div>

      {/* Word Building Area */}
      <div className="mb-6">
        <div className="text-lg font-bold text-center mb-4 text-orange-700">Build your word:</div>
        <div className="flex gap-2 mb-4 min-h-[80px] items-center justify-center">
          {Array.from({ length: currentGame.targetWord.length }).map((_, index) => (
            <div
              key={index}
              onClick={() => selectedLetters[index] && handleRemoveLetter(index)}
              className={`
                w-16 h-16 border-4 border-dashed border-orange-300 rounded-xl flex items-center justify-center text-2xl font-black cursor-pointer transition-all
                ${selectedLetters[index] 
                  ? 'bg-orange-200 border-solid border-orange-400 hover:bg-orange-100' 
                  : 'bg-white hover:bg-orange-50'
                }
              `}
            >
              {selectedLetters[index] || ''}
            </div>
          ))}
        </div>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={checkWord}
            disabled={selectedLetters.length !== currentGame.targetWord.length || isCorrect !== null}
            className={`
              px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95
              ${selectedLetters.length === currentGame.targetWord.length 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Check Word
          </button>
          
          <button
            onClick={clearWord}
            className="px-6 py-3 rounded-xl font-bold bg-gray-500 hover:bg-gray-600 text-white transition-all transform hover:scale-105 active:scale-95"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Available Letters */}
      <div className="w-full max-w-lg">
        <div className="text-lg font-bold text-center mb-4 text-orange-700">Available Letters:</div>
        <div className="grid grid-cols-3 gap-3 justify-items-center">
          {availableLetters.map((letter, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(letter, index)}
              disabled={selectedLetters.length >= currentGame.targetWord.length}
              className={`
                w-16 h-16 rounded-xl text-2xl font-black transition-all transform hover:scale-110 active:scale-95 shadow-lg
                ${selectedLetters.length >= currentGame.targetWord.length 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-orange-400 hover:bg-orange-500 text-white'
                }
              `}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {isCorrect !== null && (
        <div className="mt-6 text-center">
          {isCorrect ? (
            <div className="text-green-600 text-xl font-black animate-bounce flex items-center gap-2">
              <span>🎉</span>
              <span>Perfect Word!</span>
              <span>🎉</span>
            </div>
          ) : (
            <div className="text-orange-500 text-lg font-bold animate-pulse">
              Try again! You can do it! 💪
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WordBuilderGame;