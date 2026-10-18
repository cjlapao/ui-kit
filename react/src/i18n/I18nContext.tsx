import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  createI18n,
  devWarnOnce,
  wrapEngineWithSideEffects,
  type I18nConfig,
  type I18nEngine,
  type MessageCatalog,
} from "../../../common/i18n";

/**
 * React binding of the shared i18n engine (spec §8.2).
 *
 * The engine itself is framework-agnostic (`common/i18n`); this module owns
 * the React context, the no-provider default engine, and the one-time dev
 * warning. `useKitT` is the internal lookup the kit components use — it
 * resolves to the provider's engine when present and the built-in default
 * otherwise, so a kit component rendered without a provider still renders
 * its current (English) copy byte-identically.
 */
const I18nContext = createContext<I18nEngine | null>(null);

let defaultEngine: I18nEngine | null = null;

/**
 * No-provider fallback: built-in kit catalogs only, detection on, default
 * persistence. Built lazily once per app (module-level) so every
 * no-provider component shares one engine — and therefore one locale.
 */
function getDefaultEngine(): I18nEngine {
  if (!defaultEngine) {
    defaultEngine = wrapEngineWithSideEffects(createI18n({ locales: {} }), {
      locales: {},
    });
  }
  return defaultEngine;
}

export interface I18nProviderProps {
  /** User catalogs, keyed by locale tag. `{}` is fine — the kit catalogs apply. */
  locales: Record<string, MessageCatalog>;
  /** Key-resolution fallback locale. @default "en" */
  fallbackLocale?: I18nConfig["fallbackLocale"];
  /** Explicit active locale — skips detection and persistence reads. */
  locale?: I18nConfig["locale"];
  /** Detect from `navigator.languages`. @default true */
  detect?: I18nConfig["detect"];
  /** localStorage key; `null` = never persist. @default "ui-kit:locale" */
  storageKey?: I18nConfig["storageKey"];
  /** Update `<html lang/dir>`. @default true */
  updateDocument?: I18nConfig["updateDocument"];
  onFallbackKey?: I18nConfig["onFallbackKey"];
  children?: ReactNode;
}

export function I18nProvider(props: I18nProviderProps) {
  const config = useMemo(
    () => ({
      locales: props.locales,
      fallbackLocale: props.fallbackLocale,
      locale: props.locale,
      detect: props.detect,
      storageKey: props.storageKey,
      updateDocument: props.updateDocument,
      onFallbackKey: props.onFallbackKey,
    }),
    [
      props.locales,
      props.fallbackLocale,
      props.locale,
      props.detect,
      props.storageKey,
      props.updateDocument,
      props.onFallbackKey,
    ],
  );
  const engine = useMemo(
    () => wrapEngineWithSideEffects(createI18n(config), config),
    [config],
  );
  // Consumers subscribe (see useI18n/useKitEngine): the context value is the
  // stable engine object, so a locale change alone would not re-render them.
  return <I18nContext.Provider value={engine}>{props.children}</I18nContext.Provider>;
}

let warnedOutsideProvider = false;

/**
 * Public hook (spec §8.2). Returns the provider's engine, or the built-in
 * default engine with a one-time dev warning when no provider is present.
 */
function subscribeTo(engine: I18nEngine): void {
  // Re-render on locale change (subscribe/getVersion are closure-based on
  // the engine — no `this` binding hazards). The third argument makes
  // renderToString SSR-safe.
  useSyncExternalStore(engine.subscribe, engine.getVersion, engine.getVersion);
}

export function useI18n(): I18nEngine {
  const contextEngine = useContext(I18nContext);
  if (!contextEngine && !warnedOutsideProvider) {
    warnedOutsideProvider = true;
    devWarnOnce(
      "useI18n:outside-provider",
      "i18n: useI18n() was called outside <I18nProvider> — using the built-in kit engine (detection on). Wrap your app in <I18nProvider> to supply your own catalogs.",
    );
  }
  const engine = contextEngine ?? getDefaultEngine();
  subscribeTo(engine);
  return engine;
}

/** The internal kit lookup: provider engine or the built-in default —
 *  **never warns**. Kit components use this so they keep working (in
 *  English) in apps without a provider. */
export function useKitEngine(): I18nEngine {
  const engine = useContext(I18nContext) ?? getDefaultEngine();
  subscribeTo(engine);
  return engine;
}

/**
 * The internal kit TRANSLATE function — `t("kit.…")` (spec §9). Same
 * provider-or-default resolution as `useKitEngine`, never warns. Components
 * that need the engine itself (locale, parseNames) use `useKitEngine`.
 */
export function useKitT(): (key: string, values?: Record<string, unknown>) => string {
  return useKitEngine().t;
}

/** Test helper: reset the one-time warning latch. */
export function resetI18nProviderWarns(): void {
  warnedOutsideProvider = false;
}
