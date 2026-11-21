/**
 * Slug derivation shared by every framework port. The default pipeline keeps
 * letters, digits and `_` — whitespace runs become the separator, every other
 * symbol is *ignored* (dropped, never turned into a separator), adjacent
 * separators collapse and the ends are trimmed.
 */
export interface SlugifyOptions {
  /** Character whitespace runs collapse to. @default "_" */
  separator?: string;
  /** Casing applied last, so `preserve` keeps the typed shape. @default "lower" */
  case?: "lower" | "upper" | "preserve";
  /** Extra characters kept alongside letters and digits, e.g. `"-."`. */
  allowed?: string;
  /** Rewrites the raw value before the pipeline runs (custom transliterations…). */
  transform?: (value: string) => string;
}

const DEFAULT_SLUGIFY_SEPARATOR = "_";

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Collapse runs of `separator` into one and trim them from both ends. */
function trimSeparators(text: string, separator: string): string {
  if (!separator) return text;
  const sep = escapeRegExp(separator);
  return text
    .replace(new RegExp(`${sep}+`, "g"), separator)
    .replace(new RegExp(`^${sep}+|${sep}+$`, "g"), "");
}

/**
 * `slugify("Hello, World! Foo_Bar 2024")` → `"hello_world_foo_bar_2024"`.
 *
 * Accented letters fold to their base form (`café` → `cafe`) via NFKD, so the
 * slug stays ASCII-friendly without a dedicated transliteration table.
 */
export function slugify(value: string, options: SlugifyOptions = {}): string {
  const {
    separator = DEFAULT_SLUGIFY_SEPARATOR,
    case: casing = "lower",
    allowed = "",
    transform,
  } = options;

  let text = transform ? transform(value) : value;
  // Decompose accented characters and drop the combining marks, so é survives
  // as e instead of being dropped with the other symbols.
  text = text.normalize("NFKD").replace(/\p{M}+/gu, "");
  // Whitespace becomes separators first…
  text = separator ? text.replace(/\s+/g, separator) : text.replace(/\s+/g, "");
  // …then everything that is not a letter, digit, allowed character or the
  // separator itself is ignored. Symbols never masquerade as separators.
  const drop = new RegExp(
    `[^\\p{L}\\p{N}${escapeRegExp(allowed)}${escapeRegExp(separator)}]+`,
    "gu",
  );
  text = text.replace(drop, "");

  if (casing === "lower") text = text.toLowerCase();
  else if (casing === "upper") text = text.toUpperCase();

  return trimSeparators(text, separator);
}
