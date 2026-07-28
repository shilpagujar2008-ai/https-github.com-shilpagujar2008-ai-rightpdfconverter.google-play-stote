import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "20mb" }));

  // Initialize Google GenAI client for server-side API calls
  const apiKey = process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Open Gemini AI Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, systemInstruction, contextText } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message string is required" });
      }

      const defaultSystemInstruction =
        "You are RightPDF Gemini AI, an expert AI assistant specialized in PDF document analysis, document summarization, contract review, text extraction, translation, document drafting, and answering questions about PDF tools. Provide clean, accurate, and visually structured Markdown responses.";

      const finalSystemInstruction = systemInstruction || defaultSystemInstruction;

      // Construct prompt content including document context if attached
      let promptText = message;
      if (contextText && typeof contextText === "string" && contextText.trim().length > 0) {
        promptText = `[ATTACHED DOCUMENT / TEXT CONTEXT]\n${contextText.slice(0, 15000)}\n\n[USER QUESTION / REQUEST]\n${message}`;
      }

      // Format message history for Gemini chat if provided
      const formattedHistory = Array.isArray(history)
        ? history.map((item: any) => ({
            role: item.role === "assistant" ? "model" : item.role === "model" ? "model" : "user",
            parts: [{ text: item.content || item.text || "" }],
          }))
        : [];

      // Create Gemini chat session
      const chat = ai.chats.create({
        model: "gemini-3.6-flash",
        config: {
          systemInstruction: finalSystemInstruction,
          temperature: 0.7,
        },
        history: formattedHistory,
      });

      const result = await chat.sendMessage({ message: promptText });
      const responseText = result.text || "No response received from Gemini AI.";

      res.json({
        text: responseText,
        model: "gemini-3.6-flash",
      });
    } catch (err: any) {
      console.error("Gemini AI Chat API Error:", err);
      res.status(500).json({
        error: err.message || "Failed to process request with Gemini AI",
      });
    }
  });

  // Vite middleware for development vs static build serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RightPDF Express Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
