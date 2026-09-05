import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import {
  TRUE_COLORS,
  getSurfacePaddingClass,
  type ControlSize,
  type SurfacePadding,
  type TrueColor,
} from "../theme";

/**
 * A colour, in its canonical swatch shade — the tone every component's
 * `tone` prop would take. Declared as literals (not `bg-${tone}-500`): the
 * Picker's history is what happens otherwise — Tailwind only emits what it
 * can see, and interpolated class strings are invisible to it.
 */
const SWATCH_FILL: Record<TrueColor, string> = {
  red: "bg-red-500 dark:bg-red-400",
  orange: "bg-orange-500 dark:bg-orange-400",
  amber: "bg-amber-500 dark:bg-amber-400",
  yellow: "bg-yellow-500 dark:bg-yellow-400",
  lime: "bg-lime-500 dark:bg-lime-400",
  green: "bg-green-500 dark:bg-green-400",
  emerald: "bg-emerald-500 dark:bg-emerald-400",
  teal: "bg-teal-500 dark:bg-teal-400",
  cyan: "bg-cyan-500 dark:bg-cyan-400",
  sky: "bg-sky-500 dark:bg-sky-400",
  blue: "bg-blue-500 dark:bg-blue-400",
  indigo: "bg-indigo-500 dark:bg-indigo-400",
  violet: "bg-violet-500 dark:bg-violet-400",
  purple: "bg-purple-500 dark:bg-purple-400",
  fuchsia: "bg-fuchsia-500 dark:bg-fuchsia-400",
  rose: "bg-rose-500 dark:bg-rose-400",
  slate: "bg-slate-500 dark:bg-slate-400",
  gray: "bg-gray-500 dark:bg-gray-400",
  zinc: "bg-zinc-500 dark:bg-zinc-400",
  neutral: "bg-neutral-500 dark:bg-neutral-400",
  stone: "bg-stone-500 dark:bg-stone-400",
};

const DOT_CLASS: Record<ControlSize, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
  xl: "size-9",
};

/** Pixel footprints behind the class map, for the overlap and clip math. */
const DOT_PX: Record<ControlSize, number> = { xs: 12, sm: 16, md: 20, lg: 28, xl: 36 };
const GAP_PX: Record<ControlSize, number> = { xs: 4, sm: 6, md: 8, lg: 12, xl: 16 };
/** How much of each dot the next one rides over, condensed. */
const OVERLAP_RATIO = 0.3;
/** Rough footprint of the +N chip, for the width-fits math. */
const CHIP_PX = 34;
/** A wrapping line is the dot plus a share of the row gap. */
/** The label block a `showNames` swatch adds to a row: gap-1 over a
    `leading-4` 10px label. */
const LABEL_PX = 20;
/** Per-dot cascade step, expanding and collapsing. */
const CASCADE_MS = 20;
/** Retracting is swift: a tighter ripple and a shorter hold. */
const RETRACT_MS = 8;
const HOLD_MS = 300;
const GROW_MS = 400;
/** Inner breathing room so hover growth stays inside the clip. */
const PAD_RATIO = 0.25;

export interface ColorSwatchesProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The colours to display.
   * @default TRUE_COLORS
   */
  colors?: readonly TrueColor[];
  /** Dot diameter, on the shared control scale. @default "md" */
  size?: ControlSize;
  /** Inset around the group, on the shared container scale. @default "none" */
  padding?: SurfacePadding;
  /**
   * Dots shown before the `+N` chip while condensed — and the cap on
   * non-overlapping dots once a container too narrow for the whole row
   * condenses on its own.
   * @default 5
   */
  maxVisible?: number;
  /**
   * What opens the expansion: the `+N` chip (`click`, the default) or the
   * pointer entering the group (`hover`; the chip always works too).
   * @default "click"
   */
  expandOn?: "click" | "hover";
  /** @default false */
  defaultExpanded?: boolean;
  /** @default "circle" */
  shape?: "circle" | "square";
  /**
   * The tone names under the dots — revealed with the expansion, so the
   * condensed row stays a pure colour strip.
   * @default false
   */
  showNames?: boolean;
  className?: string;
}

/**
 * Colours on display: a strip of dots for the theme's tones, condensed into
 * an overlapping stack with a `+N` chip whenever the count (or the width)
 * outgrows the row, and expanded by *unfolding* — the stacked dots spread
 * apart, the rest pop in one by one, and the strip grows exactly as far as
 * the new lines need. One layout, clipped or whole; nothing replaces
 * anything.
 */
