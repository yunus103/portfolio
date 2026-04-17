import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/getDictionary'
import DotField from '@/components/reactbits/DotField'

interface Props {
  locale: Locale
  dict: Dictionary
}

export default function Portfolio({ locale: _locale, dict }: Props) {
  return (
    <section
      id="portfolio"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
        />
      </div>
      
      <div className="relative z-10 pointer-events-auto">
        <p className="text-foreground-muted text-sm border border-white/10 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm">
          {/* Portfolio Section — Phase 1 placeholder */}
          {dict.portfolio.title}
        </p>
      </div>
    </section>
  )
}

