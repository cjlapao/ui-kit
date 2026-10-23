import classNames from "classnames";
import React, {
  type ChangeEvent,
  type ClipboardEvent,
  type ForwardedRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_GLOW_INTENSITY,
  getFieldToneTokens,
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
import { useKitT } from "../i18n";
import type { PillCorner } from "./Pill";

/**
 * The shared input surface family — the cells really are fields, so they
 * take the same six surfaces every other input does (`glass` blurs,
 * `gradient` glows behind the whole group).
 */
export const OTP_VARIANTS = [
  "flat",
  "elevated",
  "ghost",
  "underline",
  "glass",
  "gradient",
] as const satisfies readonly InputVariant[];
export type InputOtpVariant = InputVariant;

/** The pre-standardisation surface pair. */
export type LegacyInputOtpVariant = "outlined" | "filled";

const LEGACY_VARIANT_FOR: Record<LegacyInputOtpVariant, InputVariant> = {
  // `outlined` was a flat border; `filled` was a soft neutral fill — the
  // ghost surface, tone-tinted like the rest of the family now.
  outlined: "flat",
  filled: "ghost",
};

export type InputOtpSize = ControlSize;

/** Maximum number of cells, so a typo in `length` cannot render a wall. */
const MAX_LENGTH = 20;

export interface InputOtpProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** The full code, one character per cell. */
  value?: string;
  /** Initial code when uncontrolled. */
  defaultValue?: string;
  /** Fired on every change to the code. */
  onChange?: (value: string) => void;
  /** Fired once, when the last cell transitions to filled. */
  onComplete?: (value: string) => void;
  /** Number of cells. @default 4 */
  length?: number;
  /** Hide the characters behind the browser's mask. */
  mask?: boolean;
  /** Accept 0–9 only, and hint a numeric keyboard. */
  integerOnly?: boolean;
  /**
   * The shared input surface family for the cells. The deprecated
   * `"outlined"` / `"filled"` resolve to `flat` / `ghost`.
   * @default "flat"
   */
  variant?: InputOtpVariant | LegacyInputOtpVariant;
  /** @default "md" */
  size?: InputOtpSize;
  /**
   * Cell radius. `"auto"` keeps the size ladder's own rounding; the tokens
   * come from the pill corner scale — the card-corner scale would turn a
   * 28px square into a blob, for the reason `Pill` documents.
   * @default "auto"
   */
  corner?: "auto" | PillCorner;
  /** Focus accent. @default "blue" */
  tone?: TrueColor;
  /** Start colour of the gradient glow. Defaults to the tone's 600 shade. */
  gradientFrom?: string;
  /** End colour of the gradient glow. Defaults to the tone's 400 shade. */
  gradientTo?: string;
  /** How prominent the gradient glow is. @default `"subtle"` (`DEFAULT_GLOW_INTENSITY`). */
  glowIntensity?: GlowIntensity;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Form field name, set on the first cell. */
  name?: string;
  /**
   * Accessible name for the cell group.
   * @default "One-time password" (`kit.inputotp.label`)
   */
  ariaLabel?: string;
  /**
   * Replace the default cell. Spread `cell.inputProps` onto your own
   * `<input>` to keep the value, events, aria label and focus wiring.
   */
  renderCell?: (cell: InputOtpCellContext) => React.ReactNode;
}

export interface InputOtpCellContext {
  index: number;
  /** The cell's character, or `""` when empty. */
  value: string;
  filled: boolean;
  focused: boolean;
  inputProps: InputHTMLAttributes<HTMLInputElement> & {
    ref: (element: HTMLInputElement | null) => void;
  };
}

// ── Surfaces ──────────────────────────────────────────────────────────────────
// The cells are fields, so their surface and focus come from the shared
// tables — `getInputVariantTokens` (all six surfaces, tone-tinted ghost
// included) and `getFieldToneTokens` (the same static focus pair every
// field emits, safelist-covered). The old local tone map generated
// `focus:border-*` per tone and nothing else.

const INVALID_CELL =
  "border-rose-500 focus:border-rose-500 focus:ring-rose-500/60 dark:border-rose-400 dark:focus:border-rose-400 dark:focus:ring-rose-400/60";

const SIZE_STYLES: Record<
  InputOtpSize,
  { cell: string; rounded: string; text: string; gap: string }
> = {
  xs: {
    cell: "h-7 w-7",
    rounded: "rounded-md",
    text: "text-xs",
    gap: "gap-1.5",
  },
  sm: {
    cell: "h-9 w-9",
    rounded: "rounded-md",
    text: "text-sm",
    gap: "gap-1.5",
  },
  md: {
    cell: "h-11 w-11",
    rounded: "rounded-lg",
    text: "text-base",
    gap: "gap-2",
  },
  lg: {
    cell: "h-14 w-14",
    rounded: "rounded-lg",
    text: "text-xl",
    gap: "gap-2",
  },
  xl: {
    cell: "h-16 w-16",
    rounded: "rounded-xl",
    text: "text-2xl",
    gap: "gap-2.5",
  },
};

