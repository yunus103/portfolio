"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";

/* ─── Inline keyframes ───────────────────────────────────────────────────── */
const STYLES = `
  /* ── Flowing light meteor — slides top → bottom ───────── */
  @keyframes hiw-meteor-fall {
    0%   { top: -8%;  opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 1; }
    100% { top: 108%; opacity: 0; }
  }
  @keyframes hiw-meteor-fall-2 {
    0%   { top: -8%;  opacity: 0; }
    8%   { opacity: 0.6; }
    92%  { opacity: 0.6; }
    100% { top: 108%; opacity: 0; }
  }

  /* ── Orbital ring spins ───────────────────────────────── */
  @keyframes hiw-ring-cw {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes hiw-ring-ccw {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }

  /* ── Node pulse glow ─────────────────────────────────── */
  @keyframes hiw-orb-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(129,140,248,0.5), 0 0 16px 4px rgba(129,140,248,0.25); }
    50%       { box-shadow: 0 0 0 8px rgba(129,140,248,0), 0 0 32px 10px rgba(129,140,248,0.1); }
  }

  /* ── Background glow drift ───────────────────────────── */
  @keyframes hiw-glow-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%      { transform: translate(5%, -7%) scale(1.08); }
    66%      { transform: translate(-4%, 4%) scale(0.94); }
  }

  /* ── Reveal animations ───────────────────────────────── */
  @keyframes hiw-slide-left {
    from { opacity: 0; transform: translateX(-56px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes hiw-slide-right {
    from { opacity: 0; transform: translateX(56px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes hiw-fade-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes hiw-scale-in {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes hiw-tag-in {
    from { opacity: 0; transform: translateY(6px) scale(0.9); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── Card glass style ────────────────────────────────── */
  .hiw-card {
    position: relative;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.07);
    background: rgba(255, 255, 255, 0.028);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 2.25rem 2rem;
    overflow: hidden;
    transition: border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease;
  }
  .hiw-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    background: linear-gradient(
      135deg,
      rgba(129, 140, 248, 0.07) 0%,
      transparent 55%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  .hiw-card:hover {
    border-color: rgba(129, 140, 248, 0.25);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 8px 60px -12px rgba(129, 140, 248, 0.22),
                0 0 0 1px rgba(129, 140, 248, 0.06);
  }
  .hiw-card:hover::before { opacity: 1; }

  /* ── Big decorative ordinal ─────────────────────────── */
  .hiw-num {
    position: absolute;
    right: 1.25rem;
    top: 0.25rem;
    font-size: clamp(4.5rem, 8vw, 7rem);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.06em;
    background: linear-gradient(180deg, rgba(129,140,248,0.13) 0%, rgba(129,140,248,0.01) 80%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    user-select: none;
    pointer-events: none;
  }

  /* ── Ring spins ─────────────────────────────────────── */
  .hiw-ring-cw  { animation: hiw-ring-cw  18s linear infinite; }
  .hiw-ring-ccw { animation: hiw-ring-ccw 12s linear infinite; }
`;

