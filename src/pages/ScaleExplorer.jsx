import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SCALE_STEPS, getObject } from "../data/catalog.js";
import ObjectCard from "../components/ObjectCard.jsx";
import { sci } from "../lib/format.js";

const HAIR = {
  id: "hair-ref",
  name: "Human hair",
  viz: "hair-ref",
  sizeLabel: "~80 µm",
  subtitle: "Keratin fibre, typical scalp hair",
};

const ease = [0.16, 1, 0.3, 1];

export default function ScaleExplorer() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(2);
  const step = SCALE_STEPS[index];

  const shown = useMemo(
    () => step.objects.map((id) => (id === "hair-ref" ? HAIR : getObject(id))).filter(Boolean),
    [step]
  );

  return (
    <div>
      <header className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <h1 className="display h1">Zoom into reality</h1>
          <p className="mt-6 max-w-[54ch] text-xl text-muted">
            Drag the slider from your own size down to a single atom. Each stop is a thousand times smaller than the one
            before, until a last short hop down to the atom.
          </p>
        </div>
        <p className="illustrative self-end md:col-span-4 md:justify-self-end">Stops are rough powers of ten</p>
      </header>

      <section className="stage mt-12 p-6 md:p-10" aria-label="Zoom level">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-muted">{step.label}</p>
            <output htmlFor="scale" className="display mt-2 block text-[clamp(3rem,2rem+5vw,6rem)] leading-none text-electron tabular">
              {step.display}
            </output>
          </div>
          <p className="text-muted tabular">{sci(step.meters)}</p>
        </div>

        <label htmlFor="scale" className="sr-only">
          Zoom level
        </label>
        <input
          id="scale"
          type="range"
          min={0}
          max={SCALE_STEPS.length - 1}
          step={1}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
          aria-valuetext={`${step.display}, ${step.label}`}
          className="mt-8"
        />

        <div className="mt-2 grid" style={{ gridTemplateColumns: `repeat(${SCALE_STEPS.length}, minmax(0, 1fr))` }}>
          {SCALE_STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={i === index}
              className={`min-h-11 text-sm font-bold tabular transition-colors duration-150 ${
                i === 0 ? "text-left" : i === SCALE_STEPS.length - 1 ? "text-right" : "text-center"
              } ${i === index ? "text-ink" : "text-muted hover:text-ink"}`}
            >
              {s.display}
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.section
          key={step.id}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          className="mt-16"
          aria-live="polite"
        >
          <div className="grid gap-8 md:grid-cols-12">
            <h2 className="display text-[clamp(2rem,1.4rem+2vw,3rem)] md:col-span-6">{step.title}</h2>
            <div className="md:col-span-5 md:col-start-8">
              <p className="text-lg text-ink">{step.fact}</p>
              <p className="mt-3 text-sm text-muted">{step.note}</p>
            </div>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((o) => (
              <li key={o.id}>
                <ObjectCard object={o} to={o.id === "hair-ref" ? "/compare" : o.id === "atom" ? "/atom" : undefined} />
              </li>
            ))}
          </ul>
        </motion.section>
      </AnimatePresence>

      <p className="mt-14 text-muted">
        Want them all on one ruler?{" "}
        <Link to="/compare" className="text-link">
          Compare a hair with an atom
        </Link>
      </p>
    </div>
  );
}
