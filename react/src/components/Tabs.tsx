import React, {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import {
  type ControlSize,
  getTabsColorTokens,
  type Orientation,
  type TrueColor,
  getButtonActiveClasses,
} from "../theme/Theme";
import {
  getGlassChromeClasses,
  getGlassFillClass,
  getGlassVibrancyClass,
  getSpecularClasses,
  type GlassVibrancy,
  type GlassOpacity,
  type SpecularMode,
} from "../../../common/theme/glass";
import IconButton from "./IconButton";
import ScrollArea from "./ScrollArea";
import Badge from "./Badge";

export type TabsVariant =
  | "underline"
  | "soft"
  | "pill"
  | "segmented"
  | "minimal"
  | "glass"
  | "liquid-glass";
/**
 * The full shared control scale — xs through xl, the same five steps `Button`
 * takes. Tabs used to stop at three, which meant no tab bar could go smaller
 * than an md button or bigger without one-off class overrides.
 */
export type TabsSize = ControlSize;
export type TabsOrientation = Orientation;
export type TabsJustify = "start" | "center" | "end" | "between";
export type TabsRadius = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full";

export interface TabItemAction {
  id?: string;
  label?: ReactNode;
  /** Render a fully custom React node in the tab bar. When set, `icon` and `onClick` are ignored. */
  node?: ReactNode;
  icon?: string | React.ReactElement;
  onClick?: () => void;
  color?: TrueColor;
  active?: boolean;
}

export interface TabItem {
  id: string;
  label: ReactNode;
  icon?: string | React.ReactElement;
  description?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  panel?: ReactNode;
  badgeColor?: TrueColor;
  actions?: TabItemAction[];
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string, item: TabItem) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  color?: TrueColor;
  orientation?: TabsOrientation;
  justify?: TabsJustify;
  fullWidth?: boolean;
  className?: string;
  listClassName?: string;
  allowReselect?: boolean;
  panelIdPrefix?: string;
  showDividers?: boolean;
  hideUnderlineContainer?: boolean;
  /** Override the variant's container class (e.g. to customise the underline border color). Takes precedence over hideUnderlineContainer. */
  containerClassName?: string;
  panelClassName?: string;
  /**
   * Colour of the active tab's action icons. `"auto"` (default) follows the
   * tabs' own `color` — on glass or image hosts a neutral default would wash
   * out, so the tone carries over. Pass a tone to override, or set `color`
   * on an individual action to exempt just that one. Actions render as ghost
   * `IconButton`s — the same shape SplitView uses for its collapse control,
   * with the label as tooltip. `active` on an action marks it pressed and
   * gives it the kit's ghost-active tone fill.
   * @default "auto"
   */
  actionsColor?: "auto" | TrueColor;
  /** Backdrop vibrancy level for the `glass` / `liquid-glass` variants. */
  vibrancy?: GlassVibrancy;
  /** Glass fill transparency level for the `glass` / `liquid-glass` variants. */
  glassOpacity?: GlassOpacity;
  /** Specular highlight mode for the `glass` / `liquid-glass` variants. */
  specularMode?: SpecularMode;
  /**
   * Corner radius for the `glass` / `liquid-glass` tab pills. Default: `"md"`
   * (`rounded-md`). Pass `"full"` to restore the pill shape.
   */
  radius?: TabsRadius;
}

const joinClasses = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// shrink-0 + nowrap: without them a crowded bar flex-shrinks the tabs by
// their content widths, so each tab squashes into a different shape and the
// descriptions wrap into ladders. Overflow is now the bar's job (scrolling),
// not something each tab solves by shrinking unevenly.
const baseTabClasses =
  "group relative inline-flex shrink-0 items-center whitespace-nowrap transition-all duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60";

const focusOffset =
  "focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-0";

const focusRing = (color: TrueColor) => getTabsColorTokens(color).focusRing;

const sizeStyles: Record<
  ControlSize,
  { padding: string; text: string; gap: string; icon: string }
