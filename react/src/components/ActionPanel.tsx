import classNames from "classnames";
import React, { useId } from "react";

import { useIconRenderer } from "../contexts/IconContext";
import {
  DEFAULT_SURFACE_CORNER,
  TRUE_COLOR_DOT_CLASSES,
  getCompactSurfacePaddingClass,
  getControlSizeTokens,
  getPanelToneStyles,
  getSurfaceTextTokens,
  type ControlSize,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "../theme/Theme";
import Panel, { type PanelProps } from "./Panel";

export const ACTION_PANEL_ACTION_LAYOUTS = ["inline", "stacked"] as const;
export type ActionPanelActionLayout =
  (typeof ACTION_PANEL_ACTION_LAYOUTS)[number];

export interface ActionPanelProps extends Omit<
  PanelProps,
  | "actions"
  | "actionLayout"
  | "badge"
  | "children"
  | "description"
  | "descriptionClassName"
  | "media"
  | "mediaPlacement"
  | "padding"
  | "subtitle"
  | "subtitleClassName"
  | "title"
  | "titleClassName"
> {
  /** Optional registry icon name or custom React icon. */
  icon?: string | React.ReactElement;
  /** Icon column dimensions, identical to IconButton's xs–xl boxes. @default "sm" */
  iconSize?: ControlSize;
  /** Extra classes on the icon box. */
  iconClassName?: string;
  /** Main line. Strings receive the component's title typography; nodes keep their own composition. */
  title?: React.ReactNode;
  titleClassName?: string;
  /** Supporting line directly beneath the title. */
  subtitle?: React.ReactNode;
  subtitleClassName?: string;
  /** Longer copy or composed content beneath the subtitle. */
  description?: React.ReactNode;
  descriptionClassName?: string;
  /** Controls the content typography and spacing without changing the icon box. @default "sm" */
  size?: ControlSize;
  /** Compact inset scale intended for row-sized surfaces. @default "xs" */
  padding?: SurfacePadding;
  /** Paint a non-layout-shifting accent at the leading edge. @default true */
  accent?: boolean;
  /** Accent edge and icon-chip colour. Defaults to `tone`. */
  accentColor?: TrueColor;
  /** Consumer-owned controls, links, menus, or compact list items. */
  actions?: readonly React.ReactNode[];
  /** Arrange action items beside one another or in a vertical stack. @default "inline" */
  actionLayout?: ActionPanelActionLayout;
  actionClassName?: string;
  contentClassName?: string;
  /** Shared Panel surface. @default "elevated" */
  variant?: SurfaceVariant;
  /** Shared Panel radius. */
  corner?: SurfaceCorner;
}

type ActionPanelSizeTokens = {
  layoutGap: string;
  contentGap: string;
  copyGap: string;
  title: string;
  subtitle: string;
  description: string;
  actionGap: string;
};

const SIZE_TOKENS: Record<ControlSize, ActionPanelSizeTokens> = {
  xs: {
    layoutGap: "gap-2",
    contentGap: "gap-2",
    copyGap: "gap-0.5",
    title: "text-xs",
    subtitle: "text-[11px]",
    description: "text-[11px]",
    actionGap: "gap-1",
  },
  sm: {
    layoutGap: "gap-2.5",
    contentGap: "gap-2.5",
    copyGap: "gap-0.5",
    title: "text-sm",
    subtitle: "text-xs",
    description: "text-xs",
    actionGap: "gap-1.5",
  },
  md: {
    layoutGap: "gap-3",
    contentGap: "gap-3",
    copyGap: "gap-1",
    title: "text-base",
    subtitle: "text-sm",
    description: "text-sm",
    actionGap: "gap-2",
  },
  lg: {
    layoutGap: "gap-4",
    contentGap: "gap-3.5",
    copyGap: "gap-1.5",
    title: "text-lg",
    subtitle: "text-base",
    description: "text-sm",
    actionGap: "gap-2.5",
  },
  xl: {
    layoutGap: "gap-5",
    contentGap: "gap-4",
    copyGap: "gap-2",
    title: "text-xl",
    subtitle: "text-lg",
    description: "text-base",
    actionGap: "gap-3",
  },
};

const hasContent = (node: React.ReactNode): boolean =>
  node !== undefined && node !== null && node !== false && node !== "";

/**
 * A compact, composable surface for attention rows, quick actions, and short
 * lists. It deliberately carries no alert semantics: consumers choose
 * `role="alert"`, `role="status"`, or no live region according to context.
 */
const ActionPanel = React.forwardRef<HTMLElement, ActionPanelProps>(
  function ActionPanel(
    {
      icon,
      iconSize = "sm",
      iconClassName,
      title,
      titleClassName,
      subtitle,
      subtitleClassName,
      description,
      descriptionClassName,
      size = "sm",
      padding = "xs",
      accent = true,
      accentColor,
      actions = [],
      actionLayout = "inline",
      actionClassName,
      contentClassName,
      variant = "elevated",
      tone = "neutral",
      corner = DEFAULT_SURFACE_CORNER,
      scrollable = false,
      className,
      "aria-labelledby": ariaLabelledBy,
      ...panelProps
    },
    ref,
  ) {
    const renderIcon = useIconRenderer();
    const generatedTitleId = useId();
    const resolvedAccent = accentColor ?? tone;
    const palette = getPanelToneStyles(resolvedAccent);
    const surfaceText = getSurfaceTextTokens(variant);
    const sizeTokens = SIZE_TOKENS[size] ?? SIZE_TOKENS.sm;
    const iconTokens = getControlSizeTokens(iconSize);
    const actionNodes = React.Children.toArray(actions);
    const showsTitle = hasContent(title);
    const showsSubtitle = hasContent(subtitle);
    const showsDescription = hasContent(description);
    const titleId =
      ariaLabelledBy ?? (showsTitle ? generatedTitleId : undefined);

    return (
      <Panel
        ref={ref}
        variant={variant}
        tone={tone}
        padding="none"
        corner={corner}
        scrollable={scrollable}
        className={classNames("isolate", className)}
        aria-labelledby={titleId}
        {...panelProps}
      >
        {accent && (
          <span
            aria-hidden="true"
            data-action-panel-part="accent"
            className={classNames(
              "pointer-events-none absolute inset-y-0 left-0 z-10 w-1 rounded-l-[inherit]",
              TRUE_COLOR_DOT_CLASSES[resolvedAccent],
            )}
          />
        )}

        <div
          className={classNames(
            "relative z-0 flex min-w-0 flex-col sm:flex-row sm:items-start",
            getCompactSurfacePaddingClass(padding),
            sizeTokens.layoutGap,
            accent && "ml-1",
          )}
        >
          <div
            className={classNames(
              "flex min-w-0 flex-1 items-start",
              sizeTokens.contentGap,
            )}
          >
            {icon && (
              <div
                data-action-panel-part="icon"
                className={classNames(
                  "flex shrink-0 items-center justify-center rounded-lg",
                  iconTokens.box,
                  palette.subtleBg,
                  palette.heading,
                  iconClassName,
                )}
              >
                {renderIcon(icon, iconSize, iconTokens.icon)}
              </div>
            )}

            {(showsTitle || showsSubtitle || showsDescription) && (
              <div
                data-action-panel-part="content"
                className={classNames(
                  "flex min-w-0 flex-1 flex-col",
                  sizeTokens.copyGap,
                  contentClassName,
                )}
              >
                {showsTitle && (
                  <div
                    id={titleId}
                    data-action-panel-part="title"
                    className={classNames(
                      "min-w-0 font-semibold leading-snug",
                      sizeTokens.title,
                      surfaceText.heading,
                      titleClassName,
                    )}
                  >
                    {title}
                  </div>
                )}
                {showsSubtitle && (
                  <div
                    data-action-panel-part="subtitle"
                    className={classNames(
                      "min-w-0 font-medium leading-snug",
                      sizeTokens.subtitle,
                      surfaceText.description,
                      subtitleClassName,
                    )}
                  >
                    {subtitle}
                  </div>
                )}
                {showsDescription && (
                  <div
                    data-action-panel-part="description"
                    className={classNames(
                      "min-w-0 leading-relaxed",
                      sizeTokens.description,
                      surfaceText.muted,
                      descriptionClassName,
                    )}
                  >
                    {description}
                  </div>
                )}
              </div>
            )}
          </div>

          {actionNodes.length > 0 && (
            <div
              data-action-panel-part="actions"
              className={classNames(
                "flex shrink-0",
                actionLayout === "stacked"
                  ? "w-full flex-col items-stretch sm:w-auto"
                  : "flex-wrap items-center sm:justify-end",
                sizeTokens.actionGap,
                actionClassName,
              )}
            >
              {actionNodes}
            </div>
          )}
        </div>
      </Panel>
    );
  },
);

ActionPanel.displayName = "ActionPanel";

export default ActionPanel;
