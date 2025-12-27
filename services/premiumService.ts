// Premium Audio Service - Handles $10 Premium Voice Features
class PremiumService {
  private readonly PREMIUM_PRICE = 10; // $10 USD
  private premiumFeatures = {
    voiceCloning: false,
    emotionalVoices: false,
    teacherVoice: false,
    multipleVoices: false,
    ssmlSupport: false
  };

  constructor() {
    this.loadPremiumStatus();
  }

  // Check if user has purchased premium features
  isPremiumUser(): boolean {
    const premium = localStorage.getItem('readbuddy_premium');
    const expiry = localStorage.getItem('readbuddy_premium_expiry');
    
    if (!premium || !expiry) return false;
    
    // Premium never expires once purchased (lifetime)
    return premium === 'active' && new Date() < new Date(expiry);
  }

  // Get available premium features
  getPremiumFeatures() {
    if (!this.isPremiumUser()) {
      return {
        voiceCloning: false,
        emotionalVoices: false,
        teacherVoice: false,
        multipleVoices: false,
        ssmlSupport: false
      };
    }
    
    return this.premiumFeatures;
  }

  // Simulate premium purchase (in real app, integrate with Stripe/PayPal)
  async purchasePremium(): Promise<{ success: boolean, error?: string }> {
    try {
      // In a real implementation, this would call Stripe/PayPal
      // For demo purposes, we'll simulate a successful purchase
      
      // Set premium status with far future expiry (lifetime access)
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 10); // 10 years
      
      localStorage.setItem('readbuddy_premium', 'active');
      localStorage.setItem('readbuddy_premium_expiry', expiryDate.toISOString());
      localStorage.setItem('readbuddy_premium_purchased_date', new Date().toISOString());
      
      // Enable all premium features
      this.premiumFeatures = {
        voiceCloning: true,
        emotionalVoices: true,
        teacherVoice: true,
        multipleVoices: true,
        ssmlSupport: true
      };
      
      this.savePremiumFeatures();
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Purchase failed. Please try again.' };
    }
  }

  // Get premium feature descriptions
  getPremiumFeatureList() {
    return [
      {
        icon: '🎭',
        name: 'Teacher Voice Clone',
        description: 'Clone your teacher\'s voice for familiar learning',
        benefit: 'Your child learns with their favorite teacher\'s voice'
      },
      {
        icon: '😊',
        name: 'Emotional Voices',
        description: 'Happy, excited, or calm voices for different moods',
        benefit: 'Engaging voices that match learning activities'
      },
      {
        icon: '👥',
        name: 'Multiple Characters',
        description: '50+ kid-friendly voice characters',
        benefit: 'Different voices for stories and lessons'
      },
      {
        icon: '🔤',
        name: 'Perfect Phonics',
        description: 'Advanced pronunciation controls (SSML)',
        benefit: 'Crystal-clear letter sounds and phonemes'
      },
      {
        icon: '🌍',
        name: 'Global Voices',
        description: '70+ languages and accents',
        benefit: 'Perfect for multilingual families'
      },
      {
        icon: '⚡',
        name: 'Ultra-Fast Audio',
        description: 'Lightning-fast premium voice generation',
        benefit: 'No waiting - instant audio feedback'
      }
    ];
  }

  // Get purchase benefits
  getPurchaseBenefits() {
    return [
      '✅ One-time payment of $10 - No subscriptions!',
      '✅ Lifetime access to all premium voices',
      '✅ Clone teacher/parent voices (with consent)',
      '✅ 50+ kid-friendly voice characters',
      '✅ Emotional voices (happy, calm, excited)',
      '✅ Perfect phonics pronunciation',
      '✅ 70+ languages for global families',
      '✅ Ultra-fast premium audio generation',
      '✅ All future premium voice updates included'
    ];
  }

  // Save premium features to localStorage
  private savePremiumFeatures() {
    localStorage.setItem('readbuddy_premium_features', JSON.stringify(this.premiumFeatures));
  }

  // Load premium features from localStorage
  private loadPremiumStatus() {
    const savedFeatures = localStorage.getItem('readbuddy_premium_features');
    if (savedFeatures && this.isPremiumUser()) {
      this.premiumFeatures = { ...this.premiumFeatures, ...JSON.parse(savedFeatures) };
    }
  }

  // Get premium voice options
  getPremiumVoices() {
    if (!this.isPremiumUser()) return [];
    
    return [
      {
        id: 'rachel-cheerful',
        name: 'Ms. Rachel (Cheerful)',
        gender: 'female',
        age: 'adult',
        emotion: 'cheerful',
        description: 'Perfect for exciting lessons and celebrations'
      },
      {
        id: 'adam-calm',
        name: 'Mr. Adam (Calm)',
        gender: 'male',
        age: 'adult',
        emotion: 'calm',
        description: 'Great for bedtime stories and quiet reading'
      },
      {
        id: 'charlotte-excited',
        name: 'Ms. Charlotte (Excited)',
        gender: 'female',
        age: 'adult',
        emotion: 'excited',
        description: 'Enthusiastic voice for games and activities'
      },
      {
        id: 'custom-teacher',
        name: 'Teacher Voice (Custom)',
        gender: 'custom',
        age: 'adult',
        emotion: 'neutral',
        description: 'Your cloned teacher or parent voice'
      }
    ];
  }

  // Check if specific premium feature is available
  hasFeature(feature: keyof typeof this.premiumFeatures): boolean {
    return this.isPremiumUser() && this.premiumFeatures[feature];
  }

  // Get remaining trial info (free users get 5 premium voice tries)
  getTrialInfo() {
    const triesUsed = parseInt(localStorage.getItem('readbuddy_premium_tries') || '0');
    const maxTries = 5;
    
    return {
      triesUsed,
      triesRemaining: Math.max(0, maxTries - triesUsed),
      maxTries
    };
  }

  // Use a trial premium feature
  useTrialFeature(): boolean {
    if (this.isPremiumUser()) return true;
    
    const trial = this.getTrialInfo();
    if (trial.triesRemaining > 0) {
      localStorage.setItem('readbuddy_premium_tries', (trial.triesUsed + 1).toString());
      return true;
    }
    return false;
  }

  // Get pricing info
  getPricingInfo() {
    return {
      price: this.PREMIUM_PRICE,
      currency: 'USD',
      type: 'one-time',
      description: 'Lifetime Premium Audio Access'
    };
  }

  // Reset premium status (for testing)
  resetPremium() {
    localStorage.removeItem('readbuddy_premium');
    localStorage.removeItem('readbuddy_premium_expiry');
    localStorage.removeItem('readbuddy_premium_purchased_date');
    localStorage.removeItem('readbuddy_premium_features');
    localStorage.removeItem('readbuddy_premium_tries');
    
    this.premiumFeatures = {
      voiceCloning: false,
      emotionalVoices: false,
      teacherVoice: false,
      multipleVoices: false,
      ssmlSupport: false
    };
  }
}

// Export singleton instance
export const premiumService = new PremiumService();