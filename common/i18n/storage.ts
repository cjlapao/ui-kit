// Persistence helpers. Kept out of createI18n/provider so neither imports
// the other (spec §8.1: the bare engine stays environment-neutral; the
// provider owns localStorage + <html lang/dir>).

import type { I18nConfig, LocaleTag } from "./types";

export const DEFAULT_STORAGE_KEY = "ui-kit:locale";

/** The effective storage key (`null` = persistence disabled). */
export function storageKeyOf(config: Pick<I18nConfig, "storageKey">): string | null {
  if (config.storageKey === null) return null;
  return config.storageKey ?? DEFAULT_STORAGE_KEY;
}

function getStorage(): Storage | undefined {
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch {
    // access denied (e.g. some privacy modes) — treat as absent
  }
  return undefined;
}

/** The persisted locale choice, or `null` (SSR-safe). */
export function readStoredLocale(config: Pick<I18nConfig, "storageKey">): LocaleTag | null {
  const key = storageKeyOf(config);
  if (key === null) return null;
  const storage = getStorage();
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

/** Persist the active locale (no-op when disabled or unavailable). */
export function persistLocale(config: Pick<I18nConfig, "storageKey">, locale: LocaleTag): void {
  const key = storageKeyOf(config);
  if (key === null) return;
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(key, locale);
  } catch {
    // quota / denied — persistence is best-effort
  }
}
