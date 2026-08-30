import React, { useId, useState } from "react";
import classNames from "classnames";
import Panel, { type PanelProps } from "./Panel";
import { useIconRenderer } from "../contexts/IconContext";
import { useSurfaceText } from "../contexts/SurfaceContext";
import {
  DEFAULT_SURFACE_CORNER,
  getSurfacePaddingClass,
  getSurfaceTriggerTokens,
} from "../theme/Theme";

export interface CollapsiblePanelProps
  extends Omit<
    PanelProps,
    "title" | "subtitle" | "actions" | "children" | "onToggle"
  > {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /**
   * Rendered at the right of the header, before the chevron. Clicks and key
   * presses inside it do not toggle the panel.
   */
  actions?: React.ReactNode;

  defaultExpanded?: boolean;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  minExpandedHeight?: number | string;

  children: React.ReactNode;
  contentClassName?: string;
  /** Height at which the content starts scrolling instead of growing. @default 320 */
  contentMaxHeight?: number;
  /** When true, the expanded content grows to fill available space instead of scrolling. */
  fillHeight?: boolean;
  /** Accessible name for the header when `title` is not a plain string. */
  headerLabel?: string;
}

const SCROLLBAR =
  "overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent";

interface CollapsibleBodyProps
  extends Pick<
    CollapsiblePanelProps,
    | "title"
    | "subtitle"
    | "actions"
    | "children"
    | "contentClassName"
    | "contentMaxHeight"
    | "minExpandedHeight"
    | "fillHeight"
    | "disabled"
    | "headerLabel"
  > {
  tone: NonNullable<PanelProps["tone"]>;
  padding: NonNullable<PanelProps["padding"]>;
  isExpanded: boolean;
  onToggle: () => void;
  contentId: string;
  headerId: string;
}

/**
 * Split out so it can read the surface context `Panel` publishes — a component
 * cannot consume a provider it renders itself.
 */
