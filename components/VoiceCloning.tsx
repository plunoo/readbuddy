import React, { useState, useRef, useEffect } from 'react';
import { premiumService } from '../services/premiumService';

interface VoiceCloningProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceCloned: (voiceData: any) => void;
}

const VoiceCloning: React.FC<VoiceCloningProps> = ({ isOpen, onClose, onVoiceCloned }) => {
  const [step, setStep] = useState<'consent' | 'record' | 'upload' | 'processing' | 'complete'>('consent');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [voiceName, setVoiceName] = useState('');
  const [relationship, setRelationship] = useState('teacher');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Phonetic sounds training (actual sounds, not letter names)
  const trainingScript = [
    "aah",
    "bbb", 
    "cah",
    "dah",
    "ehh",
    "fff"
  ];

  const letterlandContext = [
    "Annie Apple",
    "Bouncy Ben", 
    "Clever Cat",
    "Dippy Duck",
    "Eddy Elephant",
    "Fireman Fred"
  ];

  useEffect(() => {
    if (isRecording && recordingTime < 60) {
      timerRef.current = setTimeout(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRecording, recordingTime]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setUploadFile(file);
      // Convert file to blob for consistency
      setAudioBlob(new Blob([file], { type: file.type }));
    } else {
      alert('Please select a valid audio file (MP3, WAV, etc.)');
    }
  };

  const processVoiceClone = async () => {
    if (!audioBlob || !voiceName.trim()) {
      alert('Please provide a recording and voice name.');
      return;
    }

    setStep('processing');

    try {
      // In a real implementation, this would upload to ElevenLabs
      // For demo purposes, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const voiceData = {
        id: `custom_${Date.now()}`,
        name: voiceName,
        relationship: relationship,
        audioBlob: audioBlob,
        createdAt: new Date().toISOString(),
        status: 'ready'
      };

      // Save to localStorage for demo
      const existingVoices = JSON.parse(localStorage.getItem('readbuddy_custom_voices') || '[]');
      existingVoices.push(voiceData);
      localStorage.setItem('readbuddy_custom_voices', JSON.stringify(existingVoices));

      onVoiceCloned(voiceData);
      setStep('complete');
    } catch (error) {
      alert('Voice cloning failed. Please try again.');
      setStep('record');
    }
  };

  const resetForm = () => {
    setStep('consent');
    setIsRecording(false);
    setRecordingTime(0);
    setAudioBlob(null);
    setUploadFile(null);
    setVoiceName('');
    setRelationship('teacher');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative">
          <button 
            onClick={() => { resetForm(); onClose(); }}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
          
          <div className="text-center">
            <div className="text-4xl mb-2">🎭</div>
            <h2 className="text-xl font-extrabold mb-1">Clone a Voice</h2>
            <p className="text-blue-100 text-sm">
              Create a familiar voice for your child
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Consent Step */}
          {step === 'consent' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                  ⚠️ Important: Consent Required
                </h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>✓ Only clone voices with explicit permission</li>
                  <li>✓ Perfect for teachers, parents, or family members</li>
                  <li>✓ Voice will only be used for educational content</li>
                  <li>✓ You can delete the voice anytime</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Relationship to Child
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="parent">Parent</option>
                    <option value="grandparent">Grandparent</option>
                    <option value="tutor">Tutor</option>
                    <option value="sibling">Older Sibling</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <input type="checkbox" className="w-5 h-5 text-blue-600" required />
                  <label className="text-sm text-gray-700">
                    I confirm I have permission to clone this voice and will use it only for educational purposes.
                  </label>
                </div>
              </div>

              <button
                onClick={() => setStep('record')}
                className="w-full btn-edu btn-edu-blue py-4 text-lg font-bold"
              >
                Continue to Recording
              </button>
            </div>
          )}

          {/* Recording/Upload Step */}
          {step === 'record' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Voice Name
                </label>
                <input
                  type="text"
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  placeholder="e.g., Ms. Johnson, Mom, Dad"
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-bold text-blue-800 mb-3">Training Script</h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <p className="font-medium">Read these pure letter sounds (Letterland method):</p>
                  {trainingScript.map((line, i) => (
                    <div key={i} className="bg-white p-3 rounded border-l-4 border-blue-300 text-center">
                      <div className="text-xs text-orange-600 mb-1">{letterlandContext[i]}</div>
                      <span className="text-2xl font-bold">{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recording Controls */}
              <div className="space-y-4">
                <div className="text-center">
                  {!isRecording && !audioBlob && (
                    <button
                      onClick={startRecording}
                      className="btn-edu btn-edu-red px-8 py-4 text-lg font-bold"
                    >
                      🎤 Start Recording
                    </button>
                  )}

                  {isRecording && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl text-red-500 animate-pulse mb-2">🔴</div>
                        <div className="text-lg font-bold text-red-600">
                          Recording... {recordingTime}s / 60s
                        </div>
                      </div>
                      <button
                        onClick={stopRecording}
                        className="btn-edu btn-edu-gray px-8 py-3"
                      >
                        ⏹️ Stop Recording
                      </button>
                    </div>
                  )}

                  {audioBlob && !isRecording && (
                    <div className="space-y-3">
                      <div className="text-green-600 font-bold">✓ Recording Complete!</div>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => { setAudioBlob(null); setRecordingTime(0); }}
                          className="btn-edu btn-edu-yellow px-4 py-2 text-sm"
                        >
                          🔄 Re-record
                        </button>
                        <button
                          onClick={processVoiceClone}
                          disabled={!voiceName.trim()}
                          className="btn-edu btn-edu-green px-6 py-2"
                        >
                          ✨ Create Voice Clone
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* File Upload Alternative */}
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-3">Or upload an audio file:</div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-edu btn-edu-ghost px-6 py-2 text-sm"
                  >
                    📁 Upload Audio File
                  </button>
                  {uploadFile && (
                    <div className="text-xs text-green-600 mt-2">
                      ✓ {uploadFile.name} uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="text-center space-y-6">
              <div className="text-6xl animate-spin">⚙️</div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Creating Your Voice Clone</h3>
                <p className="text-gray-600 text-sm">
                  This may take a few moments. We're training the AI to speak like {voiceName}!
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-sm text-blue-700">
                  ⚡ Using advanced AI to create natural-sounding voice
                </div>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <div className="text-center space-y-6">
              <div className="text-6xl">🎉</div>
              <div>
                <h3 className="text-xl font-bold text-green-600 mb-2">Voice Clone Ready!</h3>
                <p className="text-gray-600 text-sm">
                  {voiceName}'s voice has been successfully cloned and is ready for lessons!
                </p>
              </div>
              <button
                onClick={() => { resetForm(); onClose(); }}
                className="btn-edu btn-edu-green px-8 py-3"
              >
                Start Using New Voice
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceCloning;