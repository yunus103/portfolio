'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { HiSun, HiMoon } from 'react-icons/hi2'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full" aria-hidden="true" />
  }

  const isDark = theme === 'dark'

  return (
    <button
      id="theme-toggle"
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-foreground-muted hover:text-foreground hover:border-primary transition-colors duration-200 cursor-pointer"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <HiSun className="w-4 h-4" />
      ) : (
        <HiMoon className="w-4 h-4" />
      )}
    </button>
  )
}
