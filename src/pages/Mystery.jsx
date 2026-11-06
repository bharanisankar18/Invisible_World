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
        <h1 className="display text-[clamp(2.75rem,1.8rem+3vw,4.25rem)]">What am I?</h1>
        <p className="mt-3 text-lg text-muted">One drawing, one clue, four guesses.</p>

        <figure className="mt-8">
          <div className="stage relative aspect-square p-12">
            <div
              className={`h-full w-full transition-[opacity,filter] duration-500 ${revealed ? "opacity-100" : "opacity-70 blur-[1.5px]"}`}
            >
              <ObjectViz type={round.answer.viz} label={revealed ? null : "Mystery drawing"} />
            </div>
            <span className="absolute left-5 top-5 rounded-full bg-bg/80 px-3 py-1 text-sm text-muted">
              {revealed ? round.answer.sizeLabel : "Size hidden"}
            </span>
          </div>
          <figcaption className="panel mt-4 px-5 py-4">
            <span className="text-sm font-bold text-muted">Clue</span>
            <p className="mt-1 text-lg text-ink">{round.answer.mysteryPrompt}</p>
          </figcaption>
        </figure>
      </div>

      <div className="lg:col-span-7">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <span className="font-bold text-muted">Your score</span>
          <span className="display text-2xl tabular" aria-live="polite">
            {score.correct}
            <span className="text-muted"> of {score.total}</span>
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.ul
              key={`options-${round.answer.id}`}
              className="mt-6 flex flex-col gap-2.5"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease }}
            >
              {round.options.map((o, i) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => handleChoice(o.id)}
                    className="panel-link group flex min-h-16 w-full items-center gap-5 px-5 py-4 text-left"
                  >
                    <span className="display inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-lg text-muted group-hover:bg-ink group-hover:text-accent-ink">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">
                      <span className="block text-lg font-bold">{o.name}</span>
                      <span className="block text-sm text-muted">{o.subtitle}</span>
                    </span>
                    <span className="hidden text-sm text-muted sm:block">{getZone(o.zone)?.name}</span>
                  </button>
                </li>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              key="result"
              className="mt-6"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease }}
            >
              <div
                className="panel p-7"
                style={{ boxShadow: `inset 0 0 0 2px ${correct ? "#6EF0B0" : "#FF5D73"}` }}
                role="status"
              >
                <p className="font-bold" style={{ color: correct ? "#6EF0B0" : "#FF97A6" }}>
                  {correct ? "Correct!" : `Not this time. You picked ${getObject(choice)?.name.toLowerCase()}.`}
                </p>
                <h2 className="display mt-3 text-[2.5rem]">{round.answer.name}</h2>
                <p className="measure mt-4 text-ink">{round.answer.description}</p>
                <p className="measure mt-4 text-sm text-muted">{round.answer.structure}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="btn-primary" onClick={nextRound} autoFocus>
                  Next mystery
                </button>
                <Link to={`/object/${round.answer.id}`} className="btn-secondary">
                  Read about {round.answer.name.toLowerCase()}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
