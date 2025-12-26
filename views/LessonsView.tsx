
import React, { useState, useEffect, useRef } from 'react';
import { ChildProfile, Lesson } from '../types';
import { generateLessonsForLevel } from '../constants';
import { geminiService } from '../services/geminiService';

interface LessonsViewProps {
  profile: ChildProfile | null;
  onUpdateXP: (amount: number) => void;
}

const LessonsView: React.FC<LessonsViewProps> = ({ profile, onUpdateXP }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [smartHint, setSmartHint] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const recognitionRef = useRef<any>(null);

  const lessons = profile ? generateLessonsForLevel(profile.currentLevel) : [];

  useEffect(() => {
    if (lessons.length > 0 && !activeLesson) {
      setActiveLesson(lessons[0]);
    }
  }, [lessons, activeLesson]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        setIsAnalyzing(true);
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceResult(transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [currentIndex]);

  const handleVoiceResult = async (transcript: string) => {
    if (!activeLesson) return;
    const target = activeLesson.type === 'isolation' ? activeLesson.sounds[currentIndex] : activeLesson.words[currentIndex];
    
    setTimeout(async () => {
      setIsAnalyzing(false);
      if (transcript.includes(target.toLowerCase())) {
        (window as any).confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
        setFeedback({ type: 'success', message: "Great Job!" });
        setSmartHint(null);
        onUpdateXP(50);
        setTimeout(nextStep, 1500);
      } else {
        setFeedback({ type: 'error', message: "Let's try again!" });
        const hint = await geminiService.getSmartHint(target, transcript);
        setSmartHint(hint);
      }
    }, 500);
  };

  const nextStep = () => {
    if (!activeLesson) return;
    const items = activeLesson.type === 'isolation' ? activeLesson.sounds : activeLesson.words;
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFeedback(null);
      setSmartHint(null);
    } else {
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
      <div className="edu-card p-10 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
        <div className="text-7xl mb-6">🌟</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Well Done!</h2>
        <p className="text-gray-500 mb-8 font-medium">You completed this lesson and earned 100 XP!</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-edu btn-edu-green w-full py-4 text-xl"
        >
          Back to Map
        </button>
      </div>
    );
  }

  if (!activeLesson) return null;
  const currentItems = activeLesson.type === 'isolation' ? activeLesson.sounds : activeLesson.words;
  const currentItem = currentItems[currentIndex];

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Lesson Progress */}
      <div className="flex items-center gap-4">
        <button onClick={() => window.location.reload()} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
        <div className="flex-1 progress-track h-4">
          <div 
            className="progress-fill bg-blue-500" 
            style={{ width: `${((currentIndex + 1) / currentItems.length) * 100}%` }} 
          />
        </div>
      </div>

      {/* Center Stage: Maximum Contrast */}
      <div className="edu-card flex-1 flex flex-col items-center justify-center p-10 min-h-[400px]">
        <span className="text-gray-400 uppercase font-black text-xs tracking-widest mb-4">Read out loud</span>
        <div className="text-[min(40vw,12rem)] font-bold text-gray-900 leading-none">
          {currentItem}
        </div>

        <div className="mt-8 h-20 flex items-center justify-center text-center">
          {isAnalyzing ? (
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:0.1s]" />
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
          ) : feedback ? (
            <div className={`px-6 py-2 rounded-full font-bold text-lg ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {feedback.message}
            </div>
          ) : smartHint ? (
            <p className="text-gray-600 font-medium text-lg italic">"{smartHint}"</p>
          ) : (
            <p className="text-gray-300 font-bold uppercase tracking-widest text-xs">Ready when you are!</p>
          )}
        </div>
      </div>

      {/* Control Strip */}
      <div className="grid grid-cols-4 gap-4 pb-4">
        <button 
          onClick={() => {
            const utterance = new SpeechSynthesisUtterance(currentItem);
            utterance.rate = 0.7;
            window.speechSynthesis.speak(utterance);
          }}
          className="btn-edu btn-edu-blue h-20 text-3xl"
        >
          🔊
        </button>
        
        <button 
          onClick={() => {
            if (recognitionRef.current) {
              setIsListening(true);
              setFeedback(null);
              setSmartHint(null);
              recognitionRef.current.start();
            }
          }}
          disabled={isListening || isAnalyzing}
          className={`col-span-2 btn-edu h-20 text-4xl ${isListening ? 'btn-edu-red' : 'btn-edu-green'}`}
        >
          {isListening ? '👂' : '🎤'}
        </button>

        <button 
          onClick={nextStep}
          className="btn-edu btn-edu-blue h-20 text-2xl"
        >
          ⏭️
        </button>
      </div>
    </div>
  );
};

export default LessonsView;
