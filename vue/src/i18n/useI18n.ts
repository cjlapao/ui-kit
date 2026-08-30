// useI18n / useKitT composables (spec §8.3, plan task 4.1).
//
// Reactivity model: the engine's locale is a mutable closure variable, not a
// Vue ref. The composable mirrors it into a local `ref` synced via the
// engine's `subscribe`, and `t` reads that ref at call time — so a template
// that calls `t("…")` tracks the ref and re-renders on locale switch.
import {
  computed,
  onScopeDispose,
  ref,
  type ComputedRef,
  type Ref,
} from "vue";
import { devWarnOnce } from "../../../common/i18n/warn";
import type { I18nEngine } from "../../../common/i18n";
import { injectEngine, resolveEngine } from "./I18nContext";

export interface UseI18n {
  /** Translate `key` with ICU values. Missing → en fallback → the key. */
  t: (key: string, values?: Record<string, unknown>) => string;
  /** Active locale tag (reactive). */
  locale: Ref<string>;
  /** All available tags (user ∪ built-in), sorted. */
  locales: ComputedRef<string[]>;
  /** Exact or base-language match; otherwise dev-warn + no-op. */
  setLocale: (tag: string) => void;
  has: (key: string, locale?: string) => boolean;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (value: Date, options?: Intl.DateTimeFormatOptions) => string;
  /** CLDR month names for `tag` (default: active locale). */
  monthNames: (tag?: string, short?: boolean) => string[];
  /** CLDR weekday names for `tag` (default: active locale). */
  weekdayNames: (tag?: string, short?: boolean) => string[];
  /** Month/weekday spellings the input parser must accept (active locale). */
  parseNames: () => import("../../../common/i18n/dates").DateParseNames;
  isRTL: ComputedRef<boolean>;
  /** The engine itself (escape hatch). */
  engine: I18nEngine;
}

function bind(engine: I18nEngine, fromProvider: boolean): UseI18n {
  if (!fromProvider) {
    devWarnOnce(
      "useI18n:outside-provider",
      "i18n: useI18n() was called outside <I18nProvider> — using the built-in kit engine (detection on). Wrap your app in <I18nProvider> to supply your own catalogs.",
    );
  }
  const locale = ref(engine.locale);
  const unsubscribe = engine.subscribe(() => {
    locale.value = engine.locale;
  });
  onScopeDispose(unsubscribe);

  return {
    t: (key, values) => {
      void locale.value; // track: template `t("…")` re-renders on switch
      return engine.t(key, values);
    },
    locale,
    locales: computed(() => engine.locales),
    setLocale: (tag) => engine.setLocale(tag),
    has: (key, localeArg) => engine.has(key, localeArg),
    formatNumber: (value, options) => engine.formatNumber(value, options),
    formatDate: (value, options) => engine.formatDate(value, options),
    monthNames: (tag, short) => engine.monthNames(tag, short),
    weekdayNames: (tag, short) => engine.weekdayNames(tag, short),
    parseNames: () => engine.parseNames(engine.locale),
    isRTL: computed(() => engine.isRTL),
    engine,
  };
}

/**
 * Public composable (spec §8.3). Inside `<I18nProvider>`: the provider's
 * engine. Outside: the built-in default engine plus a one-time dev warning —
 * never a throw.
 */
export function useI18n(): UseI18n {
  const provided = injectEngine();
  return bind(provided ?? resolveEngine(), provided !== null);
}

/**
 * Internal kit lookup: provider engine or the built-in default — **never
 * warns**. Kit components use this so they keep working (in English) in
 * apps without a provider. Returns just the translate function, mirroring
 * the React `useKitT`.
 */
export function useKitT(): (
  key: string,
  values?: Record<string, unknown>,
) => string {
  return bind(resolveEngine(), true).t;
}
