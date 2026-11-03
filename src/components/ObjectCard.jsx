import { Link } from "react-router-dom";
import ObjectViz from "./ObjectViz.jsx";
import { getZone, zoneNumber } from "../data/catalog.js";

/**
 * Specimen tile. `compact` drops the subtitle for dense grids.
 * `to` overrides the destination (used for the hair reference on /scale).
 */
export default function ObjectCard({ object, compact = false, to }) {
  const zone = getZone(object.zone);

  return (
    <Link
      to={to || `/object/${object.id}`}
      className="panel-link group flex h-full flex-col border border-transparent focus-visible:border-accent"
    >
      <div className="aspect-square w-full border-b border-line p-8">
        <ObjectViz type={object.viz} />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-xs tabular text-accent">{object.sizeLabel}</span>
          {zone && (
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              {zoneNumber(zone.id)} {zone.name.replace(" World", "")}
            </span>
          )}
        </div>
        <h3 className="mt-1 text-lg font-medium text-ink">{object.name}</h3>
        {!compact && object.subtitle && <p className="text-sm text-muted">{object.subtitle}</p>}
      </div>
    </Link>
  );
}
