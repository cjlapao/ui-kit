import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // Same reason as the tsconfig `paths` entry: imports inside ../common
    // resolve bare specifiers from the importing file's directory, which on
    // CI (only vue/ is installed) has no node_modules above it. Alias
    // date-fns to this package's install so vue-tsc and the lib build
    // resolve the same copy.
    alias: [
      {
        find: /^date-fns$/,
        replacement: path.resolve(__dirname, "node_modules/date-fns/index.js"),
      },
      {
        find: /^date-fns\/(.+)$/,
        replacement: path.resolve(__dirname, "node_modules/date-fns") + "/$1",
      },
    ],
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "UiKitVue",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      external: ["vue", "vue-router"],
    },
  },
});
