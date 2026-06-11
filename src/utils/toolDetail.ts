import type { ResolvedToolDetail, Tool } from "../types";

/* ------------------------------------------------------------------ *
 * Category-level guidance
 *
 * Every category knows how its kind of tool generally works, how
 * prompting behaves, some prompting tips, and the typical steps to
 * use one. These act as smart defaults for any tool that doesn't
 * ship its own hand-written detail.
 * ------------------------------------------------------------------ */

interface CategoryGuidance {
  howItWorks: (name: string) => string;
  promptStyle: (name: string) => string;
  promptTips: string[];
  howToUse: (name: string) => string[];
}

const genericLogin = (name: string): string[] => [
  `Open the ${name} website using the "Visit site" button on this page.`,
  `Click "Sign up" or "Get started" in the top-right corner.`,
  `Register with your email, or use a Google / GitHub / Apple account for one-click sign-in.`,
  `Verify your email if asked, then sign in to reach your dashboard.`,
  `Pick the free plan to start; upgrade later only if you need more.`,
];

const categoryGuidance: Record<string, CategoryGuidance> = {
  "image-generation": {
    howItWorks: (n) =>
      `${n} is a text-to-image tool built on a diffusion model. It was trained on huge sets of image + caption pairs, learning how to start from random noise and gradually "denoise" it into a picture that matches your words. You describe what you want, and it paints a brand-new image to match.`,
    promptStyle: (n) =>
      `In ${n} your prompt is a description of the final image. The clearer and more visual your words, the closer the result. You can stack details like subject, style, lighting, camera angle and mood, and many versions also support a negative prompt for things you want to avoid.`,
    promptTips: [
      "Lead with the subject, then add style, lighting and mood: 'a red fox, watercolor, soft morning light'.",
      "Name an art style or artist-era to steer the look (e.g. 'isometric', 'pixel art', '35mm film').",
      "Add detail words like 'highly detailed', 'studio lighting' or 'shallow depth of field'.",
      "Use a negative prompt to remove problems: 'no text, no extra fingers'.",
      "Generate several variations, then upscale or re-roll the one closest to your idea.",
    ],
    howToUse: (n) => [
      `Open ${n} and start a new image / generation.`,
      "Type a descriptive prompt of the picture you want.",
      "Choose options like aspect ratio, style or number of images.",
      "Generate, then review the variations it returns.",
      "Upscale, tweak the prompt, or download the favourite result.",
    ],
  },
  coding: {
    howItWorks: (n) =>
      `${n} is powered by a large language model trained on billions of lines of public code and documentation. It predicts the most useful next tokens given your file, comments and instructions, so it can autocomplete lines, write whole functions, explain code and suggest fixes.`,
    promptStyle: (n) =>
      `With ${n} you "prompt" through code comments, chat messages or natural-language instructions. It reads the surrounding code as context, so the more relevant code it can see, the better its suggestions. Be explicit about the language, framework and the result you expect.`,
    promptTips: [
      "State the language and framework: 'In TypeScript with React, write a hook that…'.",
      "Give examples of inputs and expected outputs.",
      "Share relevant code or error messages so it has real context.",
      "Ask for small steps, then iterate, rather than one giant request.",
      "Ask it to explain or add tests so you can verify the result.",
    ],
    howToUse: (n) => [
      `Install or open ${n} (an extension, editor or web app).`,
      "Open your project so it can see your code as context.",
      "Write a comment or chat instruction describing what you need.",
      "Review the suggestion, accept the parts you want.",
      "Run and test the code, then refine with follow-up prompts.",
    ],
  },
  writing: {
    howItWorks: (n) =>
      `${n} runs on a large language model that learned the patterns of human writing from a massive collection of text. Given your instruction it predicts fluent, on-topic sentences, so it can draft, rewrite, summarise and adjust tone on demand.`,
    promptStyle: (n) =>
      `In ${n} a good prompt sets the role, goal, audience and tone. Tell it who it is ('act as a copywriter'), what to produce, who it's for, and how long it should be. You can paste source text and ask it to transform that text.`,
    promptTips: [
      "Set a role and goal: 'Act as a travel blogger. Write an intro about Kyoto.'.",
      "Name the audience, tone and length you want.",
      "Give it source material to work from instead of writing blind.",
      "Ask for a few options, then refine the best one.",
      "Iterate: 'make it punchier', 'shorten to 100 words', 'more formal'.",
    ],
    howToUse: (n) => [
      `Open ${n} and start a new document or chat.`,
      "Describe what you want to write and for whom.",
      "Generate a first draft.",
      "Refine with follow-ups like 'shorter' or 'more formal'.",
      "Copy the result out and do a final human edit.",
    ],
  },
  "video-generation": {
    howItWorks: (n) =>
      `${n} uses a video diffusion / generative model that learned from large video datasets how frames move and connect over time. From a text prompt or a starting image it predicts a sequence of consistent frames, producing a short clip that follows your description.`,
    promptStyle: (n) =>
      `In ${n} your prompt describes the scene and the motion. Beyond the subject and style, mention camera movement (pan, zoom, tracking), pacing and what should happen across the clip. Many tools also let you supply a start image to anchor the look.`,
    promptTips: [
      "Describe the scene AND the motion: 'drone shot flying over neon city at night'.",
      "Mention camera moves: pan, zoom, dolly, slow-motion.",
      "Keep one clear action per clip; stitch clips together later.",
      "Provide a start frame / image when you can for consistency.",
      "Keep prompts shorter than for images; video models drift with overload.",
    ],
    howToUse: (n) => [
      `Open ${n} and start a new video / generation.`,
      "Enter a prompt, or upload a starting image.",
      "Set duration, aspect ratio and any motion settings.",
      "Generate and preview the clip.",
      "Re-roll or extend it, then export the video.",
    ],
  },
  "audio-music": {
    howItWorks: (n) =>
      `${n} is built on generative audio models trained on large libraries of music and sound. It maps your text (genre, mood, lyrics) to audio, generating waveforms or stems that match the style you ask for.`,
    promptStyle: (n) =>
      `In ${n} your prompt usually combines genre, mood, instruments and sometimes lyrics. The more musical vocabulary you use (tempo, key, vibe, era), the more control you get over the result.`,
    promptTips: [
      "Combine genre + mood + instruments: 'lo-fi hip hop, mellow, rainy night'.",
      "Add tempo and energy cues: 'upbeat 120 BPM' or 'slow and cinematic'.",
      "Provide lyrics in quotes if the tool sings.",
      "Reference an era or vibe rather than copying a specific artist.",
      "Generate several takes and keep the best section.",
    ],
    howToUse: (n) => [
      `Open ${n} and create a new track.`,
      "Describe the genre, mood and any lyrics you want.",
      "Set length or structure options if available.",
      "Generate and listen to the results.",
      "Regenerate, edit or download / export your track.",
    ],
  },
  chatbots: {
    howItWorks: (n) =>
      `${n} is a conversational assistant powered by a large language model. It keeps track of your conversation as context and predicts helpful replies one token at a time, so it can answer questions, brainstorm, explain things and follow multi-step instructions.`,
    promptStyle: (n) =>
      `In ${n} you simply chat in plain language. Quality jumps when you give context, state your goal and ask follow-ups. Treat it like a smart collaborator: give it the background, the task and the format you want the answer in.`,
    promptTips: [
      "Give context and a clear goal in the same message.",
      "Ask for a specific format: a list, table, or step-by-step.",
      "Tell it the persona or expertise level you want.",
      "Follow up to refine instead of restarting.",
      "Ask it to show its reasoning or cite sources when accuracy matters.",
    ],
    howToUse: (n) => [
      `Open ${n} and start a new conversation.`,
      "Type your question or task with enough context.",
      "Read the reply and ask follow-up questions to refine it.",
      "Use it for drafts, ideas and explanations.",
      "Double-check important facts before relying on them.",
    ],
  },
  productivity: {
    howItWorks: (n) =>
      `${n} layers AI on top of your everyday workflow. It connects to your notes, tasks, calendar or apps and uses a language model (plus automations) to summarise, draft, schedule and remove repetitive busywork.`,
    promptStyle: (n) =>
      `In ${n} you trigger AI with commands or instructions in plain language, often inside your existing documents or workflows. Tell it exactly what to do with the content in front of it.`,
    promptTips: [
      "Be specific about the action: 'summarise these notes into 5 bullets'.",
      "Reference the document, task or meeting you mean.",
      "Set the output format you want back.",
      "Chain simple automations rather than one complex rule.",
      "Review AI-made changes before they go live.",
    ],
    howToUse: (n) => [
      `Open ${n} and connect any apps or import your content.`,
      "Find the AI command, button or slash-action.",
      "Tell it what to summarise, draft or automate.",
      "Review what it produced.",
      "Save the automation so it runs for you next time.",
    ],
  },
  design: {
    howItWorks: (n) =>
      `${n} blends generative models with design tooling. It can turn prompts or rough sketches into layouts, components and visuals, and uses AI to suggest styles, colours and edits while keeping things editable.`,
    promptStyle: (n) =>
      `In ${n} you describe the screen, component or brand you want, including style and purpose. Many tools also let you point at an existing design and ask for variations or refinements.`,
    promptTips: [
      "Describe the screen and its purpose: 'pricing page for a SaaS app'.",
      "Name a visual style: 'minimal', 'playful', 'corporate'.",
      "Mention brand colours or upload a reference.",
      "Ask for variations, then refine the strongest one.",
      "Export to your real design tool to polish the details.",
    ],
    howToUse: (n) => [
      `Open ${n} and start a new project.`,
      "Describe the design or upload a sketch / reference.",
      "Generate layouts or components.",
      "Tweak colours, text and spacing.",
      "Export or hand off to your design / dev workflow.",
    ],
  },
  "data-analytics": {
    howItWorks: (n) =>
      `${n} connects to your data and uses AI to understand plain-language questions. It translates them into queries or analyses behind the scenes, then returns charts, tables and insights, so you don't have to write SQL or formulas by hand.`,
    promptStyle: (n) =>
      `In ${n} you "prompt" by asking questions about your data in plain English. Be specific about the metric, the time range and how you want it broken down or visualised.`,
    promptTips: [
      "Name the metric and time range: 'revenue by month this year'.",
      "Say how to slice it: 'broken down by region'.",
      "Ask for the chart type you want.",
      "Start broad, then drill into the interesting parts.",
      "Sanity-check results against numbers you already trust.",
    ],
    howToUse: (n) => [
      `Open ${n} and connect a data source or upload a file.`,
      "Ask a question about your data in plain language.",
      "Review the chart or table it returns.",
      "Refine with follow-up questions.",
      "Save or share the dashboard / insight.",
    ],
  },
  "voice-speech": {
    howItWorks: (n) =>
      `${n} uses neural speech models. For text-to-speech it converts your words into natural-sounding audio; for speech-to-text it transcribes audio into written words. Some versions can clone a voice from a short sample.`,
    promptStyle: (n) =>
      `In ${n} your "prompt" is usually the text to speak (plus a chosen voice and style) or the audio file to transcribe. Punctuation and clear phrasing shape the rhythm and emotion of the output.`,
    promptTips: [
      "Use punctuation to control pacing and pauses.",
      "Pick a voice and style that matches your audience.",
      "Break long scripts into shorter chunks for natural delivery.",
      "Spell out tricky names phonetically if needed.",
      "For transcription, upload clean audio for the best accuracy.",
    ],
    howToUse: (n) => [
      `Open ${n} and choose text-to-speech or transcription.`,
      "Paste your script or upload your audio file.",
      "Pick a voice, language or style.",
      "Generate and preview the result.",
      "Download the audio or transcript.",
    ],
  },
  "research-search": {
    howItWorks: (n) =>
      `${n} combines search with a language model. It finds relevant sources, then uses AI to read and summarise them into a direct answer, usually with citations so you can verify where each claim came from.`,
    promptStyle: (n) =>
      `In ${n} you ask a real question rather than typing keywords. Add context and constraints (timeframe, field, source type) and follow up to dig deeper into anything it surfaces.`,
    promptTips: [
      "Ask full questions, not just keywords.",
      "Add constraints: 'peer-reviewed', 'since 2022', 'for beginners'.",
      "Follow the citations to check the original source.",
      "Ask follow-ups to narrow or expand the topic.",
      "Cross-check important facts across multiple sources.",
    ],
    howToUse: (n) => [
      `Open ${n} and type your question.`,
      "Read the summarised answer and its sources.",
      "Click through citations to verify key points.",
      "Ask follow-up questions to go deeper.",
      "Save or export your findings.",
    ],
  },
  "3d-modeling": {
    howItWorks: (n) =>
      `${n} uses generative 3D models (and sometimes photogrammetry) to create meshes, textures or scenes. From text, an image, or photos it predicts 3D geometry and surfaces you can export into game engines or 3D software.`,
    promptStyle: (n) =>
      `In ${n} you describe the object or scene, or upload reference images. Mention the form, style and intended use (game-ready, printable, stylised vs realistic) to steer the geometry and detail.`,
    promptTips: [
      "Describe the object clearly: 'a low-poly wooden treasure chest'.",
      "Say the intended use: 'game-ready', '3D printable', 'realistic'.",
      "Upload reference images when you can for accuracy.",
      "Keep single objects separate from full scenes.",
      "Plan to clean up topology in a 3D tool afterwards.",
    ],
    howToUse: (n) => [
      `Open ${n} and start a new 3D generation.`,
      "Enter a prompt or upload reference image(s).",
      "Choose style, detail and output format (e.g. GLB, OBJ).",
      "Generate and preview the 3D model.",
      "Export it into your engine or 3D software to refine.",
    ],
  },
};

