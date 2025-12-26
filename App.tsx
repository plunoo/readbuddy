<<<<<<< HEAD
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
=======

import React, { useState, useEffect } from 'react';
import { Screen, UserProgress, AppSettings, Achievement } from './types';
import HomeScreen from './screens/HomeScreen';
import LessonScreen from './screens/LessonScreen';
import RewardsScreen from './screens/RewardsScreen';
import GamesScreen from './screens/GamesScreen';
import ReadingScreen from './screens/ReadingScreen';
import ParentGate from './components/ParentGate';
import UserSetup from './components/UserSetup';
import UserSwitcher from './components/UserSwitcher';
import { speak } from './services/voiceService';
import { UserProfile, userService } from './services/userService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isUserReady, setIsUserReady] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [showParentGate, setShowParentGate] = useState(false);
  const [showUserSetup, setShowUserSetup] = useState(false);

  useEffect(() => {
    // Check if user exists on app start
    const user = userService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsUserReady(true);
    }
  }, []);

  const handleUserReady = (user: UserProfile) => {
    setCurrentUser(user);
    setIsUserReady(true);
  };

  // Get current progress and settings from user
  const progress = currentUser?.progress || {
    soundsUnlocked: 0,
    stickers: [],
    masteredToday: 0,
    currentStreak: 0,
    longestStreak: 0,
    dailyGoal: 3,
    lastPlayedDate: new Date().toDateString(),
    difficulty: 'easy',
    recentPerformance: [],
    badges: []
  };

  const settings = currentUser?.settings || {
    dyslexiaMode: false,
    voiceVolume: 1
  };

  // Show user setup if no user is ready OR if adding new user
  if (!isUserReady || showUserSetup) {
    return <UserSetup onUserReady={(user) => {
      handleUserReady(user);
      setShowUserSetup(false);
    }} />;
  }

  const toggleDyslexia = async () => {
    if (!currentUser) return;
    
    const newDyslexiaMode = !settings.dyslexiaMode;
    await userService.updatePreferences({ 
      ...currentUser.preferences,
      dyslexiaMode: newDyslexiaMode 
    });
    
    // Update local state
    setCurrentUser(userService.getCurrentUser());
    speak(newDyslexiaMode ? "Easy read letters" : "Normal letters");
  };

  const checkForNewBadges = (newProgress: UserProgress): Achievement[] => {
    const newBadges: Achievement[] = [];
    const now = new Date();

    // Streak badges
    if (newProgress.currentStreak === 5 && !newProgress.badges.find(b => b.id === 'streak_5')) {
      newBadges.push({
        id: 'streak_5',
        name: 'On Fire!',
        description: '5 days in a row!',
        icon: '🔥',
        unlockedAt: now,
        category: 'streak'
      });
    }

    // Daily goal badges
    if (newProgress.masteredToday >= newProgress.dailyGoal && !newProgress.badges.find(b => b.id === 'daily_goal_' + new Date().toDateString())) {
      newBadges.push({
        id: 'daily_goal_' + new Date().toDateString(),
        name: 'Goal Crusher',
        description: 'Reached daily goal!',
        icon: '🎯',
        unlockedAt: now,
        category: 'daily'
      });
    }

    // Mastery badges
    if (newProgress.soundsUnlocked >= 10 && !newProgress.badges.find(b => b.id === 'sounds_10')) {
      newBadges.push({
        id: 'sounds_10',
        name: 'Sound Master',
        description: 'Unlocked 10 sounds!',
        icon: '🎵',
        unlockedAt: now,
        category: 'mastery'
      });
    }

    return newBadges;
  };

  const adjustDifficulty = (performance: number[], currentDifficulty: string) => {
    const recentAverage = performance.slice(-5).reduce((a, b) => a + b, 0) / Math.min(performance.length, 5);
    
    if (recentAverage >= 0.8 && currentDifficulty === 'easy') {
      speak("You're doing great! Let's try something a bit harder.");
      return 'medium';
    } else if (recentAverage >= 0.9 && currentDifficulty === 'medium') {
      speak("Amazing! You're ready for the challenge mode!");
      return 'hard';
    } else if (recentAverage <= 0.4 && currentDifficulty === 'hard') {
      speak("Let's take it a bit easier and build up your confidence.");
      return 'medium';
    } else if (recentAverage <= 0.3 && currentDifficulty === 'medium') {
      speak("No worries! Let's practice with easier words first.");
      return 'easy';
    }
    
    return currentDifficulty;
  };

  const handleLessonComplete = async (wasCorrect: boolean = true) => {
    if (!currentUser) return;
    
    // Update streak if playing on a new day
    const today = new Date().toDateString();
    const isNewDay = progress.lastPlayedDate !== today;
    const newStreak = isNewDay ? progress.currentStreak + 1 : progress.currentStreak;
    
    // Update performance tracking
    const newPerformance = [...progress.recentPerformance, wasCorrect ? 1 : 0].slice(-10);
    const newDifficulty = adjustDifficulty(newPerformance, progress.difficulty) as 'easy' | 'medium' | 'hard';
    
    const updatedProgress = {
      ...progress,
      soundsUnlocked: progress.soundsUnlocked + 1,
      masteredToday: isNewDay ? 1 : progress.masteredToday + 1,
      currentStreak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak),
      lastPlayedDate: today,
      difficulty: newDifficulty,
      recentPerformance: newPerformance,
      stickers: [...progress.stickers, '🎨']
    };

    // Check for new badges
    const newBadges = checkForNewBadges(updatedProgress);
    if (newBadges.length > 0) {
      speak(`Wow! You earned ${newBadges.length} new badge${newBadges.length > 1 ? 's' : ''}!`);
      updatedProgress.badges = [...updatedProgress.badges, ...newBadges];
    }

    // Save to user service
    await userService.updateProgress(updatedProgress);
    
    // Update local state
    setCurrentUser(userService.getCurrentUser());
    setCurrentScreen('REWARDS');
  };

  return (
    <div className={`h-screen w-screen flex flex-col bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 transition-all duration-300 ${settings.dyslexiaMode ? 'dyslexic' : ''}`}>
      {/* User Switcher (Top Left) */}
      {currentUser && (
        <div className="fixed top-4 left-4 z-40">
          <UserSwitcher 
            currentUser={currentUser}
            onUserChange={(user) => {
              setCurrentUser(user);
              setCurrentScreen('HOME');
            }}
            onAddNewUser={() => setShowUserSetup(true)}
          />
        </div>
      )}

      {/* Dyslexia Toggle (Top Right) */}
      <button 
        onClick={toggleDyslexia}
        className="fixed top-4 right-4 z-40 bg-white/80 hover:bg-white hover:scale-110 p-3 rounded-full shadow-md hover:shadow-lg text-2xl transition-all duration-200 transform active:scale-95"
        title="Toggle Dyslexia Font"
      >
        {settings.dyslexiaMode ? 'Abc' : '✍️'}
      </button>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        {currentScreen === 'HOME' && (
          <HomeScreen 
            progress={progress} 
            onPlay={() => setCurrentScreen('LESSON')}
            onNavigate={(s) => setCurrentScreen(s)}
          />
        )}
        
        {currentScreen === 'LESSON' && (
          <LessonScreen 
            onComplete={handleLessonComplete}
            onCancel={() => setCurrentScreen('HOME')}
          />
        )}
        
        {currentScreen === 'REWARDS' && (
          <RewardsScreen 
            progress={progress}
            onBack={() => setCurrentScreen('HOME')}
          />
        )}
        
        {currentScreen === 'GAMES' && (
          <GamesScreen 
            onBack={() => setCurrentScreen('HOME')}
          />
        )}
        
        {currentScreen === 'READING' && (
          <ReadingScreen 
            onBack={() => setCurrentScreen('HOME')}
          />
        )}
      </main>

      {/* Parent Gate Modal */}
      {showParentGate && (
        <ParentGate 
          onSuccess={() => {
            setShowParentGate(false);
            alert("Settings would open here!");
          }} 
          onCancel={() => setShowParentGate(false)}
        />
>>>>>>> 3efe4a8ba51b2caf4678c0cfefe30431b1f1ce7c
      )}
    </div>
  );
};

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 3efe4a8ba51b2caf4678c0cfefe30431b1f1ce7c
