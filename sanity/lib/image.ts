import imageUrlBuilder from '@sanity/image-url'
import { client } from '../client'

const builder = imageUrlBuilder(client)

// Use inferred parameter type to avoid internal path imports (changed in v2)
type SanityImageSource = Parameters<typeof builder.image>[0]

/**
 * urlFor — raw builder. Usage: urlFor(image).width(800).url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * urlForImage — alias used by SanityImage component.
 * Accepts the full image object (with asset, hotspot, crop).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlForImage(image: any) {
  if (!image?.asset) return null
  return builder.image(image)
}

/**
 * getImageLqip — returns the low-quality image placeholder string.
 * Requires the Sanity query to include: asset->{ metadata { lqip } }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getImageLqip(image: any): string | undefined {
  return image?.asset?.metadata?.lqip ?? undefined
}