const CollapsibleBody: React.FC<CollapsibleBodyProps> = ({
  title,
  subtitle,
  actions,
  children,
  contentClassName,
  contentMaxHeight = 320,
  minExpandedHeight,
  fillHeight = false,
  disabled,
  headerLabel,
  tone,
  padding,
  isExpanded,
  onToggle,
  contentId,
  headerId,
}) => {
  const renderIcon = useIconRenderer();
  const surface = useSurfaceText();
  const trigger = getSurfaceTriggerTokens(tone);
  const inset = getSurfacePaddingClass(padding);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Only when the header itself has focus. Without this check, activating an
    // action button with Enter bubbled up here and toggled the panel too.
    if (event.target !== event.currentTarget) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      className={classNames(
        "flex w-full flex-col",
        fillHeight && isExpanded && "h-full",
      )}
    >
      {/* A div with a button role, not a native <button>: `actions` may render
          its own <button>, which is invalid nested inside one. */}
      <div
        id={headerId}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        aria-disabled={disabled || undefined}
        aria-label={headerLabel}
        onClick={disabled ? undefined : onToggle}
        onKeyDown={disabled ? undefined : handleKeyDown}
        className={classNames(
          // `items-start`, not `items-center`: with a subtitle the header is a
          // two-line stack, and centring floated the actions and chevron
          // between the lines, belonging to neither.
          "flex w-full items-start gap-3 rounded-[inherit] text-left transition",
          // The card continues below, so the header must not round off against
          // its own content.
          "rounded-b-none",
          inset,
          disabled
            ? "cursor-not-allowed opacity-60"
            : classNames("cursor-pointer", trigger.hover, trigger.focusRing),
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className={classNames("text-sm font-semibold", surface.heading)}>
            {title}
          </span>
          {subtitle && (
            <span className={classNames("text-xs", surface.muted)}>
              {subtitle}
            </span>
          )}
        </div>

        {/*
          One cluster, exactly the height of the title's line (`text-sm` →
          1.25rem) and centred within it, so the controls sit on the title row
          whether or not there is a subtitle underneath. A fixed height, not a
          minimum: anything taller than the line (the action button) centres by
          overflowing it evenly, which keeps the midpoints aligned.
        */}
        <div className="flex h-5 shrink-0 items-center gap-2">
          {actions && (
            // Stops both activation paths, not just the pointer one.
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- propagation guard for nested actions, not an interactive element
            <div
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              {actions}
            </div>
          )}

          <span
            className={classNames(
              // `flex`, or the inline box picks up descender space and stops
              // matching the icon's own height.
              "flex shrink-0 items-center transition-transform duration-300",
              surface.muted,
              isExpanded ? "rotate-180" : "rotate-0",
            )}
            aria-hidden="true"
          >
            {renderIcon("ArrowDown", "sm")}
          </span>
        </div>
      </div>

      {/*
        `grid-template-rows: 0fr → 1fr` animates to the content's natural height.
        The previous version transitioned `max-height` to
        `calc(min(320px, 65vh) + minExpandedHeight + 4rem)` — a guess with a
        magic 4rem of slack that either clipped tall content or left the panel
        coasting through empty space on the way open.
      */}
      <div
        className={classNames(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none",
          fillHeight && isExpanded && "min-h-0 flex-1",
          isExpanded ? "opacity-100" : "opacity-0",
        )}
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <div
          id={contentId}
          role="region"
          aria-labelledby={headerId}
          aria-hidden={!isExpanded || undefined}
          // `hidden` would be `display: none` and kill the transition, so the
          // collapsed region is inert instead: not focusable, not announced,
          // still animatable. Spread rather than passed directly so it type-checks
          // against React 18, where `inert` is not a known prop.
          {...(isExpanded ? {} : ({ inert: true } as Record<string, unknown>))}
          className={classNames("min-h-0 overflow-hidden", fillHeight && "flex")}
        >
          <div
            className={classNames(
              "w-full text-sm leading-relaxed",
              surface.body,
              inset,
              "pt-0",
              isExpanded && !fillHeight ? SCROLLBAR : "overflow-hidden",
              contentClassName,
            )}
            style={{
              maxHeight:
                isExpanded && !fillHeight
                  ? `min(${contentMaxHeight}px, 65vh)`
                  : undefined,
              minHeight: isExpanded ? minExpandedHeight : undefined,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title,
  subtitle,
  actions,
  defaultExpanded = false,
  expanded,
  onToggle,
  children,
  contentClassName,
  contentMaxHeight = 320,
  minExpandedHeight,
  fillHeight = false,
  headerLabel,
  className,
  disabled,
  variant = "elevated",
  tone = "neutral",
  padding = "md",
  corner = DEFAULT_SURFACE_CORNER,
  hoverable = false,
  ...panelProps
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = typeof expanded === "boolean";
  const isExpanded = isControlled ? expanded : internalExpanded;

  // `useId`, not a constant. The ids were hardcoded strings, so two panels on
  // one page produced duplicate ids and every header's `aria-controls` pointed
  // at the first panel's content.
  const baseId = useId();
  const headerId = `${baseId}-header`;
  const contentId = `${baseId}-content`;

  const handleToggle = () => {
    if (disabled) return;
    const next = !isExpanded;
    if (!isControlled) setInternalExpanded(next);
    onToggle?.(next);
  };

  return (
    <Panel
      className={classNames(
        "transition-all duration-300",
        fillHeight && isExpanded ? "flex min-h-0 flex-col" : "shrink-0",
        className,
      )}
      variant={variant}
      tone={tone}
      padding="none"
      corner={corner}
      disabled={disabled}
      hoverable={hoverable}
      scrollable={false}
      {...panelProps}
    >
      <CollapsibleBody
        title={title}
        subtitle={subtitle}
        actions={actions}
        contentClassName={contentClassName}
        contentMaxHeight={contentMaxHeight}
        minExpandedHeight={minExpandedHeight}
        fillHeight={fillHeight}
        disabled={disabled}
        headerLabel={headerLabel}
        tone={tone}
        padding={padding}
        isExpanded={isExpanded}
        onToggle={handleToggle}
        contentId={contentId}
        headerId={headerId}
      >
        {children}
      </CollapsibleBody>
    </Panel>
  );
};

CollapsiblePanel.displayName = "CollapsiblePanel";

export default CollapsiblePanel;