/* ─── Step data ─────────────────────────────────────────────────────────── */
const STEPS_TR = [
  {
    num: "01",
    phase: "Keşif & Planlama",
    title: "Önce Dinliyorum",
    body: "Projenin ruhunu anlamadan tek satır kod yazmıyorum. Hedeflerinizi, kullanıcılarınızı ve kısıtlamalarınızı derinlemesine sorguluyor; teknik kararlarımı o temele inşa ediyorum.",
    tags: ["Briefing", "User Research", "Scope Definition", "Wireframe"],
    accent: "#818cf8",
    glow: "rgba(129,140,248,0.35)",
  },
  {
    num: "02",
    phase: "Mimari & Tasarım",
    title: "Sistemi Tasarlıyorum",
    body: "Veri akışını, bileşen hiyerarşisini ve API sözleşmelerini kağıda döküyorum. Tasarım sistemi ve teknik mimari el ele yürür — görsel güzellik ve kod kalitesi hiç çatışmaz.",
    tags: ["System Design", "Design System", "DB Schema", "API Contract"],
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.35)",
  },
  {
    num: "03",
    phase: "Geliştirme",
    title: "Hız + Kalite",
    body: "TypeScript, React ve modern toolchain ile yüksek hızda fakat sürdürülebilir kod yazıyorum. Her commit çalışır; her özellik test edilir. Teknik borcu ilk günden reddediyorum.",
    tags: ["Next.js", "TypeScript", "CI/CD", "Code Review"],
    accent: "#38bdf8",
    glow: "rgba(56,189,248,0.35)",
  },
  {
    num: "04",
    phase: "Test & Yayın",
    title: "Canlıya Almak",
    body: "Performans, erişilebilirlik ve çapraz tarayıcı testlerinin ardından sıfır kesinti ile deploy ediyorum. İş bitmiyor — yayın sonrası izleme ve iterasyon sürecin ayrılmaz parçası.",
    tags: ["Lighthouse", "A11y", "Vercel", "Monitoring"],
    accent: "#34d399",
    glow: "rgba(52,211,153,0.35)",
  },
];

const STEPS_EN = [
  {
    num: "01",
    phase: "Discovery & Planning",
    title: "I Listen First",
    body: "I don't write a single line of code before understanding the soul of your project. I deeply question your goals, users, and constraints — then build every technical decision on that foundation.",
    tags: ["Briefing", "User Research", "Scope Definition", "Wireframe"],
    accent: "#818cf8",
    glow: "rgba(129,140,248,0.35)",
  },
  {
    num: "02",
    phase: "Architecture & Design",
    title: "I Design the System",
    body: "I map data flows, component hierarchies, and API contracts before touching code. Design system and technical architecture walk hand in hand — visual beauty and code quality never conflict.",
    tags: ["System Design", "Design System", "DB Schema", "API Contract"],
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.35)",
  },
  {
    num: "03",
    phase: "Development",
    title: "Speed + Quality",
    body: "I write sustainable code at high velocity using TypeScript, React, and a modern toolchain. Every commit works; every feature is tested. I reject technical debt from day one.",
    tags: ["Next.js", "TypeScript", "CI/CD", "Code Review"],
    accent: "#38bdf8",
    glow: "rgba(56,189,248,0.35)",
  },
  {
    num: "04",
    phase: "Testing & Launch",
    title: "Going Live",
    body: "After performance, accessibility, and cross-browser testing, I deploy with zero downtime. The work doesn't stop — post-launch monitoring and iteration are integral parts of the process.",
    tags: ["Lighthouse", "A11y", "Vercel", "Monitoring"],
    accent: "#34d399",
    glow: "rgba(52,211,153,0.35)",
  },
];

/* ─── Component ─────────────────────────────────────────────────────────── */
interface Props {
  locale: Locale;
  dict: Dictionary;
}

