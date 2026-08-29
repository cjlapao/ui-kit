// Dev/prod detection + deduped warnings (spec §5 error semantics).
//
// "dev" is asserted only when it can be determined: a Node-style
// `process.env.NODE_ENV` (vitest: "test", Vite dev: "development"). A prod
// browser bundle without a process shim counts as PROD, so missing values
// degrade (empty render + warn) instead of throwing where users can't act
// on it.

export function isDev(): boolean {
  try {
    const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
    const env = proc?.env?.NODE_ENV;
    if (typeof env === "string") return env !== "production";
    return false;
  } catch {
    return false;
  }
}

const warned = new Set<string>();

/** Warn at most once per `id`, in dev and prod alike. */
export function devWarnOnce(id: string, message: string): void {
  if (warned.has(id)) return;
  warned.add(id);
  // eslint-disable-next-line no-console
  console.warn(`[ui-kit i18n] ${message}`);
}

/** Test helper: clear the dedupe set between tests. */
export function resetWarned(): void {
  warned.clear();
}
