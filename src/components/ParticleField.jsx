import { useEffect, useRef } from "react";

export default function ParticleField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    let frame;
    let running = true;
    let mouse = { x: -1, y: -1 };

    const COLORS = [
      "56, 189, 248",  // cyan
      "129, 140, 248",  // indigo
      "167, 139, 250",  // purple
      "52, 211, 153",   // emerald (rare)
    ];

    const dots = Array.from({ length: reduce ? 30 : 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 2,
      v: 0.0001 + Math.random() * 0.0003,
      vx: (Math.random() - 0.5) * 0.0002,
      phase: Math.random() * Math.PI * 2,
      color: COLORS[Math.random() < 0.1 ? 3 : Math.floor(Math.random() * 3)],
      alpha: 0.15 + Math.random() * 0.3,
      pulseSpeed: 0.002 + Math.random() * 0.004,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", () => {
      mouse.x = -1;
      mouse.y = -1;
    });

    const draw = (time) => {
      if (!running) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      dots.forEach((d) => {
        if (!reduce) {
          d.y -= d.v;
          d.x += Math.sin(d.phase) * 0.00015 + d.vx;
          d.phase += d.pulseSpeed;
          if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); }
          if (d.x < -0.02) d.x = 1.02;
          if (d.x > 1.02) d.x = -0.02;
        }

        const px = d.x * w;
        const py = d.y * h;
        const pulseFactor = 0.7 + 0.3 * Math.sin(time * 0.001 + d.phase);
        let alpha = d.alpha * pulseFactor;

        // Mouse interaction – particles glow brighter near cursor
        if (mouse.x >= 0) {
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            alpha = Math.min(0.8, alpha + (1 - dist / 150) * 0.5);
          }
        }

        // Draw glow
        const gradient = ctx.createRadialGradient(px, py, 0, px, py, d.r * 4);
        gradient.addColorStop(0, `rgba(${d.color}, ${alpha})`);
        gradient.addColorStop(1, `rgba(${d.color}, 0)`);
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(px, py, d.r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.fillStyle = `rgba(${d.color}, ${alpha * 1.5})`;
        ctx.arc(px, py, d.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connection lines between nearby particles
      if (!reduce) {
        for (let i = 0; i < dots.length; i++) {
          for (let j = i + 1; j < dots.length; j++) {
            const dx = (dots[i].x - dots[j].x) * w;
            const dy = (dots[i].y - dots[j].y) * h;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              const lineAlpha = (1 - dist / 100) * 0.08;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(dots[i].x * w, dots[i].y * h);
              ctx.lineTo(dots[j].x * w, dots[j].y * h);
              ctx.stroke();
            }
          }
        }
      }

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "auto" }}
      aria-hidden="true"
    />
  );
}