export default function HowIWork({ locale, dict }: Props) {
  const steps = locale === "tr" ? STEPS_TR : STEPS_EN;
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Scroll reveal: each .hiw-step ─────────────────────────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const applyReveal = (el: HTMLElement) => {
      el.style.setProperty("--revealed", "1");
      el.classList.add("hiw-revealed");
    };

    const stepEls = section.querySelectorAll<HTMLElement>(".hiw-step");

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            applyReveal(e.target as HTMLElement);
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
    );

    stepEls.forEach((el) => obs.observe(el));

    /* Fallback: if already in viewport on mount (e.g. anchor jump), reveal immediately */
    const fallback = setTimeout(() => {
      stepEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.98) {
          applyReveal(el);
          obs.unobserve(el);
        }
      });
    }, 120);

    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <section
        id="how-i-work"
        ref={sectionRef}
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 55% 20%, #08102a 0%, #04080f 55%, #000000 100%)",
        }}
      >
        {/* ── Background: circuit grid ──────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(129,140,248,0.065) 1px, transparent 1px),
              linear-gradient(90deg, rgba(129,140,248,0.065) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />

        {/* ── Aurora orb — top right ────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "72vw",
            height: "56vh",
            top: "-8%",
            right: "-18%",
            background:
              "radial-gradient(ellipse, rgba(129,140,248,0.24) 0%, rgba(79,70,229,0.09) 46%, transparent 72%)",
            filter: "blur(80px)",
            animation: "hiw-glow-drift 24s ease-in-out infinite",
          }}
        />

        {/* ── Aurora orb — bottom left ──────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "60vw",
            height: "50vh",
            bottom: "-10%",
            left: "-14%",
            background:
              "radial-gradient(ellipse, rgba(56,189,248,0.18) 0%, rgba(6,182,212,0.07) 46%, transparent 72%)",
            filter: "blur(90px)",
            animation: "hiw-glow-drift 30s ease-in-out infinite reverse",
          }}
        />

        {/* ── Noise texture ─────────────────────────────────────────────── */}
        <div className="noise-overlay" />

        {/* ── Section handoff bridges ─────────────────────────────────── */}
        <div className="section-bridge-top z-[2]" />
        <div className="section-bridge-bottom z-[2]" />

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  CONTENT                                                      */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

          {/* ── Section header ──────────────────────────────────────────── */}
          <div
            className="text-center mb-20 lg:mb-28"
            style={{ animation: "hiw-fade-up 0.9s cubic-bezier(.22,1,.36,1) both" }}
          >
            <p className="text-[11px] font-semibold tracking-[0.36em] uppercase text-primary/60 mb-3">
              {dict.howIWork.subtitle}
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {dict.howIWork.title}
            </h2>
            <div className="mt-4 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-primary/55 to-transparent" />
            <p className="mt-5 text-white/40 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              {locale === "tr"
                ? "Fikrinden lansmana giden yolda her adım bilinçli, her karar ölçülü."
                : "From idea to launch — every step deliberate, every decision measured."}
            </p>
          </div>

          {/* ── Timeline ────────────────────────────────────────────────── */}
          <div className="relative">

            {/* ── Central vertical rail + flowing light (desktop only) ──── */}
            <div
              aria-hidden="true"
              className="absolute hidden lg:block pointer-events-none"
              style={{
                left: "calc(50% - 1px)",
                top: "24px",
                bottom: "24px",
                width: "2px",
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(129,140,248,0.2) 8%, rgba(129,140,248,0.2) 92%, transparent 100%)",
              }}
            >
              {/* Meteor 1 — primary (purple) */}
              <div
                style={{
                  position: "absolute",
                  left: "-2px",
                  width: "6px",
                  height: "80px",
                  borderRadius: "9999px",
                  background:
                    "linear-gradient(to bottom, transparent 0%, rgba(167,139,250,0.1) 20%, rgba(129,140,248,0.95) 50%, rgba(167,139,250,0.1) 80%, transparent 100%)",
                  boxShadow: "0 0 12px 4px rgba(129,140,248,0.5)",
                  animation: "hiw-meteor-fall 3.2s ease-in-out infinite",
                }}
              />
              {/* Meteor 2 — cyan, delayed */}
              <div
                style={{
                  position: "absolute",
                  left: "-1px",
                  width: "4px",
                  height: "48px",
                  borderRadius: "9999px",
                  background:
                    "linear-gradient(to bottom, transparent 0%, rgba(56,189,248,0.85) 50%, transparent 100%)",
                  boxShadow: "0 0 8px 3px rgba(56,189,248,0.4)",
                  animation: "hiw-meteor-fall-2 4.8s ease-in-out infinite",
                  animationDelay: "1.6s",
                }}
              />
            </div>

            {/* ── Steps ───────────────────────────────────────────────── */}
            <div className="flex flex-col gap-16 lg:gap-24">
              {steps.map((step, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <StepRow
                    key={step.num}
                    step={step}
                    index={i}
                    isLeft={isLeft}
                  />
                );
              })}
            </div>
          </div>

          {/* ── Bottom CTA ──────────────────────────────────────────────── */}
          <div
            className="mt-24 lg:mt-32 flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{
              animation: "hiw-fade-up 0.9s cubic-bezier(.22,1,.36,1) both",
              animationDelay: "0.3s",
            }}
          >
            <div
              className="px-8 py-5 rounded-2xl text-center"
              style={{
                border: "1px solid rgba(129,140,248,0.18)",
                background: "rgba(129,140,248,0.05)",
                backdropFilter: "blur(12px)",
              }}
            >
              <p className="text-white/35 text-[10px] tracking-[0.25em] uppercase mb-1.5">
                {locale === "tr" ? "Hazır mısınız?" : "Ready to start?"}
              </p>
              <p className="text-white/80 font-semibold text-base sm:text-lg">
                {locale === "tr"
                  ? "Projenizi birlikte hayata geçirelim."
                  : "Let's bring your project to life together."}
              </p>
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-sm text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0891b2 100%)",
                boxShadow:
                  "0 0 28px rgba(139,92,246,0.45), 0 0 56px rgba(139,92,246,0.15)",
              }}
            >
              {locale === "tr" ? "Projeyi Başlatalım" : "Start a Project"}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── StepRow ────────────────────────────────────────────────────────────── */
