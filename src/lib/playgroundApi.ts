export type Capability = "chat" | "code" | "reasoning" | "image" | "audio";

export interface ApiModel {
  id: string;
  label: string;
  capabilities: Capability[];
}

export interface ApiProvider {
  id: string;
  label: string;
  connected: boolean;
  models: ApiModel[];
  error?: string;
}

export interface ModelsResponse {
  providers: ApiProvider[];
}

export interface ChatMsg {
  role: "user" | "assistant" | "system";
  content: string;
}

export class ChatError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function fetchModels(): Promise<ModelsResponse> {
  const res = await fetch("/api/models");
  if (!res.ok) throw new Error(`Failed to load models (HTTP ${res.status})`);
  return res.json();
}

export async function streamChat(
  args: {
    provider: string;
    model: string;
    messages: ChatMsg[];
    accessCode?: string;
  },
  onToken: (token: string) => void
): Promise<void> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(args.accessCode ? { "x-access-code": args.accessCode } : {}),
    },
    body: JSON.stringify({
      provider: args.provider,
      model: args.model,
      messages: args.messages,
    }),
  });

  // Errors come back as JSON; a successful response is a text token stream.
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => null);
    throw new ChatError(
      data?.error || `Request failed (HTTP ${res.status})`,
      res.status,
      data?.code
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    if (chunk) onToken(chunk);
  }
}

export async function generateImage(args: {
  provider: string;
  model: string;
  prompt: string;
  accessCode?: string;
}): Promise<string> {
  const res = await fetch("/api/image", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(args.accessCode ? { "x-access-code": args.accessCode } : {}),
    },
    body: JSON.stringify({
      provider: args.provider,
      model: args.model,
      prompt: args.prompt,
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ChatError(
      data?.error || `Request failed (HTTP ${res.status})`,
      res.status,
      data?.code
    );
  }
  if (!data?.image) throw new ChatError("No image was returned.", 502);
  return data.image as string;
}
