"use client";

import { useEffect, useRef } from "react";
import { HiArrowDown } from "react-icons/hi2";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Profile } from "@/sanity/queries";

/* ─── Aurora keyframe animations ──────────────────────────────────── */
const STYLES = `
  @keyframes aurora-drift-1 {
    0%,100% { transform: translate(0%,0%) scale(1); }
    25%      { transform: translate(8%,-12%) scale(1.12); }
    50%      { transform: translate(-6%,6%) scale(0.94); }
    75%      { transform: translate(4%,9%) scale(1.06); }
  }
  @keyframes aurora-drift-2 {
    0%,100% { transform: translate(0%,0%) scale(1); }
    33%      { transform: translate(-10%,7%) scale(1.18); }
    66%      { transform: translate(7%,-9%) scale(0.88); }
  }
  @keyframes aurora-drift-3 {
    0%,100% { transform: translate(0%,0%) scale(1); }
    40%      { transform: translate(12%,12%) scale(1.22); }
    80%      { transform: translate(-11%,-6%) scale(0.84); }
  }
  @keyframes aurora-drift-4 {
    0%,100% { transform: translate(0%,0%) scale(1); }
    50%      { transform: translate(-16%,14%) scale(1.3); }
  }
  @keyframes hero-badge-in {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;

interface Props {
  locale: Locale;
  dict: Dictionary;
  profile?: Profile | null;
}

export default function Hero({ locale, dict, profile }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef     = useRef<number>(0);
  const mouseRef   = useRef({ x: -9999, y: -9999, inside: false });

  /* ── Starfield + meteors (Canvas 2D — no WebGL) ─────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      window.innerWidth < 768;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* Stars */
    const STAR_COUNT = isMobile ? 70 : 200;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.3 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.9 + 0.3,
      cross: Math.random() > 0.75,
    }));

    /* Meteors — desktop only */
    const METEOR_COUNT = isMobile ? 0 : 7;
    type Meteor = {
      x: number; y: number; len: number;
      speed: number; delay: number; prog: number;
    };
    const meteors: Meteor[] = Array.from({ length: METEOR_COUNT }, () => ({
      x:     Math.random() * canvas.width * 1.6,
      y:     Math.random() * canvas.height * 0.4,
      len:   Math.random() * 130 + 60,
      speed: Math.random() * 4 + 2,
      delay: Math.random() * 10,
      prog:  -1,
    }));

    let t = 0;

    /* Cursor sparks */
    type Spark = { x: number; y: number; vx: number; vy: number; alpha: number; r: number };
    const sparks: Spark[] = [];
    const mouse = mouseRef.current;

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.016;

      /* ── Cursor glow (drawn first, behind stars) ── */
      if (!isMobile && mouse.inside) {
        const g1 = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 220,
        );
        g1.addColorStop(0,    "rgba(139,92,246,0.18)");
        g1.addColorStop(0.45, "rgba(99,102,241,0.09)");
        g1.addColorStop(1,    "rgba(0,0,0,0)");
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        /* Second ring — cyan accent */
        const g2 = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 90,
        );
        g2.addColorStop(0,   "rgba(34,211,238,0.14)");
        g2.addColorStop(0.6, "rgba(99,102,241,0.06)");
        g2.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        /* Bright core dot */
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,180,255,0.7)";
        ctx.fill();

        /* Spawn sparks */
        if (Math.random() > 0.35) {
          sparks.push({
            x:     mouse.x + (Math.random() - 0.5) * 18,
            y:     mouse.y + (Math.random() - 0.5) * 18,
            vx:    (Math.random() - 0.5) * 1.2,
            vy:    -(Math.random() * 1.8 + 0.6),
            alpha: Math.random() * 0.5 + 0.4,
            r:     Math.random() * 1.6 + 0.4,
          });
        }
      }

      /* ── Draw + update sparks ── */
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy  += 0.04; // gentle gravity
        s.alpha -= 0.022;
        if (s.alpha <= 0) { sparks.splice(i, 1); continue; }

        /* Purple → cyan color shift as spark fades */
        const hue = 260 + (1 - s.alpha) * 70; // 260 violet → 330 cyan-ish
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 90%, 75%, ${s.alpha})`;
        ctx.fill();
      }

      /* ── Twinkling stars ── */
      for (const s of stars) {
        const alpha = ((Math.sin(t * s.speed + s.phase) + 1) / 2) * 0.75 + 0.25;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.9})`;
        ctx.fill();

        if (s.cross && s.r > 0.8) {
          ctx.strokeStyle = `rgba(200,210,255,${alpha * 0.25})`;
          ctx.lineWidth = 0.5;
          const arm = s.r * 3.5;
          ctx.beginPath();
          ctx.moveTo(s.x - arm, s.y); ctx.lineTo(s.x + arm, s.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(s.x, s.y - arm); ctx.lineTo(s.x, s.y + arm);
          ctx.stroke();
        }
      }

      /* ── Meteors ── */
      for (const m of meteors) {
        m.delay -= 0.016;
        if (m.delay > 0) continue;

        m.prog += m.speed;
        if (m.prog > canvas.width + canvas.height) {
          m.prog  = -1;
          m.x     = Math.random() * canvas.width * 1.6;
          m.y     = Math.random() * canvas.height * 0.35;
          m.delay = Math.random() * 7 + 3;
        }

        const px = m.x - m.prog * 0.7;
        const py = m.y + m.prog * 0.7;
        const ex = px + m.len * 0.7;
        const ey = py - m.len * 0.7;

        const g = ctx.createLinearGradient(px, py, ex, ey);
        g.addColorStop(0,   "rgba(255,255,255,0)");
        g.addColorStop(0.6, "rgba(180,200,255,0.55)");
        g.addColorStop(1,   "rgba(255,255,255,0.95)");

        ctx.save();
        ctx.strokeStyle = g;
        ctx.lineWidth   = 1.8;
        ctx.shadowColor = "rgba(180,200,255,0.6)";
        ctx.shadowBlur  = 4;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ── Mouse tracking — updates mouseRef, no re-renders ───────────── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      mouseRef.current.x      = e.clientX - r.left;
      mouseRef.current.y      = e.clientY - r.top;
      mouseRef.current.inside = true;
    };
    const onLeave = () => { mouseRef.current.inside = false; };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <section
        id="hero"
        ref={sectionRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, #0e0825 0%, #040012 55%, #000000 100%)",
        }}
      >
        {/* ── Aurora orb 1 — violet (large, top-left) ──────────────── */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "90vw", height: "70vh",
            top: "-25%", left: "-25%",
            background:
              "radial-gradient(ellipse, rgba(139,92,246,0.38) 0%, rgba(109,40,217,0.15) 40%, transparent 70%)",
            filter: "blur(55px)",
            animation: "aurora-drift-1 20s ease-in-out infinite",
          }}
        />

        {/* ── Aurora orb 2 — cyan (bottom-right) ───────────────────── */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "75vw", height: "60vh",
            bottom: "-15%", right: "-20%",
            background:
              "radial-gradient(ellipse, rgba(6,182,212,0.32) 0%, rgba(14,116,144,0.12) 40%, transparent 70%)",
            filter: "blur(65px)",
            animation: "aurora-drift-2 16s ease-in-out infinite",
          }}
        />

        {/* ── Aurora orb 3 — rose (top-right) ──────────────────────── */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "55vw", height: "45vh",
            top: "5%", right: "-5%",
            background:
              "radial-gradient(ellipse, rgba(236,72,153,0.22) 0%, transparent 65%)",
            filter: "blur(70px)",
            animation: "aurora-drift-3 24s ease-in-out infinite",
          }}
        />

        {/* ── Aurora orb 4 — deep indigo (bottom-left) ─────────────── */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "50vw", height: "40vh",
            bottom: "5%", left: "5%",
            background:
              "radial-gradient(ellipse, rgba(79,70,229,0.28) 0%, transparent 65%)",
            filter: "blur(55px)",
            animation: "aurora-drift-4 18s ease-in-out infinite",
          }}
        />

        {/* ── Centre hero glow ──────────────────────────────────────── */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "60vw", height: "50vh",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(ellipse, rgba(120,80,255,0.12) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />

        {/* ── Starfield + meteors (Canvas 2D) ──────────────────────── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* ── Subtle dot grid ───────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />


        {/* ── Dark vignette ─────────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* ── Header fade ───────────────────────────────────────────── */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

        {/* ── Bottom section fade ───────────────────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 h-48 hidden dark:block bg-gradient-to-t from-background to-transparent pointer-events-none" />

        {/* ── Hero Content ─────────────────────────────────────────── */}
        <div
          className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto select-none"
          style={{ animation: "hero-badge-in 0.8s ease both" }}
        >
          {/* Availability badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-400/20 bg-violet-900/20 backdrop-blur-sm text-violet-200/80 text-xs font-medium mb-8 tracking-wider uppercase shadow-lg shadow-violet-900/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Freelance için müsait
          </div>

          {/* Greeting */}
          <p className="text-white/40 text-lg sm:text-xl font-light tracking-widest mb-3 uppercase">
            {dict.hero.greeting}
          </p>

          {/* Name */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Yunus Emre
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #a78bfa 0%, #818cf8 30%, #38bdf8 70%, #22d3ee 100%)",
              }}
            >
              Aytekin
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-white/55 text-base sm:text-lg lg:text-xl font-light max-w-xl mt-2 mb-10 leading-relaxed">
            {profile?.shortBio?.[locale] ||
              profile?.shortBio?.en ||
              dict.hero.tagline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm active:scale-95 transition-all duration-200"
              style={{
                background:
                  "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0891b2 100%)",
                boxShadow: "0 0 24px rgba(139,92,246,0.4), 0 0 48px rgba(139,92,246,0.15)",
                color: "#fff",
              }}
            >
              {dict.hero.cta}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/80 font-medium text-sm hover:bg-white/10 hover:border-white/25 active:scale-95 transition-all duration-200"
            >
              {dict.hero.ctaSecondary}
            </a>
          </div>
        </div>

        {/* ── Scroll indicator ─────────────────────────────────────── */}
        <a
          href="#portfolio"
          aria-label="Aşağı kaydır"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/25 hover:text-white/60 transition-colors duration-300"
        >
          <HiArrowDown className="w-5 h-5 animate-bounce" />
        </a>
      </section>
    </>
  );
}
