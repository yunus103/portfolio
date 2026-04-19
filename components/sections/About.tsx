import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import {
  getProfile,
  getTechStack,
  getSiteSettings,
  getLocalizedValue,
} from "@/sanity/queries";
import { urlForImage } from "@/sanity/lib/image";
import ProfileCard from "@/components/reactbits/ProfileCard";
import { RichText } from "@/components/ui/RichText";
import AboutBackground from "@/components/sections/AboutBackground";
import {
  FiDownload,
  FiMapPin,
  FiBook,
  FiBriefcase,
  FiGlobe,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiGit,
  SiGithub,
  SiVercel,
  SiFigma,
  SiSanity,
  SiDocker,
  SiPrisma,
  SiGraphql,
  SiFirebase,
  SiVite,
  SiPython,
  SiWordpress,
  SiAstro,
  SiNuxt,
  SiVuedotjs,
  SiRedis,
  SiSupabase,
  SiLinux,
} from "react-icons/si";

// ── Icon map ────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, IconType> = {
  react: SiReact,
  nextjs: SiNextdotjs,
  "next.js": SiNextdotjs,
  typescript: SiTypescript,
  ts: SiTypescript,
  javascript: SiJavascript,
  js: SiJavascript,
  tailwindcss: SiTailwindcss,
  tailwind: SiTailwindcss,
  html: SiHtml5,
  html5: SiHtml5,
  css: SiCss,
  css3: SiCss,
  nodejs: SiNodedotjs,
  "node.js": SiNodedotjs,
  node: SiNodedotjs,
  mongodb: SiMongodb,
  mongo: SiMongodb,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  mysql: SiMysql,
  git: SiGit,
  github: SiGithub,
  vercel: SiVercel,
  figma: SiFigma,
  sanity: SiSanity,
  docker: SiDocker,
  prisma: SiPrisma,
  graphql: SiGraphql,
  firebase: SiFirebase,
  vite: SiVite,
  python: SiPython,
  wordpress: SiWordpress,
  astro: SiAstro,
  nuxt: SiNuxt,
  nuxtjs: SiNuxt,
  vue: SiVuedotjs,
  vuejs: SiVuedotjs,
  redis: SiRedis,
  supabase: SiSupabase,
  linux: SiLinux,
};

// ── Fallback tech when Sanity has none ──────────────────────────────────────
type TechItem = { title: string; iconName?: string; category: string };

const FALLBACK_TECH: TechItem[] = [
  { title: "React", iconName: "react", category: "frontend" },
  { title: "Next.js", iconName: "nextjs", category: "frontend" },
  { title: "TypeScript", iconName: "typescript", category: "frontend" },
  { title: "Tailwind CSS", iconName: "tailwindcss", category: "frontend" },
  { title: "Node.js", iconName: "nodejs", category: "backend" },
  { title: "MongoDB", iconName: "mongodb", category: "database" },
  { title: "PostgreSQL", iconName: "postgresql", category: "database" },
  { title: "Git", iconName: "git", category: "tools" },
  { title: "Figma", iconName: "figma", category: "tools" },
  { title: "Vercel", iconName: "vercel", category: "tools" },
  { title: "Sanity", iconName: "sanity", category: "tools" },
];

const CATEGORY_ORDER = [
  "frontend",
  "backend",
  "database",
  "tools",
  "design",
  "devops",
  "other",
];

// ── Inline keyframes → injected once via <style> ────────────────────────────
const STYLES = `
  @keyframes ab-orb-1 {
    0%,100% { transform:translate(0%,0%) scale(1);    }
    50%     { transform:translate(5%,-9%) scale(1.12); }
  }
  @keyframes ab-orb-2 {
    0%,100% { transform:translate(0%,0%) scale(1);    }
    33%     { transform:translate(-8%,6%) scale(1.16); }
    66%     { transform:translate(4%,-5%) scale(0.9);  }
  }
  @keyframes ab-marquee {
    from { transform:translateX(0); }
    to   { transform:translateX(-50%); }
  }
  @keyframes ab-fade-up {
    from { opacity:0; transform:translateY(26px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  .ab-animate  { animation:ab-fade-up .8s cubic-bezier(.22,1,.36,1) both; }
  .ab-a1 { animation-delay:.05s; }
  .ab-a2 { animation-delay:.2s;  }
  .ab-a3 { animation-delay:.35s; }
  .ab-a4 { animation-delay:.5s;  }
  .ab-a5 { animation-delay:.65s; }
  .ab-marquee { animation:ab-marquee 32s linear infinite; }
  .ab-marquee:hover { animation-play-state:paused; }
`;

