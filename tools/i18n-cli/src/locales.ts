// ui-kit-i18n locales (spec §10): which locales ship curated kit strings,
// and where their date names come from (catalog override or Intl/CLDR).
import {
  BUILT_IN_CATALOGS,
  CURATED_LOCALES,
} from "../../../common/i18n/builtIn";
import { flattenCatalog } from "../../../common/i18n/catalog";

const DATE_NAME_KEYS = [
  "kit.date.months",
  "kit.date.monthsShort",
  "kit.date.weekdays",
  "kit.date.weekdaysShort",
];

function dateNameSource(tag: string): string {
  const flat = flattenCatalog(
    BUILT_IN_CATALOGS[tag as keyof typeof BUILT_IN_CATALOGS] ?? {},
  );
  return DATE_NAME_KEYS.some((key) => key in flat) ? "catalog" : "Intl";
}

export function localesCommand(): void {
  const header = `${"locale".padEnd(10)}${"curated".padEnd(10)}date names`;
  const rows = Object.keys(BUILT_IN_CATALOGS)
    .sort()
    .map((tag) => {
      const curated = CURATED_LOCALES.includes(tag as (typeof CURATED_LOCALES)[number]);
      return `${tag.padEnd(10)}${(curated ? "yes" : "no").padEnd(10)}${dateNameSource(tag)}`;
    });
  process.stdout.write([header, ...rows].join("\n") + "\n");
}
