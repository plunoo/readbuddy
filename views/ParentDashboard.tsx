
import React from 'react';
import { ChildProfile, AppSettings } from '../types';

interface ParentProps {
  profiles: ChildProfile[];
  settings: AppSettings;
  onUpdateSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onNavigate: (view: any) => void;
}

const VOICE_OPTIONS = [
  { id: 'Kore', name: 'Kore (Cheerful)', icon: '👦' },
  { id: 'Lily', name: 'Lily (Soft)', icon: '👧' },
  { id: 'Finn', name: 'Finn (Excited)', icon: '🦊' },
  { id: 'Puck', name: 'Puck (Storyteller)', icon: '🦉' }
];

const ParentDashboard: React.FC<ParentProps> = ({ profiles, settings, onUpdateSettings, onNavigate }) => {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">Parent Center</h2>
          <p className="text-gray-500 text-sm font-medium">Customize your child's experience</p>
        </div>
        <button 
          onClick={() => onNavigate('admin')}
          className="btn-edu btn-edu-purple px-4 py-2 text-xs"
        >
          Admin Portal
        </button>
      </div>

      {/* Voice Studio Section */}
      <div className="space-y-4">
        <h3 className="font-black text-gray-700 uppercase text-xs tracking-[0.2em]">ElevenLabs Voice Studio</h3>
        <div className="edu-card p-6 grid grid-cols-2 gap-3">
          {VOICE_OPTIONS.map(voice => (
            <button
              key={voice.id}
              onClick={() => onUpdateSettings(s => ({ ...s, elevenLabsVoiceId: voice.id }))}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                settings.elevenLabsVoiceId === voice.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-100 bg-white'
              }`}
            >
              <span className="text-3xl">{voice.icon}</span>
              <span className="text-[10px] font-black text-center">{voice.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profiles List */}
      <div className="space-y-4">
        <h3 className="font-black text-gray-700 uppercase text-xs tracking-[0.2em]">Child Profiles</h3>
        {profiles.map(p => (
          <div key={p.id} className="edu-card p-5 flex items-center gap-4">
            <div className={`w-14 h-14 ${p.color} rounded-2xl flex items-center justify-center text-3xl shadow-inner border-2 border-white`}>
              {p.avatar === 'Robot' ? '🤖' : p.avatar === 'Cat' ? '🐱' : p.avatar === 'Bear' ? '🐻' : '🦉'}
            </div>
            <div className="flex-1">
              <p className="font-black text-gray-800 text-lg leading-none">{p.name}</p>
              <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Level {p.currentLevel} • {p.stars} Stars</p>
            </div>
          </div>
        ))}
      </div>

      {/* Accessibility */}
      <div className="space-y-4">
        <h3 className="font-black text-gray-700 uppercase text-xs tracking-[0.2em]">Accessibility</h3>
        <div className="edu-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800">Dyslexia Friendly Font</p>
              <p className="text-xs text-gray-400 font-medium italic">High readability mode</p>
            </div>
            <button 
              onClick={() => onUpdateSettings(s => ({...s, dyslexiaFriendly: !s.dyslexiaFriendly}))}
              className={`w-14 h-8 rounded-full transition-all relative ${settings.dyslexiaFriendly ? 'bg-blue-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${settings.dyslexiaFriendly ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
