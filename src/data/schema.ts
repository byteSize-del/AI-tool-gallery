import { z } from "zod";

/**
 * Schemas that validate the tool catalogue. With 250+ tools across 12
 * categories, a single malformed entry (a bad URL, an unknown pricing
 * label, a typo'd tier) should never ship a broken card. These schemas
 * are the single source of truth and are exercised by the data tests.
 */

export const pricingSchema = z.enum(["Free", "Freemium", "Paid", "Open Source"]);

export const tierSchema = z.enum(["top", "strong", "average"]);

export const toolDetailSchema = z
  .object({
    maker: z.string().min(1).optional(),
    founded: z.string().min(1).optional(),
    howItWorks: z.string().min(1).optional(),
    promptStyle: z.string().min(1).optional(),
    promptTips: z.array(z.string().min(1)).optional(),
    howToUse: z.array(z.string().min(1)).optional(),
    loginSteps: z.array(z.string().min(1)).optional(),
  })
  .strict();

export const toolSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    url: z.string().url().startsWith("https://", "URLs must use https"),
    pricing: pricingSchema,
    tier: tierSchema.optional(),
    detail: toolDetailSchema.optional(),
  })
  .strict();

export const categorySchema = z
  .object({
    id: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/, "id must be a url-friendly slug"),
    name: z.string().min(1),
    icon: z.string().min(1),
    tagline: z.string().min(1),
    tools: z.array(toolSchema),
  })
  .strict();

export const categoriesSchema = z.array(categorySchema);

/**
 * Throws a readable error if the catalogue is invalid. Safe to call at
 * startup (dev) so problems surface immediately rather than as a blank card.
 */
export function assertValidCategories(data: unknown) {
  return categoriesSchema.parse(data);
}
