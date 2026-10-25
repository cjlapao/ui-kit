import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { warnIfMissingTitle } from "../../../common/a11y/warn";
import { NOISE_BACKGROUND_IMAGE, getNoiseBlendClasses } from "../../../common/theme/noise";
import IconButton from "./IconButton";
import Panel, {
  type PanelProps,
  type PanelSpecularMode,
  variantBaseStyles,
} from "./Panel";
import { CollapseToggleButton } from "./CollapseToggleButton";
import { IconSize } from "../types";
import { useKitT } from "../i18n";
import {
  COLLAPSED_RAIL_WIDTH,
  DEFAULT_SURFACE_CORNER,
  PANEL_SLIDE_DURATION_MS,
  PANEL_SLIDE_EASING,
  getSurfaceCornerClass,
  getSidebarSurfaceTokens,
  getPanelToneStyles,
  getSurfaceTextTokens,
  type ControlSize,
  type SidebarVariant,
  type SurfaceVariant,
  type SurfaceCorner,
  type SurfacePadding,
  type TrueColor,
} from "../theme/Theme";

/** Shared with Panel and WorkflowTrackerRail. Legacy sidebar names remain accepted. */
export { SURFACE_VARIANTS as SIDE_PANEL_VARIANTS } from "../theme/Theme";
export type SidePanelVariant = SurfaceVariant | SidebarVariant;

const LEGACY_PANEL_VARIANTS = {
  sidebar: "elevated",
  inset: "tonal",
  floating: "elevated",
  "floating-glass": "glass",
} as const;

const resolvePanelVariant = (variant: SidePanelVariant): SurfaceVariant =>
  variant in LEGACY_PANEL_VARIANTS
    ? LEGACY_PANEL_VARIANTS[variant as keyof typeof LEGACY_PANEL_VARIANTS]
    : (variant as SurfaceVariant);

export const getSidePanelTextTokens = (variant: SidePanelVariant) =>
  getSurfaceTextTokens(resolvePanelVariant(variant));

/**
 * Vertical gap for an inset panel. All of the float comes from here: the panel
 * stays flush against the edge it is docked to, because a gap on *that* edge
 * reads as the panel having come loose rather than as a card lifting off the
 * container. A first attempt split the gap across both and the edge side was
 * simply too small to notice.
 *
 * Per `inset` size: `y` for a left/right overlay, `x` for a top/bottom one,
 * and the matching padding for a docked panel's wrapper. `md` (16px) is what
 * `inset={true}` and the floating variants have always used.
 */
const INSET_GAP: Record<ControlSize, { x: string; y: string; px: string; py: string }> = {
  xs: { x: "inset-x-1", y: "inset-y-1", px: "px-1", py: "py-1" },
  sm: { x: "inset-x-2", y: "inset-y-2", px: "px-2", py: "py-2" },
  md: { x: "inset-x-4", y: "inset-y-4", px: "px-4", py: "py-4" },
  lg: { x: "inset-x-6", y: "inset-y-6", px: "px-6", py: "py-6" },
  xl: { x: "inset-x-8", y: "inset-y-8", px: "px-8", py: "py-8" },
};

/** Rules on the edges you can see — never the one against the container. */
const INSET_BORDER = {
  right: "border-y border-l",
  left: "border-y border-r",
  top: "border-x border-b",
  bottom: "border-x border-t",
} as const;
const FLUSH_BORDER = {
  right: "border-l",
  left: "border-r",
  top: "border-b",
  bottom: "border-t",
} as const;

/**
 * Only the corners facing the content are rounded — the two on the docked edge
 * meet the container and have nothing to round against.
 *
 * The scale is the kit's shared `SurfaceCorner`, the same one `Panel` takes,
 * so a panel and a side panel are described in one vocabulary and land on the
 * same radii. The values mirror `surfaceCornerClasses` exactly; they are
 * written out per side rather than composed because Tailwind only sees class
 * names it can read literally in the source.
 */
/**
 * The resize line's inset along its edge — each corner's radius (sm 4px, lg
 * 8px, 2xl 16px, 3xl 24px, 4xl 32px), so the line meets the corner where its
 * curve begins. `y` for left/right panels, `x` for top/bottom.
 */
const BAR_INSET: Record<Exclude<SurfaceCorner, "auto">, { x: string; y: string }> = {
  none: { x: "inset-x-0", y: "inset-y-0" },
  rounded: { x: "inset-x-1", y: "inset-y-1" },
  "rounded-sm": { x: "inset-x-2", y: "inset-y-2" },
  "rounded-md": { x: "inset-x-4", y: "inset-y-4" },
  "rounded-lg": { x: "inset-x-6", y: "inset-y-6" },
  "rounded-xl": { x: "inset-x-8", y: "inset-y-8" },
};

