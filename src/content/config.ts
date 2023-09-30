import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    oldPaths: z.array(z.string()).optional(),
    lang: z.string().optional(),
  }),
});

export const collections = { blog };
