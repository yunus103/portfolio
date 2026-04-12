import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemas } from './sanity/schemas'

// Singletons: prevent "create new" and show as direct document links
const singletonTypes = new Set(['siteSettings', 'profile'])

export default defineConfig({
  name: 'yunus-emre-aytekin',
  title: 'YEA Portfolio CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  // Studio available at /studio
  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // ── Singletons ──────────────────────────────────────────
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.listItem()
              .title('My Profile')
              .id('profile')
              .child(
                S.document()
                  .schemaType('profile')
                  .documentId('profile')
              ),

            S.divider(),

            // ── Collections ─────────────────────────────────────────
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('techStack').title('Tech Stack'),
          ]),
    }),
  ],

  schema: {
    types: schemas,
    // Remove singletons from the generic "New Document" menu
    templates: (prev) =>
      prev.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
})