const INNER_CORNER: Record<
  Exclude<SurfaceCorner, "auto">,
  Record<SidePanelSide, string>
> = {
  // (`"auto"` is absent by design: SidePanel's own default is `rounded`, and
  // corner lookups below resolve it to the theme default.)
  none: { right: "", left: "", top: "", bottom: "" },
  rounded: { right: "rounded-l-sm", left: "rounded-r-sm", top: "rounded-b-sm", bottom: "rounded-t-sm" },
  "rounded-sm": { right: "rounded-l-lg", left: "rounded-r-lg", top: "rounded-b-lg", bottom: "rounded-t-lg" },
  "rounded-md": { right: "rounded-l-2xl", left: "rounded-r-2xl", top: "rounded-b-2xl", bottom: "rounded-t-2xl" },
  "rounded-lg": { right: "rounded-l-3xl", left: "rounded-r-3xl", top: "rounded-b-3xl", bottom: "rounded-t-3xl" },
  "rounded-xl": { right: "rounded-l-4xl", left: "rounded-r-4xl", top: "rounded-b-4xl", bottom: "rounded-t-4xl" },
};

/**
 * Which edge the panel is docked to. `top` and `bottom` run the same motion on
 * the height axis: they open from the edge, fold to their header when
 * collapsed, and resize from the edge facing the content.
 */
export const SIDE_PANEL_SIDES = ["left", "right", "top", "bottom"] as const;
export type SidePanelSide = (typeof SIDE_PANEL_SIDES)[number];
/** @deprecated Every side now works docked and as an overlay; use `SidePanelSide`. */
export type SidePanelDockSide = SidePanelSide;

/**
 * Header padding and type scale, from the shared control scale. Both were
 * fixed at the `md` values, so a compact panel and a roomy one were the same
 * panel.
 */
/** Open/collapse timing — the kit's shared panel curve (see `PANEL_SLIDE_EASING`). */
const OPEN_DURATION_MS = PANEL_SLIDE_DURATION_MS;
const OPEN_EASING = PANEL_SLIDE_EASING;

const SIZE_TOKENS: Record<
  ControlSize,
  {
    pad: string;
    title: string;
    subtitle: string;
    icon: IconSize;
  }
> = {
  xs: {
    pad: "px-2 py-1.5",
    title: "text-xs",
    subtitle: "text-[10px]",
    icon: "xs",
  },
  sm: {
    pad: "px-3 py-2",
    title: "text-xs",
    subtitle: "text-[11px]",
    icon: "xs",
  },
  md: {
    pad: "px-4 py-3",
    title: "text-sm",
    subtitle: "text-xs",
    icon: "sm",
  },
  lg: {
    pad: "px-5 py-3.5",
    title: "text-base",
    subtitle: "text-sm",
    icon: "sm",
  },
  xl: {
    pad: "px-6 py-4",
    title: "text-lg",
    subtitle: "text-sm",
    icon: "md",
  },
};


