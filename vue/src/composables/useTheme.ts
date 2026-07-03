import {
  getCurrentScope,
  onScopeDispose,
  ref,
  watch,
  type Ref,
} from "vue";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "ui-kit-demo-theme";

/**
 * Read the stored theme from localStorage, falling back to `"light"`
 * (the kit's default) when nothing is stored.
 *
 * SSR-safe: returns `"light"` when `window` / `localStorage` aren't present.
 */
function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "light";
}

function isSystemDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Write the active `class="dark"` on `<html>` (when in dark mode) and persist
 * the user's chosen mode in localStorage.
 *
 * The demo's `demo/src/index.css` uses
 * `@custom-variant dark (&:where(.dark, .dark *))` which picks up `.dark`
 * on the root element and cascades through all descendants.
 */
function applyTheme(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const isDark = mode === "system" ? isSystemDark() : mode === "dark";
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* localStorage unavailable */
    }
  }
}

export interface UseThemeReturn {
  theme: Ref<ThemeMode>;
  effectiveTheme: Ref<"light" | "dark">;
  setTheme: (mode: ThemeMode) => void;
}

/**
 * Composable for managing the demo app's color theme.
 *
 * Modes:
 *  - `"system"` — follow OS `prefers-color-scheme` (reactive).
 *  - `"light"`  — force light.
 *  - `"dark"`   — force dark.
 *
 * The composable applies `class="dark"` to `<html>` which, combined with the
 * `@custom-variant dark (&:where(.dark, .dark *))` directive in
 * `demo/src/index.css`, cascades dark-mode styles to all `.dark:` descendants.
 * Persists the choice in `localStorage` and re-applies on OS preference
 * changes when in `system` mode.
 *
 * First visit defaults to `"light"`.
 */
export function useTheme(): UseThemeReturn {
  const theme = ref<ThemeMode>(getStoredTheme());
  const effectiveTheme = ref<"light" | "dark">(
    theme.value === "system"
      ? isSystemDark()
        ? "dark"
        : "light"
      : theme.value,
  );

  const setTheme = (mode: ThemeMode): void => {
    theme.value = mode;
  };

  // Apply synchronously on init and whenever the mode changes
  // (React useLayoutEffect equivalent) and keep effectiveTheme in sync.
  watch(
    theme,
    (mode) => {
      applyTheme(mode);
      effectiveTheme.value =
        mode === "system" ? (isSystemDark() ? "dark" : "light") : mode;
    },
    { immediate: true, flush: "sync" },
  );

  // React to OS preference changes while in system mode.
  let mql: MediaQueryList | null = null;
  const onMqlChange = (): void => {
    if (!mql) return;
    const isDark = mql.matches;
    document.documentElement.classList.toggle("dark", isDark);
    effectiveTheme.value = isDark ? "dark" : "light";
  };
  const stopListening = (): void => {
    if (mql) {
      mql.removeEventListener("change", onMqlChange);
      mql = null;
    }
  };

  watch(
    theme,
    (mode) => {
      stopListening();
      if (typeof window === "undefined") return;
      if (mode !== "system") return;
      mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener("change", onMqlChange);
    },
    { immediate: true },
  );

  // Clean up the media-query listener when the owning effect scope
  // (component or manual effectScope) is disposed. Guarded so the
  // composable also works outside a component/scope.
  if (getCurrentScope()) {
    onScopeDispose(stopListening);
  }

  return { theme, effectiveTheme, setTheme };
}
