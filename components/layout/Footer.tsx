import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/getDictionary'

interface Props {
  locale: Locale
  dict: Dictionary
}

export default function Footer({ locale: _locale, dict }: Props) {
  const year = new Date().getFullYear()

  return (
    <footer
      id="site-footer"
      className="border-t border-border bg-background-secondary"
    >
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center gap-1 text-sm text-foreground-muted">
          <p>
            © {year} Yunus Emre Aytekin.{' '}
            {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
