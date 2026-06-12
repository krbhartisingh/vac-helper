export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  audioUrl?: string; // If audio is generated for this message
}

export interface MasterclassTopic {
  id: string;
  title: string;
  hindiTitle: string;
  category: string;
  description: string;
  hindiDescription: string;
  subtopics: string[];
  systemContext: string; // The core factual briefing derived from the PDF pages to feed to Gemini
}

export interface ChatRequest {
  messages: { role: "user" | "model"; parts: { text: string }[] }[];
  topicId: string;
  language: "en" | "hi" | "bilingual";
}

export interface TtsRequest {
  text: string;
  voice: "Kore" | "Puck" | "Charon" | "Fenrir" | "Zephyr";
}
