import React, { useState, useEffect } from 'react';
import { UserProfile, userService } from '../services/userService';

interface UserSwitcherProps {
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
  onAddNewUser: () => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({ currentUser, onUserChange, onAddNewUser }) => {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setAllUsers(userService.getAllUsers());
  }, []);

  const switchUser = async (userId: string) => {
    const user = await userService.switchUser(userId);
    if (user) {
      onUserChange(user);
      setIsOpen(false);
    }
  };

  const getUserLevel = (user: UserProfile) => Math.floor(user.progress.soundsUnlocked / 7) + 1;
  
  const getAvatarEmoji = (character: string) => {
    switch (character) {
      case 'robot': return '🤖';
      case 'cat': return '🐱';
      case 'bear': return '🐻';
      case 'owl': return '🦉';
      default: return '🤖';
    }
  };

  if (allUsers.length <= 1) return null;

  return (
    <div className="relative">
      {/* Current User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/90 hover:bg-white rounded-full px-4 py-2 shadow-lg transition-all transform hover:scale-105"
      >
        <div className="text-2xl">{getAvatarEmoji(currentUser.avatar.character)}</div>
        <div className="text-left hidden sm:block">
          <div className="font-bold text-purple-800">{currentUser.name}</div>
          <div className="text-sm text-purple-600">Level {getUserLevel(currentUser)}</div>
        </div>
        <div className="text-purple-500 transform transition-transform duration-200 rotate-0">
          {isOpen ? '▲' : '▼'}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-purple-200 min-w-64 z-50">
          <div className="p-2">
            <div className="text-center py-2 border-b border-purple-100 mb-2">
              <p className="text-sm font-bold text-purple-700">Switch Profile</p>
            </div>
            
            {/* All Users List */}
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => switchUser(user.id)}
                  className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                    user.id === currentUser.id
                      ? 'bg-purple-100 border-2 border-purple-300'
                      : 'hover:bg-purple-50 border-2 border-transparent hover:border-purple-200'
                  }`}
                >
                  <div className="text-3xl">{getAvatarEmoji(user.avatar.character)}</div>
                  <div className="flex-1">
                    <div className="font-bold text-purple-800">{user.name}</div>
                    <div className="text-sm text-purple-600">
                      Level {getUserLevel(user)} • {user.progress.currentStreak} day streak
                    </div>
                    {user.progress.masteredToday >= user.progress.dailyGoal && (
                      <div className="text-xs text-green-600 font-bold">✓ Daily Goal Complete!</div>
                    )}
                  </div>
                  {user.id === currentUser.id && (
                    <div className="text-green-500 text-xl">✓</div>
                  )}
                </button>
              ))}
            </div>

            {/* Add New User Button */}
            <div className="pt-2 mt-2 border-t border-purple-100">
              <button
                onClick={() => {
                  onAddNewUser();
                  setIsOpen(false);
                }}
                className="w-full p-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="text-xl">+</span>
                Add New Child
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserSwitcher;