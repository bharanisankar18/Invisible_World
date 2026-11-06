import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { searchCatalog } from "../data/catalog.js";
import ObjectCard from "../components/ObjectCard.jsx";

const SUGGESTIONS = ["DNA", "neuron", "magnet", "virus", "orbital"];

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const results = useMemo(() => searchCatalog(q), [q]);

  return (
    <div>
      <h1 className="display text-[clamp(2.5rem,1.6rem+3vw,4rem)]">{q ? `“${q}”` : "Search"}</h1>
      <p className="mt-3 text-muted" aria-live="polite">
        {q ? `${results.length} ${results.length === 1 ? "result" : "results"}` : "Type a word in the search box above."}
      </p>

      {results.length === 0 ? (
        <div className="panel mt-12 max-w-[60ch] p-8">
          <p className="text-lg">{q ? "Nothing on the site mentions that word yet." : "Not sure where to start?"}</p>
          <p className="mt-2 text-muted">Try one of these:</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <Link to={`/search?q=${encodeURIComponent(s)}`} className="btn-secondary min-h-11 px-5 text-[15px]">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/zones" className="text-link mt-8">
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
