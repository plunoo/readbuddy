
import React, { useState, useEffect } from 'react';
import { speak } from '../services/voiceService';

interface ParentGateProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ParentGate: React.FC<ParentGateProps> = ({ onSuccess, onCancel }) => {
  const [steps, setSteps] = useState<number[]>([]);
  const target = [1, 2, 3]; // Specific corners: TL, BR, TR

  const handleTap = (id: number) => {
    const nextSteps = [...steps, id];
    if (nextSteps[nextSteps.length - 1] !== target[nextSteps.length - 1]) {
      setSteps([]);
      return;
    }
    
    if (nextSteps.length === target.length) {
      onSuccess();
    } else {
      setSteps(nextSteps);
    }
  };

  useEffect(() => {
    speak("Adults only. Tap the three red circles.");
  }, []);

  return (
    <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-8 text-blue-900">Parent Access Only</h2>
      <p className="text-center mb-12 text-slate-600">Tap the circles in order: Top-Left, then Bottom-Right, then Top-Right.</p>
      
      <div className="relative w-64 h-64 bg-slate-100 rounded-xl border-4 border-dashed border-slate-300">
        <button 
          onClick={() => handleTap(1)}
          className={`absolute -top-4 -left-4 w-12 h-12 rounded-full border-4 border-white shadow-lg ${steps.includes(1) ? 'bg-green-500' : 'bg-red-400 animate-pulse'}`}
        />
        <button 
          onClick={() => handleTap(2)}
          className={`absolute -bottom-4 -right-4 w-12 h-12 rounded-full border-4 border-white shadow-lg ${steps.includes(2) ? 'bg-green-500' : 'bg-red-400 animate-pulse'}`}
        />
        <button 
          onClick={() => handleTap(3)}
          className={`absolute -top-4 -right-4 w-12 h-12 rounded-full border-4 border-white shadow-lg ${steps.includes(3) ? 'bg-green-500' : 'bg-red-400 animate-pulse'}`}
        />
      </div>

      <button 
        onClick={onCancel}
        className="mt-12 text-blue-600 font-bold underline text-lg h-[60px]"
      >
        Go back to playing!
      </button>
    </div>
  );
};

export default ParentGate;
