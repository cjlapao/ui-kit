import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import { useKitT } from "../i18n";
import { type IconName } from "../icons/registry";
import Popover from "./Popover";
import {
  ScrollArea,
  SCROLLAREA_LANE_PX,
  SCROLLAREA_MASK_FADE_PX,
} from "./ScrollArea";
import {
  getSurfacePaddingClass,
  getTrueColorChipClasses,
  getTrueColorDotClass,
  CASCADE_EXPAND,
  type ControlSize,
  type SurfacePadding,
  type TrueColor,
} from "../theme";

/**
 * Identity chips on display: the `ColorSwatches` strip retargeted from dots
 * to avatars. Each item is a photo, an entity icon or an initials disc,
 * condensed into an overlapping stack with a `+N` chip whenever the count (or
 * the width) outgrows the row, and expanded by *unfolding* — the same one
 * layout the swatches unfold, off the same `CASCADE_EXPAND` rhythm.
 */

// ── Items ─────────────────────────────────────────────────────────────────────

export interface AvatarGroupItem {
  /**
   * Display name — the accessible name, the source of derived initials, and
   * the one line the chip surfaces in a `Popover` when the pointer dwells.
   */
  name?: string;
  /**
   * Explicit initials, max 2 chars — trimmed and uppercased, wins over the
   * derivation from `name`.
   */
  initials?: string;
  /** Registry icon name or element, the UserAvatar `icon` parity prop. */
  icon?: IconName | React.ReactElement;
  /** Image URL — a broken URL falls back down the chain, never a dead frame. */
  image?: string;
  /** This chip's colour; falls back to the group's `tone` (blue). */
  tone?: TrueColor;
  /**
   * Tone pad behind an image/icon chip — a solid light/dark step of the
   * resolved tone (`-100`/`-900`). Solid, not translucent: a `/10` wash
   * reads muddy on the dark scheme and bleeds through the overlap. Defaults
   * to `true` behind an icon (a glyph floating bare in a group looks
   * unfinished) and `false` behind an image (the art is the content; the pad
   * shows under transparent logos when asked for). Ignored by initials discs.
   */
  background?: boolean;
  /**
   * With a handler the chip becomes a real button — Enter/Space and a tone
   * focus ring included — instead of a `role="img"` figure.
   */
  onClick?: React.MouseEventHandler<HTMLElement>;
}

// ── Props ─────────────────────────────────────────────────────────────────────

export const AVATAR_GROUP_ROUNDED = ["full", "lg", "md", "none"] as const;
export type AvatarGroupRounded = (typeof AVATAR_GROUP_ROUNDED)[number];

// `onSelect`-style DOM handlers ride the attributes spread untouched — a chip
// reports through its own `onClick`, not the root's.
export interface AvatarGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** The identities to display. */
  items: AvatarGroupItem[];
  /** Chip box, on the shared control ladder. @default "md" */
  size?: ControlSize;
  /** The global fallback colour, when an item carries no `tone`. @default "blue" */
  tone?: TrueColor;
  /** One corner for every chip. @default "full" */
  rounded?: AvatarGroupRounded;
  /**
   * A 2px tone-neutral rim on every chip — the kit's glass edge, committed
   * enough to read at normal size in both schemes. It is what separates
   * same-tone chips where they overlap and lifts a flat tone pad off a
   * same-colored surface. @default true
   */
  border?: boolean;
  /**
   * Chips shown before the `+N` chip — and the cap on non-overlapping chips
   * once a container too narrow for the whole row condenses on its own.
   * Non-finite falls back to 5; finite values clamp to at least 1.
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
  /**
   * Cap the expansion at one row. Off (the default) the strip unfolds
   * naturally — chips wrap onto new lines and it grows as tall as it needs.
   * On, expansion never exceeds a single row: the chips stay on one
   * non-wrapping line and the strip scrolls sideways to reach the rest, the
   * collapse chip pinned to the right edge so it never scrolls away.
   * @default false
   */
  singleRow?: boolean;
  /** Inset around the group, on the shared container scale. @default "none" */
  padding?: SurfacePadding;
  className?: string;
}

