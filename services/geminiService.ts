import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize the API client
// Note: In a real production app, ensure API_KEY is set in environment variables.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are Leyland, a helpful and patient AI Russian language tutor designed specifically for Azerbaijani speakers. 
Your goal is to help users learn Russian grammar, vocabulary, and conversation.
If the user speaks Azerbaijani, reply in Azerbaijani or a mix of Russian/Azerbaijani to explain concepts clearly.
If the user makes a mistake in Russian, gently correct them and explain why in Azerbaijani if needed.
Keep explanations concise unless asked for details.
`;

export const GeminiService = {
  /**
   * Sends a message to Gemini and returns the response text.
   * Handles "Thinking Mode" configuration.
   */
  sendMessage: async (
    history: ChatMessage[], 
    newMessage: string, 
    useThinkingMode: boolean
  ): Promise<string> => {
    try {
      if (!apiKey) {
        return "Error: API Key is missing. Please check your configuration.";
      }

      // Filter history for the API format (content items)
      // We start a fresh chat or use generateContent logic for thinking mode
      // Because thinking mode often requires a fresh stateless call or specific config
      // For simplicity in this demo, we will use generateContent to ensure specific config applies easily per turn
      // or use chat with specific config.
      
      const modelName = 'gemini-3-pro-preview';

      // Prepare configuration
      const config: any = {
        systemInstruction: SYSTEM_INSTRUCTION,
      };

      if (useThinkingMode) {
        config.thinkingConfig = { thinkingBudget: 32768 };
        // maxOutputTokens must NOT be set when using thinkingBudget
      } else {
        // Optional: set standard parameters for non-thinking mode if desired
        config.temperature = 0.7;
      }

      // Convert internal ChatMessage format to Gemini Content format for history context
      // Note: For 'thinking' models, keeping history can be complex if context window fills, 
      // but we will attempt to pass recent context.
      const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      // Add the new message
      contents.push({
        role: 'user',
        parts: [{ text: newMessage }]
      });

      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: config
      });

      if (response.text) {
        return response.text;
      } else {
        return "I'm sorry, I couldn't generate a text response.";
      }

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return `Error: ${error.message || "Something went wrong with Leyland AI."}`;
    }
  }
};