// The React i18n surface (spec §8.2). The engine lives in common/i18n and
// is unit-tested from this directory (engine.*.test.ts files).
export * from "./I18nContext";

// The engine's public API re-exported through the kit barrel (spec §3):
// apps can build their own engine (tests, SSR, non-provider contexts) or
// read the built-in catalogs while authoring locale files.
export { createI18n } from "../../../common/i18n/createI18n";
export { flattenCatalog } from "../../../common/i18n/catalog";
export {
  parseMessage,
  IcuParseError,
  IcuValueError,
  type IcuNode,
  type IcuStyle,
} from "../../../common/i18n/icu";
export {
  BUILT_IN_CATALOGS,
  CURATED_LOCALES,
  EN_KIT_CATALOG,
  FR_KIT_CATALOG,
  ES_KIT_CATALOG,
  DE_KIT_CATALOG,
  PT_KIT_CATALOG,
} from "../../../common/i18n/builtIn";
export type {
  LocaleTag,
  MessageCatalog,
  I18nConfig,
  I18nEngine,
  I18nMessage,
} from "../../../common/i18n/types";
