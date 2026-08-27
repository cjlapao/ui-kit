import React from "react";
import classNames from "classnames";
import IconButton from "./IconButton";
import { useSurfaceText } from "../contexts/SurfaceContext";
import type { ControlSize, TrueColor } from "../theme";
import type { Pager } from "../hooks/usePager";

/** Where the pager sits relative to the card's content. */
export const STAT_PAGER_PLACEMENTS = ["top", "bottom"] as const;
export type StatPagerPlacement = (typeof STAT_PAGER_PLACEMENTS)[number];

const TOKENS: Record<
  ControlSize,
  { label: string; counter: string; icon: ControlSize }
> = {
  xs: { label: "text-xs", counter: "text-[10px]", icon: "xs" },
  sm: { label: "text-xs", counter: "text-[10px]", icon: "xs" },
  md: { label: "text-sm", counter: "text-[11px]", icon: "xs" },
  lg: { label: "text-base", counter: "text-xs", icon: "sm" },
  xl: { label: "text-lg", counter: "text-xs", icon: "sm" },
};

export interface StatPagerProps {
  pager: Pager;
  /** Caption between the arrows — usually the current page's own label. */
  label?: React.ReactNode;
  size: ControlSize;
  tone: TrueColor;
  /** Shows the `2 / 5` counter under the label. @default true */
  showIndicator?: boolean;
  /** The card is on a gradient wash, so the copy has to be white. */
  onGradient?: boolean;
  className?: string;
}

/**
 * The prev / label / next strip a paged Stat card draws.
 *
 * This is the presentation only — the index lives in `usePager`, shared with
 * `PagedPanel`. The two do not share a *header* because `PagedPanel`'s carries
 * a title, subtitle and a divider that a metric card has no room for; what
 * they must not disagree about is the clamping and the end conditions, and
 * that is the part that is shared.
 */
export const StatPager: React.FC<StatPagerProps> = ({
  pager,
  label,
  size,
  tone,
  showIndicator = true,
  onGradient = false,
  className,
}) => {
  const text = useSurfaceText();
  const tokens = TOKENS[size] ?? TOKENS.md;
  if (pager.total <= 1 && label == null) return null;

  return (
    <div className={classNames("flex items-center gap-2", className)}>
      <IconButton
        icon="ArrowChevronLeft"
        variant="ghost"
        size={tokens.icon}
        color={tone}
        srLabel="Previous page"
        tooltip="Previous page"
        disabled={!pager.canPrev}
        onClick={(event) => {
          // A paged card is often `onClick`-able itself; without this the
          // arrow would page *and* activate the card underneath it.
          event.stopPropagation();
          pager.prev();
        }}
        className={classNames(pager.total <= 1 && "invisible")}
      />
      <div className="min-w-0 flex-1 text-center">
        {label != null && (
          <div
            className={classNames(
              "truncate font-semibold",
              tokens.label,
              onGradient ? "text-white" : text.heading,
            )}
          >
            {label}
          </div>
        )}
        {showIndicator && pager.total > 1 && (
          // Polite, so paging announces the new position instead of leaving a
          // screen reader with no idea the content changed.
          <div
            role="status"
            aria-live="polite"
            className={classNames(
              "tabular-nums",
              tokens.counter,
              onGradient ? "text-white/70" : text.muted,
            )}
          >
            {pager.page + 1} / {pager.total}
          </div>
        )}
      </div>
      <IconButton
        icon="ArrowChevronRight"
        variant="ghost"
        size={tokens.icon}
        color={tone}
        srLabel="Next page"
        tooltip="Next page"
        disabled={!pager.canNext}
        onClick={(event) => {
          event.stopPropagation();
          pager.next();
        }}
        className={classNames(pager.total <= 1 && "invisible")}
      />
    </div>
  );
};

export default StatPager;
