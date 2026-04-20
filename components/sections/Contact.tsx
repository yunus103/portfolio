"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import type { SiteSettings } from "@/sanity/queries";
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { FiMapPin, FiDownload, FiArrowUpRight } from "react-icons/fi";

/* ─── Inline keyframes ──────────────────────────────────────────────────── */
const STYLES = `
  @keyframes ct-ring-1 {
    0%   { transform: scale(0.3);  opacity: 0.7; }
    100% { transform: scale(3.2);  opacity: 0; }
  }
  @keyframes ct-ring-2 {
    0%   { transform: scale(0.3);  opacity: 0.6; }
    100% { transform: scale(3.2);  opacity: 0; }
  }
  @keyframes ct-ring-3 {
    0%   { transform: scale(0.3);  opacity: 0.5; }
    100% { transform: scale(3.2);  opacity: 0; }
  }
  @keyframes ct-glow-drift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    40%       { transform: translate(-4%, 5%) scale(1.07); }
    70%       { transform: translate(5%, -3%) scale(0.95); }
  }
  @keyframes ct-fade-up {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ct-slide-left {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes ct-slide-right {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes ct-dot-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
  @keyframes ct-scan-x {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }

  /* ── Social card base ───────────────────────────────────────── */
  .ct-social-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.5rem 1.75rem;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.07);
    background: rgba(255, 255, 255, 0.025);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    text-decoration: none;
    overflow: hidden;
    transition:
      border-color 0.4s ease,
      background 0.4s ease,
      transform 0.4s cubic-bezier(.22,1,.36,1),
      box-shadow 0.4s ease;
    cursor: pointer;
  }
  .ct-social-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 18px;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }
  .ct-social-card:hover {
    transform: translateY(-4px) scale(1.012);
  }
  .ct-social-card:hover::before { opacity: 1; }

  /* Scan line on hover */
  .ct-social-card .ct-scan {
    position: absolute;
    top: 0; bottom: 0;
    width: 40%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
    pointer-events: none;
    opacity: 0;
  }
  .ct-social-card:hover .ct-scan {
    opacity: 1;
    animation: ct-scan-x 0.6s ease forwards;
  }

  /* Arrow icon */
  .ct-arrow {
    margin-left: auto;
    flex-shrink: 0;
    opacity: 0.3;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  .ct-social-card:hover .ct-arrow {
    opacity: 0.9;
    transform: translate(3px, -3px);
  }

  /* ── Email block ──────────────────────────────────────────────── */
  .ct-email-block {
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    border: 1px solid rgba(129,140,248,0.22);
    background: rgba(129,140,248,0.05);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 2.5rem 2rem;
    transition: border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease;
    cursor: pointer;
  }
  .ct-email-block:hover {
    border-color: rgba(129,140,248,0.45);
    background: rgba(129,140,248,0.09);
    box-shadow: 0 0 60px -10px rgba(129,140,248,0.25);
  }

  /* ── Pill info ───────────────────────────────────────────────── */
  .ct-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 99px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    font-size: 0.75rem;
    color: rgba(255,255,255,0.5);
    transition: all 0.25s ease;
  }
  .ct-pill:hover {
    border-color: rgba(255,255,255,0.18);
    color: rgba(255,255,255,0.82);
    background: rgba(255,255,255,0.06);
  }
`;

/* ─── Social link definitions ───────────────────────────────────────────── */
type SocialDef = {
  key: keyof SiteSettings;
  label: string;
  handle: string;
  Icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties; color?: string }>;
  accentColor: string;
  glowColor: string;
  gradientFrom: string;
};

const SOCIALS: SocialDef[] = [
  {
    key: "githubUrl",
    label: "GitHub",
    handle: "@yunus103",
    Icon: FaGithub,
    accentColor: "#f0f6fc",
    glowColor: "rgba(240,246,252,0.2)",
    gradientFrom: "rgba(240,246,252,0.06)",
  },
  {
    key: "linkedinUrl",
    label: "LinkedIn",
    handle: "yunus-emre-aytekin",
    Icon: FaLinkedinIn,
    accentColor: "#0a66c2",
    glowColor: "rgba(10,102,194,0.35)",
    gradientFrom: "rgba(10,102,194,0.08)",
  },
  {
    key: "instagramUrl",
    label: "Instagram",
    handle: "@yunusemreaytekin",
    Icon: FaInstagram,
    accentColor: "#e1306c",
    glowColor: "rgba(225,48,108,0.35)",
    gradientFrom: "rgba(225,48,108,0.07)",
  },
  {
    key: "twitterUrl",
    label: "X (Twitter)",
    handle: "@yunus103",
    Icon: FaTwitter,
    accentColor: "#e7e9ea",
    glowColor: "rgba(231,233,234,0.2)",
    gradientFrom: "rgba(231,233,234,0.05)",
  },
];

