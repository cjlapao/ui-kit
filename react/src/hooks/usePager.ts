import { useEffect, useState } from "react";

export interface UsePagerOptions {
  /** How many pages there are. */
  count: number;
  /** Controlled index. Omit for uncontrolled paging. */
  page?: number;
  /** Fires whenever the visible page changes, controlled or not. */
  onPageChange?: (page: number) => void;
  /** Wrap past the ends instead of stopping. @default false */
  loop?: boolean;
}

export interface Pager {
  /** The visible index, always inside `0 … count - 1`. */
  page: number;
  total: number;
  canPrev: boolean;
  canNext: boolean;
  prev: () => void;
  next: () => void;
  goTo: (index: number) => void;
}

/**
 * Paging state: controlled or uncontrolled, clamped, with the ends handled.
 *
 * Extracted because three components had grown their own copy and they did not
 * agree. `StatChartTile`'s read `data[currentIndex]` with no clamp at all, so a
 * dataset list that shrank under a mounted tile — a reload returning fewer
 * datasets — crashed on `undefined`. Clamping in one place fixes it for
 * everything that pages.
 *
 * The clamp is applied when *reading*, and the resync to internal state is an
 * effect. Doing it during render is a render-phase state update: React re-runs
 * the component immediately and warns.
 */
export function usePager({
  count,
  page,
  onPageChange,
  loop = false,
}: UsePagerOptions): Pager {
  const [internal, setInternal] = useState(0);

  const total = Math.max(0, count);
  const isControlled = page !== undefined;
  const raw = isControlled ? page : internal;
  const current = total > 0 ? Math.min(Math.max(0, raw), total - 1) : 0;

  useEffect(() => {
    if (!isControlled && internal !== current) setInternal(current);
  }, [isControlled, internal, current]);

  const goTo = (next: number) => {
    if (total === 0) return;
    const wrapped = loop ? ((next % total) + total) % total : next;
    const clamped = Math.min(Math.max(0, wrapped), total - 1);
    if (!isControlled) setInternal(clamped);
    onPageChange?.(clamped);
  };

  return {
    page: current,
    total,
    canPrev: loop ? total > 1 : current > 0,
    canNext: loop ? total > 1 : current < total - 1,
    prev: () => goTo(current - 1),
    next: () => goTo(current + 1),
    goTo,
  };
}

export default usePager;
