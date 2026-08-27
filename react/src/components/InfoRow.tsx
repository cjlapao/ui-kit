import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Panel, { SkeletonBar } from "./Panel";
import TooltipWrapper from "./TooltipWrapper";
import IconButton from "./IconButton";
import { useSurfaceText } from "../contexts/SurfaceContext";
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

export interface InfoRowProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    // Owned by this component, and each would otherwise land on the <div> as a
    // native attribute with different meaning.
    "color" | "title" | "content" | "onCopy"
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
   * The surface the row draws for itself. `plain` draws none — just the
   * hairline — which is right for a row inside an existing card. @default "plain"
   */
  variant?: InfoRowVariant;
  /** Accent for the hover wash, the focus ring and the glass tint. @default "blue" */
  tone?: TrueColor;
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
  /** Placeholder shown when `hideIfEmpty` is `false` and the value is empty. @default "—" */
  emptyText?: string;
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
  /** Backdrop vibrancy, when `variant` is a glass one. */
  vibrancy?: GlassVibrancy;
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
  },
  sm: {
    defaultPadding: "py-1.5",
    horizontalPadding: "px-3",
    defaultLabelWidth: "w-20",
    text: "text-xs",
    gap: "gap-2",
    bar: "h-2.5",
    iconSize: "xs",
  },
  md: {
    defaultPadding: "py-2",
    horizontalPadding: "px-4",
    defaultLabelWidth: "w-24",
    text: "text-sm",
    gap: "gap-3",
    bar: "h-3",
    iconSize: "sm",
  },
  lg: {
    defaultPadding: "py-2.5",
    horizontalPadding: "px-4",
    defaultLabelWidth: "w-28",
    text: "text-base",
    gap: "gap-3",
    bar: "h-3.5",
    iconSize: "md",
  },
  xl: {
    defaultPadding: "py-3",
    horizontalPadding: "px-5",
    defaultLabelWidth: "w-32",
    text: "text-lg",
    gap: "gap-4",
    bar: "h-4",
    iconSize: "md",
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

function normaliseValue(value: React.ReactNode): NormalisedValue {
  if (value === undefined || value === null || value === "") {
    return { display: null, copyText: null, isEmpty: true };
  }
  if (typeof value === "boolean") {
    const text = value ? "Yes" : "No";
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
  className,
  normalised,
  rowTone,
  rootProps,
}) => {
  const text = useSurfaceText();
  const [copyState, setCopyState] = useState<CopyState>("idle");
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
  const showCopy = copyable && copyText !== null && !isEmpty && !loading && !hasError;
  const canTooltip =
    tooltipOnTruncate && !wrap && copyText !== null && !loading && !hasError;
  const useSmartLayout = labelWidth === undefined;
  const trigger = getSurfaceTriggerTokens(rowTone);

  const handleCopy = useCallback(async () => {
    if (!copyText) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const ok = await writeClipboard(copyText);
    setCopyState(ok ? "copied" : "failed");
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

  const valueColorClass = hasError
    ? "text-rose-600 dark:text-rose-400"
    : isEmpty
      ? text.muted
      : text.body;

  const valueSpan = (
    <span
      ref={valueRef}
      // Focusable only when there is actually a tooltip to reveal, so the row
      // does not add a dead tab stop to every details panel.
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

  return (
    <div
      {...rootProps}
      className={classNames(
        "group flex items-center transition-colors duration-300",
        tokens.gap,
        rowPadding,
        !noPadding && tokens.horizontalPadding,
        hoverable && "rounded-md",
        // `!copied` so the confirmation wash is never racing the hover wash for
        // the same property.
        hoverable && copyState === "idle" && trigger.hover,
        !noBorder && !hoverable && `border-b ${text.divider} last:border-0`,
        copyState === "copied" && "bg-emerald-500/10",
        copyState === "failed" && "bg-rose-500/10",
        className,
      )}
      aria-busy={loading || undefined}
    >
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

      {/* Value + copy button — fills remaining space */}
      <div className="relative flex flex-1 items-center justify-end gap-1 min-w-0">
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
              aria-label="Loading"
            />
          ) : (
            <SkeletonBar
              width="40%"
              height={tokens.bar}
              ink={loaderInk}
              className="animate-pulse motion-reduce:animate-none"
            />
          )
        ) : canTooltip && truncated && copyText ? (
          <TooltipWrapper text={copyText}>{valueSpan}</TooltipWrapper>
        ) : (
          valueSpan
        )}

        {showCopy && (
          <IconButton
            icon={copyState === "copied" ? "Check" : "Copy"}
            variant="ghost"
            size={tokens.iconSize}
            color={copyState === "copied" ? "emerald" : rowTone}
            srLabel={
              copyState === "copied"
                ? "Copied to clipboard"
                : copyState === "failed"
                  ? "Copy failed"
                  : "Copy to clipboard"
            }
            tooltip={
              copyState === "copied"
                ? "Copied!"
                : copyState === "failed"
                  ? "Copy failed"
                  : "Copy to clipboard"
            }
            onClick={() => void handleCopy()}
            className={classNames(
              "shrink-0 transition-opacity duration-200",
              // Revealed on hover *and* on keyboard focus — an
              // opacity-0 button is still in the tab order, so a keyboard user
              // used to land on something they could not see.
              copyState === "idle"
                ? "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                : "opacity-100",
            )}
          />
        )}

        {/* Polite, so a copy confirmation never interrupts what is being read. */}
        <span className="sr-only" role="status">
          {copyState === "copied"
            ? "Copied to clipboard"
            : copyState === "failed"
              ? "Copy failed"
              : ""}
        </span>
        {hasError && (
          <span className="sr-only" role="status">
            {error}
          </span>
        )}
      </div>
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
    variant = "plain",
    tone = "blue",
    corner = DEFAULT_SURFACE_CORNER,
    loading = false,
    error,
    glassOpacity,
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
    ...rest
  } = props;

  const normalised = normaliseValue(value);

  // A row that is loading, or reporting a failure, has something to say even
  // though it has no value yet — hiding it would be wrong.
  if (normalised.isEmpty && hideIfEmpty && !loading && !error) return null;

  // A `plain` row *is* the root element. Wrapping it in a div would make every
  // row an only child, so `last:border-0` would match all of them and the
  // hairlines would vanish.
  if (variant === "plain") {
    return (
      <InfoRowBody
        {...props}
        normalised={normalised}
        rowTone={tone}
        rootProps={rest}
        className={className}
      />
    );
  }

  return (
    <Panel
      {...rest}
      variant={variant as SurfaceVariant}
      color={tone}
      corner={corner}
      padding="none"
      scrollable={false}
      glassOpacity={glassOpacity}
      vibrancy={vibrancy}
      className={className}
    >
      <InfoRowBody
        {...props}
        normalised={normalised}
        rowTone={tone}
        className={undefined}
      />
    </Panel>
  );
};

export default InfoRow;
