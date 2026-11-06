import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getZone, OBJECTS } from "../data/catalog.js";
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
        <h1 className="display text-5xl">There’s no zone called “{zoneId}”</h1>
        <p className="mt-4 text-muted">It may have been renamed. All five zones are listed on the Explore page.</p>
        <Link to="/zones" className="btn-primary mt-8">
          Go to Explore
        </Link>
      </div>
    );
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link to="/zones" className="inline-flex min-h-11 items-center hover:text-ink">
          Explore
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="text-ink">{zone.name}</span>
      </nav>

      <header className="mt-4 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <h1 className="display h1">{zone.name}</h1>
          <p className="mt-6 max-w-[56ch] text-xl text-muted">{zone.blurb}</p>
        </div>
        <dl className="flex gap-10 self-end md:col-span-3 md:col-start-10 md:justify-end">
          <div>
            <dt className="text-sm text-muted">Scale</dt>
            <dd className="display mt-1 text-3xl text-electron tabular">{zone.scale}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Things to see</dt>
            <dd className="display mt-1 text-3xl tabular">{items.length}</dd>
          </div>
        </dl>
      </header>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((o) => (
          <li key={o.id}>
            <ObjectCard object={o} />
          </li>
        ))}
      </ul>

      <div className="mt-14 flex flex-wrap items-center gap-6">
        <Link to="/zones" className="btn-secondary">
          Back to Explore
        </Link>
        <Link to="/ask" className="text-link">
          Ask the guide about the {zone.name.toLowerCase()}
        </Link>
      </div>
    </div>
  );
}
