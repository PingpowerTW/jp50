
import { GoogleGenAI, Chat, Content } from "@google/genai";
import { ChatMessage } from "../types";

let chatInstance: Chat | null = null;

const initializeChat = (apiKey: string) => {
  if (!apiKey) {
    console.error("Gemini API key is not provided.");
    return null;
  }
  const ai = new GoogleGenAI({ apiKey });
  chatInstance = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a friendly and encouraging Japanese learning partner named 「櫻」 (Sakura). Converse in a mix of Traditional Chinese and simple Japanese. Your goal is to help the user practice their Japanese in a fun, low-pressure environment. Keep your responses concise and cheerful.',
    },
  });
  return chatInstance;
};

export const getAiChatResponse = async (apiKey: string, history: ChatMessage[], newMessage: string): Promise<string> => {
  if (!chatInstance) {
    initializeChat(apiKey);
    if (!chatInstance) {
      throw new Error("Chat initialization failed. Please check your API key.");
    }
  }

  try {
    const response = await chatInstance.sendMessage({ message: newMessage });
    return response.text;
  } catch (error: any) {
    console.error("Error sending message to Gemini:", error);
    // Reset chat on certain errors that might corrupt the session
    if (error.message.includes('API key')) {
      chatInstance = null;
    }
    throw new Error(error.message || "An unknown error occurred while communicating with the AI.");
  }
};
