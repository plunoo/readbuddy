import React, { useState, useEffect, useRef } from 'react';
import { ChildProfile, Lesson } from '../types';
import { generateLessonsForLevel } from '../constants';
import { geminiService } from '../services/geminiService';

interface LessonsViewProps {
  profile: ChildProfile | null;
  onUpdateXP: (amount: number) => void;
  onNavigate: (view: any) => void;
}

const LessonsView: React.FC<LessonsViewProps> = ({ profile, onUpdateXP, onNavigate }) => {
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
        setFeedback({ type: 'success', message: "Awesome Job!" });
        setSmartHint(null);
        onUpdateXP(50);
        setTimeout(nextStep, 1500);
      } else {
        setFeedback({ type: 'error', message: "Try again!" });
        const hint = await geminiService.getSmartHint(target, transcript);
        setSmartHint(hint);
      }
    }, 800);
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
      <div className="edu-card p-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
        <div className="text-8xl mb-8 animate-bounce-soft">🏆</div>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Superstar!</h2>
        <p className="text-xl text-gray-500 mb-10 font-medium">You finished the lesson and earned 100 bonus XP!</p>
        <button 
          onClick={() => onNavigate('dashboard')} 
          className="btn-edu btn-edu-green w-full py-5 text-2xl"
        >
          Return to Map
        </button>
      </div>
    );
  }

  if (!activeLesson) return null;
  const currentItems = activeLesson.type === 'isolation' ? activeLesson.sounds : activeLesson.words;
  const currentItem = currentItems[currentIndex];

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Lesson Navigation Header */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => onNavigate('dashboard')} 
          className="btn-edu btn-edu-ghost w-12 h-12 text-2xl font-black"
          aria-label="Back to dashboard"
        >
          ←
        </button>
        <div className="flex-1 progress-track h-6">
          <div 
            className="progress-fill shadow-sm" 
            style={{ width: `${((currentIndex + 1) / currentItems.length) * 100}%` }} 
          />
        </div>
        <div className="font-black text-gray-400 text-sm">
          {currentIndex + 1}/{currentItems.length}
        </div>
      </div>

      {/* Main Stage */}
      <div className="edu-card flex-1 flex flex-col items-center justify-center p-12 min-h-[420px] relative overflow-hidden">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">
          Read the sound
        </div>
        
        <div className="text-[min(45vw,14rem)] font-black text-gray-900 leading-none drop-shadow-sm transition-all">
          {currentItem}
        </div>

        <div className="mt-12 h-24 flex items-center justify-center text-center max-w-sm">
          {isAnalyzing ? (
            <div className="flex gap-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.1s]" />
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
          ) : feedback ? (
            <div className={`px-8 py-3 rounded-2xl font-black text-xl animate-in slide-in-from-bottom-2 ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {feedback.message}
            </div>
          ) : smartHint ? (
            <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 animate-in fade-in">
               <p className="text-blue-700 font-bold text-lg leading-snug">💡 {smartHint}</p>
            </div>
          ) : (
            <p className="text-gray-300 font-black uppercase tracking-widest text-xs">Tap the mic and speak!</p>
          )}
        </div>
      </div>

      {/* Control Strip - Large friendly buttons */}
      <div className="grid grid-cols-4 gap-6 pb-6">
        <button 
          onClick={() => {
            const utterance = new SpeechSynthesisUtterance(currentItem);
            utterance.rate = 0.6; // Slightly slower for children
            window.speechSynthesis.speak(utterance);
          }}
          className="btn-edu btn-edu-blue h-24 text-4xl"
          title="Hear sound"
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
          className={`col-span-2 btn-edu h-24 text-5xl transition-all ${isListening ? 'btn-edu-red' : 'btn-edu-green'}`}
        >
          {isListening ? '👂' : '🎤'}
        </button>

        <button 
          onClick={nextStep}
          className="btn-edu btn-edu-blue h-24 text-3xl"
          title="Skip"
        >
          ⏭️
        </button>
      </div>
    </div>
  );
};

export default LessonsView;