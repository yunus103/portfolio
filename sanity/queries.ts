import { client } from './client'
import type { Locale } from '../i18n/config'

// ─── Shared Types ──────────────────────────────────────────────────────────────

export type SanityLocalizedString = {
  tr: string
  en: string
}

/** Get the correct locale string, falling back to Turkish then empty string */
export function getLocalizedValue(
  field: SanityLocalizedString | undefined,
  locale: Locale
): string {
  if (!field) return ''
  return field[locale] || field.tr || ''
}

// ─── Site Settings ─────────────────────────────────────────────────────────────

export interface SiteSettings {
  metaTitle?: SanityLocalizedString
  metaDescription?: SanityLocalizedString
  ogTitle?: SanityLocalizedString
  ogDescription?: SanityLocalizedString
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ogImage?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logo?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  titleLogo?: any
  searchConsoleVerification?: string
  contactEmail?: string
  contactPhone?: string
  location?: string
  githubUrl?: string
  linkedinUrl?: string
  instagramUrl?: string
  twitterUrl?: string
  cvPdf?: { asset: { url: string } }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(
    `*[_type == "siteSettings"][0]{
      metaTitle,
      metaDescription,
      ogTitle,
      ogDescription,
      ogImage,
      logo,
      titleLogo,
      searchConsoleVerification,
      contactEmail,
      contactPhone,
      location,
      githubUrl,
      linkedinUrl,
      instagramUrl,
      twitterUrl,
      "cvPdf": cvPdf{ "asset": asset->{ url } }
    }`,
    {},
    { next: { tags: ['siteSettings'] } }
  )
}

// ─── Profile ───────────────────────────────────────────────────────────────────

export interface Profile {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bio?: any
  shortBio?: SanityLocalizedString
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profileImage?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cardAvatar?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cardIcon?: any
  cardContactUrl?: string
  resumePdf?: { asset: { url: string } }
  yearsOfExperience?: number
  projectCount?: number
  clientCount?: number
}

export async function getProfile(): Promise<Profile | null> {
  return client.fetch(
    `*[_type == "profile"][0]{
      bio,
      shortBio,
      profileImage,
      cardAvatar,
      cardIcon,
      cardContactUrl,
      "resumePdf": resumePdf{ "asset": asset->{ url } },
      yearsOfExperience,
      projectCount,
      clientCount
    }`,
    {},
    { next: { tags: ['profile'] } }
  )
}

// ─── Projects ──────────────────────────────────────────────────────────────────

export interface Project {
  _id: string
  title: SanityLocalizedString
  slug: { current: string }
  description?: SanityLocalizedString
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images?: any[]
  techTags?: string[]
  liveUrl?: string
  githubUrl?: string
  performanceScore?: number
  featured?: boolean
  order?: number
}

export async function getProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project"] | order(order asc, _createdAt desc)`,
    {},
    { next: { tags: ['projects'] } }
  )
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project" && featured == true] | order(order asc)`,
    {},
    { next: { tags: ['projects'] } }
  )
}

// ─── Tech Stack ────────────────────────────────────────────────────────────────

export interface TechStackItem {
  _id: string
  title: SanityLocalizedString
  iconName?: string
  category?: string
  order?: number
}

export async function getTechStack(): Promise<TechStackItem[]> {
  return client.fetch(
    `*[_type == "techStack"] | order(order asc, category asc)`,
    {},
    { next: { tags: ['techStack'] } }
  )
}