export interface SidePanelProps {
  /** Whether the panel is open */
  isOpen: boolean;
  /**
   * Sit in normal flow (for example a `PageBodyLayout` zone) instead of
   * overlaying the container. The panel keeps its own size, collapse
   * animation and resize handle; the space around it follows. Left/right
   * fill the parent's height, `bottom` its width.
   */
  docked?: boolean;
  /**
   * Called when the user clicks the close button (or the overlay scrim). A
   * `collapsible` panel shows no close button — it collapses and expands
   * instead.
   */
  onClose?: () => void;
  /** Panel title */
  title?: React.ReactNode;
  /** Secondary line rendered below the title */
  subtitle?: React.ReactNode;
  /** Width of the panel in px (default: 420) */
  width?: number;
  /** Height in px of a `top` / `bottom` panel. @default 240 */
  height?: number;
  /** Minimum height in px of a resizable `top` / `bottom` panel. @default 120 */
  minHeight?: number;
  /** Maximum height in px of a resizable `top` / `bottom` panel. @default 600 */
  maxHeight?: number;
  /** Optional icon rendered to the left of the title */
  icon?: React.ReactNode;
  /** Extra nodes rendered in the header next to the close button */
  headerActions?: React.ReactNode;
  /** Sticky footer rendered at the bottom of the panel */
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  closeIconSize?: IconSize;
  /** Allow the user to drag the left edge to resize the panel. @default false */
  resizable?: boolean;
  /** Minimum width in px when resizable. @default 280 */
  minWidth?: number;
  /** Maximum width in px when resizable. @default 900 */
  maxWidth?: number;
  /**
   * Accent for the resize handle. The header's close / collapse buttons stay
   * neutral — chrome, not a call to action.
   */
  tone?: TrueColor;
  /** @deprecated Use `tone`, which is what every other component calls it. */
  color?: TrueColor;
  /** Shared Panel surfaces; legacy sidebar names also accepted. @default "outlined" */
  variant?: SidePanelVariant;
  /** Glass fill opacity, matching Panel. @default "frosted" */
  glassOpacity?: PanelProps["glassOpacity"];
  /** Backdrop vibrancy, matching Panel. */
  vibrancy?: PanelProps["vibrancy"];
  /** Highlight treatment for translucent surfaces. */
  specularMode?: PanelSpecularMode;
  /**
   * Detach the panel from its container's edges, so it reads as a floating
   * card rather than a wall: a gap on the two edges beside the docked one —
   * top/bottom for a left/right panel, left/right for a top/bottom one — so
   * the panel is a little shorter (or narrower) than its container. Works
   * docked and as an overlay. `true` is `md` (16px); a size picks the gap
   * from the shared padding scale; `false` / `"none"` sits flush.
   *
   * Defaults to whatever the variant implies — `floating` and `floating-glass`
   * carry an offset in their own tokens, exactly as they do on `SideMenu`, so
   * they are inset unless you say otherwise. Everything else sits flush.
   */
  inset?: boolean | SurfacePadding;
  /**
   * Corner size, applied to the two corners facing the content. The shared
   * `SurfaceCorner` scale `Panel` takes, so the two land on the same radii.
   * `"auto"` resolves to the theme's container corner (`rounded-md`).
   * @default "rounded-md" (`DEFAULT_SURFACE_CORNER`)
   */
  corner?: SurfaceCorner;
  /**
   * Tone of the *surface*, separate from the accent. Kept apart for the same
   * reason as everywhere else: an accent that matches its own background has
   * nothing to stand out against.
   * @default "neutral"
   */
  surfaceTone?: TrueColor;
  /** Header padding and type scale. @default "md" */
  size?: ControlSize;
  /** Which edge to dock to. @default "right" */
  side?: SidePanelSide;
  /**
   * Dim the rest of the container while open: a backdrop that fades in with
   * the panel, swallows everything behind it, and closes the panel on click
   * (the same scrim `SideMenu` paints for its off-canvas state).
   *
   * The panel is `position: absolute`, so the backdrop dims its container's
   * box, not the viewport — the page-owning, scroll-locking, focus-trapping
   * version of this is `Modal`'s job.
   * @default false
   */
  overlay?: boolean;
  /**
   * Paint a subtle dither-noise (film-grain) texture over the panel
   * background, behind the content. Works in both light and dark mode
   * (multiply blend in light, overlay in dark — the same dither SideMenu
   * paints). @default false
   */
  noise?: boolean;
  /**
   * Let the user fold the panel to a rail: a chevron in the header collapses
   * it to `COLLAPSED_RAIL_WIDTH` (the WorkflowTracker rail's width), showing
   * an expand chevron and the title running vertically. A `top` / `bottom`
   * panel folds to a strip that tall, with the chevron and title laid along
   * it. @default false
   */
  collapsible?: boolean;
  /** Controlled collapse state; only applies when `collapsible`. */
  collapsed?: boolean;
  /** Initial uncontrolled collapse state. @default false */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** The vertical text of the collapsed rail. @default the `title` */
  collapsedLabel?: React.ReactNode;
  /**
   * Key handler on the panel body. Exists so a consumer can add Escape-to-close
   * without wrapping the content in another element — the header sits inside
   * the panel, so a wrapper around `children` alone would miss keys pressed
   * while the close button has focus.
   */
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
}

/**
 * SidePanel — slides in from any edge as an overlay inside its container.
 *
 * It is `position: absolute`, so it needs a positioned ancestor and fills that
 * box rather than the viewport. (The docstring used to claim `fixed`, which it
 * has never been.) Because it overlays rather than occupying a column, opening
 * it never reflows the content beside it.
 *
 * ```tsx
 * <SidePanel isOpen={open} onClose={() => setOpen(false)} title="Details">
 *   …detail content…
 * </SidePanel>
 * ```
 */
