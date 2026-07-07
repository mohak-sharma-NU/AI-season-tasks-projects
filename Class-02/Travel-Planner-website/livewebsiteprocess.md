# 🚀 Deploying Travel-Planner-Website to Vercel for Free (Full-Stack Support)

Vercel is a premier cloud platform for static sites and serverless functions. It is 100% free for personal use and ideal for hosting the **Travel-Planner-Website Tourism Operations Terminal**.

Because our application is full-stack (React frontend + Express Node.js backend with Google Gemini API), standard static hosting is not enough on its own. To keep the Express APIs fully functional, we will host the React frontend on **Vercel's Edge CDN** and run the Express app inside a **Vercel Serverless Function**.

---

## 🛠️ Step 1: Create a Vercel Configuration File (`vercel.json`)

To instruct Vercel on how to compile the React code and route requests correctly between static files and serverless APIs, create a file named `vercel.json` in your project's **root directory**:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "dist/$1"
    }
  ]
}
```

*What this configuration does:*
1.  **Vercel Node Builder:** Configures Vercel to look at `package.json` to handle dependencies and run backend functions.
2.  **API Route Routing:** Automatically sends any incoming URL starting with `/api/` (e.g., `/api/chatbot`, `/api/generate-itinerary`) directly to our serverless file in `api/index.ts`.
3.  **Static SPA Routing:** Redirects all non-API URLs to the compiled static assets in `dist/` so that React controls routing on the client side.

---

## 📂 Step 2: Prepare the Serverless API Handler

On Vercel, a persistent server listener (`app.listen()`) is not required because Vercel boots up the Express app dynamically on demand when an API endpoint is hit. 

To adapt the project for Vercel without breaking your local `npm run dev` command, follow these steps:

### 1. Create a new directory named `api` in your project root:
```bash
mkdir api
```

### 2. Create a file named `api/index.ts` containing the serverless entrypoint:
```ts
import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// 1. Gemini AI Chatbot Route
app.post("/api/chatbot", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "GEMINI_API_KEY is not configured on Vercel." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const systemInstruction = "You are a highly helpful concierge travel assistant for Travel-Planner-Website Tourism.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: { systemInstruction }
    });

    return res.json({ reply: response.text || "No reply generated." });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// 2. Gemini Custom Itinerary Generator Route
app.post("/api/generate-itinerary", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "GEMINI_API_KEY is not configured on Vercel." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `
      You are an advanced transportation fleet optimizer and travel route planner.
      Generate a high-quality, professional custom tour route. Output raw JSON only matching this schema:
      {
        "routeName": "Name of tour",
        "cities": ["City A", "City B"],
        "stops": ["Scenic A", "Scenic B"],
        "price": 850,
        "description": "Short summary",
        "vehicleRecommendation": "EX-COACH Luxury Overland Series"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || "{}");
    return res.json({ ...result, isSimulated: false });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

// Export the Express app for Vercel's serverless handler
export default app;
```

---

## 🔒 Step 3: Configure Environment Variables in Vercel

To ensure your Google Gemini integration remains active and secure:

1.  Log in to your **[Vercel Dashboard](https://vercel.com/)**.
2.  Navigate to your imported project page.
3.  Click on the **Settings** tab.
4.  Select **Environment Variables** on the left menu.
5.  Add a new key-value pair:
    *   **Key:** `GEMINI_API_KEY`
    *   **Value:** `AIzaSyYourActualAPIKey...`
6.  Click **Save**. Vercel will safely encrypt your key and insert it securely into the serverless container where it cannot be leaked to the client browser.

---

## 🚀 Step 4: Deploying to Vercel

You can deploy using either Vercel's automated git connection or the command line.

### Method A: Connect Your GitHub Repository (Recommended & Continuous Delivery)
1.  Commit and push your local workspace to a repository on **GitHub**, **GitLab**, or **Bitbucket**.
2.  Go to the [Vercel Project Creation Portal](https://vercel.com/new).
3.  Click **Import** next to your repository.
4.  Configure the following build settings:
    *   **Framework Preset:** `Vite` (or leave as *Other* if automatically detected).
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
5.  Expand the **Environment Variables** section and insert your `GEMINI_API_KEY`.
6.  Click **Deploy**. 
7.  *Every subsequent push to your main branch will trigger a fresh, automated deployment!*

### Method B: Deploy Instantly via Vercel CLI
If you prefer terminal-based deployment without pushing to a Git host:

1.  Install Vercel's command line interface globally:
    ```bash
    npm install -g vercel
    ```
2.  Log in to your Vercel account via terminal:
    ```bash
    vercel login
    ```
3.  Trigger the live deployment wizard from your project's root folder:
    ```bash
    vercel
    ```
    Follow the prompts (accept default configurations by pressing enter).
4.  Once deployed to a preview environment, release it to your production URL:
    ```bash
    vercel --prod
    ```

---

## 📋 Vercel-Specific Deployment Tips & Tricks

*   **Vercel Serverless Timeouts:**
    The free tier of Vercel has a serverless execution timeout limit of **10 seconds** per API invocation. Since Google Gemini API calls are extremely fast and typically complete within 2–5 seconds, the `/api/chatbot` and `/api/generate-itinerary` functions will run well within this window.
*   **Prevent CORS Blockages:**
    Since Vercel serves the React app and the Express API serverless functions under the *exact same domain name*, your fetch requests (e.g., `fetch("/api/chatbot")`) do not have to jump across origins. This entirely bypasses CORS restrictions and enhances security.
*   **Vite Assets Bundler Config:**
    Vercel automatically copies all compiled files inside `dist/` directly to its global Edge delivery nodes, guaranteeing instantaneous app startup and loading times around the globe!
