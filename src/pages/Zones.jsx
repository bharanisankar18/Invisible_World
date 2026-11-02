import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ZONES, OBJECTS } from "../data/catalog.js";
import ObjectViz from "../components/ObjectViz.jsx";

const ZONE_STYLES = {
  micro: { emoji: "🔬", color: "56, 189, 248", gradient: "from-cyan-400/10 to-blue-500/5" },
  atomic: { emoji: "⚛️", color: "129, 140, 248", gradient: "from-indigo-400/10 to-purple-500/5" },
  biological: { emoji: "🧬", color: "167, 139, 250", gradient: "from-purple-400/10 to-pink-500/5" },
  forces: { emoji: "⚡", color: "251, 191, 36", gradient: "from-amber-400/10 to-orange-500/5" },
  neural: { emoji: "🧠", color: "52, 211, 153", gradient: "from-emerald-400/10 to-teal-500/5" },
};

const ease = [0.16, 1, 0.3, 1];

export default function Zones() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-medium tracking-wider uppercase text-accent/80">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Exploration
        </span>
        <h1 className="display mt-6 text-[clamp(2.5rem,5vw+1rem,4.5rem)]">
          Five <span className="gradient-text">zones</span>
        </h1>
        <p className="mt-4 max-w-[56ch] text-lg text-muted leading-relaxed">
          Pick a kind of invisibility. Cards inside each zone open a dossier: structure, typical size, facts and neighbours.
        </p>
      </motion.div>

      <div className="mt-20 space-y-32">
        {ZONES.map((z, i) => {
          const items = OBJECTS.filter((o) => o.zone === z.id).slice(0, 3);
          const style = ZONE_STYLES[z.id] || ZONE_STYLES.micro;

          return (
            <motion.section
              key={z.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.05, ease }}
            >
              <div className={`grid gap-12 md:grid-cols-12 ${i % 2 ? "md:direction-rtl" : ""}`}>
                <div className={`md:col-span-5 ${i % 2 ? "md:order-2" : ""}`}>
                  <span className="text-4xl">{style.emoji}</span>
                  <span className="mt-4 inline-block font-mono text-xs tracking-wider uppercase" style={{ color: `rgba(${style.color}, 0.7)` }}>
                    {z.scale}
                  </span>
                  <h2 className="display mt-2 text-[clamp(2rem,4vw,3.2rem)]">{z.name}</h2>
                  <p className="mt-4 text-muted leading-relaxed">{z.blurb}</p>
                  <Link
                    to={`/zone/${z.id}`}
                    className="btn-primary mt-8"
                    style={{
                      background: `linear-gradient(135deg, rgba(${style.color}, 1), rgba(${style.color}, 0.7))`,
                    }}
                  >
                    Enter {z.name}
                  </Link>
                </div>

                <div className={`grid grid-cols-3 gap-3 md:col-span-7 ${i % 2 ? "md:order-1" : ""}`}>
                  {items.map((o, j) => (
                    <motion.div
                      key={o.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: j * 0.1, ease }}
                    >
                      <Link to={`/object/${o.id}`} className="group flex flex-col rounded-2xl glass-card overflow-hidden p-1">
                        <div className="relative aspect-square rounded-xl bg-bg-deep/80 p-4 overflow-hidden">
                          <div
                            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: `radial-gradient(circle, rgba(${style.color}, 0.1), transparent 70%)` }}
                          />
                          <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-110">
                            <ObjectViz type={o.viz} />
                          </div>
                        </div>
                        <p className="px-3 py-3 text-sm font-medium text-ink group-hover:text-accent transition-colors">{o.name}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