/** The pill corner scale — see the `corner` prop doc. */
const CELL_CORNERS: Record<PillCorner, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

const InputOtp = forwardRef<HTMLDivElement, InputOtpProps>(function InputOtp(
  {
    value,
    defaultValue,
    onChange,
    onComplete,
    length = 4,
    mask = false,
    integerOnly = false,
    variant = "flat",
    size = "md",
    corner = "auto",
    tone: toneProp,
    gradientFrom,
    gradientTo,
    glowIntensity = DEFAULT_GLOW_INTENSITY,
    invalid = false,
    disabled = false,
    readOnly = false,
    name,
    ariaLabel,
    renderCell,
    className,
    ...rest
  },
  ref: ForwardedRef<HTMLDivElement>,
) {
  // The fallback lives here, not in the parameter list, so `explicitTone`
  // still means *the caller chose this*.
  const tone = toneProp ?? "blue";
  const t = useKitT();
  const groupLabel = ariaLabel ?? t("kit.inputotp.label");
  const clampedLength = Math.min(
    MAX_LENGTH,
    Math.max(1, Math.floor(Number.isFinite(length) ? length : 4)),
  );

  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(() =>
    (defaultValue ?? "").slice(0, clampedLength),
  );
  const current = (isControlled ? value : innerValue) ?? "";

  const chars = Array.from(
    { length: clampedLength },
    (_, i) => current[i] ?? "",
  );

  const cellRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const focusCell = useCallback((index: number) => {
    cellRefs.current[index]?.focus();
  }, []);

  const commit = useCallback(
    (next: string) => {
      if (next === current) return;
      const wasComplete = current.length >= clampedLength;
      if (!isControlled) setInnerValue(next);
      onChange?.(next);
      if (!wasComplete && next.length >= clampedLength) onComplete?.(next);
    },
    [current, clampedLength, isControlled, onChange, onComplete],
  );

  const setChar = useCallback(
    (index: number, char: string) => {
      const next = [...chars];
      next[index] = char;
      commit(next.join(""));
    },
    [chars, commit],
  );

  const isAllowed = useCallback(
    (char: string) => (integerOnly ? /^\d$/.test(char) : /\S/.test(char)),
    [integerOnly],
  );

  /** Fill from `start` with up to the remaining capacity; park focus at the end. */
  const distribute = useCallback(
    (start: number, text: string) => {
      // Same rule as single-key writes: the code is left-justified, so a paste
      // in a hole past the end continues at the end instead.
      const at = Math.min(start, current.length);
      const clean = [...text]
        .filter((char) => isAllowed(char))
        .slice(0, clampedLength - at);
      if (!clean.length) return;
      const next = [...chars];
      clean.forEach((char, j) => {
        next[at + j] = char;
      });
      commit(next.join(""));
      const last = at + clean.length - 1;
      focusCell(Math.min(last, clampedLength - 1));
    },
    [chars, clampedLength, commit, current.length, focusCell, isAllowed],
  );

  const handleCellChange = useCallback(
    (index: number, event: ChangeEvent<HTMLInputElement>) => {
      // Real browsers never deliver input events to disabled/readonly cells;
      // this keeps synthetic ones (tests, assistive tech) honest too.
      if (disabled || readOnly) return;
      const raw = event.target.value;
      if (raw === "") {
        if (chars[index]) setChar(index, "");
        return;
      }
      const allowed = [...raw].filter((char) => isAllowed(char));
      const char = allowed[allowed.length - 1];
      if (!char) return;
      if (allowed.length > 1) {
        // Some keyboards deliver a chunk even for a "single" keystroke.
        distribute(index, allowed.join(""));
        return;
      }
      // The value is a contiguous string (cell i shows character i), so a
      // keystroke in a hole past the end lands at the end — writing into the
      // hole would leave a gap the string model cannot express.
      const target = Math.min(index, current.length);
      const next = [...chars];
      next[target] = char;
      commit(next.join(""));
      if (target < clampedLength - 1) focusCell(target + 1);
    },
    [
      chars,
      clampedLength,
      commit,
      current.length,
      disabled,
      distribute,
      focusCell,
      isAllowed,
      readOnly,
      setChar,
    ],
  );

  const handleCellKeyDown = useCallback(
    (index: number, event: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          if (index > 0) focusCell(index - 1);
          break;
        case "ArrowRight":
          event.preventDefault();
          if (index < clampedLength - 1) focusCell(index + 1);
          break;
        case "Backspace":
          event.preventDefault();
          if (chars[index]) {
            setChar(index, "");
          } else if (index > 0) {
            setChar(index - 1, "");
            focusCell(index - 1);
          }
          break;
      }
    },
    [chars, clampedLength, disabled, focusCell, setChar],
  );

  const handleCellPaste = useCallback(
    (index: number, event: ClipboardEvent<HTMLInputElement>) => {
      if (disabled || readOnly) return;
      event.preventDefault();
      distribute(index, event.clipboardData.getData("text"));
    },
    [disabled, distribute, readOnly],
  );

  const tokens = getInputVariantTokens(
    variant === "outlined" || variant === "filled"
      ? LEGACY_VARIANT_FOR[variant]
      : variant,
    tone,
    // The family's corner scale is the card one; `corner` (below) overrides
    // the radius on the pill scale, so the tokens stay on `auto`.
    "auto",
    { explicitTone: toneProp },
  );
  const fieldTone = getFieldToneTokens(tone);
  const glow = getGlowTokens(glowIntensity);
  const [glowFrom, glowTo] = resolveGlowGradient(
    tone,
    gradientFrom,
    gradientTo,
  );
  const sizeTokens = SIZE_STYLES[size] ?? SIZE_STYLES.md;

  const cellClass = classNames(
    "block appearance-none border p-0 text-center font-semibold outline-none transition disabled:cursor-not-allowed disabled:opacity-50",
    sizeTokens.cell,
    sizeTokens.text,
    tokens.text,
    // Swap the radius the surface token baked in for the size ladder's (or a
    // pinned pill-scale corner) — the card radii blob small squares.
    tokens.surface.replace(
      /rounded-\S+/,
      corner === "auto" ? sizeTokens.rounded : CELL_CORNERS[corner],
    ),
    // Inset ring: an outer ring is painted outside the border box and gets
    // clipped by any `overflow: auto|hidden` ancestor (Panel bodies do).
    // `focus-within:` matches an element's own focus, so the shared field
    // pair works cell-wise.
    invalid ? INVALID_CELL : `${fieldTone.focusBorder} ${fieldTone.focusRing}`,
  );

  const cellProps = (index: number): InputOtpCellContext["inputProps"] => ({
    ref: (element: HTMLInputElement | null) => {
      cellRefs.current[index] = element;
    },
    type: mask ? "password" : "text",
    value: chars[index],
    maxLength: 1,
    disabled,
    readOnly,
    name: index === 0 ? name : undefined,
    autoComplete: index === 0 ? "one-time-code" : "off",
    inputMode: integerOnly ? "numeric" : undefined,
    pattern: integerOnly ? "[0-9]*" : undefined,
    "aria-label": t("kit.inputotp.cell", {
      label: groupLabel,
      index: index + 1,
      total: clampedLength,
    }),
    "aria-invalid": invalid || undefined,
    onChange: (event) => handleCellChange(index, event),
    onKeyDown: (event) => handleCellKeyDown(index, event),
    onPaste: (event) => handleCellPaste(index, event),
    onFocus: (event) => {
      setFocusedIndex(index);
      // Select so the next keystroke replaces instead of being dropped by
      // maxLength on a filled cell.
      event.currentTarget.select();
    },
    onBlur: () => setFocusedIndex(-1),
  });

  const group = (
    <div
      ref={ref}
      role="group"
      aria-label={groupLabel}
      className={classNames(
        "inline-flex items-center",
        sizeTokens.gap,
        className,
      )}
      {...rest}
    >
      {Array.from({ length: clampedLength }, (_, index) => {
        const context: InputOtpCellContext = {
          index,
          value: chars[index],
          filled: chars[index] !== "",
          focused: focusedIndex === index,
          inputProps: cellProps(index),
        };
        if (renderCell) {
          return (
            <React.Fragment key={index}>{renderCell(context)}</React.Fragment>
          );
        }
        return (
          <input key={index} {...context.inputProps} className={cellClass} />
        );
      })}
    </div>
  );

  // The `gradient` variant is the same group with a coloured glow behind it,
  // matching `Input`, `Textarea` and the rest — the glow belongs to the
  // control, not to every cell. `glow.pad` keeps the halo inside the
  // component's own box, so a clipping ancestor cannot shear it off.
  if (variant === "gradient") {
    return (
      <span
        className={classNames(
          "relative inline-flex overflow-hidden rounded-[28px]",
          glow.pad,
        )}
      >
        <span
          className={classNames(
            "absolute rounded-2xl transition-opacity duration-500",
            glow.inset,
          )}
          style={{
            boxShadow: `-${glow.offset}px 0 ${glow.blur}px ${glow.spread}px ${glowFrom}, ${glow.offset}px 0 ${glow.blur}px ${glow.spread}px ${glowTo}`,
            opacity: focusedIndex >= 0 ? glow.focusOpacity : glow.idleOpacity,
          }}
          aria-hidden
        />
        {group}
      </span>
    );
  }

  return group;
});

InputOtp.displayName = "InputOtp";

export default InputOtp;
