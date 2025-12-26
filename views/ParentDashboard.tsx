
import React from 'react';
import { ChildProfile, AppSettings } from '../types';

interface ParentProps {
  profiles: ChildProfile[];
  settings: AppSettings;
  onUpdateSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onToggleDyslexia: () => void;
}

const ParentDashboard: React.FC<ParentProps> = ({ profiles, settings, onUpdateSettings, onToggleDyslexia }) => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-800">Parent Dashboard</h2>
        <p className="text-gray-500 text-sm">Manage profiles and accessibility</p>
      </header>

      {/* Profiles List */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Scout Profiles</h3>
        {profiles.map(p => (
          <div key={p.id} className="edu-card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${p.color} rounded-xl flex items-center justify-center text-2xl shadow-sm border border-white`}>
              {p.avatar === 'Robot' ? '🤖' : p.avatar === 'Cat' ? '🐱' : p.avatar === 'Bear' ? '🐻' : '🦉'}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">{p.name}</p>
              <p className="text-xs text-gray-400">Level {p.currentLevel} • {p.stars} Stars</p>
            </div>
          </div>
        ))}
      </div>

      {/* Settings Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider">Global Settings</h3>
        <div className="edu-card p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800">Dyslexia Friendly Font</p>
              <p className="text-xs text-gray-400">Use OpenDyslexic for all text</p>
            </div>
            <button 
              onClick={onToggleDyslexia}
              className={`w-14 h-8 rounded-full transition-all relative ${settings.dyslexiaFriendly ? 'bg-blue-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${settings.dyslexiaFriendly ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-bold text-gray-800">Voice Volume</p>
              <span className="font-bold text-blue-500">{Math.round(settings.voiceVolume * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.1"
              value={settings.voiceVolume}
              onChange={(e) => onUpdateSettings(s => ({ ...s, voiceVolume: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button className="w-full btn-edu btn-edu-blue py-3 text-sm">
              Export Backup (JSON)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
