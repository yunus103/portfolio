import { defineType, defineField } from 'sanity'

export const techStackSchema = defineType({
  name: 'techStack',
  title: 'Tech Stack',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'tr', type: 'string', title: 'Turkish' },
        { name: 'en', type: 'string', title: 'English' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'iconName',
      title: 'Icon Name (react-icons)',
      description: 'e.g. SiNextdotjs, SiReact, SiTypescript — from react-icons/si',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Frontend', value: 'frontend' },
          { title: 'Backend', value: 'backend' },
          { title: 'Database', value: 'database' },
          { title: 'DevOps / Cloud', value: 'devops' },
          { title: 'CMS', value: 'cms' },
          { title: 'Design', value: 'design' },
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'frontend',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Lower number = shown first',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'category',
    },
    prepare(selection) {
      return {
        title: selection.title || 'Tech Item',
        subtitle: selection.subtitle,
      }
    },
  },
})
