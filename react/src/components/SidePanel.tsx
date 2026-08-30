import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { warnIfMissingTitle } from "../../../common/a11y/warn";
import IconButton from "./IconButton";
import { IconSize } from "../types";
import { useKitT } from "../i18n";
import {
  DEFAULT_SURFACE_CORNER,
  SIDEBAR_VARIANTS,
  getSidebarSurfaceTokens,
  getSurfaceTextTokens,
  type ControlSize,
  type SidebarVariant,
  type SurfaceCorner,
  type TrueColor,
} from "../theme/Theme";

/**
 * The sidebar surface family, shared with `SideMenu` — not `Panel`'s.
 *
 * A docked panel and a docked menu are the same object with different content,
 * and they were drawn from different vocabularies: `elevated`/`tonal` cards on
 * one side, `sidebar`/`floating` shells on the other. `floating` and
 * `floating-glass` bring the detached card geometry (radius + offset) that
 * makes this read as SideMenu's sibling rather than a card wedged against an
 * edge.
 */
export { SIDEBAR_VARIANTS as SIDE_PANEL_VARIANTS };
export type SidePanelVariant = SidebarVariant;

/**
 * Heading / muted copy for a sidebar variant. The glass surfaces need the
 * higher-contrast step; the rest read as solid panels.
 */
export const getSidePanelTextTokens = (variant: SidePanelVariant) =>
  getSurfaceTextTokens(
    variant === "glass" || variant === "floating-glass" ? "glass" : "elevated",
  );

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
const INNER_CORNER: Record<SurfaceCorner, Record<SidePanelSide, string>> = {
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

/**
 * Dither-noise fill — the same fractal turbulence SideMenu paints, desaturated
 * to grey so the light-mode `mix-blend-multiply` pass cannot cast color.
 * (Overlay blend on a pure-white base is a no-op, hence the per-theme blend.)
 */
const NOISE_STYLE: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
};