> = {
  // Stepping the theme's control scale at tab geometry: the text and icon
  // steps follow `controlSizeTokens`; the paddings are the tab-bar versions,
  // which stay roomier than a trigger's because the row is a bar, not a box.
  xs: {
    padding: "px-2 py-1",
    text: "text-xs",
    gap: "gap-1",
    icon: "h-4 w-4",
  },
  sm: {
    padding: "px-3 py-1.5",
    text: "text-sm font-medium",
    gap: "gap-1.5",
    icon: "h-4 w-4",
  },
  md: {
    padding: "px-4 py-2",
    // `text-md` is not a Tailwind class — this row silently had no type size.
    text: "text-base",
    gap: "gap-2",
    icon: "h-5 w-5",
  },
  lg: {
    padding: "px-5 py-2.5",
    text: "text-base",
    gap: "gap-2.5",
    icon: "h-5 w-5",
  },
  xl: {
    padding: "px-6 py-3",
    text: "text-lg",
    gap: "gap-3",
    icon: "h-6 w-6",
  },
};

type VariantConfig = {
  container?: string;
  list?: string;
  base: string;
  active: string;
  inactive: string;
  disabled: string;
  badge?: string;
  badgeActive?: string;
  badgeInactive?: string;
};

// Inactive-tab copy. Deliberately NOT part of the variant bases: utility
// rules sort alphabetically in the stylesheet, so a base `text-neutral-600`
// would beat a tone `text-blue-600` on the active tab (and lose to
// `text-orange-600`) - the selected tab text changed colour for roughly
// half the palette and quietly not for the rest. It goes on the inactive
// side only, where the active class cannot collide with it.
const neutralTextInactive = "text-neutral-600 dark:text-neutral-300";

