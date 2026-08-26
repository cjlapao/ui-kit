import { computed, nextTick, ref, watch, type ComputedRef, type Ref } from "vue";
import type { Message } from "./types";

const STICK_THRESHOLD = 80; // px from the bottom that still counts as "stuck"
const LEAD = 2; // messages kept above the viewport top while scrolling down

const BASE_H = 44; // padding + one line
const LINE_H = 22;
const MAX_H = 400;

export interface Viewport {
  scrollTop: number;
  clientHeight: number;
  scrollHeight: number;
}

/** Height heuristic when a message hasn't been measured yet. */
export function estimateHeightFor(text: string): number {
  if (!text) return BASE_H;
  const newlines = text.split("\n").length;
  const wrapped = Math.ceil(text.length / 70);
  const lines = Math.max(newlines, wrapped);
  return Math.min(MAX_H, BASE_H + lines * LINE_H);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Sum of heights for indices [from, to). */
export function sumRange(
  arr: Message[],
  from: number,
  to: number,
  heightAt: (i: number) => number,
): number {
  let s = 0;
  const end = Math.min(to, arr.length);
  for (let i = Math.max(0, from); i < end; i++) s += heightAt(i);
  return s;
}

/** First index whose cumulative height crosses `offset`, keeping `lead` above it. */
export function indexAtOffset(
  arr: Message[],
  offset: number,
  heightAt: (i: number) => number,
  maxStart: number,
  lead: number,
): number {
  let acc = 0;
  for (let i = 0; i < arr.length; i++) {
    acc += heightAt(i);
    if (acc > offset) return clamp(i - lead, 0, maxStart);
  }
  return maxStart;
}

export interface MessageWindowState {
  windowMessages: ComputedRef<{ message: Message; index: number }[]>;
  topSpacer: ComputedRef<number>;
  bottomSpacer: ComputedRef<number>;
  startIndex: Ref<number>;
  showJump: ComputedRef<boolean>;
  isAtBottom: Ref<boolean>;
  bindScroll(getEl: () => HTMLElement | null): void;
  onScroll(vp?: Viewport): void;
  setHeight(index: number, height: number): void;
  jumpToBottom(): void;
  reset(): void;
  scrollToBottom(): void;
  dispose(): void;
}

/**
 * Sliding-window message list. Only ~`targetCount` messages are mounted at a time;
 * top/bottom spacers preserve total scroll height while older/newer messages mount & unmount.
 * Measure + re-anchor keeps the viewport stable as estimates are replaced by real heights.
 */
export function useMessageWindow(
  messages: Ref<Message[]>,
  opts: { targetCount?: number } = {},
): MessageWindowState {
  const targetCount = opts.targetCount ?? 25;
  const startIndex = ref(0);
  const heights = ref<Record<number, number>>({});
  const isAtBottom = ref(true);

  let elGetter: (() => HTMLElement | null) | null = null;
  let ro: ResizeObserver | null = null;
  let scrollListener: (() => void) | null = null;

  const heightAt = (i: number): number => {
    const h = heights.value[i];
    return h != null ? h : estimateHeightFor(messages.value[i]?.content ?? "");
  };

  const maxStart = (): number => Math.max(0, messages.value.length - targetCount);

  const windowEnd = computed(() =>
    Math.min(messages.value.length, startIndex.value + targetCount),
  );
  const windowMessages = computed(() => {
    const arr = messages.value;
    const out: { message: Message; index: number }[] = [];
    for (let i = startIndex.value; i < windowEnd.value; i++) out.push({ message: arr[i], index: i });
    return out;
  });
  const topSpacer = computed(() => sumRange(messages.value, 0, startIndex.value, heightAt));
  const bottomSpacer = computed(() =>
    sumRange(messages.value, windowEnd.value, messages.value.length, heightAt),
  );
  const showJump = computed(() => !isAtBottom.value && messages.value.length > 0);

  function currentViewport(): Viewport | null {
    const el = elGetter ? elGetter() : null;
    if (!el) return null;
    return { scrollTop: el.scrollTop, clientHeight: el.clientHeight, scrollHeight: el.scrollHeight };
  }

  /** After spacers/messages change, restore the same content point under the cursor. */
  function reanchor(listTop: number, keepBottom: boolean): void {
    nextTick(() => {
      const el = elGetter ? elGetter() : null;
      if (!el) return;
      if (isAtBottom.value || keepBottom) el.scrollTop = el.scrollHeight;
      else el.scrollTop = Math.max(0, listTop + topSpacer.value);
    });
  }

  function applyScroll(vp: Viewport): void {
    const distance = vp.scrollHeight - vp.scrollTop - vp.clientHeight;
    isAtBottom.value = distance <= STICK_THRESHOLD;
    const target = indexAtOffset(
      messages.value,
      vp.scrollTop - topSpacer.value,
      heightAt,
      maxStart(),
      LEAD,
    );
    if (target !== startIndex.value) {
      const listTop = vp.scrollTop - topSpacer.value;
      startIndex.value = target;
      reanchor(listTop, false);
    }
  }

  function onScroll(vp?: Viewport): void {
    const target = vp ?? currentViewport();
    if (target) applyScroll(target);
  }

  function measureEl(): void {
    const el = elGetter ? elGetter() : null;
    if (!el) return;
    const start = startIndex.value;
    const end = windowEnd.value;
    const oldTop = topSpacer.value;
    const listTop = el.scrollTop - oldTop;
    let changed = false;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-msg-index]"));
    for (const node of nodes) {
      const idx = Number(node.dataset.msgIndex);
      if (Number.isNaN(idx) || idx < start || idx >= end) continue;
      const h = node.getBoundingClientRect().height;
      if (h > 0 && Math.abs((heights.value[idx] ?? 0) - h) > 0.5) {
        heights.value[idx] = h;
        changed = true;
      }
    }
    if (changed) reanchor(listTop, false);
  }

  function bindScroll(getEl: () => HTMLElement | null): void {
    elGetter = getEl;
    const el = getEl();
    if (el) {
      scrollListener = () => onScroll();
      el.addEventListener("scroll", scrollListener, { passive: true });
      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(() => measureEl());
        ro.observe(el);
      }
      startIndex.value = maxStart();
      isAtBottom.value = true;
      nextTick(measureEl);
    }
  }

  function dispose(): void {
    if (elGetter && scrollListener) {
      elGetter()?.removeEventListener("scroll", scrollListener);
    }
    ro?.disconnect();
    ro = null;
    scrollListener = null;
    elGetter = null;
  }

  function setHeight(index: number, height: number): void {
    if (height > 0 && heights.value[index] !== height) heights.value[index] = height;
  }

  function jumpToBottom(): void {
    startIndex.value = maxStart();
    isAtBottom.value = true;
    reanchor(0, true);
  }

  function scrollToBottom(): void {
    nextTick(() => {
      const el = elGetter ? elGetter() : null;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  function reset(): void {
    heights.value = {};
    startIndex.value = maxStart();
    isAtBottom.value = true;
    scrollToBottom();
  }

  // Chat switch (array reference change) -> reset to bottom.
  watch(() => messages.value, () => reset());
  // Stick-to-bottom on append; if scrolled up, just grow spacers without yanking.
  watch(
    () => messages.value.length,
    (len, prev) => {
      if (len > (prev ?? 0) && isAtBottom.value) {
        if (maxStart() !== startIndex.value) startIndex.value = maxStart();
        scrollToBottom();
      }
    },
  );
  // Follow a growing (streaming) trailing message while pinned to the bottom.
  watch(
    () => {
      const arr = messages.value;
      return arr.length ? arr[arr.length - 1]?.content ?? "" : "";
    },
    () => {
      if (isAtBottom.value) scrollToBottom();
    },
  );

  return {
    windowMessages,
    topSpacer,
    bottomSpacer,
    startIndex,
    showJump,
    isAtBottom,
    bindScroll,
    onScroll,
    setHeight,
    jumpToBottom,
    reset,
    scrollToBottom,
    dispose,
  };
}
