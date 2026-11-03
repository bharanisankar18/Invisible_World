import { motion, useReducedMotion } from "framer-motion";
import { COMPARE } from "../data/catalog.js";
import { sci } from "../lib/format.js";

const ease = [0.16, 1, 0.3, 1];

function ratioLabel(n) {
  if (n < 1.5) return "reference";
  return `${Math.round(n).toLocaleString("en-US")}× narrower`;
}

export default function Compare() {
  const reduce = useReducedMotion();
  const ref = COMPARE[0].meters;
  const max = Math.log10(ref);
  const min = Math.log10(COMPARE[COMPARE.length - 1].meters);
  const atom = COMPARE[COMPARE.length - 1];

  return (
    <div>
      <header className="max-w-[60ch]">
        <p className="eyebrow">Compare · logarithmic</p>
        <h1 className="display h1 mt-6">Hair to atom</h1>
        <p className="mt-6 text-lg text-muted">
          Linear bars would hide everything smaller than a cell. Each bar here is scaled by log₁₀ of its width, so an atom
          and a hair fit on one page.
        </p>
      </header>

      <div className="mt-20 border-t border-line">
        <div className="hidden grid-cols-12 gap-6 border-b border-line py-3 md:grid">
          <span className="eyebrow col-span-3">Object</span>
          <span className="eyebrow col-span-6">log₁₀ width</span>
          <span className="eyebrow col-span-3 text-right">vs hair</span>
        </div>
        <ul>
          {COMPARE.map((row, i) => {
            const t = (Math.log10(row.meters) - min) / (max - min);
            const width = 6 + t * 94;
            return (
              <li key={row.id} className="grid items-center gap-x-6 gap-y-3 border-b border-line py-6 md:grid-cols-12">
                <div className="md:col-span-3">
                  <h2 className="text-lg font-medium">{row.name}</h2>
                  <p className="text-sm text-muted">{row.note}</p>
                </div>
                <div className="md:col-span-6">
                  <div className="h-3 w-full bg-surface" role="presentation">
                    <motion.div
                      className="h-full origin-left bg-accent"
                      style={{ width: `${width}%`, opacity: 0.35 + t * 0.65 }}
                      initial={reduce ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.52, delay: i * 0.06, ease }}
                    />
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-4 font-mono text-sm tabular md:col-span-3 md:flex-col md:items-end md:gap-1">
                  <span className="text-accent">{sci(row.meters)}</span>
                  <span className="text-muted">{ratioLabel(ref / row.meters)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="panel mt-16 max-w-[70ch] p-6">
        <p className="illustrative">Typical values, not measurements</p>
        <p className="mt-3 text-muted">
          Stack hydrogen-scale atoms ({sci(atom.meters)}) across one 80 µm hair and you need about{" "}
          <span className="font-mono tabular text-ink">{Math.round(ref / atom.meters).toLocaleString("en-US")}</span> of
          them side by side.
        </p>
      </aside>
    </div>
  );
}
