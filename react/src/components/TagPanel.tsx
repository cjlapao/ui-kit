import React, { useState } from "react";
import classNames from "classnames";
import { Section, type SectionSize, type SectionVariant } from "./Section";
import { Pill, type PillVariant, type PillSize } from "./Pill";
import Button from "./Button";
import EmptyState from "./EmptyState";
import { type TrueColor } from "../theme/Theme";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TagPanelTag {
  id?: string;
  label: string;
  /** Pill tone. @default "neutral" */
  tone?: TrueColor;
  /** Pill variant. @default "soft" */
  variant?: PillVariant;
  /** Pill size. Falls back to the panel's own `tagSize`. */
  size?: PillSize;
  /** Optional leading icon inside the pill. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export interface TagPanelProps {
  /** Section heading. Omit entirely to hide the header. */
  title?: React.ReactNode;
  /** Optional secondary line below the title. */
  subtitle?: React.ReactNode;
  /** Tags to render as pills. */
  tags: TagPanelTag[];
  /**
   * Maximum number of pills shown before a `+N` overflow pill appears.
   * Set to `0` to always show all. @default 5
   */
  tagLimit?: number;
  /** Tone used for the `+N` overflow pill. @default "neutral" */
  overflowTone?: TrueColor;
  /** Rendered when `tags` is empty. */
  emptyState?: React.ReactNode;
  /** Copy for the default empty state. @default "No tags" */
  emptyMessage?: string;
  /** Optional actions rendered on the right side of the section header. */
  actions?: React.ReactNode;
  /** Controls header padding and font size. @default "md" */
  size?: SectionSize;
  /**
   * Size of the pills. Separate from `size`, which is the *section header's*
   * scale — the two were conflated, so the overflow pill was handed a
   * `SectionSize` where a `PillSize` was expected.
   * @default "sm"
   */
  tagSize?: PillSize;
  /** Visual style of the section header. @default "uppercase" */
  variant?: SectionVariant;
  /** Extra classes for the root element. */
  className?: string;
  /** Extra classes for the tags container. */
  bodyClassName?: string;
  /** Remove all padding from the section header. */
  noPadding?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const TagPanel: React.FC<TagPanelProps> = ({
  title,
  subtitle,
  tags,
  tagLimit = 5,
  overflowTone = "neutral",
  emptyState,
  emptyMessage = "No tags",
  actions,
  size,
  tagSize = "sm",
  variant,
  className,
  bodyClassName,
  noPadding,
}) => {
  const [expanded, setExpanded] = useState(false);

  const limited = tagLimit > 0 && !expanded && tags.length > tagLimit;
  const visible = limited ? tags.slice(0, tagLimit) : tags;
  const overflowCount = tags.length - tagLimit;

  return (
    <div className={classNames("flex flex-col", className)}>
      {title != null && (
        <Section
          title={title}
          subtitle={subtitle}
          actions={actions}
          size={size}
          variant={variant}
          noPadding={noPadding}
        />
      )}

      <div
        className={classNames(
          "flex flex-wrap items-center gap-1 px-0 pb-1",
          bodyClassName,
        )}
      >
        {tags.length === 0 ? (
          (emptyState ?? (
            // Was a bare italic `<span className="text-neutral-400 …">`.
            <EmptyState variant="plain" size="sm" title={emptyMessage} />
          ))
        ) : (
          <>
            {visible.map((tag, i) => (
              <Pill
                key={tag.id ?? `${tag.label}-${i}`}
                tone={tag.tone ?? "neutral"}
                variant={tag.variant ?? "soft"}
                size={tag.size ?? tagSize}
                icon={tag.icon}
              >
                {tag.children ?? tag.label}
              </Pill>
            ))}

            {limited && (
              // Was a bare `<button>` wrapping a Pill — a nested interactive
              // with no focus ring of its own and no accessible affordance.
              <Button
                variant="clear"
                size="xs"
                color={overflowTone}
                onClick={() => setExpanded(true)}
                aria-label={`Show ${overflowCount} more tags`}
              >
                <Pill tone={overflowTone} variant="soft" size={tagSize}>
                  +{overflowCount}
                </Pill>
              </Button>
            )}

            {expanded && tagLimit > 0 && tags.length > tagLimit && (
              <Button
                variant="link"
                size="xs"
                color={overflowTone}
                onClick={() => setExpanded(false)}
              >
                Show less
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TagPanel;
