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
  getSidebarSurfaceTokens,
  getPanelToneStyles,
  getSurfaceTextTokens,
  type ControlSize,
  type SidebarVariant,
  type SurfaceVariant,
  type SurfaceCorner,
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
 */
const INSET_GAP_Y_CLASS = "inset-y-4";

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
const INNER_CORNER: Record<
  Exclude<SurfaceCorner, "auto">,
  Record<SidePanelSide, string>
> = {
  // (`"auto"` is absent by design: SidePanel's own default is `rounded`, and
  // corner lookups below resolve it to the theme default.)
  none: { right: "", left: "" },
  rounded: { right: "rounded-l-sm", left: "rounded-r-sm" },
  "rounded-sm": { right: "rounded-l-lg", left: "rounded-r-lg" },
  "rounded-md": { right: "rounded-l-2xl", left: "rounded-r-2xl" },
  "rounded-lg": { right: "rounded-l-3xl", left: "rounded-r-3xl" },
  "rounded-xl": { right: "rounded-l-4xl", left: "rounded-r-4xl" },
};

/** Which edge the panel is docked to. */
export const SIDE_PANEL_SIDES = ["left", "right"] as const;
export type SidePanelSide = (typeof SIDE_PANEL_SIDES)[number];

/**
 * Header padding and type scale, from the shared control scale. Both were
 * fixed at the `md` values, so a compact panel and a roomy one were the same
 * panel.
 */
/**
 * Width animation. 300ms with `ease-in-out` still read as a snap, because
 * ease-in-out spends its speed in the middle and arrives abruptly; this curve
 * front-loads the motion and settles slowly, which is what reads as "smooth".
 */
