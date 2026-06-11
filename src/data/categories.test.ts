import { describe, it, expect } from "vitest";
import { categories } from "./categories";
import { categoriesSchema } from "./schema";
import { resolveTier } from "./tiers";
import { slugify } from "../utils/slug";

/**
 * These tests guard the things that would embarrass us live:
 * malformed data, broken links, duplicate slugs, or a category that
 * silently fell below the promised tool count.
 */

describe("categories catalogue", () => {
  it("matches the data schema (valid pricing, https urls, slugs)", () => {
    expect(() => categoriesSchema.parse(categories)).not.toThrow();
  });

  it("has at least 10 categories", () => {
    expect(categories.length).toBeGreaterThanOrEqual(10);
  });

  it("gives every category at least 20 tools", () => {
    for (const c of categories) {
      expect(c.tools.length, `${c.name} should have >= 20 tools`).toBeGreaterThanOrEqual(
        20
      );
    }
  });

  it("uses unique category ids", () => {
    const ids = categories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("produces a unique, non-empty slug for every tool within a category", () => {
    for (const c of categories) {
      const slugs = c.tools.map((t) => slugify(t.name));
      for (const s of slugs) expect(s.length, `empty slug in ${c.name}`).toBeGreaterThan(0);
      expect(
        new Set(slugs).size,
        `duplicate tool slug in ${c.name}`
      ).toBe(slugs.length);
    }
  });

  it("resolves a known tier for every tool", () => {
    const valid = new Set(["top", "strong", "average"]);
    for (const c of categories) {
      for (const t of c.tools) {
        expect(valid.has(resolveTier(t)), `${t.name} has bad tier`).toBe(true);
      }
    }
  });

  it("includes at least one top pick in every category", () => {
    for (const c of categories) {
      const hasTop = c.tools.some((t) => resolveTier(t) === "top");
      expect(hasTop, `${c.name} has no top pick to teach`).toBe(true);
    }
  });
});
