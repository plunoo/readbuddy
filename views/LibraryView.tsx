
import React, { useState, useEffect, useRef } from 'react';
import { ChildProfile } from '../types';
import { geminiService, decodeBase64, decodeAudioData } from '../services/geminiService';
import { PHONICS_LEVELS } from '../constants';

const LibraryView: React.FC<{ profile: ChildProfile | null }> = ({ profile }) => {
  const [story, setStory] = useState<string | null>(null);
  const [illustration, setIllustration] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const generateNewStory = async () => {
    if (!profile) return;
    setIsLoading(true);
    setIllustration(null);
    const levelInfo = PHONICS_LEVELS.find(l => l.level === profile.currentLevel);
    
    try {
      const text = await geminiService.generateStory(profile.currentLevel, levelInfo?.sounds || []);
      setStory(text);
      const img = await geminiService.generateStoryIllustration(text);
      setIllustration(img);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async () => {
    if (!story) return;
    setIsPlaying(true);
    
    try {
      const audioBase64 = await geminiService.textToSpeech(story);
      if (audioBase64) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decodeBase64(audioBase64), ctx);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        source.start(0);
      } else {
        const utterance = new SpeechSynthesisUtterance(story);
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    generateNewStory();
  }, [profile?.currentLevel]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Story Library</h2>
        <button 
          onClick={generateNewStory}
          disabled={isLoading}
          className="btn-edu btn-edu-blue px-4 py-2 text-xs"
        >
          {isLoading ? 'Creating...' : 'New Story'}
        </button>
      </div>

      <div className="edu-card overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center space-y-4">
            <div className="text-6xl animate-pulse">📖</div>
            <p className="font-bold text-gray-400 uppercase text-xs">Writing your story...</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="aspect-video w-full bg-gray-50 flex items-center justify-center border-b-2 border-gray-100">
              {illustration ? (
                <img src={illustration} alt="Story" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-200 text-6xl">✨</div>
              )}
            </div>
            
            <div className="p-8 text-center space-y-6">
              <p className="text-2xl font-bold text-gray-800 leading-relaxed">
                {story || "Once upon a time..."}
              </p>
              
              <button 
                onClick={playAudio}
                disabled={isPlaying}
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl transition-all shadow-sm ${
                  isPlaying ? 'bg-red-100 text-red-500 scale-110' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {isPlaying ? '⏸' : '🔊'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 text-center">
          <p className="text-xs font-bold text-green-600 uppercase">Points</p>
          <p className="text-xl font-bold text-green-800">+20 XP</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-center">
          <p className="text-xs font-bold text-purple-600 uppercase">Goal</p>
          <p className="text-xl font-bold text-purple-800">Reading!</p>
        </div>
      </div>
    </div>
  );
};

export default LibraryView;
