// tsup.config.ts
import { defineConfig } from "tsup";

const isWatch = process.argv.includes("--watch");

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false, // keep class strings readable; harmless here since CSS is separate
  loader: {
    ".svg": "dataurl",
  },
  external: ["react", "react-dom", "react-router-dom"],
  onSuccess: isWatch
    ? "npx @tailwindcss/cli -i ./src/styles.css -o ./dist/index.css && yalc push"
    : "npx @tailwindcss/cli -i ./src/styles.css -o ./dist/index.css"
});