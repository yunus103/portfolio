'use client'

import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/**
 * Wraps the app with Lenis smooth scroll.
 * `root` prop makes Lenis take over the main window scroll.
 */
export default function LenisProvider({ children }: Props) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,         // Smoothness (lower = smoother, 0.1 is a nice default)
        duration: 1.2,     // Scroll animation duration in seconds
        smoothWheel: true, // Apply lerp to wheel events
      }}
    >
      {children}
    </ReactLenis>
  )
}
