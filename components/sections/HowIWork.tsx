import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/getDictionary'

interface Props {
  locale: Locale
  dict: Dictionary
}

export default function HowIWork({ locale: _locale, dict }: Props) {
  return (
    <section
      id="how-i-work"
      className="min-h-screen flex items-center justify-center"
    >
      <p className="text-foreground-muted text-sm">
        {/* How I Work Section — Phase 1 placeholder */}
        {dict.howIWork.title}
      </p>
    </section>
  )
}