/** Chip boxes — `UserAvatar`'s ladder, so a chip matches the avatar beside it. */
const AVATAR_PX: Record<ControlSize, number> = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 48,
};
const AVATAR_TEXT: Record<ControlSize, string> = {
  xs: "text-[10px]",
  sm: "text-[11px]",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-base",
};
const GAP_PX: Record<ControlSize, number> = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
};
/** Rough footprint of the +N chip, for the width-fits math. */
const PLUS_PX = 34;
/** How much of each chip the next one rides over, condensed. */
const OVERLAP_RATIO = 0.3;
/** Inner breathing room so hover growth stays inside the clip. */
const PAD_RATIO = 0.25;
/**
 * How long the pointer must rest on a chip before its name panel opens.
 * `Popover`'s hover mode opens on `mouseenter`, and chips touch — eight of
 * them inside ~200 px when condensed — so an instant open is a panel flashing
 * once per chip as the pointer crosses. The dwell is the grace the native
 * `title` it replaces had; `Tooltip`'s own convention is 500 ms.
 */
const TOOLTIP_DWELL_MS = 400;
/** The shared unfold rhythm — see `CASCADE_EXPAND` in the theme. */
const CASCADE_MS = CASCADE_EXPAND.stepMs;
const RETRACT_MS = CASCADE_EXPAND.retractStepMs;
const HOLD_MS = CASCADE_EXPAND.holdMs;
const GROW_MS = CASCADE_EXPAND.growMs;

const ROUNDED_CLASS: Record<AvatarGroupRounded, string> = {
  full: "rounded-full",
  lg: "rounded-xl",
  md: "rounded-md",
  none: "rounded-none",
};

/** First word's letter + last word's letter (`"Ada Lovelace"` → `"AL"`). */
export const deriveInitials = (name?: string): string => {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 1).toUpperCase();
  return (
    words[0].slice(0, 1) + words[words.length - 1].slice(0, 1)
  ).toUpperCase();
};

/** The initials a chip carries: explicit (normalized) over derived. */
const initialsOf = (item: AvatarGroupItem): string =>
  item.initials && item.initials.trim()
    ? item.initials.trim().toUpperCase().slice(0, 2)
    : deriveInitials(item.name);

// ── The chip ──────────────────────────────────────────────────────────────────

interface ChipProps {
  item: AvatarGroupItem;
  tone: TrueColor;
  size: ControlSize;
  rounded: AvatarGroupRounded;
  /** The 1px neutral rim — see the group's `border` prop. */
  bordered: boolean;
  /** Chips zero-width behind the +N keep their slot but leave the tab order. */
  hidden: boolean;
  /** The strip's expansion — an open panel is dismissed when the row moves. */
  expanded: boolean;
  fallbackName: string;
}

/**
 * One identity chip: the content chain (`image → icon → initials → User
 * glyph`) with the tone skins on top. Owns the image-error state, so a dead
 * URL walks the chain instead of breaking the row, and the dwell that opens
 * its name in a `Popover`; the layout and the cascade belong to `AvatarGroup`.
 */
