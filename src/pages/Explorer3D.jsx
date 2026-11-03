import { Link, useNavigate, useParams } from "react-router-dom";
import { OBJECTS, ZONES, getObject } from "../data/catalog.js";
import Scene3D from "../components/Scene3D.jsx";

const FEATURED = ["atom", "dna", "neuron", "virus", "human-cell", "magnetism"];

export default function Explorer3D() {
  const { id } = useParams();
  const navigate = useNavigate();
  const object = getObject(id) || getObject("atom");

  return (
    <div>
      <header className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="eyebrow">3D explorer</p>
          <h1 className="display mt-6 text-[clamp(2.5rem,4vw+1rem,4rem)]">{object.name}</h1>
          <p className="mt-4 max-w-[54ch] text-muted">
            Drag to rotate, scroll to zoom. Teaching geometry, not crystallography. Labels mark cartoon parts.
          </p>
        </div>
        <div className="self-end md:col-span-4 md:col-start-9">
          <label className="eyebrow" htmlFor="obj-select">
            Specimen
          </label>
          <div className="relative mt-2">
            <select
              id="obj-select"
              className="field cursor-pointer appearance-none pr-10"
              value={object.id}
              onChange={(e) => navigate(`/3d/${e.target.value}`)}
            >
              {ZONES.map((z) => (
                <optgroup key={z.id} label={z.name}>
                  {OBJECTS.filter((o) => o.zone === z.id).map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </header>

      <figure className="mt-10 border border-line">
        <Scene3D object={object} />
        <figcaption className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-4 py-3">
          <span className="illustrative">Illustrative model · not to scale</span>
          <span className="font-mono text-xs tabular text-muted">{object.sizeLabel}</span>
        </figcaption>
      </figure>

      <div className="mt-10 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="measure text-ink">{object.description}</p>
          <Link to={`/object/${object.id}`} className="text-link mt-6">
            Full {object.name.toLowerCase()} dossier →
          </Link>
        </div>

        <nav aria-label="Featured specimens" className="md:col-span-4 md:col-start-9">
          <p className="eyebrow">Quick picks</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {FEATURED.map((fid) => {
              const obj = getObject(fid);
              if (!obj) return null;
              const active = object.id === fid;
              return (
                <li key={fid}>
                  <Link
                    to={`/3d/${fid}`}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded border px-4 text-sm transition-colors duration-[140ms] active:bg-surface-2 ${
                      active ? "border-accent bg-surface text-ink" : "border-line text-muted hover:border-muted hover:text-ink"
                    }`}
                  >
                    {obj.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
