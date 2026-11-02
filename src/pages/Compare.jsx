import { motion } from "framer-motion";
import { COMPARE } from "../data/catalog.js";

const ease = [0.16, 1, 0.3, 1];

const BAR_COLORS = [
  "from-emerald-400 to-emerald-600",
  "from-cyan-400 to-blue-500",
  "from-blue-400 to-indigo-500",
  "from-indigo-400 to-purple-500",
  "from-purple-400 to-violet-500",
  "from-amber-400 to-orange-500",
];

export default function Compare() {
  const max = Math.log10(COMPARE[0].meters);
  const min = Math.log10(COMPARE[COMPARE.length - 1].meters);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-medium tracking-wider uppercase text-accent/80">
          <span className="text-sm">⇔</span>
          Compare scale
        </span>
        <h1 className="display mt-6 text-[clamp(2.5rem,5vw+1rem,4.5rem)]">
          Hair to <span className="gradient-text">atom</span>
        </h1>
        <p className="mt-4 max-w-[54ch] text-lg text-muted leading-relaxed">
          Linear bars would hide everything smaller than a cell. These bars use a logarithmic width so an atom can sit on the same page as a hair.
        </p>
      </motion.div>

      <ul className="mt-20 space-y-10">
        {COMPARE.map((row, i) => {
          const t = (Math.log10(row.meters) - min) / (max - min);
          const width = 8 + t * 92;
          return (
            <motion.li
              key={row.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xl font-semibold text-ink">{row.name}</h2>
                <span className="shrink-0 font-mono text-sm tabular text-accent glow-text">
                  {row.meters.toExponential(0)} m
                </span>
              </div>
              <div className="mt-4 h-4 rounded-full bg-white/[0.03] overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${BAR_COLORS[i] || BAR_COLORS[0]}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${width}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1, ease }}
                  style={{
                    boxShadow: "0 0 12px rgba(56, 189, 248, 0.15)",
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-muted/60">{row.note}</p>
            </motion.li>
          );
        })}
      </ul>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-16 rounded-2xl glass-card p-6"
      >
        <p className="text-sm text-muted/70 leading-relaxed">
          <span className="text-accent/60 font-medium">Note:</span> A hair is about 800 hydrogen-atom-widths
          of 0.1 nm if you stack them across 80 µm — actually about 800,000.
          Logarithmic thinking is the point of this page.
        </p>
      </motion.div>
    </div>
  );
}
