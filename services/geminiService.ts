
import { GoogleGenAI, Modality } from "@google/genai";

// Ensure the API_KEY is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Generates speech from text using a specified voice.
 * @param text The text to convert to speech.
 * @param voiceName The name of the prebuilt voice to use.
 * @returns A promise that resolves to the base64 encoded audio data.
 */
export async function generateSpeech(text: string, voiceName: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from the API.");
        }

        return base64Audio;
    } catch (error) {
        console.error("Error generating speech:", error);
        throw new Error("Failed to generate speech. Please check your API key and network connection.");
    }
}
