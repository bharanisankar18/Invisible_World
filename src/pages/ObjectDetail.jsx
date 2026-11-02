import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { getObject, getZone } from "../data/catalog.js";
import ObjectViz from "../components/ObjectViz.jsx";
import { useExplore } from "../context/ExploreContext.jsx";

const ease = [0.16, 1, 0.3, 1];

export default function ObjectDetail() {
  const { id } = useParams();
  const object = getObject(id);
  const { setSelectedId, setZoneId, record } = useExplore();

  useEffect(() => {
    if (object) {
      setSelectedId(object.id);
      setZoneId(object.zone);
      record({ type: "object", id: object.id, name: object.name });
    }
  }, [object, setSelectedId, setZoneId, record]);

  if (!object) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50dvh] text-center">
        <h1 className="display text-4xl">Object not in the catalogue</h1>
        <Link to="/zones" className="btn-primary mt-8">
          Return to zones
        </Link>
      </div>
    );
  }

  const zone = getZone(object.zone);

  return (
    <article className="grid gap-12 lg:grid-cols-12">
      {/* Viz column */}
      <motion.div
        className="lg:col-span-5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="sticky top-28">
          <div className="relative aspect-square rounded-3xl glass overflow-hidden p-10">
            <div className="absolute inset-0 opacity-20" style={{
              background: "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15), transparent 70%)",
            }} />
            <div className="relative h-full w-full">
              <ObjectViz type={object.viz} />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted/60">
            Schematic only. Typical size {object.sizeLabel}
            {object.sizeMeters ? ` (${object.sizeMeters.toExponential(1)} m)` : ""}.
          </p>
        </div>
      </motion.div>

      {/* Info column */}
      <motion.div
        className="lg:col-span-7"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease }}
      >
        <div className="flex items-center gap-2">
          <Link to={`/zone/${object.zone}`} className="font-mono text-[11px] tracking-[0.08em] text-accent/60 uppercase hover:text-accent transition-colors">
            {zone?.name}
          </Link>
          <span className="text-muted/30">·</span>
          <span className="font-mono text-[11px] tracking-[0.08em] text-muted/60 uppercase">{object.sizeLabel}</span>
        </div>

        <h1 className="display mt-4 text-[clamp(2.5rem,5vw+1rem,4rem)]">
          {object.name}
        </h1>
        <p className="mt-2 text-xl text-accent/70">{object.subtitle}</p>
        <p className="mt-6 max-w-[62ch] text-muted leading-relaxed">{object.description}</p>

        {/* Structure */}
        <div className="mt-10 rounded-2xl glass-card p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <span className="text-accent/60">◆</span> Structure
          </h2>
          <p className="mt-3 max-w-[62ch] text-muted leading-relaxed">{object.structure}</p>
        </div>

        {/* Facts */}
        <div className="mt-8 rounded-2xl glass-card p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <span className="text-accent/60">✦</span> Facts
          </h2>
          <ul className="mt-4 space-y-3">
            {object.facts.map((f, i) => (
              <li key={f} className="flex gap-3 text-muted leading-relaxed">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent">
                  {i + 1}
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to={`/3d/${object.id}`} className="btn-primary">
            Inspect in 3D
          </Link>
          <Link to={`/ask?about=${object.id}`} className="btn-secondary">
            Ask about this
          </Link>
        </div>

        {/* Related */}
        <div className="mt-14">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <span className="text-accent/60">⇔</span> Related
          </h2>
          <ul className="mt-4 flex flex-col gap-1">
            {object.related.map((rid) => {
              const r = getObject(rid);
              if (!r) return null;
              return (
                <li key={rid}>
                  <Link
                    to={`/object/${rid}`}
                    className="group flex min-h-14 items-center justify-between rounded-xl px-4 py-2 transition-all duration-200 hover:bg-white/[0.03]"
                  >
                    <span className="text-ink group-hover:text-accent transition-colors">{r.name}</span>
                    <span className="font-mono text-xs text-muted/60">{r.sizeLabel}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>
    </article>
  );
}
