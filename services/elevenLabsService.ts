// ElevenLabs Integration for Enhanced Voice Synthesis
// This service provides high-quality, child-friendly voice generation

interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string; // Child-friendly voice
  modelId: string;
  voiceSettings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
}

interface SpeechRequest {
  text: string;
  voice_id: string;
  model_id: string;
  voice_settings: any;
}

export class ElevenLabsService {
  private config: ElevenLabsConfig;
  private audioCache: Map<string, string> = new Map();

  constructor() {
    this.config = {
      apiKey: process.env.ELEVENLABS_API_KEY || '',
      voiceId: 'child_friendly_voice', // Replace with actual ElevenLabs child voice ID
      modelId: 'eleven_monolingual_v1',
      voiceSettings: {
        stability: 0.75, // Higher stability for consistent pronunciation
        similarity_boost: 0.85, // Good voice similarity
        style: 0.2, // Slight style variation for engagement
        use_speaker_boost: true
      }
    };
  }

  // Generate audio for phonics lessons with emphasis on phonemes
  async generatePhonicsAudio(text: string, emphasis?: string[]): Promise<string> {
    const cacheKey = `phonics_${text}_${emphasis?.join('-') || ''}`;
    
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey)!;
    }

    // Add SSML markup for phonics emphasis
    const ssmlText = this.addPhonicsEmphasis(text, emphasis);

    try {
      const audioUrl = await this.synthesizeSpeech(ssmlText);
      this.audioCache.set(cacheKey, audioUrl);
      return audioUrl;
    } catch (error) {
      console.error('ElevenLabs synthesis failed:', error);
      // Fallback to browser speech synthesis
      return this.fallbackToWebSpeech(text);
    }
  }

  // Add SSML markup for phonics teaching
  private addPhonicsEmphasis(text: string, emphasis?: string[]): string {
    let ssmlText = text;

    if (emphasis) {
      emphasis.forEach(phoneme => {
        const regex = new RegExp(`\\b(\\w*${phoneme}\\w*)\\b`, 'gi');
        ssmlText = ssmlText.replace(regex, `<emphasis level="strong">$1</emphasis>`);
      });
    }

    // Add pauses for blending exercises
    if (text.includes('-')) {
      ssmlText = ssmlText.replace(/-/g, '<break time="0.3s"/>');
    }

    // Slower rate for phonics instruction
    return `<speak><prosody rate="slow">${ssmlText}</prosody></speak>`;
  }

  // Generate encouraging feedback with emotional tone
  async generateFeedback(type: 'success' | 'encouragement' | 'hint', context?: string): Promise<string> {
    const feedbackTemplates = {
      success: [
        "Fantastic! You got that sound perfect!",
        "Amazing work! You're becoming a reading superstar!",
        "Brilliant! That was exactly right!",
        "Wonderful! You're getting so good at this!"
      ],
      encouragement: [
        "That's okay! Learning takes practice. Let's try again!",
        "You're doing great! Reading is tricky but you can do it!",
        "Close! You're on the right track. One more try!",
        "Good effort! Let's break it down step by step."
      ],
      hint: [
        "Listen carefully to this sound...",
        "Try stretching out the word slowly...",
        "Break it into smaller sounds...",
        "Remember what we practiced before..."
      ]
    };

    const randomFeedback = feedbackTemplates[type][Math.floor(Math.random() * feedbackTemplates[type].length)];
    return this.generatePhonicsAudio(randomFeedback);
  }

  // Generate letter sounds with proper pronunciation
  async generateLetterSound(letter: string, includePhoneticExample: boolean = true): Promise<string> {
    let text = `The letter ${letter.toUpperCase()} says "${letter.toLowerCase()}"`;
    
    if (includePhoneticExample) {
      const examples = this.getPhoneticExamples(letter.toLowerCase());
      if (examples.length > 0) {
        text += `, like in ${examples[0]}`;
      }
    }

    return this.generatePhonicsAudio(text, [letter.toLowerCase()]);
  }

  // Generate blending exercises
  async generateBlendingExercise(sounds: string[], word: string): Promise<{
    individual: string;
    blended: string;
    instruction: string;
  }> {
    const instruction = "Now let's blend these sounds together";
    const individual = sounds.join(' - '); // Will add pauses via SSML
    const blended = word;

    return {
      individual: await this.generatePhonicsAudio(individual),
      blended: await this.generatePhonicsAudio(blended),
      instruction: await this.generatePhonicsAudio(instruction)
    };
  }

  private async synthesizeSpeech(text: string): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const request: SpeechRequest = {
      text,
      voice_id: this.config.voiceId,
      model_id: this.config.modelId,
      voice_settings: this.config.voiceSettings
    };

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.config.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.config.apiKey
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  }

  private fallbackToWebSpeech(text: string): string {
    // Fallback to existing web speech synthesis
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
    return ''; // Return empty for compatibility
  }

  private getPhoneticExamples(phoneme: string): string[] {
    const examples: Record<string, string[]> = {
      'a': ['apple', 'ant', 'cat'],
      'b': ['ball', 'bear', 'cub'],
      'c': ['cat', 'car', 'cup'],
      'd': ['dog', 'dad', 'red'],
      'e': ['egg', 'elephant', 'ten'],
      'f': ['fish', 'fun', 'leaf'],
      'g': ['goat', 'game', 'big'],
      'h': ['hat', 'house', 'happy'],
      'i': ['igloo', 'insect', 'pig'],
      'j': ['jar', 'jump', 'jam'],
      'k': ['key', 'kite', 'cake'],
      'l': ['lion', 'lamp', 'ball'],
      'm': ['mouse', 'moon', 'swim'],
      'n': ['nest', 'net', 'sun'],
      'o': ['octopus', 'orange', 'box'],
      'p': ['pig', 'pen', 'cup'],
      'q': ['queen', 'quilt', 'quick'],
      'r': ['rabbit', 'red', 'car'],
      's': ['sun', 'snake', 'bus'],
      't': ['tiger', 'top', 'cat'],
      'u': ['umbrella', 'up', 'cup'],
      'v': ['van', 'vest', 'love'],
      'w': ['wolf', 'water', 'cow'],
      'x': ['box', 'fox', 'six'],
      'y': ['yellow', 'yes', 'sky'],
      'z': ['zebra', 'zip', 'buzz']
    };

    return examples[phoneme] || [];
  }
}

// Enhanced voice service with ElevenLabs integration
export const enhancedVoiceService = new ElevenLabsService();