import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const faqItemSchema = z
  .object({
    question: z.string().trim().min(5).max(180),
    answer: z.string().trim().min(1).max(2000),
  })
  .strict();

const contentSchema = z
  .object({
    pageId: z.string().regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/),
    faq: z.array(faqItemSchema).optional(),
  })
  .strict();

function editorialCollection(base: string) {
  return defineCollection({
    loader: glob({ base, pattern: "**/*.{md,mdx}" }),
    schema: contentSchema,
  });
}

export const collections = {
  guides: editorialCollection("./src/content/guides"),
  tierLists: editorialCollection("./src/content/meta"),
  news: editorialCollection("./src/content/news"),
};
