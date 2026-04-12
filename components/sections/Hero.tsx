'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { HiArrowDown } from 'react-icons/hi2'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/getDictionary'
import { hyperspeedPresets } from '@/components/reactbits/Hyperspeed/HyperSpeedPresets'

// Dynamic import — Hyperspeed uses WebGL/Canvas (browser-only APIs)
const Hyperspeed = dynamic(
  () => import('@/components/reactbits/Hyperspeed/Hyperspeed'),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-black" />,
  }
)

interface Props {
  locale: Locale
  dict: Dictionary
}

// Module-level constant — avoids unnecessary re-renders (as the component docs recommend)
const HYPERSPEED_OPTIONS = hyperspeedPresets.four

export default function Hero({ locale: _locale, dict }: Props) {
  // useMemo as an extra safety net if the component ever re-renders with dynamic options
  const effectOptions = useMemo(() => HYPERSPEED_OPTIONS, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* ── Full-screen Hyperspeed WebGL background ─────────────── */}
      <div className="absolute inset-0">
        <Hyperspeed effectOptions={effectOptions} />
      </div>

      {/* ── Top gradient: keeps header legible ───────────────────── */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

      {/* ── Bottom gradient: smooth transition into next section (Dark mode only) ─── */}
      <div className="absolute inset-x-0 bottom-0 h-48 hidden dark:block bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* ── Hero Content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto select-none">

        {/* Availability badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 text-xs font-medium mb-8 tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Freelance için müsait
        </div>

        {/* Greeting */}
        <p className="text-white/50 text-lg sm:text-xl font-light tracking-widest mb-2">
          {dict.hero.greeting}
        </p>

        {/* Name — main heading */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-tight tracking-tight mb-4">
          Yunus Emre
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Aytekin
          </span>
        </h1>

        {/* Role / Tagline */}
        <p className="text-white/60 text-base sm:text-lg lg:text-xl font-light max-w-xl mt-2 mb-10 leading-relaxed">
          {dict.hero.tagline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-95 transition-all duration-200 shadow-lg shadow-white/10"
          >
            {dict.hero.cta}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white font-medium text-sm hover:bg-white/10 hover:border-white/30 active:scale-95 transition-all duration-200"
          >
            {dict.hero.ctaSecondary}
          </a>
        </div>

        {/* Click hint */}
        <p className="text-white/20 text-xs mt-10 tracking-widest uppercase">
          Hızlanmak için bas &amp; tut
        </p>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────── */}
      <a
        href="#portfolio"
        aria-label="Aşağı kaydır"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-colors duration-300"
      >
        <HiArrowDown className="w-5 h-5 animate-bounce" />
      </a>
    </section>
  )
}
