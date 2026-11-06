/*
 * The first 36 elements (hydrogen to krypton), enough to fill 1s through 4p,
 * which covers every s, p and d orbital shape the atom lab draws.
 *
 * radius   calculated atomic radius in picometres (Clementi et al., 1967)
 * stable   neutron counts of stable (or effectively stable) isotopes
 * common   neutron count of the most abundant natural isotope
 * line     a bright visible emission line in nanometres, or null when the
 *          strongest lines sit in the ultraviolet or infrared
 */
export const ELEMENTS = [
  { z: 1, symbol: "H", name: "Hydrogen", period: 1, group: 1, kind: "Nonmetal", radius: 53, stable: [0, 1], common: 0, line: 656.3, meet: "Three out of four atoms in the universe. Two of them sit in every water molecule." },
  { z: 2, symbol: "He", name: "Helium", period: 1, group: 18, kind: "Noble gas", radius: 31, stable: [1, 2], common: 2, line: 587.6, meet: "Lighter than air, so it lifts balloons. The Sun makes it from hydrogen." },
  { z: 3, symbol: "Li", name: "Lithium", period: 2, group: 1, kind: "Alkali metal", radius: 167, stable: [3, 4], common: 4, line: 670.8, meet: "Stores the charge in phone and laptop batteries." },
  { z: 4, symbol: "Be", name: "Beryllium", period: 2, group: 2, kind: "Alkaline earth metal", radius: 112, stable: [5], common: 5, line: null, meet: "Light and stiff. The James Webb telescope’s mirrors are made of it." },
  { z: 5, symbol: "B", name: "Boron", period: 2, group: 13, kind: "Metalloid", radius: 87, stable: [5, 6], common: 6, line: null, meet: "Toughens heat-proof glass like the kind in oven dishes." },
  { z: 6, symbol: "C", name: "Carbon", period: 2, group: 14, kind: "Nonmetal", radius: 67, stable: [6, 7], common: 6, line: null, meet: "The backbone of every molecule in your body. Also diamond and pencil graphite." },
  { z: 7, symbol: "N", name: "Nitrogen", period: 2, group: 15, kind: "Nonmetal", radius: 56, stable: [7, 8], common: 7, line: null, meet: "78% of the air you are breathing right now." },
  { z: 8, symbol: "O", name: "Oxygen", period: 2, group: 16, kind: "Nonmetal", radius: 48, stable: [8, 9, 10], common: 8, line: null, meet: "About 65% of your body’s mass, mostly locked up in water." },
  { z: 9, symbol: "F", name: "Fluorine", period: 2, group: 17, kind: "Halogen", radius: 42, stable: [10], common: 10, line: null, meet: "Added to toothpaste to harden tooth enamel." },
  { z: 10, symbol: "Ne", name: "Neon", period: 2, group: 18, kind: "Noble gas", radius: 38, stable: [10, 11, 12], common: 10, line: 640.2, meet: "Glows red-orange inside neon signs." },
  { z: 11, symbol: "Na", name: "Sodium", period: 3, group: 1, kind: "Alkali metal", radius: 190, stable: [12], common: 12, line: 589.0, meet: "Half of table salt. Old street lamps glow yellow because of it." },
  { z: 12, symbol: "Mg", name: "Magnesium", period: 3, group: 2, kind: "Alkaline earth metal", radius: 145, stable: [12, 13, 14], common: 12, line: 518.4, meet: "Burns with a blinding white flame and sits at the centre of chlorophyll." },
  { z: 13, symbol: "Al", name: "Aluminium", period: 3, group: 13, kind: "Post-transition metal", radius: 118, stable: [14], common: 14, line: 396.2, meet: "Drink cans and foil. The most common metal in Earth’s crust." },
  { z: 14, symbol: "Si", name: "Silicon", period: 3, group: 14, kind: "Metalloid", radius: 111, stable: [14, 15, 16], common: 14, line: null, meet: "Sand, glass and every computer chip." },
  { z: 15, symbol: "P", name: "Phosphorus", period: 3, group: 15, kind: "Nonmetal", radius: 98, stable: [16], common: 16, line: null, meet: "Part of DNA’s backbone, and the striking strip on a matchbox." },
  { z: 16, symbol: "S", name: "Sulfur", period: 3, group: 16, kind: "Nonmetal", radius: 88, stable: [16, 17, 18, 20], common: 16, line: null, meet: "Gives rotten eggs and volcanoes their smell." },
  { z: 17, symbol: "Cl", name: "Chlorine", period: 3, group: 17, kind: "Halogen", radius: 79, stable: [18, 20], common: 18, line: null, meet: "Keeps swimming pools clean. The other half of table salt." },
  { z: 18, symbol: "Ar", name: "Argon", period: 3, group: 18, kind: "Noble gas", radius: 71, stable: [18, 20, 22], common: 22, line: 696.5, meet: "About 1% of air. Fills old light bulbs so the filament lasts longer." },
  { z: 19, symbol: "K", name: "Potassium", period: 4, group: 1, kind: "Alkali metal", radius: 243, stable: [20, 22], common: 20, line: 766.5, meet: "Bananas are full of it, and your nerves use it to fire signals." },
  { z: 20, symbol: "Ca", name: "Calcium", period: 4, group: 2, kind: "Alkaline earth metal", radius: 194, stable: [20, 22, 23, 24, 26, 28], common: 20, line: 422.7, meet: "Builds your bones and teeth." },
  { z: 21, symbol: "Sc", name: "Scandium", period: 4, group: 3, kind: "Transition metal", radius: 184, stable: [24], common: 24, line: null, meet: "Mixed into aluminium for light bike frames and baseball bats." },
  { z: 22, symbol: "Ti", name: "Titanium", period: 4, group: 4, kind: "Transition metal", radius: 176, stable: [24, 25, 26, 27, 28], common: 26, line: 498.2, meet: "Strong, light and rust-proof: aircraft, hip implants and white paint." },
  { z: 23, symbol: "V", name: "Vanadium", period: 4, group: 5, kind: "Transition metal", radius: 171, stable: [27, 28], common: 28, line: 437.9, meet: "Hardens the steel in spanners and other tools." },
  { z: 24, symbol: "Cr", name: "Chromium", period: 4, group: 6, kind: "Transition metal", radius: 166, stable: [26, 28, 29, 30], common: 28, line: 425.4, meet: "The mirror-shiny coating on taps. It keeps stainless steel stainless." },
  { z: 25, symbol: "Mn", name: "Manganese", period: 4, group: 7, kind: "Transition metal", radius: 161, stable: [30], common: 30, line: 403.1, meet: "Makes steel tougher and turns up inside batteries." },
  { z: 26, symbol: "Fe", name: "Iron", period: 4, group: 8, kind: "Transition metal", radius: 156, stable: [28, 30, 31, 32], common: 30, line: 438.4, meet: "Earth’s core, and the haemoglobin that carries oxygen in your blood." },
  { z: 27, symbol: "Co", name: "Cobalt", period: 4, group: 9, kind: "Transition metal", radius: 152, stable: [32], common: 32, line: null, meet: "Gives cobalt-blue glass its colour and powers rechargeable batteries." },
  { z: 28, symbol: "Ni", name: "Nickel", period: 4, group: 10, kind: "Transition metal", radius: 149, stable: [30, 32, 33, 34, 36], common: 30, line: null, meet: "Coins and stainless steel. Earth’s core is mostly iron and nickel." },
  { z: 29, symbol: "Cu", name: "Copper", period: 4, group: 11, kind: "Transition metal", radius: 145, stable: [34, 36], common: 34, line: 521.8, meet: "Carries electricity in almost every wire in your home." },
  { z: 30, symbol: "Zn", name: "Zinc", period: 4, group: 12, kind: "Transition metal", radius: 142, stable: [34, 36, 37, 38, 40], common: 34, line: 481.1, meet: "Coats steel so it does not rust. That coating is called galvanising." },
  { z: 31, symbol: "Ga", name: "Gallium", period: 4, group: 13, kind: "Post-transition metal", radius: 136, stable: [38, 40], common: 38, line: 417.2, meet: "Melts in your hand at about 30 °C. Used to make LEDs." },
  { z: 32, symbol: "Ge", name: "Germanium", period: 4, group: 14, kind: "Metalloid", radius: 125, stable: [38, 40, 41, 42, 44], common: 42, line: null, meet: "Used in the very first transistors, and in fibre-optic cables today." },
  { z: 33, symbol: "As", name: "Arsenic", period: 4, group: 15, kind: "Metalloid", radius: 114, stable: [42], common: 42, line: null, meet: "A famous poison, and also an ingredient in some computer chips." },
  { z: 34, symbol: "Se", name: "Selenium", period: 4, group: 16, kind: "Nonmetal", radius: 103, stable: [40, 42, 43, 44, 46, 48], common: 46, line: null, meet: "Your body needs a tiny amount. Solar cells use it too." },
  { z: 35, symbol: "Br", name: "Bromine", period: 4, group: 17, kind: "Halogen", radius: 94, stable: [44, 46], common: 44, line: null, meet: "One of only two elements that are liquid at room temperature." },
  { z: 36, symbol: "Kr", name: "Krypton", period: 4, group: 18, kind: "Noble gas", radius: 88, stable: [42, 44, 46, 47, 48, 50], common: 48, line: 587.1, meet: "Makes the bright white flash in some camera lamps and lasers." },
];