function StepRow({
  step,
  index,
  isLeft,
}: {
  step: (typeof STEPS_TR)[number];
  index: number;
  isLeft: boolean;
}) {
  const delay = index * 0.1;

  return (
    <div className="hiw-step group/row">
      {/* ── Desktop layout (lg+) ───────────────────────────────────────── */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_88px_1fr] items-center gap-8">
        {/* Left slot */}
        <div className="flex justify-end">
          {isLeft ? (
            <RevealCard
              step={step}
              direction="left"
              delay={delay}
            />
          ) : (
            <div />
          )}
        </div>

        {/* Center node */}
        <div className="flex items-center justify-center">
          <CenterNode step={step} delay={delay} />
        </div>

        {/* Right slot */}
        <div className="flex justify-start">
          {!isLeft ? (
            <RevealCard
              step={step}
              direction="right"
              delay={delay}
            />
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* ── Mobile layout (<lg) ────────────────────────────────────────── */}
      <div className="lg:hidden">
        <MobileStep step={step} delay={delay} />
      </div>
    </div>
  );
}

/* ─── RevealCard (desktop) ───────────────────────────────────────────────── */
function RevealCard({
  step,
  direction,
  delay,
}: {
  step: (typeof STEPS_TR)[number];
  direction: "left" | "right";
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      el.style.opacity = "1";
      el.style.transform = "translateX(0)";
    };

    /* Immediate check — for anchor-jump scenarios */
    const immediate = setTimeout(() => {
      const parent = el.closest(".hiw-step");
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) reveal();
    }, 80 + delay * 1000);

    /* Also listen via parent's hiw-revealed class polling */
    const interval = setInterval(() => {
      const parent = el.closest(".hiw-step");
      if (parent?.classList.contains("hiw-revealed")) {
        reveal();
        clearInterval(interval);
      }
    }, 60);

    return () => {
      clearTimeout(immediate);
      clearInterval(interval);
    };
  }, [delay]);

  const fromX = direction === "left" ? "-56px" : "56px";

  return (
    <div
      ref={ref}
      className="hiw-card w-full max-w-[420px] xl:max-w-[460px]"
      style={{
        opacity: 0,
        transform: `translateX(${fromX})`,
        transition: `opacity 0.8s cubic-bezier(.22,1,.36,1) ${delay + 0.1}s, transform 0.8s cubic-bezier(.22,1,.36,1) ${delay + 0.1}s`,
      }}
    >
      <CardContent step={step} />
    </div>
  );
}

