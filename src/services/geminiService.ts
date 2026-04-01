import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function speak(text: string, voice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' = 'Kore') {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'audio/pcm;rate=24000' });
      
      // Since it's raw PCM 24kHz, we need to wrap it or use AudioContext
      // For simplicity in a web app, we can use a small helper to play PCM
      playPCM(bytes, 24000);
    }
  } catch (error) {
    console.error("TTS Error:", error);
  }
}

function playPCM(data: Uint8Array, sampleRate: number) {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const buffer = audioCtx.createBuffer(1, data.length / 2, sampleRate);
  const channelData = buffer.getChannelData(0);
  
  // PCM 16-bit is 2 bytes per sample
  for (let i = 0; i < data.length; i += 2) {
    const sample = (data[i + 1] << 8) | data[i];
    // Convert to float -1.0 to 1.0
    channelData[i / 2] = (sample >= 0x8000 ? sample - 0x10000 : sample) / 0x8000;
  }
  
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start();
}
