"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import LightRays, { type RaysOrigin } from "./LightRays";

interface LightRaysThemedProps {
  raysOrigin?: RaysOrigin;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  /** Color override for dark mode (default: white) */
  darkColor?: string;
  /** Color override for light mode (default: indigo primary) */
  lightColor?: string;
}

export default function LightRaysThemed({
  darkColor = "#ffffff",
  lightColor = "#6366f1",
  ...props
}: LightRaysThemedProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch — render nothing until theme is known
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const color = resolvedTheme === "dark" ? darkColor : lightColor;

  return <LightRays {...props} raysColor={color} />;
}
