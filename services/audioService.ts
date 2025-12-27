import { premiumService } from './premiumService';

// Enhanced Audio Service with ElevenLabs API integration and offline fallback
class AudioService {
  private elevenlabsApiKey: string | null = null;
  private isOnline: boolean = navigator.onLine;
  private voices: SpeechSynthesisVoice[] = [];
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private customVoices: any[] = [];
  private selectedPremiumVoice: string | null = null;
  private forceBuiltInTTS: boolean = false; // For testing purposes

  // Letter to phonetic sound mapping (IPA notation)
  private letterSounds = {
    'A': '/æ/', 'B': '/b/', 'C': '/k/', 'D': '/d/', 'E': '/ɛ/', 'F': '/f/',
    'G': '/ɡ/', 'H': '/h/', 'I': '/ɪ/', 'J': '/dʒ/', 'K': '/k/', 'L': '/l/',
    'M': '/m/', 'N': '/n/', 'O': '/ɑ/', 'P': '/p/', 'Q': '/kw/', 'R': '/ɹ/',
    'S': '/s/', 'T': '/t/', 'U': '/ʌ/', 'V': '/v/', 'W': '/w/', 'X': '/ks/',
    'Y': '/j/', 'Z': '/z/'
  };

  // Multiple sounds per letter - vowels have multiple sounds, consonants usually one
  private letterSoundVariations = {
    'A': ['/æ/', '/eɪ/', '/ɔː/'],     // short a (cat), long a (cake), ball/call sound (ball)
    'E': ['/ɛ/', '/iː/', '/ə/'],      // short e (bed), long e (me), schwa (the)
    'I': ['/ɪ/', '/aɪ/', '/ə/'],      // short i (sit), long i (ice), schwa (pencil)
    'O': ['/ɒ/', '/oʊ/', '/ʊ/'],      // short o (hot), long o (go), book sound (book)
    'U': ['/ʌ/', '/juː/', '/uː/'],    // short u (cup), long u (cute), oo (put)
    'Y': ['/j/', '/aɪ/', '/ɪ/'],      // consonant y (yes), long i (my), short i (gym)
    // Consonants with single main sounds
    'B': ['/b/'], 'C': ['/k/', '/s/'], 'D': ['/d/'], 'F': ['/f/'], 'G': ['/g/', '/dʒ/'], 'H': ['/h/'],
    'J': ['/dʒ/'], 'K': ['/k/'], 'L': ['/l/'], 'M': ['/m/'], 'N': ['/n/'], 'P': ['/p/'], 'Q': ['/kw/'],
    'R': ['/r/'], 'S': ['/s/', '/z/'], 'T': ['/t/'], 'V': ['/v/'], 'W': ['/w/'], 'X': ['/ks/'], 'Z': ['/z/']
  };

  // Fallback phonetic sounds for offline TTS (sounds not names)
  private offlineSoundVariations = {
    'A': ['ah', 'ay', 'aw'], 'E': ['eh', 'ee', 'uh'], 'I': ['ih', 'eye', 'uh'], 
    'O': ['oh', 'oe', 'ook'], 'U': ['uh', 'you', 'oo'], 'Y': ['y', 'eye', 'ih'],
    // Consonants
    'B': ['buh'], 'C': ['k', 's'], 'D': ['duh'], 'F': ['fff'], 'G': ['guh', 'j'], 'H': ['huh'],
    'J': ['juh'], 'K': ['k'], 'L': ['lll'], 'M': ['mmm'], 'N': ['nnn'], 'P': ['puh'], 'Q': ['kw'],
    'R': ['rrr'], 'S': ['sss', 'zzz'], 'T': ['t'], 'V': ['vvv'], 'W': ['w'], 'X': ['ks'], 'Z': ['zzz']
  };

  // Track current sound index for each letter
  private currentSoundIndex: Record<string, number> = {};

