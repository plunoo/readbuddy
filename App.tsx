import React, { useState, useEffect, useCallback } from 'react';
import { ChildProfile, AppSettings, AvatarType } from './types';
import Layout from './components/Layout';
import Onboarding from './views/Onboarding';
import Dashboard from './views/Dashboard';
import LessonsView from './views/LessonsView';
import ParentDashboard from './views/ParentDashboard';
import LibraryView from './views/LibraryView';
import GamesView from './views/GamesView';

const LOCAL_STORAGE_KEY = 'readbuddy_data';

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'onboarding' | 'dashboard' | 'lessons' | 'library' | 'parent' | 'games'>('onboarding');
  const [settings, setSettings] = useState<AppSettings>({
    dyslexiaFriendly: false,
    voiceVolume: 0.8,
    isAudioEnabled: true
  });

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setProfiles(data.profiles || []);
      setSettings(data.settings || { dyslexiaFriendly: false, voiceVolume: 0.8, isAudioEnabled: true });
      if (data.profiles && data.profiles.length > 0) {
        setActiveProfileId(data.profiles[0].id);
        setActiveView('dashboard');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ profiles, settings }));
  }, [profiles, settings]);

  // Apply dyslexia font globally
  useEffect(() => {
    if (settings.dyslexiaFriendly) {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }
  }, [settings.dyslexiaFriendly]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  const handleCreateProfile = (name: string, age: number, avatar: AvatarType, color: string) => {
    const newProfile: ChildProfile = {
      id: crypto.randomUUID(),
      name,
      age,
      avatar,
      color,
      currentLevel: 1,
      xp: 0,
      stars: 0,
      badges: [],
      streak: 1,
      lastPlayed: new Date().toISOString()
    };
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    setActiveView('dashboard');
  };

  const handleUpdateXP = (amount: number) => {
    if (!activeProfileId) return;
    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfileId) {
        const newXp = p.xp + amount;
        const newStars = p.stars + Math.floor(amount / 10);
        const newLevel = Math.floor(newXp / 1000) + 1;
        return { ...p, xp: newXp, stars: newStars, currentLevel: Math.max(p.currentLevel, newLevel) };
      }
      return p;
    }));
  };

  const toggleDyslexia = () => setSettings(s => ({ ...s, dyslexiaFriendly: !s.dyslexiaFriendly }));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {activeView === 'onboarding' ? (
        <Onboarding onCreate={handleCreateProfile} />
      ) : (
        <Layout 
          activeProfile={activeProfile} 
          settings={settings} 
          onNavigate={setActiveView} 
          activeView={activeView}
        >
          {activeView === 'dashboard' && <Dashboard profile={activeProfile} onNavigate={setActiveView} />}
          {activeView === 'lessons' && <LessonsView profile={activeProfile} onUpdateXP={handleUpdateXP} />}
          {activeView === 'parent' && <ParentDashboard profiles={profiles} settings={settings} onUpdateSettings={setSettings} onToggleDyslexia={toggleDyslexia} />}
          {activeView === 'library' && <LibraryView profile={activeProfile} />}
          {activeView === 'games' && <GamesView profile={activeProfile} />}
        </Layout>
      )}
    </div>
  );
};

export default App;