import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import Hero from '@/components/sections/Hero'
import Portfolio from '@/components/sections/Portfolio'
import About from '@/components/sections/About'
import HowIWork from '@/components/sections/HowIWork'
import Contact from '@/components/sections/Contact'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale
  const dict = await getDictionary(locale)

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <Portfolio locale={locale} dict={dict} />
      <About locale={locale} dict={dict} />
      <HowIWork locale={locale} dict={dict} />
      <Contact locale={locale} dict={dict} />
    </>
  )
}
