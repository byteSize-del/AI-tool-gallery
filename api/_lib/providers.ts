// Shared helpers for the Playground serverless functions.
// Files/folders prefixed with "_" are NOT exposed as routes by Vercel.
//
// SECURITY: API keys are read here from server-side environment
// variables only (never VITE_-prefixed) so they are never shipped to
// the browser. All provider calls are proxied through the functions.

// `process.env` is provided by the Vercel runtime; declare it so this
// file type-checks without pulling in Node typings.
declare const process: { env: Record<string, string | undefined> };

export interface ProviderDef {
  id: string;
  label: string;
  envKey: string;
  /** OpenAI-compatible base URL (all five providers support this shape). */
  baseUrl: string;
  extraHeaders?: Record<string, string>;
  /**
   * Models the provider's /models endpoint does NOT list but that we
   * still support. NVIDIA image models, for example, live on a separate
   * genai host and never appear in the OpenAI-compatible model list.
   */
  extraModels?: string[];
}

export const PROVIDERS: ProviderDef[] = [
  {
    id: "groq",
    label: "Groq",
    envKey: "GROQ_API_KEY",
    baseUrl: "https://api.groq.com/openai/v1",
  },
  {
    id: "nvidia",
    label: "NVIDIA",
    envKey: "NVIDIA_API_KEY",
    baseUrl: "https://integrate.api.nvidia.com/v1",
    // Image models on NVIDIA use a separate genai host and aren't in /models.
    extraModels: [
      "black-forest-labs/flux.1-dev",
      "black-forest-labs/flux.1-schnell",
      "stabilityai/stable-diffusion-3-medium",
      "stabilityai/stable-diffusion-3.5-large",
      "stabilityai/stable-diffusion-xl",
      "stabilityai/sdxl-turbo",
    ],
  },
  {
    id: "google",
    label: "Google Gemini",
    envKey: "GOOGLE_API_KEY",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    envKey: "OPENROUTER_API_KEY",
    baseUrl: "https://openrouter.ai/api/v1",
    extraHeaders: {
      "HTTP-Referer": "https://ai-tool-gallery.vercel.app",
      "X-Title": "AI Tools Sketchbook",
    },
  },
  {
    id: "mistral",
    label: "Mistral",
    envKey: "MISTRAL_API_KEY",
    baseUrl: "https://api.mistral.ai/v1",
  },
];

export function getKey(p: ProviderDef): string | undefined {
  const v = process.env[p.envKey];
  return v && v.trim() ? v.trim() : undefined;
}

export function providerById(id: string): ProviderDef | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function authHeaders(p: ProviderDef, key: string): Record<string, string> {
  return {
    Authorization: `Bearer ${key}`,
    "content-type": "application/json",
    ...(p.extraHeaders ?? {}),
  };
}

export type Capability = "chat" | "code" | "reasoning" | "image" | "audio";

/**
 * Best-effort categorisation of a model from its id, so the Playground
 * can group models by use case (chat / code / reasoning / image).
 * Image and audio models are treated as non-chat.
 */
export function categorize(modelId: string): Capability[] {
  const id = modelId.toLowerCase();
  const isImage =
    /flux|stable-?diffusion|sdxl|sd3|sana|dall-?e|imagen|kandinsky|pixart|playground-v|image/.test(
      id
    );
  const isAudio = /whisper|tts|text-to-speech|speech|audio|voice|parakeet|canary/.test(id);
  const isReasoning = /reason|think|(^|[^a-z])o[134]([^a-z]|$)|deepseek-r|(^|[^a-z])r1([^a-z]|$)|qwq|magistral/.test(
    id
  );
  const isCode = /code|coder|codestral|devstral|starcoder/.test(id);

  if (isImage) return ["image"];
  if (isAudio) return ["audio"];

  const caps: Capability[] = ["chat"];
  if (isReasoning) caps.push("reasoning");
  if (isCode) caps.push("code");
  return caps;
}

export function jsonResponse(obj: unknown, status = 200, cache?: string): Response {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (cache) headers["cache-control"] = cache;
  return new Response(JSON.stringify(obj), { status, headers });
}
