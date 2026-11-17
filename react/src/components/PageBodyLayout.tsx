import React from "react";
import classNames from "classnames";
import Panel, { type PanelProps } from "./Panel";
import { SURFACE_VARIANTS, THIN_SCROLLBAR, getSurfacePaddingClass, getSurfacePaddingPx, type SurfacePadding, type PlainSurfaceVariant, type SurfaceVariant } from "../theme/Theme";

/**
 * Layout containment on every zone: a `motion="layout"` collapse in a zone
 * relayouts the row each frame of its sweep, and containment is what keeps
 * that work inside the animating zone instead of cascading through the whole
 * page. `contain-intrinsic-size: auto` records each region's last resolved
 * size so containment can never collapse a measured height. No `paint`:
 * pickers, menus and tooltips that render outside their region's box would be
 * silently clipped (invisible until someone opens one).
 */
const REGION_CONTAINMENT: React.CSSProperties = {
  contain: "layout style",
  containIntrinsicSize: "auto",
};

export type PageBodyRegionSide = "left" | "right" | "bottom";
/** The shared surfaces plus `none` (draw nothing); `plain` is its kit-wide alias. */
export const PAGE_BODY_LAYOUT_VARIANTS = ["none", ...SURFACE_VARIANTS] as const;
export type PageBodyLayoutVariant = (typeof PAGE_BODY_LAYOUT_VARIANTS)[number] | PlainSurfaceVariant;
export interface PageBodyLayoutProps extends Pick<PanelProps, "tone" | "corner" | "glassOpacity" | "transparency" | "vibrancy" | "specularMode"> {
  /**
   * The layout's own surface. `none` draws nothing — transparent, no border,
   * shadow or outer padding — leaving only the zones and the gaps between
   * them, for when every control brings its own surface. `plain` (the kit's
   * name for the same thing elsewhere) is accepted too. @default "outlined"
   */
  variant?: PageBodyLayoutVariant;
  header?: React.ReactNode;
  /** Full-height zone before the centre. Sized by its content. */
  left?: React.ReactNode;
  /** Full-height zone after the centre. Sized by its content. */
  right?: React.ReactNode;
  /** Zone beneath the centre only. Sized by its content. */
  bottom?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  /** Minimum centre dimensions; smaller containers scroll the layout. */
  minCenterWidth?: number;
  minCenterHeight?: number;
  /** Gutter between zones, in px. @default 8 */
  gap?: number;
  /** Outer body inset on the shared responsive padding scale. Ignored for none/plain. @default "xs" */
  padding?: SurfacePadding;
  /** Padding inside the center on the shared responsive scale. @default "none" */
  centerPadding?: SurfacePadding;
}

/**
 * Zones only: a header above a body whose left and right zones span its
 * height, with a bottom zone beneath the centre. The layout holds no state —
 * each zone is exactly as big as what is put in it, and the centre takes the
 * rest. Components that collapse, animate or resize themselves (a `docked`
 * `SidePanel`, `WorkflowTrackerRail`) do so in place and the centre follows.
 *
 * Give the layout a bounded height (for example h-full inside a flex-1
 * container). Left/right zones stretch their content to the body's height; the
 * bottom zone stretches it to the centre's width.
 *
 * The row floors itself at `calc(zone publishes + centre minimum + gaps +
 * padding)` rather than `min-width: fit-content`. Same guarantee — a tight
 * container scrolls instead of the centre sliding under a zone — without the
 * intrinsic-size pass `fit-content` forces through every zone's content,
 * which a panel's collapse sweep used to re-run on every frame. A docked
 * `SidePanel` and a collapsible `WorkflowTrackerRail` **publish** their own
 * known widths into `--page-zone-min-left` / `--page-zone-min-right` on this
 * row (`data-page-row`); the layout still measures and stores nothing.
 * (Custom properties inherit downward only, so an upward publish is a direct
 * style write the zone performs.) A zone that publishes nothing contributes
 * its `0px` fallback and still holds its own width as a non-shrinking flex
 * item; the bottom zone rides the centre column's minimum, as before.
 *
 * Cost note for desktop shells (WebKitGTK/Tauri): `variant="glass"` and
 * `liquid-glass` carry a `backdrop-filter` — a main-thread read-back of the
 * backdrop on every frame anything scrolls beneath this layout, competing
 * for exactly the frame budget a `motion="layout"` collapse also spends in.
 * `simple` (or `elevated`) is the low-cost surface for pages that scroll.
 */
export function PageBodyLayout({ header, left, right, bottom, children, className, minCenterWidth = 240, minCenterHeight = 120, gap = 8, padding = "xs", centerPadding = "none", variant = "outlined", ...surface }: PageBodyLayoutProps) {
  const plain = variant === "none" || variant === "plain";
  // The numeric part of the floor: the centre's minimum, one gutter per zone
  // that exists, and the base padding inset — the floor only binds in tight
  // containers, which by definition are narrow, and the responsive padding
  // scale is at its base rung there.
  const zoneGaps = gap * ((hasZone(left) ? 1 : 0) + (hasZone(right) ? 1 : 0));
  const floorPx =
    minCenterWidth +
    zoneGaps +
    (plain ? 0 : getSurfacePaddingPx(padding) * 2);
  const body = (
    <>
      {header && <div className="shrink-0">{header}</div>}
      <div className={classNames("min-h-0 min-w-0 flex-1 overflow-auto", THIN_SCROLLBAR)}>
        {/* The floor: the zones' published widths (0px until they publish) +
            the centre's minimum + gutters + padding. `fit-content` used to
            live here — a measurement of every zone's content, re-run inside
            every frame of a panel's collapse sweep. Plain has no edge to
            inset from, so only the gaps remain. */}
        <div data-page-row className={classNames("flex h-full min-h-0", !plain && getSurfacePaddingClass(padding))} style={{ minWidth: `calc(var(--page-zone-min-left, 0px) + var(--page-zone-min-right, 0px) + ${floorPx}px)`, gap, ...(plain ? { paddingTop: header ? gap : 0 } : {}) }}>
          {hasZone(left) && <div data-page-region="left" className="flex min-h-0 shrink-0" style={REGION_CONTAINMENT}>{left}</div>}
          <div className="flex min-h-0 flex-1 flex-col" style={{ gap, minWidth: minCenterWidth }}>
            <div data-page-region="center" className={classNames("min-w-0 flex-1 overflow-auto", THIN_SCROLLBAR, getSurfacePaddingClass(centerPadding))} style={{ minHeight: minCenterHeight, ...REGION_CONTAINMENT }}>{children}</div>
            {hasZone(bottom) && <div data-page-region="bottom" className="flex min-w-0 shrink-0 flex-col" style={REGION_CONTAINMENT}>{bottom}</div>}
          </div>
          {hasZone(right) && <div data-page-region="right" className="flex min-h-0 shrink-0" style={REGION_CONTAINMENT}>{right}</div>}
        </div>
      </div>
    </>
  );
  return plain ? (
    <div data-page-layout="none" className={classNames("flex h-full min-h-0 min-w-0 flex-col", className)}>{body}</div>
  ) : (
    <Panel {...surface} variant={variant as SurfaceVariant} padding="none" scrollable={false} flexBody className={classNames("h-full min-h-0 min-w-0", className)}>
      {body}
    </Panel>
  );
}

/** `false` and `null` mean "no zone", so `left={open && <Rail />}` works. */
function hasZone(node: React.ReactNode) {
  return node != null && node !== false;
}
export default PageBodyLayout;
