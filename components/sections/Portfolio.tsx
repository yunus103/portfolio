import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/getDictionary'

interface Props {
  locale: Locale
  dict: Dictionary
}

export default function Portfolio({ locale: _locale, dict }: Props) {
  return (
    <section
      id="portfolio"
      className="min-h-screen flex items-center justify-center"
    >
      <p className="text-foreground-muted text-sm">
        {/* Portfolio Section — Phase 1 placeholder */}
        {dict.portfolio.title}
      </p>
    </section>
  )
}
