# 🛠️ Travel-Planner-Website Local Installation & Setup Guide

This guide provides step-by-step instructions to clone, install dependencies, configure, and execute the **Travel-Planner-Website Tourism Operations Terminal** on your local machine.

---

## 📌 Prerequisites

Before installing, ensure you have the following installed on your operating system:

1.  **Node.js**: Version **18.x** or higher (Recommended: **v20 LTS**).
    *   Verify your installation by running:
        ```bash
        node --version
        ```
2.  **npm**: Version **9.x** or higher (bundled with Node.js).
    *   Verify your installation by running:
        ```bash
        npm --version
        ```
3.  **Git**: For cloning the repository from your version control provider.
    *   Verify your installation by running:
        ```bash
        git --version
        ```

---

## 🚀 Step-by-Step Installation

### 1. Clone the Codebase
If you exported the project as a ZIP or pushed it to a GitHub repository, open your terminal and clone or unpack it.

For Git repositories:
```bash
git clone <your-repository-url>
cd <project-directory-name>
```

---

### 2. Install Project Dependencies
Run the package manager installation command in the project root directory. This downloads all front-end, back-end, and compilation tools listed in `package.json` into a local `node_modules` directory:

```bash
npm install
```

#### 📦 Primary Packages Installed:
*   **Production Suite:**
    *   `react` & `react-dom` (v19) — High-performance user interface library.
    *   `express` (v4) — Lightweight Node.js server framework routing APIs and serving bundle files.
    *   `@google/genai` — The modern Google Gemini SDK for processing AI chatbot and itinerary generations.
    *   `recharts` — Robust svg charting library for data analysis.
    *   `motion` — Fluid layout animations and page transitions.
    *   `lucide-react` — Comprehensive vector outline icon framework.
*   **Development Suite:**
    *   `vite` (v6) — Instant-on module bundler and dev server.
    *   `tsx` — TypeScript Execute tool to launch the Express `.ts` server seamlessly without an intermediate build step.
    *   `tailwindcss` (v4) — Utility-first style engine.
    *   `typescript` — Strict type system compiler.

---

### 3. Setup Your Environment Variables (`.env`)
The application uses environment variables to communicate securely with Google Gemini.

1.  Locate the `.env.example` file in the root folder.
2.  Duplicate this file and rename it to `.env`:
    ```bash
    cp .env.example .env
    ```
3.  Open the newly created `.env` file in your preferred text editor and add your Gemini API Key:
    ```env
    # Travel-Planner-Website Tourism Operations Environment Configuration
    GEMINI_API_KEY=AIzaSyYourActualGeminiAPIKeyHere
    ```

> 💡 **Where can I get an API Key?**  
> You can generate a free or pay-as-you-go Gemini API Key directly via [Google AI Studio](https://aistudio.google.com/).

---

## 💻 Running the Application

### Development Mode (Recommended for testing and code changes)
To spin up both the front-end bundler and the Express server in hot-reloading development mode, execute:

```bash
npm run dev
```

*   The terminal will boot the backend through the `tsx` process.
*   The system binds automatically to **`http://localhost:3000`**.
*   Vite acts as a middleware layer within Express to compile React components on-the-fly and resolve assets in real-time.

---

### Production Build & Deployment
To simulate a real, high-performance deployment environment or to deploy to platforms like Google Cloud Run, Vercel, or AWS:

1.  **Compile the static assets:**
    ```bash
    npm run build
    ```
    This bundles, minifies, and optimizes all React, Tailwind CSS, and icon assets into a single static directory called `dist/`.

2.  **Start the production server:**
    ```bash
    npm run start
    ```
    This launches the standalone Express server, which serves the optimized production files from the `dist/` directory instantly.

---

## 🛠️ Diagnostics & Troubleshooting

*   **Error: `tsx: command not found` or `vite: command not found`**  
    This usually means you missed the dependencies step or ran it in the wrong directory. Double-check that your terminal path is at the project root (where `package.json` exists) and run:
    ```bash
    npm install
    ```
*   **Port `3000` is already in use**  
    The backend binds exclusively to port `3000`. If you have another application (such as another dev server) occupying this port:
    *   *Mac/Linux:* Terminate the process on port 3000:
        ```bash
        npx kill-port 3000
        ```
    *   *Windows (PowerShell):*
        ```powershell
        Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
        ```
*   **No API Key set warning in chatbot**  
    If you see a notice in the chatbot UI saying that the AI engine is running in emulation fallback mode, make sure your `.env` file is named exactly `.env` (not `.env.example`) and that the variable name is exactly `GEMINI_API_KEY`. Be sure to restart your server after adding the variable.
