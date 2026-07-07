# 🌍 Travel-Planner-Website Tourism Operations Wing Terminal

Welcome to the **Travel-Planner-Website Tourism Operations Terminal**—a high-fidelity, full-stack transit dispatch dispatching matrix and passenger portal built on **React 18, Vite, Express, and Google Gemini AI**. 

This system integrates a responsive front-end dashboard with a Node.js/Express backend to deliver professional-grade transit management and an immersive passenger reservation experience.

---

## 📑 Table of Contents
1. [System Features Overview](#-system-features-overview)
   - [Customer Desk Portal](#1-customer-desk-portal)
   - [Admin Control Terminal](#2-admin-control-terminal)
2. [🤖 Gemini AI Features & API Key Configuration](#-gemini-ai-features--api-key-configuration)
   - [Where & How to Insert API Keys](#where--how-to-insert-api-keys)
   - [Security & Server-Side Privacy](#security--server-side-privacy)
   - [High-Fidelity Simulated Fallback Engine](#high-fidelity-simulated-fallback-engine)
3. [💻 Tech Stack & Architecture](#-tech-stack--architecture)
4. [🛠️ Local Development & Quick Start](#%EF%B8%8F-local-development--quick-start)

---

## 📊 System Features Overview

The platform uses a role-based session framework allowing you to easily toggle between a customer-facing travel portal and a mission-critical logistics dashboard.

### 1. Customer Desk Portal
Designed for travelers to build routes, book high-tech transit fleet seats, and monitor personal travel ledgers.

*   **Interactive Real-Earth Satellite Map Routing:**
    *   An elegant, high-contrast SVG global mapping projection featuring real latitude/longitude grid coordinate vectors.
    *   Interactive city station nodes across continents (e.g., San Francisco, London, Tokyo, Cape Town, Sydney).
    *   **Geodesic Routing Engine:** Uses the mathematical Great-Circle (Haversine) formula to calculate the exact distance in miles, travel hours, and average velocity between any selected origin and destination.
    *   **Dynamic Ledger Estimation:** Displays base ticket fares, Dynamic Operator Surcharges (synced live with Admin settings), sales tax rates, and carbon reduction metrics.
*   **Bespoke Expedition Directories:**
    *   Browse curated tour templates like the *Alpine Vista Loop* (Colorado Rockies), *Coastal Heritage* (Pacific Coast), and *Grand Canyon South*.
*   **Saved Wishlist & Digital Wallet:**
    *   Save corridors to a persistent favorites list.
    *   Built-in mock-banking digital wallet to add capital funds and view transactional ledger items (`Deposit`, `Booking Purchase`, etc.).
*   **Direct Ticket Hub:**
    *   View active boarding passes with unique transaction IDs and real-time status updates (e.g., *Confirmed*, *Checked In*).
*   **Concierge Chatbot Assistant (AI Enabled):**
    *   An slide-out live chat panel that interfaces with the server to guide travelers about fleet configurations, tour suggestions, and route logistics.

---

### 2. Admin Control Terminal
Designed for fleet dispatch commanders to monitor live operations, balance corridor analytics, manage vehicles, and edit global surcharge rates.

*   **Live Operations Control (Dashboard):**
    *   **Operational Key Performance Indicators (KPIs):** Real-time trackers for total active passengers, total estimated revenue, average load ratios, and fleet fuel status.
    *   **Parametric Logistics Controls:** Real-time adjustable sliders to configure the global fuel/booking premium fee (Surcharge Fee) and passenger sales tax rates. Updates calculations across the app instantly!
    *   **Transit Schedule Optimizer:** Runs an algorithmic simulation that checks schedule alignments and optimizes delays. Includes an interactive live status logging output.
    *   **Real-Time Alerts Ticker:** Feeds live dispatch logs (e.g., mechanical statuses, weather impacts) to the operator.
*   **Interactive Route Planner:**
    *   Configure standard tour directories.
    *   **Manual Route Builder:** Create custom itineraries specifying travel duration, cities, stops, base pricing, and descriptive metadata.
    *   **Gemini-Powered Itinerary Generator:** Generate highly detailed, bespoke custom itineraries instantly from natural language prompts.
*   **Premium Fleet Status Matrix:**
    *   Monitor vehicles including the `EX-COACH` Luxury Overland Series, `SKY-LINX` Sleeper Aircraft, and `VAN-SPR-004` Premium All-Terrain Sprinters.
    *   Track active routes, driver assignments, real-time load capacities, fuel percentages, and ETA timelines.
    *   Toggle active dispatch statuses.
*   **Booking Dispatch & Direct Sales:**
    *   A searchable database of all passenger bookings.
    *   Allows operators to manually "Check In" passengers or issue rapid cancellations.
    *   Direct admin booking console for ticketing direct walk-ins.
*   **Enterprise Corridor Analytics:**
    *   Stunning, clean data graphs rendered using `recharts` mapping out weekly passenger load distributions, cumulative revenue projections, and fleet utilization breakdowns.

---

## 🤖 Gemini AI Features & API Key Configuration

The terminal integrates advanced intelligence utilizing the modern `@google/genai` TypeScript SDK.

### Where & How to Insert API Keys

To enable the full generative features, you must supply a **Google Gemini API Key**.

#### 🌟 Option A: In the Google AI Studio Workspace (Recommended)
This is the most seamless method inside the AI Studio Build preview environment.
1. Locate the **Settings** menu panel on your Google AI Studio page.
2. Select **Secrets** / **Environment Variables**.
3. Add a new secret with the exact name:
   ```env
   GEMINI_API_KEY
   ```
4. Insert your valid Gemini API key as the value.
5. Click **Save** or **Apply Changes**.
6. If the application is already running, click **Restart Dev Server** to reload environment variables into the active container.

#### 💻 Option B: Local `.env` File Configuration
If you run this project locally, configure your secrets inside a file:
1. In the root directory, copy the provided `.env.example` file to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your Gemini API Key:
   ```env
   GEMINI_API_KEY=AIzaSyYourActualKeyGoesHere...
   ```
3. Restart your Node backend:
   ```bash
   npm run dev
   ```

---

### Security & Server-Side Privacy

To protect critical credentials, the system enforces a strict **Server + Client full-stack architecture**:
*   The `GEMINI_API_KEY` is **never exposed** to client browsers.
*   No `VITE_` prefix is applied to the key, ensuring Vite's build compiler keeps it hidden from static source bundles.
*   All user requests are secure; the React app sends requests to `/api/chatbot` and `/api/generate-itinerary` on the Express backend, which executes server-side API proxy calls using lazy-initialized SDK configurations.

---

### High-Fidelity Simulated Fallback Engine

If no `GEMINI_API_KEY` is set, **the terminal will NOT crash**. Instead, the backend invokes a clever local intelligence emulator:
*   **Chatbot Fallback:** Scans user input for keywords (e.g., *price, fleet, vehicles, route*) and replies with contextual, helpful travel guides tailored to Travel-Planner-Website's fleet.
*   **Itinerary Generator Fallback:** Delivers beautiful pre-structured mock JSON responses, illustrating how the AI structures cities, stops, recommended luxury vehicles, and custom descriptions when active.

Both systems gracefully display subtle notifications encouraging the setup of the API Key so you can explore the terminal's full potential safely.

---

## 💻 Tech Stack & Architecture

*   **Front-End:** React 18, TypeScript, Tailwind CSS, Lucide React (Icons), Motion (Animations).
*   **Back-End:** Node.js, Express (API routes), Vite Dev Server Middleware (Integrated SPA asset handling).
*   **Visualizers:** Recharts (Bento-grid business analytics charts).
*   **AI Integration:** `@google/genai` SDK targeting model `gemini-3.5-flash`.

---

## 🛠️ Local Development & Quick Start

### Prerequisites
*   Node.js (v18+)
*   npm

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY inside the .env file
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000` (the backend maps both API and front-end bundle assets seamlessly).
