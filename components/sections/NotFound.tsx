'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import FuzzyText from '@/components/reactbits/FuzzyText'
import CustomButton from '@/components/ui/CustomButton'
import { Dictionary } from '@/i18n/getDictionary'
import { Locale } from '@/i18n/config'

interface NotFoundProps {
  dict: Dictionary
}

export default function NotFoundComponent({ dict }: NotFoundProps) {
  const params = useParams()
  const locale = (params?.locale as Locale) || 'tr'
  
  // Always use white for the fuzzy text in dark mode
  const textColor = '#ffffff'

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 blur-[150px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="flex flex-col items-center gap-0 mb-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 w-full max-w-[90vw] mx-auto">
        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={0.5}
          enableHover
          color={textColor}
          fuzzRange={20}
          fontWeight={900}
          className="w-full h-auto max-w-[500px]"
        >
          404
        </FuzzyText>
      </div>

      <div className="text-center max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {dict.notFound.title}
        </h1>
        <p className="text-foreground-muted text-base md:text-lg mb-10">
          {dict.notFound.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={`/${locale}`}>
            <CustomButton variant="primary" className="min-w-[180px] h-12 text-base">
              {dict.notFound.backToHome}
            </CustomButton>
          </Link>
          <Link href={`/${locale}#contact`}>
            <CustomButton variant="outline" className="min-w-[180px] h-12 text-base">
              {dict.notFound.contact}
            </CustomButton>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-foreground-muted/30 text-xs font-mono tracking-widest uppercase">
        Error Code: 0x404_PAGE_MISSING
      </div>
    </section>
  )
}
