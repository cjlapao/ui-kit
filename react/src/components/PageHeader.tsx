import { type ReactNode } from "react";
import classNames from "classnames";
import Panel, { type PanelProps } from "./Panel";
import type { SurfaceVariant } from "../theme/Theme";
import {
  DEFAULT_SURFACE_CORNER,
  getSidebarSurfaceTokens,
  getSurfaceCornerClass,
  getSurfaceGutterClass,
  SIDE_MENU_HEADER_FILL,
  SIDE_MENU_HEADER_HEIGHT,
  SIDE_MENU_HEADER_SEAM,
  type SurfaceCorner,
  type SurfacePadding,
  type TrueColor,
} from "../theme";

/** Shared Panel surfaces plus the existing floating compatibility names.
 * The default keeps the original sidebar-aligned header seam. */
export { SURFACE_VARIANTS as PAGE_HEADER_VARIANTS } from "../theme/Theme";
/** `none` (alias `plain`) paints nothing — the groups sit on whatever is behind. */
export type PageHeaderVariant = SurfaceVariant | "floating" | "floating-glass" | "none" | "plain";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The left group — brand, title, breadcrumb trail.
   */
  start?: ReactNode;
  /**
   * The centered group. Rare in a header; keep it narrow if used.
   */
  center?: ReactNode;
  /**
   * The right group — theme toggle, search, the signed-in avatar.
   */
  end?: ReactNode;
  /**
   * Extra content appended after the three regions as its own group. The
   * regions stay in the DOM when empty, so an `end`-only header still parks
   * its controls on the right.
   */
  children?: ReactNode;
  /**
   * The surface treatment.
   *
   * - `"default"` paints the SideMenu's own header chrome, so the horizontal
   *   seam continues unbroken from a flush sidebar's logo header into the
   *   page header.
   * - `"floating"` / `"floating-glass"` render the detached card — the same
   *   offset, corner, rim and shadow the floating `SideMenu` variants get,
   *   resolved from the shared token function so the two cards pair exactly
   *   and cannot drift. There is no seam to continue in the detached world.
   *
   * @default "default"
   */
  variant?: PageHeaderVariant;
  /** Shared panel surface tone. */
  tone?: PanelProps["tone"];
  glassOpacity?: PanelProps["glassOpacity"];
  transparency?: PanelProps["transparency"];
  vibrancy?: PanelProps["vibrancy"];
  specularMode?: PanelProps["specularMode"];
  /**
   * Tone of the `floating-glass` frosted fill — the same token, name and
   * default as the `SideMenu`'s `color`, so a paired menu and header set to
   * the same tone read as one card system. Ignored by the other variants.
   *
   * @default "blue"
   */
  accentColor?: TrueColor;
  /**
   * The gutter the bar leaves OUTSIDE itself — the space around the card,
   * not the inset inside it (the bar's inner padding and height are the
   * seam's, pinned with the SideMenu). Same token names as `Panel`'s
   * padding, mapped to a margin scale, set uniformly; the per-axis props
   * below win where they are given.
   *
   * Defaults depend on the variant: the flush bar is closed on every side,
   * while the floating card keeps the menu's `m-2` (`"xs"`) on top and
   * right — pairing it with the floating `SideMenu` — and sits flush on
   * left and bottom.
   *
   * @default "none" on the flush variant, `{ top: "xs", right: "xs" }`
   * plus flush left/bottom on the floating variants
   */
  padding?: SurfacePadding;
  /** Gutter above the bar. @default "xs" floating, "none" flush */
  paddingTop?: SurfacePadding;
  /** Gutter to the bar's right. @default "xs" floating, "none" flush */
  paddingRight?: SurfacePadding;
  /** Gutter below the bar. @default "none" */
  paddingBottom?: SurfacePadding;
  /** Gutter to the bar's left. @default "none" */
  paddingLeft?: SurfacePadding;
  /**
   * Corner rounding, on `Panel`'s corner scale and with its default — the
   * floating variants take this instead of the menu's token radius, so a
   * paired menu/header card set only drifts when you ask it to.
   *
   * @default "rounded-md" (`DEFAULT_SURFACE_CORNER`, which produces
   * `rounded-2xl` — the token radius the floating cards already had)
   */
  corner?: SurfaceCorner;
  className?: string;
}

const GROUP_CLASS = "flex min-w-0 flex-wrap items-center gap-3";

/** Page header with start, centre and end groups. Shared Panel variants use
 * the Panel renderer; default and floating names retain their original chrome.
 * The padding props control outer gutters rather than inner content padding. */
export const PageHeader = ({
  start,
  center,
  end,
  children,
  variant = "default",
  accentColor = "blue",
  tone = "neutral",
  glassOpacity,
  transparency,
  vibrancy,
  specularMode,
  padding,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  corner = DEFAULT_SURFACE_CORNER,
  className = "",
  ...rest
}: PageHeaderProps) => {
  // The detached pair resolves the very tokens the SideMenu renders for
  // rim, shadow and fill, so the cards can never drift from the menu's. The
  // outer gutter left the token set for the padding knobs — `"xs"` on an
  // axis reproduces the menu's `m-2` on that side exactly — and the corner
  // leaves it only when the caller turns that knob; the default produces
  // the same class.
  const plain = variant === "none" || variant === "plain";
  const sharedSurface = !plain && variant !== "default" && variant !== "floating" && variant !== "floating-glass";
  const surface = variant === "floating" || variant === "floating-glass"
    ? getSidebarSurfaceTokens(variant, accentColor) : null;

  // Per axis: the explicit axis prop, else the uniform `padding`, else the
  // variant's default — the floating card pairs with the menu (the menu's
  // m-2 above and to the right) and sits flush left and bottom; the seam
  // bar closes on every side.
  const pair: SurfacePadding = surface ? "xs" : "none";
  const gutter = {
    top: paddingTop ?? padding ?? pair,
    right: paddingRight ?? padding ?? pair,
    bottom: paddingBottom ?? padding ?? "none",
    left: paddingLeft ?? padding ?? "none",
  } as const;

  return (
    <header
      {...rest}
      className={classNames(
        "relative isolate flex w-full shrink-0 items-center justify-between gap-4 px-5",
        SIDE_MENU_HEADER_HEIGHT,
        getSurfaceGutterClass("top", gutter.top),
        getSurfaceGutterClass("right", gutter.right),
        getSurfaceGutterClass("bottom", gutter.bottom),
        getSurfaceGutterClass("left", gutter.left),
        getSurfaceCornerClass(corner),
        surface
          ? classNames(
              "border",
              surface.border,
              surface.shadow,
              surface.fill,
            )
          : !sharedSurface && !plain && classNames("border-b", SIDE_MENU_HEADER_FILL, SIDE_MENU_HEADER_SEAM),
        className,
      )}
    >
      {sharedSurface && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" style={{ borderRadius: "inherit" }}>
          <Panel variant={variant as SurfaceVariant} tone={tone} glassOpacity={glassOpacity} transparency={transparency} vibrancy={vibrancy} specularMode={specularMode}
            padding="none" corner="none" className="h-full w-full" style={{ borderRadius: "inherit" }} />
        </div>
      )}
      <div className={GROUP_CLASS}>{start}</div>
      <div className={GROUP_CLASS}>{center}</div>
      <div className={GROUP_CLASS}>{end}</div>
      {children != null && <div className={GROUP_CLASS}>{children}</div>}
    </header>
  );
};

PageHeader.displayName = "PageHeader";

export default PageHeader;
