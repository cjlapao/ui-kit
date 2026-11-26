#!/usr/bin/env node
/**
 * Assemble the GitHub Pages artifact from the two built demos.
 *
 * Reads:
 *   react/demo/build/  vue/demo/build/  site-landing/index.html  VERSION
 * Writes (freshly recreated):
 *   site/index.html  site/react/**  site/vue/**
 *
 * Each demo's index.html is copied to 404.html so Pages serves it for
 * unknown paths — the SPA fallback that lets BrowserRouter deep links
 * survive a refresh (asset URLs are absolute under /ui-kit/<demo>/, so
 * they resolve from any 404'd path).
 *
 * Usage: node scripts/assemble-pages-site.mjs   (runnable locally and in CI)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const DEMOS = [
  { name: "react", src: path.join(root, "react/demo/build") },
  { name: "vue", src: path.join(root, "vue/demo/build") },
];
const LANDING = path.join(root, "site-landing/index.html");
const VERSION_FILE = path.join(root, "VERSION");
const OUT = path.join(root, "site");

function fail(message) {
  console.error(`[assemble-pages-site] ${message}`);
  process.exit(1);
}

for (const demo of DEMOS) {
  const indexHtml = path.join(demo.src, "index.html");
  if (!fs.existsSync(indexHtml)) {
    fail(
      `${path.relative(root, indexHtml)} is missing — build ${demo.name} first ` +
        `(npm --prefix ${demo.name}/demo run build -- --base=/ui-kit/${demo.name}/)`,
    );
  }
  // Catch a silently broken build: an index.html that references no assets.
  const html = fs.readFileSync(indexHtml, "utf-8");
  if (!/<script[^>]+src=/.test(html)) {
    fail(`${path.relative(root, indexHtml)} references no script — suspicious build output`);
  }
}
if (!fs.existsSync(LANDING)) fail("site-landing/index.html is missing");

const version = fs.existsSync(VERSION_FILE)
  ? fs.readFileSync(VERSION_FILE, "utf-8").trim()
  : "dev";

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const demo of DEMOS) {
  const dest = path.join(OUT, demo.name);
  fs.cpSync(demo.src, dest, { recursive: true });
  fs.copyFileSync(path.join(dest, "index.html"), path.join(dest, "404.html"));
  console.log(`[assemble-pages-site] ${demo.name}/ ← ${path.relative(root, demo.src)} (+ 404.html)`);
}

const landing = fs.readFileSync(LANDING, "utf-8").replaceAll("{{VERSION}}", version);
fs.writeFileSync(path.join(OUT, "index.html"), landing);
console.log(`[assemble-pages-site] index.html ← site-landing/ (version ${version})`);

const count = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).reduce(
    (n, e) => n + (e.isDirectory() ? count(path.join(dir, e.name)) : 1),
    0,
  );
console.log(`[assemble-pages-site] done: ${count(OUT)} files in ${path.relative(root, OUT)}/`);
