import React, { useState } from "react";
import classNames from "classnames";
import Panel, { PanelProps } from "./Panel";
import { getPaddingClass } from "../theme/Theme";
import { useIconRenderer } from "../contexts/IconContext";

// Override specific props for CollapsiblePanel
export interface CollapsiblePanelProps
  extends Omit<
    PanelProps,
    "title" | "subtitle" | "actions" | "children" | "onToggle"
  > {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;

  defaultExpanded?: boolean;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  minExpandedHeight?: number | string;

  children: React.ReactNode;
  contentClassName?: string;
  contentMaxHeight?: number;
  /** When true, the expanded content grows to fill available space instead of scrolling. */
  fillHeight?: boolean;
}

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
  className,
  disabled,
  variant = "elevated",
  tone = "neutral",
  padding = "md",
  corner = "rounded-sm",
  hoverable = false,
  ...panelProps
}) => {
  const renderIcon = useIconRenderer();
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isControlled = typeof expanded === "boolean";
  const isExpanded = isControlled ? expanded : internalExpanded;

  const handleToggle = () => {
    if (disabled) return;
    const next = !isExpanded;
    if (!isControlled) setInternalExpanded(next);
    onToggle?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  const computedContentMaxHeight = `min(${contentMaxHeight ?? 320}px, 65vh)`;
  const resolvedPadding = getPaddingClass(padding);

  return (
    <Panel
      className={classNames(
        "transition-all duration-300",
        fillHeight && isExpanded ? "flex flex-col min-h-0" : "shrink-0",
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
      <div
        className={classNames(
          "flex flex-col w-full",
          fillHeight && isExpanded && "h-full",
        )}
      >
        {/* Header — div with button roles keeps actions (which may render their own <button>) out of a native <button>. */}
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          className={classNames(
            "flex w-full items-center gap-3 text-left focus:outline-none transition-opacity",
            resolvedPadding,
            disabled
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:opacity-80 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg",
          )}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isExpanded}
          aria-controls="collapsible-panel-content"
        >
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-sm font-semibold">{title}</span>
            {subtitle && <span className="text-xs opacity-70">{subtitle}</span>}
          </div>

          {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}

          <span
            className={classNames(
              "transition-transform duration-300",
              isExpanded ? "rotate-180" : "rotate-0",
            )}
          >
            {renderIcon("ArrowDown", "sm")}
          </span>
        </div>

        {/* Content Wrapper */}
        <div id="collapsible-panel-content" role="region" aria-label="panel content"
          className={classNames(
            "overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-in-out",
            fillHeight && isExpanded && "flex-1 min-h-0",
            isExpanded ? "opacity-100" : "max-h-0 opacity-0 m-0",
          )}
          style={{
            maxHeight:
              isExpanded && !fillHeight
                ? `calc(${computedContentMaxHeight} + ${typeof minExpandedHeight === "number" ? minExpandedHeight + "px" : minExpandedHeight || "0px"} + 4rem)`
                : isExpanded
                  ? undefined
                  : "0px",
          }}
        >
          <div
            className={classNames(
              "text-sm leading-relaxed",
              resolvedPadding,
              "pt-0",
              isExpanded && !fillHeight
                ? "overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent"
                : "overflow-hidden",
              contentClassName,
            )}
            style={{
              maxHeight:
                isExpanded && !fillHeight
                  ? computedContentMaxHeight
                  : undefined,
              minHeight: isExpanded ? minExpandedHeight : undefined,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default CollapsiblePanel;
