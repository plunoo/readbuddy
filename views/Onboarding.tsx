
import React, { useState } from 'react';
import { AvatarType } from '../types';
import { AVATARS, COLORS } from '../constants';

interface OnboardingProps {
  onCreate: (name: string, age: number, avatar: AvatarType, color: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onCreate }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<AvatarType>('Robot');
  const [color, setColor] = useState(COLORS[0]);

  const handleNext = () => {
    if (step === 1 && name.trim()) setStep(2);
    else if (step === 2) onCreate(name, 6, avatar, color);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-10">
        {step === 1 ? (
          <div className="space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">Hi! 👋</h1>
              <p className="text-gray-500 font-medium">Ready to start reading?</p>
            </div>
            <input 
              type="text" 
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-blue-500 outline-none text-center text-2xl font-bold text-gray-900 placeholder:text-gray-300 transition-all"
              placeholder="Your name"
            />
            <button 
              onClick={handleNext}
              disabled={!name.trim()}
              className="w-full btn-edu btn-edu-blue py-5 text-xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Pick a Buddy</h2>
              <p className="text-gray-500">Choose who travels with you!</p>
            </div>

            <div className="flex justify-center">
              <div className={`w-32 h-32 ${color} rounded-3xl flex items-center justify-center text-6xl shadow-inner border-4 border-white`}>
                {AVATARS[avatar]}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {(Object.keys(AVATARS) as AvatarType[]).map(a => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all border-2 ${
                    avatar === a ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {AVATARS[a]}
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-3">
              {COLORS.slice(0, 5).map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full border-4 transition-transform ${
                    color === c ? 'border-gray-800 scale-110 shadow-md' : 'border-white bg-gray-100'
                  } ${c}`}
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="w-full btn-edu btn-edu-green py-5 text-xl"
            >
              Start Playing!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
