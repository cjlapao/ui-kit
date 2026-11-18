#!/usr/bin/env node
/**
 * Build guard for the class-name contract between the built JS and the
 * published stylesheet (dist/index.css, exported as ./styles.css).
 *
 * Every custom contract class the built JS emits must resolve to at least one
 * rule in the published stylesheet. Tailwind utilities are deliberately not
 * checked — the same build generates them from the sources via @source. Only
 * the CONTRACT_PREFIXES below are checked: raw CSS hooks that Tailwind can
 * never generate, because their rules are hand-written per component.
 *
 * Why this exists: dist/index.css is generated solely from src/styles.css by
 * the Tailwind CLI step in tsup.config.ts, which overwrites the CSS tsup
 * emits from `import "./X.css"` in components. A component stylesheet that
 * is only imported from TSX therefore never ships, silently — FilterBar's
 * expandable search rendered permanently expanded for every consumer exactly
 * this way (0.2.36–0.2.39). Add a prefix here whenever a component starts
 * shipping its own raw stylesheet.
 *
 * Wired as react/package.json "postbuild", so `npm run build` fails closed.
 * Reproduce manually with:
 *   grep -o '"fb-[a-z-]*"' dist/index.js | sort -u
 *   grep -o '\.fb-[a-z-]*' dist/index.css | sort -u
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const CONTRACT_PREFIXES = ["fb-", "startup-stage-", "pill-"];
const JS_FILES = ["index.js", "index.cjs", "markdown.js", "markdown.cjs"];

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const read = name => readFile(path.join(dist, name), "utf8").catch(() => "");

const css = await read("index.css");
if (!css) {
  console.error("check-css-contract: dist/index.css not found — run the build first.");
  process.exit(1);
}

// Contract tokens emitted as (space-separated) class strings in the built JS.
// A token is `<prefix>` + at least one more class character, anchored so
// fragments like "fb-" (template-literal heads) don't count.
const escapeRx = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const tokenPatterns = CONTRACT_PREFIXES.map(
  prefix => new RegExp(`^${escapeRx(prefix)}[0-9A-Za-z_][0-9A-Za-z_-]*$`),
);

const emitted = new Map(); // token -> js file that emitted it
for (const name of JS_FILES) {
  const js = await read(name);
  for (const match of js.matchAll(/["'`]([^"'`\n]*)["'`]/g)) {
    for (const token of match[1].split(/\s+/)) {
      if (tokenPatterns.some(rx => rx.test(token))) {
        if (!emitted.has(token)) emitted.set(token, name);
      }
    }
  }
}

// Resolve each token against real selector positions in the stylesheet:
// `.token` not preceded by identifier characters and not followed by a
// class-character continuation (so `.fb-search` does not match inside
// `.fb-search-input`).
const missing = [];
for (const token of emitted.keys()) {
  const selector = new RegExp(`(^|[^\w.\\-])\\.${token.replace(/[-]/g, "\\-")}(?![\w-])`);
  if (!selector.test(css)) missing.push(token);
}

if (missing.length) {
  console.error(
    `check-css-contract: ${missing.length} contract class(es) emitted by the built ` +
      `JS have no rule in dist/index.css (published as "./styles.css"):`,
  );
  for (const token of missing.sort()) {
    console.error(`  - .${token}  (emitted by dist/${emitted.get(token)})`);
  }
  console.error(
    "\nA component stylesheet is probably missing from the src/styles.css @import " +
      "list: the Tailwind CLI step in tsup.config.ts regenerates dist/index.css " +
      "from that entry alone, so raw component CSS only ships if imported there.",
  );
  process.exit(1);
}

console.log(
  `check-css-contract: ${emitted.size} contract class(es) (${CONTRACT_PREFIXES.join(", ")}) ` +
    "all resolve against dist/index.css.",
);