/* ─── Live Istanbul clock ────────────────────────────────────────────────── */
function IstanbulClock({ locale }: { locale: Locale }) {
  const [time, setTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const istanbul = new Date(
        now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }),
      );
      const h = istanbul.getHours();
      const m = istanbul.getMinutes().toString().padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      setTime(`${h12}:${m} ${ampm}`);
      setIsAvailable(h >= 9 && h < 22);
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2.5">
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{
          background: isAvailable ? "#34d399" : "#f87171",
          boxShadow: isAvailable
            ? "0 0 6px 2px rgba(52,211,153,0.5)"
            : "0 0 6px 2px rgba(248,113,113,0.5)",
          animation: "ct-dot-blink 2s ease-in-out infinite",
        }}
      />
      <span className="text-[11px] font-mono text-white/40 tracking-wider">
        İSTANBUL {time}
      </span>
      <span
        className="text-[10px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full"
        style={{
          color: isAvailable ? "#34d399" : "#f87171",
          border: `1px solid ${isAvailable ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}`,
          background: isAvailable
            ? "rgba(52,211,153,0.08)"
            : "rgba(248,113,113,0.08)",
        }}
      >
        {isAvailable
          ? locale === "tr"
            ? "Aktif"
            : "Available"
          : locale === "tr"
            ? "Offline"
            : "Offline"}
      </span>
    </div>
  );
}

