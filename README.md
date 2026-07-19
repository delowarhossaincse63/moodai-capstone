<div align="center">

# 🧠 MoodAI

### Privacy-First Mood Tracking & AI Reflection Platform

*Turns daily check-ins into meaningful emotional insights — powered by React, Vite, and Anthropic Claude.*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Claude](https://img.shields.io/badge/AI-Anthropic%20Claude-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://www.anthropic.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**[🌐 Live Demo](https://moodai-capstone.vercel.app)**

[Overview](#-overview) • [Features](#-features) • [Architecture](#-architecture) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Privacy & Safety](#-privacy--safety) • [Contact](#-lets-connect)

</div>

---

## 📌 Overview

Most mood-tracking apps collect data and leave users to figure out what it means. **MoodAI closes that gap.**

Users log their mood, emotions, activities, sleep, and energy each day. MoodAI turns those entries into a live analytics dashboard — and pairs it with an **AI companion** that reads the summarized trends and offers warm, data-aware reflections, without ever seeing or storing the user's raw journal data on a server.

It's built as a genuine **capstone-grade full-stack product**: a React frontend, a secure serverless AI backend, real privacy engineering, and thoughtful safety guardrails — not just a demo.

> ⚠️ MoodAI is a wellness reflection tool. It is **not** a clinical, diagnostic, or crisis-response product.

---

## ✨ Features

- 📝 **Daily Check-ins** — mood, emotions, activities, sleep, energy, and optional journal notes
- 📊 **Analytics Dashboard** — averages, streaks, mood distribution, emotion frequency, and activity-impact analysis, computed entirely client-side
- 🤖 **AI Companion** — powered by Anthropic Claude via a secure serverless API route, giving supportive, data-grounded reflections
- 🔒 **Privacy by Design** — raw entries never leave the browser; the AI only ever sees an aggregated summary
- 🛟 **Graceful Fallback** — local insights still work even if the AI provider is unavailable
- 🗂️ **Entry History** — full history view with delete support
- 📱 **Responsive UI** — clean experience across desktop and mobile

---

## 🏗 Architecture

```
Browser (React + Vite)
│
├── Log Tab          → saves entries to localStorage
├── Dashboard Tab     → computes local analytics
├── Companion Tab     → sends aggregated summary → /api/chat
└── History Tab       → reads & manages local entries
                              │
                              ▼
                    Vercel Serverless Function
                         api/chat.js
                              │
                              ▼
                  Anthropic Claude Messages API
```

**Key design decision:** raw mood entries stay in the user's browser. Only a computed, anonymized summary and the current chat message are ever sent to the AI endpoint — the API key and full context never touch the client.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Styling | Vanilla CSS |
| Data Storage | Browser `localStorage` (no database) |
| Backend | Vercel Serverless Function |
| AI Provider | Anthropic Claude Messages API |
| Deployment | Vercel |

---

## 📁 Project Structure

```
api/
  chat.js              Serverless AI companion endpoint

src/
  main.jsx             React application views and UI flow
  moodAnalytics.js     Mood statistics, trends, streaks, activity impact
  moodStorage.js       localStorage helpers and demo data
  styles.css           Application styling

docs/
  AI_METHODOLOGY.md    AI workflow, safety rules, and limitations
  FINAL_REPORT.md      Project report
  PROJECT_PROPOSAL.md  Original project proposal
```

---

## ⚡ Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Then add your Anthropic API key:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

### 3. Run the dev server
```bash
npm run dev
```
Open the URL Vite prints — usually **http://localhost:5173**

### 4. (Optional) Test the AI endpoint locally
```bash
npx vercel dev
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint across the project |

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Yes | Used by the serverless function to call Claude |
| `ANTHROPIC_MODEL` | ❌ No | Claude model name — defaults to `claude-sonnet-4-20250514` |

> ⚠️ Never expose the Anthropic API key in frontend code. Keep it in local env files or Vercel's environment variable settings only.

---

## ☁️ Deployment

MoodAI is pre-configured for one-click Vercel deployment:

1. Push the repository to GitHub
2. Import it into [Vercel](https://vercel.com/)
3. Add the environment variables listed above
4. Deploy with the default Vite settings:

```
Build Command:     npm run build
Output Directory:  dist
Install Command:   npm install
```

Redeploy after any environment variable change so the serverless function picks up the new values.

---

## 🤖 AI Workflow

MoodAI uses **context injection**, not custom model training. The browser computes a structured summary of local mood data — averages, recent trend, top emotions, top activities, activity impact, and recent notes — and sends it to `/api/chat`, where it's inserted into Claude's system prompt.

The AI companion is explicitly instructed to be supportive, grounded in the user's actual data, careful about uncertainty, and to never diagnose, prescribe treatment, or present itself as a clinician.

---

## 🔒 Privacy & Safety

- Raw mood entries are stored only in the browser (`localStorage`) — no database
- The AI endpoint receives only a summarized version of the data, never raw journal entries
- Users can delete their local entries anytime from the History tab
- MoodAI is **not** a medical device, therapist, or crisis line
- Users in serious distress are directed to contact local emergency services, a trusted person, or a qualified mental health professional

---

## 🤝 Let's Connect

I design and build **full-stack AI products** — from privacy-conscious architecture to real LLM integrations like this one. If you're looking for someone to build a thoughtful, production-ready AI application for your business, let's talk.

📧 **Email:** [delowarhossain.cse.63@gmail.com](mailto:delowarhossain.cse.63@gmail.com)
💼 **LinkedIn:** [linkedin.com/in/mohammaddelowarhossain63](https://www.linkedin.com/in/mohammaddelowarhossain63/)
🐙 **GitHub:** [@delowarhossaincse63](https://github.com/delowarhossaincse63)

---

## 📄 License

This project is provided for educational and portfolio use.

<div align="center">

⭐ If you find this project useful, consider giving it a star — it helps a lot!

</div>
