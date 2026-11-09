// Live view of the registry source. The @/ aliases are the same ones the tests use (vitest.config.ts),
// so the playground imports registry/ama/* directly and hot-reloads on every edit. Nothing is installed.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const registry = (dir: string) => fileURLToPath(new URL(`../registry/ama/${dir}/$1`, import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^@\/components\/ui\/(.*)$/, replacement: registry("ui") },
      { find: /^@\/components\/brand\/(.*)$/, replacement: registry("brand") },
      { find: /^@\/components\/icons\/(.*)$/, replacement: registry("icons") },
      { find: /^@\/lib\/(.*)$/, replacement: registry("lib") },
    ],
  },
  server: { fs: { allow: [".."] } },
  // One page that bundles every component; the size warning is noise for a local dev tool.
  build: { chunkSizeWarningLimit: 1500 },
});
