/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["sketch.svg"],
      manifest: {
        name: "AI Tools Sketchbook",
        short_name: "AI Sketchbook",
        description:
          "A hand-drawn sketchbook directory of the best AI tools, with guides on prompting and generative AI.",
        theme_color: "#fdf6e3",
        background_color: "#fdf6e3",
        display: "standalone",
        icons: [
          {
            src: "sketch.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
      },
    }),
  ],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
