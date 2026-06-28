const DEFAULT_MODEL = "claude-sonnet-4-20250514";
const ANTHROPIC_VERSION = "2023-06-01";

function buildSystemPrompt(summary) {
  return `You are MoodAI, a warm and practical mental wellness companion.

Safety rules:
- You are not a therapist, doctor, crisis line, or diagnostic tool.
- Do not diagnose, prescribe treatment, or make medical claims.
- If the user describes self-harm, harm to others, abuse, crisis, or feeling unsafe, encourage immediate support from local emergency services, a trusted person, or a crisis hotline.
- Be specific to the user's actual mood data. Avoid generic motivational advice when data-driven insight is possible.
- Keep responses concise, empathetic, and action-oriented.

User mood data summary:
${JSON.stringify(summary, null, 2)}

Use this data to identify patterns, possible correlations, positive changes, and warning signs. Make it clear when an observation is only a correlation, not proof of cause.`;
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return "Request body must be a JSON object.";
  }
  if (!Array.isArray(payload.messages)) {
    return "messages must be an array.";
  }
  if (!payload.summary || typeof payload.summary !== "object") {
    return "summary must be an object.";
  }
  return null;
}

function generateLocalInsight(summary, question = "") {
  const total = summary?.totalEntries || 0;
  const mood = summary?.averages?.mood || 0;
  const sleep = summary?.averages?.sleep || 0;
  const energy = summary?.averages?.energy || 0;
  const trend = summary?.trend?.label || "Needs more data";
  const topEmotion = summary?.topEmotions?.[0]?.label;
  const bestActivity = summary?.activityImpact?.[0]?.activity;

  if (!total) {
    return "I do not have enough mood data yet. Add a few daily entries first, then I can help you notice patterns in mood, sleep, energy, emotions, and activities.";
  }

  const lines = [
    `Based on ${total} logged entr${total === 1 ? "y" : "ies"}, your average mood is ${mood.toFixed(1)} out of 5 and your recent trend looks ${trend.toLowerCase()}.`,
    `Your average sleep is ${sleep.toFixed(1)} hours and average energy is ${energy.toFixed(1)} out of 5.`
  ];

  if (topEmotion) {
    lines.push(`The emotion showing up most often is ${topEmotion}.`);
  }

  if (bestActivity) {
    lines.push(`The activity most associated with better mood in your logs is ${bestActivity}. Treat that as a useful pattern, not proof of cause.`);
  }

  if (/warning|risk|bad|low|anxious|sad/i.test(question)) {
    lines.push("If low mood, anxiety, or safety concerns feel intense or persistent, consider reaching out to a trusted person or a qualified mental health professional.");
  } else {
    lines.push("A practical next step is to keep logging for a few more days and compare mood against sleep and activities.");
  }

  return lines.join(" ");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const validationError = validatePayload(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "ANTHROPIC_API_KEY is not configured on the server."
    });
  }

  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  const messages = req.body.messages.map((message) => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: String(message.content || "").slice(0, 4000)
  }));
  const latestQuestion = [...messages].reverse().find((message) => message.role === "user")?.content || "";

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION
      },
      body: JSON.stringify({
        model,
        max_tokens: 700,
        temperature: 0.5,
        system: buildSystemPrompt(req.body.summary),
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("MoodAI Anthropic API error", response.status, data);
      return res.status(200).json({
        reply: generateLocalInsight(req.body.summary, latestQuestion),
        providerStatus: "fallback",
        providerError: data?.error?.message || "Anthropic API request failed."
      });
    }

    const text = data.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return res.status(200).json({ reply: text, providerStatus: "anthropic" });
  } catch (error) {
    console.error("MoodAI chat error", error);
    return res.status(200).json({
      reply: generateLocalInsight(req.body.summary, latestQuestion),
      providerStatus: "fallback",
      providerError: "The Claude service could not be reached."
    });
  }
}
