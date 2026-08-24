import classNames from "classnames";
import {
  type ForwardedRef,
  type ReactNode,
  type TextareaHTMLAttributes,
  forwardRef,
  useId,
  useMemo,
  useState,
} from "react";
import {
  TRUE_COLORS,
  getGlowTokens,
  getInputVariantTokens,
  resolveGlowGradient,
} from "../theme/Theme";
import type {
  ControlSize,
  GlowIntensity,
  InputVariant,
  TrueColor,
} from "../theme/Theme";

export type TextareaSize = ControlSize;
/** The shared input variant set, including `glass` and `gradient`. */
export type TextareaVariant = InputVariant;
export type TextareaValidationStatus = "none" | "error" | "success";
export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

/** Padding, type scale and starting height, on the shared control scale. */
const sizeTokens: Record<
  TextareaSize,
  { padding: string; text: string; minHeight: string }
> = {
  xs: { padding: "px-2.5 py-1.5", text: "text-xs", minHeight: "min-h-20" },
  sm: { padding: "px-3 py-2", text: "text-sm", minHeight: "min-h-24" },
  md: { padding: "px-3.5 py-2.5", text: "text-sm", minHeight: "min-h-28" },
  lg: { padding: "px-4 py-3", text: "text-base", minHeight: "min-h-32" },
  xl: { padding: "px-5 py-3.5", text: "text-base", minHeight: "min-h-40" },
};

/**
 * Focus indicator per tone, generated from the shared colour list.
 *
 * The previous map was hand-written and covered 7 of the 21 TrueColors — every
 * other tone silently fell back to neutral. It also repeated identical border
 * and background strings in every entry, which is what the variant styles above
 * are for.
 *
 * The ring is **inset**: an outer ring paints outside the border box, so any
 * ancestor with `overflow: auto | hidden` (a `Panel` body, by default) shears
 * it off and leaves hard square corners.
 */
const buildFocusRing = (tone: TrueColor) =>
  `focus:border-${tone}-400 focus:ring-2 focus:ring-inset focus:ring-${tone}-400/60`;

const focusRings: Record<TrueColor, string> = Object.fromEntries(
  TRUE_COLORS.map((tone) => [tone, buildFocusRing(tone)]),
) as Record<TrueColor, string>;

/** Border-only focus, for the underline variant which has no box to ring. */
const buildFocusBorder = (tone: TrueColor) => `focus:border-${tone}-400`;

const focusBorders: Record<TrueColor, string> = Object.fromEntries(
  TRUE_COLORS.map((tone) => [tone, buildFocusBorder(tone)]),
) as Record<TrueColor, string>;

const statusClasses: Record<
  Exclude<TextareaValidationStatus, "none">,
  string
> = {
  error:
    "border-rose-500 focus:border-rose-500 focus:ring-rose-500/60 dark:border-rose-400 dark:focus:border-rose-400 dark:focus:ring-rose-400/60",
  success:
    "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/60 dark:border-emerald-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/60",
};

/** Help text colour follows the validation state. */
const helpToneClasses: Record<TextareaValidationStatus, string> = {
  none: "text-neutral-500 dark:text-neutral-400",
  error: "text-rose-600 dark:text-rose-400",
  success: "text-emerald-600 dark:text-emerald-400",
};

const disabledClasses =
  "disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 dark:disabled:border-neutral-700 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500";

