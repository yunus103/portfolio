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
        { name: 'tr', type: 'text', title: 'Turkish', rows: 6 },
        { name: 'en', type: 'text', title: 'English', rows: 6 },
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
