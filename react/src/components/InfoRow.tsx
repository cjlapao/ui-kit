import { getSurfaceAccentColor } from "../theme/Theme";
import type { SurfaceTone } from "../theme/Theme";
import type { SurfaceTransparency } from "../theme/Theme";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import classNames from "classnames";
import Panel, { SkeletonBar } from "./Panel";
import TooltipWrapper from "./TooltipWrapper";
import IconButton from "./IconButton";
import { useSurfaceText } from "../contexts/SurfaceContext";
import { useIconRenderer } from "../contexts/IconContext";
import { type IconName } from "../icons/registry";
import { useKitT } from "../i18n";
import {
  DEFAULT_SURFACE_CORNER,
  PLAIN_SURFACE_VARIANTS,
  getSurfaceTriggerTokens,
  hasTextColor,
  type ControlSize,
  type PlainSurfaceVariant,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "../theme/Theme";
import type { GlassOpacity, GlassVibrancy } from "../theme/glass";

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * Every container surface, plus `plain` for a row dropped straight into a card
 * the app already owns — which is where an `InfoRow` normally lives, so it is
 * the default.
 */
export const INFO_ROW_VARIANTS = PLAIN_SURFACE_VARIANTS;
export type InfoRowVariant = PlainSurfaceVariant;

/** The shared control scale. Was a component-local `xs | sm | md | lg`. */
export type InfoRowSize = ControlSize;
/** The shared container padding scale. Was a component-local eight-member list. */
export type InfoRowPadding = SurfacePadding;
/** How a row reports that it is still waiting for its value. */
export const INFO_ROW_LOADERS = ["skeleton", "spinner"] as const;
export type InfoRowLoader = (typeof INFO_ROW_LOADERS)[number];

/**
 * One secondary line stacked under the row's main line — the "Policy:
 * `trigger_access.all-agents.sdsd.allow`" of a status row, the detail that
 * belongs to the title rather than to a row of its own.
 */
export interface InfoRowSubItem {
  /** Muted lead-in ("Policy:"). Omit to render the value alone. */
  text?: React.ReactNode;
  /**
   * The detail itself. `boolean` localises to "Yes"/"No" like the main
   * `value`; a ReactNode renders as-is.
   */
  value?: React.ReactNode;
  /** Set when the value is an identifier, a path, a token — code-ish text. */
  mono?: boolean;
  /** Extra classes for the sub-item line itself. */
  className?: string;
}

export interface InfoRowProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  // Owned by this component, and each would otherwise land on the <div> as a
  // native attribute with different meaning.
  "color" | "title" | "content" | "onCopy" | "onToggle"
> {
  /** Row label (left side). Accepts ReactNode for composed/styled labels. */
  label: React.ReactNode;
  /**
   * Override label text size independently from `size`.
   * When omitted the shared `size` prop drives label size.
   */
  labelSize?: InfoRowSize;
  /**
   * Extra classes for the label span. A text colour here replaces the row's
   * own rather than racing it — see `hasTextColor`.
   */
  labelClassName?: string;
  /**
   * Fixed width class for the label column (e.g. `"w-32"`).
   * Defaults to a size-appropriate width (`w-16` … `w-32`).
   * Pass `""` to let the label size naturally.
   */
  labelWidth?: string;
  /**
   * Row value (right side).
   * - `string` / `number` — rendered as text, copy button enabled automatically.
   * - `boolean` — rendered as "Yes" / "No" with copy enabled.
   * - `ReactNode` — rendered as-is, copy button suppressed.
   * - `null` / `undefined` / `''` — treated as empty (see `hideIfEmpty`).
   */
  value?: React.ReactNode;
  /**
   * Override value text size independently from `size`.
   * When omitted the shared `size` prop drives value size.
   */
  valueSize?: InfoRowSize;
  /**
   * Extra classes for the value span. A text colour here replaces the row's
   * own rather than racing it.
   */
  valueClassName?: string;
  /** Controls both label and value text size when individual overrides are absent. @default "md" */
  size?: InfoRowSize;
  /**
   * The surface the row draws for itself — the kit's surface family, with
   * `elevated` as the standing default. `plain` draws none (just the
   * hairline), which is what a row dropped into a card the app already owns
   * should look like — pass it for the details-list texture.
   * @default "elevated"
   */
  variant?: InfoRowVariant;
  /** Accent for the hover wash, the focus ring and the glass tint. @default "blue" */
  tone?: SurfaceTone;
  /** Corner radius when `variant` is not `plain`. */
  corner?: SurfaceCorner;
  /**
   * Vertical padding override. When omitted, padding is derived from `size`.
   */
  padding?: InfoRowPadding;
  /**
   * Show a copy-to-clipboard button.
   * Shown automatically when the resolved value is a string or number. @default true
   */
  copyable?: boolean;
  /** Called with the copied text after a successful copy. */
  onCopy?: (text: string) => void;
  /** Render the value in a monospace font. */
  mono?: boolean;
  /**
   * Hide the row entirely when `value` is `null`, `undefined`, or `''`.
   * Set to `false` to show the `emptyText` placeholder instead. @default true
   */
  hideIfEmpty?: boolean;
  /**
   * Placeholder shown when `hideIfEmpty` is `false` and the value is empty.
   * Pass `null` to render no placeholder at all: an empty row then shows its
   * label, sub-items and body with no dash. Loading and error states still
   * paint in the value area either way. @default "—"
   */
  emptyText?: string | null;
  /** Allow the value to wrap to multiple lines instead of truncating. */
  wrap?: boolean;
  /**
   * Show a tooltip with the full value when the text is truncated.
   * Only active when `wrap` is `false` and the value is a string or number. @default true
   */
  tooltipOnTruncate?: boolean;
  /** The value is still being fetched: render a placeholder in its place. */
  loading?: boolean;
  /** How `loading` is drawn. @default "skeleton" */
  loaderType?: InfoRowLoader;
  /**
   * Something went wrong fetching this value. Replaces the value, and is
   * announced — a row that silently shows "—" for a failed lookup is
   * indistinguishable from one that is genuinely empty.
   */
  error?: string;
  /** Remove the bottom hairline (e.g. for a last row handled externally). */
  noBorder?: boolean;
  /** Remove the default horizontal padding. */
  noPadding?: boolean;
  /** Add a hover wash and rounded corners, in the row's own `tone`. */
  hoverable?: boolean;
  /** Glass fill transparency, when `variant` is a glass one. */
  glassOpacity?: GlassOpacity;
  transparency?: SurfaceTransparency;
  /** Backdrop vibrancy, when `variant` is a glass one. */
  vibrancy?: GlassVibrancy;
  /**
   * Leading icon, sitting just before the label — the check that says a
   * status row passed. Tints with the row's `tone` (muted when `tone` is
   * `none`); a text colour in `iconClassName` replaces that, and a custom
   * element's own classes merge rather than race.
   */
  icon?: IconName | React.ReactElement;
  /** Extra classes for the icon; a text colour here owns the tint. */
  iconClassName?: string;
  /**
   * Secondary lines stacked under the main line, indented to the title's
   * edge when there is an icon. Each is a muted `text` lead-in and a
   * body-ink `value` (`font-mono` when `mono`); either half may stand
   * alone. A row with only sub-items is never hidden by `hideIfEmpty`.
   */
  subItems?: InfoRowSubItem[];
  /**
   * Make the row a disclosure: clicking (or Enter/Space on) the main line
   * toggles the `body` open and closed, animated with the same grid-rows
   * gesture as `CollapsiblePanel`. Defaults to `true` when `body` is
   * provided; pass `false` to render the body always open without the
   * toggle affordance... and pass `collapsible` with no body for a
   * controlled shell whose body arrives later.
   */
  collapsible?: boolean;
  /** Initial open state for uncontrolled use. @default false */
  defaultExpanded?: boolean;
  /** Controlled open state. Pair with `onToggle`. */
  expanded?: boolean;
  /** Called with the next open state whenever the row is toggled. */
  onToggle?: (expanded: boolean) => void;
  /**
   * The disclosure's content — a bullet list, a nested key/value group —
   * revealed under the main line. Rendered inert-while-collapsed, never
   * `hidden`, so the transition survives. A row with only a body is never
   * hidden by `hideIfEmpty`.
   */
  body?: React.ReactNode;
  /**
   * Draw a full-width hairline under the whole row block — a section edge
   * for a simple key/value table. Only honoured on the `simple` and `none`
   * variants (other surfaces own their own frame, and `plain` keeps its
   * sibling-matched `last:border-0` hairline). @default false
   */
  bottomBorder?: boolean;
  className?: string;
}

// ── Size tokens ───────────────────────────────────────────────────────────────

type SizeToken = {
  defaultPadding: string;
  horizontalPadding: string;
  defaultLabelWidth: string;
  text: string;
  gap: string;
  /** Height of a skeleton bar, so the placeholder matches the real row. */
  bar: string;
  iconSize: ControlSize;
  /**
   * Indent sub-items and body content to the title's edge — the icon box
   * (`h-4`…`h-8`) plus the main line's gap, per size. Applied only when an
   * icon is actually rendered; without one the title *is* the left edge.
   */
  iconIndent: string;
};

const sizeTokens: Record<InfoRowSize, SizeToken> = {
  xs: {
    defaultPadding: "py-1",
    horizontalPadding: "px-3",
    defaultLabelWidth: "w-16",
    text: "text-[11px]",
    gap: "gap-2",
    bar: "h-2",
    iconSize: "xs",
    iconIndent: "pl-6",
  },
  sm: {
    defaultPadding: "py-1.5",
    horizontalPadding: "px-3",
    defaultLabelWidth: "w-20",
    text: "text-xs",
    gap: "gap-2",
    bar: "h-2.5",
    iconSize: "xs",
    iconIndent: "pl-6",
  },
  md: {
    defaultPadding: "py-2",
    horizontalPadding: "px-4",
    defaultLabelWidth: "w-24",
    text: "text-sm",
    gap: "gap-3",
    bar: "h-3",
    iconSize: "sm",
    iconIndent: "pl-8",
  },
  lg: {
    defaultPadding: "py-2.5",
    horizontalPadding: "px-4",
    defaultLabelWidth: "w-28",
    text: "text-base",
    gap: "gap-3",
    bar: "h-3.5",
    iconSize: "md",
    iconIndent: "pl-9",
  },
  xl: {
    defaultPadding: "py-3",
    horizontalPadding: "px-5",
    defaultLabelWidth: "w-32",
    text: "text-lg",
    gap: "gap-4",
    bar: "h-4",
    iconSize: "md",
    iconIndent: "pl-10",
  },
};

const paddingTokens: Record<InfoRowPadding, string> = {
  none: "py-0",
  xs: "py-1",
  sm: "py-1.5",
  md: "py-2",
  lg: "py-2.5",
  xl: "py-3",
};

// ── Value normalisation ───────────────────────────────────────────────────────

type NormalisedValue = {
  display: React.ReactNode;
  copyText: string | null;
  isEmpty: boolean;
};

function normaliseValue(
  value: React.ReactNode,
  boolWords: { yes: string; no: string },
): NormalisedValue {
  if (value === undefined || value === null || value === "") {
    return { display: null, copyText: null, isEmpty: true };
  }
  if (typeof value === "boolean") {
    // Localised like everything else the row renders — "Yes"/"No" used to be
    // hardcoded English, the only untranslated word pair in the row.
    const text = value ? boolWords.yes : boolWords.no;
    return { display: text, copyText: text, isEmpty: false };
  }
  if (typeof value === "string" || typeof value === "number") {
    return { display: value, copyText: String(value), isEmpty: false };
  }
  return { display: value, copyText: null, isEmpty: false };
}

/**
 * Writes to the clipboard, or reports why it could not.
 *
 * `navigator.clipboard` is absent outside a secure context and the write
 * rejects whenever the document is not focused — both extremely ordinary, and
 * both previously an uncaught throw or an unhandled rejection.
 */
async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

type CopyState = "idle" | "copied" | "failed";

// ── Body ──────────────────────────────────────────────────────────────────────

/**
 * Split out so it can read `useSurfaceText()`: when `variant` is not `plain`
 * the row renders its own `Panel`, and a component cannot consume a context it
 * publishes itself. With `variant="plain"` this reads the surrounding card's
 * provider, which is the point — a plain row on glass picks up the translucent
 * copy tokens instead of vanishing.
 */
const InfoRowBody: React.FC<
  InfoRowProps & {
    normalised: NormalisedValue;
    rowTone: TrueColor;
    /** Native attributes, when this row *is* the root (the `plain` variant). */
    rootProps?: React.HTMLAttributes<HTMLDivElement>;
  }
> = ({
  label,
  labelSize,
  labelClassName,
  labelWidth,
  valueSize,
  valueClassName,
  size = "md",
  padding,
  copyable = true,
  onCopy,
  mono = false,
  emptyText = "—",
  wrap = false,
  tooltipOnTruncate = true,
  loading = false,
  loaderType = "skeleton",
  error,
  noBorder = false,
  noPadding = false,
  hoverable = false,
  variant = "elevated",
  tone = "none",
  icon,
  iconClassName,
  subItems,
  collapsible,
  defaultExpanded = false,
  expanded,
  onToggle,
  body,
  bottomBorder = false,
  className,
  normalised,
  rowTone,
  rootProps,
}) => {
  const t = useKitT();
  const text = useSurfaceText();
  const renderIcon = useIconRenderer();
  const [copyState, setCopyState] = useState<CopyState>("idle");
  /*
    The reveal's third state. Hover and focus summon the button; a copy
    *dismisses* it: the confirmation shows for its 1.6s, then the button
    folds away even while the pointer is still parked on the row — a row
    the user just acted on should settle back to reading mode, not hold the
    affordance open under a motionless cursor. Leaving the row re-arms the
    hover reveal, and keyboard focus overrides dismissal entirely.
  */
  const [dismissed, setDismissed] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const valueRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The confirmation resets on a timer; without this the timer fires into an
  // unmounted component whenever a row disappears within 1.6s of a copy.
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const { display, copyText, isEmpty } = normalised;
  const tokens = sizeTokens[size];
  const labelTokens = sizeTokens[labelSize ?? size];
  const valueTokens = sizeTokens[valueSize ?? size];
  const rowPadding =
    padding !== undefined ? paddingTokens[padding] : tokens.defaultPadding;
  const hasError = Boolean(error);
  const showCopy =
    copyable && copyText !== null && !isEmpty && !loading && !hasError;
  const canTooltip =
    tooltipOnTruncate && !wrap && copyText !== null && !loading && !hasError;
  // An empty value with `emptyText={null}` renders no value span at all —
  // no dash, no tooltip anchor, nothing to measure. Loading and error are
  // states, not decoration: they still paint in the value area.
  const omitValue = isEmpty && emptyText === null && !hasError && !loading;
  const useSmartLayout = labelWidth === undefined;
  const trigger = getSurfaceTriggerTokens(rowTone);

  // ── Collapsible body ── (the same controlled/uncontrolled pair
  // CollapsiblePanel runs on)
  const isControlled = typeof expanded === "boolean";
  const isCollapsible = collapsible ?? body !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = isControlled ? (expanded as boolean) : internalExpanded;
  // A `collapsible={false}` row with a body renders it always-open — the
  // content stands, only the toggle affordance is withheld.
  const bodyOpen = isCollapsible ? isExpanded : true;
  const headerId = useId();
  const contentId = useId();
  const handleToggle = useCallback(() => {
    const next = !isExpanded;
    if (!isControlled) setInternalExpanded(next);
    onToggle?.(next);
  }, [isExpanded, isControlled, onToggle]);
  const handleRootClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // The whole control is the toggle — but real content inside it keeps
      // its own clicks: links, nested buttons, inputs and any editable
      // region activate themselves, never the row. (The copy cluster also
      // stops propagation of its own; this guard covers sub-items.)
      const target = event.target;
      if (target instanceof HTMLElement) {
        const interactive = target.closest(
          "a,button,input,select,textarea,summary,[role='button'],[contenteditable='true']",
        );
        if (interactive && interactive !== event.currentTarget) return;
      }
      handleToggle();
    },
    [handleToggle],
  );
  const handleHeaderKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Target guard: Enter/Space arriving from a focused child — the copy
      // button is the usual one — must activate that child, never toggle the
      // row. Same rule CollapsiblePanel's header obeys.
      if (event.target !== event.currentTarget) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleToggle();
      }
    },
    [handleToggle],
  );

  const handleCopy = useCallback(async () => {
    if (!copyText) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const ok = await writeClipboard(copyText);
    setCopyState(ok ? "copied" : "failed");
    setDismissed(true);
    if (ok) onCopy?.(copyText);
    timerRef.current = setTimeout(() => setCopyState("idle"), 1600);
  }, [copyText, onCopy]);

  // Only measure on hover/focus: reading scrollWidth forces layout, and doing
  // it per render for a list of rows is what makes a details panel janky.
  const measure = useCallback(() => {
    const el = valueRef.current;
    if (!canTooltip || !el) return;
    setTruncated(el.scrollWidth > el.offsetWidth);
  }, [canTooltip]);

  // The loader follows the row's tone. Derived from the tone, never mapped:
  // both shapes are already safelisted for all 21 colours.
  const loaderInk = `bg-${rowTone}-500/20 dark:bg-${rowTone}-500/25`;
  const loaderText = `text-${rowTone}-500 dark:text-${rowTone}-400`;

  // A section edge under the *whole block* — sub-items and an open body
  // included. Only the two borderless surface variants honour it: the framed
  // ones own their own edge, and `plain` keeps its sibling-matched hairline
  // contract (`last:border-0`) untouched. `noBorder` still wins.
  const sectionEdge =
    bottomBorder &&
    !noBorder &&
    (variant === "simple" || variant === "none");

  const valueColorClass = hasError
    ? "text-rose-600 dark:text-rose-400"
    : isEmpty
      ? text.muted
      : text.body;

  // The icon follows the row's tone, like the loader — derived, never mapped:
  // both shapes are already safelisted for all 21 colours. A text colour on
  // `iconClassName` owns the tint instead.
  const iconNode = icon
    ? renderIcon(
        icon,
        tokens.iconSize,
        classNames(
          !hasTextColor(iconClassName) &&
            (tone === "none"
              ? text.muted
              : `text-${rowTone}-500 dark:text-${rowTone}-400`),
          iconClassName,
        ),
      )
    : null;

  const valueSpan = (
    // The truncated value is the tooltip's anchor: focusable (with a
    // focus-visible ring) only when there is a tooltip to reveal, so
    // keyboard users can surface it without a dead stop on every row.
    // The listeners measure overflow — they are not user interactions.
    <span
      ref={valueRef}
      // Focusable only when there is actually a tooltip to reveal, so the row
      // does not add a dead tab stop to every details panel.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focusable tooltip anchor (keyboard access to truncated text)
      tabIndex={canTooltip && truncated ? 0 : undefined}
      onMouseEnter={measure}
      onFocus={measure}
      className={classNames(
        valueTokens.text,
        "font-medium rounded-sm",
        wrap ? "wrap-break-word whitespace-normal text-right" : "truncate",
        !hasTextColor(valueClassName) && valueColorClass,
        mono && "font-mono",
        trigger.focusRing,
        valueClassName,
      )}
    >
      {hasError ? error : isEmpty ? emptyText : display}
    </span>
  );

  // When the row is a disclosure, the whole control is the toggle: the role,
  // tab stop and activation live on the root — the block the wash paints —
  // while the copy cluster and the body region stop propagation, and a guard
  // keeps any interactive content (links in sub-items) out of the toggle. A
  // div with a button role, not a native <button>: the row legitimately
  // holds buttons inside it.
  return (
    <div
      {...rootProps}
      {...(isCollapsible
        ? {
            role: "button" as const,
            tabIndex: 0,
            "aria-expanded": isExpanded,
            "aria-controls": contentId,
            onClick: handleRootClick,
            onKeyDown: handleHeaderKeyDown,
          }
        : {})}
      // Leaving the row re-arms the hover reveal — the dismissal is about
      // settling after an action, not about disabling the affordance.
      onMouseLeave={() => setDismissed(false)}
      className={classNames(
        // The named `group/inforow` scope keeps the `:has(:focus-visible)`
        // override below honest: without it, *any* ancestor carrying a bare
        // `group` class (an accordion, a card) whose subtree holds a focused
        // button would summon every dismissed copy button inside it.
        "group group/inforow flex flex-col transition-colors duration-300",
        rowPadding,
        !noPadding && tokens.horizontalPadding,
        // A disclosure washes the whole row, not just its main line: the
        // sub-items and body belong to the same row, and a wash that stops at
        // the main line reads as a rendering bug. Same shape as `hoverable`'s
        // — rounded box on the root, which spans every strip.
        (hoverable || isCollapsible) && "rounded-md",
        // `!copied` so the confirmation wash is never racing the hover wash for
        // the same property.
        (hoverable || isCollapsible) && copyState === "idle" && trigger.hover,
        // The pointer and the focus ring mark the toggle, and the toggle is
        // the whole control.
        isCollapsible && classNames("cursor-pointer", trigger.focusRing),
        // The hairline's `last:border-0` is suppressed while a section edge is
        // on — `:last-child` outranks the plain class, and without this the
        // last row's requested border would vanish.
        !noBorder &&
          !hoverable &&
          !sectionEdge &&
          `border-b ${text.divider} last:border-0`,
        sectionEdge && `border-b ${text.divider}`,
        copyState === "copied" && "bg-emerald-500/10",
        copyState === "failed" && "bg-rose-500/10",
        className,
      )}
      aria-busy={loading || undefined}
    >
      {/*
        Main line — the row's original horizontal layout, and layout only:
        when the row is a disclosure, the toggle is the whole control, so the
        role, tab stop and activation live on the root, not here. It keeps the
        region's `aria-labelledby` anchor as the row's accessible name.
      */}
      <div
        id={headerId}
        className={classNames(
          "flex min-w-0 items-center rounded-[inherit] text-left",
          tokens.gap,
        )}
      >
        {iconNode && (
          // `flex`, or the inline box picks up descender space and stops
          // matching the icon's own height. Decorative: the label says what
          // the icon only signals.
          <span className="flex shrink-0 items-center" aria-hidden="true">
            {iconNode}
          </span>
        )}
      {/* Label — natural content width, capped at 30%; fixed width when labelWidth is explicit */}
      <span
        className={classNames(
          labelTokens.text,
          !hasTextColor(labelClassName) && text.muted,
          useSmartLayout
            ? "shrink-0 min-w-0 max-w-[30%] truncate"
            : `grow shrink-0 ${labelWidth ?? tokens.defaultLabelWidth}`,
          labelClassName,
        )}
      >
        {label}
      </span>

      {/* Value + copy button. No `gap`: spacing to the button lives on the
          button wrapper itself, so a hidden button claims zero pixels and the
          value owns the full width. While the row is a disclosure, activation
          here belongs to the value and the copy button, not to the toggle —
          both paths stop at the cluster. */}
      <div
        {...(isCollapsible
          ? {
              onClick: (event: React.MouseEvent) => event.stopPropagation(),
              onKeyDown: (event: React.KeyboardEvent) =>
                event.stopPropagation(),
            }
          : {})}
        className="relative flex flex-1 items-center justify-end min-w-0"
      >
        {loading ? (
          loaderType === "spinner" ? (
            <span
              className={classNames(
                "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
                "motion-reduce:animate-none",
                tokens.bar,
                "aspect-square",
                loaderText,
              )}
              role="status"
              aria-label={t("kit.inforow.loading")}
            />
          ) : (
            <SkeletonBar
              width="40%"
              height={tokens.bar}
              ink={loaderInk}
              className="animate-pulse motion-reduce:animate-none"
            />
          )
        ) : omitValue ? null : canTooltip && truncated && copyText ? (
          <TooltipWrapper text={copyText}>{valueSpan}</TooltipWrapper>
        ) : (
          valueSpan
        )}

        {showCopy && (
          /*
            A hidden button claims no space: at rest the value runs the full
            length of the column, and on row hover — or Tab, via focus-within,
            since an unfocused-but-hidden button stays in the tab order — the
            button slides out of the right edge and pushes the value over.
            Width, margin and opacity move as one 200ms gesture, so it reads
            as a reveal rather than a reflow. `max-w` rather than `w` because
            the natural width is the button's own, whatever `size` says.
          */
          <div
            className={classNames(
              "shrink-0 overflow-hidden text-right transition-[max-width,margin,opacity] duration-200 ease-out",
              // One rule, everywhere: the button is summoned by the pointer
              // or by a focus the keyboard *says* it made — never by the
              // focus a mouse-click leaves behind, and never by its own
              // confirmation state. Leaving the row mid-confirmation hides
              // the check right with the pointer (the click that copied put
              // DOM focus on the button; plain `focus-within` would have
              // kept it open until the next click elsewhere). When the
              // confirmation ends, hover stops summoning too — the fold
              // lands under even a parked cursor — until the pointer leaves
              // and re-arms. `:focus-visible` cannot come from a click, so
              // the keyboard branch keeps Tab-navigated users whole.
              "ml-0 max-w-0 opacity-0",
              "[.group\\/inforow:has(button:focus-visible)_&]:ml-2 [.group\\/inforow:has(button:focus-visible)_&]:max-w-10 [.group\\/inforow:has(button:focus-visible)_&]:opacity-100",
              !(copyState === "idle" && dismissed) &&
                "group-hover:ml-2 group-hover:max-w-10 group-hover:opacity-100",
            )}
          >
            <IconButton
              icon={copyState === "copied" ? "Check" : "Copy"}
              variant="ghost"
              size={tokens.iconSize}
              color={copyState === "copied" ? "emerald" : rowTone}
              srLabel={
                copyState === "copied"
                  ? t("kit.inforow.copiedLong")
                  : copyState === "failed"
                    ? t("kit.inforow.copyFailed")
                    : t("kit.inforow.copy")
              }
              tooltip={
                copyState === "copied"
                  ? t("kit.inforow.copied")
                  : copyState === "failed"
                    ? t("kit.inforow.copyFailed")
                    : t("kit.inforow.copy")
              }
              onClick={() => void handleCopy()}
              className="shrink-0"
            />
          </div>
        )}

        {/* Polite, so a copy confirmation never interrupts what is being read. */}
        <span className="sr-only" role="status">
          {copyState === "copied"
            ? t("kit.inforow.copiedLong")
            : copyState === "failed"
              ? t("kit.inforow.copyFailed")
              : ""}
        </span>
        {hasError && (
          <span className="sr-only" role="status">
            {error}
          </span>
        )}
      </div>

        {isCollapsible && (
          <span
            className={classNames(
              // `flex`, or the inline box picks up descender space and stops
              // matching the icon's own height.
              "flex shrink-0 items-center transition-transform duration-300",
              text.muted,
              isExpanded ? "rotate-180" : "rotate-0",
            )}
            aria-hidden="true"
          >
            {renderIcon("ArrowDown", tokens.iconSize)}
          </span>
        )}
      </div>

      {/* Sub-items — the detail that belongs to the title, not to a row of its
          own. Baseline-paired so "Policy:" and its mono value read as one
          sentence at the title's edge, and allowed to reflow as one when the
          column gets narrow. */}
      {subItems && subItems.length > 0 && (
        <div
          className={classNames("flex flex-col", icon && tokens.iconIndent)}
        >
          {subItems.map((item, index) => {
            // Booleans localise like the main `value`.
            const subValue =
              typeof item.value === "boolean"
                ? item.value
                  ? t("kit.inforow.yes")
                  : t("kit.inforow.no")
                : item.value;
            const hasText =
              item.text !== undefined && item.text !== null && item.text !== "";
            const hasValue =
              subValue !== undefined && subValue !== null && subValue !== "";
            if (!hasText && !hasValue) return null;
            return (
              <div
                key={index}
                className={classNames(
                  "flex flex-wrap items-baseline gap-1.5 wrap-break-word",
                  item.className,
                )}
              >
                {hasText && (
                  <span className={classNames(tokens.text, text.muted)}>
                    {item.text}
                  </span>
                )}
                {hasValue && (
                  <span
                    className={classNames(
                      tokens.text,
                      "font-medium",
                      text.body,
                      item.mono && "font-mono",
                    )}
                  >
                    {subValue}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/*
        The disclosure body — the same gesture CollapsiblePanel makes:
        `grid-template-rows: 0fr → 1fr` animates to the content's natural
        height. `hidden` would be `display: none` and kill the transition, so
        the collapsed region is inert instead: not focusable, not announced,
        still animatable.
      */}
      {body !== undefined && (
        <div
          // The body is the app's content — reading it, following its links or
          // pressing keys in it must never fold the row; its activation stops
          // at this wrapper, outside the whole-control toggle.
          {...(isCollapsible
            ? {
                onClick: (event: React.MouseEvent) => event.stopPropagation(),
                onKeyDown: (event: React.KeyboardEvent) =>
                  event.stopPropagation(),
              }
            : {})}
          className={classNames(
            // `cursor-auto`: the row's toggle pointer belongs to the chrome,
            // not to the app's content — reading and selecting the body must
            // not look clickable.
            "grid cursor-auto transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none",
            bodyOpen ? "opacity-100" : "opacity-0",
          )}
          style={{ gridTemplateRows: bodyOpen ? "1fr" : "0fr" }}
        >
          <div
            id={contentId}
            role="region"
            aria-labelledby={headerId}
            aria-hidden={!bodyOpen || undefined}
            // Spread rather than passed directly so it type-checks against
            // React 18, where `inert` is not a known prop.
            {...(bodyOpen ? {} : ({ inert: true } as Record<string, unknown>))}
            className="min-h-0 overflow-hidden"
          >
            <div
              className={classNames(
                // No extra padding: the row's own padding aligns the body with
                // the main line; the icon indent aligns it with the title and
                // the sub-items above.
                "w-full",
                tokens.text,
                text.body,
                icon && tokens.iconIndent,
              )}
            >
              {body}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * One label/value line in a details panel, with copy-to-clipboard, truncation
 * tooltip, and loading / empty / error states.
 */
export const InfoRow: React.FC<InfoRowProps> = (props) => {
  const {
    value,
    hideIfEmpty = true,
    variant = "elevated",
    tone = "none",
    corner = DEFAULT_SURFACE_CORNER,
    loading = false,
    error,
    glassOpacity,
    transparency,
    vibrancy,
    className,
    // Everything below is read by the body, not here.
    label: _label,
    labelSize: _labelSize,
    labelClassName: _labelClassName,
    labelWidth: _labelWidth,
    valueSize: _valueSize,
    valueClassName: _valueClassName,
    size: _size,
    padding: _padding,
    copyable: _copyable,
    onCopy: _onCopy,
    mono: _mono,
    emptyText: _emptyText,
    wrap: _wrap,
    tooltipOnTruncate: _tooltipOnTruncate,
    loaderType: _loaderType,
    noBorder: _noBorder,
    noPadding: _noPadding,
    hoverable: _hoverable,
    icon: _icon,
    iconClassName: _iconClassName,
    // Read by the emptiness test below, then consumed by the body.
    subItems,
    collapsible,
    body,
    defaultExpanded: _defaultExpanded,
    expanded: _expanded,
    onToggle: _onToggle,
    bottomBorder: _bottomBorder,
    ...rest
  } = props;

  const t = useKitT();
  const normalised = normaliseValue(value, {
    yes: t("kit.inforow.yes"),
    no: t("kit.inforow.no"),
  });

  // A row that is loading, reporting a failure, carrying sub-items, or
  // standing ready to reveal a body has something to say even though it has no
  // value of its own — hiding it would be wrong.
  if (
    normalised.isEmpty &&
    hideIfEmpty &&
    !loading &&
    !error &&
    !subItems?.length &&
    body === undefined &&
    !collapsible
  )
    return null;

  // A `plain` row *is* the root element. Wrapping it in a div would make every
  // row an only child, so `last:border-0` would match all of them and the
  // hairlines would vanish. (The invariant is a property of the variant, not
  // of the default — details lists pass `plain` explicitly.)
  if (variant === "plain") {
    return (
      <InfoRowBody
        {...props}
        normalised={normalised}
        rowTone={getSurfaceAccentColor(tone)}
        rootProps={rest}
        className={className}
      />
    );
  }

  return (
    <Panel
      {...rest}
      variant={variant as SurfaceVariant}
      tone={tone}
      corner={corner}
      padding="none"
      scrollable={false}
      glassOpacity={glassOpacity}
        transparency={transparency}
      vibrancy={vibrancy}
      className={className}
    >
      <InfoRowBody
        {...props}
        normalised={normalised}
        rowTone={getSurfaceAccentColor(tone)}
        className={undefined}
      />
    </Panel>
  );
};

export default InfoRow;
