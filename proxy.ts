import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, type Locale } from './i18n/config'

/**
 * Infer locale from cookie → Accept-Language header → default
 */
function getLocaleFromRequest(request: NextRequest): Locale {
  // 1. Saved user preference (cookie)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale
  }

  // 2. Browser language preference (Accept-Language header)
  const acceptLang = request.headers.get('accept-language') ?? ''
  const preferred = acceptLang
    .split(',')
    .map((s) => s.split(';')[0].trim().substring(0, 2).toLowerCase())
    .find((lang) => (locales as readonly string[]).includes(lang))

  // 3. Fall back to default locale (Turkish)
  return (preferred as Locale | undefined) ?? defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Skip non-page paths ──────────────────────────────────────────
  if (
    pathname.startsWith('/studio') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.[\w]+$/) // static files (images, fonts, etc.)
  ) {
    return NextResponse.next()
  }

  // ── Check if URL already carries a locale prefix ─────────────────
  const pathnameLocale = locales.find(
    (locale) =>
      pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (pathnameLocale) {
    // Canonical redirect: remove default locale prefix to keep URLs clean
    // e.g. /tr → / (permanent)
    if (pathnameLocale === defaultLocale) {
      const stripped = pathname.slice(`/${defaultLocale}`.length) || '/'
      const url = request.nextUrl.clone()
      url.pathname = stripped
      return NextResponse.redirect(url, { status: 308 })
    }

    // Non-default locale is already in URL — pass through
    return NextResponse.next()
  }

  // ── No locale prefix — determine which locale to serve ───────────
  const locale = getLocaleFromRequest(request)

  if (locale !== defaultLocale) {
    // Non-Turkish preference → redirect to prefixed URL (e.g. /en)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    const response = NextResponse.redirect(url)
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    })
    return response
  }

  // ── Default locale (Turkish): rewrite internally, URL stays clean ─
  // e.g. / → internally served as /tr, URL bar still shows /
  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname}`
  const response = NextResponse.rewrite(url)
  response.cookies.set('NEXT_LOCALE', defaultLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return response
}

export const config = {
  // Apply to all paths except static assets handled by Next.js internals
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
}
