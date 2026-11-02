import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ObjectViz from "./ObjectViz.jsx";

const ZONE_COLORS = {
  micro: { accent: "56, 189, 248", label: "Micro" },
  atomic: { accent: "129, 140, 248", label: "Atomic" },
  biological: { accent: "167, 139, 250", label: "Bio" },
  forces: { accent: "251, 191, 36", label: "Forces" },
  neural: { accent: "52, 211, 153", label: "Neural" },
};

export default function ObjectCard({ object, index = 0 }) {
  const zone = ZONE_COLORS[object.zone] || ZONE_COLORS.micro;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/object/${object.id}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl glass-card p-1"
      >
        {/* Viz area */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-bg-deep/80 p-6">
          {/* Ambient glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(${zone.accent}, 0.12), transparent 70%)`,
            }}
          />
          <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-110">
            <ObjectViz type={object.viz} />
          </div>
          {/* Zone badge */}
          <span
            className="absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
            style={{
              background: `rgba(${zone.accent}, 0.12)`,
              color: `rgba(${zone.accent}, 0.9)`,
              border: `1px solid rgba(${zone.accent}, 0.2)`,
            }}
          >
            {zone.label}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 px-4 py-4">
          <span className="font-mono text-[10px] tracking-[0.1em] text-accent/60 uppercase">
            {object.sizeLabel}
          </span>
          <h3 className="text-lg font-semibold text-ink transition-colors group-hover:text-accent">
            {object.name}
          </h3>
          <p className="text-sm text-muted/80 line-clamp-2">{object.subtitle}</p>
        </div>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>
    </motion.div>
  );
}
