import { useEffect, useRef } from "react";

/*
 * Signature move (DESIGN.md): a sparse azure particle field behind the landing
 * headline that drifts, decelerates, then holds still. One hue, no glow.
 */
const SETTLE_MS = 4200;

export default function ParticleField({ count = 46 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    let frame = 0;
    let start = 0;

    const dots = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.00045,
      vy: -0.0002 - Math.random() * 0.0004,
      a: 0.18 + Math.random() * 0.5,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
    };

    function paint() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(77, 178, 255, ${d.a})`;
        ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const step = (t) => {
      if (!start) start = t;
      const k = Math.max(0, 1 - (t - start) / SETTLE_MS);
      const damp = k * k * (3 - 2 * k); // smooth ease to zero
      for (const d of dots) {
        d.x += d.vx * damp;
        d.y += d.vy * damp;
        if (d.y < -0.02) d.y = 1.02;
        if (d.x < -0.02) d.x = 1.02;
        if (d.x > 1.02) d.x = -0.02;
      }
      paint();
      if (damp > 0) frame = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduce) frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}
