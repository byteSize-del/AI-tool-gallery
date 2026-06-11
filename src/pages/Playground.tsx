import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  fetchModels,
  streamChat,
  generateImage,
  ChatError,
  type ApiProvider,
  type Capability,
  type ChatMsg,
} from "../lib/playgroundApi";
import { usePageReady } from "../hooks/usePageReady";
import { SkeletonGrid } from "../components/Skeleton";

const TABS: { key: Capability; label: string }[] = [
  { key: "chat", label: "💬 Chat" },
  { key: "code", label: "👨‍💻 Code" },
  { key: "reasoning", label: "🧠 Reasoning" },
  { key: "image", label: "🎨 Image" },
];

const SUGGESTIONS: Record<Capability, string[]> = {
  chat: ["Explain quantum computing like I'm 12.", "Give me 3 fun facts about octopuses."],
  code: [
    "Write a TypeScript function that debounces a callback.",
    "Explain Big-O notation with an example.",
  ],
  reasoning: [
    "A bat and ball cost $1.10. The bat costs $1 more than the ball. How much is the ball?",
    "Plan a 3-step approach to learn guitar in a month.",
  ],
  image: [
    "a cozy cabin in a snowy pine forest, soft watercolor",
    "a friendly robot reading a book, flat vector illustration",
  ],
  audio: [],
};

const ACCESS_KEY = "pg_access_code";

interface FlatModel {
  providerId: string;
  providerLabel: string;
  id: string;
  label: string;
  capabilities: Capability[];
}

