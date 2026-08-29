import type { LocaleTag, MessageCatalog } from "../types";
import { DE_KIT_CATALOG } from "./de";
import { EN_KIT_CATALOG } from "./en";
import { ES_KIT_CATALOG } from "./es";
import { FR_KIT_CATALOG } from "./fr";
import { PT_KIT_CATALOG } from "./pt";

// Re-exported so consumers can import the individual catalogs through the
// barrel (a missing named export is silently `undefined` under vite ESM).
export { DE_KIT_CATALOG } from "./de";
export { EN_KIT_CATALOG } from "./en";
export { ES_KIT_CATALOG } from "./es";
export { FR_KIT_CATALOG } from "./fr";
export { PT_KIT_CATALOG } from "./pt";

/**
 * Built-in kit catalogs (spec §4.3). `en` is the reference — its values are
 * the components' current hardcoded literals (no-provider rendering is
 * byte-identical to pre-i18n). `fr/es/de/pt` are curated initial translations
 * (spec §15), overridable per key.
 */
export const BUILT_IN_CATALOGS: Record<LocaleTag, MessageCatalog> = {
  en: EN_KIT_CATALOG,
  fr: FR_KIT_CATALOG,
  es: ES_KIT_CATALOG,
  de: DE_KIT_CATALOG,
  pt: PT_KIT_CATALOG,
};

/** Locales the kit ships curated kit strings for (the CLI's scaffold set). */
export const CURATED_LOCALES: LocaleTag[] = ["en", "fr", "es", "de", "pt"];
