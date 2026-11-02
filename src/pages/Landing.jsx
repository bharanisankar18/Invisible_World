import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import ParticleField from "../components/ParticleField.jsx";
import ObjectViz from "../components/ObjectViz.jsx";
import { ZONES } from "../data/catalog.js";

const ease = [0.16, 1, 0.3, 1];

const ZONE_ICONS = {
  micro: { emoji: "🔬", color: "56, 189, 248" },
  atomic: { emoji: "⚛️", color: "129, 140, 248" },
  biological: { emoji: "🧬", color: "167, 139, 250" },
  forces: { emoji: "⚡", color: "251, 191, 36" },
  neural: { emoji: "🧠", color: "52, 211, 153" },
};

const INSTRUMENTS = [
  {
    to: "/scale",
    label: "1 m → 1 Å",
    title: "Zoom into reality",
    desc: "Slide from a stride to an ångström. Watch the world change at every scale.",
    icon: "🔎",
    span: "md:col-span-7",
    tall: true,
  },
  {
    to: "/mystery",
    label: "Game",
    title: "Mystery explorer",
    desc: "Four names. One specimen. Can you identify it?",
    icon: "❓",
    span: "md:col-span-5",
  },
  {
    to: "/3d",
    label: "WebGL",
    title: "3D Explorer",
    desc: "Rotate, zoom and inspect scientific objects in three dimensions.",
    icon: "🧊",
    span: "md:col-span-5",
  },
  {
    to: "/ask",
    label: "AI Guide",
    title: "Ask the Invisible",
    desc: "An intelligent science guide with five exploration tools.",
    icon: "✨",
    span: "md:col-span-7",
  },
];

