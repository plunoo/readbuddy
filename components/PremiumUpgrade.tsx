import React, { useState } from 'react';
import { premiumService } from '../services/premiumService';

interface PremiumUpgradeProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchased: () => void;
}

const PremiumUpgrade: React.FC<PremiumUpgradeProps> = ({ isOpen, onClose, onPurchased }) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  
  const features = premiumService.getPremiumFeatureList();
  const benefits = premiumService.getPurchaseBenefits();
  const pricing = premiumService.getPricingInfo();
  const trial = premiumService.getTrialInfo();

  const handlePurchase = async () => {
    setIsPurchasing(true);
    
    try {
      // In a real app, this would integrate with Stripe or similar
      const result = await premiumService.purchasePremium();
      
      if (result.success) {
        onPurchased();
        onClose();
        // Show success message
        alert('🎉 Welcome to Premium! You now have lifetime access to all premium voices!');
      } else {
        alert('Purchase failed. Please try again.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
          
          <div className="text-center">
            <div className="text-4xl mb-2">🎭</div>
            <h2 className="text-2xl font-extrabold mb-2">Premium Voices</h2>
            <p className="text-purple-100 text-sm">
              Unlock amazing voices for better learning!
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Trial Status */}
          {trial.triesRemaining > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🆓</div>
              <p className="text-blue-700 font-bold text-sm">
                You have {trial.triesRemaining} free premium voice tries left!
              </p>
            </div>
          )}

          {/* Quick Benefits */}
          <div className="grid grid-cols-2 gap-3">
            {features.slice(0, 4).map((feature, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{feature.icon}</div>
                <div className="text-xs font-bold text-gray-700">{feature.name}</div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <div className="text-3xl font-black text-green-600 mb-2">
              ${pricing.price} USD
            </div>
            <div className="text-green-700 font-bold text-sm mb-1">
              One-Time Payment
            </div>
            <div className="text-green-600 text-xs">
              Lifetime Access - No Monthly Fees!
            </div>
          </div>

          {/* Feature Toggle */}
          <div className="text-center">
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              className="text-blue-600 font-bold text-sm hover:text-blue-700"
            >
              {showFeatures ? '▼ Hide Details' : '▶ See All Features'}
            </button>
          </div>

          {/* Detailed Features */}
          {showFeatures && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="text-green-500 text-xs mt-0.5">✓</div>
                  <div className="text-gray-700 flex-1">{benefit.replace('✅ ', '')}</div>
                </div>
              ))}
            </div>
          )}

          {/* Purchase Buttons */}
          <div className="space-y-3">
            <button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className="w-full btn-edu btn-edu-green py-4 text-lg font-extrabold relative overflow-hidden"
            >
              {isPurchasing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <span className="relative z-10">🚀 Get Premium Voices Now!</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="w-full btn-edu btn-edu-ghost py-3 text-gray-600"
            >
              Maybe Later
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center space-y-2">
            <div className="flex justify-center gap-4 text-xs text-gray-500">
              <span>🔒 Secure Payment</span>
              <span>👨‍👩‍👧‍👦 Family Safe</span>
              <span>♻️ No Subscriptions</span>
            </div>
            <p className="text-xs text-gray-400">
              Perfect for homeschool families and educators
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpgrade;