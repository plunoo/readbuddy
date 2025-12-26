
export const speak = (text: string, rate: number = 0.9) => {
  if (!window.speechSynthesis) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.2; // Child-friendly pitch
  
  // Try to find a friendly voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => 
    v.name.includes('Google') || v.name.includes('Female') || v.name.includes('Samantha')
  );
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  window.speechSynthesis.speak(utterance);
};
