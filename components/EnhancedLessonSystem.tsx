import React, { useState, useEffect } from 'react';
import { PhonicsScope, PhonicsActivity, PHONICS_PROGRESSION, PHONICS_ACTIVITIES } from '../data/phonicsProgression';
import { enhancedVoiceService } from '../services/elevenLabsService';
import RobotAvatar from './RobotAvatar';
import CelebrationEffect from './CelebrationEffect';

interface EnhancedLessonProps {
  userLevel: number;
  onComplete: (success: boolean, activity: string) => void;
  onCancel: () => void;
}

interface LessonState {
  currentPhase: 'introduction' | 'practice' | 'assessment' | 'celebration';
  currentActivity: PhonicsActivity | null;
  userResponses: string[];
  score: number;
  attempts: number;
  maxAttempts: number;
}

const EnhancedLessonSystem: React.FC<EnhancedLessonProps> = ({ userLevel, onComplete, onCancel }) => {
  const [lessonState, setLessonState] = useState<LessonState>({
    currentPhase: 'introduction',
    currentActivity: null,
    userResponses: [],
    score: 0,
    attempts: 0,
    maxAttempts: 3
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [currentScope] = useState<PhonicsScope>(PHONICS_PROGRESSION[userLevel] || PHONICS_PROGRESSION[0]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    startLessonIntroduction();
  }, []);

  const startLessonIntroduction = async () => {
    const intro = `Welcome to ${currentScope.name}! Today we'll learn about ${currentScope.description}. Let's practice the sounds: ${currentScope.phonemes.join(', ')}`;
    
    try {
      await enhancedVoiceService.generatePhonicsAudio(intro, currentScope.phonemes);
    } catch (error) {
      // Fallback to regular speech
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(intro);
        window.speechSynthesis.speak(utterance);
      }
    }

    // Move to practice phase after introduction
    setTimeout(() => {
      setLessonState(prev => ({ ...prev, currentPhase: 'practice' }));
      startPracticeActivity();
    }, 3000);
  };

  const startPracticeActivity = () => {
    // Select appropriate activity based on user level
    const levelActivities = PHONICS_ACTIVITIES.filter(activity => {
      if (userLevel <= 3) return activity.type === 'phoneme_isolation' || activity.type === 'blending';
      if (userLevel <= 5) return activity.type !== 'manipulation';
      return true; // All activities for advanced users
    });

    const randomActivity = levelActivities[Math.floor(Math.random() * levelActivities.length)];
    setLessonState(prev => ({
      ...prev,
      currentActivity: randomActivity,
      attempts: 0
    }));
  };

  const handlePhonemeIsolation = async (word: string, position: 'initial' | 'final' | 'medial' = 'initial') => {
    const instruction = `What is the ${position} sound in "${word}"?`;
    
    try {
      await enhancedVoiceService.generatePhonicsAudio(word, [word[0]]);
      await enhancedVoiceService.generatePhonicsAudio(instruction);
    } catch (error) {
      console.error('Audio generation failed:', error);
    }
  };

  const handleBlendingExercise = async (sounds: string[], targetWord: string) => {
    try {
      const blendingAudio = await enhancedVoiceService.generateBlendingExercise(sounds, targetWord);
      
      // Play instruction
      const audio1 = new Audio(blendingAudio.instruction);
      await audio1.play();
      
      // Play individual sounds
      setTimeout(async () => {
        const audio2 = new Audio(blendingAudio.individual);
        await audio2.play();
      }, 1000);
      
      // Play blended word
      setTimeout(async () => {
        const audio3 = new Audio(blendingAudio.blended);
        await audio3.play();
      }, 3000);
    } catch (error) {
      console.error('Blending exercise failed:', error);
    }
  };

  const handleSegmentingExercise = async (word: string) => {
    const instruction = `Break this word into sounds: "${word}". Say each sound separately.`;
    
    try {
      await enhancedVoiceService.generatePhonicsAudio(instruction);
      // Demonstrate segmentation
      setTimeout(async () => {
        const segmented = word.split('').join(' - ');
        await enhancedVoiceService.generatePhonicsAudio(segmented);
      }, 2000);
    } catch (error) {
      console.error('Segmentation exercise failed:', error);
    }
  };

  const handleUserResponse = async (response: string) => {
    if (!lessonState.currentActivity) return;

    const isCorrect = lessonState.currentActivity.correctAnswers.includes(response.toLowerCase());
    const newAttempts = lessonState.attempts + 1;

    if (isCorrect) {
      setLessonState(prev => ({
        ...prev,
        score: prev.score + 1,
        userResponses: [...prev.userResponses, response]
      }));

      // Play success feedback
      try {
        await enhancedVoiceService.generateFeedback('success');
      } catch (error) {
        console.error('Feedback generation failed:', error);
      }

      setShowCelebration(true);
      
      setTimeout(() => {
        setShowCelebration(false);
        moveToNextActivity();
      }, 2000);
    } else {
      setLessonState(prev => ({ ...prev, attempts: newAttempts }));

      if (newAttempts >= lessonState.maxAttempts) {
        // Provide hint and move on
        try {
          await enhancedVoiceService.generateFeedback('hint', lessonState.currentActivity.instruction);
        } catch (error) {
          console.error('Hint generation failed:', error);
        }
        moveToNextActivity();
      } else {
        // Provide encouragement
        try {
          await enhancedVoiceService.generateFeedback('encouragement');
        } catch (error) {
          console.error('Encouragement generation failed:', error);
        }
      }
    }
  };

  const moveToNextActivity = () => {
    if (lessonState.score >= 3) {
      // Lesson complete
      setLessonState(prev => ({ ...prev, currentPhase: 'celebration' }));
      setTimeout(() => {
        onComplete(true, lessonState.currentActivity?.type || 'phonics');
      }, 3000);
    } else {
      // Continue with next activity
      startPracticeActivity();
    }
  };

  const handleVoiceRecording = async () => {
    // @ts-ignore - Speech recognition types not fully supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    setIsRecording(true);
    
    // @ts-ignore - Speech recognition types not fully supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      handleUserResponse(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      alert('Speech recognition error. Please try again.');
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const renderPhonemeIntroduction = () => (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-black text-blue-700">{currentScope.name}</h2>
      <p className="text-lg text-blue-600">{currentScope.description}</p>
      
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {currentScope.phonemes.map((phoneme, index) => (
          <button
            key={index}
            onClick={() => enhancedVoiceService.generateLetterSound(phoneme)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-black text-3xl rounded-2xl h-20 w-20 mx-auto transition-all transform hover:scale-110"
          >
            {phoneme}
          </button>
        ))}
      </div>
    </div>
  );

  const renderPracticeActivity = () => {
    if (!lessonState.currentActivity) return null;

    const activity = lessonState.currentActivity;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-purple-700 mb-2">
            {activity.type.replace('_', ' ').toUpperCase()}
          </h3>
          <p className="text-lg text-purple-600">
            {activity.instruction.replace('{word}', activity.words[0] || '').replace('{sounds}', activity.words[0]?.split('').join('-') || '')}
          </p>
        </div>

        {/* Activity-specific UI */}
        {activity.type === 'phoneme_isolation' && (
          <div className="text-center">
            <button
              onClick={() => handlePhonemeIsolation(activity.words[0])}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all transform hover:scale-105"
            >
              Listen to: {activity.words[0]}
            </button>
          </div>
        )}

        {activity.type === 'blending' && (
          <div className="text-center">
            <button
              onClick={() => handleBlendingExercise(activity.words[0].split(''), activity.words[0])}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all transform hover:scale-105"
            >
              Blend: {activity.words[0].split('').join(' - ')}
            </button>
          </div>
        )}

        {activity.type === 'segmenting' && (
          <div className="text-center">
            <button
              onClick={() => handleSegmentingExercise(activity.words[0])}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all transform hover:scale-105"
            >
              Segment: {activity.words[0]}
            </button>
          </div>
        )}

        {/* Voice recording button */}
        <div className="text-center">
          <button
            onClick={handleVoiceRecording}
            disabled={isRecording}
            className={`
              w-20 h-20 rounded-full text-4xl transition-all transform hover:scale-110 active:scale-95
              ${isRecording 
                ? 'bg-red-500 animate-pulse text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
            `}
          >
            🎤
          </button>
          <p className="text-sm text-gray-600 mt-2">
            {isRecording ? 'Listening...' : 'Tap to speak your answer'}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${
                i < lessonState.score ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const getRobotExpression = () => {
    if (showCelebration) return 'celebrating';
    if (isRecording) return 'listening';
    if (lessonState.attempts > 0) return 'confused';
    if (lessonState.currentPhase === 'practice') return 'excited';
    return 'happy';
  };

  return (
    <div className="h-full flex flex-col items-center p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4">
        <button 
          onClick={onCancel} 
          className="text-4xl text-gray-400 hover:text-red-400 hover:scale-110 transition-all duration-200 transform active:scale-95"
        >
          ✖
        </button>
        <div className="flex flex-col items-center">
          <div className="text-lg font-bold text-indigo-900">
            {currentScope.name} - Level {userLevel + 1}
          </div>
          <div className="w-32 h-2 bg-indigo-100 rounded-full mt-1">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
              style={{ width: `${(lessonState.score / 3) * 100}%` }}
            />
          </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Robot */}
      <div className="mb-6">
        <RobotAvatar 
          expression={getRobotExpression()}
          size="md"
        />
      </div>

      {/* Lesson Content */}
      <div className="flex-1 w-full max-w-2xl">
        {lessonState.currentPhase === 'introduction' && renderPhonemeIntroduction()}
        {lessonState.currentPhase === 'practice' && renderPracticeActivity()}
        {lessonState.currentPhase === 'celebration' && (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-black text-green-700">Lesson Complete! 🎉</h2>
            <p className="text-xl text-green-600">
              You mastered {lessonState.score} out of 3 activities!
            </p>
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

export default EnhancedLessonSystem;