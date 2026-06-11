/**
 * Turn a tool name into a URL-friendly slug.
 * e.g. "DALL·E 3" -> "dall-e-3", "v0 by Vercel" -> "v0-by-vercel"
 */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/·/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
