import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ErrorBoundary from "./ErrorBoundary.jsx";

const LINKS = [
  { to: "/atom", label: "Atom lab" },
  { to: "/zones", label: "Explore" },
  { to: "/scale", label: "Zoom" },
  { to: "/mystery", label: "Quiz" },
  { to: "/ask", label: "Ask" },
];

/* Pages that lay out their own full-width bands. */
const FULL_BLEED = ["/", "/atom"];

const ease = [0.16, 1, 0.3, 1];

function Mark() {
  // Nucleus and one electron orbit: the site's mark.
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <ellipse cx="16" cy="16" rx="13" ry="5.5" fill="none" stroke="#AEBBE6" strokeWidth="1.4" transform="rotate(-28 16 16)" />
      <circle cx="16" cy="16" r="3.6" fill="#FF5D73" />
      <circle cx="27.2" cy="10" r="2.2" fill="#4FE3FF" />
    </svg>
  );
}

function SearchForm({ id, q, setQ, onSubmit, className = "" }) {
  return (
    <form onSubmit={onSubmit} className={className} role="search">
      <label className="sr-only" htmlFor={id}>
        Search
      </label>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input
          id={id}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: DNA, neuron, magnet"
          className="field h-11 rounded-full pl-10"
        />
      </div>
    </form>
  );
}

export default function Layout() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const fullBleed = FULL_BLEED.includes(pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(false);
  }, [pathname]);

  const onSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-bold focus:text-accent-ink"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[4.5rem] max-w-[1360px] items-center gap-6 px-4 md:px-8">
          <Link to="/" className="group inline-flex min-h-11 shrink-0 items-center gap-2.5" aria-label="InvisibleWorld home">
            <span className="transition-transform duration-500 group-hover:rotate-[60deg]">
              <Mark />
            </span>
            <span className="display text-[19px]" style={{ fontVariationSettings: '"wdth" 118, "wght" 780' }}>
              InvisibleWorld
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-bold transition-colors duration-150 ${
                    isActive ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <SearchForm
            id="site-search"
            q={q}
            setQ={setQ}
            onSubmit={onSearch}
            className="ml-auto hidden w-full max-w-[250px] lg:block"
          />

          <button
            type="button"
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink transition-colors duration-150 hover:bg-surface-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              {open ? (
                <path d="M4 4l10 10M4 14l10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav"
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease }}
              className="overflow-hidden border-t border-line md:hidden"
            >
              <div className="px-4 py-4">
                <nav className="flex flex-col gap-1" aria-label="Mobile">
                  {LINKS.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      className={({ isActive }) =>
                        `flex min-h-12 items-center rounded-2xl px-4 text-lg font-bold ${
                          isActive ? "bg-surface-2 text-ink" : "text-muted active:bg-surface"
                        }`
                      }
                    >
                      {l.label}
                    </NavLink>
                  ))}
                </nav>
                <SearchForm id="mobile-search" q={q} setQ={setQ} onSubmit={onSearch} className="mt-4" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main
        id="main"
        className={`flex-1 ${fullBleed ? "" : "mx-auto w-full max-w-[1280px] px-4 py-14 md:px-8 md:py-20"}`}
      >
        <motion.div
          key={pathname}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease }}
        >
          <ErrorBoundary resetKey={pathname}>
            <Outlet />
          </ErrorBoundary>
        </motion.div>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-[1360px] gap-8 px-4 py-12 md:grid-cols-12 md:px-8">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <Mark />
              <span className="display text-[17px]" style={{ fontVariationSettings: '"wdth" 118, "wght" 780' }}>
                InvisibleWorld
              </span>
            </Link>
            <p className="mt-3 max-w-[40ch] text-sm text-muted">
              Drawings and 3D models are simplified so you can see how things work. Sizes are typical values, not
              measurements of one specimen.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-1 text-sm md:col-span-6 md:col-start-7 md:justify-end" aria-label="Footer">
            {[...LINKS, { to: "/compare", label: "Size ruler" }].map((l) => (
              <Link key={l.to} to={l.to} className="inline-flex min-h-11 items-center text-muted hover:text-ink">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
