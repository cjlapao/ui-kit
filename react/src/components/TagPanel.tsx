import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { Section, type SectionSize, type SectionVariant } from "./Section";
import { Pill, type PillVariant, type PillSize } from "./Pill";
import EmptyState from "./EmptyState";
import {
  CASCADE_EXPAND,
  PANE_EMPTY_STATE_SIZE,
  type TrueColor,
} from "../theme";
import { useKitT } from "../i18n";

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
   * Maximum number of pills shown before a `+N` overflow chip appears.
   * Set to `0` to always show all. @default 5
   */
  tagLimit?: number;
  /** Tone used for the `+N` overflow chip. @default "neutral" */
  overflowTone?: TrueColor;
  /** Rendered when `tags` is empty. */
  emptyState?: React.ReactNode;
  /** Copy for the default empty state. @default "No tags" (translated) */
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

/**
 * The pills' rhythm, in px — the same 4px the container `gap-1` used to
 * give. Margins replace the gap because the collapsed overflow pills are
 * width-zero flow items, and a `gap` would hand each of them a ghost slot
 * at the fold.
 */
const GAP_PX = 4;

/**
 * A section of tags as pills, with a `+N` overflow — unfolding the
 * `ColorSwatches` way: the overflow pills are always mounted, expanding
 * cascades them in left to right, and retracting steps them away right to
 * left before the condensed layout commits. The chip that toggles it is one
 * control in both directions (`aria-expanded`), its `+` tilting into a `×`
 * while open.
 */
