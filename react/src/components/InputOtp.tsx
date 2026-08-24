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
import { TRUE_COLORS } from "../theme/Theme";
import type { ControlSize, TrueColor } from "../theme/Theme";

export const OTP_VARIANTS = ["outlined", "filled"] as const;
export type InputOtpVariant = (typeof OTP_VARIANTS)[number];

export type InputOtpSize = ControlSize;

/** Maximum number of cells, so a typo in `length` cannot render a wall. */
const MAX_LENGTH = 20;

export interface InputOtpProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
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
  /** @default "outlined" */
  variant?: InputOtpVariant;
  /** @default "md" */
  size?: InputOtpSize;
  /** Focus accent. @default "blue" */
  tone?: TrueColor;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Form field name, set on the first cell. */
  name?: string;
  /** Accessible name for the cell group. @default "One-time password" */
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

// ── Tone tokens ───────────────────────────────────────────────────────────────
// Generated from the shared TrueColor list, the same way `Input` builds its,
// so a new tone in the theme reaches the OTP without a hand-typed entry.

type OtpToneTokens = {
  focus: string;
};

const buildToneTokens = (color: TrueColor): OtpToneTokens => ({
  // Inset ring: an outer ring is painted outside the border box and gets
  // clipped by any `overflow: auto|hidden` ancestor (Panel bodies do).
  focus: `focus:border-${color}-400 focus:ring-2 focus:ring-inset focus:ring-${color}-400/60`,
});

const TONE_TOKENS: Record<TrueColor, OtpToneTokens> = Object.fromEntries(
  TRUE_COLORS.map((color) => [color, buildToneTokens(color)]),
) as Record<TrueColor, OtpToneTokens>;

const getToneTokens = (color: TrueColor): OtpToneTokens =>
  TONE_TOKENS[color] ?? TONE_TOKENS.blue;

// ── Surfaces ──────────────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<InputOtpVariant, string> = {
  outlined:
    "border border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-800",
  filled: "border border-transparent bg-neutral-100 dark:bg-neutral-700/50",
};

const INVALID_CELL =
  "border-rose-500 focus:border-rose-500 focus:ring-rose-500/60 dark:border-rose-400 dark:focus:border-rose-400 dark:focus:ring-rose-400/60";

const SIZE_STYLES: Record<
  InputOtpSize,
  { cell: string; text: string; gap: string }
> = {
  xs: { cell: "h-7 w-7 rounded-md", text: "text-xs", gap: "gap-1.5" },
  sm: { cell: "h-9 w-9 rounded-md", text: "text-sm", gap: "gap-1.5" },
  md: { cell: "h-11 w-11 rounded-lg", text: "text-base", gap: "gap-2" },
  lg: { cell: "h-14 w-14 rounded-lg", text: "text-xl", gap: "gap-2" },
  xl: { cell: "h-16 w-16 rounded-xl", text: "text-2xl", gap: "gap-2.5" },
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
    variant = "outlined",
    size = "md",
    tone = "blue",
    invalid = false,
    disabled = false,
    readOnly = false,
    name,
    ariaLabel = "One-time password",
    renderCell,
    className,
    ...rest
  },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const clampedLength = Math.min(
    MAX_LENGTH,
    Math.max(1, Math.floor(Number.isFinite(length) ? length : 4)),
  );

  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(
    () => (defaultValue ?? "").slice(0, clampedLength),
  );
  const current = (isControlled ? value : innerValue) ?? "";

  const chars = Array.from({ length: clampedLength }, (_, i) => current[i] ?? "");

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
    [chars, clampedLength, commit, current.length, disabled, distribute, focusCell, isAllowed, readOnly, setChar],
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

  const tokens = getToneTokens(tone);
  const sizeTokens = SIZE_STYLES[size] ?? SIZE_STYLES.md;

  const cellClass = classNames(
    "block appearance-none border bg-transparent p-0 text-center font-semibold text-neutral-900 outline-none transition disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-50",
    sizeTokens.cell,
    sizeTokens.text,
    VARIANT_STYLES[variant],
    invalid ? INVALID_CELL : tokens.focus,
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
    "aria-label": `${ariaLabel}, character ${index + 1} of ${clampedLength}`,
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

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      className={classNames("inline-flex items-center", sizeTokens.gap, className)}
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
          return <React.Fragment key={index}>{renderCell(context)}</React.Fragment>;
        }
        return <input key={index} {...context.inputProps} className={cellClass} />;
      })}
    </div>
  );
});

InputOtp.displayName = "InputOtp";

export default InputOtp;
