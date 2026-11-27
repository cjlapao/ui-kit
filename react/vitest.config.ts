import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const here = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      /*
        The same three aliases the demo app installs (demo/vite.config.ts). A
        docs page test that resolved `@cjlapao/ui-kit` through node_modules would
        be testing `dist/` — the build, not the source it is documenting — and a
        shared panel importing `@assets/...` would not resolve at all.
      */
      "@cjlapao/ui-kit/markdown": here("./src/markdown.ts"),
      "@cjlapao/ui-kit": here("./src/index.ts"),
      "@assets": here("./src/assets"),
    },
    /*
      The demo keeps its own `react` in `demo/node_modules`, and a docs-page
      test imports React-bearing code from both trees. One copy or the second
      one's hooks have no dispatcher: same reason the demo's own config
      dedupes it.
    */
    dedupe: ["react", "react-dom", "react-is"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
    // No `include`: the kit's own tests and the docs pages' tests under
    // `demo/src/**` are both picked up, and `dist`/`node_modules` are excluded
    // by the defaults.
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: [
        "src/components/Button.tsx",
        "src/components/IconButton.tsx",
        "src/components/Toggle.tsx",
      ],
      exclude: [
        "src/components/Button.test.tsx",
        "src/components/IconButton.test.tsx",
        "src/components/Toggle.test.tsx",
        "**/node_modules/**",
      ],
    },
  },
});