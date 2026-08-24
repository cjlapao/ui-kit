import React, { useId } from "react";
import classNames from "classnames";

import Button, {
  type ButtonVariant,
  type ButtonSize,
  type ButtonColor,
} from "./Button";
import Panel from "./Panel";
import { useSurfaceText } from "../contexts/SurfaceContext";
import { useIconRenderer } from "../contexts/IconContext";
import {
  DEFAULT_SURFACE_CORNER,
  SURFACE_VARIANTS,
  type ControlSize,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "../theme/Theme";
import type {
  GlassOpacity,
  GlassVibrancy,
  SpecularMode,
} from "../theme/glass";

/**
 * Every container surface, plus `plain` for an empty state dropped inside a
 * card the app already owns — the common case, and previously only reachable
 * by setting `disableBorder` *and* `transparentBackground` together.
 */
export const EMPTY_STATE_VARIANTS = [...SURFACE_VARIANTS, "plain"] as const;
export type EmptyStateVariant = (typeof EMPTY_STATE_VARIANTS)[number];

export type EmptyStateTone = TrueColor;
export type EmptyStateSize = ControlSize;
/** @deprecated Use `size`, which now drives the whole type scale. */
export type TextSize = ControlSize;

type EmptyStateSizeTokens = {
  /** Explicit icon dimensions — an empty state's glyph is far larger than a
   *  control's, so it does not sit on the shared icon scale. */
  icon: string;
  /** Padding of the tinted disc behind the icon. */
  iconPad: string;
  title: string;
  subtitle: string;
  gap: string;
  /** Space between the copy and the action row. */
  actionGap: string;
  action: ButtonSize;
};

const SIZE_STYLES: Record<EmptyStateSize, EmptyStateSizeTokens> = {
  xs: {
    icon: "h-8 w-8",
    iconPad: "p-2",
    title: "text-sm",
    subtitle: "text-xs",
    gap: "gap-2",
    actionGap: "mt-3",
    action: "xs",
  },
  sm: {
    icon: "h-10 w-10",
    iconPad: "p-2.5",
    title: "text-base",
    subtitle: "text-xs",
    gap: "gap-2.5",
    actionGap: "mt-4",
    action: "xs",
  },
  md: {
    icon: "h-12 w-12",
    iconPad: "p-3",
    title: "text-lg",
    subtitle: "text-sm",
    gap: "gap-3",
    actionGap: "mt-4",
    action: "sm",
  },
  lg: {
    icon: "h-14 w-14",
    iconPad: "p-3.5",
    title: "text-xl",
    subtitle: "text-base",
    gap: "gap-3.5",
    actionGap: "mt-5",
    action: "md",
  },
  xl: {
    icon: "h-16 w-16",
    iconPad: "p-4",
    title: "text-2xl",
    subtitle: "text-lg",
    gap: "gap-4",
    actionGap: "mt-6",
    action: "md",
  },
};

export interface EmptyStateProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    "title" | "color" | "children"
  > {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;

  /** @default "outlined" */
  variant?: EmptyStateVariant;
  /** @default "neutral" */
  tone?: EmptyStateTone;
  /** Alias for `tone`, matching `Panel`. */
  color?: TrueColor;
  /** Corner radius, on the shared container scale. */
  corner?: SurfaceCorner;
  /** Container padding, on the shared container scale. @default "lg" */
  padding?: SurfacePadding;
  /**
   * Density — icon, type scale, gaps and the action button's default size.
   * @default "md"
   */
  size?: EmptyStateSize;
  /** @deprecated Use `size`. Ignored when `size` is set. */
  textSize?: ControlSize;

  /**
   * The dashed rule that marks a drop zone or a slot waiting to be filled.
   * Drawn as an `outline` rather than a border so it works on every variant,
   * including the ring-based ones, without fighting the card's own border.
   * @default true
   */
  dashed?: boolean;

  /**
   * A registry icon name or a node. The default used to be `"Plus"`, which is
   * not in the registry — so every default empty state rendered CustomIcon's
   * missing-icon placeholder rather than a glyph. The name is `"Add"`.
   * @default "Add"
   */
  icon?: string | React.ReactElement;
  /** @default true */
  showIcon?: boolean;
  /** Overrides the dimensions the `size` would have chosen. */
  iconSize?: string;
  /** Overrides the tone for the glyph only. */
  iconColor?: TrueColor;
  /**
   * Tinted disc behind the glyph. It used to be a square `dark:bg-white/5`
   * with no light-mode partner, so it appeared out of nowhere in dark mode.
   * @default true
   */
  iconBackground?: boolean;

  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: ButtonVariant;
  actionColor?: ButtonColor;
  actionSize?: ButtonSize;
  actionLeadingIcon?: string | React.ReactElement;
  /** Arbitrary footer content, in place of the generated button. */
  actions?: React.ReactNode;

  fullWidth?: boolean;
  fullHeight?: boolean;

  /** @deprecated Use `variant="plain"`. */
  disableBorder?: boolean;
  /** @deprecated Use `variant="plain"`. */
  transparentBackground?: boolean;

  /** Glass fill transparency, for the see-through variants. */
  glassOpacity?: GlassOpacity;
  /** Backdrop vibrancy, for the see-through variants. */
  vibrancy?: GlassVibrancy;
  /** Specular highlight, for the see-through variants. */
  specularMode?: SpecularMode;
}

interface EmptyStateBodyProps
  extends Pick<
    EmptyStateProps,
    | "title"
    | "subtitle"
    | "icon"
    | "showIcon"
    | "iconBackground"
    | "actionLabel"
    | "onAction"
    | "actionVariant"
    | "actionColor"
    | "actionSize"
    | "actionLeadingIcon"
    | "actions"
  > {
  titleId: string;
  tone: TrueColor;
  iconTone: TrueColor;
  iconClass: string;
  sizeToken: EmptyStateSizeTokens;
}

/**
 * Split out so it can read `useSurfaceText()`. A component cannot consume a
 * provider it renders itself, and the copy colour has to come from the surface
 * — the old hardcoded `text-{tone}-700` vanished on glass over a photograph.
 */
const EmptyStateBody: React.FC<EmptyStateBodyProps> = ({
  title,
  subtitle,
  icon,
  showIcon,
  iconBackground,
  actionLabel,
  onAction,
  actionVariant,
  actionColor,
  actionSize,
  actionLeadingIcon,
  actions,
  titleId,
  tone,
  iconTone,
  iconClass,
  sizeToken,
}) => {
  const renderIcon = useIconRenderer();
  const surfaceText = useSurfaceText();

  const hasTitle = title !== undefined && title !== null && title !== "";
  const hasSubtitle =
    subtitle !== undefined && subtitle !== null && subtitle !== "";
  // The action used to require `actionLabel` *and* `onAction` together, so a
  // label with a handler resolved later rendered nothing at all.
  const actionNode =
    actions ??
    (actionLabel ? (
      <Button
        size={actionSize ?? sizeToken.action}
        variant={actionVariant ?? "soft"}
        color={actionColor ?? tone}
        onClick={onAction}
        leadingIcon={actionLeadingIcon}
      >
        {actionLabel}
      </Button>
    ) : null);

  return (
    <div
      className={classNames(
        "flex w-full flex-col items-center justify-center text-center",
        sizeToken.gap,
      )}
    >
      {showIcon && icon && (
        <div
          className={classNames(
            "flex items-center justify-center rounded-full",
            sizeToken.iconPad,
            `text-${iconTone}-500 dark:text-${iconTone}-300`,
            iconBackground &&
              `bg-${iconTone}-100/70 dark:bg-${iconTone}-500/15`,
          )}
        >
          {/* One sizing path. The old code passed the size class *and* the icon
              scale, and its `isValidElement` branch skipped both. */}
          {renderIcon(icon, undefined, iconClass)}
        </div>
      )}

      {(hasTitle || hasSubtitle) && (
        <div className="space-y-1">
          {hasTitle && (
            <p
              id={titleId}
              className={classNames(
                "font-semibold",
                sizeToken.title,
                surfaceText.heading,
              )}
            >
              {title}
            </p>
          )}
          {hasSubtitle && (
            <p
              className={classNames(
                // `break-all` split ordinary prose mid-word. Only a long
                // unbroken token needs breaking, which is `break-words`.
                "mx-auto max-w-prose leading-relaxed break-words",
                sizeToken.subtitle,
                surfaceText.description,
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {actionNode && (
        <div className={classNames("flex flex-wrap justify-center gap-2", sizeToken.actionGap)}>
          {actionNode}
        </div>
      )}
    </div>
  );
};

const EmptyState = React.forwardRef<HTMLElement, EmptyStateProps>(
  (
    {
      title,
      subtitle,
      variant = "outlined",
      tone,
      color,
      corner = DEFAULT_SURFACE_CORNER,
      padding = "lg",
      size,
      textSize,
      dashed = true,
      icon = "Add",
      showIcon = true,
      iconSize,
      iconColor,
      iconBackground = true,
      actionLabel,
      onAction,
      actionVariant,
      actionColor,
      actionSize,
      actionLeadingIcon,
      actions,
      fullWidth = false,
      fullHeight = false,
      disableBorder = false,
      transparentBackground = false,
      glassOpacity,
      vibrancy,
      specularMode,
      className,
      ...rest
    },
    ref,
  ) => {
    const titleId = useId();

    const effectiveTone = tone ?? color ?? "neutral";
    const iconTone = iconColor ?? effectiveTone;
    const effectiveSize = size ?? textSize ?? "md";
    const sizeToken = SIZE_STYLES[effectiveSize] ?? SIZE_STYLES.md;

    // The two deprecated flags together meant "no card at all", which is what
    // `plain` is. Either one alone left a half-drawn surface.
    const effectiveVariant: EmptyStateVariant =
      disableBorder && transparentBackground ? "plain" : variant;
    const isPlain = effectiveVariant === "plain";

    const body = (
      <EmptyStateBody
        title={title}
        subtitle={subtitle}
        icon={icon}
        showIcon={showIcon}
        iconBackground={iconBackground}
        actionLabel={actionLabel}
        onAction={onAction}
        actionVariant={actionVariant}
        actionColor={actionColor}
        actionSize={actionSize}
        actionLeadingIcon={actionLeadingIcon}
        actions={actions}
        titleId={titleId}
        tone={effectiveTone}
        iconTone={iconTone}
        iconClass={iconSize ?? sizeToken.icon}
        sizeToken={sizeToken}
      />
    );

    // An `outline` rather than a `border`: it sits on top of whatever the
    // variant paints, needs no width to be reconciled against the card's own
    // `border`, and takes no space in the box model.
    const dashedClass =
      dashed && !isPlain
        ? classNames(
            "outline-2 outline-dashed -outline-offset-2",
            `outline-${effectiveTone}-300 dark:outline-${effectiveTone}-500/40`,
          )
        : undefined;

    const shared = {
      className: classNames(
        "items-center justify-center",
        fullHeight && "h-full",
        dashedClass,
        className,
      ),
      "aria-labelledby": title ? titleId : undefined,
      ...rest,
    };

    if (isPlain) {
      return (
        <section
          ref={ref}
          {...shared}
          className={classNames(
            "flex w-full flex-col",
            fullHeight && "h-full",
            className,
          )}
        >
          {body}
        </section>
      );
    }

    return (
      <Panel
        ref={ref}
        variant={effectiveVariant as SurfaceVariant}
        tone={effectiveTone}
        corner={corner}
        padding={padding}
        fullWidth={fullWidth}
        glassOpacity={glassOpacity}
        vibrancy={vibrancy}
        specularMode={specularMode}
        scrollable={false}
        bodyClassName="flex flex-1 flex-col items-center justify-center"
        flexBody
        {...shared}
      >
        {body}
      </Panel>
    );
  },
);

EmptyState.displayName = "EmptyState";

export default EmptyState;
