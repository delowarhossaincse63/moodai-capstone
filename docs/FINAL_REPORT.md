# MoodAI - Final Report

## 1. Introduction

MoodAI is a privacy-first mental wellness web application built for the AI Capstone Project. The project addresses a common problem in personal wellness technology: many users record mood data but do not receive meaningful interpretation from it. MoodAI combines daily check-ins, browser-based analytics, and a Claude-powered AI companion to help users recognize emotional patterns and reflect on possible behavior connections.

The application is designed as a practical self-awareness tool. It is not a diagnostic or clinical system. Its purpose is to help users notice trends, ask better questions about their own routines, and identify moments when professional support may be appropriate.

## 2. Problem Solved

Mood tracking apps often function as passive journals. They collect mood scores and notes but leave interpretation to the user. This creates a gap between data collection and useful insight. A user may log poor sleep, low energy, and anxiety for several days without recognizing a decline. Another user may not notice that exercise, outdoor time, or social connection frequently appear on better mood days.

MoodAI solves this by making mood data readable. The dashboard visualizes quantitative patterns, and the AI companion explains those patterns conversationally.

## 3. System Design

The system is a Vite and React single-page application with four primary views:

- Log: records daily mood, emotions, activities, sleep, energy, and notes.
- Dashboard: displays trends, distribution, frequency, activity impact, and streaks.
- Companion: provides an AI chat interface for personalized reflection.
- History: lists local entries and allows deletion.

The frontend stores entries in browser localStorage. This supports the proposal's privacy-first goal because raw data remains on the user's device.

The backend is a Vercel serverless function in `api/chat.js`. It protects the Anthropic API key and handles communication with Claude. The frontend sends only an aggregated summary and chat messages to this endpoint.

## 4. AI Workflow

MoodAI uses context injection rather than custom model training. The application computes user-specific statistics from local entries:

- Average mood, sleep, and energy
- Recent mood trend
- Top emotions
- Top activities
- Activity impact by average mood
- Recent notes and entry details

These statistics are injected into the Claude system prompt with safety rules. The AI companion is instructed to be warm, concise, data-specific, and careful about uncertainty. It must not diagnose, prescribe treatment, or claim to be a clinician.

This approach was chosen because it is practical for a capstone project, does not require a labeled mental health dataset, and still produces personalized AI responses.

## 5. Implementation Decisions

React was selected because the interface is naturally component-based. Vite was selected for fast development and simple Vercel deployment. Vanilla CSS keeps the project lightweight while allowing full control over responsive design.

localStorage was selected for persistence because the proposal emphasizes privacy. For a production mental health product, encryption, account-level consent, and export/delete controls would be important future additions.

A serverless backend was added even though the app is mostly client-side. This is necessary because API keys must not be exposed in browser code. The serverless function also centralizes safety prompt construction.

## 6. Results

The completed project meets the capstone requirements:

- Frontend: a responsive React interface with logging, dashboard, chat, and history.
- Backend: a serverless API route that validates requests and calls Claude.
- AI/ML: Claude analyzes aggregated mood data through context injection.
- Documentation: README, proposal, AI methodology, and final report are included.
- Deployment-ready: Vercel configuration and environment variable instructions are provided.

With demo data loaded, the dashboard shows meaningful sample patterns. Users can see average mood, sleep, energy, top emotions, and activities associated with higher average mood. The AI companion can answer questions based on that data.

## 7. Limitations

MoodAI cannot diagnose mental health conditions. It cannot verify whether user-entered data is accurate. Because localStorage is browser-specific, entries do not sync across devices. The AI may identify correlations, but those correlations are not proof of cause.

The model also depends on the Anthropic API being available and correctly configured. Without an API key, the dashboard and logging features still work, but the AI companion cannot generate live responses.

## 8. Future Work

Future improvements could include encrypted cloud sync, optional account login, CSV export, printable weekly reports, richer charts, crisis-resource localization, and user-controlled data deletion. Another useful addition would be a rule-based early-warning layer that flags sustained low mood or sleep disruption before the user starts a chat.

## 9. Conclusion

MoodAI demonstrates how frontend engineering, backend API design, and AI reasoning can be combined to solve a real-world problem. By turning private mood entries into understandable patterns, the app helps users move from passive tracking toward reflective self-awareness. The project also shows that useful personalization can be achieved without training a custom model when structured data and careful prompt design are used effectively.
