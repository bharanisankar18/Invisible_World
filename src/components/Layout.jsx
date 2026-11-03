import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ErrorBoundary from "./ErrorBoundary.jsx";

const LINKS = [
  { to: "/zones", label: "Zones" },
  { to: "/scale", label: "Zoom" },
  { to: "/compare", label: "Compare" },
  { to: "/3d", label: "3D" },
  { to: "/mystery", label: "Mystery" },
  { to: "/ask", label: "Ask" },
];

const ease = [0.16, 1, 0.3, 1];

function SearchForm({ id, q, setQ, onSubmit, className = "" }) {
  return (
    <form onSubmit={onSubmit} className={className} role="search">
      <label className="sr-only" htmlFor={id}>
        Search the catalogue
      </label>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.75"
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
          placeholder="DNA, neuron, tesla…"
          className="field pl-9"
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
  const isHome = pathname === "/";

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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-3 focus:text-accent-ink"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-bg">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-6 px-4 md:px-8">
          <Link
            to="/"
            className="display inline-flex min-h-11 shrink-0 items-center text-[15px] uppercase tracking-[0.14em] text-ink transition-colors duration-[140ms] hover:text-accent"
          >
            InvisibleWorld
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `relative inline-flex min-h-11 items-center px-3 text-sm transition-colors duration-[140ms] active:opacity-70 ${
                    isActive ? "text-ink" : "text-muted hover:text-ink"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-[11px] h-[2px] bg-accent" aria-hidden="true" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <SearchForm
            id="site-search"
            q={q}
            setQ={setQ}
            onSubmit={onSearch}
            className="ml-auto hidden w-full max-w-[240px] md:block"
          />

          <button
            type="button"
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded border border-line text-ink transition-colors duration-[140ms] hover:border-muted active:bg-surface md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              {open ? (
                <path d="M4 4l10 10M4 14l10-10" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14, ease }}
              className="border-t border-line md:hidden"
            >
              <div className="px-4 py-4">
                <nav className="flex flex-col" aria-label="Mobile">
                  {LINKS.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      className={({ isActive }) =>
                        `flex min-h-11 items-center border-l-2 px-3 text-[15px] ${
                          isActive ? "border-accent text-ink" : "border-transparent text-muted active:text-ink"
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

      <main id="main" className={`flex-1 ${isHome ? "" : "mx-auto w-full max-w-[1280px] px-4 py-16 md:px-8 md:py-24"}`}>
        <motion.div
          key={pathname}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.26, ease }}
        >
          <ErrorBoundary resetKey={pathname}>
            <Outlet />
          </ErrorBoundary>
        </motion.div>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-8">
          <div>
            <span className="display text-sm uppercase tracking-[0.14em]">InvisibleWorld</span>
            <p className="mt-2 text-sm text-muted">The world is bigger than what your eyes can see.</p>
          </div>
          <p className="illustrative">Teaching diagrams · typical sizes · not live microscopy</p>
        </div>
      </footer>
    </div>
  );
}
