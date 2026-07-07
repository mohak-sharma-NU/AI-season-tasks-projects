import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Real Gemini API call with lazy initialization & graceful key checking
app.post("/api/chatbot", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Premium interactive fallback response generator
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let reply = "Hello! I am your Travel-Planner-Website Tourism assistant. How can I help you today?";
      if (lastMessage.includes("price") || lastMessage.includes("cost") || lastMessage.includes("cheap")) {
        reply = "Our routes start at very competitive prices, around $120 to $1,450 depending on the corridor. You can use our 'Direct Booking Hub' to book a ride, and apply surcharges to customize your luxury trip!";
      } else if (lastMessage.includes("fleet") || lastMessage.includes("vehicle") || lastMessage.includes("bus")) {
        reply = "We offer a premium fleet featuring the EX-COACH Luxury Overland Series, the SKY-LINX-09 Lie-Flat Executive Sleeper, and the VAN-SPR-004 Premium All-Terrain van. Each vehicle comes equipped with luxury seating and real-time transit telemetry!";
      } else if (lastMessage.includes("route") || lastMessage.includes("map") || lastMessage.includes("stop")) {
        reply = "We operate three core corridors: the 'Pacific Coast Highway Explorer', the 'Rocky Mountain Express', and the 'Great Lakes Commuter Link'. We also have an interactive route planner map and real-time AI route optimizer!";
      } else {
        reply = "I can guide you on booking routes, finding vehicles, or explaining current corridor analytics. (P.S. Set up your GEMINI_API_KEY in the Settings menu to enable live Gemini-powered AI answers!)";
      }
      return res.json({ reply, isSimulated: true });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });

    // Format messages for @google/genai
    // Note: contents should be in format { role: 'user' | 'model', parts: [{ text: string }] }
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const systemInstruction = `
You are a highly helpful, professional, and sophisticated concierge travel assistant for "Travel-Planner-Website Tourism Operations".
You are helping travelers plan journeys, understand fleet vehicles, optimize their routes, and book trips.
Keep your answers brief, polite, and directly focused on tourism, fleet details, pricing, and routes.
Refer to Travel-Planner-Website's high-tech luxury fleet (EX-COACH, SKY-LINX-09, VAN-SPR-004) and interactive dashboard.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
      }
    });

    const reply = response.text || "I apologize, but I couldn't formulate a response. Please try again.";
    return res.json({ reply, isSimulated: false });
  } catch (error: any) {
    console.error("Gemini chatbot error:", error);
    return res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// Real Gemini API call with lazy initialization & graceful key checking
app.post("/api/generate-itinerary", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Graceful fallback response if API key is not yet set up
      return res.status(200).json({
        routeName: `Custom Route: ${prompt.slice(0, 30)}${prompt.length > 30 ? "..." : ""}`,
        cities: ["Denver Hub", "Aspen Peak", "Salt Lake Terminal"],
        stops: ["Scenic Viewpoint Alpha", "Corridor Junction Park", "Local Heritage Site"],
        price: 890,
        description: `A bespoke journey tailored for "${prompt}". Please note: Set up your GEMINI_API_KEY in Settings > Secrets to enable full AI generation!`,
        vehicleRecommendation: "EX-COACH Luxury Overland Series",
        isSimulated: true
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });

    const systemInstruction = `
You are an advanced transportation fleet optimizer and travel route planner for "Travel-Planner-Website Tourism Wing".
Generate a high-quality, professional custom tour route matching the user's prompt.
The output MUST be valid JSON matching this schema:
{
  "routeName": string (e.g., "Custom Mojave Desert Oasis Expedition"),
  "cities": string[] (3-5 target hubs, e.g., ["Las Vegas", "Death Valley", "Zion Canyon", "Sedona"]),
  "stops": string[] (3-5 scenic landmarks, e.g., ["Badwater Basin Salt Flats", "Angels Landing Skywalk", "Red Rock Sunset Dinner"]),
  "price": number (between 100 and 2000),
  "description": string (1-2 sentences summarizing the unique premium adventure experience),
  "vehicleRecommendation": string (One of: "EX-COACH Luxury Overland Series", "SKY-LINX-09 Lie-Flat Executive Sleeper", "VAN-SPR-004 Premium All-Terrain")
}
Do not include any markdown backticks or extra text, output raw JSON only.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from the Gemini model.");
    }

    const result = JSON.parse(text.trim());
    return res.json({ ...result, isSimulated: false });
  } catch (error: any) {
    console.error("Gemini route planning error:", error);
    return res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// Serve static assets in production or use Vite dev server middleware in development
const isProd = process.env.NODE_ENV === "production";
if (isProd) {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
} else {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

const PORT = 3000;
app.listen(PORT, "localhost", () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