export const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  docked = false,
  onClose,
  title,
  subtitle,
  icon,
  width = 420,
  height = 240,
  minHeight = 120,
  maxHeight = 600,
  headerActions,
  footer,
  children,
  className,
  closeIconSize,
  resizable = false,
  minWidth = 280,
  maxWidth = 900,
  tone,
  color,
  variant = "outlined",
  glassOpacity,
  vibrancy,
  specularMode,
  surfaceTone = "neutral",
  size = "md",
  side = "right",
  overlay = false,
  noise = false,
  inset,
  corner = DEFAULT_SURFACE_CORNER,
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  collapsedLabel,
  onKeyDown,
}) => {
  const t = useKitT();
  // a11y (P1-2): an unnamed panel is an unidentifiable landmark/region.
  warnIfMissingTitle("SidePanel", title);
  // Top and bottom panels animate, collapse and resize on the height axis.
  const vertical = side === "top" || side === "bottom";
  const effectiveTone = tone ?? color ?? "neutral";
  const sizeToken = SIZE_TOKENS[size] ?? SIZE_TOKENS.md;
  const legacyVariant = variant in LEGACY_PANEL_VARIANTS;
  const panelVariant = resolvePanelVariant(variant);
  // Shadows/rings belong outside the clipping shell; the decorative Panel
  // supplies the fill, border, blur and highlights inside its rounded bounds.
  const panelOuterChrome = classNames(
    variantBaseStyles[panelVariant]
      .split(" ")
      .filter((token) => /^(dark:)?(shadow|ring)-/.test(token)),
    panelVariant === "liquid-glass" && getPanelToneStyles(surfaceTone).liquidShadow,
  );
  const surface = getSidebarSurfaceTokens(
    legacyVariant ? (variant as SidebarVariant) : "sidebar",
    surfaceTone,
  );
  const surfaceText = getSidePanelTextTokens(variant);
  // `offset` is how SideMenu marks a detached variant, so it is the honest
  // default for "should this float?" rather than a second list to keep in sync.
  const insetValue = inset ?? surface.offset !== "";
  const insetSize: ControlSize | null =
    insetValue === true ? "md" : insetValue === false || insetValue === "none" ? null : insetValue;
  const isInset = insetSize !== null;
  const insetGap = insetSize ? INSET_GAP[insetSize] : null;
  // Docked, the panel is a card in its own region with nothing flush against
  // it, so every corner rounds — the same shape as the WorkflowTracker rail.
  const cornerClass = docked
    ? getSurfaceCornerClass(corner)
    : INNER_CORNER[corner === "auto" ? DEFAULT_SURFACE_CORNER : corner][side];
  // Inset outlines the three edges you can actually see; the docked one is
  // still flush against the container, so a rule there would double up with
  // whatever the container draws.
  const borderClass = surface.border
    ? `${surface.border} ${
        docked
          ? "border"
          : isInset
          ? INSET_BORDER[side]
          : surface.borderSides === "all"
            ? "border"
            : FLUSH_BORDER[side]
      }`
    : "";
  const shadowClass = side === "right" ? surface.shadowRight : surface.shadow;
  // Mount immediately on open so the opening animation can play.
  // Unmount only after the closing animation finishes (onTransitionEnd).
  const [mounted, setMounted] = useState(isOpen);
  /**
   * Whether the panel has *finished* arriving, which is what drives its width.
   *
   * Opening used to snap. `mounted` and `isOpen` both became true in the same
   * render, so the element was inserted already at its full width — there was
   * no 0-width frame for the transition to start from. Closing looked right
   * only because the element was already mounted and wide, so the width change
   * had somewhere to animate from.
   *
   * Starting at `isOpen` means a panel that is open on first render appears
   * immediately, which is correct: there is nothing to animate into.
   */
  const [entered, setEntered] = useState(isOpen);
  const prevOpenRef = useRef(isOpen);

  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = isOpen;

    if (isOpen && !wasOpen) setMounted(true);
    if (!isOpen && wasOpen) setEntered(false);
  }, [isOpen]);

  /*
   * The Vue/PrimeVue `useOverlayShow` technique, which is where this stopped
   * racing: insert the shell at its 0-width state, force the browser to
   * *compute* that state once — reading `offsetWidth` is the synchronisation
   * point — then flip to the target width in the same frame. A transition
   * needs two computed styles, not two painted frames, so this cannot miss.
   *
   * The handoff used to be `requestAnimationFrame`, and it raced React's
   * scheduler: when the rAF fired before React had committed the 0-width
   * element at all, the first style the browser ever computed *was* the
   * target width — and a fresh element never transitions from its own initial
   * style. That was the snap: open teleported while close, whose element was
   * already mounted and already had a computed width to animate away from,
   * looked perfect.
   */
  const shellRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (mounted && isOpen && !entered) {
      // Force the browser to compute the 0-width state *now* — this is the
      // half that fixes the race: by the time the rAF below fires, the
      // element exists with a computed starting style to transition from,
      // whatever order the scheduler picks. The hand-off then flips on the
      // following frame, as before.
      void shellRef.current?.offsetWidth;
      const frame = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(frame);
    }
    return undefined;
  }, [mounted, isOpen, entered]);

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    // transitionend bubbles: the resize handle's opacity fade would otherwise
    // unmount the panel mid-close.
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== (vertical ? "height" : "width")) return;
    if (!isOpen) setMounted(false);
  };

  // ── Resizing ──────────────────────────────────────────────────────────────
  const [currentWidth, setCurrentWidth] = useState(width);
  const [currentHeight, setCurrentHeight] = useState(height);
  const isDraggingRef = useRef(false);
  /**
   * Mirrors `isDraggingRef` for rendering. The ref is what the mouse handlers
   * and the width-sync effect read (they run outside React's cycle and need
   * the current value), but a ref change re-renders nothing — so the grip's
   * pressed styling never appeared until an unrelated update flushed it.
   */
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  // Keep currentWidth in sync if the width prop changes while not dragging
  useEffect(() => {
    if (!isDraggingRef.current) setCurrentWidth(width);
  }, [width]);
  useEffect(() => {
    if (!isDraggingRef.current) setCurrentHeight(height);
  }, [height]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!resizable) return;
      e.preventDefault();
      isDraggingRef.current = true;
      setIsDragging(true);
      startXRef.current = vertical ? e.clientY : e.clientX;
      startWidthRef.current = vertical ? currentHeight : currentWidth;

      const onMouseMove = (ev: MouseEvent) => {
        // A bottom panel grows as the pointer moves up, a top one as it moves down.
        if (vertical) {
          const delta =
            side === "bottom"
              ? startXRef.current - ev.clientY
              : ev.clientY - startXRef.current;
          setCurrentHeight(
            Math.min(maxHeight, Math.max(minHeight, startWidthRef.current + delta)),
          );
          return;
        }
        // A right-docked panel grows as the pointer moves left; a left-docked
        // one grows as it moves right. The delta was hardcoded for the right,
        // so resizing a left panel ran backwards.
        const delta =
          side === "right"
            ? startXRef.current - ev.clientX
            : ev.clientX - startXRef.current;
        const next = Math.min(
          maxWidth,
          Math.max(minWidth, startWidthRef.current + delta),
        );
        setCurrentWidth(next);
      };
      document.body.style.userSelect = "none";
      document.body.style.cursor = vertical ? "row-resize" : "col-resize";
      const onMouseUp = () => {
        isDraggingRef.current = false;
        setIsDragging(false);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [resizable, vertical, currentWidth, currentHeight, minWidth, maxWidth, minHeight, maxHeight, side],
  );

  const resolvedWidth = resizable ? currentWidth : width;
  const resolvedHeight = resizable ? currentHeight : height;

  // ── Collapsing ────────────────────────────────────────────────────────────
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = collapsible && (collapsed ?? internalCollapsed);
  const toggleCollapsed = () => {
    const next = !isCollapsed;
    if (collapsed === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };
  // What the shell is drawn at once open: the rail, or the panel's width.
  const shellWidth = isCollapsed ? COLLAPSED_RAIL_WIDTH : resolvedWidth;
  // Top/bottom fold to a strip as tall as the side rail is wide.
  const shellHeight = isCollapsed ? COLLAPSED_RAIL_WIDTH : resolvedHeight;
  // The kit's one collapse toggle (shared with the WorkflowTracker rail), at
  // the close button's size so it takes its place exactly.
  const collapseButton = (label: string) => (
    <CollapseToggleButton
      collapsed={isCollapsed}
      edge={side}
      size={closeIconSize ?? sizeToken.icon}
      onClick={toggleCollapsed}
      aria-label={label}
    />
  );

  // Keyboard resize (WCAG 2.1.1) so the separator is not pointer-only. The
  // directions mirror the mouse drag: a right-docked panel grows on
  // ArrowLeft (pointer moves left), a left-docked one grows on ArrowRight.
  const onSeparatorKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!resizable) return;
      const step = 20;
      // Arrows mirror the pointer: the key pointing away from the docked
      // edge grows the panel.
      const growKey = { right: "ArrowLeft", left: "ArrowRight", bottom: "ArrowUp", top: "ArrowDown" }[side];
      const shrinkKey = { right: "ArrowRight", left: "ArrowLeft", bottom: "ArrowDown", top: "ArrowUp" }[side];
      const grow = e.key === growKey;
      const shrink = e.key === shrinkKey;
      const [min, max, current, set] = vertical
        ? [minHeight, maxHeight, currentHeight, setCurrentHeight]
        : [minWidth, maxWidth, currentWidth, setCurrentWidth];
      if (e.key === "Home") {
        e.preventDefault();
        set(min);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        set(max);
        return;
      }
      if (!grow && !shrink) return;
      e.preventDefault();
      set(Math.min(max, Math.max(min, current + (grow ? step : -step))));
    },
    [resizable, vertical, side, currentWidth, currentHeight, minWidth, maxWidth, minHeight, maxHeight],
  );

  if (!mounted || (docked && !isOpen)) return null;

  // The handle rides the panel's outer edge, so it tracks the same value the
  // width animates to — and carries the same transition, or it would jump to
  // its final position while the panel was still opening.
  const edgeOffset = entered ? (vertical ? shellHeight : shellWidth) : 0;
  // The resize bar and the grip's active layer share one paint: hover reveals
  // it, dragging deepens the tone as well as the opacity, so "grabbed" reads
  // differently from "pointer happens to be here".
  const barTone = isDragging
    ? `opacity-100 bg-${effectiveTone}-500`
    : `bg-${effectiveTone}-400 opacity-0 group-hover:opacity-70 group-active:opacity-100`;
  // The grip is solid in every state: same paint as the bar, at full strength.
  const gripTone = isDragging
    ? `opacity-100 bg-${effectiveTone}-500`
    : `bg-${effectiveTone}-400 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100`;
  // The handle sits on the panel's inner edge: offset from the docked edge by
  // the panel's own size, so the CSS property is simply the side.
  const edgeProperty = side;
  const handleStyle: React.CSSProperties = {
    [edgeProperty]: edgeOffset,
    transition: isDragging
      ? undefined
      : `${edgeProperty} ${OPEN_DURATION_MS}ms ${OPEN_EASING}, opacity ${OPEN_DURATION_MS}ms ${OPEN_EASING}`,
  };
  /*
   * Collapsed, the handle is not removed but parked: on the rail's edge,
   * invisible, out of the tab order and the accessibility tree, click-through.
   * Unmounting it made expanding look broken — the handle re-mounted already
   * at its final position (a fresh element has no earlier style to transition
   * from) while the panel edge was still sweeping out from the rail.
   */
  const handleParked = isCollapsed;

  const panel = (
    <>
      <div
        ref={shellRef}
        data-sp-shell
        data-collapsed={collapsible ? isCollapsed : undefined}
        className={classNames(
          docked
            ? classNames("relative shrink-0 overflow-hidden", vertical ? "w-full" : "h-full")
            : "absolute z-40 overflow-hidden",
          !docked &&
            (vertical
              ? insetGap ? insetGap.x : "left-0 w-full"
              : insetGap ? insetGap.y : "top-0 h-full"),
          !docked && { right: "right-0", left: "left-0", top: "top-0", bottom: "bottom-0" }[side],
          cornerClass,
          legacyVariant && borderClass,
          legacyVariant ? shadowClass : panelOuterChrome,
        )}
        style={{
          ...(vertical
            ? { height: entered ? shellHeight : 0 }
            : { width: entered ? shellWidth : 0 }),
          // Inline rather than `transition-[width] duration-… ease-…`: an
          // arbitrary easing utility would have to survive the safelist, and
          // this curve is not themeable anyway. It decelerates hard at the end,
          // which is what stops the panel feeling like it snaps into place.
          // Suppressed while resizing so the panel tracks the pointer exactly
          // rather than lagging a third of a second behind it.
          transition: isDragging
            ? undefined
            : `${vertical ? "height" : "width"} ${OPEN_DURATION_MS}ms ${OPEN_EASING}`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {/*
          Fill and blur on their own layer, carrying the radius themselves —
          the same split SideMenu uses.

          It used to sit on the content container, a square-cornered box relying
          on the shell's `overflow-hidden` to round it. A backdrop-filtered
          element does not reliably clip to a rounded ancestor: the blur paints
          into its own context and leaves a visible nick at each corner. The
          fix is for the thing being rounded to know its own radius.
        */}
        <div
          aria-hidden="true"
          data-sp-fill="true"
          className={classNames(
            "pointer-events-none absolute inset-0",
            legacyVariant && surface.fill,
            cornerClass,
          )}
        >
          {!legacyVariant && (
            <Panel
              variant={panelVariant}
              tone={surfaceTone}
              glassOpacity={glassOpacity}
              vibrancy={vibrancy}
              specularMode={specularMode}
              padding="none"
              corner="none"
              className="h-full w-full"
              style={{ borderRadius: "inherit" }}
            />
          )}
        </div>
        {/* Dither-noise layer — over the fill, under the content (which is
          `relative`), so it reads as a background grain. Multiply in light
          (overlay is a no-op on a white base), overlay in dark — the same
          dither SideMenu paints. */}
        {noise && (
          <div
            aria-hidden="true"
            data-sp-noise="true"
            className={classNames(
              "pointer-events-none absolute inset-0",
              getNoiseBlendClasses(),
              cornerClass,
            )}
            style={{ backgroundImage: NOISE_BACKGROUND_IMAGE }}
          />
        )}

        {/* Content — fixed at the target width so it never squishes during the
          width animation, it just gets clipped. Anchoring it to the edge the
          panel is docked against turns that clip into a slide: a left panel
          must hang off its own right edge, a right panel off its left (the
          default), or the reveal reads as a wipe. The same on the height
          axis: a top panel hangs off its bottom edge, a bottom panel off its
          top (the default). Transparent: the fill is the
          layer above, so header, body and footer are all rounded by one
          container instead of each having to know about corners. */}
        {/* Consumer passthrough (React.KeyboardEventHandler), not the
              panel's own interaction. */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- passthrough keyboard prop */}
        <div
          data-sp-content
          // Collapsed, the full panel stays mounted (its state survives) but
          // out of reach: inert, faded, clipped by the rail-width shell.
          inert={isCollapsed || undefined}
          aria-hidden={isCollapsed || undefined}
          className={classNames(
            "flex flex-col transition-opacity duration-200 motion-reduce:transition-none",
            side === "top" ? "absolute inset-x-0 bottom-0" : "relative h-full",
            side === "left" && "ml-auto",
            isCollapsed && "opacity-0",
            className,
          )}
          // Fixed at the target size so the content clips rather than
          // squishing while the shell animates; a bottom panel keeps its
          // header at the top as it folds.
          style={vertical ? { height: resolvedHeight } : { width: resolvedWidth }}
          onKeyDown={onKeyDown}
        >
          {/* ── Header ─────────────────────────────────────────────── */}
          <div
            className={classNames(
              "relative flex flex-none items-center justify-between gap-3",
              sizeToken.pad,
            )}
          >
            {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
            <div className="min-w-0 flex-1">
              {title && (
                <h3
                  className={classNames(
                    "truncate font-semibold",
                    sizeToken.title,
                    surfaceText.heading,
                  )}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  className={classNames(
                    "mt-0.5 truncate",
                    sizeToken.subtitle,
                    surfaceText.muted,
                  )}
                >
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1 pt-0.5">
              {collapsible &&
                collapseButton(
                  t("kit.sidepanel.collapse"),
                )}
              {headerActions}
              {onClose && !collapsible && (
                <IconButton
                  icon="Close"
                  size={closeIconSize ?? sizeToken.icon}
                  variant="ghost"
                  color="neutral"
                  onClick={onClose}
                  aria-label={t("kit.sidepanel.closeAria")}
                />
              )}
            </div>
          </div>

          {/* ── Body ───────────────────────────────────────────────── */}
          <div className="relative flex-1 min-h-0 overflow-y-auto">
            {children}
          </div>

          {/* ── Footer ─────────────────────────────────────────────── */}
          {footer && (
            <div className={classNames("relative flex-none", sizeToken.pad)}>
              {footer}
            </div>
          )}
        </div>

        {/* ── Collapsed rail — the expand chevron and the label. A side
            panel's runs down the rail with vertical text; a top/bottom
            panel's is the same pair laid along a strip. ── */}
        {isCollapsed && (
          <div
            data-sp-collapsed
            className={classNames(
              "absolute flex items-center gap-3",
              vertical
                ? "inset-x-0 top-0 flex-row px-3"
                : classNames("inset-y-0 flex-col py-3", side === "right" ? "left-0" : "right-0"),
            )}
            style={vertical ? { height: COLLAPSED_RAIL_WIDTH } : { width: COLLAPSED_RAIL_WIDTH }}
          >
            {collapseButton(t("kit.sidepanel.expand"))}
            {(collapsedLabel ?? title) && (
              <span
                data-sp-collapsed-label
                className={classNames(
                  "truncate text-xs font-semibold uppercase tracking-[0.2em]",
                  vertical ? "min-w-0" : "min-h-0 [writing-mode:vertical-rl]",
                  surfaceText.muted,
                )}
              >
                {collapsedLabel ?? title}
              </span>
            )}
          </div>
        )}
      </div>

      {/*
        The scrim sits after the panel in the DOM (z-index decides the stack,
        not order — and existing tests read `container.firstChild` as the
        panel). `aria-hidden`: it carries no content and adds no tab stop; the
        panel's own close button stays the keyboard path. Clicks anywhere on it
        close, mirroring the panel's close button so the pointer and keyboard
        stories agree.
      */}
      {overlay && !docked && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="absolute inset-0 z-30 bg-black/20 backdrop-blur-sm"
          style={{
            // A collapsed panel is a rail beside the content, not a sheet
            // over it — the scrim steps back with it.
            opacity: entered && !isCollapsed ? 1 : 0,
            // Not clickable until it has faded in: a double-click-open
            // gesture must not have its second click eaten by the scrim.
            pointerEvents: isOpen && entered && !isCollapsed ? "auto" : "none",
            transition: `opacity ${OPEN_DURATION_MS}ms ${OPEN_EASING}`,
          }}
        />
      )}

      {/* Drag handle — a sibling of the panel, not a child of it, so it can sit
          *outside* the panel edge; inside, the panel's `overflow-hidden` would
          clip anything drawn past its border.

          Shape follows SmartGridLayout's column resizer: a wide transparent hit
          area with a `rounded-full` pill inside. The pill runs nearly the full
          height because the edge is grabbed at whatever point the pointer
          happens to be at, so the affordance has to be visible there too. */}
      {resizable && (
        // ARIA 1.2 resizable separator: focusable (tabIndex), arrow keys /
        // Home / End resize, aria-valuenow|min|max report the width. Parked
        // (collapsed), it drops the role and every aria-* and leaves the tab
        // order — see `handleParked`.
        <div
          data-sp-handle
          onMouseDown={handleParked ? undefined : onMouseDown}
          onKeyDown={handleParked ? undefined : onSeparatorKeyDown}
          role={handleParked ? undefined : "separator"}
          aria-hidden={handleParked || undefined}
          aria-orientation={handleParked ? undefined : vertical ? "horizontal" : "vertical"}
          aria-label={handleParked ? undefined : t("kit.sidepanel.resize")}
          aria-valuenow={handleParked ? undefined : vertical ? resolvedHeight : resolvedWidth}
          aria-valuemin={handleParked ? undefined : vertical ? minHeight : minWidth}
          aria-valuemax={handleParked ? undefined : vertical ? maxHeight : maxWidth}
          tabIndex={handleParked ? -1 : 0}
          className={classNames(
            "group absolute z-40 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500",
            vertical ? "h-3 cursor-row-resize" : "w-3 cursor-col-resize",
            vertical
              ? insetGap ? insetGap.x : "inset-x-0"
              : insetGap ? insetGap.y : "inset-y-0",
            handleParked && "pointer-events-none opacity-0",
          )}
          style={handleStyle}
        >
          {/*
            Opacity on a solid fill, not colour alpha — the same treatment
            SplitView's resizer uses. The previous version tinted with
            `group-hover:bg-{tone}-300/60` and friends, none of which were
            safelisted, so the handle highlighted in no tone at all.
          */}
          <span
            className={classNames(
              // A hairline bar, centred on the panel edge (2px wide at -1px),
              // so the grip below sits on it as a bulge on one centre line.
              // Inset by the corner radius, so the line stops where the
              // rounded corner starts instead of running past the curve.
              "absolute rounded-full transition duration-150",
              BAR_INSET[corner === "auto" ? DEFAULT_SURFACE_CORNER : corner][vertical ? "x" : "y"],
              {
                right: "w-0.5 -right-px",
                left: "w-0.5 -left-px",
                bottom: "h-0.5 -bottom-px",
                top: "h-0.5 -top-px",
              }[side],
              barTone,
            )}
          />
          {/*
            The grip — a short pill centred on the edge, also centred on the
            bar: wider than it, so on hover it reads as a bulge on the line.
            Two stacked layers rather than hover colour classes (which would
            need safelisting per tone): a faint neutral one at rest that fades
            out, and one painted exactly like the bar that fades in with it —
            so the bulge always takes the bar's colour, and deepens with it.
          */}
          <span
            aria-hidden="true"
            data-sp-grip
            className={classNames(
              "pointer-events-none absolute",
              vertical
                ? classNames("left-1/2 h-1 w-10 -translate-x-1/2", side === "bottom" ? "-bottom-0.5" : "-top-0.5")
                : classNames("top-1/2 h-10 w-1 -translate-y-1/2", side === "right" ? "-right-0.5" : "-left-0.5"),
            )}
          >
            <span
              data-sp-grip-rest
              className={classNames(
                "absolute inset-0 rounded-full bg-neutral-300 transition-opacity duration-150 dark:bg-neutral-600",
                isDragging ? "opacity-0" : "opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0",
              )}
            />
            <span
              data-sp-grip-active
              className={classNames("absolute inset-0 rounded-full transition duration-150", gripTone)}
            />
          </span>
        </div>
      )}
    </>
  );

  // Docked, the shell and its handle share a positioned box the size of the
  // panel, so the handle rides the panel's inner edge exactly as it rides the
  // container's in the overlay case — and the zone around it sizes to it.
  return docked ? (
    <div
      data-sp-dock
      className={classNames(
        "relative flex shrink-0",
        vertical ? "w-full flex-col" : "h-full",
        // Inset docked: the gap is padding on the wrapper, so the panel is
        // shorter (narrower) than its zone; the handle matches it above.
        insetGap && (vertical ? insetGap.px : insetGap.py),
      )}
    >
      {panel}
    </div>
  ) : (
    panel
  );
};

export default SidePanel;
