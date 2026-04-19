"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SanityImage } from "@/components/ui/SanityImage";
import type { Project } from "@/sanity/queries";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { getLocalizedValue } from "@/sanity/queries";
import {
  HiArrowTopRightOnSquare,
  HiXMark,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";
import { FiGithub } from "react-icons/fi";
import { useLenis } from "lenis/react";

/* ─── Injected styles ───────────────────────────────────────────────── */
const STYLES = `
  /* ── Card ─────────────────────────────────────────────────────────── */
  .pf-card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    outline: none;
    background: #0d0b14;
    border: 1px solid rgba(255,255,255,0.06);
    transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    animation: pf-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes pf-in {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  .pf-card:hover {
    border-color: rgba(139,92,246,0.3);
    box-shadow: 0 16px 48px -12px rgba(0,0,0,0.6), 0 0 40px -16px rgba(139,92,246,0.2);
    transform: translateY(-4px);
  }
  .pf-card:focus-visible {
    border-color: rgba(139,92,246,0.6);
    box-shadow: 0 0 0 3px rgba(139,92,246,0.25);
  }

  /* Image wrapper */
  .pf-img-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 1;
    overflow: hidden;
    background: #0b091a;
  }
  .pf-img-wrap img { transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
  .pf-card:hover .pf-img-wrap img { transform: scale(1.04); }

  /* Overlay — always present, expands on hover */
  .pf-overlay {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 20px;
    background: linear-gradient(to top,
      rgba(4,2,12,0.95) 0%,
      rgba(4,2,12,0.6)  40%,
      rgba(4,2,12,0.1)  70%,
      transparent       100%);
    transition: background 0.35s ease;
  }
  .pf-card:hover .pf-overlay {
    background: linear-gradient(to top,
      rgba(4,2,12,0.98) 0%,
      rgba(4,2,12,0.72) 50%,
      rgba(4,2,12,0.25) 80%,
      transparent       100%);
  }

  /* Title always visible */
  .pf-card-title {
    font-size: 1rem; font-weight: 700;
    color: #fff; line-height: 1.3;
    margin: 0 0 6px;
    transform: translateY(0);
    transition: transform 0.35s ease;
  }

  /* Description — hidden, slides up on hover */
  .pf-card-desc {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.55);
    line-height: 1.55;
    max-height: 0; overflow: hidden; opacity: 0;
    margin-bottom: 0;
    transition: max-height 0.4s ease, opacity 0.35s ease, margin-bottom 0.35s ease;
  }
  .pf-card:hover .pf-card-desc {
    max-height: 80px; opacity: 1; margin-bottom: 10px;
  }

  /* Tags row */
  .pf-card-tags {
    display: flex; flex-wrap: wrap; gap: 5px;
    max-height: 0; overflow: hidden; opacity: 0;
    transition: max-height 0.4s ease 0.05s, opacity 0.35s ease 0.05s;
  }
  .pf-card:hover .pf-card-tags { max-height: 60px; opacity: 1; }

  /* Top-right index number */
  .pf-card-num {
    position: absolute; top: 14px; right: 14px; z-index: 6;
    font-size: 0.65rem; font-weight: 800;
    letter-spacing: 0.12em;
    color: rgba(255,255,255,0.2);
    font-variant-numeric: tabular-nums;
    transition: color 0.3s;
  }
  .pf-card:hover .pf-card-num { color: rgba(167,139,250,0.45); }

  /* Featured dot */
  .pf-featured-dot {
    position: absolute; top: 14px; left: 14px; z-index: 6;
    width: 7px; height: 7px; border-radius: 50%;
    background: #a78bfa;
    box-shadow: 0 0 8px 2px rgba(167,139,250,0.6);
    animation: pulse-dot 2.5s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1);   }
    50%      { opacity:.6; transform:scale(1.3); }
  }

  /* Tech pill (shared) */
  .pf-tag {
    display: inline-flex; align-items: center;
    padding: 2px 9px; border-radius: 99px;
    border: 1px solid rgba(139,92,246,0.2);
    background: rgba(139,92,246,0.07);
    color: rgba(167,139,250,0.85);
    font-size: 0.68rem; font-weight: 500; white-space: nowrap;
    letter-spacing: 0.02em;
  }

  /* ── Section header decoration ──────────────────────────────────── */
  .pf-section-line {
    display: block; height: 1px; border-radius: 99px;
    background: linear-gradient(90deg, rgba(139,92,246,0.55) 0%, transparent 100%);
    margin: 0 auto 48px;
    max-width: 200px;
  }

  /* ── Modal overlay ──────────────────────────────────────────────── */
  @keyframes pf-modal-bg   { from{opacity:0} to{opacity:1} }
  @keyframes pf-modal-slide {
    from { opacity:0; transform:translateY(30px) scale(0.97); }
    to   { opacity:1; transform:translateY(0)    scale(1);    }
  }

  .pf-overlay-bg {
    position: fixed; inset: 0; z-index: 9998;
    background: rgba(0,0,0,0.82);
    backdrop-filter: blur(10px);
    animation: pf-modal-bg 0.22s ease both;
  }
  .pf-modal {
    position: fixed; inset: 0; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .pf-modal-inner {
    position: relative; width: 100%; max-width: 1040px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.08);
    background: #07050f;
    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.9), 0 0 80px -30px rgba(139,92,246,0.18);
    animation: pf-modal-slide 0.32s cubic-bezier(0.22,1,0.36,1) both;
    overflow: hidden;
  }

  /* Two-column layout */
  .pf-modal-body {
    display: grid;
    grid-template-columns: 1fr 320px;
    min-height: 540px;
  }
  @media (max-width: 768px) {
    .pf-modal-body { grid-template-columns: 1fr; }
    .pf-modal-sidebar { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.07); }
  }

  /* Left — image area */
  .pf-modal-left {
    display: flex; flex-direction: column;
    border-right: 1px solid rgba(255,255,255,0.06);
  }

  /* Main image */
  .pf-modal-main-img {
    position: relative; width: 100%;
    aspect-ratio: 16/9;
    background: #030208;
    flex-shrink: 0;
  }

  /* Arrow buttons */
  .pf-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    z-index: 10; padding: 8px;
    border-radius: 50%;
    background: rgba(7,5,15,0.75);
    border: 1px solid rgba(255,255,255,0.12);
    cursor: pointer; display: flex;
    transition: background 0.2s, border-color 0.2s;
  }
  .pf-arrow:hover { background: rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.5); }
  .pf-arrow-left  { left:  10px; }
  .pf-arrow-right { right: 10px; }

  /* Thumbnail strip */
  .pf-thumbs {
    display: flex; gap: 8px;
    padding: 12px 16px;
    overflow-x: auto;
    background: rgba(0,0,0,0.25);
    scrollbar-width: thin;
    scrollbar-color: rgba(139,92,246,0.25) transparent;
    flex-shrink: 0;
  }
  .pf-thumb {
    flex-shrink: 0; width: 68px; aspect-ratio: 16/9;
    border-radius: 6px; overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer; position: relative;
    background: rgba(255,255,255,0.04);
    transition: border-color 0.2s, opacity 0.2s;
    opacity: 0.55;
  }
  .pf-thumb:hover { opacity: 0.8; }
  .pf-thumb.active { border-color: #a78bfa; opacity: 1; }

  /* Right sidebar */
  .pf-modal-sidebar {
    display: flex; flex-direction: column;
    padding: 28px 24px;
    border-left: 1px solid rgba(255,255,255,0.06);
    gap: 0;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(139,92,246,0.2) transparent;
  }

  /* Sidebar section divider */
  .pf-sidebar-sep {
    height: 1px; margin: 20px 0;
    background: rgba(255,255,255,0.06);
    border: none;
  }

  /* Image count badge */
  .pf-img-count {
    position: absolute; bottom: 10px; right: 10px; z-index: 5;
    padding: 3px 10px; border-radius: 99px;
    background: rgba(0,0,0,0.65);
    color: rgba(255,255,255,0.7);
    font-size: 0.7rem; font-weight: 600;
    backdrop-filter: blur(4px);
  }

  /* Action button */
  .pf-btn {
    display: inline-flex; align-items: center; gap: 8px;
    width: 100%; justify-content: center;
    padding: 11px 16px; border-radius: 10px;
    font-size: 0.82rem; font-weight: 600;
    transition: all 0.22s ease; text-decoration: none;
    letter-spacing: 0.02em; cursor: pointer;
  }
  .pf-btn-primary {
    background: linear-gradient(135deg, #7c3aed, #4f46e5 60%, #0891b2);
    color: #fff; border: none;
    box-shadow: 0 4px 20px -6px rgba(124,58,237,0.45);
  }
  .pf-btn-primary:hover {
    box-shadow: 0 6px 28px -6px rgba(124,58,237,0.65);
    transform: translateY(-1px);
  }
  .pf-btn-ghost {
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.75);
  }
  .pf-btn-ghost:hover {
    border-color: rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.07);
    transform: translateY(-1px);
  }

  /* Performance bar */
  .pf-score-bar {
    height: 4px; border-radius: 99px;
    background: rgba(255,255,255,0.07);
    overflow: hidden;
  }
  .pf-score-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, #7c3aed, #22d3ee);
    transition: width 1.2s cubic-bezier(0.22,1,0.36,1);
  }

  /* Close button */
  .pf-close {
    position: absolute; top: 14px; right: 14px; z-index: 20;
    width: 38px; height: 38px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    cursor: pointer; transition: background 0.2s, border-color 0.2s;
  }
  .pf-close:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.2); }

  /* Modal scrollable tag list */
  .pf-tags-wrap { display: flex; flex-wrap: wrap; gap: 6px; }

  /* Stat row */
  .pf-stat {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 0.78rem;
  }
  .pf-stat:last-child { border-bottom: none; }
  .pf-stat-label { color: rgba(255,255,255,0.35); }
  .pf-stat-val   { color: rgba(255,255,255,0.8); font-weight: 500; }
`;

/* ─── Fallback ───────────────────────────────────────────────────── */
const FALLBACK: Project = {
  _id: "fallback-demo",
  title: { tr: "Örnek Proje", en: "Sample Project" },
  slug: { current: "sample-project" },
  description: {
    tr: "Bu bir demo projesidir. Sanity Studio'dan gerçek projelerinizi ekleyebilirsiniz. Burası daha uzun bir açıklama alanıdır ve projeniz hakkında detaylı bilgi verebilirsiniz.",
    en: "This is a demo placeholder. Add your real projects via Sanity Studio. This field supports longer descriptions so you can tell more about your project.",
  },
  techTags: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity CMS"],
  featured: true,
  order: 0,
};

/* ─── Props ───────────────────────────────────────────────────────── */
interface Props {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}

/* ─── Tiny helpers ────────────────────────────────────────────────── */
function Tag({ label }: { label: string }) {
  return <span className="pf-tag">{label}</span>;
}

function collectImages(p: Project) {
  const imgs: any[] = [];
  if (p.coverImage?.asset) imgs.push(p.coverImage);
  (p.images ?? []).forEach((img: any) => img?.asset && imgs.push(img));
  return imgs;
}

/* ═══════════════════════════════════════════════════════════════════
   CARD
══════════════════════════════════════════════════════════════════════ */
function Card({
  project,
  locale,
  index,
  delay,
  onClick,
}: {
  project: Project;
  locale: Locale;
  index: number;
  delay: number;
  onClick: () => void;
}) {
  const title = getLocalizedValue(project.title, locale);
  const desc = getLocalizedValue(project.description, locale);
  const hasCover = !!project.coverImage?.asset;

  return (
    <article
      className="pf-card"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      tabIndex={0}
      role="button"
      aria-label={`${title} — detayları gör`}
    >
      {/* Index number */}
      <span className="pf-card-num">{String(index + 1).padStart(2, "0")}</span>

      {/* Featured dot */}
      {project.featured && <span className="pf-featured-dot" aria-hidden />}

      {/* Image */}
      <div className="pf-img-wrap">
        {hasCover ? (
          <SanityImage
            image={project.coverImage}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          /* No-cover placeholder */
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.12) 0%, rgba(8,145,178,0.06) 60%, transparent 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1.5"
              aria-hidden
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
        )}

        {/* Overlay with reveal */}
        <div className="pf-overlay">
          <h3 className="pf-card-title">{title}</h3>
          {desc && <p className="pf-card-desc">{desc}</p>}
          {project.techTags && project.techTags.length > 0 && (
            <div className="pf-card-tags">
              {project.techTags.slice(0, 4).map((t) => (
                <Tag key={t} label={t} />
              ))}
              {project.techTags.length > 4 && (
                <Tag label={`+${project.techTags.length - 4}`} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom strip */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            color: "rgba(167,139,250,0.5)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Detayları Gör
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(167,139,250,0.35)"
          strokeWidth="2.5"
          style={{ transition: "transform 0.25s ease, stroke 0.25s ease" }}
          aria-hidden
        >
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════════════════════ */
function Modal({
  project,
  locale,
  onClose,
}: {
  project: Project;
  locale: Locale;
  onClose: () => void;
}) {
  const title = getLocalizedValue(project.title, locale);
  const desc = getLocalizedValue(project.description, locale);
  const imgs = collectImages(project);

  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => setActive((i) => Math.max(0, i - 1)), []);
  const next = useCallback(
    () => setActive((i) => Math.min(imgs.length - 1, i + 1)),
    [imgs.length],
  );

  /* Fully stop Lenis globally while modal is open */
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      lenis.stop();
    }
    return () => {
      if (lenis) lenis.start();
    };
  }, [lenis]);

  /* Keyboard */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, prev, next]);

  /* Body scroll lock */
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  /* Reset image when project changes */
  useEffect(() => setActive(0), [project._id]);

  /* Mount state for Portal */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <>
      <div 
        className="pf-overlay-bg" 
        onClick={onClose} 
        aria-hidden 
        data-lenis-prevent="true"
      />
      <div
        className="pf-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        data-lenis-prevent="true"
      >
        <div className="pf-modal-inner" ref={panelRef}>
          {/* Close */}
          <button className="pf-close" onClick={onClose} aria-label="Kapat">
            <HiXMark
              style={{ width: 17, height: 17, color: "rgba(255,255,255,0.65)" }}
            />
          </button>

          <div className="pf-modal-body">
            {/* ── LEFT — image carousel ────────────────────────────── */}
            <div className="pf-modal-left">
              {/* Main image */}
              <div className="pf-modal-main-img">
                {imgs.length > 0 ? (
                  <SanityImage
                    image={imgs[active]}
                    fill
                    sizes="(max-width: 768px) 100vw, 680px"
                    objectFit="contain"
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "radial-gradient(ellipse at center, rgba(124,58,237,0.07) 0%, transparent 70%)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "3rem",
                        color: "rgba(255,255,255,0.06)",
                      }}
                    >
                      ✦
                    </span>
                  </div>
                )}

                {/* Arrows */}
                {active > 0 && (
                  <button
                    className="pf-arrow pf-arrow-left"
                    onClick={prev}
                    aria-label="Önceki"
                  >
                    <HiChevronLeft
                      style={{ width: 18, height: 18, color: "#fff" }}
                    />
                  </button>
                )}
                {active < imgs.length - 1 && (
                  <button
                    className="pf-arrow pf-arrow-right"
                    onClick={next}
                    aria-label="Sonraki"
                  >
                    <HiChevronRight
                      style={{ width: 18, height: 18, color: "#fff" }}
                    />
                  </button>
                )}

                {/* Count badge */}
                {imgs.length > 1 && (
                  <span className="pf-img-count">
                    {active + 1} / {imgs.length}
                  </span>
                )}
              </div>

              {/* Thumbnail row */}
              {imgs.length > 1 && (
                <div className="pf-thumbs">
                  {imgs.map((img, i) => (
                    <button
                      key={i}
                      className={`pf-thumb${i === active ? " active" : ""}`}
                      onClick={() => setActive(i)}
                      aria-label={`Görsel ${i + 1}`}
                    >
                      <SanityImage image={img} fill sizes="68px" />
                    </button>
                  ))}
                </div>
              )}

              {/* Description below images */}
              {desc && (
                <div
                  style={{
                    padding: "20px 24px 24px",
                    flex: 1,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.75,
                      color: "rgba(255,255,255,0.55)",
                      margin: 0,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              )}
            </div>

            {/* ── RIGHT — sidebar ───────────────────────────────────── */}
            <aside className="pf-modal-sidebar">
              {/* Featured label */}
              {project.featured && (
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(167,139,250,0.6)",
                    marginBottom: 10,
                    display: "block",
                  }}
                >
                  ★ Öne Çıkan Proje
                </span>
              )}

              {/* Title */}
              <h2
                style={{
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                  margin: "0 0 6px",
                }}
              >
                {title}
              </h2>

              {/* Subtle accent line */}
              <div
                style={{
                  height: 2,
                  width: 36,
                  borderRadius: 99,
                  background: "linear-gradient(90deg, #7c3aed, #22d3ee)",
                  marginBottom: 20,
                }}
              />

              {/* Tech stack */}
              {project.techTags && project.techTags.length > 0 && (
                <>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      margin: "0 0 10px",
                    }}
                  >
                    Tech Stack
                  </p>
                  <div className="pf-tags-wrap" style={{ marginBottom: 20 }}>
                    {project.techTags.map((t) => (
                      <Tag key={t} label={t} />
                    ))}
                  </div>
                </>
              )}

              <hr className="pf-sidebar-sep" />

              {/* Action buttons */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pf-btn pf-btn-primary"
                  >
                    <HiArrowTopRightOnSquare
                      style={{ width: 16, height: 16 }}
                    />
                    Canlı Siteyi Gör
                  </a>
                ) : (
                  <button
                    className="pf-btn pf-btn-primary"
                    disabled
                    style={{ opacity: 0.35, cursor: "default" }}
                  >
                    <HiArrowTopRightOnSquare
                      style={{ width: 16, height: 16 }}
                    />
                    Canlı Site Yok
                  </button>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pf-btn pf-btn-ghost"
                  >
                    <FiGithub style={{ width: 15, height: 15 }} />
                    Kaynak Kodu Gör
                  </a>
                )}
              </div>

              <hr className="pf-sidebar-sep" />

              {/* Stats */}
              <div>
                {project.performanceScore != null && (
                  <>
                    <div className="pf-stat">
                      <span className="pf-stat-label">Performance</span>
                      <span
                        className="pf-stat-val"
                        style={{
                          color: "rgba(167,139,250,0.9)",
                          fontWeight: 700,
                        }}
                      >
                        {project.performanceScore}
                      </span>
                    </div>
                    <div style={{ margin: "8px 0 16px" }}>
                      <div className="pf-score-bar">
                        <div
                          className="pf-score-fill"
                          style={{ width: `${project.performanceScore}%` }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {imgs.length > 0 && (
                  <div className="pf-stat">
                    <span className="pf-stat-label">Ekran Görüntüsü</span>
                    <span className="pf-stat-val">{imgs.length} adet</span>
                  </div>
                )}
                {project.techTags && (
                  <div className="pf-stat">
                    <span className="pf-stat-label">Teknoloji</span>
                    <span className="pf-stat-val">
                      {project.techTags.length} araç
                    </span>
                  </div>
                )}
              </div>

              {/* Spacer */}
              <div style={{ flex: 1 }} />
            </aside>
          </div>
          {/* .pf-modal-body */}
        </div>
      </div>
    </>,
    document.body
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INNER (useSearchParams → inside Suspense)
══════════════════════════════════════════════════════════════════════ */
function Inner({ projects, locale, dict }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const list = projects.length === 0 ? [FALLBACK] : projects;

  const activeSlug = params.get("project");
  const activeProject = activeSlug
    ? (list.find((p) => p.slug?.current === activeSlug) ?? null)
    : null;

  const open = useCallback(
    (slug: string) => {
      const next = new URLSearchParams(params.toString());
      next.set("project", slug);
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [router, pathname, params],
  );

  const close = useCallback(() => {
    const next = new URLSearchParams(params.toString());
    next.delete("project");
    const q = next.toString();
    router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [router, pathname, params]);

  return (
    <>
      {/* ── Section header ───────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <p
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(167,139,250,0.6)",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              width: 28,
              height: 1,
              background: "linear-gradient(90deg, transparent, #a78bfa)",
              display: "inline-block",
            }}
          />
          {dict.portfolio?.badge ?? "Projelerim"}
          <span
            style={{
              width: 28,
              height: 1,
              background: "linear-gradient(90deg, #a78bfa, transparent)",
              display: "inline-block",
            }}
          />
        </p>

        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            margin: "0 0 14px",
          }}
        >
          {dict.portfolio?.title ?? "Portfolio"}
        </h2>

        <p
          style={{
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.38)",
            maxWidth: 480,
            margin: "0 auto",
            lineHeight: 1.65,
          }}
        >
          {dict.portfolio?.subtitle ??
            "Tasarladığım ve geliştirdiğim projelerden seçkiler."}
        </p>

        <span className="pf-section-line" style={{ marginTop: 32 }} />
      </div>

      {/* ── Grid ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "28px",
        }}
      >
        {list.map((project, i) => (
          <Card
            key={project._id}
            project={project}
            locale={locale}
            index={i}
            delay={i * 70}
            onClick={() => project.slug?.current && open(project.slug.current)}
          />
        ))}
      </div>

      {/* ── Modal ────────────────────────────────────────────────── */}
      {activeProject && (
        <Modal project={activeProject} locale={locale} onClose={close} />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════════════════════════════ */
export function PortfolioClient(props: Props) {
  return (
    <>
      <style>{STYLES}</style>
      <Suspense>
        <Inner {...props} />
      </Suspense>
    </>
  );
}
