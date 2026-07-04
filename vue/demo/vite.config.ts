// @ts-check
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demoRoot = __dirname;

export default defineConfig({
  root: demoRoot,
  plugins: [vue()],
  resolve: {
    dedupe: ["vue"],
    alias: {
      // Consume the Vue kit source directly, mirroring the React demo.
      "@cjlapao/ui-kit-vue": path.resolve(demoRoot, "../src/index.ts"),
      // Share images from the React kit's assets, mirroring the React demo.
      "@assets": path.resolve(demoRoot, "../../react/src/assets"),
    },
  },
  build: {
    outDir: "build",
  },
  server: {
    port: 5175,
    host: "0.0.0.0",
  },
});
