"use client";

import { useEffect, useRef } from "react";

/** Canvas-based cursor glow for the About section. */
export default function AboutBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const mouse     = useRef({ x: -9999, y: -9999, on: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* Use the parent <section> for event binding so coordinates
       are always relative to the section, not the viewport. */
    const section = canvas.closest("section") as HTMLElement | null;
    if (!section) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top, on: true };
    };
    const onLeave = () => { mouse.current.on = false; };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mouse.current.on) {
        const { x, y } = mouse.current;

        /* Outer halo */
        const g1 = ctx.createRadialGradient(x, y, 0, x, y, 320);
        g1.addColorStop(0,   "rgba(129,140,248,0.13)");
        g1.addColorStop(0.5, "rgba(99,102,241,0.06)");
        g1.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        /* Inner accent glow */
        const g2 = ctx.createRadialGradient(x, y, 0, x, y, 90);
        g2.addColorStop(0, "rgba(167,139,250,0.18)");
        g2.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
    />
  );
}
