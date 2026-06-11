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

export async function sendChat(args: {
  provider: string;
  model: string;
  messages: ChatMsg[];
  accessCode?: string;
}): Promise<string> {
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

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ChatError(
      data?.error || `Request failed (HTTP ${res.status})`,
      res.status,
      data?.code
    );
  }
  return data?.content ?? "";
}
