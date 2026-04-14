import { locales, Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import NotFoundComponent from '@/components/sections/NotFound'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function NotFoundPage({ params }: Props) {
  const { locale: rawLocale } = await params
  
  if (!locales.includes(rawLocale as Locale)) {
    notFound()
  }

  const locale = rawLocale as Locale
  const dict = await getDictionary(locale)

  return <NotFoundComponent dict={dict} />
}
