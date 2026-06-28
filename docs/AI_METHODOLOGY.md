# AI Methodology

## Model

MoodAI uses Anthropic Claude through the Messages API. The model is configured with the `ANTHROPIC_MODEL` environment variable and defaults to `claude-sonnet-4-20250514`.

## Input Data

The frontend never sends the full localStorage database directly. It computes a compact summary:

- Total entry count
- Date range
- Average mood, sleep, and energy
- Recent trend
- Top emotions
- Top activities
- Activity impact by average mood
- Recent entries with notes

## Context Injection Workflow

1. User records daily mood entries in the browser.
2. `buildMoodSummary()` converts entries into structured analytics.
3. User asks a question in the AI Companion tab.
4. The frontend posts `{ summary, messages }` to `/api/chat`.
5. The serverless function builds a system prompt with safety rules and the mood summary.
6. Claude returns an empathetic, data-grounded response.

## Why This Is AI/ML

The application uses a large language model for natural language reasoning over user-specific behavioral data. The AI component performs personalized summarization, pattern explanation, and recommendation-style support. It does not require supervised training because the model is guided with real-time context.

## Safety

The system prompt restricts the AI from acting as a clinician. It asks the model to avoid diagnosis and medical claims, explain uncertainty, and encourage professional or emergency support when user messages suggest serious risk.

## Limitations

- Correlation does not prove causation.
- localStorage is device-specific and can be cleared by the browser.
- AI responses depend on the quality and consistency of user-entered data.
- The app is not suitable for crisis intervention or medical decision-making.
