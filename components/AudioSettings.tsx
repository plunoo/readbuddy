import React, { useState, useEffect } from 'react';
import { audioService } from '../services/audioService';
import { premiumService } from '../services/premiumService';
import PremiumUpgrade from './PremiumUpgrade';
import VoiceCloning from './VoiceCloning';

interface AudioSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AudioSettings: React.FC<AudioSettingsProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [currentMode, setCurrentMode] = useState(audioService.getCurrentMode());
  const [isTestingAI, setIsTestingAI] = useState(false);
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  const [showVoiceCloning, setShowVoiceCloning] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [availableVoices, setAvailableVoices] = useState(audioService.getAvailableVoices());
  const premiumStatus = audioService.getPremiumStatus();

  useEffect(() => {
    // Update mode when network status changes
    const updateMode = () => setCurrentMode(audioService.getCurrentMode());
    window.addEventListener('online', updateMode);
    window.addEventListener('offline', updateMode);
    
    return () => {
      window.removeEventListener('online', updateMode);
      window.removeEventListener('offline', updateMode);
    };
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      audioService.setElevenLabsApiKey(apiKey.trim());
      setCurrentMode(audioService.getCurrentMode());
      alert('ElevenLabs API key saved! AI voice is now available.');
    }
  };

  const testSelectedVoice = async () => {
    setIsTestingAI(true);
    try {
      if (selectedVoice) {
        await audioService.testVoice(selectedVoice);
      } else {
        await audioService.speakLetterSound('A');
      }
    } finally {
      setIsTestingAI(false);
    }
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    audioService.setPremiumVoice(voiceId);
    setCurrentMode(audioService.getCurrentMode());
  };

  const handlePremiumPurchased = () => {
    setAvailableVoices(audioService.getAvailableVoices());
    setCurrentMode(audioService.getCurrentMode());
  };

  const handleVoiceCloned = (voiceData: any) => {
    audioService.addCustomVoice(voiceData);
    setAvailableVoices(audioService.getAvailableVoices());
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-gray-900">Audio Settings</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Premium Status */}
            {!premiumStatus.isPremium && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-purple-800">🎭 Premium Audio</h3>
                    <p className="text-sm text-purple-600">
                      Unlock amazing voices for $10 - One time only!
                    </p>
                    {premiumStatus.trial.triesRemaining > 0 && (
                      <p className="text-xs text-purple-500 mt-1">
                        {premiumStatus.trial.triesRemaining} free tries remaining
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowPremiumUpgrade(true)}
                    className="btn-edu btn-edu-purple px-4 py-2 text-xs"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            )}

            {/* Current Mode Display */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-700 mb-2">Current Audio Mode</h3>
              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold ${
                currentMode === 'premium' ? 'bg-purple-100 text-purple-700' :
                currentMode === 'elevenlabs' ? 'bg-green-100 text-green-700' :
                currentMode === 'builtin' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {currentMode === 'premium' ? '🤖 Premium AI Voice' :
                 currentMode === 'elevenlabs' ? '🤖 AI Voice (Basic)' :
                 currentMode === 'builtin' ? '🔊 Built-in Voice' :
                 '📱 Offline Mode'}
              </div>
            </div>

            {/* Voice Selection */}
            <div>
              <h3 className="font-bold text-gray-700 mb-3">Choose Voice</h3>
              <div className="space-y-2">
                {availableVoices.map((voice) => (
                  <div key={voice.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="voice"
                        value={voice.id}
                        checked={selectedVoice === voice.id}
                        onChange={(e) => handleVoiceChange(e.target.value)}
                        disabled={voice.isPremium && !premiumStatus.isPremium && premiumStatus.trial.triesRemaining === 0}
                      />
                      <div>
                        <div className="font-medium text-sm flex items-center gap-2">
                          {voice.name}
                          {voice.isPremium && (
                            <span className="bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full font-bold">
                              PRO
                            </span>
                          )}
                        </div>
                        {voice.type === 'custom' && (
                          <div className="text-xs text-gray-500">
                            {voice.relationship} • Custom Voice
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => audioService.testVoice(voice.id)}
                      className="btn-edu btn-edu-ghost px-3 py-1 text-xs"
                      disabled={voice.isPremium && !premiumStatus.isPremium && premiumStatus.trial.triesRemaining === 0}
                    >
                      🔊 Test
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Features */}
            {premiumStatus.isPremium && (
              <div className="space-y-3">
                <h3 className="font-bold text-gray-700">Premium Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowVoiceCloning(true)}
                    className="btn-edu btn-edu-purple p-4 text-center"
                  >
                    <div className="text-2xl mb-1">🎭</div>
                    <div className="text-xs font-bold">Clone Voice</div>
                  </button>
                  <button
                    onClick={() => testSelectedVoice()}
                    disabled={isTestingAI}
                    className="btn-edu btn-edu-blue p-4 text-center"
                  >
                    <div className="text-2xl mb-1">🔊</div>
                    <div className="text-xs font-bold">
                      {isTestingAI ? 'Testing...' : 'Test Voice'}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* API Key Input (Advanced) */}
            {!premiumStatus.isPremium && (
              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium text-sm">
                  🔧 Advanced: Use Your Own API Key
                </summary>
                <div className="p-4 border-t space-y-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      ElevenLabs API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={handleSaveApiKey}
                        disabled={!apiKey.trim()}
                        className="btn-edu btn-edu-blue px-4 py-2 text-xs"
                      >
                        Save
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Or buy premium for $10 to get all features without API costs!
                    </p>
                  </div>
                </div>
              </details>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                <strong>How it works:</strong> {premiumStatus.isPremium ? 
                  'Premium gives you access to the best AI voices, voice cloning, and emotional voices optimized for kids!' :
                  'Free version uses your device\'s built-in voice. Premium unlocks amazing AI voices!'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <PremiumUpgrade 
        isOpen={showPremiumUpgrade}
        onClose={() => setShowPremiumUpgrade(false)}
        onPurchased={handlePremiumPurchased}
      />

      <VoiceCloning 
        isOpen={showVoiceCloning}
        onClose={() => setShowVoiceCloning(false)}
        onVoiceCloned={handleVoiceCloned}
      />
    </>
  );
};

export default AudioSettings;