import { useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";

interface Options {
  /**
   * Element whose own box must not count toward the overflow — the footer a
   * measurement gates, so a marker can never trigger itself into visibility
   * (its own padding would push `scrollHeight` past the viewport once shown).
   */
  excludeRef?: RefObject<HTMLElement | null>;
  /**
   * Values that change the content (items, layout, column count, `hasMore`…).
   * Any change re-collects the observed children — new children are invisible
   * to a stale `ResizeObserver` — and re-measures. Keep the length stable.
   */
  deps?: readonly unknown[];
}

/**
 * Whether the scroller's content actually needs vertical scrolling, i.e. is
 * more than one page. Gates end-of-list affordances that would otherwise
 * announce the end of a list the user never had to scroll.
 *
 * Reports `true` while unmeasurable — an all-zero box (jsdom, a hidden
 * container) says nothing, and guessing "fits" would hide a marker a real
 * layout would show. Starts `true` so an overflowing list never waits a frame
 * for its marker; when the content fits, the first measure hides it.
 */
export function useScrollOverflow(
  scrollerRef: RefObject<HTMLElement | null> | undefined,
  { excludeRef, deps = [] }: Options = {},
): boolean {
  const [overflow, setOverflow] = useState(true);
  const latest = useRef({ scrollerRef, excludeRef });

  useLayoutEffect(() => {
    latest.current = { scrollerRef, excludeRef };
  });

  useLayoutEffect(() => {
    const measure = () => {
      const el = latest.current.scrollerRef?.current;
      if (!el) return;
      // All-zero box: no layout to read — treat as overflowing (see above).
      if (el.clientHeight === 0 && el.scrollHeight === 0) {
        setOverflow(true);
        return;
      }
      const own = latest.current.excludeRef?.current?.offsetHeight ?? 0;
      setOverflow(el.scrollHeight - own > el.clientHeight + 1);
    };
    measure();
    const el = scrollerRef?.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    // The scroller's own box is often fixed (a `height`/`max-height` panel),
    // so content growth moves `scrollHeight`, not the box — the direct
    // children have to be observed too.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    for (const child of Array.from(el.children)) observer.observe(child);
    return () => observer.disconnect();
    // `deps` is the caller's content fingerprint, spread per the hook contract.
  }, [scrollerRef, ...deps]);

  return overflow;
}
