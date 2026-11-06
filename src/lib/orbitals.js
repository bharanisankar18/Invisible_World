/*
 * Electron clouds sampled from hydrogen-like wavefunctions.
 *
 * Each point is a place the electron could be found if you measured it,
 * drawn with probability |ψ|². Radial parts are unnormalised hydrogen
 * R(n,l) in Bohr radii; angular parts are the real (cubic) harmonics, so
 * p and d lobes point along the axes the way textbooks draw them.
 *
 * Real orbitals grow roughly as n², which would hide 1s inside a speck.
 * DISPLAY_POWER compresses radii so inner shells stay visible. The site
 * labels this as a simplification.
 */

const RADIAL = {
  "1,0": (r) => Math.exp(-r),
  "2,0": (r) => (2 - r) * Math.exp(-r / 2),
  "2,1": (r) => r * Math.exp(-r / 2),
  "3,0": (r) => (27 - 18 * r + 2 * r * r) * Math.exp(-r / 3),
  "3,1": (r) => r * (6 - r) * Math.exp(-r / 3),
  "3,2": (r) => r * r * Math.exp(-r / 3),
  "4,0": (r) => (192 - 144 * r + 24 * r * r - r * r * r) * Math.exp(-r / 4),
  "4,1": (r) => r * (80 - 20 * r + r * r) * Math.exp(-r / 4),
};

const R_MAX = { 1: 8, 2: 20, 3: 34, 4: 50 };

/** Angular function on the unit sphere and the max of its square. */
const ANGULAR = {
  s: [() => 1, 1],
  px: [(x) => x, 1],
  py: [(x, y) => y, 1],
  pz: [(x, y, z) => z, 1],
  dz2: [(x, y, z) => 3 * z * z - 1, 4],
  dxz: [(x, y, z) => x * z, 0.25],
  dyz: [(x, y, z) => y * z, 0.25],
  dxy: [(x, y) => x * y, 0.25],
  dx2y2: [(x, y) => x * x - y * y, 1],
};

export const DISPLAY_SCALE = 0.62;
export const DISPLAY_POWER = 0.6;
export const toDisplay = (r) => DISPLAY_SCALE * Math.pow(r, DISPLAY_POWER);

/** Rough outer edge of shell n in display units, used to frame the camera. */
export const cloudExtent = (n) => toDisplay(1.6 * n * n + 1.5 * n);

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

function radialSampler(n, l) {
  const R = RADIAL[`${n},${l}`];
  const max = R_MAX[n];
  const N = 1200;
  const cdf = new Float64Array(N + 1);
  for (let i = 1; i <= N; i++) {
    const r = (i / N) * max;
    const v = R(r);
    cdf[i] = cdf[i - 1] + r * r * v * v;
  }
  const total = cdf[N];
  return (u) => {
    const target = u * total;
    let lo = 0;
    let hi = N;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < target) lo = mid;
      else hi = mid;
    }
    const span = cdf[hi] - cdf[lo] || 1;
    const t = (target - cdf[lo]) / span;
    return ((lo + t) / N) * max;
  };
}

const cache = new Map();

/**
 * Returns { positions, signs, seeds, count } for one orbital.
 * Cached per orbital and point count: the same carbon looks the same each visit.
 */
export function sampleOrbital(n, l, shape, count) {
  const key = `${n}${shape}:${count}`;
  if (cache.has(key)) return cache.get(key);

  const rand = mulberry32(hash(key));
  const sampleR = radialSampler(n, l);
  const R = RADIAL[`${n},${l}`];
  const [Y, yMax] = ANGULAR[shape];

  const positions = new Float32Array(count * 3);
  const signs = new Float32Array(count);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const r = sampleR(rand());
    let x, y, z, a;
    // Rejection-sample a direction from |Y|².
    for (let tries = 0; tries < 200; tries++) {
      const u = rand() * 2 - 1;
      const phi = rand() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      x = s * Math.cos(phi);
      y = s * Math.sin(phi);
      z = u;
      a = Y(x, y, z);
      if (rand() * yMax <= a * a) break;
    }
    const d = toDisplay(r);
    // Physics z (the pz axis) maps to three.js y, so pz stands upright.
    positions[i * 3] = x * d;
    positions[i * 3 + 1] = z * d;
    positions[i * 3 + 2] = y * d;
    signs[i] = R(r) * a >= 0 ? 1 : -1;
    seeds[i] = rand();
  }

  const out = { positions, signs, seeds, count };
  cache.set(key, out);
  return out;
}

/** Wavelength (380–780 nm) to an sRGB hex. Approximation after Dan Bruton. */
export function wavelengthToHex(nm) {
  let r = 0;
  let g = 0;
  let b = 0;
  if (nm >= 380 && nm < 440) {
    r = -(nm - 440) / 60;
    b = 1;
  } else if (nm < 490) {
    g = (nm - 440) / 50;
    b = 1;
  } else if (nm < 510) {
    g = 1;
    b = -(nm - 510) / 20;
  } else if (nm < 580) {
    r = (nm - 510) / 70;
    g = 1;
  } else if (nm < 645) {
    r = 1;
    g = -(nm - 645) / 65;
  } else if (nm <= 780) {
    r = 1;
  }
  let f = 1;
  if (nm >= 380 && nm < 420) f = 0.3 + (0.7 * (nm - 380)) / 40;
  else if (nm > 700 && nm <= 780) f = 0.3 + (0.7 * (780 - nm)) / 80;
  const to = (c) => Math.round(255 * Math.pow(c * f, 0.8)).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}
