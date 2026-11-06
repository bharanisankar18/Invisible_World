import { useEffect, useRef } from "react";

/*
 * Simulated cloud-chamber tracks. In a real chamber a magnet bends charged
 * particles: negative ones curl one way, positive ones the other, and slow
 * ones spiral tighter as they lose energy. Fast muons barely bend. Alpha
 * particles leave short, thick tracks. Neutral particles leave nothing, so a
 * "V" appears out of empty space when one decays into two charged ones.
 */

const NEG = "79,227,255"; // electron cyan
const POS = "255,93,115"; // proton coral
const FAST = "214,224,255"; // muon, pale

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Curling polyline; radius shrinks along its length as the particle slows. */
function curl(x, y, angle, sign, r0, maxLen, shrink, step = 2.2) {
  const pts = [x, y];
  let a = angle;
  for (let s = 0; s < maxLen; s += step) {
    const r = r0 * Math.max(0.015, 1 - (s / maxLen) * shrink);
    if (r < 2.4) break;
    a += (sign * step) / r;
    x += Math.cos(a) * step;
    y += Math.sin(a) * step;
    pts.push(x, y);
  }
  return pts;
}

function track(pts, color, width, drawDur, now, delay = 0) {
  return { pts, color, width, drawDur, born: now + delay, fade: rand(2.8, 4.4) };
}

function electron(x, y, now, delay = 0, small = false) {
  const sign = Math.random() < 0.6 ? 1 : -1; // more electrons than positrons
  const r0 = small ? rand(10, 26) : rand(70, 190);
  const len = small ? rand(50, 110) : rand(300, 680);
  return track(curl(x, y, rand(0, Math.PI * 2), sign, r0, len, 0.985), sign > 0 ? NEG : POS, small ? 1.2 : 1.6, small ? 0.35 : rand(0.9, 1.5), now, delay);
}

function muon(w, h, now) {
  const fromLeft = Math.random() < 0.5;
  const x = fromLeft ? -20 : w + 20;
  const y = rand(0.05, 0.95) * h;
  const angle = (fromLeft ? 0 : Math.PI) + rand(-0.5, 0.5);
  const len = Math.hypot(w, h) * 1.1;
  const sign = Math.random() < 0.5 ? 1 : -1;
  const pts = curl(x, y, angle, sign, rand(2600, 5200), len, 0, 6);
  const out = [track(pts, FAST, 1.1, 0.45, now)];
  // Delta rays: the muon knocks loose electrons that curl off its path.
  const n = Math.floor(rand(1, 3));
  for (let i = 0; i < n; i++) {
    const k = Math.floor(rand(0.15, 0.85) * (pts.length / 2));
    const px = pts[k * 2];
    const py = pts[k * 2 + 1];
    if (px > 0 && px < w && py > 0 && py < h) {
      out.push(electron(px, py, now, (k / (pts.length / 2)) * 0.45, true));
    }
  }
  return out;
}

function alphaBurst(x, y, now) {
  return Array.from({ length: Math.floor(rand(3, 6)) }, (_, i) => {
    const a = rand(0, Math.PI * 2);
    const len = rand(40, 110);
    const pts = [];
    for (let s = 0; s <= len; s += 3) pts.push(x + Math.cos(a) * s, y + Math.sin(a) * s);
    return track(pts, POS, 3.2, 0.22, now, i * 0.12);
  });
}

function vDecay(x, y, now) {
  const a = rand(0, Math.PI * 2);
  const spread = rand(0.18, 0.4);
  return [
    track(curl(x, y, a - spread, 1, rand(140, 320), rand(200, 380), 0.55), NEG, 1.5, rand(0.6, 0.9), now),
    track(curl(x, y, a + spread, -1, rand(140, 320), rand(200, 380), 0.55), POS, 1.5, rand(0.6, 0.9), now),
  ];
}

