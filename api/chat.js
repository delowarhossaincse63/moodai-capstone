import Anthropic from "@anthropic-ai/sdk";

const DEFAULT_MODEL = "claude-sonnet-4-6";

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

  const anthropic = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 700,
      temperature: 0.5,
      system: buildSystemPrompt(req.body.summary),
      messages: req.body.messages.map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: String(message.content || "").slice(0, 4000)
      }))
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error("MoodAI chat error", error);
    return res.status(500).json({
      error: "The AI companion could not respond right now. Please try again."
    });
  }
}
