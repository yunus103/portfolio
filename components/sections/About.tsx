import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import { getProfile, getTechStack, getLocalizedValue } from "@/sanity/queries";
import { urlForImage } from "@/sanity/lib/image";
import ProfileCard from "@/components/reactbits/ProfileCard";
import { RichText } from "@/components/ui/RichText";
import LightRaysThemed from "@/components/reactbits/LightRaysThemed";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export default async function About({ locale, dict }: Props) {
  const [profile, techStack] = await Promise.all([
    getProfile(),
    getTechStack(),
  ]);

  if (!profile) {
    return (
      <section
        id="about"
        className="min-h-screen py-24 flex items-center justify-center"
      >
        <p className="text-foreground-muted text-sm">{dict.about.title}</p>
      </section>
    );
  }

  // Get localized bio (Portable Text array)
  const bio = profile.bio?.[locale] || profile.bio?.en;

  // Get image URLs if available
  const avatarUrl = profile.cardAvatar
    ? urlForImage(profile.cardAvatar)?.auto("format").url()
    : profile.profileImage
      ? urlForImage(profile.profileImage)?.auto("format").url()
      : undefined;

  const iconUrl = profile.cardIcon
    ? urlForImage(profile.cardIcon)?.url()
    : undefined;

  // Prepare tech stack items with localized titles
  const techItems = techStack.map((item) => ({
    title: getLocalizedValue(item.title, locale),
    iconName: item.iconName,
    category: item.category,
  }));

  return (
    <section id="about" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Lights */}
      <div className="absolute inset-0 pointer-events-none">
        <LightRaysThemed
          raysOrigin="top-center"
          raysSpeed={0.2}
          lightSpread={0.3}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.5}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
          darkColor="#ffffff"
          lightColor="#6366f1"
        />
      </div>


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 lg:mb-20">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-purple-400/80 mb-3">
            {dict.about.subtitle}
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            {dict.about.title}
          </h2>
          <div className="mt-4 h-px w-16 bg-gradient-to-r from-purple-500 to-cyan-500" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Profile Card — left column (2/5) */}
          <div className="lg:col-span-2 flex justify-center lg:sticky lg:top-28">
            <div className="w-full max-w-[380px]">
              <ProfileCard
                name="Yunus Emre Aytekin"
                title="Frontend Developer"
                handle="yunus103"
                status="Online"
                contactText="Contact Me"
                avatarUrl={avatarUrl}
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={true}
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

          {/* Content — right column (3/5) */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            {/* Bio Card */}
            <div className="relative group rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 sm:p-10 overflow-hidden">
              {/* Card inner glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-cyan-500/[0.03] pointer-events-none" />

              {/* Bio content from Sanity */}
              <div className="relative">
                {bio ? (
                  Array.isArray(bio) ? (
                    <RichText
                      value={bio}
                      className="!prose-base sm:!prose-lg !text-white/70 prose-headings:text-white prose-strong:text-white/90 prose-a:text-purple-400 hover:prose-a:text-purple-300 prose-p:leading-relaxed"
                    />
                  ) : (
                    <div className="text-base sm:text-lg leading-relaxed text-white/70 whitespace-pre-line">
                      {bio}
                    </div>
                  )
                ) : (
                  <div className="text-base sm:text-lg leading-relaxed text-white/70">
                    {profile.shortBio?.[locale] ||
                      profile.shortBio?.en ||
                      dict.about.title}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-3">
              <InfoPill icon="📍" label="İstanbul, Türkiye" />
              <InfoPill icon="🎓" label="İstanbul Üniversitesi-Cerrahpaşa" />
              <InfoPill icon="💼" label="Freelance" />
              <InfoPill icon="🌐" label="TR / EN" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoPill({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/50 text-sm font-light hover:border-white/[0.15] hover:text-white/70 transition-all duration-300 cursor-default">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