// Corner radius for the `glass` / `liquid-glass` tab pills, mapped to the
// standard Tailwind `rounded-*` scale (the same set `MultiToggle` exposes). The
// default is `md`; a bare `rounded-full` made the glass tabs read as oversized
// pills, so it is a parameter now.
const TAB_RADIUS: Record<TabsRadius, string> = {
  none: "rounded-none",
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const buildVariantConfig = (
  variant: TabsVariant,
  color: TrueColor,
  orientation: TabsOrientation,
  hideUnderlineContainer?: boolean,
  radius: TabsRadius = "md",
): VariantConfig => {
  const tokens = getTabsColorTokens(color);
  const hoverAccentText = tokens.hoverText;
  const activeAccentText = tokens.activeText;
  const activeOnAccent = tokens.onAccentText;
  const accentBgStrong = tokens.accentBg;
  const subtleBg = tokens.subtleBg;
  const subtleHoverBg = tokens.subtleHoverBg;
  const badgeSubtle = tokens.badgeSubtle;
  const badgeStrong = tokens.badgeStrong;
  const badgeOnAccent = tokens.badgeOnAccent;
  const underlineActive = tokens.underlineActive;
  const segmentedContainer = tokens.segmentedContainer;

  switch (variant) {
    case "soft":
      return {
        container: joinClasses(
          "rounded-xl",
          subtleBg,
          orientation === "vertical" ? "p-1.5" : "p-1",
        ),
        list: "gap-1",
        base: joinClasses(
          "rounded-lg font-medium",
          hoverAccentText,
          "hover:bg-white/70 dark:hover:bg-white/10",
        ),
        active: joinClasses("shadow-sm", accentBgStrong, activeOnAccent),
        inactive: neutralTextInactive,
        disabled: "text-slate-300 dark:text-slate-600",
        badge: badgeSubtle,
        badgeActive: badgeOnAccent,
        badgeInactive: badgeSubtle,
      };
    case "pill":
      return {
        container: "gap-2",
        list: "gap-2",
        base: joinClasses(
          "rounded-full border border-transparent font-medium",
          hoverAccentText,
          "hover:border-current",
        ),
        active: joinClasses(
          accentBgStrong,
          activeOnAccent,
          "shadow-sm border-transparent",
        ),
        inactive: joinClasses(
          neutralTextInactive,
          "border-slate-200 dark:border-slate-700",
        ),
        disabled: "text-slate-300 dark:text-slate-600 border-transparent",
        badge: badgeSubtle,
        badgeActive: badgeOnAccent,
        badgeInactive: badgeSubtle,
      };
    case "segmented":
      return {
        container: joinClasses("rounded-lg border", segmentedContainer),
        list: classNames(
          "gap-0 overflow-hidden",
          orientation === "vertical" ? "flex-col" : "flex-row",
        ),
        base: joinClasses(
          "font-medium border border-transparent first:rounded-l-lg last:rounded-r-lg first:rounded-t-lg last:rounded-b-lg",
          hoverAccentText,
          orientation === "horizontal"
            ? "-ml-px first:ml-0"
            : "-mt-px first:mt-0",
        ),
        active: joinClasses(
          accentBgStrong,
          activeOnAccent,
          "shadow-sm border-transparent dark:shadow-none",
        ),
        inactive: joinClasses(
          neutralTextInactive,
          "bg-transparent",
          subtleHoverBg,
        ),
        disabled: "text-slate-300 dark:text-slate-600 border-transparent",
        badge: badgeSubtle,
        badgeActive: badgeOnAccent,
        badgeInactive: badgeSubtle,
      };
    case "minimal":
      return {
        container: "gap-2",
        list: "gap-0",
        base: joinClasses(
          "font-medium rounded-lg",
          hoverAccentText,
          "hover:bg-neutral-900/5 dark:hover:bg-neutral-100/10",
          "px-2 py-1",
        ),
        active: joinClasses(activeAccentText, "font-medium "),
        inactive: neutralTextInactive,
        disabled: "text-slate-300 dark:text-slate-600",
        badge: badgeSubtle,
        badgeActive: badgeStrong,
        badgeInactive: badgeSubtle,
      };
    case "glass":
    case "liquid-glass":
      // The frosted fill, backdrop vibrancy, rim and specular are layered on in
      // the component (they depend on the glass sub-props), so this carries only
      // the structure and the state hook. On glass the active tab is marked by a
      // tone ring + specular, painted in the component; every tab already reads
      // in the control's own tone via `getGlassChromeClasses`.
      return {
        container: "gap-1",
        list: orientation === "vertical" ? "gap-1.5" : "gap-1",
        base: joinClasses(TAB_RADIUS[radius], "font-medium"),
        active: "",
        inactive: "",
        disabled: "opacity-50",
        badge: badgeSubtle,
        badgeActive: badgeOnAccent,
        badgeInactive: badgeSubtle,
      };
    case "underline":
    default:
      return {
        container: hideUnderlineContainer ? undefined : "",
        list: classNames("gap-3", orientation === "vertical" && "gap-3"),
        base: joinClasses(
          "rounded-none font-medium",
          "pb-3 pt-2",
          "border-b-2 border-transparent",
          "after:absolute after:inset-x-1.5 after:bottom-0 after:h-[3px] after:rounded-full after:opacity-0 after:transition-all after:duration-200",
          tokens.underlineActive,
          "group-hover:after:opacity-100",
          hoverAccentText,
        ),
        active: joinClasses(
          activeAccentText,
          underlineActive,
          "after:opacity-100",
        ),
        inactive: neutralTextInactive,
        disabled: "text-slate-300 dark:text-slate-600 border-transparent",
        badge: badgeSubtle,
        badgeActive: badgeStrong,
        badgeInactive: badgeSubtle,
      };
  }
};

const Tabs: React.FC<TabsProps> = ({
  items,
  value,
  defaultValue,
  onChange,
  variant = "underline",
  size = "md",
  color = "blue",
  orientation = "horizontal",
  justify = "start",
  fullWidth = false,
  className,
  listClassName,
  allowReselect = false,
  panelIdPrefix = "tab-panel",
  showDividers = false,
  hideUnderlineContainer = false,
  containerClassName,
  panelClassName,
  vibrancy = "medium",
  glassOpacity = "frosted",
  specularMode = "none",
  radius = "md",
  actionsColor = "auto",
}) => {
  const renderIcon = useIconRenderer();
  // Actions follow the tabs' tone unless pinned; accent IconButtons inherit
  // their glyph colour from the container, so the tone lives there.
  const actionsTone: TrueColor = actionsColor === "auto" ? color : actionsColor;
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue ?? items[0]?.id,
  );
  const activeId = value ?? internalValue;

  // Keyboard navigation for the tablist. Roving tabindex without arrow keys
  // is the half-finished version of the ARIA pattern: Tab can land on the
  // selected tab, and then the control is a dead end. Arrow keys select
  // (the APG's default "automatic activation"), skipping disabled tabs and
  // wrapping at the ends; Home/End jump. Focus follows the selection — which
  // in controlled mode only happens once the owner accepts the change, so
  // the focus request is deferred to after the paint rather than forced.
  const tabRefs = useRef(new Map<string, HTMLButtonElement | null>());
  const pendingFocusRef = useRef(false);

  const selectTab = (item: TabItem) => {
    if (item.disabled) {
      return;
    }
    if (!allowReselect && item.id === activeId) {
      return;
    }
    if (value === undefined) {
      setInternalValue(item.id);
    }
    onChange?.(item.id, item);
  };

  useEffect(() => {
    if (pendingFocusRef.current) {
      pendingFocusRef.current = false;
      if (activeId) {
        const node = tabRefs.current.get(activeId);
        node?.focus();
        // In a scrolled bar, focus must also bring the tab into view.
        node?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
      }
    }
  }, [activeId]);

  const handleTabListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const nextKeys =
      orientation === "vertical"
        ? ["ArrowDown", "ArrowRight"]
        : ["ArrowRight", "ArrowDown"];
    const prevKeys =
      orientation === "vertical"
        ? ["ArrowUp", "ArrowLeft"]
        : ["ArrowLeft", "ArrowUp"];
    const dir = nextKeys.includes(event.key)
      ? 1
      : prevKeys.includes(event.key)
        ? -1
        : event.key === "Home"
          ? "first"
          : event.key === "End"
            ? "last"
            : 0;
    if (!dir) {
      return;
    }
    event.preventDefault();
    const enabled = items.filter((item) => !item.disabled);
    if (enabled.length === 0) {
      return;
    }
    const currentIndex = enabled.findIndex((item) => item.id === activeId);
    let target: TabItem | undefined;
    if (dir === "first") {
      target = enabled[0];
    } else if (dir === "last") {
      target = enabled[enabled.length - 1];
    } else if (currentIndex === -1) {
      // Active tab is disabled (or gone): step in from the near end.
      target = enabled[0];
    } else {
      const step = dir === 1 ? 1 : -1;
      target = enabled[(currentIndex + step + enabled.length) % enabled.length];
    }
    if (!target || target.id === activeId) {
      // Wrap-around onto the same tab (a single enabled tab): keep focus.
      if (target) {
        tabRefs.current.get(target.id)?.focus();
      }
      return;
    }
    pendingFocusRef.current = true;
    selectTab(target);
  };

  useEffect(() => {
    if (value !== undefined) {
      return;
    }
    if (!items.some((item) => item.id === internalValue)) {
      setInternalValue(items[0]?.id);
    }
  }, [items, value, internalValue]);

  const config = useMemo(
    () =>
      buildVariantConfig(
        variant,
        color,
        orientation,
        hideUnderlineContainer,
        radius,
      ),
    [variant, color, orientation, hideUnderlineContainer, radius],
  );

  const sizeConfig = sizeStyles[size] ?? sizeStyles.md;
  const iconClasses = classNames("flex-shrink-0", sizeConfig.icon);

  // Glass variants. The shared glass helpers carry the frosted fill, backdrop
  // vibrancy, tone rim and (if set) the specular paint — the same treatment the
  // other controls use, so a glass tab bar drops onto a glass card coherently.
  const isGlass = variant === "glass" || variant === "liquid-glass";
  const blurClass =
    variant === "liquid-glass" ? "backdrop-blur-2xl" : "backdrop-blur-sm";
  const glassSurfaceClasses = isGlass
    ? classNames(
        blurClass,
        getGlassVibrancyClass(vibrancy),
        getGlassFillClass(color, glassOpacity),
        getGlassChromeClasses(color),
      )
    : null;
  // `ring-{color}-400/60` + `dark:ring-{color}-400/50` are pre-safelisted for
  // all 21 tones, so the selected tab's tone ring renders in every colour.
  const glassActiveRing = isGlass
    ? `ring-1 ring-inset ring-${color}-400/60 dark:ring-${color}-400/50`
    : null;
  const glassSpecular = isGlass ? getSpecularClasses(specularMode) : null;

  const shouldShowDividers =
    showDividers && (variant === "underline" || variant === "minimal");
  const baseList = classNames(
    "relative flex",
    orientation === "vertical" ? "flex-col" : "items-center",
    justify === "center" && orientation === "horizontal" && "justify-center",
    justify === "end" && orientation === "horizontal" && "justify-end",
    justify === "between" &&
      orientation === "horizontal" &&
      "justify-between w-full",
    fullWidth && "w-full",
    config.list,
    shouldShowDividers && "gap-0",
    listClassName,
  );

  const resolvedContainer =
    containerClassName !== undefined ? containerClassName : config.container;

  const rootClass = classNames(
    "tabs",
    "flex",
    orientation === "vertical" ? "flex-row h-full" : "flex-col h-full",
    "overflow-hidden min-h-0",
    resolvedContainer,
    className,
  );

  // The contextual actions of whichever tab is active. The spacer + actions
  // block is only rendered when there is something to pin to the end — otherwise
  // the `flex-grow` spacer eats all the free space and `justify` can never
  // distribute the tabs.
  const activeActions = items.find((item) => item.id === activeId)?.actions;
  const hasActions = (activeActions?.length ?? 0) > 0;

  const renderTabIcon = (icon: string | React.ReactElement | undefined) => {
    if (!icon) {
      return null;
    }

    if (typeof icon === "string") {
      return renderIcon(icon, undefined, iconClasses);
    }

    if (React.isValidElement<{ className?: string }>(icon)) {
      return React.cloneElement(icon, {
        className: classNames(iconClasses, icon.props.className),
      });
    }

    return <span className={iconClasses}>{icon}</span>;
  };

  const renderTabButtons = () =>
    items.map((item, index) => {
      const isActive = item.id === activeId;
      const isDisabled = item.disabled;
      const controlsId = `${panelIdPrefix}-${item.id}`;
      const baseClassesForItem = classNames(
        baseTabClasses,
        sizeConfig.padding,
        sizeConfig.text,
        sizeConfig.gap,
        focusRing(color),
        focusOffset,
        config.base,
        isActive ? config.active : config.inactive,
        isDisabled && config.disabled,
        fullWidth && "flex-1 justify-center",
        isGlass && glassSurfaceClasses,
        isGlass && isActive && glassActiveRing,
      );
      const showDividerAfter = shouldShowDividers && index < items.length - 1;

      return (
        <React.Fragment key={item.id}>
          <button
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={isActive}
            aria-controls={item.panel !== undefined ? controlsId : undefined}
            disabled={isDisabled}
            className={baseClassesForItem}
            onClick={() => selectTab(item)}
            tabIndex={isActive ? 0 : -1}
            ref={(node) => {
              tabRefs.current.set(item.id, node);
            }}
          >
            {isGlass && glassSpecular ? (
              <div
                aria-hidden="true"
                className={classNames(
                  "pointer-events-none absolute inset-0 rounded-[inherit]",
                  glassSpecular,
                )}
              />
            ) : null}
            {renderTabIcon(item.icon)}
            <span className="flex min-w-0 flex-col text-left">
              <span className="truncate">{item.label}</span>
              {item.description ? (
                <span className="mt-1 text-xs opacity-70">
                  {item.description}
                </span>
              ) : null}
            </span>
            {item.badge ? (
              <Badge count={item.badge} tone={item.badgeColor} />
            ) : null}
          </button>
          {showDividerAfter ? (
            <span
              aria-hidden="true"
              className={classNames(
                "pointer-events-none",
                orientation === "vertical"
                  ? "mx-0 my-2 h-[2px] rounded-full w-full bg-slate-200 dark:bg-neutral-100/2"
                  : "mx-2 h-5 rounded-full w-[2px] bg-slate-300 dark:bg-neutral-400",
              )}
            />
          ) : null}
        </React.Fragment>
      );
    });

  return (
    <div className={rootClass}>
      {orientation === "horizontal" ? (
        <div className={classNames(baseList, "min-w-0 flex-shrink-0 z-10")}>
          {/*
            The lanes are kit ScrollAreas with the `hover` variant — the same
            virtual bars every other scrollable in the kit shows, instead of a
            browser scrollbar only this one control grows. The viewport stays
            out of the tab order (`tabIndex={-1}`): the tabs own keyboard
            scrolling here (arrows + scrollIntoView), so a scroll stop between
            the bar and the actions would only be friction.
          */}
          <ScrollArea
            variant="hover"
            tabIndex={-1}
            className={classNames("min-w-0", hasActions ? "flex-1" : "w-full")}
          >
            <div
              role="tablist"
              tabIndex={0}
              aria-orientation={orientation}
              onKeyDown={handleTabListKeyDown}
              className={classNames(
                "flex min-w-full items-center",
                config.list,
                shouldShowDividers && "gap-0",
              )}
            >
              {renderTabButtons()}
            </div>
          </ScrollArea>
          {hasActions ? (
            <ScrollArea
              variant="hover"
              tabIndex={-1}
              className="max-w-tab-actions shrink-0"
            >
              <div
                id="tab-item-actions-end"
                className={classNames(
                  "flex items-center gap-1 pr-2",
                  `text-${actionsTone}-600 dark:text-${actionsTone}-400`,
                )}
              >
                {activeActions?.map((action, idx) =>
                  action.node ? (
                    <React.Fragment key={action.id ?? `tab-action-${idx}`}>
                      {action.node}
                    </React.Fragment>
                  ) : action.icon ? (
                    <IconButton
                      key={action.id ?? `tab-action-${idx}`}
                      color={action.color ?? actionsTone}
                      variant="ghost"
                      tooltip={
                        typeof action.label === "string"
                          ? action.label
                          : undefined
                      }
                      icon={action.icon}
                      size={size}
                      aria-pressed={action.active || undefined}
                      aria-label={
                        typeof action.label === "string"
                          ? action.label
                          : `Action ${idx + 1}`
                      }
                      onClick={action.onClick ?? (() => undefined)}
                      className={classNames(
                        action.active
                          ? getButtonActiveClasses(
                              "ghost",
                              action.color ?? actionsTone,
                            )
                          : undefined,
                      )}
                    />
                  ) : null,
                )}
              </div>
            </ScrollArea>
          ) : null}
        </div>
      ) : (
        /*
          Vertical: a column of its own — the tab lane scrolls (ScrollArea,
          `hover` variant), and the actions sit OUTSIDE the scroll: always
          visible below it, never cut at the fold. The panels keep the rest
          of the height untouched.
        */
        <div className="flex h-full min-h-0 flex-shrink-0 flex-col">
          <ScrollArea variant="hover" tabIndex={-1} className="min-h-0 flex-1">
            <div
              role="tablist"
              tabIndex={0}
              aria-orientation={orientation}
              onKeyDown={handleTabListKeyDown}
              className={classNames(
                "flex min-h-full flex-col",
                config.list,
                shouldShowDividers && "gap-0",
              )}
            >
              {renderTabButtons()}
            </div>
          </ScrollArea>
          {hasActions ? (
            <div
              id="tab-item-actions-end"
              className={classNames(
                "flex flex-shrink-0 items-center justify-end gap-1 p-2",
                `text-${actionsTone}-600 dark:text-${actionsTone}-400`,
              )}
            >
              {activeActions?.map((action, idx) =>
                action.node ? (
                  <React.Fragment key={action.id ?? `tab-action-${idx}`}>
                    {action.node}
                  </React.Fragment>
                ) : action.icon ? (
                  <IconButton
                    key={action.id ?? `tab-action-${idx}`}
                    color={action.color ?? actionsTone}
                    variant="ghost"
                    tooltip={
                      typeof action.label === "string"
                        ? action.label
                        : undefined
                    }
                    icon={action.icon}
                    size={size}
                    aria-pressed={action.active || undefined}
                    aria-label={
                      typeof action.label === "string"
                        ? action.label
                        : `Action ${idx + 1}`
                    }
                    onClick={action.onClick ?? (() => undefined)}
                    className={classNames(
                      action.active
                        ? getButtonActiveClasses(
                            "ghost",
                            action.color ?? actionsTone,
                          )
                        : undefined,
                    )}
                  />
                ) : null,
              )}
            </div>
          ) : null}
        </div>
      )}
      {items.map((item) => {
        if (item.panel === undefined) {
          return null;
        }
        const controlsId = `${panelIdPrefix}-${item.id}`;
        const isActive = item.id === activeId;
        return (
          <div
            key={controlsId}
            role="tabpanel"
            id={controlsId}
            aria-labelledby={`tab-${item.id}`}
            hidden={!isActive}
            aria-hidden={!isActive}
            className={classNames(
              // Panels scroll through the kit's own `ScrollArea` — the same
              // virtual overlay bars the tab lanes get, identical on every
              // browser. This replaces the old `-webkit-scrollbar` hope and
              // the colour-gradient overlay that "faded" content under the
              // tab bar: an opaque tint painted over the top edge, which
              // matched only a literally-white panel and clipped the first
              // row even when nothing could scroll above it.
              "focus:outline-none flex flex-1 min-h-0 flex-col",
              isActive ? panelClassName : "hidden",
            )}
          >
            <ScrollArea
              variant="hover"
              tabIndex={-1}
              className="min-h-0 flex-1"
              // The content wrapper is `table` (auto-height) for horizontal
              // overflow; `h-full` keeps the height chain unbroken for
              // panels that fill their tab (Chat's message list, for one).
              contentClassName="h-full"
            >
              {item.panel}
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
};

Tabs.displayName = "Tabs";

export default Tabs;
