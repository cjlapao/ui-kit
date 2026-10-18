// ui-kit-i18n CLI (spec §10) — zero-dependency arg parsing + dispatch.
// Usage errors → exit 2; check errors → exit 1; success → exit 0.
import { scaffoldCommand } from "./scaffold";
import { checkCommand } from "./check";
import { localesCommand } from "./locales";

const USAGE = `ui-kit-i18n — author and check ui-kit i18n locale files

Usage:
  ui-kit-i18n scaffold [--locale <tag>] [--all] [--out <dir>] [--force]
      Write <dir>/<tag>.json with the kit.* keys (translated for the five
      curated locales, English otherwise) plus <dir>/<tag>.example.json
      with a few example user keys. Refuses to overwrite without --force.

  ui-kit-i18n check [dir] [--json]
      Check locale files in <dir> (default ./locales): key parity across
      locales, ICU parse errors, plural messages without an "other"
      category, BCP-47 file names, unknown kit.* override targets.
      *.example.json files are ignored. Exits 1 on any error.

  ui-kit-i18n locales
      Table of the locales the kit ships curated strings for.

  ui-kit-i18n help
`;

function usage(error?: string): never {
  if (error) {
    process.stderr.write(`ui-kit-i18n: ${error}\n\n`);
    process.stderr.write(USAGE);
  } else {
    process.stdout.write(USAGE);
  }
  process.exit(error ? 2 : 0);
}

/** Parse `--flag value` / `--flag=value` / boolean flags. */
export function parseArgs(
  argv: string[],
  spec: { flags: Record<string, "value" | "bool"> },
): { values: Map<string, string>; bools: Set<string>; positionals: string[] } {
  const values = new Map<string, string>();
  const bools = new Set<string>();
  const positionals: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      const name = eq === -1 ? arg.slice(2) : arg.slice(2, eq);
      const want = spec.flags[name];
      if (want === undefined) {
        usage(`unknown option "--${name}"`);
      }
      if (eq !== -1) {
        if (want !== "value") usage(`"--${name}" takes no value`);
        values.set(name, arg.slice(eq + 1));
      } else if (want === "bool") {
        bools.add(name);
      } else {
        const next = argv[++i];
        if (next === undefined) usage(`"--${name}" needs a value`);
        values.set(name, next);
      }
    } else if (arg.startsWith("-") && arg.length > 1) {
      usage(`unknown option "${arg}"`);
    } else {
      positionals.push(arg);
    }
  }
  return { values, bools, positionals };
}

const argv = process.argv.slice(2);
const command = argv[0];

switch (command) {
  case "scaffold":
    scaffoldCommand(argv.slice(1));
    break;
  case "check":
    checkCommand(argv.slice(1));
    break;
  case "locales":
    localesCommand();
    break;
  case "help":
  case "--help":
  case "-h":
  case undefined:
    usage();
    break;
  default:
    usage(`unknown command "${command}"`);
}
