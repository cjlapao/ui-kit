import classNames from "classnames";
import React, {
  type ForwardedRef,
  type ReactNode,
  type SelectHTMLAttributes,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react";
import ScrollArea from "./ScrollArea";
import { useIconRenderer } from "../contexts/IconContext";
import {
  DEFAULT_GLOW_INTENSITY,
  FIELD_STATUS_CLASSES,
  getGlowTokens,
  getFieldSizeTokens,
  getFieldToneTokens,
  getInputVariantTokens,
  resolveGlowGradient,
  stripBorderColor,
  VALIDATION_STATUSES,
} from "../theme/Theme";
import type {
  ControlSize,
  GlowIntensity,
  InputVariant,
  SurfaceCorner,
  TrueColor,
} from "../theme/Theme";

/** @deprecated Use `VALIDATION_STATUSES` from the theme. Kept as an alias. */
export const SELECT_VALIDATION_STATUSES = VALIDATION_STATUSES;
export type SelectValidationStatus =
  (typeof SELECT_VALIDATION_STATUSES)[number];

/**
 * The shared control scale, so a Select lines up with the Input, SearchBar and
 * Button beside it. Was a local `"sm" | "md" | "lg"`.
 */
export type SelectSize = ControlSize;

/**
 * The same surfaces `Input`, `SearchBar` and `InputGroup` offer. A Select was
 * hardcoded to `rounded-lg border border-neutral-300 bg-white shadow-sm`, so it
 * was the one control in a form that could not be made to match the rest.
 */
export type SelectVariant = InputVariant;

// ── Tone tokens ───────────────────────────────────────────────────────────────
// Generated from the shared TrueColor list. The hand-written map this replaces
// pointed `gray`, `zinc` and `stone` at `neutral-500` classes, so three of the
// five neutral tones silently rendered as a fourth.

/**
 * Line height the popup options keep. The select itself is forced to
 * `leading-6` (see `BOXED_VALUE_LEADING`) to centre its value, and the options
 * inherit — so they pin their own line height back to the natural one, or the
 * dropdown rows would grow 4px.
 *
 * Everything else about the field — tone tokens, padding, type scale,
 * validation surfaces — comes from the theme, shared with `Input`,
 * `SearchBar` and `Picker`.
 */
const OPTION_LINE: Record<ControlSize, string> = {
  xs: "[&>option]:leading-4",
  sm: "[&>option]:leading-4",
  md: "[&>option]:leading-5",
  lg: "[&>option]:leading-6",
  xl: "[&>option]:leading-6",
};

const BOXED_VALUE_LEADING = "leading-6";

/**
 * The maximum height of a `multiple` list before the ScrollArea starts
 * scrolling it — the same reach the styled popup gives itself, so a dropdown
 * and a list cap consistently. The list itself grows to fit its rows (see
 * `.ui-select[multiple]` in `styles.css`), which is what lets the frame, not
 * the widget, own the scrollbar.
 */
const LIST_MAX_HEIGHT = "max-h-[18rem]";

/**
 * Opts the control into a real, stylable dropdown where the browser supports
 * one (`appearance: base-select`, Chrome 135+); see the `.ui-select` block in
 * `styles.css`. Everywhere else the class matches nothing and the platform
 * popup is used, with the fills above.
 */
const PICKER_CLASS = "ui-select";

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size" | "color" | "className"
> {
  /** @default "md" */
  size?: SelectSize;
  /** Accent colour for the focus border, ring and icon highlight. */
  tone?: TrueColor;
  /** Deprecated alias for `tone`. @deprecated */
  color?: TrueColor;
  /**
   * Visual surface style. Cells of the shared family: `glass` really blurs
   * and `gradient` carries one glow behind the field, like `Input`.
   * @default "flat"
   */
  variant?: SelectVariant;
  /**
   * Field radius. `auto` keeps the control corner shared with every other
   * field; an explicit token replaces it.
   * @default "auto"
   */
  corner?: SurfaceCorner;
  /** Gradient glow start. @default the tone's 600 shade */
  gradientFrom?: string;
  /** Gradient glow end. @default the tone's 400 shade */
  gradientTo?: string;
  /** Focus halo strength of the `gradient` variant. @default "subtle" */
  glowIntensity?: GlowIntensity;
  /** @default "none" */
  validationStatus?: SelectValidationStatus;
  placeholder?: ReactNode;
  leadingIcon?: string | React.ReactElement;
  /** Hides the drop-down caret. Always hidden for `multiple`. */
  hideCaret?: boolean;
  /**
   * Classes for the field box. The surface moved from the `<select>` to its
   * wrapper (matching `Input`), so this is the element that carries the border,
   * fill and radius.
   */
  className?: string;
  /** Classes for the inner `<select>` element itself. */
  selectClassName?: string;
  /** Drops the surface entirely — used by `InputGroup`. */
  unstyled?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    size = "md",
    tone,
    color,
    variant = "flat",
    corner = "auto",
    gradientFrom,
    gradientTo,
    glowIntensity = DEFAULT_GLOW_INTENSITY,
    validationStatus = "none",
    className,
    selectClassName,
    placeholder,
    leadingIcon,
    hideCaret = false,
    disabled,
    children,
    unstyled = false,
    multiple,
    style,
    onFocus,
    onBlur,
    ...rest
  },
  ref: ForwardedRef<HTMLSelectElement>,
) {
  const renderIcon = useIconRenderer();
  const innerRef = useRef<HTMLSelectElement | null>(null);

  const setSelectRef = useCallback(
    (node: HTMLSelectElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const [focused, setFocused] = useState(false);
  const effectiveTone = tone ?? color ?? "blue";
  const sizeToken = getFieldSizeTokens(size);
  const optionLine = OPTION_LINE[size] ?? OPTION_LINE.md;
  const tokens = getFieldToneTokens(effectiveTone);
  const variantTokens = getInputVariantTokens(variant, effectiveTone, corner, {
    explicitTone: tone ?? color,
  });
  const glow = getGlowTokens(glowIntensity);
  const [glowFrom, glowTo] = resolveGlowGradient(
    effectiveTone,
    gradientFrom,
    gradientTo,
  );
  const isUnderline = variant === "underline";
  const hasStatus = validationStatus !== "none";
  const showCaret = !hideCaret && !multiple;

  // A `hidden disabled` first option is not what the browser lands on: for an
  // uncontrolled select it picks the first *selectable* option instead, so the
  // placeholder never appeared unless the caller also passed `value=""`. Seed
  // the empty value when nothing else claims it.
  const needsPlaceholderDefault =
    placeholder !== undefined &&
    !multiple &&
    rest.value === undefined &&
    rest.defaultValue === undefined;

  const statusIconClass = classNames(
    validationStatus === "error" && "text-rose-500 dark:text-rose-400",
    validationStatus === "success" && "text-emerald-500 dark:text-emerald-400",
  );

  /**
   * The caret and the wrapper's padding are *outside* the `<select>` — a click
   * on them lands on the wrapper span and nothing happened, so only the middle
   * strip of the box opened the dropdown. Route any wrapper click the select
   * did not get to `showPicker()` (a real click carries the user activation it
   * needs). Clicks that land on the select itself are left to the platform,
   * and `multiple` has no popup to open.
   */
  const handleWrapperClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    const select = innerRef.current;
    if (!select || disabled || multiple || event.target === select) return;
    const showPicker = (
      select as HTMLSelectElement & { showPicker?: () => void }
    ).showPicker;
    if (typeof showPicker === "function") {
      try {
        showPicker.call(select);
        return;
      } catch {
        // No activation or the platform refused — fall back to focusing,
        // which is still better than the click being lost.
      }
    }
    select.focus();
  };

  /**
   * Drives the styled picker's hover and selected colours. Tailwind v4 exposes
   * every palette entry as a CSS variable, so the tone travels as a variable
   * reference rather than a generated class — nothing to safelist, and the
   * stylesheet stays colour-agnostic.
   */
  const pickerAccent = {
    "--ui-select-accent": `var(--color-${effectiveTone}-500)`,
    "--ui-select-accent-strong": `var(--color-${effectiveTone}-700)`,
    "--ui-select-accent-soft": `var(--color-${effectiveTone}-300)`,
    // Merged rather than spread after `...rest`, which would have dropped the
    // accent entirely the moment a caller passed a `style` of their own.
    ...style,
  } as React.CSSProperties;

  const renderVisual = (visual: string | React.ReactElement) => {
    if (typeof visual === "string") return renderIcon(visual, sizeToken.icon);
    return visual;
  };

  const selectEl = (
    <select
      ref={setSelectRef}
      disabled={disabled}
      multiple={multiple}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      style={pickerAccent}
      className={classNames(
        // `appearance-none` hides the platform caret so ours is the only one.
        "min-w-0 appearance-none border-none bg-transparent p-0 outline-none",
        multiple ? "w-full" : "flex-1",
        sizeToken.text,
        // After `sizeToken.text` on purpose: it overrides that line height so
        // the platform centres the value (see `BOXED_VALUE_LEADING`).
        !isUnderline && !multiple && BOXED_VALUE_LEADING,
        variantTokens.text,
        optionLine,
        PICKER_CLASS,
        "disabled:cursor-not-allowed",
        multiple && "min-h-[3.25rem]",
        selectClassName,
      )}
      defaultValue={needsPlaceholderDefault ? "" : undefined}
      {...rest}
      // After the spread, so a caller cannot leave a select that reports
      // itself as valid while showing the error surface.
      aria-invalid={validationStatus === "error" ? true : rest["aria-invalid"]}
    >
      {placeholder !== undefined && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );

  const field = (
    // Larger hit area for the native <select> inside (the keyboard path is
    // the select's own — arrows/Enter work on it directly).
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- wrapper delegates to the native select
    <span
      onClick={handleWrapperClick}
      className={classNames(
        "group relative flex w-full transition",
        multiple ? "items-stretch" : "items-center",
        !unstyled &&
          (hasStatus
            ? stripBorderColor(variantTokens.surface)
            : variantTokens.surface),
        // Underline drops the horizontal padding — there is no box to inset
        // from — and gains a little extra below, so the text is not sitting on
        // the rule.
        isUnderline
          ? sizeToken.underlinePy
          : classNames(sizeToken.px, sizeToken.py),
        !unstyled && !hasStatus && tokens.focusBorder,
        // A ring around a borderless underline reads as a stray box.
        !unstyled && !isUnderline && !hasStatus && tokens.focusRing,
        !unstyled && hasStatus && FIELD_STATUS_CLASSES[validationStatus],
        // Opacity, not a neutral fill: `disabled:bg-neutral-100` was a
        // same-specificity fight with every variant's own fill, and it turned a
        // glass or underline select into an opaque grey slab.
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {leadingIcon && (
        <span
          className={classNames(
            "pointer-events-none mr-2 inline-flex shrink-0 items-center transition-colors",
            // Resting colour from the variant, focus accent from the tone. The
            // old caret was tone-coloured at rest and never changed.
            variantTokens.icon,
            !hasStatus && tokens.icon,
            statusIconClass,
          )}
        >
          {renderVisual(leadingIcon)}
        </span>
      )}

      {multiple && !unstyled ? (
        <ScrollArea
          tabIndex={-1}
          className={classNames("min-w-0 flex-1", LIST_MAX_HEIGHT)}
          contentClassName="px-1"
        >
          {selectEl}
        </ScrollArea>
      ) : (
        selectEl
      )}

      {showCaret && (
        <span
          className={classNames(
            "pointer-events-none ml-2 inline-flex shrink-0 items-center transition-colors",
            variantTokens.icon,
            !hasStatus && tokens.icon,
            statusIconClass,
          )}
        >
          {renderIcon("ArrowDown", sizeToken.icon)}
        </span>
      )}
    </span>
  );

  // The gradient variant is the same field with a coloured glow behind it,
  // matching `Input`, `Textarea` and `SearchBar` — one halo behind the box,
  // not a ring. `glow.pad` keeps it inside the component's own box.
  if (variant === "gradient" && !unstyled) {
    return (
      <span
        className={classNames(
          "relative flex w-full overflow-hidden rounded-[28px]",
          glow.pad,
        )}
      >
        <span
          className={classNames(
            "absolute rounded-2xl transition-opacity duration-500",
            glow.inset,
          )}
          style={{
            // Two lobes pushed apart on the shadow axis: start colour glows
            // from the left, end colour from the right.
            boxShadow: `-${glow.offset}px 0 ${glow.blur}px ${glow.spread}px ${glowFrom}, ${glow.offset}px 0 ${glow.blur}px ${glow.spread}px ${glowTo}`,
            opacity: focused ? glow.focusOpacity : glow.idleOpacity,
          }}
          aria-hidden
        />
        {field}
      </span>
    );
  }

  return field;
});

Select.displayName = "Select";

(Select as unknown as { __UI_SELECT?: boolean }).__UI_SELECT = true;

export default Select;
