import classNames from "classnames";
import React, {
  type ForwardedRef,
  type InputHTMLAttributes,
  forwardRef,
  useState,
} from "react";
import { useIconRenderer } from "../contexts/IconContext";
import {
  TRUE_COLORS,
  getGlowTokens,
  getInputVariantTokens,
  stripBorderColor,
  resolveGlowGradient,
} from "../theme/Theme";
import type {
  ControlSize,
  GlowIntensity,
  InputVariant,
  TrueColor,
} from "../theme/Theme";

export const INPUT_VALIDATION_STATUSES = ["none", "error", "success"] as const;
export type InputValidationStatus =
  (typeof INPUT_VALIDATION_STATUSES)[number];

/**
 * The shared control scale, so an Input lines up with the Button, SearchBar and
 * Select beside it. Was a local `"sm" | "md" | "lg"`, which left `xs` and `xl`
 * unreachable even though every sibling control offered them.
 */
export type InputSize = ControlSize;

/**
 * Re-exported from the theme, where the surfaces live, so `Input`, `Textarea`
 * and `SearchBar` cannot drift apart.
 */
export type { InputVariant };

// ── Tone tokens ───────────────────────────────────────────────────────────────
// Generated from the shared TrueColor list rather than hand-written. The map
// this replaces had 21 entries typed out by hand and two of them were wrong:
// `red` emitted `rose-400`/`rose-500` classes and `green` emitted `emerald-*`,
// so those two tones silently rendered as a different colour.

type InputToneTokens = {
  /** Border colour while anything inside the field has focus. */
  focusBorder: string;
  /** Glow ring while anything inside the field has focus. */
  focusRing: string;
  /** Leading/trailing icon colour while the field has focus. */
  icon: string;
  /** Focus ring for the inline trailing button. */
  buttonFocusRing: string;
};

const buildToneTokens = (color: TrueColor): InputToneTokens => ({
  focusBorder: `focus-within:border-${color}-400`,
  // Inset, matching SearchBar. An outer ring is painted outside the border box,
  // so any ancestor with `overflow: auto|hidden` clips it — `Panel`'s body is
  // `overflow-auto` by default, which shears the ring off and leaves hard
  // square corners.
  focusRing: `focus-within:ring-2 focus-within:ring-inset focus-within:ring-${color}-400/60`,
  icon: `group-focus-within:text-${color}-500`,
  buttonFocusRing: `focus-visible:ring-${color}-400/60`,
});

const TONE_TOKENS: Record<TrueColor, InputToneTokens> = Object.fromEntries(
  TRUE_COLORS.map((color) => [color, buildToneTokens(color)]),
) as Record<TrueColor, InputToneTokens>;

const getToneTokens = (color: TrueColor): InputToneTokens =>
  TONE_TOKENS[color] ?? TONE_TOKENS.blue;

// ── Sizing ────────────────────────────────────────────────────────────────────

/** Padding and type scale, mirroring `SearchBar` so the two line up stacked. */
const SIZE_STYLES: Record<
  ControlSize,
  {
    px: string;
    py: string;
    /** `underline` has no box to inset from, and needs room above the rule. */
    underlinePy: string;
    text: string;
    icon: ControlSize;
    /** Inline trailing button. */
    button: string;
  }
> = {
  xs: {
    px: "px-2",
    py: "py-1",
    underlinePy: "pt-1 pb-2",
    text: "text-xs",
    icon: "xs",
    button: "h-4 w-4",
  },
  sm: {
    px: "px-2.5",
    py: "py-1.5",
    underlinePy: "pt-1.5 pb-2.5",
    text: "text-xs",
    icon: "xs",
    button: "h-5 w-5",
  },
  md: {
    px: "px-3",
    py: "py-2",
    underlinePy: "pt-2 pb-3",
    text: "text-sm",
    icon: "sm",
    button: "h-5 w-5",
  },
  lg: {
    px: "px-4",
    py: "py-2.5",
    underlinePy: "pt-2.5 pb-3.5",
    text: "text-base",
    icon: "sm",
    button: "h-6 w-6",
  },
  xl: {
    px: "px-5",
    py: "py-3",
    underlinePy: "pt-3 pb-4",
    text: "text-base",
    icon: "sm",
    button: "h-6 w-6",
  },
};

