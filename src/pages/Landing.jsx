import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import ChamberField from "../components/ChamberField.jsx";
import ObjectViz from "../components/ObjectViz.jsx";
import { OBJECTS, ZONES } from "../data/catalog.js";
import { getElement } from "../data/elements.js";

// three.js is heavy; the preview loads only when it scrolls near the screen.
const AtomStage = lazy(() => import("../components/atom/AtomStage.jsx"));

/* Real objects, biggest to smallest, with how much smaller each is than the one before. */
const LADDER = [
  { name: "Human hair", size: "80 µm wide", viz: "hair-ref", to: "/compare" },
  { name: "Red blood cell", size: "8 µm", viz: "blood", to: "/object/blood-cell", step: "10×" },
  { name: "Bacterium", size: "2 µm", viz: "bacteria", to: "/object/bacteria", step: "4×" },
  { name: "Virus", size: "100 nm", viz: "virus", to: "/object/virus", step: "20×" },
  { name: "DNA strand", size: "2 nm wide", viz: "dna", to: "/object/dna", step: "50×" },
  { name: "Atom", size: "0.1 nm", viz: "atom", to: "/atom", step: "20×" },
  { name: "Nucleus", size: "0.00001 nm", viz: "nucleus", to: "/atom?view=nucleus", step: "10,000×" },
];

const PREVIEWS = [6, 10, 26];

function useNearScreen(margin = "200px") {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, near, onScreen];
}

