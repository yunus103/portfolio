import { defineType, defineField } from 'sanity'

/**
 * Singleton document — one instance, no create/delete.
 * Controlled via structureTool in sanity.config.ts.
 */
export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // ── SEO ─────────────────────────────────────────────────────────
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      description: 'Browser tab title and search engine result title',
      type: 'object',
      fields: [
        { name: 'tr', type: 'string', title: 'Turkish' },
        { name: 'en', type: 'string', title: 'English' },
      ],
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      description: 'Search engine result snippet (150–160 chars recommended)',
      type: 'object',
      fields: [
        { name: 'tr', type: 'text', title: 'Turkish', rows: 2 },
        { name: 'en', type: 'text', title: 'English', rows: 2 },
      ],
    }),
    defineField({
      name: 'searchConsoleVerification',
      title: 'Google Search Console Verification Code',
      description:
        'Paste only the "content" value from the <meta> tag Google provides',
      type: 'string',
    }),

    // ── Open Graph ───────────────────────────────────────────────────
    defineField({
      name: 'ogTitle',
      title: 'OG Title (Social Sharing Override)',
      type: 'object',
      fields: [
        { name: 'tr', type: 'string', title: 'Turkish' },
        { name: 'en', type: 'string', title: 'English' },
      ],
    }),
    defineField({
      name: 'ogDescription',
      title: 'OG Description (Social Sharing Override)',
      type: 'object',
      fields: [
        { name: 'tr', type: 'text', title: 'Turkish', rows: 2 },
        { name: 'en', type: 'text', title: 'English', rows: 2 },
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image (Social Preview)',
      description: 'Recommended: 1200 × 630 px',
      type: 'image',
      options: { hotspot: true },
    }),

    // ── Branding ─────────────────────────────────────────────────────
    defineField({
      name: 'logo',
      title: 'Site Logo',
      description: 'Displayed in the Header',
      type: 'image',
      options: { hotspot: false },
    }),
    defineField({
      name: 'titleLogo',
      title: 'Title / Favicon Logo',
      description: 'Used as the browser tab icon',
      type: 'image',
    }),

    // ── Contact ──────────────────────────────────────────────────────
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),

    // ── Social Links ─────────────────────────────────────────────────
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'twitterUrl',
      title: 'Twitter / X URL',
      type: 'url',
    }),

    // ── Assets ───────────────────────────────────────────────────────
    defineField({
      name: 'cvPdf',
      title: 'CV / Resume (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