// ════════════════════════════════════════════════════════════════════════════
interface Props {
  locale: Locale;
  dict: Dictionary;
}

export default async function About({ locale, dict }: Props) {
  const [profile, techStack, siteSettings] = await Promise.all([
    getProfile(),
    getTechStack(),
    getSiteSettings(),
  ]);

  if (!profile) {
    return (
      <section
        id="about"
        className="min-h-[50vh] py-24 flex items-center justify-center"
      >
        <p className="text-foreground-muted text-sm">{dict.about.title}</p>
      </section>
    );
  }

  const bio = profile.bio?.[locale] || profile.bio?.en;
  const cvUrl = siteSettings?.cvPdf?.asset?.url;

  const avatarUrl = profile.cardAvatar
    ? urlForImage(profile.cardAvatar)?.auto("format").url()
    : profile.profileImage
      ? urlForImage(profile.profileImage)?.auto("format").url()
      : undefined;

  const iconUrl = profile.cardIcon
    ? urlForImage(profile.cardIcon)?.url()
    : undefined;

  /* Tech items — use Sanity data if available, otherwise fallback */
  const techItems: TechItem[] =
    techStack.length > 0
      ? techStack.map((t) => ({
          title: getLocalizedValue(t.title, locale),
          iconName: t.iconName,
          category: t.category?.toLowerCase() ?? "other",
        }))
      : FALLBACK_TECH;

  /* Group by category */
  const techByCategory = techItems.reduce<Record<string, TechItem[]>>(
    (acc, item) => {
      const cat = item.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {},
  );

  const sortedCategories = Object.keys(techByCategory).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <section
      id="about"
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 25% 55%, #0e0b22 0%, #06040f 55%, #000000 100%)",
      }}
    >
      <style>{STYLES}</style>

      {/* ── Aurora orb 1 — top-left ───────────────────────────────────── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "75vw",
          height: "65vh",
          top: "-20%",
          left: "-20%",
          background:
            "radial-gradient(ellipse, rgba(129,140,248,0.28) 0%, rgba(109,40,217,0.12) 42%, transparent 70%)",
          filter: "blur(60px)",
          animation: "ab-orb-1 20s ease-in-out infinite",
        }}
      />

      {/* ── Aurora orb 2 — bottom-right ──────────────────────────────── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "62vw",
          height: "52vh",
          bottom: "-12%",
          right: "-15%",
          background:
            "radial-gradient(ellipse, rgba(167,139,250,0.22) 0%, rgba(139,92,246,0.09) 42%, transparent 70%)",
          filter: "blur(75px)",
          animation: "ab-orb-2 27s ease-in-out infinite",
        }}
      />

      {/* ── Subtle dot grid ────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── Canvas cursor glow (client) ───────────────────────────────── */}
      <AboutBackground />

      {/* ── Noise texture ──────────────────────────────────────────────── */}
      <div className="noise-overlay" />

      {/* ════════════════════════════════════════════════════════════════ */}
      {/*  CONTENT                                                        */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        {/* ── SECTION HEADER ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 lg:mb-24 ab-animate ab-a1">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.32em] uppercase text-primary/60 mb-2">
              {dict.about.subtitle}
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {dict.about.title}
            </h2>
            <div className="mt-3 h-px w-16 bg-gradient-to-r from-primary via-accent to-transparent" />
          </div>

          {/* Availability badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/25 bg-emerald-900/15 text-emerald-400/80 text-[11px] font-semibold tracking-[0.2em] uppercase self-start sm:self-auto shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            Freelance için müsait
          </div>
        </div>

        {/* ── MAIN GRID ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          {/* ── ProfileCard ──────────────────────────────────── */}
          {/* Mobile: straight & capped to 88vw. lg+: slight tilt. */}
          <div className="flex justify-center lg:col-span-5 lg:sticky lg:top-24 ab-animate ab-a2">
            <div className="w-[min(88vw,300px)] sm:w-[310px] lg:w-[350px] lg:-rotate-[1.5deg]">
              <ProfileCard
                name="Yunus Emre Aytekin"
                title="Frontend Developer"
                handle="yunus103"
                status="Online"
                contactText="Contact Me"
                avatarUrl={avatarUrl}
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={false}
                contactUrl={
                  profile.cardContactUrl || "https://github.com/yunus103"
                }
                behindGlowColor="rgba(125, 190, 255, 0.67)"
                iconUrl={iconUrl}
                behindGlowEnabled={true}
                innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
                className="w-full"
              />
            </div>
          </div>

          {/* ── Text content ───────────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Large gradient name + subtitle */}
            <div className="ab-animate ab-a3">
              <h3
                className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.92] mb-5"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #c4b5fd 35%, #818cf8 65%, #38bdf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Yunus Emre
                <br />
                Aytekin
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-gradient-to-r from-primary to-accent flex-shrink-0" />
                <span className="text-[11px] font-semibold tracking-[0.32em] uppercase text-white/35">
                  Frontend Developer
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="text-[15px] sm:text-base leading-relaxed text-white/55 ab-animate ab-a3">
              {bio ? (
                Array.isArray(bio) ? (
                  <RichText
                    value={bio}
                    className="!prose-sm sm:!prose-base prose-p:leading-relaxed prose-p:text-white/55 prose-strong:text-white/80"
                  />
                ) : (
                  <p className="whitespace-pre-line">{bio}</p>
                )
              ) : (
                <p>
                  {profile.shortBio?.[locale] ||
                    profile.shortBio?.en ||
                    dict.about.title}
                </p>
              )}
            </div>

            {/* Info pills */}
            <div className="flex flex-wrap gap-2 sm:gap-2.5 ab-animate ab-a4">
              <InfoPill
                icon={<FiMapPin size={12} />}
                label="İstanbul, Türkiye"
              />
              <InfoPill
                icon={<FiBook size={12} />}
                label="İÜC Bilgisayar Müh."
              />
              <InfoPill icon={<FiBriefcase size={12} />} label="Freelance" />
              <InfoPill icon={<FiGlobe size={12} />} label="TR / EN" />
            </div>

            {/* CV download */}
            {cvUrl && (
              <div className="ab-animate ab-a4">
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="about-cv-btn cursor-target group/btn inline-flex items-center gap-3"
                >
                  <FiDownload className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5" />
                  <span className="font-medium text-sm tracking-wide">
                    {dict.nav.downloadCV}
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── TECH STACK ─────────────────────────────────────────────── */}
        <div className="border-t border-white/[0.07] pt-16 ab-animate ab-a5">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-accent/70 shrink-0">
              ⚡ Tech Stack
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-accent/25 to-transparent" />
          </div>

          <div className="flex flex-col gap-5">
            {sortedCategories.map((cat) => (
              <TechGroup key={cat} category={cat} items={techByCategory[cat]} />
            ))}
          </div>
        </div>

        {/* ── SCROLLING MARQUEE ──────────────────────────────────────── */}
        <div className="mt-16 pt-10 border-t border-white/[0.04] overflow-hidden">
          <div className="ab-marquee inline-flex gap-10 whitespace-nowrap">
            {/* Duplicate for seamless loop */}
            {[...techItems, ...techItems].map((item, i) => {
              const Icon = ICON_MAP[item.iconName?.toLowerCase() ?? ""];
              return (
                <span
                  key={`mq-${i}`}
                  className="inline-flex items-center gap-2 shrink-0 font-medium uppercase tracking-[0.18em]"
                  style={{ color: "rgba(255,255,255,0.16)", fontSize: "11px" }}
                >
                  {Icon && <Icon size={13} style={{ opacity: 0.55 }} />}
                  {item.title}
                  <span
                    style={{
                      marginLeft: "1.5rem",
                      color: "rgba(255,255,255,0.08)",
                    }}
                  >
                    ✦
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="about-pill inline-flex items-center gap-2 cursor-default">
      <span className="text-primary/60 flex-shrink-0">{icon}</span>
      <span className="text-xs sm:text-sm">{label}</span>
    </div>
  );
}

function TechGroup({
  category,
  items,
}: {
  category: string;
  items: TechItem[];
}) {
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  return (
    <div>
      <p
        className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-2.5"
        style={{ color: "rgba(255,255,255,0.25)" }}
      >
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {items.map((item) => {
          const Icon = ICON_MAP[item.iconName?.toLowerCase() ?? ""];
          return (
            <span key={item.title} className="about-tech-badge">
              {Icon && <Icon size={12} />}
              {item.title}
            </span>
          );
        })}
      </div>
    </div>
  );
}
