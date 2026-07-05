import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/components/Button.vue", "src/components/IconButton.vue", "src/components/Toggle.vue"],
      exclude: [
        "src/components/Button.test.ts",
        "src/components/IconButton.test.ts",
        "**/node_modules/**",
      ],
    },
  },
});