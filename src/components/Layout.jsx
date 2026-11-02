import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { to: "/zones", label: "Zones", icon: "◆" },
  { to: "/scale", label: "Zoom", icon: "⊕" },
  { to: "/mystery", label: "Mystery", icon: "?" },
  { to: "/compare", label: "Compare", icon: "⇔" },
  { to: "/3d", label: "3D", icon: "◎" },
  { to: "/ask", label: "Ask", icon: "✦" },
];

export default function Layout() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const onSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setOpen(false);
  };

  return (
    <div className="min-h-dvh bg-bg text-ink">
      {/* Ambient glow at top */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 z-50 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <header className="glass-strong sticky top-0 z-40">
        <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-3 md:px-8">
          <Link
            to="/"
            className="group relative shrink-0 mr-2"
          >
            <span className="display text-[15px] tracking-[0.15em] uppercase gradient-text">
              InvisibleWorld
            </span>
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-accent to-accent-2 transition-all duration-300 group-hover:w-full" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `relative flex min-h-10 items-center gap-1.5 px-3 text-[13px] font-medium tracking-wide transition-all duration-200 rounded-lg ${
                    isActive
                      ? "text-accent bg-accent/8"
                      : "text-muted hover:text-ink hover:bg-white/[0.03]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="text-[10px] opacity-50">{l.icon}</span>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-accent to-accent-2"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <form onSubmit={onSearch} className="ml-auto hidden min-w-0 flex-1 md:block md:max-w-[220px]">
            <label className="sr-only" htmlFor="site-search">
              Search objects
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                id="site-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="h-10 w-full rounded-lg border border-line bg-white/[0.03] pl-9 pr-3 text-sm text-ink placeholder:text-muted/60 focus:border-accent/40 focus:bg-white/[0.05] transition-all duration-200"
              />
            </div>
          </form>

          <button
            type="button"
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink hover:bg-white/[0.05] md:hidden transition-colors"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
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
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-line md:hidden"
            >
              <div className="px-4 py-4">
                <nav className="flex flex-col gap-1" aria-label="Mobile">
                  {LINKS.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm ${
                          isActive ? "text-accent bg-accent/8" : "text-muted"
                        }`
                      }
                    >
                      <span className="text-xs opacity-50">{l.icon}</span>
                      {l.label}
                    </NavLink>
                  ))}
                </nav>
                <form onSubmit={onSearch} className="mt-3">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search"
                    className="h-11 w-full rounded-lg border border-line bg-white/[0.03] px-3 text-sm"
                  />
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className={isHome ? "" : "mx-auto max-w-[1400px] px-4 py-10 md:px-8 md:py-16"}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>

      {!isHome && (
        <footer className="relative">
          <div className="section-divider" />
          <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="display text-sm tracking-[0.15em] uppercase gradient-text">
                  InvisibleWorld
                </span>
                <p className="mt-2 text-sm text-muted">
                  The world is bigger than what your eyes can see.
                </p>
              </div>
              <p className="text-xs text-muted/60">
                Illustrative visualizations · not live microscopy or measured specimens
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
