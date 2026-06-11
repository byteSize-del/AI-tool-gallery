/**
 * Central app configuration.
 *
 * The loading screens and skeletons exist to *teach* loading states
 * during the seminar. Rather than scattering `setTimeout` delays through
 * the codebase, the intent lives here behind a single DEMO_MODE flag so
 * it is deliberate and easy to switch off for a "real" deployment.
 */

/** When false, all artificial demo delays collapse to 0ms. */
export const DEMO_MODE = true;

/** Full-screen loading-screen duration on route changes (ms). */
export const ROUTE_LOADING_MS = DEMO_MODE ? 750 : 0;

/** Skeleton placeholder duration while a page "loads" its content (ms). */
export const SKELETON_MS = DEMO_MODE ? 650 : 0;

/**
 * When the tool rankings / tiers were last reviewed against trend data.
 * Surfaced in the UI so students know the list ages and learn to judge
 * tools themselves rather than memorising a snapshot.
 */
export const TIERS_LAST_REVIEWED = "June 2026";

/** Plain-language description of how tools are ranked. */
export const RANKING_METHODOLOGY =
  "Tools are ranked by a blend of market share, output quality, and recent momentum, drawn from 2026 comparison reports and usage data. AI moves fast, so treat this as a snapshot and learn the evaluation framework, not just the order.";
