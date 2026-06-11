// GET /api/models
// Auto-detects models from every provider that has a key configured,
// normalises and categorises them, and reports which providers are live.

import {
  PROVIDERS,
  getKey,
  authHeaders,
  categorize,
  jsonResponse,
} from "./_lib/providers";

export const config = { runtime: "edge" };

const MAX_PER_PROVIDER = 100;

interface RawModel {
  id?: string;
  name?: string;
}

export default async function handler(): Promise<Response> {
  const providers = await Promise.all(
    PROVIDERS.map(async (p) => {
      const key = getKey(p);
      if (!key) {
        return { id: p.id, label: p.label, connected: false, models: [] };
      }
      try {
        const res = await fetch(`${p.baseUrl}/models`, {
          headers: authHeaders(p, key),
        });
        if (!res.ok) {
          return {
            id: p.id,
            label: p.label,
            connected: true,
            models: [],
            error: `HTTP ${res.status}`,
          };
        }
        const json = (await res.json()) as { data?: RawModel[] };
        const list = Array.isArray(json?.data) ? json.data : [];
        const models = list
          .map((m) => {
            const mid = m.id || m.name || "";
            return {
              id: mid,
              label: m.name || mid,
              capabilities: categorize(String(mid)),
            };
          })
          .filter((m) => m.id)
          .slice(0, MAX_PER_PROVIDER);
        return { id: p.id, label: p.label, connected: true, models };
      } catch {
        return {
          id: p.id,
          label: p.label,
          connected: true,
          models: [],
          error: "Could not reach provider",
        };
      }
    })
  );

  return jsonResponse({ providers }, 200, "s-maxage=300, stale-while-revalidate=600");
}
