# MoodAI - Project Proposal

Submitted by: Mohammad Delowar Hossain  
Date: 24 June 2026

## 1. Problem Statement

Mental health challenges affect many people globally, yet most individuals lack practical tools for understanding their own emotional patterns. Journaling and mood tracking can support self-awareness, but many existing applications only store entries. They do not help users interpret changes in mood, sleep, activities, anxiety, or energy over time.

The core problem is that people track their mood but gain little actionable insight from doing so. A person may record two weeks of low mood, poor sleep, and rising anxiety without noticing that pattern or understanding which behaviors may be connected to it.

Secondary problems include passive mental health apps, generic wellness advice, missed early warning signs, and privacy concerns around sharing sensitive personal data with cloud platforms.

## 2. Proposed Solution

MoodAI is an intelligent mental wellness web application that combines structured mood logging with an AI companion. Users can log daily mood on a 1-5 scale, select emotions, mark activities, enter sleep hours, rate energy, and write an optional journal note.

The app includes an analytics dashboard that turns entries into readable patterns, including seven-entry mood trends, emotion frequency, activity impact, mood distribution, average sleep, average energy, and streak count.

The AI companion is powered by Claude through a serverless backend. It receives aggregated mood statistics as context and answers natural language questions such as "What is my mood trend this week?" or "What activities seem to help my mood?"

MoodAI follows a privacy-first design. Raw entries are stored in browser localStorage. The AI endpoint receives summarized statistics and recent notes only when the user asks the companion a question.

## 3. AI Approach

MoodAI uses Anthropic Claude for empathetic reasoning, natural conversation, and synthesis of quantitative mood data into narrative insight.

Instead of training a custom model, MoodAI uses context injection:

- The browser computes real-time statistics from local entries.
- The serverless backend injects those statistics into Claude's system prompt.
- Claude responds as a supportive companion that can identify trends, correlations, positive signals, and possible warning signs.
- Conversation history is sent with each request for multi-turn coherence.

This method avoids the need for a large labeled dataset while still providing personalized responses.

## 4. AI Safety Guardrails

The system prompt instructs the model to remain supportive but not clinical. It must not diagnose, prescribe treatment, or make medical claims. For serious safety concerns, the assistant recommends immediate support from local emergency services, a trusted person, or crisis resources.

## 5. Tech Stack

| Layer | Technology | Justification |
| --- | --- | --- |
| Frontend | React 18 | Component model supports a multi-tab SPA |
| Build Tool | Vite | Fast development and simple Vercel deployment |
| Styling | Vanilla CSS | Small bundle and full control |
| State | React state and effects | Sufficient for project scope |
| Persistence | localStorage | Keeps raw data local to the user |
| Backend | Vercel serverless function | Protects the Anthropic API key |
| AI | Anthropic Claude | Strong conversational and reasoning ability |
| Deployment | Vercel | Free hosting and GitHub integration |
| Version Control | Git and GitHub | Standard repository workflow |

## 6. Expected Outcomes

- A fully functional web application deployed at a public URL.
- Demonstrated AI integration with personalized mood insight.
- Clean codebase with documented components and utility functions.
- Evidence that conversational AI plus personal data context can produce meaningful wellness reflections without custom model training.
