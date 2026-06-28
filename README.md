# MoodAI

MoodAI is a privacy-first mental wellness web application that helps users turn daily mood logs into meaningful patterns. Users record mood, emotions, activities, sleep, energy, and journal notes in the browser. The dashboard summarizes trends locally, and the AI companion uses Claude through a serverless backend to provide empathetic, data-informed reflections.

## Problem Statement

Many people track their mood but do not gain actionable insight from the data. Existing mood apps often collect entries passively, leaving users to manually interpret emotional patterns, sleep changes, activity effects, and early warning signs. MoodAI addresses this gap by combining structured mood logging, local analytics, and an AI companion that explains patterns in plain language.

## Features

- Daily mood logging with mood score, emotions, activities, sleep, energy, and journal notes.
- Browser localStorage persistence so raw entries stay on the user's device.
- Analytics dashboard with mood trend, emotion frequency, activity impact, mood distribution, average sleep, average energy, and streak count.
- Claude-powered AI companion that receives only aggregated mood statistics and recent notes.
- Entry history with local delete support.
- Responsive React interface ready for Vercel deployment.

## Tech Stack

- Frontend: React 18 and Vite
- Styling: Vanilla CSS
- Backend: Vercel serverless function at `api/chat.js`
- AI: Anthropic Claude via `@anthropic-ai/sdk`
- Persistence: Browser localStorage
- Deployment: Vercel

## Project Structure

```text
api/
  chat.js                 Serverless AI companion endpoint
src/
  main.jsx                React application and views
  moodAnalytics.js        Mood summary, trend, streak, and activity logic
  moodStorage.js          localStorage persistence and demo data
  styles.css              Responsive UI styling
docs/
  PROJECT_PROPOSAL.md     1-2 page proposal
  FINAL_REPORT.md         3-5 page final report
  AI_METHODOLOGY.md       AI workflow and safety notes
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env.local
```

3. Add your Anthropic API key:

```text
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

4. Start the frontend development server:

```bash
npm run dev
```

5. Open the local URL printed by Vite, usually `http://localhost:5173`.

For local testing of the `/api/chat` serverless route, run the app with Vercel's local runtime:

```bash
npx vercel dev
```

The deployed Vercel application serves both the React frontend and the `api/chat.js` backend.

## Usage

1. Open MoodAI and go to the Log tab.
2. Save a daily check-in or load demo data.
3. Review the Dashboard tab for trends, top emotions, and activity impact.
4. Ask the Companion tab questions such as:
   - What is my mood trend this week?
   - What activities seem connected with better mood?
   - Do you see any warning signs?
5. Use the History tab to review or delete local entries.

## AI Model and Methodology

MoodAI uses context injection instead of custom model training. The browser computes a structured summary of the user's local entries, including mood average, sleep average, energy average, top emotions, top activities, activity impact, trend, and recent notes. That summary is sent to the serverless backend with the user's chat messages. The backend injects the summary into Claude's system prompt and returns the response to the frontend.

This approach provides personalization without storing raw mood data on a central database. The app also uses safety guardrails that tell the model not to diagnose, prescribe treatment, or present itself as a clinician.

## Deployment on Vercel

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Add these environment variables in Vercel Project Settings:

```text
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

4. Deploy with the default Vite settings. Vercel will use `npm run build` and output `dist`.

## Screenshots to Include

After deployment, capture these screens for submission:

- Log tab with a completed check-in form.
- Dashboard tab showing mood trend and activity insights.
- Companion tab showing one AI response.
- History tab showing saved entries.

Store final screenshots in `docs/screenshots/` before submitting the GitHub repository.

## Safety Note

MoodAI is a wellness reflection tool, not a medical product. It should not be used for diagnosis, treatment, crisis response, or emergency support.