export default function ChamberField({ fireRef }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tracks = [];
    let ripples = [];
    let w = 0;
    let h = 0;
    let frame = 0;
    let running = false;
    let nextSpawn = 0;
    const t0 = performance.now();
    const clock = () => (performance.now() - t0) / 1000;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) paint(clock());
    };

    // Spawn mostly to the right, where the headline isn't.
    const spot = () => [rand(w < 768 ? 0.05 : 0.38, 0.96) * w, rand(0.08, 0.92) * h];

    const spawn = (now) => {
      const kind = pick(["e", "e", "e", "mu", "mu", "v", "a"]);
      const [x, y] = spot();
      if (kind === "e") tracks.push(electron(x, y, now));
      else if (kind === "mu") tracks.push(...muon(w, h, now));
      else if (kind === "v") tracks.push(...vDecay(x, y, now));
      else tracks.push(...alphaBurst(x, y, now));
      if (tracks.length > 60) tracks = tracks.slice(-60);
    };

    // The opening: a burst of activity, then a steady trickle.
    const opening = (now) => {
      tracks.push(...muon(w, h, now + 0.05));
      const at = [
        [0.2, "e"],
        [0.45, "a"],
        [0.7, "v"],
        [0.95, "e"],
        [1.25, "e"],
        [1.6, "mu"],
      ];
      for (const [d, kind] of at) {
        const [x, y] = spot();
        if (kind === "e") tracks.push(electron(x, y, now, d));
        else if (kind === "a") tracks.push(...alphaBurst(x, y, now + d));
        else if (kind === "v") tracks.push(...vDecay(x, y, now + d));
        else tracks.push(...muon(w, h, now + d));
      }
      nextSpawn = now + 2.2;
    };

    function paint(now) {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const tr of tracks) {
        const since = now - tr.born;
        if (since < 0) continue;
        const progress = reduce ? 1 : Math.min(1, since / tr.drawDur);
        const age = reduce ? 0.6 : since - tr.drawDur;
        const alpha = reduce ? 0.6 : age <= 0 ? 1 : Math.max(0, 1 - age / tr.fade);
        if (alpha <= 0) continue;
        const count = Math.max(2, Math.floor((tr.pts.length / 2) * progress));
        const spread = 1 + Math.max(0, age) * 0.5; // vapour trails diffuse as they age

        ctx.beginPath();
        ctx.moveTo(tr.pts[0], tr.pts[1]);
        for (let i = 1; i < count; i++) ctx.lineTo(tr.pts[i * 2], tr.pts[i * 2 + 1]);

        ctx.strokeStyle = `rgba(${tr.color},${0.07 * alpha})`;
        ctx.lineWidth = tr.width * 6 * spread;
        ctx.stroke();
        ctx.strokeStyle = `rgba(${tr.color},${0.85 * alpha})`;
        ctx.lineWidth = tr.width * spread;
        ctx.stroke();

        if (progress < 1) {
          const hx = tr.pts[(count - 1) * 2];
          const hy = tr.pts[(count - 1) * 2 + 1];
          ctx.fillStyle = "rgba(255,255,255,0.95)";
          ctx.beginPath();
          ctx.arc(hx, hy, tr.width * 1.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      for (const r of ripples) {
        const k = (now - r.born) / 0.7;
        if (k > 1) continue;
        ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - k)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 6 + k * 46, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    const step = () => {
      const now = clock();
      if (now > nextSpawn) {
        spawn(now);
        nextSpawn = now + rand(0.7, 1.5);
      }
      tracks = tracks.filter((tr) => now - tr.born < tr.drawDur + tr.fade);
      ripples = ripples.filter((r) => now - r.born < 0.7);
      paint(now);
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      frame = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    if (fireRef) {
      fireRef.current = (x, y) => {
        const now = clock();
        ripples.push({ x, y, born: now });
        tracks.push(...vDecay(x, y, now + 0.05), electron(x, y, now + 0.2));
        if (reduce) paint(now + 10);
      };
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (reduce) {
      // A still photograph of the chamber instead of a film.
      for (let i = 0; i < 5; i++) {
        const [x, y] = spot();
        tracks.push(electron(x, y, -10));
      }
      tracks.push(...muon(w, h, -10), ...muon(w, h, -10), ...vDecay(...spot(), -10), ...alphaBurst(...spot(), -10));
      paint(0);
    } else {
      opening(clock());
    }

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (fireRef) fireRef.current = null;
    };
  }, [fireRef]);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}
