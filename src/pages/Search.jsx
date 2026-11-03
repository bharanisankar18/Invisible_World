import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { searchCatalog } from "../data/catalog.js";
import ObjectCard from "../components/ObjectCard.jsx";

const SUGGESTIONS = ["DNA", "neuron", "tesla", "virus", "orbital"];

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const results = useMemo(() => searchCatalog(q), [q]);

  return (
    <div>
      <p className="eyebrow">Search</p>
      <h1 className="display mt-4 text-[clamp(2.5rem,4vw+1rem,4rem)]">{q ? `“${q}”` : "Search the catalogue"}</h1>
      <p className="mt-4 font-mono text-sm tabular text-muted" aria-live="polite">
        {results.length} {results.length === 1 ? "match" : "matches"}
      </p>

      {results.length === 0 ? (
        <div className="mt-16 border-t border-line pt-10">
          <p className="text-lg">No catalogue entry mentions that term.</p>
          <p className="mt-2 text-muted">Try one of these:</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <Link to={`/search?q=${encodeURIComponent(s)}`} className="btn-secondary min-h-11 px-4 text-sm">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/zones" className="text-link mt-10">
            Or browse the five zones
          </Link>
        </div>
      ) : (
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((o) => (
            <li key={o.id}>
              <ObjectCard object={o} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
