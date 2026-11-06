import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import AtomStage, { CLOUD, ELECTRON, NEUTRON, PROTON } from "../components/atom/AtomStage.jsx";
import {
  ELEMENTS,
  MAX_Z,
  blockOf,
  chargeLabel,
  configuration,
  electronRange,
  orbitals,
  getElement,
  neutronRange,
  nucleusRadiusFm,
  nucleusStatus,
  shellCounts,
} from "../data/elements.js";
import { wavelengthToHex } from "../lib/orbitals.js";

const VIEWS = [
  {
    id: "shells",
    label: "Shells",
    caption:
      "The shell picture. Electrons sit on rings: two on the first, then up to eight on the next. Textbooks draw atoms this way because it makes electrons easy to count. Real electrons don’t circle like planets, though.",
  },
  {
    id: "clouds",
    label: "Clouds",
    caption:
      "The cloud picture. Each dot is a place you could find an electron if you looked. Where the dots crowd together, the electron is most likely to be. This is much closer to what quantum physics says. Sizes are squeezed so the inner clouds stay visible.",
  },
  {
    id: "nucleus",
    label: "Nucleus",
    caption:
      "The nucleus up close: protons and neutrons packed into a ball. The protons push each other apart, but the strong nuclear force holds the whole ball together.",
  },
];

const BLOCK_NAME = { s: "s orbitals", p: "p orbitals", d: "d orbitals" };

/* Subscript labels for each orbital, written the way chemistry books do. */
const ORBITAL_SUB = { s: "", px: "x", py: "y", pz: "z", dz2: "z²", dxz: "xz", dyz: "yz", dxy: "xy", dx2y2: "x²−y²" };
const ORBITAL_NAME = { s: "", px: "x", py: "y", pz: "z", dz2: "z squared", dxz: "x z", dyz: "y z", dxy: "x y", dx2y2: "x squared minus y squared" };
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const int = (v, fallback) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
};
const roundTo2 = (x) => {
  const p = Math.pow(10, Math.floor(Math.log10(x)) - 1);
  return Math.round(x / p) * p;
};