const OPEN_DURATION_MS = 450;
const OPEN_EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

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
   * card rather than a wall: top/bottom gaps and content-facing rounded corners.
   *
   * Defaults to whatever the variant implies — `floating` and `floating-glass`
   * carry an offset in their own tokens, exactly as they do on `SideMenu`, so
   * they are inset unless you say otherwise. Everything else sits flush.
   */
  inset?: boolean;
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
   * an expand chevron and the title running vertically. @default false
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
 * SidePanel — slides in from either edge as an overlay inside its container.
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
  onClose,
  title,
  subtitle,
  icon,
  width = 420,
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
  const isInset = inset ?? surface.offset !== "";
  const cornerClass =
    INNER_CORNER[corner === "auto" ? DEFAULT_SURFACE_CORNER : corner][side];
  // Inset outlines the three edges you can actually see; the docked one is
  // still flush against the container, so a rule there would double up with
  // whatever the container draws.
  const borderClass = surface.border
    ? `${surface.border} ${
        isInset
          ? side === "right"
            ? "border-y border-l"
            : "border-y border-r"
          : surface.borderSides === "all"
            ? "border"
            : side === "right"
              ? "border-l"
              : "border-r"
      }`
    : "";
  const shadowClass = side === "left" ? surface.shadow : surface.shadowRight;
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
    if (event.propertyName !== "width") return;
    if (!isOpen) setMounted(false);
  };

  // ── Resizing ──────────────────────────────────────────────────────────────
  const [currentWidth, setCurrentWidth] = useState(width);
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

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!resizable) return;
      e.preventDefault();
      isDraggingRef.current = true;
      setIsDragging(true);
      startXRef.current = e.clientX;
      startWidthRef.current = currentWidth;

      const onMouseMove = (ev: MouseEvent) => {
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
      document.body.style.cursor = "col-resize";
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
    [resizable, currentWidth, minWidth, maxWidth, side],
  );

  const resolvedWidth = resizable ? currentWidth : width;

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
      const grow =
        side === "right" ? e.key === "ArrowLeft" : e.key === "ArrowRight";
      const shrink =
        side === "right" ? e.key === "ArrowRight" : e.key === "ArrowLeft";
      if (e.key === "Home") {
        e.preventDefault();
        setCurrentWidth(minWidth);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        setCurrentWidth(maxWidth);
        return;
      }
      if (!grow && !shrink) return;
      e.preventDefault();
      setCurrentWidth(
        Math.min(
          maxWidth,
          Math.max(minWidth, currentWidth + (grow ? step : -step)),
        ),
      );
    },
    [resizable, side, currentWidth, minWidth, maxWidth],
  );

  if (!mounted) return null;

  // The handle rides the panel's outer edge, so it tracks the same value the
  // width animates to — and carries the same transition, or it would jump to
  // its final position while the panel was still opening.
  const edgeOffset = entered ? shellWidth : 0;
  // The resize bar and the grip's active layer share one paint: hover reveals
  // it, dragging deepens the tone as well as the opacity, so "grabbed" reads
  // differently from "pointer happens to be here".
  const barTone = isDragging
    ? `opacity-100 bg-${effectiveTone}-500`
    : `bg-${effectiveTone}-400 opacity-0 group-hover:opacity-70 group-active:opacity-100`;
  const edgeProperty = side === "right" ? "right" : "left";
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

  return (
    <>
      <div
        ref={shellRef}
        data-sp-shell
        data-collapsed={collapsible ? isCollapsed : undefined}
        className={classNames(
          "absolute z-40 overflow-hidden",
          isInset ? INSET_GAP_Y_CLASS : "top-0 h-full",
          side === "right" ? "right-0" : "left-0",
          cornerClass,
          legacyVariant && borderClass,
          legacyVariant ? shadowClass : panelOuterChrome,
        )}
        style={{
          width: entered ? shellWidth : 0,
          // Inline rather than `transition-[width] duration-… ease-…`: an
          // arbitrary easing utility would have to survive the safelist, and
          // this curve is not themeable anyway. It decelerates hard at the end,
          // which is what stops the panel feeling like it snaps into place.
          // Suppressed while resizing so the panel tracks the pointer exactly
          // rather than lagging a third of a second behind it.
          transition: isDragging
            ? undefined
            : `width ${OPEN_DURATION_MS}ms ${OPEN_EASING}`,
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
          default), or the reveal reads as a wipe. Transparent: the fill is the
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
            "relative flex h-full flex-col transition-opacity duration-200 motion-reduce:transition-none",
            side === "left" && "ml-auto",
            isCollapsed && "opacity-0",
            className,
          )}
          style={{ width: resolvedWidth }}
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
              {collapsible && collapseButton(t("kit.sidepanel.collapse"))}
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

        {/* ── Collapsed rail — the expand chevron and the label, vertical ── */}
        {isCollapsed && (
          <div
            data-sp-collapsed
            className={classNames(
              "absolute inset-y-0 flex flex-col items-center gap-3 py-3",
              side === "right" ? "left-0" : "right-0",
            )}
            style={{ width: COLLAPSED_RAIL_WIDTH }}
          >
            {collapseButton(t("kit.sidepanel.expand"))}
            {(collapsedLabel ?? title) && (
              <span
                data-sp-collapsed-label
                className={classNames(
                  "min-h-0 truncate text-xs font-semibold uppercase tracking-[0.2em] [writing-mode:vertical-rl]",
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
      {overlay && (
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
          aria-orientation={handleParked ? undefined : "vertical"}
          aria-label={handleParked ? undefined : t("kit.sidepanel.resize")}
          aria-valuenow={handleParked ? undefined : resolvedWidth}
          aria-valuemin={handleParked ? undefined : minWidth}
          aria-valuemax={handleParked ? undefined : maxWidth}
          tabIndex={handleParked ? -1 : 0}
          className={classNames(
            "group absolute z-40 w-3 cursor-col-resize bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500",
            isInset ? INSET_GAP_Y_CLASS : "inset-y-0",
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
              "absolute inset-y-2 w-0.5 rounded-full transition duration-150",
              side === "right" ? "-right-px" : "-left-px",
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
              "pointer-events-none absolute top-1/2 h-10 w-1 -translate-y-1/2",
              side === "right" ? "-right-0.5" : "-left-0.5",
            )}
          >
            <span
              data-sp-grip-rest
              className={classNames(
                "absolute inset-0 rounded-full bg-neutral-400 transition-opacity duration-150 dark:bg-neutral-500",
                isDragging ? "opacity-0" : "opacity-40 group-hover:opacity-0 group-focus-visible:opacity-0",
              )}
            />
            <span
              data-sp-grip-active
              className={classNames("absolute inset-0 rounded-full transition duration-150", barTone)}
            />
          </span>
        </div>
      )}
    </>
  );
};

export default SidePanel;