/* A safe fallback so an unknown category still produces a useful page. */
const fallbackGuidance: CategoryGuidance = {
  howItWorks: (n) =>
    `${n} is an AI-powered tool that uses machine-learning models to turn your input into a useful result automatically.`,
  promptStyle: (n) =>
    `In ${n}, give clear, specific instructions describing exactly what you want. The more context and detail you provide, the better the result.`,
  promptTips: [
    "Be specific about the result you want.",
    "Give context and any constraints up front.",
    "Start simple, then refine with follow-ups.",
    "Provide examples where you can.",
    "Always review the output before using it.",
  ],
  howToUse: (n) => [
    `Open ${n} and create a new project.`,
    "Provide your input or instruction.",
    "Generate the result.",
    "Refine your input and try again.",
    "Export or save what you make.",
  ],
};

/* ------------------------------------------------------------------ *
 * Per-tool overrides for well-known flagship tools.
 * Anything not listed here still gets a complete, category-aware page.
 * ------------------------------------------------------------------ */

const toolOverrides: Record<string, Partial<ResolvedToolDetail>> = {
  Midjourney: {
    maker: "Midjourney, Inc. (founded by David Holz)",
    founded: "2022",
    promptStyle:
      "Midjourney prompts read like a comma-separated description plus optional parameters. You can add flags such as --ar 16:9 for aspect ratio, --v for the model version, and --stylize to control how artistic it gets.",
  },
  "DALL·E 3": {
    maker: "OpenAI",
    founded: "2023",
    promptStyle:
      "DALL·E 3 is built into ChatGPT, so you describe images in plain conversation. It rewrites your request into a richer prompt automatically, and you can simply ask for changes in follow-up messages.",
  },
  "Stable Diffusion": {
    maker: "Stability AI (and the open-source community)",
    founded: "2022",
  },
  "GitHub Copilot": {
    maker: "GitHub & OpenAI (Microsoft)",
    founded: "2021",
    promptStyle:
      "Copilot reads your open files and comments to suggest code as you type. Write a clear comment describing what you want, start typing a function signature, or use Copilot Chat to ask in natural language.",
  },
  Cursor: {
    maker: "Anysphere",
    founded: "2023",
  },
  Kiro: {
    maker: "AWS",
    founded: "2025",
    promptStyle:
      "Kiro works through chat and spec-driven development. Describe the feature you want and it can turn it into requirements, a design and tasks, then write the code for you.",
  },
  ChatGPT: {
    maker: "OpenAI",
    founded: "2022",
  },
  Claude: {
    maker: "Anthropic",
    founded: "2023",
  },
  Gemini: {
    maker: "Google DeepMind",
    founded: "2023",
  },
  Sora: {
    maker: "OpenAI",
    founded: "2024",
  },
  Runway: {
    maker: "Runway AI, Inc.",
    founded: "2018",
  },
  Suno: {
    maker: "Suno, Inc.",
    founded: "2023",
  },
  ElevenLabs: {
    maker: "ElevenLabs",
    founded: "2022",
  },
  Perplexity: {
    maker: "Perplexity AI",
    founded: "2022",
  },
  "Adobe Firefly": {
    maker: "Adobe",
    founded: "2023",
  },
  "Microsoft Copilot": {
    maker: "Microsoft",
    founded: "2023",
  },
  Grok: {
    maker: "xAI",
    founded: "2023",
  },
  Whisper: {
    maker: "OpenAI",
    founded: "2022",
  },
  "Luma AI": {
    maker: "Luma Labs",
    founded: "2021",
  },
};

