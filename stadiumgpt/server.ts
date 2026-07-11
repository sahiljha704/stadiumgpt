import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are StadiumGPT, the official AI Copilot for the FIFA World Cup 2026.
You assist fans with navigation, food, washrooms, and stadium information.
Keep your answers concise, helpful, and professional. 
Current context: ${JSON.stringify(context || {})}
Do not hallucinate external URLs, provide helpful directions and guidance based on typical stadium layouts.

You MUST respond in valid JSON format ONLY, without any markdown formatting like \`\`\`json.
Schema:
{
  "reply": "Your natural language response to the user",
  "uiAction": {
    "type": "highlight" | "none",
    "target": "gate_a" | "gate_c" | "food_south" | "washroom_n" | "seat_104" | null
  }
}

Example 1:
{"reply": "Gate C is on Level 1. I have highlighted it on your map.", "uiAction": {"type": "highlight", "target": "gate_c"}}

Example 2:
{"reply": "There are many food options available on Level 1, including hot dogs and pizza.", "uiAction": {"type": "none", "target": null}}`;

      const generateWithRetry = async (aiClient: GoogleGenAI, reqConfig: any, retries = 3, delay = 1000): Promise<any> => {
        try {
          return await aiClient.models.generateContent(reqConfig);
        } catch (error: any) {
          const isRetryable = error?.status === 503 || error?.status === 429 || (error?.message && error.message.includes("503"));
          if (retries > 0 && isRetryable) {
            console.log(`Gemini API busy (503). Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return generateWithRetry(aiClient, reqConfig, retries - 1, delay * 2);
          }
          throw error;
        }
      };

      let responseData;
      try {
        const response = await generateWithRetry(ai, {
          model: "gemini-2.5-flash",
          contents: [
            { role: "user", parts: [{ text: message }] }
          ],
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json"
          }
        });
        const text = response.text;
        // Clean up markdown code blocks if the model still includes them
        const cleanedText = text.replace(/```json\n?|```/g, '').trim();
        responseData = JSON.parse(cleanedText);
      } catch (error: any) {
        console.error("Gemini API Error (fallback triggered):", error);
        
        // Fallback simulated intelligence
        const lowerMsg = message.toLowerCase();
        let target = null;
        let type = "none";
        let reply = "I'm having trouble connecting to the network, but I'm here to help. What are you looking for?";
        
        if (lowerMsg.includes("food") || lowerMsg.includes("order")) {
           target = "food_south";
           type = "highlight";
           reply = "Food Court South has the shortest queue right now. I've highlighted it for you.";
        } else if (lowerMsg.includes("seat") || lowerMsg.includes("find")) {
           target = "seat_104";
           type = "highlight";
           reply = "Your seat is in Sector 104. Highlighting your section now.";
        } else if (lowerMsg.includes("washroom") || lowerMsg.includes("bathroom") || lowerMsg.includes("toilet")) {
           target = "washroom_n";
           type = "highlight";
           reply = "The nearest open washroom is Main Washroom North.";
        } else if (lowerMsg.includes("score") || lowerMsg.includes("match")) {
           reply = "The current score is Argentina 1 - 0 France.";
        }
        
        responseData = { reply, uiAction: { type, target } };
      }

      res.json(responseData);
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate response." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