  // Example words for each sound variation
  private exampleWordsPerSound = {
    'A': [
      ['cat', 'bat', 'sat'],        // short a /æ/
      ['cake', 'name', 'play'],     // long a /eɪ/
      ['ball', 'call', 'wall']      // aw sound /ɔː/ - like in ball
    ],
    'E': [
      ['egg', 'bed', 'pet'],        // short e /ɛ/
      ['me', 'see', 'tree'],        // long e /iː/
      ['the', 'above', 'taken']     // schwa /ə/
    ],
    'I': [
      ['sit', 'pig', 'win'],        // short i /ɪ/
      ['ice', 'time', 'fly'],       // long i /aɪ/
      ['pencil', 'family', 'April'] // schwa /ə/ - unstressed i
    ],
    'O': [
      ['hot', 'dog', 'box'],        // short o /ɒ/
      ['go', 'home', 'boat'],       // long o /oʊ/
      ['book', 'look', 'took']      // book sound /ʊ/ - like in book
    ],
    'U': [
      ['umbrella', 'cup', 'bus'],   // short u /ʌ/
      ['cute', 'use', 'few'],       // long u /juː/
      ['put', 'full', 'bull']       // oo sound /uː/
    ],
    'Y': [
      ['yes', 'yet', 'yellow'],     // consonant y /j/
      ['my', 'fly', 'sky'],         // long i /aɪ/
      ['gym', 'myth', 'system']     // short i /ɪ/
    ],
    // Consonants with multiple sounds
    'C': [
      ['cat', 'cup', 'can'],        // hard c /k/
      ['cent', 'city', 'nice']      // soft c /s/
    ],
    'G': [
      ['go', 'big', 'hug'],         // hard g /g/
      ['gem', 'giant', 'cage']      // soft g /dʒ/
    ],
    'S': [
      ['sit', 'sun', 'bus'],        // s sound /s/
      ['has', 'is', 'dogs']         // z sound /z/
    ],
    // Single sound consonants
    'B': [['bat', 'bib', 'sub']], 'D': [['dog', 'dad', 'bed']], 'F': [['fan', 'off', 'leaf']],
    'H': [['hat', 'hop', 'hi']], 'J': [['jam', 'jump', 'jug']], 'K': [['kite', 'kit', 'ask']],
    'L': [['lip', 'ball', 'fill']], 'M': [['man', 'mum', 'ham']], 'N': [['not', 'sun', 'fun']],
    'P': [['pat', 'pop', 'cup']], 'Q': [['queen', 'quit', 'quack']], 'R': [['rat', 'car', 'far']],
    'T': [['top', 'bit', 'cat']], 'V': [['vet', 'save', 'give']], 'W': [['wet', 'wow', 'win']],
    'X': [['box', 'six', 'fox']], 'Z': [['zip', 'buzz', 'fizz']]
  };

  // Letterland character names for context (not spoken, just for reference)
  private letterlandCharacters = {
    'A': 'Annie Apple', 'B': 'Bouncy Ben', 'C': 'Clever Cat', 'D': 'Dippy Duck',
    'E': 'Eddy Elephant', 'F': 'Fireman Fred', 'G': 'Golden Girl', 'H': 'Hairy Hat Man',
    'I': 'Impy Ink', 'J': 'Jumping Jim', 'K': 'Kicking King', 'L': 'Lucy Lamp Light',
    'M': 'Munching Mike', 'N': 'Naughty Nick', 'O': 'Oscar Orange', 'P': 'Peter Puppy',
    'Q': 'Quarrelsome Queen', 'R': 'Red Robot', 'S': 'Sammy Snake', 'T': 'Ticking Tom',
    'U': 'Uppy Umbrella', 'V': 'Vase of Violets', 'W': 'Wicked Water Witch', 'X': 'Fix-it Max',
    'Y': 'Yellow Yo-yo Man', 'Z': 'Zig Zag Zebra'
  };

  constructor() {
    this.initializeVoices();
    this.setupNetworkListener();
    this.loadCustomVoices();
    
    // Try to get ElevenLabs API key from environment or localStorage
    // Comment out the line below to test built-in TTS only
    this.elevenlabsApiKey = null; // Set to null to use built-in TTS for testing
    // this.elevenlabsApiKey = 'sk_b082b35e859773201a44f946111c6cd0c0071cc5e9ab5150' || 
    //                        process.env.ELEVENLABS_API_KEY || 
    //                        localStorage.getItem('elevenlabs_api_key') || 
    //                        null;
                           
    // Load selected premium voice
    this.selectedPremiumVoice = localStorage.getItem('readbuddy_selected_voice');
  }

