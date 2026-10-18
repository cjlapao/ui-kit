// ui-kit-i18n scaffold (spec §10).
//
// Writes <out>/<tag>.json containing exactly the kit.* keys (the built-in
// catalog, nested) plus a sibling <out>/<tag>.example.json with a few
// example user keys. Curated locales get their authored translations; any
// other tag scaffolds the English catalog.
import * as fs from "node:fs";
import * as path from "node:path";
import {
  BUILT_IN_CATALOGS,
  CURATED_LOCALES,
  EN_KIT_CATALOG,
} from "../../../common/i18n/builtIn";
import type { MessageCatalog } from "../../../common/i18n/types";
import { parseArgs } from "./cli";

const EXAMPLE_USER_KEYS = {
  "app.title": "My app",
  greeting: "Hello, {name}!",
  itemsLeft: "{count, plural, one {# item left} other {# items left}}",
};

export function scaffoldCommand(argv: string[]): void {
  const { values, bools, positionals } = parseArgs(argv, {
    flags: { locale: "value", out: "value", all: "bool", force: "bool" },
  });
  if (positionals.length > 0) {
    process.stderr.write(`ui-kit-i18n: unexpected argument "${positionals[0]}"\n`);
    process.exit(2);
  }
  const outDir = values.get("out") ?? "./locales";
  const force = bools.has("force");
  const tags: string[] = [];
  if (bools.has("all")) tags.push(...CURATED_LOCALES);
  const single = values.get("locale");
  if (single) tags.push(single);
  if (tags.length === 0) {
    process.stderr.write("ui-kit-i18n: scaffold needs --locale <tag> or --all\n");
    process.exit(2);
  }

  let failed = false;
  for (const tag of tags) {
    if (!scaffoldOne(tag, outDir, force)) failed = true;
  }
  process.exit(failed ? 1 : 0);
}

function scaffoldOne(tag: string, outDir: string, force: boolean): boolean {
  const curated = CURATED_LOCALES.includes(tag as (typeof CURATED_LOCALES)[number]);
  const catalog: MessageCatalog = BUILT_IN_CATALOGS[tag as keyof typeof BUILT_IN_CATALOGS] ?? EN_KIT_CATALOG;

  fs.mkdirSync(outDir, { recursive: true });
  const target = path.join(outDir, `${tag}.json`);
  const example = path.join(outDir, `${tag}.example.json`);
  if (!force && (fs.existsSync(target) || fs.existsSync(example))) {
    process.stderr.write(
      `ui-kit-i18n: refusing to overwrite ${target} — pass --force to replace\n`,
    );
    return false;
  }
  const source = curated ? "authored translations" : "English (untranslated)";
  // The catalog root already carries the `kit` group (kit.* keys) — write
  // it as-is, do not wrap.
  fs.writeFileSync(target, JSON.stringify(catalog, null, 2) + "\n");
  fs.writeFileSync(example, JSON.stringify(EXAMPLE_USER_KEYS, null, 2) + "\n");
  process.stdout.write(`scaffolded ${target} (${source}) + ${example}\n`);
  return true;
}
