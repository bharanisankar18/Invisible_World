import { Link, useNavigate, useParams } from "react-router-dom";
import { OBJECTS, ZONES, getObject } from "../data/catalog.js";
import Scene3D from "../components/Scene3D.jsx";

const FEATURED = ["dna", "neuron", "virus", "human-cell", "magnetism"];

export default function Explorer3D() {
  const { id } = useParams();
  const navigate = useNavigate();
  const object = getObject(id) || getObject("atom");

  return (
    <div>
      <header className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <h1 className="display text-[clamp(2.75rem,1.6rem+3.5vw,4.5rem)]">{object.name}</h1>
          <p className="mt-4 max-w-[54ch] text-lg text-muted">
            Drag to turn it, scroll to zoom. The shapes are simplified so the main parts are easy to spot.
          </p>
        </div>
        <div className="self-end md:col-span-4 md:col-start-9">
          <label className="font-bold text-muted" htmlFor="obj-select">
            Show me
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

      <figure className="mt-10 overflow-hidden rounded-[28px] bg-stage">
        <Scene3D object={object} />
        <figcaption className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <span className="illustrative">Simplified model, not to scale</span>
          <span className="text-sm text-muted tabular">Real size {object.sizeLabel}</span>
        </figcaption>
      </figure>

      <div className="mt-10 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="measure text-lg text-ink">{object.description}</p>
          <Link to={`/object/${object.id}`} className="text-link mt-6">
            Read more about {object.name.toLowerCase()}
          </Link>
        </div>

        <nav aria-label="Featured specimens" className="md:col-span-4 md:col-start-9">
          <p className="font-bold text-muted">Popular</p>
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
                    className={`inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-bold transition-colors duration-150 ${
                      active ? "bg-ink text-accent-ink" : "bg-surface text-muted hover:bg-surface-2 hover:text-ink"
                    }`}
                  >
                    {obj.name}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                to="/atom"
                className="inline-flex min-h-11 items-center rounded-full bg-surface px-4 text-[15px] font-bold text-electron transition-colors duration-150 hover:bg-surface-2"
              >
                Atom lab
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
