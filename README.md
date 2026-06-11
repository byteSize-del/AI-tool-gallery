# 🎨 AI Tools Sketchbook (AI Gallery)

A hand-drawn, sketchbook-style directory of the best AI tools, built as a teaching companion for a seminar on AI, generative AI, and prompting. Browse 250+ tools across 12 categories, learn how prompting works through an interactive playground, and compare tools side-by-side to understand which one fits a job.

Built with React + TypeScript + Vite, deployed on Vercel.

---

## ✨ Features

- **12 categories, 250+ AI tools** — image generation, coding, writing, video, audio/music, chatbots, productivity, design, data, voice, research, and 3D.
- **Per-tool detail pages** — who made it, how it works, how prompting works for that tool, how to prompt it well, how to use it, and how to sign up.
- **Quality tiers** — every tool is ranked (🔥 Top Pick / ⭐ Strong / • Solid) from 2026 popularity and output-quality trends, with the ranking methodology and review date shown in the UI.
- **Learn section** — short guides on _what AI tools are_ and _what prompting is_, including a colour-coded worked example.
- **Interactive prompt playground** — toggle the pieces of a prompt (Role, Context, Format, Tone) and watch the assembled prompt, a quality meter, and the answer improve in real time. Runs fully offline.
- **Live model playground** — chat with real models served through your configured providers (Groq, NVIDIA, Google Gemini, OpenRouter, Mistral). Models are auto-detected and grouped by use case (chat / code / reasoning / image). Keys stay server-side via Vercel serverless functions.
- **Compare view** — pin up to three tools head-to-head across maker, pricing, tier, and prompting style.
- **Live search & filters** — search categories/tools, and filter by Top picks, Strong, Free, or Open Source.
- **Sketchbook UI** — hand-drawn fonts, wobbly borders, floating doodles, staggered animations, loading screens, and skeleton placeholders (with `prefers-reduced-motion` support).
- **PWA** — installable and works offline, handy when conference wifi misbehaves.

---

## 🛠️ Tech Stack

| Concern        | Choice                                  |
| -------------- | --------------------------------------- |
| Framework      | [React 18](https://react.dev)           |
| Language       | [TypeScript](https://www.typescriptlang.org) |
| Build tool     | [Vite 5](https://vitejs.dev)            |
| Routing        | [React Router 6](https://reactrouter.com) |
| Data validation| [Zod](https://zod.dev)                  |
| Tests          | [Vitest](https://vitest.dev)            |
| Offline / PWA  | [vite-plugin-pwa](https://vite-pwa-org.netlify.app) |
| Hosting        | [Vercel](https://vercel.com)            |

---

## 🚀 Getting Started

Requires [Node.js](https://nodejs.org) 18+ and npm.

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev

# type-check + production build
npm run build

# preview the production build locally
npm run preview

# run the data-integrity tests
npm test          # watch mode
npm run test:run  # single run
```

---

## 📁 Project Structure

```
src/
├── components/      # reusable UI (cards, badges, loaders, playground…)
├── pages/           # routed pages (Welcome, Home, Category, Tool, Learn, Compare, About)
├── data/
│   ├── categories.ts    # the tool catalogue (source of truth)
│   ├── tiers.ts         # tier rankings + sorting helpers
│   ├── schema.ts        # zod schemas validating the catalogue
│   └── categories.test.ts
├── hooks/           # usePageReady, useCountUp
├── utils/           # slugify, tool-detail resolver
├── styles/          # the sketchbook CSS theme
├── config.ts        # DEMO_MODE flag, loading delays, review date
├── App.tsx          # lazy-loaded routes + loading screens
└── main.tsx         # entry point + dev-time data validation
```

---

## 🗂️ Content & Data Model

All tools live in `src/data/categories.ts`. Each tool is:

```ts
{
  name: "Midjourney",
  description: "High-quality artistic image generation.",
  url: "https://www.midjourney.com",
  pricing: "Paid",            // Free | Freemium | Paid | Open Source
  tier: "top",                // optional; resolved from trend data otherwise
  detail: { /* optional rich page content */ }
}
```

The catalogue is validated by Zod schemas (`src/data/schema.ts`) and guarded by tests (`src/data/categories.test.ts`) that enforce things like: ≥10 categories, ≥20 tools each, unique slugs, valid https URLs, and at least one top pick per category. In development, malformed data is logged loudly at startup.

### Updating rankings

Tiers are simple name lists in `src/data/tiers.ts` (anything unlisted defaults to `average`). Update the lists and bump `TIERS_LAST_REVIEWED` in `src/config.ts`. AI moves fast, so the UI deliberately shows when the rankings were last reviewed.

### Demo mode

The loading screens and skeleton placeholders are intentional teaching devices. They're driven by a single `DEMO_MODE` flag in `src/config.ts` — set it to `false` and every artificial delay collapses to 0ms.

---

## 🎮 Live Model Playground

The Playground (`/playground`) lets visitors chat with real models. It's powered by Vercel serverless (Edge) functions in `api/` that proxy requests to providers, so **API keys never reach the browser**.

### Setup

Add any of these in **Vercel → Project → Settings → Environment Variables** (you only need one to start). The Playground shows only the providers that have a key:

| Variable             | Provider       |
| -------------------- | -------------- |
| `GROQ_API_KEY`       | Groq           |
| `NVIDIA_API_KEY`     | NVIDIA NIM     |
| `GOOGLE_API_KEY`     | Google Gemini  |
| `OPENROUTER_API_KEY` | OpenRouter     |
| `MISTRAL_API_KEY`    | Mistral        |
| `PLAYGROUND_ACCESS_CODE` | _(optional)_ require a code before chatting |

Redeploy after adding keys. `/api/models` then auto-detects available models and categorises them into **chat / code / reasoning / image**. See `.env.example`.

> ⚠️ **Cost & abuse warning.** These keys are shared by everyone who visits the deployed site, and there is no per-user authentication. A public Playground can run up real costs. Before sharing the URL widely you should:
> - set **spend limits / budget alerts** on each provider dashboard,
> - set `PLAYGROUND_ACCESS_CODE` to gate access (e.g. share the code only with your seminar audience),
> - consider removing the keys after the event.

> 🧪 **Local development.** Plain `npm run dev` serves the static app but not the `/api` functions. Use `vercel dev` to run the serverless functions locally.

### Image models

Image-capable models are detected and listed under the Image tab, but live image generation uses a different endpoint per provider and isn't wired into the chat demo yet. Chat, code, and reasoning models are fully live.

---

## ☁️ Deployment (Vercel)

This repo is configured for Vercel.

This repo is configured for Vercel. On import, settings are auto-detected:

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`

`vercel.json` adds an SPA rewrite so deep links (e.g. `/compare`, `/category/coding`) resolve correctly on direct load or refresh, plus cache headers for hashed assets and the service worker. Every push to `main` triggers a production deploy; pull requests get preview URLs.

---

## 📝 License

See [LICENSE](./LICENSE).

---

Made with ♥ by **Hypercode**.
