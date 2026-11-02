import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { getZone, OBJECTS } from "../data/catalog.js";
import ObjectCard from "../components/ObjectCard.jsx";
import { useExplore } from "../context/ExploreContext.jsx";

const ZONE_STYLES = {
  micro: { emoji: "🔬", color: "56, 189, 248" },
  atomic: { emoji: "⚛️", color: "129, 140, 248" },
  biological: { emoji: "🧬", color: "167, 139, 250" },
  forces: { emoji: "⚡", color: "251, 191, 36" },
  neural: { emoji: "🧠", color: "52, 211, 153" },
};

const ease = [0.16, 1, 0.3, 1];

export default function Zone() {
  const { zoneId } = useParams();
  const zone = getZone(zoneId);
  const { setZoneId, record } = useExplore();
  const items = OBJECTS.filter((o) => o.zone === zoneId);
  const style = ZONE_STYLES[zoneId] || ZONE_STYLES.micro;

  useEffect(() => {
    if (zone) {
      setZoneId(zone.id);
      record({ type: "zone", id: zone.id, name: zone.name });
    }
  }, [zone, setZoneId, record]);

  if (!zone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50dvh] text-center">
        <h1 className="display text-4xl">Zone not found</h1>
        <Link to="/zones" className="btn-primary mt-8">
          Back to zones
        </Link>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{style.emoji}</span>
          <span
            className="font-mono text-[11px] tracking-[0.1em] uppercase"
            style={{ color: `rgba(${style.color}, 0.7)` }}
          >
            {zone.scale}
          </span>
        </div>
        <h1 className="display mt-4 text-[clamp(2.5rem,5vw+1rem,4.5rem)]">
          {zone.name}
        </h1>
        <p className="mt-4 max-w-[56ch] text-lg text-muted leading-relaxed">{zone.blurb}</p>

        <div
          className="mt-6 h-1 w-24 rounded-full"
          style={{ background: `linear-gradient(90deg, rgba(${style.color}, 0.6), transparent)` }}
        />
      </motion.div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((o, i) => (
          <ObjectCard key={o.id} object={o} index={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-16 flex items-center gap-4"
      >
        <Link to="/zones" className="btn-secondary text-sm">
          ← All zones
        </Link>
        <Link to="/ask" className="text-sm text-accent/70 hover:text-accent transition-colors">
          Ask about this zone →
        </Link>
      </motion.div>
    </div>
  );
}
