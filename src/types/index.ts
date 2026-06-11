export type Pricing = "Free" | "Freemium" | "Paid" | "Open Source";

/**
 * Quality / popularity tier, derived from 2026 trend data and output
 * quality. Used to reposition tools (strongest first) and to let
 * students scan strength at a glance.
 *   top     – market leader, best-in-class output
 *   strong  – very popular, high quality
 *   average – solid / niche / fading option
 */
export type Tier = "top" | "strong" | "average";

/**
 * Rich, page-level information about a single tool. Every field is
 * optional in the raw data: anything missing is filled in with
 * sensible, category-aware defaults by `resolveToolDetail`.
 */
export interface ToolDetail {
  /** Who built the tool, e.g. "OpenAI" or "Black Forest Labs". */
  maker?: string;
  /** Year (or year range) the tool launched. */
  founded?: string;
  /** A paragraph on how the tool works under the hood. */
  howItWorks?: string;
  /** How prompting / input works specifically for this tool. */
  promptStyle?: string;
  /** Bite-size tips on how to prompt this tool well. */
  promptTips?: string[];
  /** Step-by-step on how to actually use the tool. */
  howToUse?: string[];
  /** Step-by-step on how to sign up / log in. */
  loginSteps?: string[];
}

/** A fully-resolved detail object (no optional fields). */
export type ResolvedToolDetail = Required<ToolDetail>;

export interface Tool {
  /** Display name of the AI tool */
  name: string;
  /** Short one-line description of what the tool does */
  description: string;
  /** Official website URL */
  url: string;
  /** Pricing model */
  pricing: Pricing;
  /** Optional quality/popularity tier; resolved from trend data if omitted. */
  tier?: Tier;
  /** Optional rich detail shown on the tool's own page. */
  detail?: ToolDetail;
}

export interface Category {
  /** URL-friendly identifier, e.g. "image-generation" */
  id: string;
  /** Display name, e.g. "Image Generation" */
  name: string;
  /** Emoji used as a hand-drawn-style icon */
  icon: string;
  /** Short tagline shown on the category card */
  tagline: string;
  /** The AI tools that belong to this category */
  tools: Tool[];
}
