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
import DotField from "@/components/reactbits/DotField";
import { FiDownload } from "react-icons/fi";
import TargetCursor from "@/components/reactbits/TargetCursor";

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
        className="min-h-screen py-24 flex items-center justify-center"
      >
        <p className="text-foreground-muted text-sm">{dict.about.title}</p>
      </section>
    );
  }

  // Get localized bio (Portable Text array)
  const bio = profile.bio?.[locale] || profile.bio?.en;

  // CV URL from site settings
  const cvUrl = siteSettings?.cvPdf?.asset?.url;

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
    <section
      id="about"
      className="relative py-24 lg:py-32 overflow-hidden cursor-none"
    >
      <TargetCursor
        containerSelector="#about"
        targetSelector=".cursor-target"
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
        hoverDuration={0.2}
      />

      {/* Background DotField */}
      <div className="absolute inset-0 pointer-events-none">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
        />
      </div>

      {/* Background Noise Texture */}
      <div className="noise-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 lg:mb-20">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary/80 mb-3">
            {dict.about.subtitle}
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            {dict.about.title}
          </h2>
          <div className="mt-4 h-px w-16 bg-gradient-to-r from-primary to-accent" />
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
            <div className="about-card relative group overflow-hidden">
              {/* Card inner glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.04] pointer-events-none" />

              {/* Bio content from Sanity */}
              <div className="relative">
                {bio ? (
                  Array.isArray(bio) ? (
                    <RichText
                      value={bio}
                      className="!prose-base sm:!prose-lg prose-p:leading-relaxed"
                    />
                  ) : (
                    <div className="text-base sm:text-lg leading-relaxed text-foreground-muted dark:text-white/70 whitespace-pre-line">
                      {bio}
                    </div>
                  )
                ) : (
                  <div className="text-base sm:text-lg leading-relaxed text-foreground-muted dark:text-white/70">
                    {profile.shortBio?.[locale] ||
                      profile.shortBio?.en ||
                      dict.about.title}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              <InfoPill icon="📍" label="İstanbul, Türkiye" />
              <InfoPill icon="🎓" label="İstanbul Üniversitesi-Cerrahpaşa" />
              <InfoPill icon="💼" label="Freelance" />
              <InfoPill icon="🌐" label="TR / EN" />
            </div>

            {/* CV Download Button */}
            {cvUrl && (
              <div className="pt-2">
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="about-cv-btn cursor-target group/btn inline-flex items-center gap-3"
                >
                  <FiDownload className="w-[18px] h-[18px] transition-transform duration-300 group-hover/btn:-translate-y-0.5" />
                  <span className="font-medium text-sm sm:text-base tracking-wide">
                    {dict.nav.downloadCV}
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoPill({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="about-pill inline-flex items-center gap-2 sm:gap-2.5 cursor-default cursor-target">
      <span className="text-sm sm:text-base">{icon}</span>
      <span className="text-xs sm:text-sm">{label}</span>
    </div>
  );
}
