import { z } from "zod";

import {
  confidenceSchema,
  isoDateSchema,
  provenanceSchema,
} from "./provenance";

const entityKeySchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const commonEntityShape = {
  id: entityKeySchema,
  slug: entityKeySchema,
  name: z.string().trim().min(2).max(80),
  summary: z.string().trim().min(30).max(240),
  patch: z.string().trim().min(1).max(40),
  updatedAt: isoDateSchema,
  sources: z.array(provenanceSchema).min(1),
  confidence: confidenceSchema,
};

export const heroFactSchema = z
  .object({
    ...commonEntityShape,
    role: z.enum(["tank", "damage", "support", "specialist"]),
    difficulty: z.number().int().min(1).max(5),
    strengths: z.array(z.string().trim().min(3).max(80)).min(1),
    weaknesses: z.array(z.string().trim().min(3).max(80)).min(1),
  })
  .strict();

export const weaponFactSchema = z
  .object({
    ...commonEntityShape,
    weaponClass: z.enum([
      "rifle",
      "smg",
      "shotgun",
      "sniper",
      "sidearm",
      "melee",
      "launcher",
    ]),
    damage: z.number().positive(),
    fireRate: z.number().positive(),
    effectiveRange: z.number().positive(),
  })
  .strict();

export const itemFactSchema = z
  .object({
    ...commonEntityShape,
    category: z.enum([
      "offense",
      "defense",
      "utility",
      "consumable",
      "currency",
    ]),
    cost: z.number().nonnegative(),
    effect: z.string().trim().min(12).max(240),
  })
  .strict();

export const mapFactSchema = z
  .object({
    ...commonEntityShape,
    mode: z.string().trim().min(2).max(50),
    size: z.enum(["small", "medium", "large"]),
    keyLocations: z.array(z.string().trim().min(2).max(80)).min(1),
  })
  .strict();

function uniqueEntityCollection<
  TSchema extends z.ZodType<{ id: string; slug: string }>,
>(schema: TSchema) {
  return z.array(schema).superRefine((entries, context) => {
    const ids = new Set<string>();
    const slugs = new Set<string>();

    entries.forEach((entry, index) => {
      if (ids.has(entry.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate entity id: ${entry.id}`,
          path: [index, "id"],
        });
      }
      if (slugs.has(entry.slug)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate entity slug: ${entry.slug}`,
          path: [index, "slug"],
        });
      }

      ids.add(entry.id);
      slugs.add(entry.slug);
    });
  });
}

export const heroFactsSchema = uniqueEntityCollection(heroFactSchema);
export const weaponFactsSchema = uniqueEntityCollection(weaponFactSchema);
export const itemFactsSchema = uniqueEntityCollection(itemFactSchema);
export const mapFactsSchema = uniqueEntityCollection(mapFactSchema);

export type HeroFact = z.output<typeof heroFactSchema>;
export type WeaponFact = z.output<typeof weaponFactSchema>;
export type ItemFact = z.output<typeof itemFactSchema>;
export type MapFact = z.output<typeof mapFactSchema>;

export function parseHeroFacts(input: unknown) {
  return heroFactsSchema.parse(input);
}

export function parseWeaponFacts(input: unknown) {
  return weaponFactsSchema.parse(input);
}

export function parseItemFacts(input: unknown) {
  return itemFactsSchema.parse(input);
}

export function parseMapFacts(input: unknown) {
  return mapFactsSchema.parse(input);
}