/**
 * Border only at rest; the ring is part of the focus state, exactly as it is
 * for the tone tokens. A status used to add a bare `ring-2 ring-inset` at rest
 * with no ring *colour* — an unset ring colour resolves to `currentColor`, so
 * every errored or successful field carried a near-black 2px halo inside its
 * coloured border.
 *
 * These also carry no copy colour. The old version forced
 * `text-neutral-900 dark:text-neutral-100` alongside the border, so an errored
 * `underline` or `glass` field lost the high-contrast pair it needs to stay
 * legible over a backdrop.
 */
const STATUS_CLASSES: Record<Exclude<InputValidationStatus, "none">, string> = {
  error:
    "border-rose-500 dark:border-rose-400 focus-within:border-rose-500 dark:focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-rose-500/60 dark:focus-within:ring-rose-400/60",
  success:
    "border-emerald-500 dark:border-emerald-400 focus-within:border-emerald-500 dark:focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500/60 dark:focus-within:ring-emerald-400/60",
};

type InputVisual = string | React.ReactElement;

export interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "color" | "className"
  > {
  /** @default "md" */
  size?: InputSize;
  /** Accent colour for the focus border, ring and icon highlight. */
  tone?: TrueColor;
  /** Alias for `tone`, matching `SearchBar`'s prop name. */
  color?: TrueColor;
  /** Visual surface style. @default "flat" */
  variant?: InputVariant;
  /** Start colour of the gradient glow. Defaults to the tone's 600 shade. */
  gradientFrom?: string;
  /** End colour of the gradient glow. Defaults to the tone's 400 shade. */
  gradientTo?: string;
  /** How prominent the gradient glow is. @default "soft" */
  glowIntensity?: GlowIntensity;
  /** @default "none" */
  validationStatus?: InputValidationStatus;
  leadingIcon?: InputVisual;
  trailingIcon?: InputVisual;
  /** Renders the trailing icon as a button rather than a static decoration. */
  onTrailingIconClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Accessible name for that button. @default "Input action" */
  trailingIconLabel?: string;
  /**
   * Classes for the field box. The surface moved from the `<input>` to its
   * wrapper (matching `SearchBar`), so this is the element that carries the
   * border, fill and radius.
   */
  className?: string;
  /** @deprecated Use `className`, which is now the box. */
  wrapperClassName?: string;
  /** Classes for the inner `<input>` element itself. */
  inputClassName?: string;
  /** Drops the surface entirely — used by `InputGroup`. */
  unstyled?: boolean;
  fullHeight?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = "md",
    tone,
    color,
    variant = "flat",
    gradientFrom,
    gradientTo,
    glowIntensity = "soft",
    onFocus,
    onBlur,
    validationStatus = "none",
    leadingIcon,
    trailingIcon,
    onTrailingIconClick,
    trailingIconLabel = "Input action",
    className,
    wrapperClassName,
    inputClassName,
    disabled,
    unstyled = false,
    fullHeight = false,
    ...rest
  },
  ref: ForwardedRef<HTMLInputElement>,
) {
  const renderIcon = useIconRenderer();
  const [focused, setFocused] = useState(false);

  const effectiveTone = tone ?? color ?? "blue";
  const sizeToken = SIZE_STYLES[size] ?? SIZE_STYLES.md;
  const tokens = getToneTokens(effectiveTone);
  const variantTokens = getInputVariantTokens(variant);
  const isUnderline = variant === "underline";
  const hasStatus = validationStatus !== "none";

  const glow = getGlowTokens(glowIntensity);
  const [glowFrom, glowTo] = resolveGlowGradient(
    effectiveTone,
    gradientFrom,
    gradientTo,
  );

  const renderVisual = (visual: InputVisual) => {
    if (typeof visual === "string") {
      return renderIcon(visual, sizeToken.icon);
    }
    if (React.isValidElement(visual)) return visual;
    return visual;
  };

  const statusIconClass = classNames(
    validationStatus === "error" && "text-rose-500 dark:text-rose-400",
    validationStatus === "success" && "text-emerald-500 dark:text-emerald-400",
  );

  const leading = leadingIcon ? (
    <span
      className={classNames(
        "mr-2 inline-flex shrink-0 items-center transition-colors",
        // Resting colour from the variant, focus accent from the tone. These do
        // not collide because the tone class is prefixed — the old code applied
        // an unprefixed `text-{tone}-500` next to the variant's own `text-*`,
        // and which one won was decided by emission order.
        variantTokens.icon,
        !hasStatus && tokens.icon,
        statusIconClass,
      )}
    >
      {renderVisual(leadingIcon)}
    </span>
  ) : null;

  const trailing = trailingIcon ? (
    onTrailingIconClick ? (
      <button
        type="button"
        onClick={onTrailingIconClick}
        disabled={disabled}
        aria-label={trailingIconLabel}
        className={classNames(
          "ml-2 inline-flex shrink-0 items-center justify-center rounded transition-colors",
          "focus-visible:outline-none focus-visible:ring-2",
          sizeToken.button,
          tokens.buttonFocusRing,
          variantTokens.icon,
          !hasStatus && "hover:text-neutral-700 dark:hover:text-neutral-200",
          statusIconClass,
          "disabled:cursor-not-allowed",
        )}
      >
        {renderVisual(trailingIcon)}
      </button>
    ) : (
      <span
        className={classNames(
          "pointer-events-none ml-2 inline-flex shrink-0 items-center transition-colors",
          variantTokens.icon,
          !hasStatus && tokens.icon,
          statusIconClass,
        )}
      >
        {renderVisual(trailingIcon)}
      </span>
    )
  ) : null;

  const field = (
    <span
      className={classNames(
        "group relative flex w-full items-center transition",
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
        !unstyled && hasStatus && STATUS_CLASSES[validationStatus],
        // Opacity, not a neutral fill: `disabled:bg-neutral-100` was a
        // same-specificity fight with every variant's own fill, and it turned a
        // glass or underline field into an opaque grey slab.
        disabled && "cursor-not-allowed opacity-60",
        fullHeight && "h-full",
        wrapperClassName,
        className,
      )}
    >
      {leading}
      <input
        ref={ref}
        disabled={disabled}
        className={classNames(
          "min-w-0 flex-1 border-none bg-transparent p-0 outline-none",
          sizeToken.text,
          variantTokens.text,
          "disabled:cursor-not-allowed",
          fullHeight && "h-full",
          inputClassName,
        )}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        {...rest}
        // After the spread, so a caller cannot leave a field that reports
        // itself as valid while showing the error surface.
        aria-invalid={validationStatus === "error" ? true : rest["aria-invalid"]}
      />
      {trailing}
    </span>
  );

  // The gradient variant is the same field with a coloured glow behind it,
  // matching Textarea and SearchBar. `glow.pad` keeps the halo inside the
  // component's own box, so a clipping ancestor cannot shear it off.
  if (variant === "gradient" && !unstyled) {
    return (
      <span
        className={classNames(
          "relative flex w-full",
          glow.pad,
          fullHeight && "h-full",
        )}
      >
        <span
          className={classNames(
            "absolute rounded-2xl leading-none transition-opacity duration-500",
            glow.inset,
            glow.blur,
          )}
          style={{
            background: `linear-gradient(to right, ${glowFrom}, ${glowTo})`,
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

Input.displayName = "Input";

(Input as unknown as { __UI_INPUT?: boolean }).__UI_INPUT = true;

export type InputValidationStatusType = InputValidationStatus;

export default Input;
