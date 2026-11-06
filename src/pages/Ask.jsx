import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getObject } from "../data/catalog.js";
import { useExplore } from "../context/ExploreContext.jsx";
import { localAgentReply } from "../lib/localAgent.js";

const MODES = [
  { id: "discover", label: "Discover", desc: "Explain the specimen" },
  { id: "connect", label: "Connect", desc: "Map its neighbours" },
  { id: "curiosity", label: "Curiosity", desc: "Suggest a next stop" },
  { id: "challenge", label: "Challenge", desc: "Write a one-item quiz" },
  { id: "simulate", label: "Simulate", desc: "Run a thought experiment" },
];

const PROMPTS = [
  "How does a neuron communicate?",
  "What happens inside a human cell?",
  "Why can't we see atoms?",
  "How do magnetic fields work?",
];

export default function Ask() {
  const { selectedId, zoneId, history } = useExplore();
  const [params] = useSearchParams();
  const about = params.get("about") || selectedId;
  const object = about ? getObject(about) : null;
  const [mode, setMode] = useState("discover");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const [messages, setMessages] = useState([]);
  const log = useRef(null);

  // Scroll the transcript only — never the page.
  useEffect(() => {
    const el = log.current;
    if (el && (messages.length || busy)) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setBusy(true);
    const payload = {
      message: q,
      mode,
      context: {
        objectId: object?.id || null,
        objectName: object?.name || null,
        zoneId,
        history: history.slice(-6),
      },
    };
    let data;
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Agent HTTP ${res.status}`);
      data = await res.json();
      setOffline(false);
    } catch {
      data = { ...localAgentReply(payload), source: "catalogue" };
      setOffline(true);
    }
    setMessages((m) => [
      ...m,
      { role: "assistant", content: data.reply, disclaimer: data.disclaimer, tool: data.tool, source: data.source },
    ]);
    setBusy(false);
  };

  const activeMode = MODES.find((m) => m.id === mode);

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <aside className="lg:col-span-4">
        <h1 className="display text-[clamp(2.75rem,1.8rem+3vw,4.25rem)]">Ask the guide</h1>
        <p className="mt-4 text-muted">
          Talking about:{" "}
          {object ? (
            <Link to={`/object/${object.id}`} className="text-ink underline-offset-4 hover:underline">
              {object.name}
            </Link>
          ) : (
            <span className="text-ink">anything on the site</span>
          )}
        </p>

        <fieldset className="mt-8">
          <legend className="mb-3 font-bold text-muted">What kind of answer?</legend>
          <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
                className={`flex min-h-11 items-center justify-between gap-4 rounded-2xl px-4 text-left text-[15px] transition-colors duration-150 lg:w-full ${
                  mode === m.id ? "bg-ink text-accent-ink" : "bg-surface text-muted hover:bg-surface-2 hover:text-ink"
                }`}
              >
                <span className="font-bold">{m.label}</span>
                <span className={`hidden text-sm lg:inline ${mode === m.id ? "text-accent-ink/75" : "text-muted"}`}>{m.desc}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-8">
          <p className="mb-3 font-bold text-muted">Try one of these</p>
          <ul className="flex flex-col border-t border-line">
            {PROMPTS.map((p) => (
              <li key={p} className="border-b border-line">
                <button
                  type="button"
                  disabled={busy}
                  className="flex min-h-12 w-full items-center py-2 text-left text-[15px] text-muted transition-colors duration-150 hover:text-ink active:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => send(p)}
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="stage flex h-[min(76dvh,720px)] flex-col overflow-hidden lg:col-span-8" aria-label="Conversation">
        <div ref={log} className="flex-1 space-y-6 overflow-y-auto p-6" role="log" aria-live="polite">
          {messages.length === 0 && (
            <div className="flex h-full flex-col justify-center">
              <p className="display text-2xl">{activeMode.label}</p>
              <p className="mt-3 max-w-[44ch] text-muted">
                {activeMode.desc}. Answers draw on the {object ? `${object.name.toLowerCase()} dossier` : "on-site catalogue"}
                {" "}and say when a picture is simplified.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-[20px] px-5 py-4 ${
                  m.role === "user" ? "rounded-br-md bg-ink text-accent-ink" : "rounded-bl-md bg-surface"
                }`}
              >
                {m.role !== "user" && (
                  <p className="mb-1.5 text-sm font-bold text-electron">
                    Guide{m.source === "catalogue" ? ", from the site’s notes" : ""}
                  </p>
                )}
                <p className={`whitespace-pre-wrap text-[16px] ${m.role === "user" ? "" : "text-ink"}`}>{m.content}</p>
                {m.disclaimer && <p className="mt-3 text-xs text-muted">{m.disclaimer}</p>}
              </div>
            </div>
          ))}

          {busy && (
            <p className="text-sm text-muted" role="status">
              Thinking…
            </p>
          )}
        </div>

        {offline && (
          <p className="border-t border-line px-6 py-3 text-xs text-muted">
            The live guide isn’t running, so answers come from the site’s own notes.
          </p>
        )}

        <form
          className="flex gap-2 border-t border-line/70 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <label className="sr-only" htmlFor="ask">
            Question
          </label>
          <input
            id="ask"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="field h-12 flex-1 rounded-full"
            placeholder={object ? `Ask about ${object.name.toLowerCase()}` : "Ask something, like: why can’t we see atoms?"}
            disabled={busy}
            autoComplete="off"
          />
          <button type="submit" disabled={busy || !input.trim()} className="btn-primary h-12 min-h-12">
            Ask
          </button>
        </form>
      </section>
    </div>
  );
}