export default function Playground() {
  const ready = usePageReady();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [providers, setProviders] = useState<ApiProvider[]>([]);

  const [tab, setTab] = useState<Capability>("chat");
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [search, setSearch] = useState("");

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const [accessCode, setAccessCode] = useState<string>(
    () => localStorage.getItem(ACCESS_KEY) ?? ""
  );
  const [accessNeeded, setAccessNeeded] = useState(false);

  // image generation state
  const [imgPrompt, setImgPrompt] = useState("");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    fetchModels()
      .then((data) => {
        if (alive) setProviders(data.providers);
      })
      .catch((e) => {
        if (alive) setLoadError(e.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  // flatten every model from connected providers
  const allModels = useMemo<FlatModel[]>(() => {
    return providers
      .filter((p) => p.connected)
      .flatMap((p) =>
        p.models.map((m) => ({
          providerId: p.id,
          providerLabel: p.label,
          id: m.id,
          label: m.label,
          capabilities: m.capabilities,
        }))
      );
  }, [providers]);

  // models for the active capability tab + search
  const tabModels = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allModels
      .filter((m) => m.capabilities.includes(tab))
      .filter((m) => !q || m.id.toLowerCase().includes(q));
  }, [allModels, tab, search]);

  // group by provider for the <optgroup> select
  const grouped = useMemo(() => {
    const map = new Map<string, FlatModel[]>();
    for (const m of tabModels) {
      const arr = map.get(m.providerLabel) ?? [];
      arr.push(m);
      map.set(m.providerLabel, arr);
    }
    return [...map.entries()];
  }, [tabModels]);

  // keep a valid selection whenever the tab/model list changes
  useEffect(() => {
    if (tabModels.length === 0) {
      setSelectedKey("");
      return;
    }
    const stillValid = tabModels.some(
      (m) => `${m.providerId}::${m.id}` === selectedKey
    );
    if (!stillValid) setSelectedKey(`${tabModels[0].providerId}::${tabModels[0].id}`);
  }, [tabModels, selectedKey]);

  const selected = useMemo(
    () => tabModels.find((m) => `${m.providerId}::${m.id}` === selectedKey),
    [tabModels, selectedKey]
  );

  const connectedProviders = providers.filter((p) => p.connected);
  const totalModels = allModels.length;
  const canChat = !!selected && tab !== "image" && tab !== "audio";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend(text: string) {
    if (!selected || !text.trim() || sending) return;
    setChatError(null);
    const userMsg: ChatMsg = { role: "user", content: text.trim() };
    const history = [...messages, userMsg];
    // add the user message + an empty assistant placeholder to stream into
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setSending(true);
    try {
      await streamChat(
        {
          provider: selected.providerId,
          model: selected.id,
          messages: history,
          accessCode: accessCode || undefined,
        },
        (token) => {
          setMessages((cur) => {
            const copy = cur.slice();
            const last = copy[copy.length - 1];
            if (last && last.role === "assistant") {
              copy[copy.length - 1] = { ...last, content: last.content + token };
            }
            return copy;
          });
        }
      );
      setAccessNeeded(false);
    } catch (e) {
      if (e instanceof ChatError && e.code === "ACCESS_REQUIRED") {
        setAccessNeeded(true);
        setChatError("This playground is protected. Enter the access code to continue.");
      } else {
        setChatError(e instanceof Error ? e.message : "Something went wrong.");
      }
      // roll back the user message + placeholder so they can retry cleanly
      setMessages(messages);
      setInput(text);
    } finally {
      setSending(false);
    }
  }

  function saveAccessCode(code: string) {
    setAccessCode(code);
    localStorage.setItem(ACCESS_KEY, code);
    setAccessNeeded(false);
    setChatError(null);
  }

  async function handleGenerateImage(text: string) {
    if (!selected || !text.trim() || imgLoading) return;
    setImgError(null);
    setImgLoading(true);
    setImgUrl(null);
    try {
      const url = await generateImage({
        provider: selected.providerId,
        model: selected.id,
        prompt: text.trim(),
        accessCode: accessCode || undefined,
      });
      setImgUrl(url);
      setAccessNeeded(false);
    } catch (e) {
      if (e instanceof ChatError && e.code === "ACCESS_REQUIRED") {
        setAccessNeeded(true);
        setImgError("This playground is protected. Enter the access code to continue.");
      } else {
        setImgError(e instanceof Error ? e.message : "Something went wrong.");
      }
    } finally {
      setImgLoading(false);
    }
  }

  if (!ready) return <SkeletonGrid count={3} variant="tool" />;

  return (
    <div className="fade-up">
      <header className="section-head">
        <h1>Model Playground 🎮</h1>
        <p>
          Chat with real models, live. Pick a use case, choose a model, and
          send a prompt. Models are detected automatically from the connected
          providers.
        </p>
      </header>

      {loading ? (
        <SkeletonGrid count={3} variant="tool" />
      ) : loadError || connectedProviders.length === 0 ? (
        <div className="empty-state sketch-box">
          <span className="empty-state__emoji">🔌</span>
          <h2>No live models yet</h2>
          <p>
            The Playground runs on the deployed site once provider API keys are
            set in Vercel (Groq, NVIDIA, Google, OpenRouter, or Mistral). Add at
            least one key, redeploy, and models appear here automatically.
          </p>
          <p className="muted">
            Running locally? Use <code>vercel dev</code> so the <code>/api</code>{" "}
            functions are available.
          </p>
        </div>
      ) : (
        <>
          {/* connected providers + counts */}
          <div className="pg-providers">
            {providers.map((p) => (
              <span
                key={p.id}
                className={`sketch-tag ${p.connected ? "tag-free" : "tier-average"}`}
                title={p.error ? p.error : undefined}
              >
                {p.connected ? "🟢" : "⚪"} {p.label}
                {p.connected ? ` · ${p.models.length}` : ""}
              </span>
            ))}
            <span className="pg-providers__total">{totalModels} models detected</span>
          </div>

          {/* capability tabs */}
          <div className="filter-row" style={{ marginBottom: "1rem" }}>
            {TABS.map((t) => {
              const count = allModels.filter((m) => m.capabilities.includes(t.key)).length;
              return (
                <button
                  key={t.key}
                  className={"filter-chip" + (tab === t.key ? " active" : "")}
                  onClick={() => setTab(t.key)}
                  disabled={count === 0}
                >
                  {t.label} {count > 0 && <span className="pg-count">{count}</span>}
                </button>
              );
            })}
          </div>

          {/* model picker */}
          <div className="pg-controls">
            <select
              className="pg-select"
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              aria-label="Choose a model"
            >
              {grouped.length === 0 && <option>No models in this category</option>}
              {grouped.map(([provider, models]) => (
                <optgroup key={provider} label={provider}>
                  {models.map((m) => (
                    <option key={`${m.providerId}::${m.id}`} value={`${m.providerId}::${m.id}`}>
                      {m.id}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <input
              className="pg-search"
              placeholder="Filter models…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Filter models"
            />
          </div>

          {/* chat surface */}
          {tab === "image" ? (
            <div className="pg-image sketch-box">
              <p className="muted pg-image__hint">
                Generating with <strong>{selected?.id ?? "a model"}</strong> via{" "}
                <strong>{selected?.providerLabel ?? "—"}</strong>. Image
                generation works on Google (Imagen), OpenRouter image models,
                and NVIDIA FLUX/SDXL.
              </p>

              <form
                className="pg-composer"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleGenerateImage(imgPrompt);
                }}
              >
                <textarea
                  className="pg-input"
                  placeholder="Describe the image you want… (e.g. a red panda astronaut, watercolor)"
                  value={imgPrompt}
                  rows={2}
                  disabled={!selected || imgLoading}
                  onChange={(e) => setImgPrompt(e.target.value)}
                />
                <div className="pg-composer__actions">
                  <button
                    type="submit"
                    className="sketch-btn"
                    disabled={!selected || imgLoading || !imgPrompt.trim()}
                  >
                    {imgLoading ? "Painting…" : "Generate 🎨"}
                  </button>
                </div>
              </form>

              {!imgUrl && !imgLoading && (
                <div className="pg-suggestions" style={{ justifyContent: "flex-start" }}>
                  {SUGGESTIONS.image.map((s) => (
                    <button
                      key={s}
                      className="chip"
                      onClick={() => {
                        setImgPrompt(s);
                        handleGenerateImage(s);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {imgError && <div className="pg-error">⚠️ {imgError}</div>}

              {accessNeeded && (
                <div className="pg-access">
                  <input
                    type="password"
                    className="pg-search"
                    placeholder="Access code"
                    defaultValue={accessCode}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        saveAccessCode((e.target as HTMLInputElement).value);
                    }}
                    aria-label="Access code"
                  />
                  <span className="muted">Press Enter to save and retry.</span>
                </div>
              )}

              {imgLoading && (
                <div className="pg-image__loading skeleton" aria-label="Generating image" />
              )}

              {imgUrl && !imgLoading && (
                <figure className="pg-image__result">
                  <img src={imgUrl} alt={imgPrompt || "Generated image"} />
                  <figcaption>
                    <a
                      href={imgUrl}
                      download="ai-image.png"
                      className="tool-card__ext"
                    >
                      Download ↓
                    </a>
                  </figcaption>
                </figure>
              )}
            </div>
          ) : (
            <div className="pg-chat sketch-box">
              <div className="pg-chat__messages" ref={scrollRef}>
                {messages.length === 0 ? (
                  <div className="pg-chat__empty">
                    <p className="muted">
                      You&apos;re chatting with{" "}
                      <strong>{selected?.id ?? "a model"}</strong> via{" "}
                      <strong>{selected?.providerLabel}</strong>. Try:
                    </p>
                    <div className="pg-suggestions">
                      {SUGGESTIONS[tab].map((s) => (
                        <button key={s} className="chip" onClick={() => handleSend(s)}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((m, i) => {
                    const isLast = i === messages.length - 1;
                    const streamingThis = sending && isLast && m.role === "assistant";
                    return (
                      <div key={i} className={`pg-msg pg-msg--${m.role}`}>
                        <span className="pg-msg__who">
                          {m.role === "user"
                            ? "🧑 You"
                            : "🤖 " + (selected?.providerLabel ?? "AI")}
                        </span>
                        <div className="pg-msg__bubble">
                          {m.role === "assistant" ? (
                            m.content ? (
                              <div className="md">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {m.content}
                                </ReactMarkdown>
                                {streamingThis && <span className="pg-cursor" />}
                              </div>
                            ) : (
                              <span className="pg-msg__bubble--typing">
                                <span></span>
                                <span></span>
                                <span></span>
                              </span>
                            )
                          ) : (
                            m.content
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {chatError && <div className="pg-error">⚠️ {chatError}</div>}

              {accessNeeded && (
                <div className="pg-access">
                  <input
                    type="password"
                    className="pg-search"
                    placeholder="Access code"
                    defaultValue={accessCode}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        saveAccessCode((e.target as HTMLInputElement).value);
                    }}
                    aria-label="Access code"
                  />
                  <span className="muted">Press Enter to save and retry.</span>
                </div>
              )}

              <form
                className="pg-composer"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
              >
                <textarea
                  className="pg-input"
                  placeholder={canChat ? "Type a prompt…" : "Pick a chat model to start"}
                  value={input}
                  rows={2}
                  disabled={!canChat || sending}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(input);
                    }
                  }}
                />
                <div className="pg-composer__actions">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      className="sketch-btn sketch-btn--ghost"
                      onClick={() => {
                        setMessages([]);
                        setChatError(null);
                      }}
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    className="sketch-btn"
                    disabled={!canChat || sending || !input.trim()}
                  >
                    {sending ? "Sending…" : "Send →"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <p className="pg-disclaimer muted">
            Responses come from live third-party models and may be inaccurate.
            Conversations are sent to the selected provider to generate replies.
          </p>
        </>
      )}
    </div>
  );
}
