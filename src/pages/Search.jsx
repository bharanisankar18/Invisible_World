import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { searchCatalog } from "../data/catalog.js";
import ObjectCard from "../components/ObjectCard.jsx";

const ease = [0.16, 1, 0.3, 1];

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const results = useMemo(() => searchCatalog(q), [q]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <h1 className="display text-[clamp(2.5rem,4vw+1rem,4rem)]">
          Search
        </h1>
        <p className="mt-3 text-muted">
          Query: <span className="text-accent font-medium">{q || "empty"}</span>
          {results.length > 0 && (
            <span className="ml-2 text-muted/50">· {results.length} result{results.length !== 1 ? "s" : ""}</span>
          )}
        </p>
      </motion.div>

      {results.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease }}
          className="mt-16 flex flex-col items-center justify-center text-center rounded-3xl glass-card p-16"
        >
          <div className="text-5xl opacity-30 mb-6">🔍</div>
          <p className="text-lg text-muted">No catalogue match.</p>
          <p className="mt-2 text-sm text-muted/50">Try DNA, neuron, tesla, or virus.</p>
          <Link to="/zones" className="btn-primary mt-8">
            Browse zones
          </Link>
        </motion.div>
      ) : (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((o, i) => (
            <ObjectCard key={o.id} object={o} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
