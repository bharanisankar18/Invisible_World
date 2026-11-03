import { Link } from "react-router-dom";
import ParticleField from "../components/ParticleField.jsx";
import ObjectViz from "../components/ObjectViz.jsx";
import { OBJECTS, ZONES, zoneNumber } from "../data/catalog.js";

const INSTRUMENTS = [
  {
    to: "/scale",
    label: "1 m → 1 Å",
    title: "Zoom into reality",
    desc: "One slider, five orders of teaching scale. The drawings swap as you pass each tick.",
  },
  {
    to: "/compare",
    label: "log₁₀ bars",
    title: "Hair to atom",
    desc: "Six objects on one logarithmic ruler. An atom is 800,000 times narrower than a hair.",
  },
  {
    to: "/3d",
    label: "WebGL",
    title: "3D specimens",
    desc: "Drag to turn a capsid, a helix or a neuron. Geometry is cartoon, not crystallography.",
  },
  {
    to: "/mystery",
    label: "4 choices",
    title: "Name the specimen",
    desc: "One drawing, one clue, four names. Your score stays for the session.",
  },
  {
    to: "/ask",
    label: "5 modes",
    title: "Ask the guide",
    desc: "Discover, connect, curiosity, challenge, simulate. Answers cite the on-site catalogue.",
  },
];

const ArrowRight = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function Landing() {
  return (
    <div>
      {/* ── Poster fold ───────────────────── */}
      <section className="relative overflow-hidden border-b border-line">
        <ParticleField />
        <div className="relative mx-auto flex min-h-[min(calc(100dvh-4rem),980px)] max-w-[1280px] flex-col px-4 md:px-8">
          <div className="flex flex-1 flex-col justify-center py-24">
            <p className="eyebrow">A scale model of the unseen</p>
            <h1 className="display h1 title-in mt-8 max-w-[14ch]">
              You see only <span className="text-accent">5%</span> of the story.
            </h1>
            <p className="mt-8 max-w-[46ch] text-lg text-muted md:text-xl">
              Twenty-five specimens from an 80 µm hair down to a 0.1 nm atom. Bacteria, DNA, magnetic fields,
              action potentials.
            </p>
            <div className="mt-12 flex flex-wrap gap-3">
              <Link to="/zones" className="btn-primary">
                Start exploring
              </Link>
              <Link to="/scale" className="btn-secondary">
                Zoom from 1 m to 1 Å
              </Link>
            </div>
          </div>

          {/* Credit line */}
          <dl className="grid grid-cols-2 gap-y-6 border-t border-line py-8 md:grid-cols-4">
            {[
              ["Specimens", OBJECTS.length],
              ["Zones", ZONES.length],
              ["Smallest", "~0.84 fm"],
              ["Largest", "~100 µm"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-2 font-mono text-xl tabular text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Feature stack: five zones ─────── */}
      <section className="mx-auto max-w-[1280px] px-4 py-24 md:px-8 md:py-36">
        <div className="grid gap-8 md:grid-cols-12">
          <h2 className="display text-[clamp(2.25rem,4vw,3.5rem)] md:col-span-6">Five kinds of invisible</h2>
          <p className="measure text-muted md:col-span-5 md:col-start-8 md:pt-3">
            Too small, too fast, or a field instead of an object. Each zone opens a set of dossiers: structure, typical
            size, facts, neighbours.
          </p>
        </div>

        <ol className="mt-16 border-t border-line">
          {ZONES.map((z) => {
            const items = OBJECTS.filter((o) => o.zone === z.id);
            const lead = items[0];
            return (
              <li key={z.id} className="border-b border-line">
                <Link
                  to={`/zone/${z.id}`}
                  className="group grid items-center gap-6 py-8 transition-colors duration-[260ms] hover:bg-surface active:bg-surface-2 md:grid-cols-12 md:px-4"
                >
                  <span className="font-mono text-sm tabular text-muted md:col-span-1">{zoneNumber(z.id)}</span>
                  <div className="md:col-span-5">
                    <h3 className="display text-[clamp(1.75rem,3vw,2.5rem)] transition-colors duration-[140ms] group-hover:text-accent">
                      {z.name}
                    </h3>
                    <p className="mt-2 text-muted">{z.lead}</p>
                  </div>
                  <p className="text-sm text-muted md:col-span-3">
                    {items
                      .slice(0, 4)
                      .map((o) => o.name)
                      .join(" · ")}
                  </p>
                  <span className="font-mono text-sm tabular text-accent md:col-span-2 md:text-right">{z.scale}</span>
                  <div className="hidden h-16 w-16 justify-self-end md:col-span-1 md:block">
                    {lead && <ObjectViz type={lead.viz} />}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ── Atom feature ──────────────────── */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 py-24 md:grid-cols-12 md:px-8 md:py-36">
          <figure className="md:col-span-5">
            <div className="aspect-square border border-line bg-bg p-12">
              <ObjectViz type="atom" />
            </div>
            <figcaption className="mt-4 illustrative">Illustrative · rings stand in for orbitals</figcaption>
          </figure>

          <div className="md:col-span-6 md:col-start-7">
            <p className="eyebrow">Correction</p>
            <h2 className="display mt-6 text-[clamp(2.25rem,4vw,3.5rem)]">
              Atoms are not miniature solar systems.
            </h2>
            <p className="measure mt-6 text-muted">
              Electrons occupy orbitals: probability clouds around a nucleus about 100,000 times smaller than the atom.
              The rings in every drawing here are a teaching shorthand. Each dossier marks what is established and what
              is simplified.
            </p>
            <Link to="/object/atom" className="text-link mt-8">
              Open the atom dossier <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Instruments ───────────────────── */}
      <section className="mx-auto max-w-[1280px] px-4 py-24 md:px-8 md:py-44">
        <h2 className="display text-[clamp(2.25rem,4vw,3.5rem)]">Instruments on this floor</h2>

        <ul className="mt-16 grid gap-px border border-line bg-line md:grid-cols-6">
          {INSTRUMENTS.map((inst, i) => (
            <li key={inst.to} className={i < 2 ? "md:col-span-3" : "md:col-span-2"}>
              <Link
                to={inst.to}
                className={`group flex h-full flex-col bg-bg p-8 transition-colors duration-[260ms] hover:bg-surface active:bg-surface-2 ${
                  i < 2 ? "md:min-h-[300px]" : "md:min-h-[260px]"
                }`}
              >
                <span className="font-mono text-xs tabular text-accent">{inst.label}</span>
                <h3 className={`mt-4 font-medium text-ink ${i < 2 ? "text-3xl" : "text-2xl"}`}>{inst.title}</h3>
                <p className="mt-3 max-w-[44ch] text-sm text-muted">{inst.desc}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm text-muted transition-colors duration-[140ms] group-hover:text-accent">
                  Open <ArrowRight />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