export interface SidePanelProps {
  /** Whether the panel is open */
  isOpen: boolean;
  /** Called when the user clicks the close button */
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
  /** Accent for the resize handle and the close button. */
  tone?: TrueColor;
  /** @deprecated Use `tone`, which is what every other component calls it. */
  color?: TrueColor;
  /** The surface family, shared with `SideMenu`. @default "sidebar" */
  variant?: SidePanelVariant;
  /**
   * Detach the panel from its container's edges, so it reads as a floating
   * card rather than a wall: a gap on all four sides and rounded corners.
   *
   * Defaults to whatever the variant implies — `floating` and `floating-glass`
   * carry an offset in their own tokens, exactly as they do on `SideMenu`, so
   * they are inset unless you say otherwise. Everything else sits flush.
   */
  inset?: boolean;
  /**
   * Corner size, applied to the two corners facing the content. The shared
   * `SurfaceCorner` scale `Panel` takes, so the two land on the same radii.
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
   * Paint a subtle dither-noise (film-grain) texture over the panel
   * background, behind the content. Works in both light and dark mode
   * (multiply blend in light, overlay in dark — the same dither SideMenu
   * paints). @default false
   */
  noise?: boolean;
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
  variant = "sidebar",
  surfaceTone = "neutral",
  size = "md",
  side = "right",
  noise = false,
  inset,
  corner = DEFAULT_SURFACE_CORNER,
  onKeyDown,
}) => {
  const t = useKitT();
  // a11y (P1-2): an unnamed panel is an unidentifiable landmark/region.
  warnIfMissingTitle("SidePanel", title);
  const effectiveTone = tone ?? color ?? "neutral";
  const sizeToken = SIZE_TOKENS[size] ?? SIZE_TOKENS.md;
  const surface = getSidebarSurfaceTokens(variant, surfaceTone);
  const surfaceText = getSidePanelTextTokens(variant);
  // `offset` is how SideMenu marks a detached variant, so it is the honest
  // default for "should this float?" rather than a second list to keep in sync.
  const isInset = inset ?? surface.offset !== "";
  const cornerClass = INNER_CORNER[corner][side];
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

    if (isOpen && !wasOpen) {
      setMounted(true);
      // Next frame: the browser needs to have painted the 0-width state before
      // the target width can transition away from it.
      const frame = requestAnimationFrame(() => setEntered(true));
      return () => cancelAnimationFrame(frame);
    }
    if (!isOpen && wasOpen) setEntered(false);
    return undefined;
  }, [isOpen]);

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
  const edgeOffset = entered ? resolvedWidth : 0;
  const edgeProperty = side === "right" ? "right" : "left";
  const handleStyle: React.CSSProperties = {
    [edgeProperty]: edgeOffset,
    transition: isDragging
      ? undefined
      : `${edgeProperty} ${OPEN_DURATION_MS}ms ${OPEN_EASING}`,
  };

  return (
    <>
      <div
        className={classNames(
          "absolute z-40 overflow-hidden",
          isInset ? INSET_GAP_Y_CLASS : "top-0 h-full",
          side === "right" ? "right-0" : "left-0",
          cornerClass,
          borderClass,
          shadowClass,
        )}
        style={{
          width: entered ? resolvedWidth : 0,
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
            surface.fill,
            cornerClass,
          )}
        />
        {/* Dither-noise layer — over the fill, under the content (which is
          `relative`), so it reads as a background grain. Multiply in light
          (overlay is a no-op on a white base), overlay in dark — the same
          dither SideMenu paints. */}
        {noise && (
          <div
            aria-hidden="true"
            data-sp-noise="true"
            className={classNames(
              "pointer-events-none absolute inset-0 mix-blend-multiply opacity-[0.08] dark:mix-blend-overlay dark:opacity-[0.4]",
              cornerClass,
            )}
            style={NOISE_STYLE}
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
          className={classNames(
            "relative flex h-full flex-col",
            side === "left" && "ml-auto",
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
              {headerActions}
              {onClose && (
                <IconButton
                  icon="Close"
                  size={closeIconSize ?? sizeToken.icon}
                  variant="ghost"
                  color={effectiveTone}
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
      </div>

      {/* Drag handle — a sibling of the panel, not a child of it, so it can sit
          *outside* the panel edge; inside, the panel's `overflow-hidden` would
          clip anything drawn past its border.

          Shape follows SmartGridLayout's column resizer: a wide transparent hit
          area with a `rounded-full` pill inside. The pill runs nearly the full
          height because the edge is grabbed at whatever point the pointer
          happens to be at, so the affordance has to be visible there too. */}
      {resizable && (
        // ARIA 1.2 resizable separator: focusable (tabIndex), arrow keys /
        // Home / End resize, aria-valuenow|min|max report the width. The
        // rule does not model the valuenow-bearing separator as a widget.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- resizable separator (WCAG 2.1.1 keyboard resize below)
        <div
          onMouseDown={onMouseDown}
          onKeyDown={onSeparatorKeyDown}
          role="separator"
          aria-orientation="vertical"
          aria-label={t("kit.sidepanel.resize")}
          aria-valuenow={resolvedWidth}
          aria-valuemin={minWidth}
          aria-valuemax={maxWidth}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- resizable separator (ARIA 1.2 widget with valuenow)
          tabIndex={0}
          className={classNames(
            "group absolute z-40 w-3 cursor-col-resize bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-500",
            isInset ? INSET_GAP_Y_CLASS : "inset-y-0",
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
              "absolute inset-y-2 w-1 rounded-full transition duration-150",
              // Against the panel-facing end of the hit area, held a couple of
              // pixels clear so the panel's own border still reads as a line.
              side === "right" ? "right-0.5" : "left-0.5",
              // Hover reveals it as an affordance; dragging deepens the tone
              // as well as the opacity, so "grabbed" is distinct from
              // "pointer happens to be here".
              isDragging
                ? `opacity-100 bg-${effectiveTone}-500`
                : `bg-${effectiveTone}-400 opacity-0 group-hover:opacity-70 group-active:opacity-100`,
            )}
          />
        </div>
      )}
    </>
  );
};

export default SidePanel;
