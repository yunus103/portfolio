'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/i18n/config'

interface Props {
  locale: Locale
}

export default function LangSwitcher({ locale }: Props) {
  const pathname = usePathname()

  /**
   * Build the target URL for a given locale.
   * Turkish (default) → no prefix  → /
   * English            → /en prefix → /en/...
   */
  function getPathForLocale(target: Locale): string {
    // Strip any existing /en prefix
    const stripped = pathname.startsWith('/en')
      ? pathname.slice(3) || '/'
      : pathname

    return target === 'en' ? `/en${stripped === '/' ? '' : stripped}` : stripped || '/'
  }

  function saveCookie(value: Locale) {
    document.cookie = `NEXT_LOCALE=${value}; path=/; max-age=31536000; samesite=lax`
  }

  return (
    <div className="flex items-center gap-0.5 text-sm font-medium">
      <Link
        id="lang-tr"
        href={getPathForLocale('tr')}
        onClick={() => saveCookie('tr')}
        className={`px-2 py-1 rounded transition-colors duration-200 ${
          locale === 'tr'
            ? 'text-primary font-semibold'
            : 'text-foreground-muted hover:text-foreground'
        }`}
      >
        TR
      </Link>
      <span className="text-border select-none">|</span>
      <Link
        id="lang-en"
        href={getPathForLocale('en')}
        onClick={() => saveCookie('en')}
        className={`px-2 py-1 rounded transition-colors duration-200 ${
          locale === 'en'
            ? 'text-primary font-semibold'
            : 'text-foreground-muted hover:text-foreground'
        }`}
      >
        EN
      </Link>
    </div>
  )
}
