import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getObject } from "../data/catalog.js";
import { useExplore } from "../context/ExploreContext.jsx";
import { localAgentReply } from "../lib/localAgent.js";

const MODES = [
  { id: "discover", label: "Discover", icon: "🔬", desc: "Explain the object" },
  { id: "connect", label: "Connect", icon: "🔗", desc: "Find relationships" },
  { id: "curiosity", label: "Curiosity", icon: "✨", desc: "What to explore next" },
  { id: "challenge", label: "Challenge", icon: "🎯", desc: "Quick quiz" },
  { id: "simulate", label: "Simulate", icon: "⚡", desc: "Thought experiment" },
];

const PROMPTS = [
  "How does a neuron communicate?",
  "What happens inside a human cell?",
  "Why can't we see atoms?",
  "How do magnetic fields work?",
];

const ease = [0.16, 1, 0.3, 1];

export default function Ask() {
  const { selectedId, zoneId, history } = useExplore();
  const [params] = useSearchParams();
  const about = params.get("about") || selectedId;
  const object = about ? getObject(about) : null;
  const [mode, setMode] = useState("discover");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const bottom = useRef(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || busy) return;
    setInput("");
    setError("");
    const userMsg = { role: "user", content: q };
    setMessages((m) => [...m, userMsg]);
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
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Agent HTTP " + res.status);
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply,
          disclaimer: data.disclaimer,
          tool: data.tool,
        },
      ]);
    } catch {
      const data = localAgentReply(payload);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply,
          disclaimer: data.disclaimer,
          tool: data.tool,
        },
      ]);
      setError("Live model offline — using the on-site catalogue guide.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      {/* Sidebar */}
      <aside className="lg:col-span-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-medium tracking-wider uppercase text-accent/80">
            <span className="text-sm">✦</span>
            Ask the Invisible
          </span>
          <h1 className="display mt-6 text-[clamp(2rem,3vw+1rem,3rem)]">
            Science <span className="gradient-text">guide</span>
          </h1>
          <p className="mt-4 text-sm text-muted/70 leading-relaxed">
            Context: <span className="text-ink">{object ? object.name : "no specimen"}</span>
            {zoneId ? ` · zone ${zoneId}` : ""}
          </p>
        </motion.div>

        {/* Mode selector */}
        <div className="mt-6 grid grid-cols-5 gap-1.5 sm:grid-cols-5 lg:grid-cols-1 lg:gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                mode === m.id
                  ? "glass text-accent"
                  : "text-muted/60 hover:text-ink hover:bg-white/[0.03]"
              }`}
              style={mode === m.id ? { borderColor: "rgba(56, 189, 248, 0.2)" } : {}}
            >
              <span className="text-base lg:text-lg">{m.icon}</span>
              <span className="hidden lg:inline">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Sample prompts */}
        <ul className="mt-6 space-y-2 hidden lg:block">
          {PROMPTS.map((p) => (
            <li key={p}>
              <button
                type="button"
                className="group w-full rounded-xl glass-card px-4 py-3 text-left text-sm text-muted/70 hover:text-ink transition-all"
                onClick={() => send(p)}
              >
                <span className="mr-2 text-accent/40 group-hover:text-accent transition-colors">→</span>
                {p}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat area */}
      <section className="flex min-h-[60dvh] flex-col rounded-3xl glass overflow-hidden lg:col-span-8">
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-5xl mb-6 opacity-30">✦</div>
              <p className="text-muted/50 max-w-[40ch] leading-relaxed">
                Ask a question. <span className="text-accent/50">Discover</span> explains the object.{" "}
                <span className="text-accent/50">Connect</span> links ideas.{" "}
                <span className="text-accent/50">Curiosity</span> suggests a next stop.{" "}
                <span className="text-accent/50">Challenge</span> writes a quiz.{" "}
                <span className="text-accent/50">Simulate</span> runs a thought experiment.
              </p>
            </div>
          )}
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                    m.role === "user"
                      ? "bg-accent/10 text-ink"
                      : "glass-card"
                  }`}
                >
                  <p className="font-mono text-[10px] tracking-[0.1em] uppercase mb-2 ${
                    m.role === 'user' ? 'text-accent/60' : 'text-accent-2/60'
                  }">
                    {m.role === "user" ? "You" : m.tool || "Guide"}
                  </p>
                  <p className="whitespace-pre-wrap text-ink text-sm leading-relaxed">{m.content}</p>
                  {m.disclaimer && (
                    <p className="mt-3 text-[11px] text-muted/40 leading-relaxed">{m.disclaimer}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {busy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="flex gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "0ms" }} />
                <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "150ms" }} />
                <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="font-mono text-xs text-accent/60">Consulting the guide…</span>
            </motion.div>
          )}
          {error && <p className="text-sm text-warn/70">{error}</p>}
          <div ref={bottom} />
        </div>

        {/* Input */}
        <form
          className="flex gap-2 border-t border-line/30 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <label className="sr-only" htmlFor="ask">Question</label>
          <input
            id="ask"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-12 flex-1 rounded-xl bg-white/[0.03] px-4 text-sm text-ink placeholder:text-muted/40 focus:bg-white/[0.05] transition-colors"
            placeholder="Ask about this scale of reality…"
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="btn-primary h-12 px-6 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
