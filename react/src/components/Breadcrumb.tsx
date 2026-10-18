import classNames from "classnames";
import { Link } from "react-router-dom";
import {
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  Fragment,
  forwardRef,
} from "react";
import { useIconRenderer } from "../contexts/IconContext";
import {
  getBreadcrumbSizeTokens,
  getBreadcrumbToneTokens,
  type ControlSize,
  type TrueColor,
} from "../theme/Theme";

/**
 * One crumb in the trail.
 *
 * Exactly one navigation mechanism wins, in priority order:
 * `to` (a react-router path, the same convention `SideMenu` uses) >
 * `href` (plain anchor) > `onClick` (button). An item with none of those —
 * or one marked `current` — renders as plain text.
 */
export interface BreadcrumbItem {
  /** Display text. Omit for an icon-only crumb (home, ellipsis). */
  label?: ReactNode;
  /** Icon registry name or element, shown before the label. */
  icon?: string | ReactElement;
  /** Route path — rendered with the router's `Link`. */
  to?: string;
  /** External URL, used when `to` is absent. */
  href?: string;
  /** Click handler, used when `to` and `href` are absent. */
  onClick?: () => void;
  /** This is the page you are on: no link, `aria-current="page"`. */
  current?: boolean;
  /** Extra content after the label — e.g. a `Badge`. */
  badge?: ReactNode;
  /** Accessible name for icon-only items. */
  ariaLabel?: string;
}

export interface BreadcrumbProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** The trail, in hierarchy order. */
  items: BreadcrumbItem[];
  /** Optional leading crumb — usually the home icon. */
  home?: BreadcrumbItem;
  /** Separator between items. @default the `ChevronRight` icon */
  separator?: ReactNode;
  /** Tints link hover/focus and the current crumb. @default "blue" */
  color?: TrueColor;
  /** Text, icon and chip geometry, on the shared control scale. @default "md" */
  size?: ControlSize;
  /** Accessible name for the navigation landmark. @default "Breadcrumb" */
  ariaLabel?: string;
}

/**
 * The crumb chip. `rounded-md` rather than the trigger family's `rounded-lg`
 * on purpose: a crumb sits in the page's text flow, not beside its controls.
 */
const CRUMB_BASE = "inline-flex max-w-56 items-center rounded-md";

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  {
    items,
    home,
    separator,
    color = "blue",
    size = "md",
    ariaLabel = "Breadcrumb",
    className,
    ...rest
  },
  ref,
) {
  const renderIcon = useIconRenderer();

  const crumbs: BreadcrumbItem[] = home ? [home, ...items] : items;

  const scale = getBreadcrumbSizeTokens(size);
  const tone = getBreadcrumbToneTokens(color);

  const linkClasses = (item: BreadcrumbItem) =>
    classNames(
      CRUMB_BASE,
      scale.chip,
      scale.gap,
      "text-neutral-500 transition-colors focus-visible:outline-none focus-visible:ring-2 dark:text-neutral-400",
      tone.hover,
      tone.focusRing,
      item.current && classNames("font-medium", tone.current),
    );

  const content = (item: BreadcrumbItem) => (
    <>
      {item.icon &&
        renderIcon(item.icon, size, classNames(scale.icon, "flex-shrink-0"))}
      {item.label != null && <span className="truncate">{item.label}</span>}
      {item.badge}
    </>
  );

  const crumb = (item: BreadcrumbItem) => {
    // Icon-only crumbs have no text of their own, so the accessible name
    // has to come from the element.
    const name = item.label == null ? item.ariaLabel : undefined;

    if (item.to !== undefined) {
      return (
        <Link
          to={item.to}
          className={linkClasses(item)}
          aria-label={name}
          aria-current={item.current ? "page" : undefined}
        >
          {content(item)}
        </Link>
      );
    }
    if (item.href !== undefined) {
      return (
        <a href={item.href} className={linkClasses(item)} aria-label={name}>
          {content(item)}
        </a>
      );
    }
    if (item.onClick) {
      return (
        <button
          type="button"
          onClick={item.onClick}
          className={classNames(linkClasses(item), "cursor-pointer")}
          aria-label={name}
        >
          {content(item)}
        </button>
      );
    }
    return (
      <span className={linkClasses(item)} aria-label={name} aria-current={item.current ? "page" : undefined}>
        {content(item)}
      </span>
    );
  };

  const separatorNode =
    separator ?? renderIcon("ChevronRight", size, scale.separator);

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={classNames(scale.text, className)}
      {...rest}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <li
                aria-hidden="true"
                className="flex items-center text-neutral-300 dark:text-neutral-600"
              >
                {separatorNode}
              </li>
            )}
            <li className="flex items-center">{crumb(item)}</li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
});

export default Breadcrumb;