/* ─── CenterNode (desktop) ───────────────────────────────────────────────── */
function CenterNode({
  step,
  delay,
}: {
  step: (typeof STEPS_TR)[number];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      el.style.opacity = "1";
      el.style.transform = "scale(1)";
    };

    const immediate = setTimeout(() => {
      const parent = el.closest(".hiw-step");
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) reveal();
    }, 80 + delay * 1000);

    const interval = setInterval(() => {
      const parent = el.closest(".hiw-step");
      if (parent?.classList.contains("hiw-revealed")) {
        reveal();
        clearInterval(interval);
      }
    }, 60);

    return () => {
      clearTimeout(immediate);
      clearInterval(interval);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center"
      style={{
        width: 72,
        height: 72,
        opacity: 0,
        transform: "scale(0.6)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {/* Outer dashed ring — slow CW */}
      <div
        className="hiw-ring-cw absolute inset-0 rounded-full"
        style={{ border: `1.5px dashed ${step.accent}40` }}
      />
      {/* Inner solid ring — fast CCW */}
      <div
        className="hiw-ring-ccw absolute rounded-full"
        style={{
          inset: "10px",
          border: `1px solid ${step.glow}`,
        }}
      />
      {/* Orbit dot */}
      <div
        className="hiw-ring-cw absolute"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: step.accent,
          boxShadow: `0 0 8px 3px ${step.glow}`,
          top: 4,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      {/* Core pill */}
      <div
        className="relative z-10 flex items-center justify-center rounded-full font-mono font-black text-xs"
        style={{
          width: 46,
          height: 46,
          background: `radial-gradient(circle at 35% 35%, ${step.glow} 0%, #070b1a 65%)`,
          border: `2px solid ${step.accent}80`,
          color: step.accent,
          animation: "hiw-orb-pulse 3s ease-in-out infinite",
          animationDelay: `${delay}s`,
        }}
      >
        {step.num}
      </div>
    </div>
  );
}

/* ─── MobileStep ─────────────────────────────────────────────────────────── */
function MobileStep({
  step,
  delay,
}: {
  step: (typeof STEPS_TR)[number];
  delay: number;
}) {
  return (
    <div
      className="flex flex-col gap-4"
      style={{
        animation: `hiw-fade-up 0.8s cubic-bezier(.22,1,.36,1) ${delay + 0.1}s both`,
      }}
    >
      {/* Mini node row */}
      <div className="flex items-center gap-3">
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full font-mono font-black text-[11px]"
          style={{
            width: 40,
            height: 40,
            border: `2px solid ${step.accent}`,
            color: step.accent,
            background: `${step.glow}25`,
            boxShadow: `0 0 16px 4px ${step.glow}`,
          }}
        >
          {step.num}
        </div>
        <p
          className="text-[10px] font-bold tracking-[0.28em] uppercase"
          style={{ color: step.accent }}
        >
          {step.phase}
        </p>
      </div>

      {/* Card */}
      <div className="hiw-card">
        <CardContent step={step} />
      </div>
    </div>
  );
}

/* ─── CardContent ────────────────────────────────────────────────────────── */
function CardContent({ step }: { step: (typeof STEPS_TR)[number] }) {
  return (
    <>
      {/* Decorative ordinal */}
      <span className="hiw-num" aria-hidden="true">
        {step.num}
      </span>

      {/* Phase */}
      <p
        className="text-[10px] font-bold tracking-[0.3em] uppercase mb-3 relative z-10"
        style={{ color: step.accent }}
      >
        {step.phase}
      </p>

      {/* Title */}
      <h3
        className="text-xl sm:text-2xl font-bold text-white mb-3 relative z-10"
        style={{ letterSpacing: "-0.02em", lineHeight: "1.25" }}
      >
        {step.title}
      </h3>

      {/* Body */}
      <p className="text-white/50 text-sm sm:text-[15px] leading-relaxed mb-5 relative z-10">
        {step.body}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 relative z-10">
        {step.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide"
            style={{
              border: `1px solid ${step.accent}35`,
              color: step.accent,
              background: `${step.glow}18`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom edge glow line */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-6 right-6 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${step.glow}, transparent)`,
        }}
      />
    </>
  );
}