export default function Landing() {
  const reduce = useReducedMotion();

  return (
    <div className="bg-bg-deep">
      {/* ── Hero ─────────────────────────── */}
      <section className="relative min-h-[100dvh] overflow-hidden">
        <ParticleField />

        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-deep" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-animated" />

        {/* Floating orbital rings */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-[0.04]">
          <div className="absolute inset-0 rounded-full border border-accent animate-orbit" />
          <div className="absolute inset-8 rounded-full border border-accent-2" style={{ animation: "orbit 30s linear infinite reverse" }} />
          <div className="absolute inset-16 rounded-full border border-accent-3 animate-orbit" style={{ animationDuration: "40s" }} />
        </div>

        <div className="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-center px-6 md:px-12">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-accent/80">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
              Explore the unseen universe
            </span>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.8, delay: 0.15, ease }}
            className="display mt-8 max-w-[16ch] text-[clamp(3rem,7vw+1rem,7rem)]"
          >
            <span className="text-ink">You see only </span>
            <span className="gradient-text">5%</span>
            <span className="text-ink"> of the story.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, delay: 0.35, ease }}
            className="mt-8 max-w-[42ch] text-lg md:text-xl text-muted leading-relaxed"
          >
            Explore the microscopic, molecular and invisible forces that shape our reality.
          </motion.p>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.5, ease }}
            className="mt-3 max-w-[50ch] text-sm text-muted/60"
          >
            Visible matter is a few percent of the cosmos — and your eye misses almost all of biology and physics.
            This is a guided scale model, not a live microscope.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.6, delay: 0.55, ease }}
            className="mt-12 flex flex-wrap gap-4"
          >
            <Link to="/zones" className="btn-primary">
              Start exploring
            </Link>
            <Link to="/scale" className="btn-secondary">
              Zoom into reality
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[11px] tracking-widest uppercase text-muted/40">Scroll</span>
            <div className="h-8 w-px bg-gradient-to-b from-accent/30 to-transparent animate-pulse" />
          </motion.div>
        </div>
      </section>

      {/* ── Five Zones ─────────────────── */}
      <section className="relative">
        <div className="section-divider" />
        <div className="grid-pattern">
          <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-12 md:py-40">
            <div className="grid gap-16 md:grid-cols-12">
              <div className="md:col-span-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease }}
                >
                  <h2 className="display text-[clamp(2.5rem,4vw,3.5rem)]">
                    Five zones of the{" "}
                    <span className="gradient-text">unseen</span>
                  </h2>
                  <p className="mt-6 text-muted leading-relaxed">
                    Each zone is a different scale or kind of invisibility: too small, too fast, or a field instead of an object.
                  </p>
                </motion.div>
              </div>

              <div className="flex flex-col gap-2 md:col-span-8">
                {ZONES.map((z, i) => {
                  const zoneStyle = ZONE_ICONS[z.id] || ZONE_ICONS.micro;
                  return (
                    <motion.div
                      key={z.id}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.08, ease }}
                    >
                      <Link
                        to={`/zone/${z.id}`}
                        className="group relative flex items-center gap-5 rounded-2xl p-5 transition-all duration-300 hover:bg-white/[0.03]"
                        style={{
                          borderLeft: `2px solid rgba(${zoneStyle.color}, 0.3)`,
                        }}
                      >
                        <span className="text-2xl">{zoneStyle.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-3">
                            <h3 className="text-xl font-semibold text-ink group-hover:text-accent transition-colors">
                              {z.name}
                            </h3>
                            <span className="shrink-0 font-mono text-xs text-accent/60">{z.scale}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted/80 line-clamp-1">{z.lead}</p>
                        </div>
                        <svg className="w-5 h-5 text-muted/30 shrink-0 transition-all group-hover:text-accent group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Atom Feature ───────────────── */}
      <section className="relative">
        <div className="section-divider" />
        <div className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 py-28 md:grid-cols-2 md:px-12 md:py-36">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl glass overflow-hidden p-10 relative">
              {/* Animated glow ring */}
              <div className="absolute inset-0 rounded-3xl opacity-30" style={{
                background: "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15), transparent 70%)",
              }} />
              <div className="relative h-full w-full">
                <ObjectViz type="atom" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            <span className="inline-block font-mono text-xs tracking-wider text-accent/60 uppercase">Did you know?</span>
            <h2 className="display mt-4 text-[clamp(2.2rem,4vw,3.2rem)]">
              Atoms are{" "}
              <span className="gradient-text">not</span>{" "}
              miniature solar systems
            </h2>
            <p className="mt-6 max-w-[48ch] text-muted leading-relaxed">
              The landing sketches — cells, nuclei, waves — are teaching diagrams. Electrons occupy orbitals, not circular tracks. Click any object later to read structure, typical size, and what is established versus simplified.
            </p>
            <Link to="/object/atom" className="mt-8 inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-300">
              Open the atom dossier
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Instruments ────────────────── */}
      <section className="relative">
        <div className="section-divider" />
        <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-12 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
          >
            <h2 className="display text-[clamp(2.5rem,4vw,3.5rem)]">
              Instruments on this{" "}
              <span className="gradient-text">floor</span>
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-4 md:grid-cols-12">
            {INSTRUMENTS.map((inst, i) => (
              <motion.div
                key={inst.to}
                className={inst.span}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease }}
              >
                <Link
                  to={inst.to}
                  className={`group relative flex flex-col rounded-2xl glass-card p-8 transition-all duration-300 overflow-hidden ${
                    inst.tall ? "md:min-h-[300px]" : ""
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="text-3xl mb-4">{inst.icon}</span>
                  <span className="font-mono text-[10px] tracking-wider text-accent/60 uppercase">{inst.label}</span>
                  <h3 className="mt-2 text-2xl font-semibold text-ink group-hover:text-accent transition-colors">
                    {inst.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-sm text-muted/80 leading-relaxed">{inst.desc}</p>
                  <div className="mt-auto pt-6 flex items-center gap-2 text-sm text-accent/60 group-hover:text-accent transition-colors">
                    Explore
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center text-sm text-muted/50 italic"
          >
            The world is bigger than what your eyes can see.
          </motion.p>
        </div>
      </section>

      {/* ── Footer ─────────────────────── */}
      <footer className="relative">
        <div className="section-divider" />
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <span className="display tracking-[0.15em] text-sm uppercase gradient-text">InvisibleWorld</span>
            <p className="mt-2 text-sm text-muted/60">The world is bigger than what your eyes can see.</p>
          </div>
          <span className="text-xs text-muted/40">Cartoons and typical sizes · not clinical or laboratory measurements</span>
        </div>
      </footer>
    </div>
  );
}
