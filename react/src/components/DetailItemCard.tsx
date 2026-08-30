import React, { useId, useState, type ReactNode } from "react";
import classNames from "classnames";
import IconButton from "./IconButton";
import Panel from "./Panel";
import { useIconRenderer } from "../contexts/IconContext";
import { useSurfaceText } from "../contexts/SurfaceContext";
import { DEFAULT_SURFACE_CORNER, getSurfaceTriggerTokens } from "../theme/Theme";
import type { PlainSurfaceVariant, TrueColor } from "../theme/Theme";
import type {
  PanelCorner,
  PanelPadding,
  PanelSpecularMode,
} from "./Panel";
import type { GlassOpacity, GlassVibrancy } from "../theme/glass";

/** Every container surface, plus `plain` for a bare row inside a list. */
export type DetailItemCardVariant = PlainSurfaceVariant;
export type DetailItemCardBadgesAlignment = "right" | "bottom" | "bottom-end";

export interface DetailItemCardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    // `onToggle` and `title` both exist on HTMLAttributes with different
    // meanings, and `onClick` here takes no event.
    "title" | "onClick" | "onToggle" | "color" | "children"
  > {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  /** Icon shown before the title. */
  icon?: string | React.ReactElement;
  badges?: ReactNode;
  /** @default "right" */
  badgesAlignment?: DetailItemCardBadgesAlignment;
  /** Expandable detail. Without it no toggle is shown. */
  children?: ReactNode;

  defaultExpanded?: boolean;
  /** Controlled expansion. Pair with `onToggle`. */
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  /** Makes the whole row activatable, keyboard included. */
  onClick?: () => void;
  disabled?: boolean;

  // ── Surface ───────────────────────────────────────────────────────────────
  /** @default "plain" — this is normally a row inside a list. */
  variant?: DetailItemCardVariant;
  tone?: TrueColor;
  corner?: PanelCorner;
  padding?: PanelPadding;
  glassOpacity?: GlassOpacity;
  vibrancy?: GlassVibrancy;
  specularMode?: PanelSpecularMode;
}