/**
 * Derive a readable company name from a tool's domain as a last-resort
 * "maker" when we don't have explicit data, e.g. https://leonardo.ai -> "Leonardo".
 */
function makerFromUrl(url: string, name: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    const core = host.split(".")[0];
    const pretty = core.charAt(0).toUpperCase() + core.slice(1);
    return `the team behind ${name} (${pretty})`;
  } catch {
    return `the team behind ${name}`;
  }
}

/**
 * Build a complete, page-ready detail object for a tool by merging:
 *   tool.detail  >  per-tool overrides  >  category defaults.
 */
export function resolveToolDetail(
  tool: Tool,
  categoryId: string
): ResolvedToolDetail {
  const guide = categoryGuidance[categoryId] ?? fallbackGuidance;
  const override = toolOverrides[tool.name] ?? {};
  const inline = tool.detail ?? {};

  const pick = <K extends keyof ResolvedToolDetail>(
    key: K,
    fallback: ResolvedToolDetail[K]
  ): ResolvedToolDetail[K] =>
    (inline[key] as ResolvedToolDetail[K]) ??
    (override[key] as ResolvedToolDetail[K]) ??
    fallback;

  return {
    maker: pick("maker", makerFromUrl(tool.url, tool.name)),
    founded: pick("founded", "Recent years"),
    howItWorks: pick("howItWorks", guide.howItWorks(tool.name)),
    promptStyle: pick("promptStyle", guide.promptStyle(tool.name)),
    promptTips: pick("promptTips", guide.promptTips),
    howToUse: pick("howToUse", guide.howToUse(tool.name)),
    loginSteps: pick("loginSteps", genericLogin(tool.name)),
  };
}
