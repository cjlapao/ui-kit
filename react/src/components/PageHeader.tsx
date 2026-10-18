import { type ReactNode } from "react";
import classNames from "classnames";
import {
  SIDE_MENU_HEADER_FILL,
  SIDE_MENU_HEADER_HEIGHT,
  SIDE_MENU_HEADER_SEAM,
} from "../theme";

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
 * There are deliberately no `variant`, `padding` or `corner` props: the
 * component exists so the horizontal seam continues unbroken from the
 * sidebar's logo header into the page header. Anything the caller wants to
 * add can ride in on `className` or the region props; anything that would
 * move the seam cannot.
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
  className = "",
  ...rest
}: PageHeaderProps) => (
  <header
    {...rest}
    className={classNames(
      "flex w-full items-center justify-between gap-4 border-b px-5",
      SIDE_MENU_HEADER_HEIGHT,
      SIDE_MENU_HEADER_FILL,
      SIDE_MENU_HEADER_SEAM,
      className,
    )}
  >
    <div className={GROUP_CLASS}>{start}</div>
    <div className={GROUP_CLASS}>{center}</div>
    <div className={GROUP_CLASS}>{end}</div>
    {children != null && <div className={GROUP_CLASS}>{children}</div>}
  </header>
);

PageHeader.displayName = "PageHeader";

export default PageHeader;
