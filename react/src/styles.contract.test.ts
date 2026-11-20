import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Source-level guard for the class-name contract between the components and
 * the published stylesheet. The dist-level twin (scripts/check-css-contract.mjs,
 * run as `postbuild`) verifies the built artifacts; this test fails earlier
 * and without a build, by checking the sources:
 *
 *   1. Every component stylesheet imported by a .ts/.tsx under src/ must be
 *      inside src/styles.css's @import closure. dist/index.css (exported as
 *      ./styles.css) is generated from that entry alone — the Tailwind CLI
 *      step in tsup.config.ts overwrites the CSS tsup emits from the .tsx
 *      imports — so an orphan import silently never ships. FilterBar's
 *      collapsed-search CSS leaked exactly this way in 0.2.36–0.2.39.
 *   2. Every contract-prefixed class a component emits must have a rule in
 *      that closure, so the built JS and the published CSS cannot drift.
 *
 * Add a prefix to CONTRACT_PREFIXES when a component ships raw CSS hooks
 * Tailwind can never generate from scanning.
 */

const CONTRACT_PREFIXES = ["fb-", "startup-stage-", "pill-", "panel-"];
const SRC = path.dirname(fileURLToPath(import.meta.url));
const ENTRY = path.join(SRC, "styles.css");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(entry => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(ts|tsx)$/.test(entry) && !/\.(test\.ts|test\.tsx|d\.ts)$/.test(entry) ? [full] : [];
  });
}

/** Transitive closure of relative @imports starting at `file`. */
function cssClosure(file: string, seen = new Set<string>()): Set<string> {
  if (seen.has(file)) return seen;
  seen.add(file);
  for (const match of readFileSync(file, "utf8").matchAll(/@import\s+["'](\.[^"']+)["']/g)) {
    cssClosure(path.resolve(path.dirname(file), match[1]), seen);
  }
  return seen;
}

/** Contract-prefixed class tokens appearing in `text` (bounded both ways). */
function contractTokens(text: string): string[] {
  const pattern = new RegExp(
    `(^|[^0-9A-Za-z_-])((?:${CONTRACT_PREFIXES.map(p => p.slice(0, -1)).join("|")})-[0-9A-Za-z-]+[0-9A-Za-z])(?![0-9A-Za-z_-])`,
    "gm",
  );
  return [...text.matchAll(pattern)].map(match => match[2]);
}

describe("styles.css contract", () => {
  const closure = cssClosure(ENTRY);
  const sources = walk(SRC);

  it("imports every component stylesheet that a .ts/.tsx imports", () => {
    const orphans: string[] = [];
    for (const file of sources) {
      for (const match of readFileSync(file, "utf8").matchAll(/import\s+["'](\.[^"']+\.css)["']/g)) {
        const target = path.resolve(path.dirname(file), match[1]);
        if (!closure.has(target)) {
          orphans.push(`${path.relative(SRC, file)} → ${path.relative(SRC, target)}`);
        }
      }
    }
    expect(orphans, "orphaned component CSS — add it to the @import list in src/styles.css").toEqual([]);
  });

  it("ships a rule for every contract class the components emit", () => {
    const stylesheet = [...closure].map(file => readFileSync(file, "utf8")).join("\n");
    const missing: string[] = [];
    for (const file of sources) {
      for (const token of new Set(contractTokens(readFileSync(file, "utf8")))) {
        // `.token` at a selector position: not swallowed by a longer class name.
        if (!new RegExp(`(^|[^\\w.\\-])\\.${token.replace(/-/g, "\\-")}(?![\\w-])`).test(stylesheet)) {
          missing.push(`${token} (${path.relative(SRC, file)})`);
        }
      }
    }
    expect(missing, "contract classes with no rule in the styles.css closure").toEqual([]);
  });
});
