'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiBars3, HiXMark } from 'react-icons/hi2'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/getDictionary'
import ThemeToggle from '@/components/ui/ThemeToggle'
import LangSwitcher from '@/components/ui/LangSwitcher'

interface Props {
  locale: Locale
  dict: Dictionary
}

export default function Header({ locale, dict }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const homeHref = locale === 'tr' ? '/' : '/en'

  const navLinks = [
    { href: '#portfolio', label: dict.nav.projects, id: 'nav-portfolio' },
    { href: '#about', label: dict.nav.about, id: 'nav-about' },
    { href: '#how-i-work', label: dict.nav.howIWork, id: 'nav-how-i-work' },
    { href: '#contact', label: dict.nav.contact, id: 'nav-contact' },
  ]

  // Slightly increase shadow on scroll for depth
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6">

      {/* ── Pill header ─────────────────────────────────────────── */}
      <header
        id="site-header"
        className={[
          'mx-auto max-w-5xl rounded-full',
          'border border-border',
          'bg-background/80 backdrop-blur-md',
          'transition-shadow duration-300',
          scrolled
            ? 'shadow-[0_8px_32px_rgba(0,0,0,0.25)]'
            : 'shadow-[0_4px_16px_rgba(0,0,0,0.12)]',
        ].join(' ')}
      >
        <div className="flex h-13 sm:h-14 items-center justify-between px-5 sm:px-7">

          {/* Logo */}
          <Link
            href={homeHref}
            id="header-logo"
            className="text-lg font-bold tracking-tight text-foreground hover:text-primary transition-colors duration-200 shrink-0"
          >
            YEA
          </Link>

          {/* Desktop nav — hidden on mobile */}
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                id={link.id}
                href={link.href}
                className="text-sm text-foreground-muted hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Lang + theme — always visible on md+, hidden on mobile (in drawer instead) */}
            <div className="hidden md:flex items-center gap-2">
              <LangSwitcher locale={locale} />
              <ThemeToggle />
            </div>

            {/* Hamburger — mobile only */}
            <button
              id="mobile-menu-toggle"
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-border text-foreground-muted hover:text-foreground hover:border-primary transition-colors duration-200 cursor-pointer"
            >
              {mobileOpen ? (
                <HiXMark className="w-4 h-4" />
              ) : (
                <HiBars3 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile dropdown ─────────────────────────────────────── */}
      <div
        className={[
          'md:hidden mx-auto max-w-5xl mt-2',
          'rounded-2xl border border-border',
          'bg-background/95 backdrop-blur-md shadow-lg',
          'overflow-hidden transition-all duration-300 ease-in-out',
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 border-transparent',
        ].join(' ')}
        aria-hidden={!mobileOpen}
      >
        <div className="px-5 py-4">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Lang + Theme in mobile drawer */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <LangSwitcher locale={locale} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
