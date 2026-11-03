import { Link } from "react-router-dom";
import { ZONES, OBJECTS, zoneNumber } from "../data/catalog.js";
import ObjectCard from "../components/ObjectCard.jsx";

export default function Zones() {
  return (
    <div>
      <header className="max-w-[60ch]">
        <p className="eyebrow">Exploration · {ZONES.length} zones</p>
        <h1 className="display h1 mt-6">Five zones</h1>
        <p className="mt-6 text-lg text-muted">
          Pick a kind of invisibility. Specimens inside each zone open a dossier: structure, typical size, facts and
          neighbours.
        </p>
      </header>

      <div className="mt-24 flex flex-col gap-36">
        {ZONES.map((z) => {
          const all = OBJECTS.filter((o) => o.zone === z.id);
          const items = all.slice(0, 3);
          return (
            <section key={z.id} aria-labelledby={`zone-${z.id}`} className="grid gap-10 border-t border-line pt-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <div className="flex items-baseline gap-4 font-mono text-sm tabular">
                  <span className="text-muted">{zoneNumber(z.id)}</span>
                  <span className="text-accent">{z.scale}</span>
                </div>
                <h2 id={`zone-${z.id}`} className="display mt-4 text-[clamp(2rem,4vw,3rem)]">
                  {z.name}
                </h2>
                <p className="mt-4 text-muted">{z.blurb}</p>
                <Link to={`/zone/${z.id}`} className="btn-secondary mt-8">
                  All {all.length} specimens
                </Link>
              </div>

              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:col-span-8">
                {items.map((o, j) => (
                  <li key={o.id} className={j === 2 ? "hidden sm:block" : ""}>
                    <ObjectCard object={o} compact />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
