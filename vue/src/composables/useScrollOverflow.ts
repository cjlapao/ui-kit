import { onBeforeUnmount, ref, watch, type Ref } from "vue";

interface Options {
  /**
   * Element whose own box must not count toward the overflow — the footer a
   * measurement gates, so a marker can never trigger itself into visibility
   * (its own padding would push `scrollHeight` past the viewport once shown).
   */
  excludeRef?: Ref<HTMLElement | null>;
  /**
   * Reactive fingerprint of the content (items, layout, column count,
   * `hasMore`…). Any change re-collects the observed children — new children
   * are invisible to a stale `ResizeObserver` — and re-measures.
   */
  deps?: () => unknown[];
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
  scrollerRef: Ref<HTMLElement | null | undefined>,
  { excludeRef, deps }: Options = {},
) {
  const overflow = ref(true);
  let observer: ResizeObserver | null = null;

  const measure = () => {
    const el = scrollerRef.value;
    if (!el) return;
    // All-zero box: no layout to read — treat as overflowing (see above).
    if (el.clientHeight === 0 && el.scrollHeight === 0) {
      overflow.value = true;
      return;
    }
    const own = excludeRef?.value?.offsetHeight ?? 0;
    overflow.value = el.scrollHeight - own > el.clientHeight + 1;
  };

  const observe = () => {
    observer?.disconnect();
    observer = null;
    measure();
    const el = scrollerRef.value;
    if (!el || typeof ResizeObserver === "undefined") return;
    // The scroller's own box is often fixed (a `height`/`max-height` panel),
    // so content growth moves `scrollHeight`, not the box — the direct
    // children have to be observed too.
    observer = new ResizeObserver(measure);
    observer.observe(el);
    Array.from(el.children).forEach((child) => observer?.observe(child));
  };

  watch(
    () => [scrollerRef.value, ...(deps?.() ?? [])],
    observe,
    { flush: "post", immediate: true },
  );
  onBeforeUnmount(() => observer?.disconnect());

  return overflow;
}
