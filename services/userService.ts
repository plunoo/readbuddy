import { UserProgress, AppSettings, Achievement } from '../types';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  avatar: {
    character: 'robot' | 'cat' | 'bear' | 'owl';
    color: string;
    accessories: string[];
  };
  preferences: {
    voiceGender: 'male' | 'female';
    voiceSpeed: 'slow' | 'normal' | 'fast';
    difficulty: 'auto' | 'easy' | 'medium' | 'hard';
    dyslexiaMode: boolean;
  };
  progress: UserProgress;
  settings: AppSettings;
  parentEmail?: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface ParentAccount {
  id: string;
  email: string;
  name: string;
  children: UserProfile[];
  subscriptionStatus: 'free' | 'premium';
  notificationSettings: {
    dailyProgress: boolean;
    weeklyReport: boolean;
    achievements: boolean;
  };
}

class UserService {
  private currentUser: UserProfile | null = null;
  private storageKey = 'readbuddy_user_data';
  private backupKey = 'readbuddy_backup';

  constructor() {
    this.loadUserData();
  }

  // Create new user profile
  async createUser(name: string, age: number, parentEmail?: string): Promise<UserProfile> {
    const userId = this.generateUserId();
    
    const newUser: UserProfile = {
      id: userId,
      name,
      age,
      avatar: {
        character: 'robot',
        color: '#3B82F6',
        accessories: []
      },
      preferences: {
        voiceGender: 'female',
        voiceSpeed: 'normal',
        difficulty: 'auto',
        dyslexiaMode: false
      },
      progress: {
        soundsUnlocked: 0,
        stickers: [],
        masteredToday: 0,
        currentStreak: 0,
        longestStreak: 0,
        dailyGoal: age <= 6 ? 3 : 5,
        lastPlayedDate: new Date().toDateString(),
        difficulty: 'easy',
        recentPerformance: [],
        badges: []
      },
      settings: {
        dyslexiaMode: false,
        voiceVolume: 1
      },
      parentEmail,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    this.currentUser = newUser;
    await this.saveUserData();
    
    return newUser;
  }

  // Load existing user or show setup
  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  // Update user progress
  async updateProgress(newProgress: Partial<UserProgress>): Promise<void> {
    if (!this.currentUser) throw new Error('No user logged in');

    this.currentUser.progress = {
      ...this.currentUser.progress,
      ...newProgress
    };

    this.currentUser.lastLogin = new Date();
    await this.saveUserData();
    
    // Auto-backup every 10 updates
    const updateCount = parseInt(localStorage.getItem('readbuddy_update_count') || '0') + 1;
    localStorage.setItem('readbuddy_update_count', updateCount.toString());
    
    if (updateCount % 10 === 0) {
      await this.createBackup();
    }
  }

  // Update user preferences
  async updatePreferences(newPreferences: Partial<UserProfile['preferences']>): Promise<void> {
    if (!this.currentUser) throw new Error('No user logged in');

    this.currentUser.preferences = {
      ...this.currentUser.preferences,
      ...newPreferences
    };

    await this.saveUserData();
  }

  // Update avatar customization
  async updateAvatar(avatar: Partial<UserProfile['avatar']>): Promise<void> {
    if (!this.currentUser) throw new Error('No user logged in');

    this.currentUser.avatar = {
      ...this.currentUser.avatar,
      ...avatar
    };

    await this.saveUserData();
  }

  // Save data to localStorage (offline persistence)
  private async saveUserData(): Promise<void> {
    if (!this.currentUser) return;

    try {
      const userData = {
        ...this.currentUser,
        // Convert dates to strings for JSON storage
        createdAt: this.currentUser.createdAt.toISOString(),
        lastLogin: this.currentUser.lastLogin.toISOString(),
        progress: {
          ...this.currentUser.progress,
          badges: this.currentUser.progress.badges.map(badge => ({
            ...badge,
            unlockedAt: badge.unlockedAt.toISOString()
          }))
        }
      };

      localStorage.setItem(this.storageKey, JSON.stringify(userData));
      
      // Also save to cloud if available (future implementation)
      await this.syncToCloud();
    } catch (error) {
      console.error('Failed to save user data:', error);
      throw new Error('Failed to save progress');
    }
  }

  // Load data from localStorage
  private loadUserData(): void {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (savedData) {
        const userData = JSON.parse(savedData);
        
        // Convert string dates back to Date objects
        userData.createdAt = new Date(userData.createdAt);
        userData.lastLogin = new Date(userData.lastLogin);
        userData.progress.badges = userData.progress.badges.map((badge: any) => ({
          ...badge,
          unlockedAt: new Date(badge.unlockedAt)
        }));

        this.currentUser = userData;
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Try to restore from backup
      this.restoreFromBackup();
    }
  }

  // Create backup
  async createBackup(): Promise<void> {
    if (!this.currentUser) return;

    try {
      const backupData = {
        timestamp: new Date().toISOString(),
        userData: this.currentUser,
        version: '2.0'
      };

      localStorage.setItem(this.backupKey, JSON.stringify(backupData));
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  }

  // Restore from backup
  async restoreFromBackup(): Promise<boolean> {
    try {
      const backupData = localStorage.getItem(this.backupKey);
      if (backupData) {
        const backup = JSON.parse(backupData);
        this.currentUser = backup.userData;
        await this.saveUserData();
        return true;
      }
    } catch (error) {
      console.error('Failed to restore from backup:', error);
    }
    return false;
  }

  // Export user data
  exportData(): string {
    if (!this.currentUser) throw new Error('No user data to export');
    
    const exportData = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      userData: this.currentUser
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Import user data
  async importData(jsonData: string): Promise<void> {
    try {
      const importData = JSON.parse(jsonData);
      
      if (importData.version && importData.userData) {
        // Convert dates back to Date objects
        const userData = importData.userData;
        userData.createdAt = new Date(userData.createdAt);
        userData.lastLogin = new Date(userData.lastLogin);
        userData.progress.badges = userData.progress.badges.map((badge: any) => ({
          ...badge,
          unlockedAt: new Date(badge.unlockedAt)
        }));

        this.currentUser = userData;
        await this.saveUserData();
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Failed to import user data');
    }
  }

  // Delete user account
  async deleteUser(): Promise<void> {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.backupKey);
    localStorage.removeItem('readbuddy_update_count');
    this.currentUser = null;
  }

  // Switch between multiple user profiles
  async switchUser(userId: string): Promise<UserProfile | null> {
    const allUsers = this.getAllUsers();
    const user = allUsers.find(u => u.id === userId);
    
    if (user) {
      this.currentUser = user;
      await this.saveUserData();
      return user;
    }
    
    return null;
  }

  // Get all user profiles (for multi-child families)
  getAllUsers(): UserProfile[] {
    try {
      const allUsersData = localStorage.getItem('readbuddy_all_users');
      if (allUsersData) {
        return JSON.parse(allUsersData);
      }
    } catch (error) {
      console.error('Failed to load all users:', error);
    }
    return [];
  }

  // Add user to family account
  async addToFamily(user: UserProfile): Promise<void> {
    const allUsers = this.getAllUsers();
    const existingIndex = allUsers.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      allUsers[existingIndex] = user;
    } else {
      allUsers.push(user);
    }
    
    localStorage.setItem('readbuddy_all_users', JSON.stringify(allUsers));
  }

  // Cloud sync (placeholder for future implementation)
  private async syncToCloud(): Promise<void> {
    // This would connect to Firebase, Supabase, or similar service
    // For now, it's a placeholder that could be implemented with:
    // - Firebase Auth + Firestore
    // - Supabase Auth + Database
    // - Custom backend with JWT authentication
    
    // Example implementation structure:
    /*
    if (this.currentUser && navigator.onLine) {
      try {
        await fetch('/api/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(this.currentUser)
        });
      } catch (error) {
        console.log('Cloud sync failed, data saved locally');
      }
    }
    */
  }

  // Generate unique user ID
  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get daily report for parents
  getDailyReport(): {
    timeSpent: number;
    activitiesCompleted: number;
    accuracy: number;
    newSkills: string[];
    strugglingWith: string[];
  } {
    if (!this.currentUser) throw new Error('No user logged in');

    const progress = this.currentUser.progress;
    const recentAccuracy = progress.recentPerformance.length > 0 
      ? progress.recentPerformance.reduce((a, b) => a + b) / progress.recentPerformance.length 
      : 0;

    return {
      timeSpent: 15, // This would be tracked in real sessions
      activitiesCompleted: progress.masteredToday,
      accuracy: Math.round(recentAccuracy * 100),
      newSkills: progress.badges.filter(b => 
        new Date(b.unlockedAt).toDateString() === new Date().toDateString()
      ).map(b => b.name),
      strugglingWith: recentAccuracy < 0.7 ? ['Phoneme isolation', 'Blending'] : []
    };
  }
}

// Create singleton instance
export const userService = new UserService();