const Chip = ({
  item,
  tone,
  size,
  rounded,
  bordered,
  hidden,
  expanded,
  fallbackName,
}: ChipProps) => {
  const renderIcon = useIconRenderer();
  const [hasError, setHasError] = useState(false);
  // The name panel. `Popover` keeps the hover plumbing — it owns the pointer
  // inside the portaled panel and debounces a leave by 150 ms, which is what
  // lets the pointer travel from chip into panel — but the chip is the source
  // of truth for `visible`, because it alone knows a strip of touching chips
  // must not flash a panel per chip: an open request waits out the dwell, a
  // close request cancels it and closes at once.
  const [open, setOpen] = useState(false);
  const dwell = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => setHasError(false), [item.image]);
  useEffect(() => () => clearTimeout(dwell.current), []);
  // Cascading moves the chip out from under an open panel: nothing to point
  // at, and its ResizeObserver would re-measure every frame of the animation.
  useEffect(() => setOpen(false), [expanded]);

  const requestOpen = (next: boolean) => {
    clearTimeout(dwell.current);
    if (next)
      dwell.current = setTimeout(() => setOpen(true), TOOLTIP_DWELL_MS);
    else setOpen(false);
  };

  const px = AVATAR_PX[size];
  const shape = ROUNDED_CLASS[rounded];
  const { fill, ink, wash, washInk } = getTrueColorChipClasses(tone);

  const src = item.image && !hasError ? item.image : null;
  const label = initialsOf(item);
  // The chain: image, then icon, then initials, then the User glyph.
  const kind: "image" | "icon" | "initials" | "fallback" = src
    ? "image"
    : item.icon
      ? "icon"
      : label
        ? "initials"
        : "fallback";
  // The pad brands the chip without outshouting the artwork on top of it.
  const showWash =
    item.background ?? (kind === "icon" || kind === "fallback" ? true : false);
  // Initials and the fallback glyph ride the saturated disc — the kit's
  // glyph-fill pairing, legible on every tone including yellow and lime.
  const solid = kind === "initials" || (kind === "fallback" && !showWash);

  const name = item.name ?? (label || fallbackName);
  const artwork = (
    <>
      <span
        aria-hidden="true"
        className={classNames(
          "absolute inset-0 scale-100 opacity-0 transition duration-200 ease-out",
          "group-hover:scale-[1.45] group-hover:opacity-40",
          // The dot step (500/400) at 40%, the ColorSwatch hover grammar —
          // the saturated step is the only one that still reads as a glow at
          // that opacity on both schemes; the flat pad would vanish in dark.
          getTrueColorDotClass(tone),
          shape,
        )}
      />
      <span
        aria-hidden="true"
        className={classNames(
          "relative flex h-full w-full items-center justify-center overflow-hidden font-bold transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.15]",
          shape,
          // The rim lives on the disc itself, not the halo: it is what
          // separates same-tone chips where they overlap and lifts a flat
          // tone pad off a same-colored surface. Thickness is
          // what the eye detects at normal size, so it's a committed 2px.
          bordered && "border-2 border-black/25 dark:border-white/30",
          AVATAR_TEXT[size],
          solid && classNames(fill, ink),
          kind === "icon" && classNames(washInk, showWash && wash),
          kind === "fallback" && showWash && classNames(wash, washInk),
        )}
      >
        {kind === "image" && (
          <>
            {/* Under the art, so transparent logos and PNGs sit on the tone. */}
            {showWash && (
              <span
                aria-hidden="true"
                className={classNames("absolute inset-0", wash, shape)}
              />
            )}
            <img
              src={src ?? undefined}
              // Decorative: the wrapper carries the accessible name, so the
              // img must not announce the person twice.
              alt=""
              loading="lazy"
              className={classNames(
                "relative h-full w-full object-cover",
                shape,
              )}
              // A DOM `onError` in the root's spread still lands on the
              // wrapper and React bubbles the img error to it — the
              // UserAvatar `@error` parity.
              onError={() => setHasError(true)}
            />
          </>
        )}
        {kind === "icon" && renderIcon(item.icon, size)}
        {kind === "fallback" && (
          <span aria-hidden="true">{renderIcon("User", "xs")}</span>
        )}
        {kind === "initials" && (
          <span className="max-w-full truncate leading-none">{label}</span>
        )}
      </span>
    </>
  );

  // With a handler the chip is a real button — Enter/Space and a tone focus
  // ring included — not a span only the mouse can reach, the UserAvatar
  // parity.
  const shell = classNames(
    "group relative inline-flex shrink-0 items-center justify-center p-0 hover:z-10",
    shape,
    item.onClick &&
      classNames(
        "cursor-pointer appearance-none border-0 bg-transparent text-inherit",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        `focus-visible:ring-${tone}-400`,
      ),
  );
  const box: React.CSSProperties = { width: px, height: px };

  const chipElement = item.onClick ? (
    <button
      type="button"
      aria-label={name}
      // Condensed chips sit zero-width behind the +N: no tab stop.
      tabIndex={hidden ? -1 : 0}
      onClick={item.onClick}
      className={shell}
      style={box}
    >
      {artwork}
    </button>
  ) : (
    <span
      role="img"
      aria-label={name}
      className={shell}
      style={box}
    >
      {artwork}
    </span>
  );

  // The name the accessible label already carries, surfaced on dwell in the
  // kit's own surface instead of the browser's `title` — the chip gains the
  // panel chrome, the arrow that ties it to this 32 px circle, and the flip
  // that keeps it on screen. No new tab stops: a panel holding text a screen
  // reader already announces is an affordance for the pointer, like the
  // `title` it replaces, not a control the keyboard is missing.
  return (
    <Popover
      trigger={chipElement}
      visible={open}
      onOpenChange={requestOpen}
      triggerMode="hover"
      placement="top"
      variant="elevated"
      padding="xs"
      maxWidth={240}
    >
      <span className="text-xs font-medium leading-normal">{name}</span>
    </Popover>
  );
};

