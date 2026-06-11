import type { Category, Tier, Tool } from "../types";

/**
 * Tier assignments based on mid-2026 popularity (market share, web
 * traffic, app downloads) and output-quality reviews gathered from
 * current comparison reports. Anything not listed defaults to "average".
 *
 * Sources informing these picks (2026): chatbot market-share reports
 * (ChatGPT ~55%, Gemini ~27%, Claude rising), AI image generator
 * round-ups (Midjourney / FLUX / Ideogram leading), coding-assistant
 * surveys (Cursor / Copilot / Claude Code), video round-ups
 * (Veo / Runway / Kling) and music reports (Suno / Udio / ElevenLabs).
 */

const top: string[] = [
  // Image
  "Midjourney",
  "Flux",
  "Ideogram",
  // Coding
  "Cursor",
  "GitHub Copilot",
  "Claude Code",
  // Writing
  "ChatGPT",
  "Claude",
  "Grammarly",
  // Video
  "Veo",
  "Runway",
  "Kling AI",
  // Audio & Music
  "Suno",
  "ElevenLabs",
  "Udio",
  // Chatbots
  "Gemini",
  "Perplexity",
  // Productivity
  "Notion AI",
  "Microsoft 365 Copilot",
  // Design
  "Figma AI",
  "Canva Magic Studio",
  "v0 by Vercel",
  // Data & Analytics
  "Julius AI",
  "Power BI Copilot",
  // Voice & Speech
  "Whisper",
  "Murf AI",
  // Research & Search
  "NotebookLM",
  "Consensus",
  // 3D
  "Luma AI",
  "Meshy",
  "Spline AI",
];

const strong: string[] = [
  // Image
  "Adobe Firefly",
  "Stable Diffusion",
  "Leonardo.Ai",
  "Krea",
  "Recraft",
  "Playground AI",
  "Civitai",
  "DALL·E 3",
  // Coding
  "Codeium / Windsurf",
  "Kiro",
  "Replit Agent",
  "Bolt.new",
  "Lovable",
  "Amazon Q Developer",
  "Tabnine",
  "Aider",
  "Continue",
  "DeepSeek Coder",
  // Writing
  "Gemini",
  "Jasper",
  "Notion AI",
  "QuillBot",
  "Copy.ai",
  "Writesonic",
  "Sudowrite",
  "Wordtune",
  // Video
  "Sora",
  "HeyGen",
  "Synthesia",
  "Pika",
  "Luma Dream Machine",
  "Hailuo / MiniMax",
  "Descript",
  "CapCut AI",
  // Audio & Music
  "AIVA",
  "Adobe Podcast",
  "Murf AI",
  "Krisp",
  "Play.ht",
  "Riffusion",
  "Moises",
  // Chatbots
  "Microsoft Copilot",
  "Grok",
  "DeepSeek",
  "Meta AI",
  "Poe",
  // Productivity
  "Gemini for Workspace",
  "Zapier AI",
  "Otter.ai",
  "Fireflies.ai",
  "Motion",
  "ClickUp AI",
  "Make",
  // Design
  "Framer AI",
  "Uizard",
  "Recraft",
  "Galileo AI",
  "Relume",
  "Looka",
  // Data & Analytics
  "ThoughtSpot",
  "Tableau Pulse",
  "Hex",
  "Deepnote",
  "Rows",
  "Akkio",
  // Voice & Speech
  "Play.ht",
  "Deepgram",
  "AssemblyAI",
  "Descript Overdub",
  "Speechify",
  "Resemble AI",
  // Research & Search
  "Elicit",
  "SciSpace",
  "Semantic Scholar",
  "Scite",
  "Exa",
  "ChatPDF",
  // 3D
  "Tripo AI",
  "Rodin",
  "Polycam",
  "CSM (Common Sense Machines)",
  "Kaedim",
  "Blockade Labs",
  "Move AI",
];

const topSet = new Set(top);
const strongSet = new Set(strong);

/** Resolve a tool's tier: explicit value wins, else trend map, else average. */
export function resolveTier(tool: Tool): Tier {
  if (tool.tier) return tool.tier;
  if (topSet.has(tool.name)) return "top";
  if (strongSet.has(tool.name)) return "strong";
  return "average";
}

const tierRank: Record<Tier, number> = { top: 0, strong: 1, average: 2 };

/**
 * Reposition a category's tools by tier (strongest first), keeping the
 * original order within each tier so results stay stable.
 */
export function sortToolsByTier(category: Category): Tool[] {
  return category.tools
    .map((tool, i) => ({ tool, i, rank: tierRank[resolveTier(tool)] }))
    .sort((a, b) => a.rank - b.rank || a.i - b.i)
    .map((entry) => entry.tool);
}
