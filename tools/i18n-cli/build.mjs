// Bundle the CLI into a single dependency-free file (spec §10).
//
// The sources import `common/i18n` directly (../../common/i18n/…) — esbuild
// inlines the engine + catalogs at build time, so the published file has no
// runtime dependency on either kit package.
import { build } from "esbuild";

await build({
  entryPoints: ["src/cli.ts"],
  outfile: "dist/cli.js",
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  banner: { js: "#!/usr/bin/env node" },
  legalComments: "none",
  logLevel: "silent",
});

console.log("built dist/cli.js");