// ── The toggle ────────────────────────────────────────────────────────────────

/**
 * The `+N`⇄`×` control. The `+` tilts into a `×` while open, one control in
 * both directions (`aria-expanded`). Presentational: the group places it
 * inline (natural unfold, condensed stack) or pinned to the scroll edge, and
 * passes the geometry that differs between those placements.
 */
const ToggleChip = ({
  expanded,
  hiddenCount,
  onToggle,
  regionId,
  style,
  className,
}: {
  expanded: boolean;
  hiddenCount: number;
  onToggle: React.MouseEventHandler<HTMLButtonElement>;
  regionId: string;
  style: React.CSSProperties;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-expanded={expanded}
    aria-controls={regionId}
    aria-label={
      expanded
        ? "Collapse avatars"
        : hiddenCount > 0
          ? `Show ${hiddenCount} more avatars`
          : "Expand avatars"
    }
    className={classNames(
      "inline-flex shrink-0 items-center justify-center gap-0.5 rounded-full px-1.5",
      "bg-neutral-100 text-[11px] font-medium text-neutral-600 transition-colors hover:bg-neutral-200",
      "dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
      className,
    )}
    style={style}
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
);

// ── The group ─────────────────────────────────────────────────────────────────

/**
 * Identities on display: a strip of avatar chips — photos, icons or initials
 * discs, each in its own tone or the group's — condensed into an overlapping
 * stack with a `+N` chip whenever the count (or the width) outgrows the row,
 * and expanded by *unfolding*: the stacked chips spread apart, the rest pop
 * in one by one, the strip grows exactly as far as the new lines need. One
 * layout, clipped or whole; nothing replaces anything — the same unfold the
 * colour swatches do, at avatar scale.
 */
export const AvatarGroup = ({
  items,
  size = "md",
  tone = "blue",
  rounded = "full",
  border = true,
  maxVisible = 5,
  expandOn = "click",
  defaultExpanded = false,
  singleRow = false,
  padding = "none",
  className = "",
  ...rest
}: AvatarGroupProps) => {
  const t = useKitT();
  const regionId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(defaultExpanded);
  // The retract mirrors the unfold: the expanded layout is held while the
  // chips step away right to left, and the condensed geometry commits only
  // when the hold ends — same as the swatches.
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

  const count = items.length;
  if (count === 0) return null;

  const limit = Number.isFinite(maxVisible)
    ? Math.max(1, Math.floor(maxVisible))
    : 5;
  const chipPx = AVATAR_PX[size];
  const gapPx = GAP_PX[size];
  const overlapPx = Math.round(chipPx * OVERLAP_RATIO);
  const stepPx = chipPx - overlapPx;
  const padPx = Math.round(chipPx * PAD_RATIO);

  // Too narrow, too many — the two ways a strip condenses. A width of 0
  // means unmeasured (jsdom), where only the count rule can apply.
  const availablePx = width - padPx * 2;
  const fullRowPx = count * chipPx + (count - 1) * gapPx;
  const fitsAll = width === 0 || availablePx >= fullRowPx;
  const condense = !fitsAll || count > limit;
  const widthFits = !fitsAll
    ? Math.max(1, Math.floor((availablePx - PLUS_PX + stepPx) / stepPx))
    : count;
  const visibleCount = condense
    ? Math.min(count, limit, widthFits)
    : count;
  const layoutOpen = expanded || collapsing;
  const hiddenCount = layoutOpen ? 0 : count - visibleCount;

  // The clip animates between exactly one wrapping line and the measured
  // height of the laid-out whole.
  const rowPx = padPx * 2 + chipPx + gapPx;
  const clipStyle: React.CSSProperties = {
    overflow: "hidden",
    maxHeight: layoutOpen
      ? contentH > 0
        ? `${contentH}px`
        : "none"
      : `${rowPx}px`,
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
    expanded ? index * CASCADE_MS : (count - 1 - index) * RETRACT_MS;

  const chipStyle = (
    index: number,
    hidden: boolean,
    leading: boolean,
    order?: number,
  ): React.CSSProperties => ({
    // Hidden chips keep their slot in the flow but zero their width, so the
    // clip shows a short condensed line while their layout never moves.
    width: hidden && !collapsing ? 0 : undefined,
    minWidth: hidden && !collapsing ? 0 : undefined,
    // In the scrolling row a zero-width chip's leftover margin would still
    // scroll — an empty lane after the last chip. The steady-collapsed ones
    // pay their margin back; the collapsing ones keep it until the hold ends.
    marginRight:
      hidden && singleRow && !collapsing
        ? "0px"
        : hidden || layoutOpen || !condense
          ? `${gapPx}px`
          : leading
            ? `${-overlapPx}px`
            : `${gapPx}px`,
    // A single row has no second line for a bottom margin to space; the
    // natural unfold needs it to separate the wrap lines.
    marginBottom: singleRow ? 0 : `${gapPx}px`,
    order,
    transition: `width 0s, margin-right ${expanded ? 200 : 150}ms ease-out, transform 200ms ease-out, opacity 200ms ease-out`,
    transitionDelay: `0ms, ${expanded ? `${index * CASCADE_MS}ms` : "0ms"}, ${cascadeMs(index)}ms, ${cascadeMs(index)}ms`,
    transform: hidden ? "scale(0)" : "scale(1)",
    opacity: hidden ? 0 : 1,
  });

  const fallbackName = t("kit.useravatar.fallback");

  const chip = (item: AvatarGroupItem, index: number, hidden: boolean, order?: number) => (
    <span
      key={`${item.name ?? item.initials ?? item.image ?? item.icon ?? "chip"}-${index}`}
      className={classNames("flex shrink-0 items-center", hidden && "overflow-hidden")}
      style={chipStyle(index, hidden, !order, order)}
    >
      <Chip
        item={item}
        tone={item.tone ?? tone}
        size={size}
        rounded={rounded}
        bordered={border}
        hidden={hidden}
        expanded={expanded}
        fallbackName={fallbackName}
      />
    </span>
  );

  // ── singleRow: one row when expanded, scroll sideways to reach the rest ──
  if (singleRow) {
    const rowPx = padPx * 2 + chipPx; // the fixed one-row viewport
    // Edge-fade standing room. The mask reaches `SCROLLAREA_MASK_FADE_PX`
    // into the content, so when the row scrolls its ends push the first and
    // last chip to land just outside that reach — right past the blur, not
    // a whole chip clear of it. A row that fits keeps the plain content
    // padding, with no fade to dodge; the right pad pays ScrollArea's own
    // lane gutter back, so both ends guard the same distance.
    const edgeGuard =
      !fitsAll && layoutOpen ? SCROLLAREA_MASK_FADE_PX - padPx : 0;
    // The condensed line: leading chips overlap, the inline `+N` pays the
    // ride-over back and hugs the last one, the rest sit zero-width (and
    // zero-margin, so they add no scroll) behind it.
    const inlineToggle = condense && !layoutOpen && (
      <ToggleChip
        expanded={false}
        hiddenCount={count - visibleCount}
        onToggle={toggle}
        regionId={regionId}
        style={{
          height: Math.max(chipPx, 18),
          marginLeft: `${overlapPx + gapPx}px`,
          order: 1,
        }}
      />
    );
    return (
      <div
        {...rest}
        ref={rootRef}
        className={classNames(
          "relative flex items-center",
          getSurfacePaddingClass(padding),
          className,
        )}
        data-expanded={expanded ? "" : undefined}
        onPointerEnter={(event) => {
          if (expandOn === "hover" && condense) reveal(true);
          rest.onPointerEnter?.(event);
        }}
        onPointerLeave={(event) => {
          if (expandOn === "hover" && expanded) reveal(false);
          rest.onPointerLeave?.(event);
        }}
      >
        <ScrollArea
          horizontal
          mask
          className="min-w-0 flex-1"
          // `h-full` on the content, and the row's `h-full` + items-center
          // land on it: without it the row is only as tall as a chip and
          // sits at the top of the taller viewport — chips off the pinned
          // toggle's centre by the viewport's vertical padding.
          contentClassName="h-full"
          style={{ height: rowPx }}
        >
          <div
            ref={contentRef}
            id={regionId}
            role="group"
            aria-label="Avatars"
            className="flex h-full items-center"
            style={{
              paddingLeft: padPx + edgeGuard,
              // ScrollArea's lane gutter sits past all content, so the
              // right guard pays it back to match the left one.
              paddingRight: Math.max(
                0,
                padPx + edgeGuard - SCROLLAREA_LANE_PX,
              ),
            }}
          >
            {items
              .slice(0, visibleCount)
              .map((item, index) => chip(item, index, false))}
            {inlineToggle}
            {items
              .slice(visibleCount)
              .map((item, offset) =>
                chip(item, visibleCount + offset, !expanded, 2),
              )}
          </div>
        </ScrollArea>
        {condense && layoutOpen && (
          // Pinned outside the scroller: a collapse control that scrolls
          // off-screen is a promise the strip cannot keep.
          <ToggleChip
            expanded={expanded}
            hiddenCount={hiddenCount}
            onToggle={toggle}
            regionId={regionId}
            style={{
              height: Math.max(chipPx, 18),
              width: Math.max(chipPx, 18),
              paddingLeft: 0,
              paddingRight: 0,
              marginLeft: gapPx,
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      {...rest}
      ref={rootRef}
      className={classNames(
        "relative",
        getSurfacePaddingClass(padding),
        className,
      )}
      data-expanded={expanded ? "" : undefined}
      onPointerEnter={(event) => {
        if (expandOn === "hover" && condense) reveal(true);
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
          aria-label="Avatars"
          className="flex flex-wrap items-start"
          style={{ padding: `${padPx}px` }}
        >
          {items.slice(0, visibleCount).map((item, index) => chip(item, index, false))}
          {condense && (
            <ToggleChip
              expanded={expanded}
              hiddenCount={hiddenCount}
              onToggle={toggle}
              regionId={regionId}
              className="self-start"
              style={{
                height: Math.max(chipPx, 18),
                // A lone `+` wants a circle, not a tall pill; the count
                // earns the pill back.
                width: expanded ? `${Math.max(chipPx, 18)}px` : undefined,
                paddingLeft: expanded ? 0 : undefined,
                paddingRight: expanded ? 0 : undefined,
                // The last visible chip rides over by one overlap when
                // condensed — the +N pays that back.
                marginLeft:
                  !layoutOpen && condense ? `${overlapPx + gapPx}px` : 0,
                order: layoutOpen ? 3 : 1,
                marginBottom: `${gapPx}px`,
              }}
            />
          )}
          {items
            .slice(visibleCount)
            .map((item, offset) => chip(item, visibleCount + offset, !expanded, 2))}
        </div>
      </div>
    </div>
  );
};

AvatarGroup.displayName = "AvatarGroup";

export default AvatarGroup;
