
import React, { useState, useEffect } from 'react';
import RobotAvatar from '../components/RobotAvatar';
import CelebrationEffect from '../components/CelebrationEffect';
import { PhonicsLesson } from '../types';
import { speak } from '../services/voiceService';

interface LessonScreenProps {
  onComplete: () => void;
  onCancel: () => void;
}

const DAILY_LESSON: PhonicsLesson = {
  word: "Apple",
  targetSound: "a",
  choices: ["b", "a", "k"],
  correctIndex: 1
};

const LessonScreen: React.FC<LessonScreenProps> = ({ onComplete, onCancel }) => {
  const [status, setStatus] = useState<'IDLE' | 'LISTENING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [selected, setSelected] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    speak(`Listen carefully! A says ah, like ${DAILY_LESSON.word}. Which letter says ah?`);
  }, []);

  const encouragingMessages = [
    "That's okay! Learning takes practice. Try again!",
    "No worries! Everyone makes mistakes. You've got this!",
    "Close! Listen carefully and try once more!",
    "Great effort! Let's try that sound again together!",
    "You're learning so well! Give it another try!"
  ];

  const handleChoice = (index: number) => {
    setSelected(index);
    if (index === DAILY_LESSON.correctIndex) {
      setStatus('SUCCESS');
      setShowCelebration(true);
      speak("Great job! That is right! Now, you say the word!");
    } else {
      setStatus('ERROR');
      const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
      speak(randomMessage);
      setTimeout(() => {
        setStatus('IDLE');
        setSelected(null);
      }, 2500);
    }
  };

  const handleRecord = () => {
    if (status !== 'SUCCESS') {
      speak("Pick the right letter first!");
      return;
    }
    setStatus('LISTENING');
    speak("I'm listening!");
    
    // Simulate speech recognition
    setTimeout(() => {
      speak("You are a star reader!");
      onComplete();
    }, 2500);
  };

  return (
    <div className="h-full flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Top Header */}
      <div className="w-full flex justify-between items-center mb-4">
        <button onClick={onCancel} className="text-4xl text-blue-200 hover:text-red-400 hover:scale-110 transition-all duration-200 transform active:scale-95">✖</button>
        <div className="flex flex-col items-center">
          <div className="text-lg font-bold text-blue-900">Step 1 of 5</div>
          {/* Progress Bar */}
          <div className="w-32 h-2 bg-blue-100 rounded-full mt-1">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: '20%' }}></div>
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Robot & Instruction */}
      <div className="flex flex-col items-center mb-8 space-y-4">
        <RobotAvatar 
          expression={
            status === 'SUCCESS' ? 'celebrating' : 
            status === 'LISTENING' ? 'listening' : 
            status === 'ERROR' ? 'confused' : 
            'idle'
          } 
          size="md" 
        />
        <div className="bg-blue-100 p-4 rounded-2xl relative transition-all duration-300 hover:scale-105">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-blue-100" />
          <h2 className="text-3xl font-black text-blue-600 text-center">
            {DAILY_LESSON.word}
          </h2>
        </div>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-sm mb-12">
        {DAILY_LESSON.choices.map((letter, idx) => (
          <button
            key={idx}
            disabled={status === 'SUCCESS' || status === 'LISTENING'}
            onClick={() => handleChoice(idx)}
            className={`
              h-24 w-24 rounded-full text-4xl font-black flex items-center justify-center transition-all duration-300 shadow-xl transform hover:scale-105 active:scale-95
              ${selected === idx 
                ? (idx === DAILY_LESSON.correctIndex ? 'bg-green-400 text-white scale-110 animate-pulse' : 'bg-red-400 text-white scale-90 animate-bounce')
                : 'bg-white border-4 border-blue-500 text-blue-500 hover:bg-blue-50 hover:border-blue-600'
              }
            `}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Feedback/Record Button */}
      <div className="w-full flex flex-col items-center mt-auto pb-8">
        {status === 'SUCCESS' || status === 'LISTENING' ? (
          <button 
            onClick={handleRecord}
            disabled={status === 'LISTENING'}
            className={`
              h-[80px] w-[80px] rounded-full flex items-center justify-center transition-all shadow-lg
              ${status === 'LISTENING' ? 'bg-red-500 animate-pulse' : 'bg-blue-500 animate-bounce'}
            `}
          >
            <div className="text-4xl">🎙️</div>
          </button>
        ) : (
          <div className="text-blue-300 text-lg font-bold animate-pulse">Tap the letter that says 'ah'</div>
        )}
        
        {status === 'SUCCESS' && (
          <div className="mt-4 text-green-600 font-black text-xl animate-bounce flex items-center gap-2">
            <span>✓ CORRECT!</span>
            <span className="text-2xl">🎉</span>
          </div>
        )}
        {status === 'ERROR' && (
          <div className="mt-4 text-center">
            <div className="text-orange-500 font-black text-lg animate-pulse flex items-center justify-center gap-2">
              <span>💪</span>
              <span>Keep trying!</span>
              <span>💪</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">You're doing great! Learning takes practice.</div>
          </div>
        )}
      </div>

      <CelebrationEffect 
        show={showCelebration} 
        onComplete={() => setShowCelebration(false)} 
      />
    </div>
  );
};

export default LessonScreen;
