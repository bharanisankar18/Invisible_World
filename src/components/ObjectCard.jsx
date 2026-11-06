import { Link } from "react-router-dom";
import ObjectViz from "./ObjectViz.jsx";
import { getZone } from "../data/catalog.js";

/**
 * Specimen tile. `compact` drops the subtitle for dense grids.
 * `to` overrides the destination (used for the hair reference on /scale).
 */
export default function ObjectCard({ object, compact = false, to }) {
  const zone = getZone(object.zone);

  return (
    <Link to={to || `/object/${object.id}`} className="panel-link group flex h-full flex-col p-2.5">
      <div className="stage aspect-[4/3] w-full rounded-[16px] p-8">
        <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.06]">
          <ObjectViz type={object.viz} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-4">
        <h3 className="display text-[1.4rem] leading-tight">{object.name}</h3>
        {!compact && object.subtitle && <p className="text-[15px] text-muted">{object.subtitle}</p>}
        <p className="mt-auto flex items-baseline justify-between gap-3 pt-3 text-sm">
          <span className="font-bold text-electron tabular">{object.sizeLabel}</span>
          {zone && !compact && <span className="text-muted">{zone.name}</span>}
        </p>
      </div>
    </Link>
  );
}