export const MAX_Z = ELEMENTS.length;

/** Well-known radioactive isotopes, keyed "Z-N". */
const RADIOACTIVE = {
  "1-2": "Tritium. Radioactive, half-life about 12 years.",
  "6-8": "Carbon-14. Radioactive, half-life about 5,730 years. Used to date ancient bones and wood.",
  "19-21": "Potassium-40. Radioactive, half-life about 1.3 billion years. Every banana contains a little.",
};

export function getElement(z) {
  return ELEMENTS[Math.min(Math.max(z, 1), MAX_Z) - 1];
}

/* Aufbau filling order up to 4p (36 electrons). */
export const SUBSHELLS = [
  { n: 1, l: 0, label: "1s", cap: 2 },
  { n: 2, l: 0, label: "2s", cap: 2 },
  { n: 2, l: 1, label: "2p", cap: 6 },
  { n: 3, l: 0, label: "3s", cap: 2 },
  { n: 3, l: 1, label: "3p", cap: 6 },
  { n: 4, l: 0, label: "4s", cap: 2 },
  { n: 3, l: 2, label: "3d", cap: 10 },
  { n: 4, l: 1, label: "4p", cap: 6 },
];

export const MAX_ELECTRONS = SUBSHELLS.reduce((s, x) => s + x.cap, 0);

