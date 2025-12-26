import React, { useState, useEffect } from 'react';
import { speak } from '../services/voiceService';
import RobotAvatar from './RobotAvatar';

interface LetterMatchGameProps {
  onComplete: () => void;
  onBack: () => void;
}

const GAME_LETTERS = [
  { letter: 'A', sound: 'ah', words: ['Apple', 'Ant'] },
  { letter: 'B', sound: 'buh', words: ['Ball', 'Bear'] },
  { letter: 'C', sound: 'kuh', words: ['Cat', 'Car'] },
];

const LetterMatchGame: React.FC<LetterMatchGameProps> = ({ onComplete, onBack }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const currentGame = GAME_LETTERS[currentLevel];
  const shuffledWords = [...currentGame.words, 'Dog', 'Fish'].sort(() => Math.random() - 0.5);

  useEffect(() => {
    speak(`Let's play a matching game! Find words that start with ${currentGame.letter}`);
  }, [currentLevel]);

  const handleLetterClick = () => {
    setSelectedLetter(currentGame.letter);
    speak(`You picked ${currentGame.letter}. Now find a word that starts with ${currentGame.letter}!`);
  };

  const handleWordClick = (word: string) => {
    if (!selectedLetter) {
      speak("Pick the letter first!");
      return;
    }

    setSelectedWord(word);
    const correct = currentGame.words.includes(word);
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      speak(`Great job! ${word} starts with ${currentGame.letter}!`);
      setTimeout(() => {
        if (currentLevel < GAME_LETTERS.length - 1) {
          setCurrentLevel(currentLevel + 1);
          setSelectedLetter(null);
          setSelectedWord(null);
          setIsCorrect(null);
        } else {
          speak("Amazing! You completed the matching game!");
          onComplete();
        }
      }, 2000);
    } else {
      speak(`Not quite! ${word} doesn't start with ${currentGame.letter}. Try again!`);
      setTimeout(() => {
        setSelectedWord(null);
        setIsCorrect(null);
      }, 1500);
    }
  };

  return (
    <div className="h-full flex flex-col items-center p-6 bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4">
        <button onClick={onBack} className="text-3xl hover:scale-110 transition-transform">⬅️</button>
        <div className="text-center">
          <h1 className="text-2xl font-black text-green-700">Letter Match!</h1>
          <div className="text-sm text-gray-600">Level {currentLevel + 1} of {GAME_LETTERS.length}</div>
        </div>
        <div className="text-2xl font-bold text-green-600">Score: {score}</div>
      </div>

      {/* Robot */}
      <div className="mb-6">
        <RobotAvatar 
          expression={isCorrect === true ? 'celebrating' : isCorrect === false ? 'confused' : 'excited'} 
          size="md" 
        />
      </div>

      {/* Letter Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-700">
          Find words that start with:
        </h2>
        <button
          onClick={handleLetterClick}
          className={`text-6xl font-black w-32 h-32 rounded-full border-4 transition-all duration-300 transform hover:scale-110 ${
            selectedLetter 
              ? 'bg-blue-500 text-white border-blue-600 scale-110' 
              : 'bg-white text-blue-500 border-blue-500 hover:bg-blue-50'
          }`}
        >
          {currentGame.letter}
        </button>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {shuffledWords.map((word, index) => {
          const isSelected = selectedWord === word;
          const isCorrectWord = currentGame.words.includes(word);
          
          return (
            <button
              key={index}
              onClick={() => handleWordClick(word)}
              disabled={!selectedLetter || isCorrect !== null}
              className={`
                p-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95
                ${isSelected && isCorrect === true 
                  ? 'bg-green-400 text-white animate-bounce' 
                  : isSelected && isCorrect === false
                  ? 'bg-red-400 text-white animate-pulse'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300'
                }
                ${!selectedLetter ? 'opacity-50' : ''}
              `}
            >
              {word}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {isCorrect !== null && (
        <div className="mt-6 text-center">
          {isCorrect ? (
            <div className="text-green-600 text-xl font-black animate-bounce flex items-center gap-2">
              <span>🎉</span>
              <span>Perfect Match!</span>
              <span>🎉</span>
            </div>
          ) : (
            <div className="text-orange-500 text-lg font-bold animate-pulse">
              Try a different word! 🤔
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LetterMatchGame;