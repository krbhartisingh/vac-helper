import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { MASTERCLASS_TOPICS } from "./src/topics.js";

// Load environment variables
dotenv.config();

// ES module path resolution equivalents
const getDirname = () => {
  try {
    return __dirname;
  } catch (e) {
    return path.dirname(fileURLToPath(import.meta.url));
  }
};

const serverDirname = getDirname();

const app = express();
const PORT = 3000;

// Body parsers
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Helper to encode 24kHz 16-bit mono PCM into standard WAV format
function encodeWAV(pcmBuffer: Buffer, sampleRate: number = 24000): Buffer {
  const buffer = Buffer.alloc(44 + pcmBuffer.length);
  
  /* RIFF identifier */
  buffer.write("RIFF", 0);
  /* file length */
  buffer.writeUInt32LE(36 + pcmBuffer.length, 4);
  /* RIFF type */
  buffer.write("WAVE", 8);
  /* format chunk identifier */
  buffer.write("fmt ", 12);
  /* format chunk length */
  buffer.writeUInt32LE(16, 16);
  /* sample format (1 = PCM raw) */
  buffer.writeUInt16LE(1, 20);
  /* channel count (1 = mono) */
  buffer.writeUInt16LE(1, 22);
  /* sample rate */
  buffer.writeUInt32LE(sampleRate, 24);
  /* byte rate (sample rate * block align) */
  buffer.writeUInt32LE(sampleRate * 2, 28);
  /* block align (channel count * bytes per sample) */
  buffer.writeUInt16LE(2, 32);
  /* bits per sample */
  buffer.writeUInt16LE(16, 34);
  /* data chunk identifier */
  buffer.write("data", 36);
  /* data chunk length */
  buffer.writeUInt32LE(pcmBuffer.length, 40);
  
  // Copy PCM samples
  pcmBuffer.copy(buffer, 44);
  return buffer;
}

// Lazy initializer for Gemini client to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is not configured. Please add your key in the secrets panel in the top-right Settings menu.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Routes
app.post("/api/chat", async (req, res) => {
  const { messages, topicId, language } = req.body;

  try {
    const ai = getGeminiClient();
    
    // Find the targeted masterclass context
    const topic = MASTERCLASS_TOPICS.find((t) => t.id === topicId) || MASTERCLASS_TOPICS[0];
    
    // Setup rich, multi-modal contextual tutoring system instruction
    let systemInstruction = `You are a highly knowledgeable, friendly, and structured AI Study Companion & Masterclass Tutor.
You are helping the student master the topic: "${topic.title}" (${topic.hindiTitle}).

Here is the factual briefing context and outline for this module:
${topic.systemContext}

Key subtopics discussed in this masterclass include:
${topic.subtopics.map(t => `- ${t}`).join("\n")}

Respond according to the user's selected language instruction:
- Current Target Language mode: ${language === "en" ? "Strictly English" : language === "hi" ? "Strictly Hindi (using readable Hindi/Devanagari script)" : "Bilingual Hinglish (Hindi-English mix using Latin or combined script, which is conversational and highly comfortable for Indian students)"}.

Guidelines:
1. Always base your explanations exactly on the provided masterclass context. Do not invent fictitious details.
2. Structure your replies using clear headings, bold terms, and readable bullet points. Avoid giant walls of text, keep it engaging and digestible!
3. Be supportive, friendly, and act as a professional academic mentor (like the creator of the presentations, KR. Bharti Singh).
4. Do not mention directories, config files, or internal technical engineering code setups unless asked. Make explanations rich, intuitive, and conceptual!
`;

    // Map the messages history to the correct @google/genai format
    const contents = messages || [];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    const botText = response.text || "Sorry, I could not formulate a response.";
    res.json({ text: botText });

  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: error.message || "An unexpected error occurred during chat processing." });
  }
});

app.post("/api/tts", async (req, res) => {
  const { text, voice } = req.body;

  if (!text) {
    res.status(400).json({ error: "Text field is required for Text-To-Speech conversion." });
    return;
  }

  try {
    const ai = getGeminiClient();
    
    // Strip markdown bold or lists from the text to make pronunciation natural
    const cleanedText = text
      .replace(/[*#_`~>]/g, "") // Remove Markdown characters
      .replace(/^\s*[-+*]\s+/gm, "") // Remove lists hyphens
      .replace(/\n+/g, " ") // Replace line breaks with spaces
      .substring(0, 800); // Guard rails to prevent huge TTS cycles

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: cleanedText }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio payload returned from Gemini TTS engine.");
    }

    // Convert base64 raw PCM back to Buffer
    const pcmBuffer = Buffer.from(base64Audio, "base64");
    
    // Wrap raw 24kHz PCM into standard WAV buffer
    const wavBuffer = encodeWAV(pcmBuffer, 24000);

    // Send binary response back to client with appropriate header
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Length", wavBuffer.length);
    res.end(wavBuffer);

  } catch (error: any) {
    console.error("Gemini TTS API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate speech audio." });
  }
});

// Start server async function
async function startServer() {
  // Vite/Static asset middleware integration
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
