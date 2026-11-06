import { motion, useReducedMotion } from "framer-motion";
import { COMPARE } from "../data/catalog.js";
import { sci } from "../lib/format.js";

const ease = [0.16, 1, 0.3, 1];

function ratioLabel(n) {
  if (n < 1.5) return "the reference";
  return `${Math.round(n).toLocaleString("en-GB")}× narrower`;
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
        <h1 className="display h1">Hair to atom</h1>
        <p className="mt-6 text-xl text-muted">
          On an ordinary ruler everything smaller than a cell would be an invisible sliver. This ruler is logarithmic:
          each step along it means ten times smaller, so a hair and an atom fit on one page.
        </p>
      </header>

      <ul className="mt-16 flex flex-col gap-3">
        {COMPARE.map((row, i) => {
          const t = (Math.log10(row.meters) - min) / (max - min);
          const width = 6 + t * 94;
          return (
            <li key={row.id} className="panel grid items-center gap-x-6 gap-y-3 px-5 py-5 md:grid-cols-12 md:px-6">
              <div className="md:col-span-3">
                <h2 className="display text-[1.35rem]">{row.name}</h2>
                <p className="text-sm text-muted">{row.note}</p>
              </div>
              <div className="md:col-span-6">
                <div className="h-4 w-full overflow-hidden rounded-full bg-stage" role="presentation">
                  <motion.div
                    className="h-full origin-left rounded-full"
                    style={{
                      width: `${width}%`,
                      background: "linear-gradient(90deg, #3D6BFF, #4FE3FF)",
                      opacity: 0.45 + t * 0.55,
                    }}
                    initial={reduce ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.07, ease }}
                  />
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-4 text-sm tabular md:col-span-3 md:flex-col md:items-end md:gap-1">
                <span className="font-bold text-electron">{sci(row.meters)}</span>
                <span className="text-muted">{ratioLabel(ref / row.meters)}</span>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="stage mt-12 max-w-[70ch] p-7">
        <p className="illustrative">Typical sizes, not measurements</p>
        <p className="mt-3 text-lg text-ink">
          Line up hydrogen-sized atoms ({sci(atom.meters)}) across one 80 µm hair and you would need about{" "}
          <strong className="tabular">{Math.round(ref / atom.meters).toLocaleString("en-GB")}</strong> of them.
        </p>
      </aside>
    </div>
  );
}
