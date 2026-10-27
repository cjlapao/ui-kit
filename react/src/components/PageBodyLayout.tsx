import React from "react";
import classNames from "classnames";
import Panel, { type PanelProps } from "./Panel";
import { SURFACE_VARIANTS, THIN_SCROLLBAR, type PlainSurfaceVariant, type SurfaceVariant } from "../theme/Theme";

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
  /** Gutter around and between zones, in px. @default 8 */
  gap?: number;
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
 */
export function PageBodyLayout({ header, left, right, bottom, children, className, minCenterWidth = 240, minCenterHeight = 120, gap = 8, variant = "outlined", ...surface }: PageBodyLayoutProps) {
  const plain = variant === "none" || variant === "plain";
  const body = (
    <>
      {header && <div className="shrink-0">{header}</div>}
      <div className={classNames("min-h-0 min-w-0 flex-1 overflow-auto", THIN_SCROLLBAR)}>
        {/* `fit-content` floors the row at its zones plus the centre's minimum,
            so a tight container scrolls instead of the centre sliding under a
            zone. Plain has no edge to inset from, so only the gaps remain. */}
        <div className="flex h-full min-h-0" style={{ minWidth: "fit-content", gap, ...(plain ? { paddingTop: header ? gap : 0 } : { padding: gap }) }}>
          {hasZone(left) && <div data-page-region="left" className="flex min-h-0 shrink-0">{left}</div>}
          <div className="flex min-h-0 flex-1 flex-col" style={{ gap, minWidth: minCenterWidth }}>
            <div data-page-region="center" className={classNames("min-w-0 flex-1 overflow-auto", THIN_SCROLLBAR)} style={{ minHeight: minCenterHeight }}>{children}</div>
            {hasZone(bottom) && <div data-page-region="bottom" className="flex min-w-0 shrink-0 flex-col">{bottom}</div>}
          </div>
          {hasZone(right) && <div data-page-region="right" className="flex min-h-0 shrink-0">{right}</div>}
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