  private setupNetworkListener() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('Audio Service: Online mode activated');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Audio Service: Offline mode activated');
    });
  }

  private initializeVoices() {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        this.voices = speechSynthesis.getVoices();
        this.selectPreferredVoice();
      };

      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
      loadVoices();
    }
  }

  private selectPreferredVoice() {
    this.preferredVoice = this.voices.find(voice => 
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('zira') ||
      voice.name.toLowerCase().includes('hazel') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('karen')
    ) || this.voices.find(voice => voice.lang.startsWith('en')) || null;
  }

  // Load custom cloned voices
  private loadCustomVoices() {
    const saved = localStorage.getItem('readbuddy_custom_voices');
    if (saved) {
      this.customVoices = JSON.parse(saved);
    }
  }

  // Enhanced ElevenLabs API integration with premium features
  private async speakWithElevenLabs(text: string, emotion: string = 'neutral', voiceId?: string): Promise<boolean> {
    if (!this.elevenlabsApiKey || !this.isOnline || !premiumService.isPremiumUser()) {
      return false;
    }

    // Check if user has used their trial
    if (!premiumService.isPremiumUser() && !premiumService.useTrialFeature()) {
      return false;
    }

    try {
      // Use selected premium voice or default
      const selectedVoice = voiceId || this.selectedPremiumVoice || 'pNInz6obpgDQGcFmaJgB';
      
      // Request optimized for phonetic sounds (IPA notation)
      const requestBody: any = {
        text: text, // IPA phonetic notation like /æ/, /b/, /k/
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.6,    // Higher stability for consistent phonemes
          similarity_boost: 0.8,  // Better clarity for single sounds
          style: 0.2,        // Lower style variation for pure sounds
          use_speaker_boost: false  // Disable for cleaner phonemes
        }
      };

      // Add emotional settings if available
      if (premiumService.hasFeature('emotionalVoices') && emotion !== 'neutral') {
        requestBody.voice_settings.style = this.getEmotionStyle(emotion);
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.elevenlabsApiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        await new Promise((resolve, reject) => {
          audio.onended = resolve;
          audio.onerror = reject;
          audio.play();
        });

        URL.revokeObjectURL(audioUrl);
        return true;
      }
    } catch (error) {
      console.warn('ElevenLabs API failed, falling back to built-in TTS:', error);
    }

    return false;
  }

  // Enhance text with SSML for better pronunciation
  private enhanceWithSSML(text: string, emotion: string): string {
    if (!premiumService.hasFeature('ssmlSupport')) {
      return text;
    }

    // Add emotion tags for supported voices
    const emotionTags = {
      cheerful: '<prosody rate="1.1" pitch="+10%">',
      calm: '<prosody rate="0.9" pitch="-5%">',
      excited: '<prosody rate="1.2" pitch="+15%">',
      neutral: ''
    };

    const openTag = emotionTags[emotion as keyof typeof emotionTags] || '';
    const closeTag = openTag ? '</prosody>' : '';

    // Enhance phonetic sounds with precise pronunciation
    let enhancedText = text;
    
    // Add pauses between repeated sounds for clarity
    enhancedText = enhancedText.replace(/(\w)\s+\1\s+\1/g, '$1 <break time="0.3s"/> $1 <break time="0.3s"/> $1');
    
    return `${openTag}${enhancedText}${closeTag}`;
  }

  // Get emotion style value
  private getEmotionStyle(emotion: string): number {
    const emotionMap = {
      cheerful: 0.8,
      excited: 0.9,
      calm: 0.2,
      neutral: 0.3
    };
    return emotionMap[emotion as keyof typeof emotionMap] || 0.3;
  }

  // Letterland-inspired speech synthesis for pure phonetic sounds
  private speakWithBuiltIn(text: string, settings: { rate?: number, pitch?: number, volume?: number } = {}) {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      // Create utterance for pure phoneme pronunciation
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Select most phonetically accurate voice
      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }
      
      // Letterland-optimized settings for clean phonemes
      utterance.rate = 0.7; // Slower for clarity of single phonemes
      utterance.pitch = settings.pitch || 1.3; // Child-friendly pitch
      utterance.volume = settings.volume || 1.0;
      utterance.lang = 'en-US';
      
      // Add slight pause after consonants to prevent vowel addition
      if (text.length === 1 && 'bcdfghjklmnpqrstvwxyz'.includes(text.toLowerCase())) {
        utterance.rate = 0.6; // Even slower for consonants
      }
      
      speechSynthesis.speak(utterance);
    }
  }

  // Main method to speak letter sounds with premium features and sound cycling
  async speakLetterSound(letter: string, emotion: string = 'cheerful'): Promise<void> {
    const upperLetter = letter.toUpperCase();
    
    // Get all sounds for this letter
    const elevenLabsSounds = this.letterSoundVariations[upperLetter as keyof typeof this.letterSoundVariations] || [letter];
    const offlineSounds = this.offlineSoundVariations[upperLetter as keyof typeof this.offlineSoundVariations] || [letter];
    
    // Initialize sound index if not exists
    if (!(upperLetter in this.currentSoundIndex)) {
      this.currentSoundIndex[upperLetter] = 0;
    }
    
    // Get current sound to play
    const currentIndex = this.currentSoundIndex[upperLetter];
    const elevenLabsText = elevenLabsSounds[currentIndex];
    const offlineText = offlineSounds[currentIndex];
    
    // Try premium ElevenLabs first with IPA phonetic notation (only for premium users or trials)
    if (!this.forceBuiltInTTS && this.isOnline && this.elevenlabsApiKey && (premiumService.isPremiumUser() || premiumService.getTrialInfo().triesRemaining > 0)) {
      const success = await this.speakWithElevenLabs(elevenLabsText, emotion);
      if (success) {
        // Only cycle after successful playback
        this.currentSoundIndex[upperLetter] = (currentIndex + 1) % elevenLabsSounds.length;
        return;
      }
    }

    // Fallback to built-in TTS with optimized phonetic sounds
    this.speakWithBuiltIn(offlineText, {
      rate: 0.5,   // Slower for clearer phonemes
      pitch: 1.2,  // Lower pitch for better consonant clarity
      volume: 1.0
    });
    
    // Cycle after successful playback
    this.currentSoundIndex[upperLetter] = (currentIndex + 1) % elevenLabsSounds.length;
  }

  // Speak feedback messages
  async speakFeedback(message: string, type: 'success' | 'error' | 'instruction' = 'instruction'): Promise<void> {
    const settings = {
      success: { rate: 0.8, pitch: 1.5, volume: 1.0 },
      error: { rate: 0.7, pitch: 1.3, volume: 1.0 },
      instruction: { rate: 0.7, pitch: 1.2, volume: 1.0 }
    };

    // Try ElevenLabs first if online and API key available
    if (this.isOnline && this.elevenlabsApiKey) {
      const success = await this.speakWithElevenLabs(message);
      if (success) return;
    }

    // Fallback to built-in TTS
    this.speakWithBuiltIn(message, settings[type]);
  }

  // Get phonetic notation for display - shows current sound
  getPhoneticNotation(letter: string): string {
    const upperLetter = letter.toUpperCase();
    const sounds = this.letterSoundVariations[upperLetter as keyof typeof this.letterSoundVariations] || [`/${letter}/`];
    
    // Get current sound index (but don't advance it)
    const currentIndex = this.currentSoundIndex[upperLetter] || 0;
    return sounds[currentIndex] || `/${letter}/`;
  }

  // Get all sounds for a letter
  getAllSounds(letter: string): string[] {
    const upperLetter = letter.toUpperCase();
    return this.letterSoundVariations[upperLetter as keyof typeof this.letterSoundVariations] || [`/${letter}/`];
  }

  // Get current sound info for display
  getCurrentSoundInfo(letter: string): { sound: string, index: number, total: number } {
    const upperLetter = letter.toUpperCase();
    const sounds = this.letterSoundVariations[upperLetter as keyof typeof this.letterSoundVariations] || [`/${letter}/`];
    const currentIndex = this.currentSoundIndex[upperLetter] || 0;
    
    return {
      sound: sounds[currentIndex],
      index: currentIndex + 1,
      total: sounds.length
    };
  }

  // Get Letterland character name for educational context
  getLetterlandCharacter(letter: string): string {
    const upperLetter = letter.toUpperCase();
    return this.letterlandCharacters[upperLetter as keyof typeof this.letterlandCharacters] || letter;
  }

  // Get example words for current letter sound
  getExampleWords(letter: string): string[] {
    const upperLetter = letter.toUpperCase();
    const wordSets = this.exampleWordsPerSound[upperLetter as keyof typeof this.exampleWordsPerSound] || [[letter]];
    
    // Get current sound index - this is what will play when button is pressed
    const currentIndex = this.currentSoundIndex[upperLetter] || 0;
    
    return wordSets[currentIndex] || wordSets[0] || [letter];
  }

  // Get all example words for all sounds of a letter
  getAllExampleWords(letter: string): string[][] {
    const upperLetter = letter.toUpperCase();
    return this.exampleWordsPerSound[upperLetter as keyof typeof this.exampleWordsPerSound] || [[letter]];
  }

  // Set ElevenLabs API key
  setElevenLabsApiKey(apiKey: string) {
    this.elevenlabsApiKey = apiKey;
    localStorage.setItem('elevenlabs_api_key', apiKey);
  }

  // Check if online mode is available
  isElevenLabsAvailable(): boolean {
    return this.isOnline && !!this.elevenlabsApiKey;
  }

  // Force use of built-in TTS (for testing)
  setForceBuiltInTTS(force: boolean) {
    this.forceBuiltInTTS = force;
  }

  // Get current TTS mode
  getTTSMode(): 'elevenlabs' | 'builtin' | 'forced-builtin' {
    if (this.forceBuiltInTTS) return 'forced-builtin';
    if (this.isOnline && this.elevenlabsApiKey && (premiumService.isPremiumUser() || premiumService.getTrialInfo().triesRemaining > 0)) {
      return 'elevenlabs';
    }
    return 'builtin';
  }

  // Stop any current audio
  stop() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  // Get current audio mode
  getCurrentMode(): 'elevenlabs' | 'premium' | 'builtin' | 'offline' {
    if (!this.isOnline) return 'offline';
    if (this.elevenlabsApiKey && premiumService.isPremiumUser()) return 'premium';
    if (this.elevenlabsApiKey) return 'elevenlabs';
    return 'builtin';
  }

  // Get available voices (free + premium)
  getAvailableVoices() {
    const freeVoices = [
      {
        id: 'builtin-female',
        name: 'Built-in Female Voice',
        type: 'builtin',
        gender: 'female',
        isPremium: false
      },
      {
        id: 'builtin-male',
        name: 'Built-in Male Voice',
        type: 'builtin',
        gender: 'male',
        isPremium: false
      }
    ];

    if (premiumService.isPremiumUser()) {
      const premiumVoices = premiumService.getPremiumVoices().map(voice => ({
        ...voice,
        type: 'premium',
        isPremium: true
      }));

      const customVoices = this.customVoices.map(voice => ({
        id: voice.id,
        name: voice.name,
        type: 'custom',
        gender: 'custom',
        relationship: voice.relationship,
        isPremium: true
      }));

      return [...freeVoices, ...premiumVoices, ...customVoices];
    }

    return freeVoices;
  }

  // Set selected premium voice
  setPremiumVoice(voiceId: string) {
    this.selectedPremiumVoice = voiceId;
    localStorage.setItem('readbuddy_selected_voice', voiceId);
  }

  // Get premium status and trial info
  getPremiumStatus() {
    return {
      isPremium: premiumService.isPremiumUser(),
      features: premiumService.getPremiumFeatures(),
      trial: premiumService.getTrialInfo(),
      selectedVoice: this.selectedPremiumVoice
    };
  }

  // Add custom voice from cloning
  addCustomVoice(voiceData: any) {
    this.customVoices.push(voiceData);
    localStorage.setItem('readbuddy_custom_voices', JSON.stringify(this.customVoices));
  }

  // Get custom voices
  getCustomVoices() {
    return this.customVoices;
  }

  // Test voice with actual phonetic sound
  async testVoice(voiceId: string, emotion: string = 'cheerful'): Promise<void> {
    const testText = "aah";
    
    if (voiceId.startsWith('builtin')) {
      this.speakWithBuiltIn(testText);
      return;
    }

    // Test premium voice
    if (premiumService.isPremiumUser() || premiumService.getTrialInfo().triesRemaining > 0) {
      const success = await this.speakWithElevenLabs(testText, emotion, voiceId);
      if (!success) {
        this.speakWithBuiltIn(testText);
      }
    } else {
      this.speakWithBuiltIn(testText);
    }
  }
}

// Export singleton instance
export const audioService = new AudioService();