import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SCALE_STEPS, getObject } from "../data/catalog.js";
import ObjectViz from "../components/ObjectViz.jsx";

const HAIR = {
  id: "hair-ref",
  name: "Human hair",
  viz: "hair-ref",
  sizeLabel: "~80 µm",
  subtitle: "Keratin fibre",
};

const ease = [0.16, 1, 0.3, 1];

const SCALE_COLORS = [
  "52, 211, 153",   // human - emerald
  "56, 189, 248",   // milli - cyan
  "129, 140, 248",  // micro - indigo
  "167, 139, 250",  // nano - purple
  "251, 191, 36",   // atomic - amber
];

export default function ScaleExplorer() {
  const [index, setIndex] = useState(2);
  const step = SCALE_STEPS[index];
  const color = SCALE_COLORS[index];

  const shown = useMemo(
    () =>
      step.objects.map((id) => {
        if (id === "hair-ref") return HAIR;
        return getObject(id);
      }).filter(Boolean),
    [step]
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-medium tracking-wider uppercase text-accent/80">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Scale explorer
        </span>
        <h1 className="display mt-6 text-[clamp(2.5rem,5vw+1rem,4.5rem)]">
          Zoom into <span className="gradient-text">reality</span>
        </h1>
        <p className="mt-4 max-w-[54ch] text-lg text-muted leading-relaxed">
          Move through five teaching scales. Drawings change with the slider.
        </p>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex items-start gap-3 rounded-2xl glass-card p-5 text-sm"
      >
        <span className="mt-0.5 text-warn text-lg">⚠</span>
        <p className="text-muted/80">
          Illustrative visualization. Tick marks are order-of-magnitude teaching scales, not calibrated laboratory measurements.
        </p>
      </motion.div>

      {/* Slider */}
      <motion.div
        className="mt-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease }}
      >
        <div className="flex items-end justify-between gap-4 mb-6">
          <span className="text-sm text-muted">{step.label}</span>
          <span
            className="display font-mono text-4xl tabular glow-text"
            style={{ textShadow: `0 0 20px rgba(${color}, 0.5), 0 0 40px rgba(${color}, 0.2)` }}
          >
            {step.display}
          </span>
        </div>

        <input
          id="scale"
          type="range"
          min={0}
          max={SCALE_STEPS.length - 1}
          step={1}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
          className="w-full"
          aria-label="Scale slider"
        />

        <div className="mt-3 flex justify-between">
          {SCALE_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={`font-mono text-[11px] transition-colors duration-200 ${
                i === index ? "text-accent font-medium" : "text-muted/40 hover:text-muted"
              }`}
            >
              {s.display}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease }}
          className="mt-20"
        >
          <h2 className="display text-[clamp(2rem,4vw,3.2rem)]">{step.title}</h2>
          <p className="mt-4 max-w-[60ch] text-muted leading-relaxed">{step.fact}</p>
          <p className="mt-2 text-sm text-muted/50 italic">{step.note}</p>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {shown.map((o, j) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: j * 0.1, ease }}
              >
                <Link
                  to={o.id === "hair-ref" ? "/compare" : `/object/${o.id}`}
                  className="group flex flex-col rounded-2xl glass-card overflow-hidden p-1"
                >
                  <div className="relative aspect-square rounded-xl bg-bg-deep/80 p-6 overflow-hidden">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(circle, rgba(${color}, 0.1), transparent 70%)` }}
                    />
                    <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-110">
                      <ObjectViz type={o.viz} />
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <h3 className="text-lg font-semibold text-ink group-hover:text-accent transition-colors">{o.name}</h3>
                    <p className="mt-1 text-sm text-muted/60">{o.sizeLabel}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
