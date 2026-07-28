var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "20mb" }));
  const apiKey = process.env.GEMINI_API_KEY || "";
  const ai = new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, systemInstruction, contextText } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message string is required" });
      }
      const defaultSystemInstruction = "You are RightPDF Gemini AI, an expert AI assistant specialized in PDF document analysis, document summarization, contract review, text extraction, translation, document drafting, and answering questions about PDF tools. Provide clean, accurate, and visually structured Markdown responses.";
      const finalSystemInstruction = systemInstruction || defaultSystemInstruction;
      let promptText = message;
      if (contextText && typeof contextText === "string" && contextText.trim().length > 0) {
        promptText = `[ATTACHED DOCUMENT / TEXT CONTEXT]
${contextText.slice(0, 15e3)}

[USER QUESTION / REQUEST]
${message}`;
      }
      const formattedHistory = Array.isArray(history) ? history.map((item) => ({
        role: item.role === "assistant" ? "model" : item.role === "model" ? "model" : "user",
        parts: [{ text: item.content || item.text || "" }]
      })) : [];
      const chat = ai.chats.create({
        model: "gemini-3.6-flash",
        config: {
          systemInstruction: finalSystemInstruction,
          temperature: 0.7
        },
        history: formattedHistory
      });
      const result = await chat.sendMessage({ message: promptText });
      const responseText = result.text || "No response received from Gemini AI.";
      res.json({
        text: responseText,
        model: "gemini-3.6-flash"
      });
    } catch (err) {
      console.error("Gemini AI Chat API Error:", err);
      res.status(500).json({
        error: err.message || "Failed to process request with Gemini AI"
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RightPDF Express Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
//# sourceMappingURL=server.cjs.map