const TYPE = ["s", "p", "d"];

/** Which block an element sits in: the subshell its last electron fills. */
export function blockOf(z) {
  const cfg = configuration(z, z);
  return TYPE[cfg[cfg.length - 1].l];
}

/**
 * Ground-state configuration for `electrons` electrons around nucleus `z`.
 * Chromium and copper borrow a 4s electron to half-fill or fill 3d; the
 * exception only applies to the neutral atom.
 */
export function configuration(electrons, z) {
  const out = [];
  let left = Math.min(Math.max(electrons, 0), MAX_ELECTRONS);
  for (const sub of SUBSHELLS) {
    if (left <= 0) break;
    const count = Math.min(sub.cap, left);
    out.push({ ...sub, type: TYPE[sub.l], count });
    left -= count;
  }
  if (electrons === z && (z === 24 || z === 29)) {
    const s4 = out.find((s) => s.label === "4s");
    const d3 = out.find((s) => s.label === "3d");
    if (s4 && d3) {
      s4.count -= 1;
      d3.count += 1;
    }
  }
  return out.filter((s) => s.count > 0);
}

/** Electrons per shell n, e.g. carbon → [2, 4]. */
export function shellCounts(config) {
  const shells = [];
  for (const s of config) shells[s.n - 1] = (shells[s.n - 1] || 0) + s.count;
  return Array.from(shells, (c) => c || 0);
}

const P_ORDER = ["px", "py", "pz"];
const D_ORDER = ["dz2", "dxz", "dyz", "dxy", "dx2y2"];

/**
 * Individual orbitals with their electron count, filled by Hund’s rule:
 * one electron in each orbital of a subshell before any pairs up.
 */
export function orbitals(config) {
  const list = [];
  for (const s of config) {
    const names = s.l === 0 ? ["s"] : s.l === 1 ? P_ORDER : D_ORDER;
    const k = names.length;
    names.forEach((shape, i) => {
      const e = s.count >= k + i + 1 ? 2 : s.count > i ? 1 : 0;
      if (e > 0) list.push({ key: `${s.n}${shape}`, n: s.n, l: s.l, shape, type: s.type, sub: s.label, electrons: e });
    });
  }
  return list;
}

const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "+": "⁺", "-": "⁻" };
export const sup = (s) => String(s).replace(/[0-9+-]/g, (c) => SUP[c]);

/** "2+", "1−", or "" for a neutral atom. */
export function chargeLabel(charge) {
  if (charge === 0) return "";
  const mag = Math.abs(charge);
  return `${mag === 1 ? "" : mag}${charge > 0 ? "+" : "−"}`;
}

/** Plain-language status of the nucleus. */
export function nucleusStatus(z, n) {
  const el = getElement(z);
  const key = `${z}-${n}`;
  if (RADIOACTIVE[key]) return { stable: false, text: RADIOACTIVE[key] };
  if (el.stable.includes(n)) return { stable: true, text: "Stable. This nucleus can last forever." };
  const far = Math.min(...el.stable.map((s) => Math.abs(s - n)));
  return {
    stable: false,
    text:
      far > 3
        ? "Very unstable. A nucleus this lopsided falls apart almost instantly."
        : "Radioactive. This nucleus will decay into a different one.",
  };
}

/** Nuclear radius in femtometres: R ≈ 1.2 · A^(1/3). */
export const nucleusRadiusFm = (a) => 1.2 * Math.cbrt(Math.max(a, 1));

export function neutronRange(z) {
  const el = getElement(z);
  return { min: 0, max: Math.max(...el.stable) + 6 };
}

export function electronRange(z) {
  return { min: 0, max: Math.min(z + 2, MAX_ELECTRONS) };
}
