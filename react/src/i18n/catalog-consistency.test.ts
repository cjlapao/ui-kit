// Catalog consistency (plan task 3.4) — source-scan guards:
//
// (a) Every `kit.*` key in the en built-in catalog must be referenced by a
//     literal `"kit.…"` string in react/src or vue/src. Catches dead keys
//     (typo'd key names silently degrade to the key string).
// (b) Every original hardcoded literal (spec §14 inventory) must still exist
//     as an en catalog value. Catches a refactor that dropped a literal from
//     the catalog while leaving the component wired to a key.
//
// Deliberate-failure verification (plan): revert one component literal,
// expect (b) or (a) to fail, restore.
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { flattenCatalog } from "../../../common/i18n/catalog";
import { EN_KIT_CATALOG } from "../../../common/i18n/builtIn";

const HERE = path.dirname(fileURLToPath(new URL(import.meta.url))); // react/src/i18n
const REACT_SRC = path.resolve(HERE, ".."); // react/src
const VUE_SRC = path.resolve(HERE, "..", "..", "..", "vue", "src"); // <repo>/vue/src

// The walk below silently skips a missing dir — fail loudly if the vue kit
// tree is where we expect it, so the cross-kit scan can't degrade silently.
if (!fs.existsSync(VUE_SRC)) {
  throw new Error(`catalog-consistency: vue/src not found at ${VUE_SRC}`);
}

function* walk(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(ts|tsx|vue)$/.test(entry.name)) yield full;
  }
}

let cache: string | null = null;
function sourceBlob(): string {
  if (cache) return cache;
  const parts: string[] = [];
  for (const dir of [REACT_SRC, VUE_SRC]) {
    if (!fs.existsSync(dir)) continue;
    for (const file of walk(dir)) parts.push(fs.readFileSync(file, "utf8"));
  }
  return (cache = parts.join("\n"));
}

const enFlat = flattenCatalog(EN_KIT_CATALOG);

describe("catalog consistency (a) — no dead keys", () => {
  it("every en kit key is referenced in react/src or vue/src", () => {
    const blob = sourceBlob();
    // React uses double quotes, Vue SFCs single — accept both.
    const referenced = (key: string) =>
      blob.includes(`"${key}"`) || blob.includes(`'${key}'`);
    const dead = Object.keys(enFlat).filter((key) => !referenced(key));
    expect(dead).toEqual([]);
  });
});

describe("catalog consistency (b) — literals preserved in en values", () => {
  // The pre-i18n hardcoded strings (spec §14). Each must appear verbatim as
  // an en catalog value — this is the byte-identical no-provider net.
  const TARGETS: string[] = [
    "Remove",
    "Loading",
    "Search...",
    "Clear",
    "Insert variable",
    "No variables available.",
    "No items",
    "Loading…",
    "No matching options. Keep typing to use what you entered.",
    "Cancel",
    "Confirm",
    "Delete",
    "Apply",
    "name",
    "Type the",
    "to confirm:",
    "Close",
    "Close dialog",
    "Close panel",
    "Resize panel",
    "Close help",
    "Show help",
    "Help",
    "Today",
    "Choose month",
    "Choose year",
    "Choose a date",
    "Choose a date range",
    "Date",
    "Open sidebar",
    "Search menu",
    "Search menu items",
    "Collapse",
    "Expand",
    "Add items",
    "Search items",
    "No data to display",
    "Close the item palette",
  ];

  const values = new Set<string>(Object.values(enFlat));

  it("every original literal is an en catalog value", () => {
    const missing = TARGETS.filter((literal) => !values.has(literal));
    expect(missing).toEqual([]);
  });
});
