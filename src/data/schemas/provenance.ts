import { z } from "zod";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use an ISO date in YYYY-MM-DD format.");

export const sourceTypeSchema = z.enum([
  "official",
  "developer",
  "first-party-platform",
  "community",
  "editorial",
]);

export const confidenceSchema = z.enum(["high", "medium", "low"]);

export const provenanceSchema = z
  .object({
    sourceUrl: z.url().refine((value) => new URL(value).protocol === "https:", {
      message: "Source URL must use HTTPS.",
    }),
    sourceType: sourceTypeSchema,
    accessedAt: isoDateSchema,
    publishedAt: isoDateSchema.optional(),
    evidenceNote: z.string().trim().min(12).max(300),
  })
  .strict();

export type Provenance = z.output<typeof provenanceSchema>;
export type Confidence = z.output<typeof confidenceSchema>;
export { isoDateSchema };
