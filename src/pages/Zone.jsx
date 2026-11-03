import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getZone, OBJECTS, zoneNumber } from "../data/catalog.js";
import ObjectCard from "../components/ObjectCard.jsx";
import { useExplore } from "../context/ExploreContext.jsx";

export default function Zone() {
  const { zoneId } = useParams();
  const zone = getZone(zoneId);
  const { setZoneId, record } = useExplore();
  const items = OBJECTS.filter((o) => o.zone === zoneId);

  useEffect(() => {
    if (zone) {
      setZoneId(zone.id);
      record({ type: "zone", id: zone.id, name: zone.name });
    }
  }, [zone, setZoneId, record]);

  if (!zone) {
    return (
      <div className="flex min-h-[50dvh] flex-col items-start justify-center">
        <p className="eyebrow">404 · /zone/{zoneId}</p>
        <h1 className="display mt-4 text-5xl">No zone by that name</h1>
        <Link to="/zones" className="btn-primary mt-8">
          Back to the five zones
        </Link>
      </div>
    );
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
        <Link to="/zones" className="inline-flex min-h-11 items-center hover:text-ink">
          Zones
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{zoneNumber(zone.id)}</span>
      </nav>

      <header className="mt-4 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <h1 className="display h1">{zone.name}</h1>
          <p className="mt-6 max-w-[56ch] text-lg text-muted">{zone.blurb}</p>
        </div>
        <dl className="flex gap-10 self-end md:col-span-4 md:col-start-9 md:justify-end">
          <div>
            <dt className="eyebrow">Scale</dt>
            <dd className="mt-2 font-mono text-2xl tabular text-accent">{zone.scale}</dd>
          </div>
          <div>
            <dt className="eyebrow">Specimens</dt>
            <dd className="mt-2 font-mono text-2xl tabular">{items.length}</dd>
          </div>
        </dl>
      </header>

      <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((o) => (
          <li key={o.id}>
            <ObjectCard object={o} />
          </li>
        ))}
      </ul>

      <div className="mt-16 flex flex-wrap items-center gap-6">
        <Link to="/zones" className="btn-secondary">
          ← All zones
        </Link>
        <Link to="/ask" className="text-link">
          Ask the guide about {zone.name}
        </Link>
      </div>
    </div>
  );
}
