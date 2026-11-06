import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getObject, getZone } from "../data/catalog.js";
import ObjectViz from "../components/ObjectViz.jsx";
import { useExplore } from "../context/ExploreContext.jsx";
import { sci } from "../lib/format.js";

/* Atomic specimens open in the atom lab, already set to the matching view. */
const LAB_LINKS = {
  atom: "/atom",
  electron: "/atom?view=clouds",
  proton: "/atom?view=nucleus",
  neutron: "/atom?view=nucleus",
};

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
      <div className="flex min-h-[50dvh] flex-col items-start justify-center">
        <h1 className="display text-5xl">Nothing called “{id}” here yet</h1>
        <p className="mt-4 text-muted">Try searching for it, or browse the five zones.</p>
        <Link to="/zones" className="btn-primary mt-8">
          Go to Explore
        </Link>
      </div>
    );
  }

  const zone = getZone(object.zone);
  const related = object.related.map(getObject).filter(Boolean);
  const lab = LAB_LINKS[object.id];

  return (
    <article className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <figure className="lg:sticky lg:top-28">
          <div className="stage aspect-square p-12">
            <ObjectViz type={object.viz} />
          </div>
          <figcaption className="mt-4 flex flex-col gap-1.5">
            <span className="illustrative">Simplified drawing</span>
            <span className="text-sm text-muted">
              Typical size <span className="text-ink">{object.sizeLabel}</span>
              {object.sizeMeters ? <span className="tabular">, about {sci(object.sizeMeters, 1)}</span> : null}
            </span>
          </figcaption>
        </figure>
      </div>

      <div className="lg:col-span-7">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link to={`/zone/${object.zone}`} className="inline-flex min-h-11 items-center hover:text-ink">
            {zone?.name}
          </Link>
        </nav>

        <h1 className="display mt-2 text-[clamp(2.75rem,1.6rem+4vw,5rem)]">{object.name}</h1>
        <p className="mt-3 text-xl text-muted">{object.subtitle}</p>
        <p className="measure mt-8 text-lg text-ink">{object.description}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to={lab || `/3d/${object.id}`} className="btn-primary">
            {lab ? "Open in the atom lab" : "Turn it in 3D"}
          </Link>
          <Link to={`/ask?about=${object.id}`} className="btn-secondary">
            Ask about {object.name.toLowerCase()}
          </Link>
        </div>

        <section className="mt-14">
          <h2 className="display text-[1.75rem]">How it’s built</h2>
          <p className="measure mt-4 text-muted">{object.structure}</p>
        </section>

        <section className="mt-12">
          <h2 className="display text-[1.75rem]">Worth knowing</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {object.facts.map((f) => (
              <li key={f} className="panel flex gap-4 px-5 py-4">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-electron" aria-hidden="true" />
                <span className="measure text-ink">{f}</span>
              </li>
            ))}
          </ul>
        </section>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="display text-[1.75rem]">Nearby</h2>
            <ul className="mt-4 border-t border-line">
              {related.map((r) => (
                <li key={r.id} className="border-b border-line">
                  <Link
                    to={`/object/${r.id}`}
                    className="group flex min-h-14 items-center justify-between gap-4 px-2 transition-colors duration-150 hover:bg-surface"
                  >
                    <span className="font-bold group-hover:text-electron">{r.name}</span>
                    <span className="text-sm text-muted tabular">{r.sizeLabel}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
