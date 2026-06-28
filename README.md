# MoodAI

MoodAI is a privacy-first mood tracking and reflection app that helps users understand emotional patterns from daily check-ins. It combines local mood analytics with an AI companion that can summarize trends, explain possible correlations, and offer supportive next steps without storing raw journal data on a server.

Live app: https://moodai-capstone.vercel.app

## Overview

Most mood trackers collect information but leave users to interpret the data on their own. MoodAI closes that gap by turning daily logs into readable insights. Users can record mood, emotions, activities, sleep, energy, and optional journal notes. The dashboard analyzes those entries locally, while the AI companion receives a summarized version of the data and responds with warm, data-aware reflections.

MoodAI is designed as a wellness reflection tool, not a clinical or diagnostic product.

## Features

- Daily check-ins for mood, emotions, activities, sleep, energy, and journal notes
- Local browser storage for raw mood entries
- Analytics dashboard with averages, streaks, mood distribution, emotion frequency, and activity impact
- AI companion powered by Anthropic Claude through a serverless API route
- Local fallback insights if the AI provider is unavailable
- Entry history with delete support
- Responsive interface for desktop and mobile screens

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite |
| Styling | Vanilla CSS |
| Data Storage | Browser localStorage |
| Backend | Vercel Serverless Function |
| AI Provider | Anthropic Claude Messages API |
| Deployment | Vercel |

## Architecture

```text
Browser
  React app
    Log tab          -> saves entries to localStorage
    Dashboard tab    -> computes local analytics
    Companion tab    -> sends aggregated summary to /api/chat
    History tab      -> reads and manages local entries

Vercel
  api/chat.js        -> calls Anthropic Claude securely
```

Raw mood entries remain in the user's browser. The AI endpoint receives only the computed summary and chat messages needed to answer the user's question.

## Project Structure

```text
api/
  chat.js              Serverless AI companion endpoint

src/
  main.jsx             React application views and UI flow
  moodAnalytics.js     Mood statistics, trends, streaks, and activity impact
  moodStorage.js       localStorage helpers and demo data
  styles.css           Application styling

docs/
  AI_METHODOLOGY.md    AI workflow, safety rules, and limitations
  FINAL_REPORT.md      Project report
  PROJECT_PROPOSAL.md  Original project proposal
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env.local
```

Add your Anthropic API key:

```text
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

Start the frontend development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

To test the serverless API locally, run with Vercel's local runtime:

```bash
npx vercel dev
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build in `dist/`.

```bash
npm run preview
```

Serves the production build locally.

```bash
npm run lint
```

Runs ESLint across the project.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Yes | API key used by the serverless function to call Claude |
| `ANTHROPIC_MODEL` | No | Claude model name. Defaults to `claude-sonnet-4-20250514` |

Never expose the Anthropic API key in frontend code. It should only be stored in local environment files or Vercel environment variables.

## Deployment

MoodAI is ready for Vercel deployment.

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add the environment variables listed above.
4. Deploy using the default Vite settings:

```text
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

After changing environment variables, redeploy the project so the serverless function receives the updated values.

## AI Workflow

MoodAI uses context injection instead of custom model training. The browser computes a structured summary from local mood entries, including averages, recent trend, top emotions, top activities, activity impact, and recent notes. That summary is sent to `/api/chat`, where it is inserted into a system prompt for Claude.

The AI companion is instructed to be supportive, specific to the user's data, and careful about uncertainty. It does not diagnose, prescribe treatment, or present itself as a clinician.

## Privacy

- Raw mood entries are stored in browser localStorage.
- No database is used.
- The AI endpoint receives only summarized mood data and chat messages.
- Users can delete local entries from the History tab.

## Safety

MoodAI is not a medical device, therapist, crisis line, or diagnostic system. It is intended for self-reflection and personal wellness tracking. Users experiencing serious distress, self-harm thoughts, or immediate safety concerns should contact local emergency services, a trusted person, or a qualified mental health professional.

## License

This project is provided for educational and portfolio use.