function Stepper({ label, hint, color, value, min, max, onChange }) {
  const id = label.toLowerCase();
  return (
    <div className="flex items-center gap-4 py-3">
      <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
      <div className="min-w-0 flex-1">
        <p id={`${id}-label`} className="font-bold text-ink">
          {label}
        </p>
        <p className="text-sm text-muted">{hint}</p>
      </div>
      <div className="flex items-center gap-1" role="group" aria-labelledby={`${id}-label`}>
        <button
          type="button"
          className="step-btn"
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          aria-label={`Remove one ${label.toLowerCase().replace(/s$/, "")}`}
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
            <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <output className="display w-12 text-center text-[1.75rem] tabular" aria-live="polite">
          {value}
        </output>
        <button
          type="button"
          className="step-btn"
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          aria-label={`Add one ${label.toLowerCase().replace(/s$/, "")}`}
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
            <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Spectrum({ nm }) {
  const visible = nm != null;
  const left = visible ? ((nm - 380) / (750 - 380)) * 100 : 0;
  return (
    <div className="mt-4">
      <div
        className="relative h-7 overflow-hidden rounded-full"
        style={{
          background:
            "linear-gradient(90deg, #5B2C9F 0%, #3D4BFF 14%, #2FB8FF 28%, #3DFF8B 42%, #E8FF3D 55%, #FFB23D 68%, #FF4D3D 84%, #8A1A1A 100%)",
          opacity: visible ? 1 : 0.35,
        }}
        role="img"
        aria-label={visible ? `Visible spectrum with a line at ${nm} nanometres` : "Visible spectrum, no line inside it"}
      >
        {visible && (
          <span
            className="absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_10px_3px_rgba(255,255,255,0.9)]"
            style={{ left: `${left}%` }}
          />
        )}
      </div>
      <div className="mt-1.5 flex justify-between text-xs text-muted">
        <span>380 nm violet</span>
        <span>750 nm red</span>
      </div>
    </div>
  );
}

function PeriodicTable({ z, onPick }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      <div
        className="grid min-w-[720px] gap-1.5"
        style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
        role="group"
        aria-label="Periodic table, hydrogen to krypton"
      >
        {ELEMENTS.map((el) => {
          const block = blockOf(el.z);
          const color = CLOUD[block][0];
          const active = el.z === z;
          return (
            <button
              key={el.z}
              type="button"
              onClick={() => onPick(el.z)}
              aria-pressed={active}
              aria-label={`${el.name}, ${el.z} protons`}
              className="pt-cell"
              style={{
                gridColumn: el.group,
                gridRow: el.period,
                "--cell": color,
              }}
            >
              <span className="text-[11px] leading-none opacity-75">{el.z}</span>
              <span className="display text-lg leading-none">{el.symbol}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AtomLab() {
  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();

  const [z, setZ] = useState(() => clamp(int(params.get("z"), 6), 1, MAX_Z));
  const [n, setN] = useState(() => {
    const zz = clamp(int(params.get("z"), 6), 1, MAX_Z);
    const r = neutronRange(zz);
    return clamp(int(params.get("n"), getElement(zz).common), r.min, r.max);
  });
  const [e, setE] = useState(() => {
    const zz = clamp(int(params.get("z"), 6), 1, MAX_Z);
    const r = electronRange(zz);
    return clamp(int(params.get("e"), zz), r.min, r.max);
  });
  const [view, setView] = useState(() =>
    VIEWS.some((v) => v.id === params.get("view")) ? params.get("view") : "shells"
  );
  const [hover, setHover] = useState(null);
  const [pinned, setPinned] = useState(null); // a subshell, e.g. "2p"
  const [pinnedOrb, setPinnedOrb] = useState(null); // one orbital, e.g. "2px"
  const [trueScale, setTrueScale] = useState(false);
  const [exciteToken, setExciteToken] = useState(0);
  const [emitted, setEmitted] = useState(false);
  const [notice, setNotice] = useState("");

  const el = getElement(z);
  const a = z + n;
  const charge = z - e;
  const config = useMemo(() => configuration(e, z), [e, z]);
  const shells = shellCounts(config);
  const status = nucleusStatus(z, n);
  const focus = hover ?? pinnedOrb ?? pinned;
  const pinnedOrbitals = useMemo(
    () => (pinned ? orbitals(config).filter((o) => o.sub === pinned) : []),
    [config, pinned]
  );
  const nRange = neutronRange(z);
  const eRange = electronRange(z);
  const viewInfo = VIEWS.find((v) => v.id === view);
  const photonHex = el.line ? wavelengthToHex(el.line) : "#C9B8FF";

  // Keep the URL shareable: a teacher can send ?z=11&e=10 for Na⁺.
  useEffect(() => {
    setParams({ z: String(z), n: String(n), e: String(e), view }, { replace: true });
  }, [z, n, e, view, setParams]);

  useEffect(() => {
    setEmitted(false);
    setPinned(null);
    setPinnedOrb(null);
  }, [z]);

  // Drop a pinned subshell that no longer has electrons.
  useEffect(() => {
    if (pinned && !config.some((s) => s.label === pinned)) {
      setPinned(null);
      setPinnedOrb(null);
    }
  }, [config, pinned]);

  const pickElement = (next, message = "") => {
    const nz = clamp(next, 1, MAX_Z);
    const ne = getElement(nz);
    setZ(nz);
    setN(ne.common);
    setE(nz);
    setTrueScale(false);
    setNotice(message);
  };

  const changeProtons = (next) => {
    if (next < 1 || next > MAX_Z) return;
    const name = getElement(next).name;
    pickElement(
      next,
      next > z
        ? `One more proton turned ${el.name.toLowerCase()} into ${name.toLowerCase()}.`
        : `One fewer proton turned ${el.name.toLowerCase()} into ${name.toLowerCase()}.`
    );
  };

  const chargeText =
    e === 0
      ? "Bare nucleus. Every electron has been stripped away."
      : charge === 0
        ? `Neutral atom. ${e} electron${e > 1 ? "s balance" : " balances"} ${z} proton${z > 1 ? "s" : ""}.`
        : charge > 0
          ? `Positive ion. It has lost ${charge} electron${charge > 1 ? "s" : ""}.`
          : `Negative ion. It has gained ${-charge} electron${charge < -1 ? "s" : ""}.`;

  const atomPm = el.radius;
  const nucFm = nucleusRadiusFm(a);
  const marbleMetres = roundTo2(((atomPm * 1e-12) / (nucFm * 1e-15)) * 0.01);

  return (
    <div className="mx-auto max-w-[1360px] px-4 pb-24 pt-10 md:px-8 md:pt-14">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="display text-[clamp(2.75rem,2rem+3.5vw,5rem)]">Atom lab</h1>
          <p className="mt-3 max-w-[52ch] text-lg text-muted">
            Pick an element, then add or take away protons, neutrons and electrons. Drag the atom to turn it.
          </p>
        </div>
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm text-muted">
          <span>Jump to</span>
          <select
            className="field w-48 cursor-pointer"
            value={z}
            onChange={(ev) => pickElement(Number(ev.target.value))}
          >
            {ELEMENTS.map((x) => (
              <option key={x.z} value={x.z}>
                {x.z}. {x.name}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* Stage */}
        <section className="lg:col-span-8" aria-label={`3D model of ${el.name}`}>
          <div className="stage relative h-[min(64svh,560px)] min-h-[380px] overflow-hidden lg:h-[660px]">
            <AtomStage
              z={z}
              neutrons={n}
              electrons={e}
              view={view}
              focus={view === "clouds" ? focus : null}
              trueScale={trueScale}
              exciteToken={exciteToken}
              photonHex={photonHex}
              onEmit={() => setEmitted(true)}
              reduce={reduce}
            />

            <div className="absolute left-3 top-3 flex rounded-full bg-[#071034]/80 p-1 md:left-4 md:top-4" role="group" aria-label="Model view">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={view === v.id}
                  onClick={() => {
                    setView(v.id);
                    if (v.id !== "shells") setTrueScale(false);
                  }}
                  className="seg-btn"
                >
                  {v.label}
                </button>
              ))}
            </div>

            {view === "shells" && e > 0 && (
              <button
                type="button"
                className="absolute right-3 top-3 inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[#071034]/80 px-4 text-sm text-ink transition-colors hover:bg-[#0F1F55] md:right-4 md:top-4"
                aria-pressed={trueScale}
                onClick={() => setTrueScale((s) => !s)}
              >
                <span className={`toggle ${trueScale ? "toggle-on" : ""}`} aria-hidden="true" />
                Real nucleus size
              </button>
            )}

            {/* Legend */}
            <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-x-4 gap-y-1.5 rounded-2xl bg-[#071034]/80 px-4 py-2.5 text-[13px] text-ink md:bottom-4 md:left-4">
              {view === "clouds" ? (
                <>
                  {["s", "p", "d"].map((t) => (
                    <span key={t} className="inline-flex items-center gap-2">
                      <span
                        className="h-2.5 w-5 rounded-full"
                        style={{ background: `linear-gradient(90deg, ${CLOUD[t][0]} 50%, ${CLOUD[t][1]} 50%)` }}
                      />
                      {BLOCK_NAME[t]}
                    </span>
                  ))}
                  <span className="text-muted">Two shades show opposite wave phase</span>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: PROTON }} />
                    {z} proton{z > 1 ? "s" : ""} (+)
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: NEUTRON }} />
                    {n} neutron{n === 1 ? "" : "s"}
                  </span>
                  {view === "shells" && (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: ELECTRON }} />
                      {e} electron{e === 1 ? "" : "s"} (−)
                    </span>
                  )}
                </>
              )}
            </div>

            {view === "shells" && trueScale && (
              <p className="pointer-events-none absolute bottom-16 right-3 max-w-[30ch] rounded-2xl bg-[#071034]/85 px-4 py-3 text-sm text-ink md:bottom-4 md:right-4">
                At true scale, if the nucleus were a 1 cm marble, this atom would be about{" "}
                <strong>{marbleMetres.toLocaleString("en-GB")} m</strong> across.
              </p>
            )}
          </div>
          <p className="mt-4 max-w-[72ch] text-muted">{viewInfo.caption}</p>
        </section>

        {/* Readout + controls */}
        <aside className="lg:col-span-4" aria-label={`${el.name} controls`}>
          <div className="panel p-6">
            <div className="flex items-start gap-5">
              <div className="nuclide" aria-label={`${el.name}-${a}${charge ? `, charge ${chargeLabel(charge)}` : ""}`}>
                <span className="nuclide-stack" aria-hidden="true">
                  <span className="text-ink">{a}</span>
                  <span style={{ color: PROTON }}>{z}</span>
                </span>
                <span className="nuclide-symbol" aria-hidden="true">
                  {el.symbol}
                </span>
                {charge !== 0 && (
                  <span className="nuclide-charge" style={{ color: ELECTRON }} aria-hidden="true">
                    {chargeLabel(charge)}
                  </span>
                )}
              </div>
              <div className="min-w-0 pt-2">
                <p className="display text-[1.65rem] leading-tight">
                  {el.name}-{a}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {el.kind}, {blockOf(z)}-block
                </p>
              </div>
            </div>

            <p className="mt-5 text-[15px] text-ink" aria-live="polite">
              {chargeText}{" "}
              <span className={status.stable ? "text-muted" : "text-[#FF97A6]"}>{status.text}</span>
            </p>
            {notice && (
              <p className="mt-2 text-sm text-[#9FEFFF]" role="status">
                {notice}
              </p>
            )}

            <div className="mt-4 divide-y divide-line border-y border-line">
              <Stepper label="Protons" hint="Decides which element it is" color={PROTON} value={z} min={1} max={MAX_Z} onChange={changeProtons} />
              <Stepper
                label="Neutrons"
                hint="Makes a different isotope"
                color={NEUTRON}
                value={n}
                min={nRange.min}
                max={nRange.max}
                onChange={(v) => {
                  setN(clamp(v, nRange.min, nRange.max));
                  setNotice("");
                }}
              />
              <Stepper
                label="Electrons"
                hint="Makes it an ion"
                color={ELECTRON}
                value={e}
                min={eRange.min}
                max={eRange.max}
                onChange={(v) => {
                  setE(clamp(v, eRange.min, eRange.max));
                  setNotice("");
                }}
              />
            </div>
            {(n !== el.common || e !== z) && (
              <button type="button" className="text-link mt-3 text-sm" onClick={() => pickElement(z)}>
                Back to a normal {el.name.toLowerCase()} atom
              </button>
            )}

            <div className="mt-6">
              <h2 className="font-bold">Electron configuration</h2>
              {config.length ? (
                <>
                  <ul className="mt-3 flex flex-wrap gap-2" onMouseLeave={() => setHover(null)}>
                    {config.map((s) => (
                      <li key={s.label}>
                        <button
                          type="button"
                          className="config-chip"
                          style={{ "--chip": CLOUD[s.type][0] }}
                          aria-pressed={pinned === s.label}
                          onMouseEnter={() => setHover(s.label)}
                          onFocus={() => setHover(s.label)}
                          onBlur={() => setHover(null)}
                          onClick={() => {
                            setView("clouds");
                            setTrueScale(false);
                            setPinnedOrb(null);
                            setPinned((p) => (p === s.label ? null : s.label));
                          }}
                        >
                          {s.label}
                          <sup className="config-count">{s.count}</sup>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {pinnedOrbitals.length > 1 && (
                    <div className="mt-4 rounded-2xl bg-stage/60 p-3">
                      <p className="px-1 text-sm text-muted">
                        The {pinned} orbitals. Arrows are electrons; a pair spins in opposite directions.
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-1.5" onMouseLeave={() => setHover(null)}>
                        {pinnedOrbitals.map((o) => (
                          <li key={o.key}>
                            <button
                              type="button"
                              className="orbital-chip"
                              style={{ "--chip": CLOUD[o.type][0] }}
                              aria-pressed={pinnedOrb === o.key}
                              aria-label={`${o.n}${"spd"[o.l]} ${ORBITAL_NAME[o.shape]} orbital, ${o.electrons} electron${o.electrons > 1 ? "s" : ""}`}
                              onMouseEnter={() => setHover(o.key)}
                              onFocus={() => setHover(o.key)}
                              onBlur={() => setHover(null)}
                              onClick={() => setPinnedOrb((k) => (k === o.key ? null : o.key))}
                            >
                              <span>
                                {o.n}
                                {"spd"[o.l]}
                                <sub>{ORBITAL_SUB[o.shape]}</sub>
                              </span>
                              <span className="orbital-spin" aria-hidden="true">
                                {o.electrons === 2 ? "↑↓" : "↑"}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="mt-3 text-sm text-muted">
                    Electrons per shell: <span className="text-ink tabular">{shells.join(", ")}</span>.{" "}
                    {pinned ? "Tap the subshell again to see the whole atom." : "Tap a subshell to light up its cloud."}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted">No electrons left to arrange.</p>
              )}
            </div>
          </div>

          <div className="panel mt-4 p-6">
            <h2 className="font-bold">Make light</h2>
            <p className="mt-1 text-sm text-muted">
              Give an outer electron energy. It jumps to a higher shell, falls back, and gives the energy out as light.
            </p>
            <button
              type="button"
              className="btn-primary mt-4 w-full"
              disabled={e === 0}
              onClick={() => {
                if (view !== "shells") setView("shells");
                setTrueScale(false);
                setExciteToken((t) => t + 1);
              }}
            >
              Make an electron jump
            </button>
            {emitted && (
              <div aria-live="polite">
                <Spectrum nm={el.line} />
                <p className="mt-3 text-sm text-ink">
                  {el.line
                    ? `${el.name} gives out a bright line at ${el.line} nm. Every element has its own pattern of lines, like a barcode.`
                    : `${el.name}’s strongest lines are ultraviolet or infrared, so most of its light is invisible to you.`}
                </p>
                <p className="mt-1 text-xs text-muted">The jump is drawn between shells. The colour is a real line from this element’s spectrum.</p>
              </div>
            )}
          </div>

          <dl className="panel mt-4 grid grid-cols-2 gap-x-4 gap-y-5 p-6">
            <div>
              <dt className="text-sm text-muted">Atom radius</dt>
              <dd className="display mt-1 text-2xl tabular">{atomPm} pm</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Nucleus radius</dt>
              <dd className="display mt-1 text-2xl tabular">{nucFm.toFixed(1)} fm</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-sm text-muted">Where you meet it</dt>
              <dd className="mt-1 text-ink">{el.meet}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <section className="mt-14" aria-labelledby="table-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="table-heading" className="display text-[clamp(1.75rem,1.2rem+2vw,2.5rem)]">
              Choose an element
            </h2>
            <p className="mt-2 max-w-[60ch] text-muted">
              Each colour shows which kind of orbital that element’s last electron goes into. The clouds use the same
              colours.
            </p>
          </div>
          <ul className="flex gap-4 text-sm">
            {["s", "p", "d"].map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-[4px]" style={{ background: CLOUD[t][0] }} />
                {t}-block
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <PeriodicTable z={z} onPick={(next) => pickElement(next)} />
        </div>
      </section>

      <section className="mt-16 grid gap-6 border-t border-line pt-10 md:grid-cols-12">
        <h2 className="display text-[clamp(1.6rem,1.2rem+1.6vw,2.25rem)] md:col-span-5">How small is this, really?</h2>
        <p className="max-w-[60ch] text-muted md:col-span-7">
          {/^[aeiou]/i.test(el.name) ? "An" : "A"} {el.name.toLowerCase()} atom is about {atomPm * 2} picometres across. That is{" "}
          {Math.round(80e-6 / (atomPm * 2e-12)).toLocaleString("en-GB")} atoms side by side to span one human hair. You can
          never see one with light: visible light waves are thousands of times wider than an atom.{" "}
          <Link to="/scale" className="text-link">
            Zoom down from a hair
          </Link>
        </p>
      </section>
    </div>
  );
}
