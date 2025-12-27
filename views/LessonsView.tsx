import React, { useState, useEffect, useRef } from 'react';
import { ChildProfile, Lesson } from '../types';
import { generateLessonsForLevel } from '../constants';
import { geminiService } from '../services/geminiService';
import { audioService } from '../services/audioService';

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
    if (lessons.length > 0) {
      if (!activeLesson || isCompleted) {
        setActiveLesson(lessons[0]);
        setCurrentIndex(0);
        setIsCompleted(false);
        setFeedback(null);
        setSmartHint(null);
      }
    }
  }, [lessons, activeLesson, isCompleted]);

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
        
        // Use audioService for success feedback
        await audioService.speakFeedback("Excellent!", 'success');
        
        setSmartHint(null);
        onUpdateXP(50);
        setTimeout(nextStep, 1500);
      } else {
        setFeedback({ type: 'error', message: "Try again!" });
        
        // Use audioService for error feedback and repeat the sound
        await audioService.speakFeedback("Try again", 'error');
        setTimeout(async () => {
          await audioService.speakLetterSound(target);
        }, 1500);
        
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

  if (!activeLesson) {
    return (
      <div className="edu-card p-12 flex flex-col items-center justify-center text-center">
        <div className="text-6xl mb-6">📚</div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4">Loading Lesson...</h2>
        <p className="text-gray-500 mb-6">Getting your phonics lesson ready!</p>
        <button 
          onClick={() => onNavigate('dashboard')} 
          className="btn-edu btn-edu-blue px-6 py-3"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  const currentItems = activeLesson.type === 'isolation' ? activeLesson.sounds : activeLesson.words;
  const currentItem = currentItems[currentIndex];

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Lesson Navigation Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('dashboard')} 
          className="btn-edu btn-edu-yellow w-16 h-16 text-4xl font-black rounded-3xl shadow-lg active:scale-95 hover:rotate-12 transition-all"
          aria-label="Back to home"
        >
          🏠
        </button>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Progress</span>
            <div className="bg-blue-100 px-3 py-1 rounded-full text-xs font-bold text-blue-700">
              {currentIndex + 1} of {currentItems.length}
            </div>
          </div>
          <div className="progress-track h-4">
            <div 
              className="progress-fill shadow-md rounded-full bg-gradient-to-r from-green-400 to-blue-500" 
              style={{ width: `${((currentIndex + 1) / currentItems.length) * 100}%` }} 
            />
          </div>
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

        {/* Letterland character and phonetic notation */}
        <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl px-6 py-4">
          <div className="text-center space-y-3">
            <p className="text-orange-600 font-bold text-sm">
              {audioService.getLetterlandCharacter(currentItem)}
            </p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-yellow-700 font-bold text-lg">
                Sound: <span className="font-extrabold text-xl">{audioService.getPhoneticNotation(currentItem)}</span>
              </p>
              {(() => {
                const soundInfo = audioService.getCurrentSoundInfo(currentItem);
                return soundInfo.total > 1 ? (
                  <div className="bg-blue-100 px-3 py-1 rounded-full text-xs font-bold text-blue-700">
                    {soundInfo.index} of {soundInfo.total}
                  </div>
                ) : null;
              })()}
            </div>
            {(() => {
              const soundInfo = audioService.getCurrentSoundInfo(currentItem);
              return soundInfo.total > 1 ? (
                <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                  <p className="text-blue-600 text-xs font-bold mb-1">🔄 Multiple sounds - Keep pressing to hear all!</p>
                  <div className="flex justify-center gap-1">
                    {audioService.getAllSounds(currentItem).map((sound, i) => (
                      <span 
                        key={i} 
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          i === soundInfo.index - 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
                        }`}
                      >
                        {sound}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
            <div className="text-xs text-gray-600">
              <p className="font-bold mb-1">Example words:</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {audioService.getExampleWords(currentItem).map((word, i) => (
                  <span key={i} className="bg-white px-2 py-1 rounded text-gray-700 font-medium">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audio mode indicator */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            audioService.getCurrentMode() === 'premium' ? 'bg-purple-100 text-purple-700' :
            audioService.getCurrentMode() === 'elevenlabs' ? 'bg-green-100 text-green-700' :
            audioService.getCurrentMode() === 'builtin' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {audioService.getCurrentMode() === 'premium' ? '✨ Premium Voice' :
             audioService.getCurrentMode() === 'elevenlabs' ? '🤖 AI Voice' :
             audioService.getCurrentMode() === 'builtin' ? '🔊 Built-in Voice' :
             '📱 Offline Mode'}
          </div>
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

      {/* Control Strip - Kid-friendly big buttons */}
      <div className="grid grid-cols-4 gap-4 pb-6">
        <button 
          onClick={async () => {
            await audioService.speakLetterSound(currentItem);
          }}
          className="btn-edu btn-edu-blue h-28 text-5xl relative rounded-3xl shadow-xl active:scale-95 hover:shadow-2xl transition-all"
          title="Listen to sound"
        >
          🔊
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-400 flex items-center justify-center border-2 border-white shadow-lg">
            <span className="text-[10px] text-white font-bold">
              {audioService.getCurrentMode() === 'premium' ? '✨' :
               audioService.getCurrentMode() === 'elevenlabs' ? 'AI' : '🔊'}
            </span>
          </div>
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
          className={`col-span-2 btn-edu h-28 text-6xl transition-all rounded-3xl shadow-xl active:scale-95 ${
            isListening ? 'btn-edu-red animate-pulse' : 'btn-edu-green hover:shadow-2xl'
          }`}
        >
          {isListening ? '👂' : '🎤'}
        </button>

        <button 
          onClick={nextStep}
          className="btn-edu btn-edu-orange h-28 text-4xl rounded-3xl shadow-xl active:scale-95 hover:shadow-2xl transition-all"
          title="Next letter"
        >
          ⏭️
        </button>
      </div>
    </div>
  );
};

export default LessonsView;