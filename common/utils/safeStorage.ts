/**
 * A best-effort `Storage` wrapper, shared by every component that persists
 * settings of its own.
 *
 * It swallows quota errors, private-mode rejections and SSR (no `window`), so
 * persistence can never crash a render. Any `Storage`-shaped object
 * (sessionStorage, a test double, an IndexedDB adapter) can be passed in its
 * place.
 *
 * This was `Table`'s alone. `SmartGridLayout` needs the identical thing, and a
 * second copy of "degrade instead of throwing" logic is a second chance to get
 * one of the failure modes wrong.
 */

/** The subset of `Storage` these components actually use. */
export interface KitStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Resolves `localStorage` lazily *inside* each call's try/catch: access itself
 * throws in some blocked-storage configurations, so resolving once up front
 * would break the module rather than the call.
 */
export const createSafeLocalStorage = (): KitStorageAdapter => {
  const resolve = (): Storage | null => {
    try {
      if (typeof window === "undefined" || !window.localStorage) return null;
      return window.localStorage;
    } catch {
      return null;
    }
  };

  return {
    getItem: (key) => {
      try {
        return resolve()?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },
    setItem: (key, value) => {
      try {
        resolve()?.setItem(key, value);
      } catch {
        // Quota exceeded or storage blocked — persistence is best-effort.
      }
    },
    removeItem: (key) => {
      try {
        resolve()?.removeItem(key);
      } catch {
        // Same as above.
      }
    },
  };
};

/** Namespaced key, so component entries never collide with app keys. */
export const buildStorageKey = (prefix: string, key: string): string =>
  `${prefix}:${key}`;

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
