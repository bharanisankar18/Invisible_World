import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { OBJECTS, getObject } from "../data/catalog.js";
import Scene3D from "../components/Scene3D.jsx";

const FEATURED = ["atom", "dna", "neuron", "virus", "human-cell", "molecule"];

const ease = [0.16, 1, 0.3, 1];

export default function Explorer3D() {
  const { id } = useParams();
  const navigate = useNavigate();
  const object = getObject(id) || getObject("atom");

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-medium tracking-wider uppercase text-accent/80">
          <span className="text-sm">◎</span>
          3D explorer
        </span>
        <h1 className="display mt-6 text-[clamp(2rem,4vw+1rem,3.5rem)]">
          {object.name}
        </h1>
        <p className="mt-3 max-w-[54ch] text-muted">
          Drag to rotate. Teaching geometry — not crystallography. Labels mark cartoon parts.
        </p>
      </motion.div>

      {/* Specimen picker */}
      <div className="mt-8">
        <label className="text-sm text-muted/60" htmlFor="obj-select">Specimen</label>
        <select
          id="obj-select"
          className="mt-2 h-11 min-w-56 rounded-xl glass px-4 text-ink appearance-none cursor-pointer transition-all focus:border-accent/40"
          value={object.id}
          onChange={(e) => navigate(`/3d/${e.target.value}`)}
        >
          {OBJECTS.map((o) => (
            <option key={o.id} value={o.id} style={{ background: "#0f172a", color: "#e2e8f0" }}>
              {o.name}
            </option>
          ))}
        </select>
      </div>

      {/* 3D viewport */}
      <motion.div
        className="mt-8 rounded-3xl overflow-hidden glow-box"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease }}
      >
        <Scene3D object={object} />
      </motion.div>

      <p className="mt-6 max-w-[62ch] text-muted/80 leading-relaxed">{object.description}</p>

      {/* Quick picks */}
      <div className="mt-10 flex flex-wrap gap-2">
        {FEATURED.map((fid) => {
          const obj = getObject(fid);
          if (!obj) return null;
          return (
            <Link
              key={fid}
              to={`/3d/${fid}`}
              className={`inline-flex min-h-11 items-center rounded-xl px-5 text-sm font-medium transition-all duration-200 ${object.id === fid
                ? "glass text-accent border-accent/30"
                : "text-muted/60 hover:text-ink hover:bg-white/[0.03]"
                }`}
              style={object.id === fid ? { borderColor: "rgba(56, 189, 248, 0.3)" } : {}}
            >
              {obj.name}
            </Link>
          );
        })}
      </div>

      <Link to={`/object/${object.id}`} className="mt-8 inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all duration-300">
        Full dossier
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
