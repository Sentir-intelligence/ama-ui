import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\/components\/ui\/(.*)$/, replacement: fileURLToPath(new URL("./registry/ama/ui/$1", import.meta.url)) },
      { find: /^@\/components\/brand\/(.*)$/, replacement: fileURLToPath(new URL("./registry/ama/brand/$1", import.meta.url)) },
      { find: /^@\/lib\/(.*)$/, replacement: fileURLToPath(new URL("./registry/ama/lib/$1", import.meta.url)) },
    ],
  },
  test: { environment: "jsdom", globals: true, setupFiles: ["./vitest.setup.ts"] },
});
