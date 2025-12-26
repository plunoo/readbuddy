import React, { useState, useEffect } from 'react';
import { UserProfile, userService } from '../services/userService';
import RobotAvatar from './RobotAvatar';

interface UserSetupProps {
  onUserReady: (user: UserProfile) => void;
}

const UserSetup: React.FC<UserSetupProps> = ({ onUserReady }) => {
  const [currentStep, setCurrentStep] = useState<'loading' | 'existing' | 'new' | 'avatar' | 'creating' | 'welcome'>('loading');
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState(6);
  const [parentEmail, setParentEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState({
    character: 'robot' as const,
    color: '#3B82F6',
    accessories: [] as string[]
  });
  const [existingUsers, setExistingUsers] = useState<UserProfile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    const currentUser = userService.getCurrentUser();
    const allUsers = userService.getAllUsers();
    
    if (currentUser) {
      onUserReady(currentUser);
    } else if (allUsers.length > 0) {
      setExistingUsers(allUsers);
      setCurrentStep('existing');
    } else {
      setCurrentStep('new');
    }
  };

  const selectExistingUser = async (userId: string) => {
    const user = await userService.switchUser(userId);
    if (user) {
      onUserReady(user);
    }
  };

  const createNewUser = async () => {
    setIsCreating(true);
    setCurrentStep('creating');
    
    try {
      // Add small delay for better UX - kids need to see the magic happening
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = await userService.createUser(
        userName,
        userAge,
        parentEmail || undefined
      );
      
      // Update avatar
      await userService.updateAvatar(selectedAvatar);
      
      // Add to family if there are other users
      if (existingUsers.length > 0) {
        await userService.addToFamily(newUser);
      }
      
      // Show welcome screen first
      setCurrentStep('welcome');
      setCountdown(4);
      
      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            onUserReady(newUser);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Failed to create user:', error);
      setIsCreating(false);
      setCurrentStep('avatar');
      alert('Oops! Let\'s try that again!');
    }
  };

  const avatarCharacters = [
    { id: 'robot', name: 'Robot', emoji: '🤖' },
    { id: 'cat', name: 'Cat', emoji: '🐱' },
    { id: 'bear', name: 'Bear', emoji: '🐻' },
    { id: 'owl', name: 'Owl', emoji: '🦉' }
  ];

  const avatarColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🤖</div>
          <p className="text-xl text-blue-600">Loading ReadBuddy...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'existing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">👋</div>
            <h1 className="text-3xl font-black text-blue-800 mb-2">Welcome Back!</h1>
            <p className="text-blue-600">Choose your profile to continue learning</p>
          </div>

          <div className="space-y-3 mb-6">
            {existingUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => selectExistingUser(user.id)}
                className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all text-left flex items-center gap-3"
              >
                <div className="text-3xl">{user.avatar.character === 'robot' ? '🤖' : user.avatar.character === 'cat' ? '🐱' : user.avatar.character === 'bear' ? '🐻' : '🦉'}</div>
                <div>
                  <div className="font-bold text-blue-800">{user.name}</div>
                  <div className="text-sm text-blue-600">Level {Math.floor(user.progress.soundsUnlocked / 7) + 1} • {user.progress.currentStreak} day streak</div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentStep('new')}
            className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-all transform hover:scale-105"
          >
            + Create New Profile
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'new') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 animate-bounce">🤖</div>
            <h1 className="text-4xl font-black text-purple-800 mb-2">Hi there!</h1>
            <p className="text-xl text-purple-600">I'm your reading buddy!</p>
          </div>

          {/* Super simple name input */}
          <div className="text-center space-y-6 mb-8">
            <div className="bg-purple-50 rounded-3xl p-6">
              <p className="text-2xl font-bold text-purple-700 mb-4">What should I call you?</p>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Type your name here!"
                className="w-full p-4 border-4 border-purple-200 rounded-2xl focus:border-purple-500 focus:outline-none text-2xl text-center font-bold text-purple-800 bg-white"
                maxLength={20}
              />
            </div>

            {/* Age selection with fun buttons */}
            <div className="bg-blue-50 rounded-3xl p-6">
              <p className="text-2xl font-bold text-blue-700 mb-4">How many candles on your birthday cake?</p>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 8 }, (_, i) => i + 4).map(age => (
                  <button
                    key={age}
                    onClick={() => setUserAge(age)}
                    className={`aspect-square rounded-2xl text-3xl font-black transition-all transform hover:scale-110 ${
                      userAge === age 
                        ? 'bg-blue-500 text-white border-4 border-blue-600 scale-110' 
                        : 'bg-white text-blue-600 border-4 border-blue-300 hover:bg-blue-100'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {existingUsers.length > 0 && (
              <button
                onClick={() => setCurrentStep('existing')}
                className="flex-1 py-4 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-2xl transition-all text-xl"
              >
                ← Back
              </button>
            )}
            <button
              onClick={() => setCurrentStep('avatar')}
              disabled={!userName.trim()}
              className="flex-2 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-black rounded-2xl transition-all transform hover:scale-105 disabled:hover:scale-100 text-xl"
            >
              Let's Pick My Buddy! 🎨
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'avatar') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-black text-green-800 mb-2">Pick Your Reading Buddy!</h1>
            <p className="text-xl text-green-600">They'll help you learn to read!</p>
          </div>

          {/* Big Preview */}
          <div className="text-center mb-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-6">
            <div className="text-8xl mb-2">
              {selectedAvatar.character === 'robot' ? '🤖' : 
               selectedAvatar.character === 'cat' ? '🐱' : 
               selectedAvatar.character === 'bear' ? '🐻' : '🦉'}
            </div>
            <div 
              className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-lg"
              style={{ backgroundColor: selectedAvatar.color }}
            />
            <p className="text-lg font-bold text-green-700 mt-2">This is me!</p>
          </div>

          {/* Simple Character Selection */}
          <div className="mb-8">
            <p className="text-2xl font-bold text-center text-green-700 mb-4">Who do you want as your buddy?</p>
            <div className="grid grid-cols-2 gap-4">
              {avatarCharacters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => setSelectedAvatar(prev => ({ ...prev, character: char.id as any }))}
                  className={`p-6 rounded-3xl text-6xl transition-all border-4 ${
                    selectedAvatar.character === char.id
                      ? 'border-green-500 bg-green-100 scale-105 shadow-lg'
                      : 'border-green-200 hover:border-green-400 hover:bg-green-50 hover:scale-105'
                  }`}
                >
                  <div>{char.emoji}</div>
                  <div className="text-lg font-bold text-green-700 mt-2">{char.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Fun Color Selection */}
          <div className="mb-8">
            <p className="text-2xl font-bold text-center text-green-700 mb-4">Pick your favorite color!</p>
            <div className="grid grid-cols-4 gap-3">
              {avatarColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedAvatar(prev => ({ ...prev, color }))}
                  className={`w-16 h-16 rounded-2xl transition-all border-4 mx-auto ${
                    selectedAvatar.color === color
                      ? 'border-gray-800 scale-125 shadow-lg'
                      : 'border-gray-200 hover:border-gray-400 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep('new')}
              className="flex-1 py-4 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-2xl transition-all text-xl"
            >
              ← Back
            </button>
            <button
              onClick={createNewUser}
              disabled={isCreating}
              className="flex-2 py-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-black rounded-2xl transition-all transform hover:scale-105 disabled:hover:scale-100 text-xl"
            >
              {isCreating ? 'Creating Magic... ✨' : 'Let\'s Learn Together! 🚀'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'creating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="text-8xl mb-6 animate-bounce">
            {selectedAvatar.character === 'robot' ? '🤖' : 
             selectedAvatar.character === 'cat' ? '🐱' : 
             selectedAvatar.character === 'bear' ? '🐻' : '🦉'}
          </div>
          
          <div className="animate-spin text-6xl mb-6">✨</div>
          
          <h1 className="text-3xl font-black text-purple-800 mb-4">
            Creating Your Profile!
          </h1>
          
          <p className="text-xl text-purple-600 mb-6">
            Getting everything ready for {userName}...
          </p>
          
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Floating celebration emojis */}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`
            }}
          >
            {['🎉', '✨', '🌟', '🎊', '🏆', '🎈', '🌈', '🦄'][Math.floor(Math.random() * 8)]}
          </div>
        ))}
        
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center relative z-10">
          <div className="text-9xl mb-6 animate-pulse">
            {selectedAvatar.character === 'robot' ? '🤖' : 
             selectedAvatar.character === 'cat' ? '🐱' : 
             selectedAvatar.character === 'bear' ? '🐻' : '🦉'}
          </div>
          
          <h1 className="text-4xl font-black text-green-800 mb-4">
            Welcome, {userName}! 🎉
          </h1>
          
          <p className="text-2xl text-green-600 mb-6">
            Your reading adventure starts NOW!
          </p>
          
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-3xl p-6 mb-6">
            <p className="text-lg font-bold text-green-700 mb-2">
              Your buddy is ready to help you:
            </p>
            <div className="flex justify-center items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                style={{ backgroundColor: selectedAvatar.color }}
              />
              <div className="text-left">
                <p className="font-bold text-green-800">Learn letter sounds</p>
                <p className="font-bold text-blue-800">Read amazing stories</p>
                <p className="font-bold text-purple-800">Play fun games</p>
              </div>
            </div>
          </div>
          
          <div className="text-2xl font-black text-gradient-to-r from-green-600 to-blue-600">
            Starting in {countdown} second{countdown !== 1 ? 's' : ''}... 🚀
          </div>
          
          {/* Add "Tap to Start Now" option */}
          <button
            onClick={() => {
              setCountdown(0);
              onUserReady(userService.getCurrentUser()!);
            }}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold rounded-2xl transition-all transform hover:scale-105 text-lg"
          >
            Can't Wait? Tap to Start Now! ⚡
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default UserSetup;