import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
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