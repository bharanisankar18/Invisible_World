import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { OBJECTS, getObject, getZone } from "../data/catalog.js";
import ObjectViz from "../components/ObjectViz.jsx";

const ease = [0.16, 1, 0.3, 1];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRound(prevId) {
  const pool = OBJECTS.filter((o) => o.id !== prevId);
  const answer = pool[Math.floor(Math.random() * pool.length)];
  const others = shuffle(OBJECTS.filter((o) => o.id !== answer.id)).slice(0, 3);
  return { answer, options: shuffle([...others, answer]) };
}

export default function Mystery() {
  const reduce = useReducedMotion();
  const [round, setRound] = useState(() => pickRound());
  const [choice, setChoice] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const revealed = choice !== null;
  const correct = choice === round.answer.id;

  const handleChoice = (id) => {
    if (revealed) return;
    setChoice(id);
    setScore((s) => ({ correct: s.correct + (id === round.answer.id ? 1 : 0), total: s.total + 1 }));
  };

  const nextRound = () => {
    setChoice(null);
    setRound(pickRound(round.answer.id));
  };

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="eyebrow">Mystery explorer</p>
        <h1 className="display mt-6 text-[clamp(2.5rem,4vw+1rem,4rem)]">Name the specimen</h1>

        <figure className="mt-10">
          <div className="relative aspect-square border border-line bg-surface p-10">
            <div className={`h-full w-full transition-opacity duration-[520ms] ${revealed ? "opacity-100" : "opacity-60"}`}>
              <ObjectViz type={round.answer.viz} label={revealed ? null : "Unidentified specimen drawing"} />
            </div>
            <span className="absolute left-4 top-4 font-mono text-xs uppercase tracking-[0.08em] text-muted">
              {revealed ? round.answer.sizeLabel : "Specimen ?"}
            </span>
          </div>
          <figcaption className="mt-4">
            <span className="eyebrow">Clue</span>
            <p className="mt-2 text-ink">{round.answer.mysteryPrompt}</p>
          </figcaption>
        </figure>
      </div>

      <div className="lg:col-span-7">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <span className="eyebrow">Score</span>
          <span className="font-mono text-sm tabular" aria-live="polite">
            <span className="text-accent">{score.correct}</span>
            <span className="text-muted"> / {score.total}</span>
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.ul
              key={`options-${round.answer.id}`}
              className="mt-6 flex flex-col gap-2"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.26, ease }}
            >
              {round.options.map((o, i) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => handleChoice(o.id)}
                    className="panel-link group flex min-h-16 w-full items-center gap-6 border border-transparent px-5 py-4 text-left hover:border-line"
                  >
                    <span className="font-mono text-sm tabular text-muted">{String.fromCharCode(65 + i)}</span>
                    <span className="flex-1">
                      <span className="block text-lg font-medium group-hover:text-accent">{o.name}</span>
                      <span className="block text-sm text-muted">{o.subtitle}</span>
                    </span>
                    <span className="hidden font-mono text-[11px] uppercase tracking-[0.08em] text-muted sm:block">
                      {getZone(o.zone)?.name.replace(" World", "")}
                    </span>
                  </button>
                </li>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              key="result"
              className="mt-6"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.26, ease }}
            >
              <div className={`border-l-2 bg-surface p-6 ${correct ? "border-accent" : "border-muted"}`} role="status">
                <p className={`font-mono text-xs uppercase tracking-[0.08em] ${correct ? "text-accent" : "text-muted"}`}>
                  {correct ? "Correct" : `Not quite · you chose ${getObject(choice)?.name}`}
                </p>
                <h2 className="display mt-4 text-4xl">{round.answer.name}</h2>
                <p className="measure mt-4 text-ink">{round.answer.description}</p>
                <p className="measure mt-4 text-sm text-muted">
                  <span className="text-ink">Structure.</span> {round.answer.structure}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="btn-primary" onClick={nextRound} autoFocus>
                  Next specimen
                </button>
                <Link to={`/object/${round.answer.id}`} className="btn-secondary">
                  Open the {round.answer.name.toLowerCase()} dossier
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
