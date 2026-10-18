// Provider-side side effects (spec §8.1): persistence to localStorage and
// `<html lang/dir>`. The bare engine deliberately avoids both; the React
// provider (Phase 3) and the Vue provider (Phase 4) wrap their engines with
// this shared wrapper, so both kits behave identically.

import { isRTLLocale } from "./detect";
import { persistLocale } from "./storage";
import type { I18nConfig, I18nEngine, LocaleTag } from "./types";

function applyDocument(locale: LocaleTag, update: boolean | undefined): void {
  if (update === false) return;
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.dir = isRTLLocale(locale) ? "rtl" : "ltr";
}

/**
 * Wrap an engine with the side effects a provider owns. Returns a new
 * `I18nEngine` whose `setLocale` also persists (when `storageKey` allows)
 * and updates `<html lang/dir>` (when `updateDocument !== false`).
 */
export function wrapEngineWithSideEffects(engine: I18nEngine, config: I18nConfig): I18nEngine {
  applyDocument(engine.locale, config.updateDocument);
  return {
    ...engine,
    get locale() {
      return engine.locale;
    },
    get isRTL() {
      return engine.isRTL;
    },
    setLocale(tag) {
      const before = engine.locale;
      engine.setLocale(tag);
      if (engine.locale !== before) {
        persistLocale(config, engine.locale);
        applyDocument(engine.locale, config.updateDocument);
      }
    },
  };
}
