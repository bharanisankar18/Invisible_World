import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SCALE_STEPS, getObject } from "../data/catalog.js";
import ObjectCard from "../components/ObjectCard.jsx";
import { sci } from "../lib/format.js";

const HAIR = {
  id: "hair-ref",
  name: "Human hair",
  viz: "hair-ref",
  sizeLabel: "~80 µm",
  subtitle: "Keratin fibre, scalp typical",
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
        <div className="md:col-span-7">
          <p className="eyebrow">Scale explorer · {SCALE_STEPS.length} stops</p>
          <h1 className="display h1 mt-6">Zoom into reality</h1>
          <p className="mt-6 max-w-[54ch] text-lg text-muted">
            Drag from human scale to the ångström. The drawings swap at each stop.
          </p>
        </div>
        <p className="illustrative self-end md:col-span-4 md:col-start-9 md:justify-self-end">
          Order-of-magnitude stops, not calibrated
        </p>
      </header>

      {/* Instrument readout */}
      <section className="mt-16 border border-line bg-surface p-6 md:p-10" aria-label="Scale control">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{step.label}</p>
            <output htmlFor="scale" className="mt-2 block font-mono text-[clamp(2.5rem,6vw,4.5rem)] tabular leading-none text-accent">
              {step.display}
            </output>
          </div>
          <p className="font-mono text-sm tabular text-muted">
            {sci(step.meters)}
          </p>
        </div>

        <label htmlFor="scale" className="sr-only">
          Scale
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
              className={`min-h-11 font-mono text-xs tabular transition-colors duration-[140ms] active:opacity-70 ${
                i === 0 ? "text-left" : i === SCALE_STEPS.length - 1 ? "text-right" : "text-center"
              } ${i === index ? "text-accent" : "text-muted hover:text-ink"}`}
            >
              {s.display}
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.section
          key={step.id}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.26, ease }}
          className="mt-24"
          aria-live="polite"
        >
          <div className="grid gap-8 md:grid-cols-12">
            <h2 className="display text-[clamp(2rem,4vw,3rem)] md:col-span-6">{step.title}</h2>
            <div className="md:col-span-5 md:col-start-8">
              <p className="text-ink">{step.fact}</p>
              <p className="mt-3 text-sm text-muted">{step.note}</p>
            </div>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((o) => (
              <li key={o.id}>
                <ObjectCard object={o} to={o.id === "hair-ref" ? "/compare" : undefined} />
              </li>
            ))}
          </ul>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
