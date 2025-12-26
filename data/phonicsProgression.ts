export interface PhonicsScope {
  level: number;
  name: string;
  description: string;
  phonemes: string[];
  sampleWords: string[];
  blendingWords: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Systematic phonics progression based on research
export const PHONICS_PROGRESSION: PhonicsScope[] = [
  {
    level: 1,
    name: "Single Letter Sounds (Phase 2)",
    description: "Basic consonants and vowels",
    phonemes: ['s', 'a', 't', 'p', 'i', 'n'],
    sampleWords: ['sat', 'pat', 'tap', 'sip', 'pit', 'tin'],
    blendingWords: ['sat', 'pat', 'pit'],
    difficulty: 'beginner'
  },
  {
    level: 2,
    name: "More Single Sounds", 
    description: "Extended single letter sounds",
    phonemes: ['m', 'd', 'g', 'o', 'c', 'k'],
    sampleWords: ['mad', 'dog', 'cog', 'mop', 'cod', 'kid'],
    blendingWords: ['mad', 'dog', 'cog'],
    difficulty: 'beginner'
  },
  {
    level: 3,
    name: "Remaining Single Sounds",
    description: "Complete the alphabet",
    phonemes: ['e', 'u', 'r', 'h', 'b', 'f', 'l'],
    sampleWords: ['red', 'hug', 'rub', 'hot', 'but', 'fun', 'leg'],
    blendingWords: ['red', 'hug', 'but'],
    difficulty: 'beginner'
  },
  {
    level: 4,
    name: "Consonant Digraphs",
    description: "Two letters, one sound",
    phonemes: ['sh', 'ch', 'th', 'ng'],
    sampleWords: ['shop', 'chip', 'thin', 'ring'],
    blendingWords: ['shop', 'chip', 'ring'],
    difficulty: 'intermediate'
  },
  {
    level: 5,
    name: "Long Vowel Sounds",
    description: "Magic 'e' and vowel digraphs",
    phonemes: ['ai', 'oa', 'ie', 'ee', 'or'],
    sampleWords: ['rain', 'boat', 'pie', 'tree', 'corn'],
    blendingWords: ['rain', 'boat', 'tree'],
    difficulty: 'intermediate'
  },
  {
    level: 6,
    name: "Advanced Sounds",
    description: "Complex phonemes and alternative spellings",
    phonemes: ['ow', 'oi', 'ear', 'air', 'ure'],
    sampleWords: ['down', 'coin', 'year', 'fair', 'sure'],
    blendingWords: ['down', 'coin', 'year'],
    difficulty: 'advanced'
  }
];

export interface PhonicsActivity {
  id: string;
  type: 'phoneme_isolation' | 'blending' | 'segmenting' | 'manipulation';
  instruction: string;
  targetPhoneme: string;
  words: string[];
  correctAnswers: string[];
  audioPrompts: string[];
}

// Research-based phonemic awareness activities
export const PHONICS_ACTIVITIES: PhonicsActivity[] = [
  {
    id: 'isolation_initial',
    type: 'phoneme_isolation',
    instruction: 'What is the first sound in "{word}"?',
    targetPhoneme: 's',
    words: ['sun', 'sit', 'soap'],
    correctAnswers: ['s', 's', 's'],
    audioPrompts: [
      'Listen carefully to the beginning of this word',
      'What sound do you hear at the start?',
      'Say just the first sound'
    ]
  },
  {
    id: 'blending_cvc',
    type: 'blending',
    instruction: 'Blend these sounds together: {sounds}',
    targetPhoneme: '',
    words: ['cat', 'dog', 'run'],
    correctAnswers: ['cat', 'dog', 'run'],
    audioPrompts: [
      'Listen to each sound',
      'Now blend them smoothly together',
      'What word do you hear?'
    ]
  },
  {
    id: 'segmenting_cvc',
    type: 'segmenting', 
    instruction: 'Break this word into sounds: "{word}"',
    targetPhoneme: '',
    words: ['map', 'hit', 'cup'],
    correctAnswers: ['m-a-p', 'h-i-t', 'c-u-p'],
    audioPrompts: [
      'Say the word slowly',
      'Stretch out each sound',
      'How many sounds do you hear?'
    ]
  },
  {
    id: 'manipulation_delete',
    type: 'manipulation',
    instruction: 'Say "{word}" without the "{phoneme}" sound',
    targetPhoneme: 's',
    words: ['stop', 'fast', 'best'],
    correctAnswers: ['top', 'fat', 'bet'],
    audioPrompts: [
      'Say the whole word first',
      'Now take away the sound I tell you',
      'What new word do you hear?'
    ]
  }
];