import { type ReactNode } from "react";
import classNames from "classnames";
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

/** The page-level surface treatments. */
export type PageHeaderVariant = "default" | "floating" | "floating-glass";

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

/**
 * The bar across the top of the main column, beside a `SideMenu` — the
 * Toolbar's page-level sibling. Same region anatomy (`start` / `center` /
 * `end`, empty regions hold their place), but its furniture is a brand, a
 * breadcrumb and page controls rather than a row of commands, and it paints
 * the SideMenu's own header chrome instead of the Panel surface variants.
 *
 * The `variant` prop exists for the detached world the floating `SideMenu`
 * variants created: `"default"` keeps the seam, and the two floating values
 * borrow the menu's exact card chrome from the shared sidebar tokens.
 * The seam itself stays pinned — fill, height, the `border-b` and the
 * bar's inner `px-5` are the SideMenu's own language — while the outer
 * gutter is caller-controlled per axis (`padding` uniformly,
 * `paddingTop/Right/Bottom/Left` per side; the floating card defaults to
 * the menu's `m-2` on top and right, flush left and bottom) and the
 * `corner` (Panel's scale and default) is a knob. Anything else the caller
 * wants to add can ride in on `className` or the region props; anything
 * that would move the seam cannot.
 *
 * It renders a `<header>` element — the banner landmark when placed at page
 * top level — so screen readers find it by name of the element, not by a
 * toolbar role it does not fulfil.
 */
export const PageHeader = ({
  start,
  center,
  end,
  children,
  variant = "default",
  accentColor = "blue",
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
  const surface =
    variant === "default" ? null : getSidebarSurfaceTokens(variant, accentColor);

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
        "flex w-full items-center justify-between gap-4 px-5",
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
          : classNames("border-b", SIDE_MENU_HEADER_FILL, SIDE_MENU_HEADER_SEAM),
        className,
      )}
    >
      <div className={GROUP_CLASS}>{start}</div>
      <div className={GROUP_CLASS}>{center}</div>
      <div className={GROUP_CLASS}>{end}</div>
      {children != null && <div className={GROUP_CLASS}>{children}</div>}
    </header>
  );
};

PageHeader.displayName = "PageHeader";

export default PageHeader;
