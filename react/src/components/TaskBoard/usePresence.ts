/**
 * usePresence — keep a collapsing region mounted until its close animation
 * has played, then unmount it. Opening mounts at once. Under
 * `prefers-reduced-motion` there is no animation to wait for.
 *
 * While closing, the caller marks the region `inert`, so focus, keyboard
 * navigation and drop targets already skip it.
 */

import { useEffect, useState } from "react";

/** Length of the board's collapse / expand transitions (Tailwind `duration-200`). */
export const COLLAPSE_MS = 200;

export function usePresence(open: boolean, ms: number = COLLAPSE_MS): boolean {
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || ms <= 0) {
      setMounted(false);
      return;
    }
    const t = setTimeout(() => setMounted(false), ms);
    return () => clearTimeout(t);
  }, [open, ms]);
  return open || mounted;
}