/* ─── Radar rings ────────────────────────────────────────────────────────── */
function RadarRings() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
    >
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="absolute rounded-full"
          style={{
            width: "240px",
            height: "240px",
            border: "1px solid rgba(129,140,248,0.3)",
            animation: `ct-ring-${n} 4s ease-out infinite`,
            animationDelay: `${(n - 1) * 1.33}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Props ─────────────────────────────────────────────────────────────── */
interface Props {
  locale: Locale;
  dict: Dictionary;
  siteSettings: SiteSettings | null;
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function Contact({ locale, dict, siteSettings }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  /* Scroll reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);

    /* Fallback */
    const t = setTimeout(() => {
      if (sectionRef.current) {
        const r = sectionRef.current.getBoundingClientRect();
        if (r.top < window.innerHeight) setRevealed(true);
      }
    }, 200);

    return () => { obs.disconnect(); clearTimeout(t); };
  }, []);

  const email = siteSettings?.contactEmail;
  const phone = siteSettings?.contactPhone;
  const location = siteSettings?.location;
  const cvUrl = siteSettings?.cvPdf?.asset?.url;

  return (
    <>
      <style>{STYLES}</style>

      <section
        id="contact"
        ref={sectionRef}
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, #0c0618 0%, #040209 50%, #000000 100%)",
          minHeight: "100vh",
        }}
      >
        {/* ── Radar pulse center glow ──────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "520px",
            height: "520px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(ellipse, rgba(129,140,248,0.15) 0%, rgba(109,40,217,0.07) 45%, transparent 72%)",
            filter: "blur(55px)",
            animation: "ct-glow-drift 18s ease-in-out infinite",
          }}
        />

        {/* ── Background aurora orbs ────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "55vw", height: "50vh",
            top: "-15%", left: "-10%",
            background:
              "radial-gradient(ellipse, rgba(109,40,217,0.16) 0%, transparent 70%)",
            filter: "blur(90px)",
            animation: "ct-glow-drift 26s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "50vw", height: "45vh",
            bottom: "-10%", right: "-10%",
            background:
              "radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 70%)",
            filter: "blur(100px)",
            animation: "ct-glow-drift 32s ease-in-out infinite reverse",
          }}
        />

        {/* ── Radar rings (centered on section) ────────────────────────── */}
        <RadarRings />

        {/* ── Subtle dot grid ──────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* ── Noise ────────────────────────────────────────────────────── */}
        <div className="noise-overlay" />

        {/* ── Section handoff bridges ─────────────────────────────────── */}
        <div className="section-bridge-top z-[2]" />
        <div className="section-bridge-bottom z-[2]" />

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  CONTENT                                                      */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

          {/* ── Header ────────────────────────────────────────────────── */}
          <div
            className="text-center mb-16 lg:mb-20"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <IstanbulClock locale={locale} />

            <div className="mt-6 mb-4">
              <p className="text-[11px] font-semibold tracking-[0.38em] uppercase text-primary/55 mb-3">
                {dict.contact.subtitle}
              </p>
              <h2
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-none"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #c4b5fd 30%, #818cf8 60%, #38bdf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {dict.contact.title}
              </h2>
            </div>

            <p className="text-white/40 text-base sm:text-lg max-w-md mx-auto leading-relaxed mt-4">
              {locale === "tr"
                ? "Yeni bir proje, fikir veya iş birliği için — doğru kanaldan ulaşın."
                : "For a new project, idea or collaboration — reach out through the right channel."}
            </p>

            {/* Divider line */}
            <div className="mt-8 mx-auto h-px w-32 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>

          {/* ── Email hero block ──────────────────────────────────────── */}
          {email && (
            <div
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.9s cubic-bezier(.22,1,.36,1) 0.1s, transform 0.9s cubic-bezier(.22,1,.36,1) 0.1s",
              }}
              className="mb-6"
            >
              <a
                href={`mailto:${email}`}
                className="ct-email-block group block"
                aria-label={`E-posta gönder: ${email}`}
              >
                {/* Animated gradient sweep on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 30%, rgba(129,140,248,0.07) 50%, transparent 70%)",
                  }}
                />

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(129,140,248,0.12)",
                      border: "1px solid rgba(129,140,248,0.25)",
                    }}
                  >
                    <HiOutlineMail size={24} className="text-primary" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-primary/60 mb-1">
                      {locale === "tr" ? "Doğrudan E-Posta" : "Direct Email"}
                    </p>
                    <p
                      className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {email}
                    </p>
                  </div>

                  {/* Arrow */}
                  <FiArrowUpRight
                    size={28}
                    className="ct-arrow text-primary flex-shrink-0"
                  />
                </div>
              </a>
            </div>
          )}

          {/* ── Social grid ──────────────────────────────────────────── */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.9s cubic-bezier(.22,1,.36,1) 0.18s, transform 0.9s cubic-bezier(.22,1,.36,1) 0.18s",
            }}
          >
            {SOCIALS.map((s, i) => {
              const url = siteSettings?.[s.key] as string | undefined;
              if (!url) return null;
              return (
                <SocialCard
                  key={s.key}
                  def={s}
                  url={url}
                  delay={i * 0.06}
                  revealed={revealed}
                />
              );
            })}
          </div>

          {/* ── Info pills row ────────────────────────────────────────── */}
          <div
            className="flex flex-wrap justify-center gap-3 mb-10"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.9s cubic-bezier(.22,1,.36,1) 0.28s, transform 0.9s cubic-bezier(.22,1,.36,1) 0.28s",
            }}
          >
            {location && (
              <div className="ct-pill">
                <FiMapPin size={12} className="text-primary/60 flex-shrink-0" />
                <span>{location}</span>
              </div>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="ct-pill hover:text-white/80">
                <HiOutlinePhone size={12} className="text-primary/60 flex-shrink-0" />
                <span>{phone}</span>
              </a>
            )}
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="ct-pill hover:text-white/80 hover:border-primary/30"
              >
                <FiDownload size={12} className="text-primary/60 flex-shrink-0" />
                <span>{dict.nav.downloadCV}</span>
              </a>
            )}
          </div>

          {/* ── "Let's build" bottom statement ───────────────────────── */}
          <div
            className="text-center"
            style={{
              opacity: revealed ? 1 : 0,
              transition: "opacity 0.9s cubic-bezier(.22,1,.36,1) 0.38s",
            }}
          >
            <p className="text-white/20 text-xs tracking-[0.24em] uppercase">
              {locale === "tr"
                ? "Hızlı yanıt · Açık iletişim · Sonuç odaklı"
                : "Quick response · Clear communication · Result driven"}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── SocialCard ─────────────────────────────────────────────────────────── */
function SocialCard({
  def,
  url,
}: {
  def: SocialDef;
  url: string;
  delay: number;
  revealed: boolean;
}) {
  const { Icon, label, handle, accentColor, glowColor, gradientFrom } = def;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="ct-social-card"
      style={
        {
          "--hover-glow": glowColor,
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = `${accentColor}45`;
        el.style.background = gradientFrom;
        el.style.boxShadow = `0 8px 48px -8px ${glowColor}, 0 0 0 1px ${accentColor}20`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.background = "rgba(255,255,255,0.025)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Scan line effect */}
      <div className="ct-scan" />

      {/* Icon circle */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
        style={{
          background: `${accentColor}14`,
          border: `1px solid ${accentColor}30`,
        }}
      >
        <Icon size={20} style={{ color: accentColor }} />
      </div>

      {/* Label + handle */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[10px] font-bold tracking-[0.24em] uppercase mb-0.5"
          style={{ color: `${accentColor}80` }}
        >
          {label}
        </p>
        <p className="text-white/75 text-sm font-medium truncate">{handle}</p>
      </div>

      {/* Arrow */}
      <FiArrowUpRight size={18} className="ct-arrow" style={{ color: accentColor }} />
    </a>
  );
}
