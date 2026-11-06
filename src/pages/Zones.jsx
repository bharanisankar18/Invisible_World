import { Link } from "react-router-dom";
import { ZONES, OBJECTS } from "../data/catalog.js";
import ObjectCard from "../components/ObjectCard.jsx";

export default function Zones() {
  return (
    <div>
      <header className="max-w-[60ch]">
        <h1 className="display h1">Explore</h1>
        <p className="mt-6 text-xl text-muted">
          Five kinds of invisible. Open any one to see what lives there, how big it is, and how it works.
        </p>
      </header>

      <div className="mt-20 flex flex-col gap-24">
        {ZONES.map((z) => {
          const all = OBJECTS.filter((o) => o.zone === z.id);
          const items = all.slice(0, 3);
          return (
            <section key={z.id} aria-labelledby={`zone-${z.id}`} className="grid gap-10 border-t border-line pt-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="text-sm font-bold text-electron tabular">{z.scale}</p>
                <h2 id={`zone-${z.id}`} className="display mt-3 text-[clamp(2rem,1.3rem+2.4vw,3.1rem)]">
                  {z.name}
                </h2>
                <p className="mt-4 text-muted">{z.blurb}</p>
                <Link to={`/zone/${z.id}`} className="btn-secondary mt-8">
                  See all {all.length}
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
