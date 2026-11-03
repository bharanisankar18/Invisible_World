import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getObject, getZone, zoneNumber } from "../data/catalog.js";
import ObjectViz from "../components/ObjectViz.jsx";
import { useExplore } from "../context/ExploreContext.jsx";
import { sci } from "../lib/format.js";

const formatMeters = (m) => sci(m, 1);

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
        <p className="eyebrow">404 · /object/{id}</p>
        <h1 className="display mt-4 text-5xl">Not in the catalogue</h1>
        <Link to="/zones" className="btn-primary mt-8">
          Back to the five zones
        </Link>
      </div>
    );
  }

  const zone = getZone(object.zone);
  const related = object.related.map(getObject).filter(Boolean);

  return (
    <article className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <figure className="lg:sticky lg:top-24">
          <div className="aspect-square border border-line bg-surface p-10">
            <ObjectViz type={object.viz} />
          </div>
          <figcaption className="mt-4 flex flex-col gap-2">
            <span className="illustrative">Illustrative schematic</span>
            <span className="text-sm text-muted">
              Typical size {object.sizeLabel}
              {object.sizeMeters ? <span className="font-mono tabular"> · {formatMeters(object.sizeMeters)}</span> : null}
            </span>
          </figcaption>
        </figure>
      </div>

      <div className="lg:col-span-7">
        <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
          <Link to={`/zone/${object.zone}`} className="inline-flex min-h-11 items-center hover:text-ink">
            {zoneNumber(object.zone)} {zone?.name}
          </Link>
        </nav>

        <h1 className="display mt-2 text-[clamp(2.5rem,5vw+1rem,4.5rem)]">{object.name}</h1>
        <p className="mt-3 text-xl text-muted">{object.subtitle}</p>
        <p className="measure mt-8 text-ink">{object.description}</p>

        <dl className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2">
          <div className="bg-bg p-6">
            <dt className="eyebrow">Typical size</dt>
            <dd className="mt-2 font-mono text-xl tabular text-accent">{object.sizeLabel}</dd>
          </div>
          <div className="bg-bg p-6">
            <dt className="eyebrow">Zone</dt>
            <dd className="mt-2 text-xl">{zone?.name}</dd>
          </div>
        </dl>

        <section className="mt-12">
          <h2 className="text-2xl font-medium">Structure</h2>
          <p className="measure mt-4 text-muted">{object.structure}</p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-medium">Facts</h2>
          <ol className="mt-4 border-t border-line">
            {object.facts.map((f, i) => (
              <li key={f} className="flex gap-6 border-b border-line py-4 text-muted">
                <span className="font-mono text-sm tabular text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="measure">{f}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link to={`/3d/${object.id}`} className="btn-primary">
            Inspect in 3D
          </Link>
          <Link to={`/ask?about=${object.id}`} className="btn-secondary">
            Ask about {object.name.toLowerCase()}
          </Link>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-medium">Neighbours</h2>
            <ul className="mt-4 border-t border-line">
              {related.map((r) => (
                <li key={r.id} className="border-b border-line">
                  <Link
                    to={`/object/${r.id}`}
                    className="group flex min-h-14 items-center justify-between gap-4 px-2 transition-colors duration-[140ms] hover:bg-surface active:bg-surface-2"
                  >
                    <span className="group-hover:text-accent">{r.name}</span>
                    <span className="font-mono text-xs tabular text-muted">{r.sizeLabel}</span>
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