interface DetailBodyProps
  extends Omit<
    DetailItemCardProps,
    // Everything the wrapper consumes: what is left is spread onto the row.
    | "variant"
    | "corner"
    | "padding"
    | "glassOpacity"
    | "vibrancy"
    | "specularMode"
    | "className"
    | "defaultExpanded"
    | "expanded"
    | "onToggle"
  > {
  tone: TrueColor;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

/**
 * Split out so it can read the surface context `Panel` publishes — a component
 * cannot consume a provider it renders itself.
 */
const DetailBody: React.FC<DetailBodyProps> = ({
  title,
  subtitle,
  description,
  icon,
  badges,
  badgesAlignment = "right",
  children,
  onClick,
  disabled = false,
  tone,
  isExpanded,
  onToggleExpanded,
  ...rest
}) => {
  const renderIcon = useIconRenderer();
  const surface = useSurfaceText();
  const trigger = getSurfaceTriggerTokens(tone);

  const baseId = useId();
  const titleId = `${baseId}-title`;
  const detailId = `${baseId}-detail`;

  const hasDetails = Boolean(children);
  const interactive = Boolean(onClick) && !disabled;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Only when the row itself has focus. Without this check, activating the
    // expand toggle or a badge link with Enter would also fire the row's own
    // handler.
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    // Card-as-button: a native <button> cannot host the rich content
    // (title row, details block, nested controls) this card carries, so the
    // button role + tabindex + Enter/Space is the APG pattern; the focus
    // ring is on the card (trigger.focusRing).
    <div
      className={classNames(
        "flex w-full flex-col gap-2.5 rounded-[inherit]",
        // `onClick` used to sit on a plain div with no role, tabindex or key
        // handler — a whole row that no keyboard user could activate.
        interactive &&
          classNames("cursor-pointer", trigger.hover, trigger.focusRing),
        disabled && "cursor-not-allowed opacity-60",
      )}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-labelledby={interactive ? titleId : undefined}
      aria-disabled={disabled || undefined}
      // No `stopPropagation`: a row has no business swallowing a click that an
      // ancestor may also care about.
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      {...rest}
    >
      <div className="flex flex-1 flex-row items-center justify-between gap-1.5">
        {hasDetails && (
          <IconButton
            // Was a `+` / `−` text glyph with a `rotate-0 : rotate-0` ternary —
            // a transition that could never move. This is the same rotating
            // chevron every other disclosure in the kit uses.
            icon="ArrowDown"
            variant="ghost"
            color={tone}
            size="xs"
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              onToggleExpanded();
            }}
            aria-expanded={isExpanded}
            aria-controls={detailId}
            srLabel={isExpanded ? "Collapse details" : "Expand details"}
            iconClassName={classNames(
              "transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
            className="shrink-0"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col leading-normal">
          <div className="flex min-w-0 items-center gap-2">
            {icon && (
              <span className={classNames("shrink-0", surface.muted)}>
                {renderIcon(icon, "sm")}
              </span>
            )}
            <span
              id={titleId}
              className={classNames("truncate text-base", surface.heading)}
            >
              {title}
            </span>
          </div>
          {subtitle && (
            <span className={classNames("text-xs font-semibold", surface.muted)}>
              {subtitle}
            </span>
          )}
          {description && (
            <span className={classNames("text-xs", surface.muted)}>
              {description}
            </span>
          )}
          {badgesAlignment !== "right" && badges && (
            <div
              className={classNames(
                "mt-1 flex flex-row flex-wrap gap-1",
                badgesAlignment === "bottom-end" ? "justify-end" : "justify-start",
              )}
            >
              {badges}
            </div>
          )}
        </div>

        {badgesAlignment === "right" && badges && (
          <div className="flex shrink-0 flex-col items-end gap-1">{badges}</div>
        )}
      </div>

      {hasDetails && (
        // `grid-template-rows: 0fr → 1fr` animates to the content's natural
        // height; the previous version simply unmounted the detail, so opening
        // and closing snapped.
        <div
          className={classNames(
            "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none",
            isExpanded ? "opacity-100" : "opacity-0",
          )}
          style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
        >
          <div
            id={detailId}
            role="region"
            aria-labelledby={titleId}
            aria-hidden={!isExpanded || undefined}
            // Not `hidden`, which is `display: none` and would kill the
            // transition — inert keeps collapsed content unreachable instead.
            {...(isExpanded ? {} : ({ inert: true } as Record<string, unknown>))}
            className="min-h-0 overflow-hidden"
          >
            <div
              className={classNames(
                "flex flex-col gap-2.5 pb-0.5 text-sm",
                surface.body,
                // Aligns with the text column rather than a magic `px-[30px]`
                // that also indented the right edge.
                "ps-7.5",
              )}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItemCard: React.FC<DetailItemCardProps> = ({
  defaultExpanded = false,
  expanded,
  onToggle,
  variant = "plain",
  tone = "blue",
  corner = DEFAULT_SURFACE_CORNER,
  padding = "sm",
  glassOpacity,
  vibrancy,
  specularMode,
  className,
  ...rest
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = typeof expanded === "boolean";
  const isExpanded = isControlled ? expanded : internalExpanded;

  const handleToggleExpanded = () => {
    const next = !isExpanded;
    if (!isControlled) setInternalExpanded(next);
    onToggle?.(next);
  };

  const body = (
    <DetailBody
      tone={tone}
      isExpanded={isExpanded}
      onToggleExpanded={handleToggleExpanded}
      {...rest}
    />
  );

  if (variant === "plain") {
    return <div className={classNames("w-full", className)}>{body}</div>;
  }

  return (
    <Panel
      variant={variant}
      tone={tone}
      corner={corner}
      padding={padding}
      glassOpacity={glassOpacity}
      vibrancy={vibrancy}
      specularMode={specularMode}
      scrollable={false}
      className={className}
    >
      {body}
    </Panel>
  );
};

DetailItemCard.displayName = "DetailItemCard";

export default DetailItemCard;
