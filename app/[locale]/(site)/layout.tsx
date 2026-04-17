import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales, defaultLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { getSiteSettings, getLocalizedValue } from '@/sanity/queries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LenisProvider from '@/components/ui/LenisProvider'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yunusemreaytekin.com'

  // Gracefully handle missing Sanity credentials during build
  let settings = null
  try {
    settings = await getSiteSettings()
  } catch {
    // Sanity not configured yet — fall back to defaults
  }

  const title =
    getLocalizedValue(settings?.metaTitle, locale) || 'Yunus Emre Aytekin'
  const description =
    getLocalizedValue(settings?.metaDescription, locale) ||
    'Full Stack Developer & Freelancer'
  const ogTitle =
    getLocalizedValue(settings?.ogTitle, locale) || title
  const ogDescription =
    getLocalizedValue(settings?.ogDescription, locale) || description
  const canonicalUrl =
    locale === defaultLocale ? siteUrl : `${siteUrl}/${locale}`

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        tr: siteUrl,
        en: `${siteUrl}/en`,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: 'Yunus Emre Aytekin',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
    },
    ...(settings?.searchConsoleVerification
      ? { verification: { google: settings.searchConsoleVerification } }
      : {}),
  }
}

export default async function SiteLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale

  if (!locales.includes(locale)) {
    notFound()
  }

  const dict = await getDictionary(locale)

  return (
    <LenisProvider>
      <Header locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dict={dict} />
    </LenisProvider>
  )
}
