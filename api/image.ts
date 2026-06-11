// POST /api/image
// Generates an image from a prompt. Image APIs differ per provider, so
// this routes to a small adapter for each one. Keys stay server-side.
//   - Google  : OpenAI-compatible /images/generations (Imagen)
//   - OpenRouter: chat completions with image modality
//   - NVIDIA  : genai endpoint (FLUX / SDXL families), best-effort
//   - Groq / Mistral: not supported (no image API)

import { providerById, getKey, authHeaders, jsonResponse } from "./_lib/providers";

declare const process: { env: Record<string, string | undefined> };

export const config = { runtime: "edge" };

const MAX_PROMPT = 2000;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const requiredCode = process.env.PLAYGROUND_ACCESS_CODE?.trim();
  if (requiredCode) {
    const provided = req.headers.get("x-access-code")?.trim();
    if (provided !== requiredCode) {
      return jsonResponse({ error: "Access code required", code: "ACCESS_REQUIRED" }, 401);
    }
  }

  let body: { provider?: string; model?: string; prompt?: string; size?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const provider = providerById(String(body.provider || ""));
  if (!provider) return jsonResponse({ error: "Unknown provider" }, 400);
  const key = getKey(provider);
  if (!key) return jsonResponse({ error: `${provider.label} is not configured` }, 400);

  const model = String(body.model || "");
  const prompt = String(body.prompt || "").trim();
  if (!model || !prompt) return jsonResponse({ error: "model and prompt are required" }, 400);
  if (prompt.length > MAX_PROMPT)
    return jsonResponse({ error: "Prompt is too long for this demo." }, 413);
  const size = typeof body.size === "string" ? body.size : "1024x1024";

  try {
    if (provider.id === "openrouter") {
      const res = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: "POST",
        headers: authHeaders(provider, key),
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          modalities: ["image", "text"],
        }),
      });
      const data = await readJson(res);
      if (!res.ok) return providerError(data, res.status);
      const url = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      if (!url)
        return jsonResponse(
          { error: "This model didn't return an image. Pick a model that supports image output." },
          502
        );
      return jsonResponse({ image: url });
    }

    if (provider.id === "google") {
      return await googleImage(provider.baseUrl, model, prompt, key, size);
    }

    if (provider.id === "nvidia") {
      return await nvidiaImage(model, prompt, key);
    }

    return jsonResponse(
      { error: `Image generation isn't supported for ${provider.label} in this demo.` },
      400
    );
  } catch {
    return jsonResponse({ error: "Could not reach the provider." }, 502);
  }
}

/**
 * Google has two image-capable families with different APIs:
 *   - Imagen models       -> OpenAI-compatible /images/generations ("predict")
 *   - Gemini *-image models -> native generateContent with an IMAGE modality
 */
async function googleImage(
  openaiBase: string,
  model: string,
  prompt: string,
  key: string,
  size: string
): Promise<Response> {
  const isImagen = /imagen/i.test(model);

  if (isImagen) {
    const res = await fetch(`${openaiBase}/images/generations`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ model, prompt, n: 1, size, response_format: "b64_json" }),
    });
    const data = await readJson(res);
    if (!res.ok) return providerError(data, res.status);
    const b64 = data?.data?.[0]?.b64_json;
    const url = data?.data?.[0]?.url;
    if (b64) return jsonResponse({ image: `data:image/png;base64,${b64}` });
    if (url) return jsonResponse({ image: url });
    return jsonResponse({ error: "No image returned." }, 502);
  }

  // Gemini image models: native endpoint, e.g. v1beta/models/<model>:generateContent
  const nativeBase = openaiBase.replace(/\/openai\/?$/, "");
  const cleanModel = model.replace(/^models\//, "");
  const res = await fetch(`${nativeBase}/models/${cleanModel}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
    }),
  });
  const data = await readJson(res);
  if (!res.ok) return providerError(data, res.status);

  const parts: any[] = data?.candidates?.[0]?.content?.parts ?? [];
  const inline = parts
    .map((p) => p?.inlineData || p?.inline_data)
    .find((d) => d?.data);
  if (inline?.data) {
    const mime = inline.mimeType || inline.mime_type || "image/png";
    return jsonResponse({ image: `data:${mime};base64,${inline.data}` });
  }
  return jsonResponse(
    { error: "Gemini didn't return an image. Try an Imagen model or rephrase the prompt." },
    502
  );
}

/** NVIDIA hosts image models on a separate genai host with model-specific bodies. */
async function nvidiaImage(model: string, prompt: string, key: string): Promise<Response> {
  const id = model.toLowerCase();
  const isFlux = /flux/.test(id);
  const headers = {
    Authorization: `Bearer ${key}`,
    "content-type": "application/json",
    Accept: "application/json",
  };
  const payload = isFlux
    ? { prompt, mode: "base", cfg_scale: 3.5, width: 1024, height: 1024, steps: 50, seed: 0 }
    : {
        text_prompts: [{ text: prompt, weight: 1 }],
        cfg_scale: 5,
        sampler: "K_DPM_2_ANCESTRAL",
        seed: 0,
        steps: 25,
      };

  const res = await fetch(`https://ai.api.nvidia.com/v1/genai/${model}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const data = await readJson(res);
  if (!res.ok) return providerError(data, res.status);

  const b64 =
    data?.artifacts?.[0]?.base64 ||
    data?.image ||
    data?.data?.[0]?.b64_json ||
    data?.b64_json;
  if (b64) {
    const str = String(b64);
    return jsonResponse({ image: str.startsWith("data:") ? str : `data:image/png;base64,${str}` });
  }
  return jsonResponse(
    { error: "This NVIDIA model didn't return an image in a recognised format." },
    502
  );
}

async function readJson(res: Response): Promise<any> {
  return res.json().catch(() => null);
}

function providerError(data: any, status: number): Response {
  const msg =
    data?.error?.message ||
    data?.message ||
    data?.detail ||
    `Provider error (HTTP ${status})`;
  return jsonResponse({ error: msg }, status);
}