function Hero() {
  const fire = useRef(null);
  const onPointerDown = (e) => {
    if (e.target.closest("a, button") || !fire.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    fire.current(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <section
      className="relative isolate cursor-crosshair overflow-hidden"
      onPointerDown={onPointerDown}
      style={{ background: "radial-gradient(ellipse 70% 80% at 78% 38%, #1a3290 0%, #10215e 42%, #0d1b4c 75%)" }}
    >
      <ChamberField fireRef={fire} />
      <div className="relative mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-[1360px] flex-col justify-end px-4 pb-10 pt-28 md:px-8 md:pb-14">
        <h1 className="display text-[clamp(2.7rem,0.9rem+6.3vw,6.6rem)] leading-[0.95]">
          <span className="widen">Everything you see</span>
          <span className="widen">is made of things</span>
          <span className="widen">you can’t.</span>
        </h1>

        <div className="fade-up mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="max-w-[46ch] text-lg text-muted md:text-xl">
              Atoms, cells, DNA and the fields around you are too small or too fast for your eyes. Here you can zoom down
              to them, turn them in 3D, and build an atom of your own.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/atom" className="btn-primary">
                Build an atom
              </Link>
              <Link to="/scale" className="btn-secondary">
                Zoom from a hair to an atom
              </Link>
            </div>
          </div>

          <div className="max-w-[36ch] text-sm text-muted">
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-2">
                <span className="h-[3px] w-5 rounded-full bg-electron" /> negative
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-[3px] w-5 rounded-full bg-proton" /> positive
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-[3px] w-5 rounded-full bg-neutron/80" /> fast muon
              </span>
            </p>
            <p className="mt-2">
              These are simulated cloud-chamber tracks. A magnet bends charged particles, so the way a track curls tells
              you its charge. Tap anywhere to fire one.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ladder() {
  return (
    <section className="mx-auto max-w-[1360px] px-4 py-24 md:px-8 md:py-32" aria-labelledby="ladder-heading">
      <div className="grid gap-6 md:grid-cols-12">
        <h2 id="ladder-heading" className="display text-[clamp(2.25rem,1.4rem+3vw,4rem)] md:col-span-6">
          How small is small?
        </h2>
        <p className="max-w-[52ch] text-lg text-muted md:col-span-5 md:col-start-8 md:pt-3">
          Seven real things, each smaller than the one before. Watch the jumps: the last one is the biggest of all.
        </p>
      </div>

      <ol className="mt-14 grid gap-3 md:grid-cols-7 md:gap-5">
        {LADDER.map((item, i) => (
          <li key={item.name} className="relative">
            {item.step && (
              <p className="mb-3 flex items-center gap-2 text-sm text-muted md:absolute md:-left-2.5 md:-top-9 md:mb-0 md:-translate-x-1/2 md:whitespace-nowrap">
                <span className={`font-bold ${i === LADDER.length - 1 ? "text-electron" : "text-ink"}`}>{item.step}</span>
                smaller
              </p>
            )}
            <Link
              to={item.to}
              className="group flex items-center gap-5 rounded-[22px] bg-surface p-3 transition-colors duration-200 hover:bg-surface-2 md:flex-col md:items-stretch md:gap-0 md:p-0 md:pb-4"
            >
              <div className="stage aspect-square w-20 shrink-0 p-3 transition-transform duration-300 group-hover:scale-[1.03] md:w-full md:rounded-[22px] md:p-6">
                <ObjectViz type={item.viz} />
              </div>
              <div className="md:px-4 md:pt-4">
                <h3 className="font-bold text-ink">{item.name}</h3>
                <p className="text-sm text-muted tabular">{item.size}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-muted">
        Sizes are typical values.{" "}
        <Link to="/compare" className="text-link">
          See them on one ruler
        </Link>
      </p>
    </section>
  );
}

function AtomTeaser() {
  const reduce = useReducedMotion();
  const [ref, near, onScreen] = useNearScreen();
  const [z, setZ] = useState(6);
  const el = getElement(z);

  return (
    <section className="border-y border-line bg-[#0a1640]" aria-labelledby="lab-heading">
      <div className="mx-auto grid max-w-[1360px] items-center gap-10 px-4 py-24 md:px-8 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="lab-heading" className="display text-[clamp(2.25rem,1.4rem+3vw,4rem)]">
            Build an atom, then look inside it.
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg text-muted">
            Pick any of the first 36 elements. Add neutrons to make an isotope, or pull electrons off to make an ion. Then
            see it three ways: as textbook shells, as real electron clouds, and as a close-up of its nucleus.
          </p>
          <Link to={`/atom?z=${z}&view=clouds`} className="btn-primary mt-9">
            Open {el.name.toLowerCase()} in the atom lab
          </Link>
        </div>

        <div className="lg:col-span-7">
          <div ref={ref} className="stage relative aspect-[4/3] overflow-hidden">
            {near && (
              <Suspense fallback={null}>
                <AtomStage
                  z={z}
                  neutrons={el.common}
                  electrons={z}
                  view="clouds"
                  interactive={false}
                  labels={false}
                  paused={!onScreen}
                  reduce={reduce}
                />
              </Suspense>
            )}
            <p className="pointer-events-none absolute bottom-4 left-5 text-sm text-muted">
              {el.name}’s electron clouds. Each dot is a place an electron could be.
            </p>
          </div>
          <div className="mt-4 inline-flex flex-wrap items-center gap-1 rounded-full bg-surface p-1" role="group" aria-label="Preview element">
            {PREVIEWS.map((pz) => {
              const p = getElement(pz);
              return (
                <button key={pz} type="button" aria-pressed={z === pz} onClick={() => setZ(pz)} className="seg-btn">
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Zones() {
  return (
    <section className="mx-auto max-w-[1360px] px-4 py-24 md:px-8 md:py-32" aria-labelledby="zones-heading">
      <div className="grid gap-6 md:grid-cols-12">
        <h2 id="zones-heading" className="display text-[clamp(2.25rem,1.4rem+3vw,4rem)] md:col-span-6">
          Five places to explore
        </h2>
        <p className="max-w-[52ch] text-lg text-muted md:col-span-5 md:col-start-8 md:pt-3">
          Some things are invisible because they are tiny. Others are fields you can feel but never see, or signals too
          fast to notice.
        </p>
      </div>

      <ul className="mt-12 border-t border-line">
        {ZONES.map((zone) => {
          const items = OBJECTS.filter((o) => o.zone === zone.id);
          const lead = items[0];
          return (
            <li key={zone.id} className="border-b border-line">
              <Link
                to={`/zone/${zone.id}`}
                className="group grid items-center gap-x-6 gap-y-2 py-7 transition-colors duration-200 hover:bg-surface/60 md:grid-cols-12 md:px-4"
              >
                <h3 className="display text-[clamp(1.9rem,1.1rem+2.4vw,3.1rem)] transition-colors duration-200 group-hover:text-electron md:col-span-5">
                  {zone.name}
                </h3>
                <p className="text-muted md:col-span-4">{zone.lead}</p>
                <p className="text-sm text-muted md:col-span-2">
                  <span className="text-ink tabular">{items.length}</span> things to see
                </p>
                <div className="hidden h-16 w-16 justify-self-end transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 md:col-span-1 md:block">
                  {lead && <ObjectViz type={lead.viz} />}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function Landing() {
  return (
    <>
      <Hero />
      <Ladder />
      <AtomTeaser />
      <Zones />
    </>
  );
}
