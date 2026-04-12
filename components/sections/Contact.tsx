import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/getDictionary'

interface Props {
  locale: Locale
  dict: Dictionary
}

export default function Contact({ locale: _locale, dict }: Props) {
  return (
    <section
      id="contact"
      className="min-h-screen flex items-center justify-center"
    >
      <p className="text-foreground-muted text-sm">
        {/* Contact Section — Phase 1 placeholder */}
        {dict.contact.title}
      </p>
    </section>
  )
}