export const ColorSwatches = ({
  colors = TRUE_COLORS,
  size = "md",
  padding = "none",
  maxVisible = 5,
  expandOn = "click",
  defaultExpanded = false,
  shape = "circle",
  showNames = false,
  className = "",
  ...rest
}: ColorSwatchesProps) => {
  const regionId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(defaultExpanded);
  // The retract mirrors the unfold: the expanded layout is held while the
  // dots step away right to left, and the condensed geometry — zeroed
  // widths, overlap margins — commits only when the hold ends, so nothing
  // snaps to the short layout mid-animation.
  const [collapsing, setCollapsing] = useState(false);
  const holdRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [width, setWidth] = useState(0);
  const [contentH, setContentH] = useState(0);

  useLayoutEffect(() => {
    setWidth(rootRef.current?.getBoundingClientRect().width ?? 0);
    setContentH(contentRef.current?.scrollHeight ?? 0);
  }, []);
  useEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === root) setWidth(entry.contentRect.width);
        else setContentH((entry.target as HTMLElement).scrollHeight);
      }
    });
    observer.observe(root);
    if (content) observer.observe(content);
    return () => observer.disconnect();
  }, []);
  useEffect(() => () => clearTimeout(holdRef.current), []);

  const count = colors.length;
  const dotPx = DOT_PX[size];
  const gapPx = GAP_PX[size];
  const overlapPx = Math.round(dotPx * OVERLAP_RATIO);
  const stepPx = dotPx - overlapPx;
  // Hover growth (the halo's 1.45× needs ~a quarter dot) has to stay
  // inside the clip's box — a quarter dot of padding keeps it off the
  // clip's edges at the strip's borders.
  const padPx = Math.round(dotPx * PAD_RATIO);

  // Too narrow, too many — the two ways a strip condenses. A width of 0
  // means unmeasured (jsdom), where only the count rule can apply.
  const availablePx = width - padPx * 2;
  const fullRowPx = count * dotPx + (count - 1) * gapPx;
  const fitsAll = width === 0 || availablePx >= fullRowPx;
  const condense = !fitsAll || count > maxVisible;
  // Only a measured overflow may cut the count below `maxVisible`; an
  // unmeasured root (width 0 — jsdom, first paint) condenses on count alone.
  const widthFits = !fitsAll
    ? Math.max(1, Math.floor((availablePx - CHIP_PX + stepPx) / stepPx))
    : count;
  const visibleCount = condense ? Math.min(count, maxVisible, widthFits) : count;
  const layoutOpen = expanded || collapsing;
  const hiddenCount = layoutOpen ? 0 : count - visibleCount;
  const expandable = condense || showNames;

  // The clip animates between exactly one wrapping line — padding, the
  // line (dot, label block when shown) and the rows' bottom margin — and
  // the measured height of the laid-out whole.
  const rowPx = padPx * 2 + dotPx + (showNames ? LABEL_PX : 0) + gapPx;
  const clipStyle: React.CSSProperties = {
    overflow: "hidden",
    maxHeight: layoutOpen ? (contentH > 0 ? `${contentH}px` : "none") : `${rowPx}px`,
    transition: `max-height ${expanded ? GROW_MS : HOLD_MS}ms ease-out`,
  };

  const reveal = (open: boolean) => {
    clearTimeout(holdRef.current);
    if (open) {
      setCollapsing(false);
      setExpanded(true);
    } else {
      setExpanded(false);
      setCollapsing(true);
      holdRef.current = setTimeout(() => setCollapsing(false), HOLD_MS);
    }
  };

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    reveal(!expanded);
  };

  const cascadeMs = (index: number) =>
    (expanded ? index * CASCADE_MS : (count - 1 - index) * RETRACT_MS);

  const dotStyle = (index: number, hidden: boolean, leading: boolean, order?: number): React.CSSProperties => ({
    // Hidden dots keep their slot in the flow but zero their width, so the
    // clip shows a short condensed line while their layout never moves.
    width: hidden && !collapsing ? 0 : undefined,
    minWidth: hidden && !collapsing ? 0 : undefined,
    marginRight:
      hidden || layoutOpen || !condense
        ? `${gapPx}px`
        : leading
          ? `${-overlapPx}px`
          : `${gapPx}px`,
    marginBottom: `${gapPx}px`,
    // While condensed the overflow dots hold their place behind the chip;
    // expanded, they precede it — the chip always ends the sequence it
    // controls. (`order` is what makes the chip leap the fold when open.)
    order,
    // Expanding cascades everything left to right; retracting hides with a
    // swift right-to-left ripple and commits the condensed margins the
    // moment the hold ends — a continuous swift motion, never a wait.
    transition: `width 0s, margin-right ${expanded ? 200 : 150}ms ease-out, transform 200ms ease-out, opacity 200ms ease-out`,
    transitionDelay: `0ms, ${expanded ? `${index * CASCADE_MS}ms` : "0ms"}, ${cascadeMs(index)}ms, ${cascadeMs(index)}ms`,
    transform: hidden ? "scale(0)" : "scale(1)",
    opacity: hidden ? 0 : 1,
  });

  const dot = (tone: TrueColor, index: number, hidden: boolean, leading: boolean, order?: number) => (
    <span
      key={`${tone}-${index}`}
      title={tone}
      className={classNames(
        "flex shrink-0 flex-col items-center gap-1",
        hidden && "overflow-hidden",
      )}
      style={dotStyle(index, hidden, leading, order)}
    >
      <span className="group relative block shrink-0 hover:z-10">
        <span
          aria-hidden="true"
          className={classNames(
            "absolute inset-0 scale-100 opacity-0 transition duration-200 ease-out",
            "group-hover:scale-[1.45] group-hover:opacity-40",
            SWATCH_FILL[tone],
            shape === "circle" ? "rounded-full" : "rounded-md",
          )}
        />
        <span
          className={classNames(
            "relative block transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.15]",
            SWATCH_FILL[tone],
            DOT_CLASS[size],
            shape === "circle" ? "rounded-full" : "rounded-md",
          )}
        />
      </span>
      {showNames && (
        <span
          className="text-[10px] leading-4 text-neutral-500 dark:text-neutral-400"
          style={{
            opacity: expanded ? 1 : 0,
            transition: "opacity 200ms ease-out",
            transitionDelay: `${cascadeMs(index)}ms`,
          }}
        >
          {tone}
        </span>
      )}
    </span>
  );

  return (
    <div
      {...rest}
      ref={rootRef}
      className={classNames("relative", getSurfacePaddingClass(padding), className)}
      data-expanded={expanded ? "" : undefined}
      onPointerEnter={(event) => {
        if (expandOn === "hover" && expandable) reveal(true);
        rest.onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        if (expandOn === "hover" && expanded) reveal(false);
        rest.onPointerLeave?.(event);
      }}
    >
      <div style={clipStyle}>
        <div
          ref={contentRef}
          id={regionId}
          role="group"
          aria-label="Colour swatches"
          className="flex flex-wrap items-start"
          style={{ padding: `${padPx}px` }}
        >
          {colors.slice(0, visibleCount).map((tone, index) => dot(tone, index, false, true))}
          {expandable && (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={expanded}
              aria-controls={regionId}
              aria-label={
                expanded
                  ? "Collapse colours"
                  : hiddenCount > 0
                    ? `Show ${hiddenCount} more colours`
                    : "Expand colours"
              }
              className={classNames(
                "inline-flex shrink-0 items-center justify-center gap-0.5 self-start rounded-full px-1.5",
                "bg-neutral-100 text-[11px] font-medium text-neutral-600 transition-colors hover:bg-neutral-200",
                "dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
              )}
              style={{
                height: Math.max(dotPx, 18),
                // A lone `+` wants a circle, not a tall pill; the count
                // earns the pill back.
                width: expanded ? `${Math.max(dotPx, 18)}px` : undefined,
                paddingLeft: expanded ? 0 : undefined,
                paddingRight: expanded ? 0 : undefined,
                // The last visible dot rides over by one overlap when
                // condensed — the chip pays that back; otherwise the
                // dot's own margin is the whole gap.
                marginLeft: !layoutOpen && condense ? `${overlapPx + gapPx}px` : 0,
                order: layoutOpen ? 3 : 1,
                marginBottom: `${gapPx}px`,
              }}
            >
              <span
                className={classNames(
                  "text-sm leading-none transition-transform duration-300",
                  expanded && "rotate-45",
                )}
                aria-hidden="true"
              >
                +
              </span>
              {hiddenCount > 0 && hiddenCount}
            </button>
          )}
          {colors.slice(visibleCount).map((tone, offset) =>
            dot(tone, visibleCount + offset, !expanded, false, 2),
          )}
        </div>
      </div>
    </div>
  );
};

ColorSwatches.displayName = "ColorSwatches";

export default ColorSwatches;
