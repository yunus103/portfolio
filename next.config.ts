import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Sanity CDN loader (components/ui/SanityImage.tsx) Vercel Image Optimization'ı
    // bypass ettiği için remotePatterns bloğuna gerek kalmadı.
    // Eğer başka yerlerde next/image direkt kullanılıyorsa bu bloğu geri ekleyin.
  },
}

export default nextConfig
