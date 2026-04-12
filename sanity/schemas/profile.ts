import { defineType, defineField } from 'sanity'

/**
 * Singleton document — controlled via structureTool in sanity.config.ts
 */
export const profileSchema = defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'bio',
      title: 'Bio (Long)',
      type: 'object',
      fields: [
        { name: 'tr', type: 'array', title: 'Turkish', of: [{ type: 'block' }, { type: 'image' }] },
        { name: 'en', type: 'array', title: 'English', of: [{ type: 'block' }, { type: 'image' }] },
      ],
    }),
    defineField({
      name: 'shortBio',
      title: 'Short Bio / Hero Tagline',
      type: 'object',
      fields: [
        { name: 'tr', type: 'string', title: 'Turkish' },
        { name: 'en', type: 'string', title: 'English' },
      ],
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'cardAvatar',
      title: 'Card Avatar (Image)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'cardIcon',
      title: 'Card Icon (Pattern)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'cardContactUrl',
      title: 'Card Contact URL',
      type: 'url',
    }),
    defineField({
      name: 'resumePdf',
      title: 'Resume / CV (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'yearsOfExperience',
      title: 'Years of Experience',
      type: 'number',
    }),
    defineField({
      name: 'projectCount',
      title: 'Projects Completed',
      type: 'number',
    }),
    defineField({
      name: 'clientCount',
      title: 'Happy Clients',
      type: 'number',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'My Profile' }
    },
  },
})
