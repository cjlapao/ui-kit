// ui-kit-i18n check (spec §10).
//
// Rules (per locale file in <dir>, default ./locales):
//   ERROR  key present in one locale file but missing from another
//          (user keys only — kit.* resolves via the built-in catalog)
//   ERROR  ICU parse error (shared engine parser; key + message)
//   ERROR  plural message without an `other` category
//   ERROR  file name is not a valid BCP-47 tag
//   WARN   `kit.*` key that is not a known kit key (typo'd override target)
// `*.example.json` files are ignored. Exit 1 on any ERROR, else 0.
import * as fs from "node:fs";
import * as path from "node:path";
import { flattenCatalog } from "../../../common/i18n/catalog";
import { parseMessage, IcuParseError, type IcuNode } from "../../../common/i18n/icu";
import { EN_KIT_CATALOG } from "../../../common/i18n/builtIn";
import type { MessageCatalog } from "../../../common/i18n/types";
import { parseArgs } from "./cli";

interface Diagnostic {
  severity: "error" | "warn";
  file: string;
  key?: string;
  message: string;
}

const KNOWN_KIT_KEYS = new Set(Object.keys(flattenCatalog(EN_KIT_CATALOG)));

// The engine also reads CLDR date names from flat catalog keys
// (kit.date.months.0 … .11, kit.date.weekdays.0 … .6) — common/i18n/dates.ts
// catalogNames(). These are data, not messages: no ICU parse, always known.
const DATE_NAME_RE = /^kit\.date\.(months|monthsShort|weekdays|weekdaysShort)\.(\d+)$/;
function isDateNameKey(key: string): boolean {
  const match = DATE_NAME_RE.exec(key);
  if (!match) return false;
  const count = match[1].startsWith("weekday") ? 7 : 12;
  return Number(match[2]) < count;
}

const TAG_RE = /^[a-zA-Z]{2,8}(-[a-zA-Z0-9]{1,8})*$/;

function isBcp47Tag(tag: string): boolean {
  if (!TAG_RE.test(tag)) return false;
  try {
    new Intl.Locale(tag);
    return true;
  } catch {
    return false;
  }
}

export function checkCommand(argv: string[]): void {
  const { values, bools, positionals } = parseArgs(argv, {
    flags: { json: "bool" },
  });
  if (values.size > 0) {
    process.stderr.write(
      `ui-kit-i18n: check takes only a directory and --json\n`,
    );
    process.exit(2);
  }
  const dir = positionals[0] ?? "./locales";
  if (positionals.length > 1) {
    process.stderr.write(
      `ui-kit-i18n: check takes at most one directory ("${positionals[1]}")\n`,
    );
    process.exit(2);
  }

  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    failAll(bools.has("json"), [
      { severity: "error", file: dir, message: `directory not found: ${dir}` },
    ]);
  }
  const files = entries
    .filter((name) => name.endsWith(".json") && !name.endsWith(".example.json"))
    .sort();
  if (files.length === 0) {
    failAll(bools.has("json"), [
      {
        severity: "error",
        file: dir,
        message: `no locale files found in ${dir} (*.json, excluding *.example.json)`,
      },
    ]);
  }

  const diagnostics: Diagnostic[] = [];
  const perFile = new Map<string, Record<string, string>>();

  for (const name of files) {
    const tag = name.slice(0, -".json".length);
    const file = path.join(dir, name);
    if (!isBcp47Tag(tag)) {
      diagnostics.push({
        severity: "error",
        file,
        message: `file name is not a valid BCP-47 tag: "${name}"`,
      });
      continue;
    }
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (err) {
      diagnostics.push({
        severity: "error",
        file,
        message: `invalid JSON: ${(err as Error).message}`,
      });
      continue;
    }
    if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
      diagnostics.push({
        severity: "error",
        file,
        message: "locale file must be a JSON object of message catalogs",
      });
      continue;
    }
    const flat = flattenCatalog(raw as MessageCatalog, `check:${name}`);
    perFile.set(file, flat);
    for (const [key, message] of Object.entries(flat)) {
      if (isDateNameKey(key)) continue; // date-name data, not a message
      try {
        const nodes = parseMessage(message, key);
        reportPluralNodes(nodes, file, key, diagnostics);
      } catch (err) {
        if (err instanceof IcuParseError) {
          diagnostics.push({
            severity: "error",
            file,
            key,
            message: `ICU parse error: ${err.message}`,
          });
        } else {
          throw err;
        }
      }
      if (
        key.startsWith("kit.") &&
        !KNOWN_KIT_KEYS.has(key) &&
        !isDateNameKey(key)
      ) {
        diagnostics.push({
          severity: "warn",
          file,
          key,
          message: `unknown kit key "${key}" (not a known kit override target)`,
        });
      }
    }
  }

  // Cross-locale user-key parity (kit.* exempt).
  const userKeysByFile = new Map<string, Set<string>>();
  const allUserKeys = new Set<string>();
  for (const [file, flat] of perFile) {
    const userKeys = new Set(
      Object.keys(flat).filter((key) => !key.startsWith("kit.")),
    );
    userKeysByFile.set(file, userKeys);
    for (const key of userKeys) allUserKeys.add(key);
  }
  for (const key of allUserKeys) {
    for (const [file, keys] of userKeysByFile) {
      if (!keys.has(key)) {
        diagnostics.push({
          severity: "error",
          file,
          key,
          message: `key "${key}" is missing from this locale file (present in another)`,
        });
      }
    }
  }

  diagnostics.sort((a, b) =>
    a.file === b.file
      ? (a.severity === b.severity
          ? (a.key ?? "").localeCompare(b.key ?? "")
          : a.severity === "error" ? -1 : 1)
      : a.file.localeCompare(b.file),
  );

  if (bools.has("json")) {
    process.stdout.write(
      JSON.stringify(
        {
          errors: diagnostics.filter((d) => d.severity === "error"),
          warnings: diagnostics.filter((d) => d.severity === "warn"),
        },
        null,
        2,
      ) + "\n",
    );
  } else {
    for (const d of diagnostics) {
      const where = d.key ? `${d.file} [${d.key}]` : d.file;
      process.stdout.write(`${d.severity === "error" ? "ERROR" : "WARN"} ${where}: ${d.message}\n`);
    }
    if (diagnostics.length === 0) {
      process.stdout.write(`ok: ${files.length} locale file(s), no problems\n`);
    }
  }
  process.exit(diagnostics.some((d) => d.severity === "error") ? 1 : 0);
}

/** Recursively flag plural messages without an `other` branch. */
function reportPluralNodes(
  nodes: IcuNode[],
  file: string,
  key: string,
  diagnostics: Diagnostic[],
): void {
  for (const node of nodes) {
    if (node.type === "plural" || node.type === "select") {
      if (node.type === "plural" && !node.branches.has("other")) {
        diagnostics.push({
          severity: "error",
          file,
          key,
          message: `plural message for "${node.name}" has no "other" category`,
        });
      }
      for (const branch of node.branches.values()) {
        reportPluralNodes(branch, file, key, diagnostics);
      }
    }
  }
}

function failAll(json: boolean, errors: Diagnostic[]): never {
  if (json) {
    process.stdout.write(
      JSON.stringify({ errors, warnings: [] }, null, 2) + "\n",
    );
  } else {
    for (const e of errors) {
      process.stdout.write(`ERROR ${e.file}: ${e.message}\n`);
    }
  }
  process.exit(1);
}
