import { type ReactNode } from "react";
import classNames from "classnames";
import {
  getSidebarSurfaceTokens,
  SIDE_MENU_HEADER_FILL,
  SIDE_MENU_HEADER_HEIGHT,
  SIDE_MENU_HEADER_SEAM,
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
 * borrow the menu's exact card geometry from the shared sidebar tokens.
 * While flush there is still nothing to restyle — the component exists so
 * the horizontal seam continues unbroken from the sidebar's logo header
 * into the page header. Anything the caller wants to add can ride in on
 * `className` or the region props; anything that would move the seam cannot.
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
  className = "",
  ...rest
}: PageHeaderProps) => {
  // The detached pair resolves the very tokens the SideMenu renders, so the
  // cards align on one inset grid (both `m-2`) and their rims/shadows can
  // never drift from the menu's.
  const surface =
    variant === "default" ? null : getSidebarSurfaceTokens(variant, accentColor);

  return (
    <header
      {...rest}
      className={classNames(
        "flex w-full items-center justify-between gap-4 px-5",
        SIDE_MENU_HEADER_HEIGHT,
        surface
          ? classNames(
              surface.offset,
              surface.radius,
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
