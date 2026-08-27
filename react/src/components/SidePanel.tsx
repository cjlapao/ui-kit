import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import IconButton from "./IconButton";
import { IconSize } from "../types";
import { TrueColor } from "../theme/Theme";

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
  /** color for the resizer */
  color?: TrueColor;
  /**
   * Paint a subtle dither-noise (film-grain) texture over the panel
   * background, behind the content. Works in both light and dark mode
   * (multiply blend in light, overlay in dark — the same dither SideMenu
   * paints). @default false
   */
  noise?: boolean;
}

/**
 * SidePanel — slides in from the right as a fixed overlay.
 *
 * Because it uses `position: fixed` it never affects the page layout,
 * so no horizontal scrollbar artifacts occur during the animation.
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
  closeIconSize = "sm",
  resizable = false,
  minWidth = 280,
  maxWidth = 900,
  color = "neutral",
  noise = false,
}) => {
  // Mount immediately on open so the opening animation can play.
  // Unmount only after the closing animation finishes (onTransitionEnd).
  const [mounted, setMounted] = useState(isOpen);
  const prevOpenRef = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setMounted(true);
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);

  const handleTransitionEnd = () => {
    if (!isOpen) setMounted(false);
  };

  // ── Resizing ──────────────────────────────────────────────────────────────
  const [currentWidth, setCurrentWidth] = useState(width);
  const isDraggingRef = useRef(false);
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
      startXRef.current = e.clientX;
      startWidthRef.current = currentWidth;

      const onMouseMove = (ev: MouseEvent) => {
        const delta = startXRef.current - ev.clientX;
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
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [resizable, currentWidth, minWidth, maxWidth],
  );

  const resolvedWidth = resizable ? currentWidth : width;

  if (!mounted) return null;

  return (
    <div
      className={classNames(
        "absolute top-0 right-0 h-full z-40",
        "overflow-hidden",
        // Only animate width when not actively resizing
        !isDraggingRef.current && "transition-[width] duration-300 ease-in-out",
        "border-l border-neutral-200 dark:border-neutral-700",
        "shadow-xl dark:shadow-neutral-900/50",
      )}
      style={{ width: isOpen ? resolvedWidth : 0 }}
      onTransitionEnd={handleTransitionEnd}
    >
      {/* Drag handle — left edge, only rendered when resizable */}
      {resizable && (
        <div
          onMouseDown={onMouseDown}
          className="absolute left-0 top-0 h-full z-40 w-1 cursor-col-resize group"
        >
          {/* Visible highlight on hover/drag */}
          <div
            className={`h-full w-full bg-transparent transition-colors group-hover:bg-${color}-300/60 dark:group-hover:bg-${color}-600/60 active:bg-${color}-400/60 dark:active:bg-${color}-500/40`}
          />
        </div>
      )}

      {/* Inner container — fixed at target width so content never squishes during animation */}
      <div
        className={classNames(
          "relative flex h-full flex-col bg-white dark:bg-neutral-900",
          className,
        )}
        style={{ width: resolvedWidth }}
      >
        {/* Dither-noise layer — behind the content sections (they are
            `relative`) so it reads as a background grain. Multiply in light
            (overlay is a no-op on a white base), overlay in dark — the same
            dither SideMenu paints. */}
        {noise && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-[0.08] dark:mix-blend-overlay dark:opacity-[0.4]"
            style={NOISE_STYLE}
          />
        )}

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="relative flex-none flex items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3">
          {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1 pt-0.5">
            {headerActions}
            {onClose && (
              <IconButton
                icon="Close"
                size={closeIconSize}
                variant="ghost"
                color="slate"
                onClick={onClose}
                aria-label="Close panel"
              />
            )}
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        <div className="relative flex-1 min-h-0 overflow-y-auto">{children}</div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        {footer && (
          <div className="relative flex-none border-t border-neutral-200 dark:border-neutral-700 px-4 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
