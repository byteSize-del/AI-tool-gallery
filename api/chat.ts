// POST /api/chat
// Proxies a chat completion to the chosen provider/model. Keys stay
// server-side. Includes guard rails (size caps, model-type check) and
// an OPTIONAL shared access code (set PLAYGROUND_ACCESS_CODE to enable).

import {
  providerById,
  getKey,
  authHeaders,
  categorize,
  jsonResponse,
} from "./_lib/providers";

declare const process: { env: Record<string, string | undefined> };

export const config = { runtime: "edge" };

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const MAX_TOTAL_CHARS = 16000;
const MAX_TOKENS = 1024;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  // Optional access gate: only enforced when PLAYGROUND_ACCESS_CODE is set.
  const requiredCode = process.env.PLAYGROUND_ACCESS_CODE?.trim();
  if (requiredCode) {
    const provided = req.headers.get("x-access-code")?.trim();
    if (provided !== requiredCode) {
      return jsonResponse(
        { error: "Access code required", code: "ACCESS_REQUIRED" },
        401
      );
    }
  }

  let body: {
    provider?: string;
    model?: string;
    messages?: ChatMessage[];
    temperature?: number;
  };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const provider = providerById(String(body.provider || ""));
  if (!provider) return jsonResponse({ error: "Unknown provider" }, 400);

  const key = getKey(provider);
  if (!key) return jsonResponse({ error: `${provider.label} is not configured` }, 400);

  const { model, messages } = body;
  if (!model || !Array.isArray(messages) || messages.length === 0) {
    return jsonResponse({ error: "model and messages are required" }, 400);
  }

  const totalChars = messages.reduce(
    (n, m) => n + String(m?.content || "").length,
    0
  );
  if (totalChars > MAX_TOTAL_CHARS) {
    return jsonResponse({ error: "Conversation is too long for this demo." }, 413);
  }

  const caps = categorize(String(model));
  if (caps.includes("image") || caps.includes("audio")) {
    return jsonResponse(
      { error: "That isn't a chat model. Pick a chat, code or reasoning model." },
      400
    );
  }

  const payload = {
    model,
    messages: messages.map((m) => ({
      role:
        m.role === "assistant"
          ? "assistant"
          : m.role === "system"
          ? "system"
          : "user",
      content: String(m.content || ""),
    })),
    temperature:
      typeof body.temperature === "number"
        ? Math.max(0, Math.min(2, body.temperature))
        : 0.7,
    max_tokens: MAX_TOKENS,
    stream: false,
  };

  let res: Response;
  try {
    res = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: "POST",
      headers: authHeaders(provider, key),
      body: JSON.stringify(payload),
    });
  } catch {
    return jsonResponse({ error: "Could not reach the provider." }, 502);
  }

  const data = (await res.json().catch(() => null)) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
    message?: string;
  } | null;

  if (!res.ok) {
    const msg =
      data?.error?.message || data?.message || `Provider error (HTTP ${res.status})`;
    return jsonResponse({ error: msg }, res.status);
  }

  const content = data?.choices?.[0]?.message?.content ?? "";
  return jsonResponse({ content, model });
}
