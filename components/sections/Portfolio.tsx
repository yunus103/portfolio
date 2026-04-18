import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import LightRaysThemed from "@/components/reactbits/LightRaysThemed";
import { PortfolioClient } from "@/components/sections/PortfolioClient";
import { getProjects } from "@/sanity/queries";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export default async function Portfolio({ locale, dict }: Props) {
  const projects = await getProjects();

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      {/* ── LightRays background ──────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <LightRaysThemed
          raysOrigin="top-center"
          raysSpeed={0}
          lightSpread={0.1}
          rayLength={3}
          followMouse={true}
          mouseInfluence={1}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
          darkColor="#6366f1"
          lightColor="#6366f1"
        />
      </div>

      {/* ── Subtle top/bottom fades ───────────────────────────────── */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, var(--background), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none z-[1]"
        style={{
          background: "linear-gradient(to top, var(--background), transparent)",
        }}
      />

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PortfolioClient projects={projects} locale={locale} dict={dict} />
      </div>
    </section>
  );
}
