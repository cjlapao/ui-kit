// Vue binding of the shared i18n engine (spec §8.3): injection key and the
// no-provider default engine. The engine itself lives in `common/i18n`; the
// provider component + composables sit beside this file.
import { inject, type InjectionKey } from "vue";
import {
  createI18n,
  wrapEngineWithSideEffects,
  type I18nEngine,
} from "../../../common/i18n";

export const I18nKey: InjectionKey<I18nEngine> = Symbol("ui-kit-i18n");

let defaultEngine: I18nEngine | null = null;

/**
 * No-provider fallback: built-in kit catalogs only, detection on, default
 * persistence. Built lazily once per app (module-level) so every
 * no-provider component shares one engine — and therefore one locale.
 * Mirrors the React kit's default engine.
 */
export function getDefaultEngine(): I18nEngine {
  if (!defaultEngine) {
    defaultEngine = wrapEngineWithSideEffects(createI18n({ locales: {} }), {
      locales: {},
    });
  }
  return defaultEngine;
}

/** The provider's engine, or `null` when no provider is present. */
export function injectEngine(): I18nEngine | null {
  return inject(I18nKey, null);
}

/** Resolve the active engine: provider's engine or the built-in default. */
export function resolveEngine(): I18nEngine {
  return injectEngine() ?? getDefaultEngine();
}
