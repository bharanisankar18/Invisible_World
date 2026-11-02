import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { OBJECTS, getObject } from "../data/catalog.js";
import ObjectViz from "../components/ObjectViz.jsx";

const ease = [0.16, 1, 0.3, 1];

function pickRound() {
  const answer = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
  const others = OBJECTS.filter((o) => o.id !== answer.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [...others, answer].sort(() => Math.random() - 0.5);
  return { answer, options };
}

export default function Mystery() {
  const [round, setRound] = useState(() => pickRound());
  const [choice, setChoice] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const revealed = choice !== null;
  const correct = choice === round.answer.id;

  const decoy = useMemo(() => round.answer, [round]);

  const handleChoice = (id) => {
    setChoice(id);
    setScore((s) => ({
      correct: s.correct + (id === round.answer.id ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const nextRound = () => {
    setChoice(null);
    setRound(pickRound());
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-medium tracking-wider uppercase text-accent/80">
            <span className="text-sm">❓</span>
            Mystery explorer
          </span>
          <h1 className="display mt-6 text-[clamp(2rem,4vw+1rem,3.5rem)]">
            Name the <span className="gradient-text">specimen</span>
          </h1>

          {/* Score */}
          {score.total > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <span className="font-mono text-sm text-accent">
                {score.correct}/{score.total}
              </span>
              <div className="h-2 flex-1 rounded-full bg-white/[0.05] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                  animate={{ width: `${(score.correct / score.total) * 100}%` }}
                  transition={{ duration: 0.5, ease }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Specimen display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease }}
          className="mt-8 relative"
        >
          <div className="aspect-square rounded-3xl glass overflow-hidden p-10 relative">
            <div className="absolute inset-0 opacity-20" style={{
              background: "radial-gradient(circle, rgba(56, 189, 248, 0.15), transparent 70%)",
            }} />
            <div className={`relative h-full w-full transition-all duration-700 ${revealed ? "" : "opacity-60 blur-[2px]"}`}>
              <ObjectViz type={decoy.viz} />
            </div>
            {!revealed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl opacity-30">?</span>
              </div>
            )}
          </div>
          <p className="mt-4 text-sm text-muted/70 italic">{round.answer.mysteryPrompt}</p>
        </motion.div>
      </div>

      <div className="lg:col-span-7">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.ul
              key="options"
              className="grid gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease }}
            >
              {round.options.map((o, i) => (
                <motion.li
                  key={o.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease }}
                >
                  <button
                    type="button"
                    onClick={() => handleChoice(o.id)}
                    className="group flex w-full items-center justify-between rounded-2xl glass-card px-6 py-5 text-left transition-all duration-200 hover:border-accent/30"
                  >
                    <div>
                      <span className="text-lg font-semibold text-ink group-hover:text-accent transition-colors">{o.name}</span>
                      <span className="ml-3 text-sm text-muted/50">{o.subtitle}</span>
                    </div>
                    <span className="font-mono text-xs text-muted/40">{o.zone}</span>
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <div className={`rounded-2xl p-6 ${
                correct
                  ? "glass-card border-success/30"
                  : "glass-card border-warn/20"
              }`} style={{
                borderColor: correct ? "rgba(52, 211, 153, 0.3)" : "rgba(251, 191, 36, 0.2)",
              }}>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                  correct
                    ? "bg-success/10 text-success"
                    : "bg-warn/10 text-warn"
                }`}>
                  {correct ? "✓ Correct!" : "✗ Not quite"}
                </span>

                <h2 className="display mt-4 text-3xl">{round.answer.name}</h2>
                <p className="mt-4 max-w-[54ch] text-muted leading-relaxed">{round.answer.description}</p>
                <p className="mt-3 text-sm text-muted/60 leading-relaxed">
                  <span className="text-accent/60 font-medium">Structure:</span> {round.answer.structure}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={`/object/${round.answer.id}`} className="btn-primary">
                  Open dossier
                </Link>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={nextRound}
                >
                  Next specimen →
                </button>
              </div>

              {!correct && (
                <p className="mt-6 text-sm text-muted/50">
                  You chose {getObject(choice)?.name}. The drawing matched {round.answer.name}.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
