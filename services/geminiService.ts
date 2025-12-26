
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  async generateStory(phonicsLevel: number, sounds: string[]) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a decodable 3-sentence story for a Level ${phonicsLevel} reader. 
      TARGET SOUNDS: ${sounds.join(', ')}.
      RULES:
      1. ONLY use words that can be sounded out using these phonemes or very basic sight words (the, a, is).
      2. Keep it fun and whimsical.
      3. Focus heavily on alliteration with the target sounds.`,
      config: { 
        systemInstruction: "You are an expert Orton-Gillingham literacy specialist. You create decodable text for children learning to read. You never use complex words that haven't been taught yet.",
        temperature: 0.7 
      }
    });
    return response.text || "The cat sat on the mat.";
  },

  async generateStoryIllustration(prompt: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `Children's book illustration for: "${prompt}". Style: Clean paper-cut art, vibrant primary colors, high contrast, simple shapes, friendly characters, soft studio lighting, white background border.` }]
        },
        config: {
          imageConfig: { aspectRatio: "16:9" }
        }
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Image Generation Error", error);
      return null;
    }
  },

  async getSmartHint(targetSound: string, userAttempt: string) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The child tried to say "${targetSound}" but it sounded like "${userAttempt}".`,
      config: { 
        systemInstruction: "You are a friendly speech-language pathologist. Provide a one-sentence 'Articulatory Hint' for a 5-year-old. Tell them where to put their tongue, lips, or teeth to make the sound correctly. Be extremely encouraging.",
        temperature: 0.5 
      }
    });
    return response.text || "You're close! Try blowing a little more air.";
  },

  async textToSpeech(text: string, voiceName: string = 'Kore') {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
      return null;
    }
  }
};

export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}
