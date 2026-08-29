// Shared i18n types. Framework-agnostic on purpose: both kits (react/src,
// vue/src) and the CLI import from this module. No React/Vue imports anywhere
// in common/i18n — the engine is plain TS over platform Intl (spec §3).

/** BCP-47 language tag: `"en"`, `"fr"`, `"fr-CA"`. */
export type LocaleTag = string;

/**
 * A catalog: message map. Values are usually message strings, but nested
 * objects are allowed (flattened to dot-keys) as are string arrays (used by
 * the `kit.date.*` name overrides). Non-string leaves are skipped with a
 * dev warning.
 */
export type MessageCatalog = Record<string, unknown>;

/** Object form of `t` — the future extraction phase's entry point. */
export interface I18nMessage {
  id: string;
  /** Used when `id` is missing everywhere (resolved as an ICU message). */
  defaultMessage?: string;
  values?: Record<string, unknown>;
}

export interface I18nConfig {
  /** User catalogs, keyed by locale tag. */
  locales: Record<LocaleTag, MessageCatalog>;
  /** Key-resolution fallback locale. @default "en" */
  fallbackLocale?: LocaleTag;
  /** Explicit active locale — skips detection and persistence reads. */
  locale?: LocaleTag;
  /** Detect from `navigator.languages`. @default true (no-op in SSR). */
  detect?: boolean;
  /**
   * localStorage key for the persisted choice; `null` = never persist (and
   * never read). @default "ui-kit:locale"
   */
  storageKey?: string | null;
  /** Set `document.documentElement.lang`/`dir` at init and on change. @default true */
  updateDocument?: boolean;
  /** Called when a key resolves via fallback or `defaultMessage`. */
  onFallbackKey?(key: string, requested: LocaleTag, resolved: LocaleTag): void;
}

export interface I18nEngine {
  /** Translate `key` with ICU values. Missing → en fallback → the key. */
  t(key: string, values?: Record<string, unknown>): string;
  t(msg: I18nMessage): string;
  /** Active locale tag. */
  locale: LocaleTag;
  /** All available tags (user ∪ built-in), sorted. */
  locales: LocaleTag[];
  has(key: string, locale?: LocaleTag): boolean;
  /** Exact or base-language match; otherwise warn + no-op. */
  setLocale(tag: LocaleTag): void;
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string;
  formatDate(value: Date, options?: Intl.DateTimeFormatOptions): string;
  monthNames(locale?: LocaleTag, short?: boolean): string[];
  weekdayNames(locale?: LocaleTag, short?: boolean): string[];
  /** Whether the active locale is right-to-left. */
  isRTL: boolean;
  /** Subscribe to locale changes; returns the unsubscribe function. */
  subscribe(listener: () => void): () => void;
  /** Bumped on every locale change (useSyncExternalStore-friendly). */
  getVersion(): number;
}