export const TagPanel: React.FC<TagPanelProps> = ({
  title,
  subtitle,
  tags,
  tagLimit = 5,
  overflowTone = "neutral",
  emptyState,
  emptyMessage,
  actions,
  size,
  tagSize = "sm",
  variant,
  className,
  bodyClassName,
  noPadding,
}) => {
  const t = useKitT();
  const regionId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const holdRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [expanded, setExpanded] = useState(false);
  // The retract mirrors the unfold: the expanded layout is held while the
  // overflow pills step away, and the condensed geometry — zeroed widths,
  // the chip back at the fold — commits only when the hold ends.
  const [collapsing, setCollapsing] = useState(false);
  const [contentH, setContentH] = useState(0);
  const [rowPx, setRowPx] = useState(0);

  const measure = () => {
    const el = contentRef.current;
    if (!el) return;
    setContentH(el.scrollHeight);
    const first = el.firstElementChild as HTMLElement | null;
    setRowPx(first ? first.getBoundingClientRect().height + GAP_PX : 0);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(measure, [tags.length, tagLimit, tagSize]);
  useEffect(() => {
    const el = contentRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => () => clearTimeout(holdRef.current), []);

  const overflows = tagLimit > 0 && tags.length > tagLimit;
  const overflowCount = tags.length - tagLimit;
  const layoutOpen = expanded || collapsing;

  const reveal = (open: boolean) => {
    clearTimeout(holdRef.current);
    if (open) {
      setCollapsing(false);
      setExpanded(true);
    } else {
      setExpanded(false);
      setCollapsing(true);
      holdRef.current = setTimeout(
        () => setCollapsing(false),
        CASCADE_EXPAND.holdMs,
      );
    }
  };

  // The clip animates between exactly one wrapping line — the first pill
  // plus the row rhythm — and the measured height of the laid-out whole.
  const clipStyle: React.CSSProperties = {
    overflow: "hidden",
    maxHeight: layoutOpen
      ? contentH > 0
        ? `${contentH}px`
        : "none"
      : rowPx > 0
        ? `${rowPx}px`
        : "none",
    transition: `max-height ${
      expanded ? CASCADE_EXPAND.growMs : CASCADE_EXPAND.holdMs
    }ms ease-out`,
  };

  const pillWrapStyle = (
    index: number,
    hidden: boolean,
  ): React.CSSProperties => {
    // Expanding cascades left to right; retracting ripples right to left.
    const d =
      overflows && index >= tagLimit
        ? expanded
          ? (index - tagLimit) * CASCADE_EXPAND.stepMs
          : (overflowCount - 1 - (index - tagLimit)) *
            CASCADE_EXPAND.retractStepMs
        : 0;
    return {
      // Hidden pills keep their slot in the flow but zero their width, so
      // the fold never moves mid-animation — `collapsing` defers the zero
      // until the fade is done.
      width: hidden && !collapsing ? 0 : undefined,
      minWidth: hidden && !collapsing ? 0 : undefined,
      overflow: "hidden",
      marginRight: GAP_PX,
      marginBottom: GAP_PX,
      transformOrigin: "left center",
      transform: hidden ? "scale(0)" : "scale(1)",
      opacity: hidden ? 0 : 1,
      transition: "width 0s, transform 200ms ease-out, opacity 200ms ease-out",
      transitionDelay: `0ms, ${d}ms, ${d}ms`,
    };
  };

  const pill = (tag: TagPanelTag) => (
    <Pill
      tone={tag.tone ?? "neutral"}
      variant={tag.variant ?? "soft"}
      size={tag.size ?? tagSize}
      icon={tag.icon}
    >
      {tag.children ?? tag.label}
    </Pill>
  );

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

      <div style={clipStyle}>
        <div
          ref={contentRef}
          id={regionId}
          role="group"
          aria-label={t("kit.tagpanel.group")}
          className={classNames(
            "flex flex-wrap items-center px-0 pb-1",
            bodyClassName,
          )}
        >
          {tags.length === 0 ? (
            // Was a bare italic `<span>`, then a fixed `size="sm"`; an
            // embedded empty state follows the shared PANE_EMPTY_STATE_SIZE
            // map so it never outgrows the section header.
            (emptyState ?? (
              <EmptyState
                variant="plain"
                size={PANE_EMPTY_STATE_SIZE[size ?? "md"]}
                title={emptyMessage ?? t("kit.tagpanel.empty")}
              />
            ))
          ) : (
            <>
              {tags
                .slice(0, overflows ? tagLimit : tags.length)
                .map((tag, i) => (
                  <span
                    key={tag.id ?? `${tag.label}-${i}`}
                    style={{ marginRight: GAP_PX, marginBottom: GAP_PX }}
                  >
                    {pill(tag)}
                  </span>
                ))}

              {overflows && (
                // One control for both directions, as in `ColorSwatches`:
                // the `+N` pill whose `+` tilts into a `×` while open —
                // `aria-expanded` carries the state a screen reader reads.
                <button
                  type="button"
                  onClick={() => reveal(!expanded)}
                  aria-expanded={expanded}
                  aria-controls={regionId}
                  aria-label={
                    expanded
                      ? t("kit.tagpanel.collapse")
                      : t("kit.tagpanel.showMore", {
                          count: overflowCount,
                        })
                  }
                  className="inline-flex shrink-0 self-start"
                  style={{
                    order: layoutOpen ? 3 : 1,
                    marginRight: GAP_PX,
                    marginBottom: GAP_PX,
                  }}
                >
                  <Pill tone={overflowTone} variant="soft" size={tagSize}>
                    <span
                      className={classNames(
                        "inline-block leading-none transition-transform duration-300",
                        expanded && "rotate-45",
                      )}
                      aria-hidden="true"
                    >
                      {expanded ? "+" : `+${overflowCount}`}
                    </span>
                  </Pill>
                </button>
              )}

              {overflows &&
                tags.slice(tagLimit).map((tag, offset) => {
                  const i = tagLimit + offset;
                  const hidden = !layoutOpen;
                  return (
                    <span
                      key={tag.id ?? `${tag.label}-${i}`}
                      style={pillWrapStyle(i, hidden)}
                      aria-hidden={hidden || undefined}
                    >
                      {pill(tag)}
                    </span>
                  );
                })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagPanel;