const resizeClasses: Record<TextareaResize, string> = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
};

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "color"> {
  size?: TextareaSize;
  /** Surface treatment, matching `Input`. @default "elevated" */
  variant?: TextareaVariant;
  /** Accent tone for the focus indicator. @default "blue" */
  tone?: TrueColor;
  validationStatus?: TextareaValidationStatus;
  resize?: TextareaResize;
  /** Field label rendered above the control and wired up with `htmlFor`. */
  label?: ReactNode;
  /**
   * Hint rendered under the control. Colour follows `validationStatus`, and it
   * is linked to the textarea with `aria-describedby`.
   */
  helpText?: ReactNode;
  /** Show a `used / maxLength` counter under the control. Needs `maxLength`. */
  showCount?: boolean;
  /** Stretch the wrapper to the full width of its container. @default true */
  fullWidth?: boolean;
  /** Start colour of the gradient glow. Defaults to the tone's 600 shade. */
  gradientFrom?: string;
  /** End colour of the gradient glow. Defaults to the tone's 400 shade. */
  gradientTo?: string;
  /** How prominent the gradient glow is. @default "soft" */
  glowIntensity?: GlowIntensity;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      size = "md",
      variant = "elevated",
      tone = "blue",
      validationStatus = "none",
      className,
      resize = "vertical",
      disabled,
      label,
      helpText,
      showCount = false,
      fullWidth = true,
      gradientFrom,
      gradientTo,
      glowIntensity = "soft",
      onFocus,
      onBlur,
      id,
      value,
      defaultValue,
      maxLength,
      ...rest
    },
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) {
    const [focused, setFocused] = useState(false);
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const helpId = `${textareaId}-help`;

    const sizeToken = sizeTokens[size] ?? sizeTokens.md;
    const variantTokens = getInputVariantTokens(variant);
    const resizeClass = resizeClasses[resize] ?? resizeClasses.vertical;
    const glow = getGlowTokens(glowIntensity);
    const [glowFrom, glowTo] = resolveGlowGradient(
      tone,
      gradientFrom,
      gradientTo,
    );
    const focusClass =
      variant === "underline"
        ? (focusBorders[tone] ?? focusBorders.blue)
        : (focusRings[tone] ?? focusRings.blue);

    // Counter reads the controlled value when there is one, otherwise the
    // initial value — it does not force the field to become controlled.
    const currentLength = useMemo(() => {
      const source = value ?? defaultValue;
      return typeof source === "string" ? source.length : 0;
    }, [value, defaultValue]);

    const classes = useMemo(
      () =>
        classNames(
          "block w-full focus:outline-none",
          variantTokens.surface,
          variantTokens.text,
          variant === "underline" ? "px-0" : sizeToken.padding,
          sizeToken.text,
          sizeToken.minHeight,
          focusClass,
          disabledClasses,
          resizeClass,
          validationStatus !== "none" ? statusClasses[validationStatus] : null,
          className,
        ),
      [
        className,
        focusClass,
        resizeClass,
        sizeToken.minHeight,
        sizeToken.padding,
        sizeToken.text,
        validationStatus,
        variant,
      ],
    );

    const showFooter = Boolean(helpText) || (showCount && maxLength != null);

    return (
      <div className={classNames("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-neutral-700 dark:text-neutral-200"
          >
            {label}
          </label>
        )}
        {/* The gradient variant is the same control with a coloured glow behind
            it, so the glow lives in its own layer rather than in the surface. */}
        <div
          className={
            variant === "gradient"
              ? classNames("relative", glow.pad)
              : undefined
          }
        >
          {variant === "gradient" && (
            <div
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
          )}
        <textarea
          ref={ref}
          id={textareaId}
          className={classNames(classes, variant === "gradient" && "relative")}
          disabled={disabled}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          aria-invalid={validationStatus === "error" || undefined}
          aria-describedby={helpText ? helpId : undefined}
          {...rest}
        />
        </div>
        {showFooter && (
          <div className="flex items-start justify-between gap-3 text-xs">
            {helpText ? (
              <span id={helpId} className={helpToneClasses[validationStatus]}>
                {helpText}
              </span>
            ) : (
              <span />
            )}
            {showCount && maxLength != null && (
              <span
                className={classNames(
                  "shrink-0 tabular-nums",
                  currentLength >= maxLength
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-neutral-400 dark:text-neutral-500",
                )}
              >
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

(Textarea as unknown as { __UI_INPUT?: boolean }).__UI_INPUT = true;

export default Textarea;
