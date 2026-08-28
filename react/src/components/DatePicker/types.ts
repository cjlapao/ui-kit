import type React from "react";
import type {
  ControlSize,
  GlowIntensity,
  InputVariant,
  SurfaceCorner,
  SurfaceVariant,
  TrueColor,
  ValidationStatus,
} from "../../theme/Theme";
import type {
  DatePickerSelectionMode,
  DatePickerValue,
} from "../../../../common/utils/dates";

export type { DatePickerValue, DatePickerSelectionMode };

/**
 * The selection shapes the kit ships today. PrimeVue's `multiple` mode and the
 * time picker are deliberately out of v1 — see the design spec
 * (`docs/superpowers/specs/2026-08-28-datepicker-design.md`); the value type
 * already leaves room for a `Date[]` to be added without breaking callers.
 */
export const DATEPICKER_SELECTION_MODES: readonly DatePickerSelectionMode[] =
  ["single", "range"];

export const DATEPICKER_APPEND_TO = ["body", "self"] as const;
export type DatePickerAppendTo = (typeof DATEPICKER_APPEND_TO)[number];

/**
 * `Loader`'s two variants plus a calendar-shaped skeleton — the same shape
 * `Panel`'s `loaderType` offers, so a loading DatePicker and a loading Panel
 * read the same.
 */
export const DATEPICKER_LOADER_TYPES = [
  "spinner",
  "progress",
  "skeleton",
] as const;
export type DatePickerLoaderType = (typeof DATEPICKER_LOADER_TYPES)[number];

/**
 * The native `value`/`defaultValue`/`onChange` are the component's own
 * (value-based) props, so they are `Omit`ted from the input attributes rather
 * than shadowed — a shadowed name would spread the native one over the
 * component's (brief §5.9).
 */
export interface DatePickerProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    | "size"
    | "color"
    | "className"
    | "value"
    | "defaultValue"
    | "onChange"
  > {
  // ── Selection ─────────────────────────────────────────────────────────────
  /** @default "single" */
  selectionMode?: DatePickerSelectionMode;
  /** Controlled value. `Date | null` (single) or `[Date, Date | null] | null` (range). */
  value?: DatePickerValue;
  /** Initial value when uncontrolled. */
  defaultValue?: DatePickerValue;
  /** Fires on every commit: calendar pick, valid typed date, Today, Clear. */
  onChange?: (value: DatePickerValue) => void;
  /** date-fns token format for the input text. @default "MMM d, yyyy" */
  format?: string;

  // ── Constraints ───────────────────────────────────────────────────────────
  /** Earliest selectable day. `Date` or ISO-ish string. */
  minDate?: Date | string;
  /** Latest selectable day. `Date` or ISO-ish string. */
  maxDate?: Date | string;
  /** Never-selectable weekdays, `getDay()` numbering (0 = Sunday). */
  disabledDays?: number[];
  /** Never-selectable dates, or a predicate. */
  disabledDates?: Date[] | ((date: Date) => boolean);
  /** First column of the grid. @default 1 (Monday) */
  weekStartsOn?: 0 | 1;

  // ── Calendar display ──────────────────────────────────────────────────────
  /** Draw leading/trailing other-month days. @default true */
  showOtherMonths?: boolean;
  /** Make other-month days selectable. @default false */
  selectOtherMonths?: boolean;
  /** Clear icon in the field while a value is set. @default false */
  showClear?: boolean;
  /** Today + Clear footer row. @default false */
  showButtonBar?: boolean;
  /** Render the panel in place — no input, no portal. @default false */
  inline?: boolean;
  /** Focus of the input opens the overlay. @default true */
  showOnFocus?: boolean;
  /** Where the overlay mounts. @default "body" (portal, Picker positioning) */
  appendTo?: DatePickerAppendTo;
  /** Close after a single pick. @default true */
  hideOnSelect?: boolean;
  /** Close after a range is completed. @default false */
  hideOnRangeSelection?: boolean;

  // ── Field system — the same box `Input` draws ─────────────────────────────
  /** @default "md" */
  size?: ControlSize;
  /** Accent for the focus border/ring and the selected days. @default "blue" */
  tone?: TrueColor;
  /** Alias for `tone`, matching `Input` and `SearchBar`. */
  color?: TrueColor;
  /** @default "flat" */
  variant?: InputVariant;
  /** How prominent the gradient glow is. @default "soft" */
  glowIntensity?: GlowIntensity;
  /** Start colour of the gradient glow. Defaults to the tone's 600 shade. */
  gradientFrom?: string;
  /** End colour of the gradient glow. Defaults to the tone's 400 shade. */
  gradientTo?: string;
  /** @default "none" */
  validationStatus?: ValidationStatus;
  leadingIcon?: string | React.ReactElement;
  /** Classes for the field box — the element carrying border, fill and radius. */
  className?: string;
  /** Classes for the inner `<input>` itself. */
  inputClassName?: string;
  /** Drop the surface entirely — used by `InputGroup`. */
  unstyled?: boolean;

  // ── States ────────────────────────────────────────────────────────────────
  /** @default false */
  loading?: boolean;
  /** Spinner/progress over the box; `skeleton` shapes the (inline) calendar. @default "spinner" */
  loaderType?: DatePickerLoaderType;
  /** @default false */
  readonly?: boolean;
  /** @default false */
  disabled?: boolean;

  // ── Panel family — the calendar surface ───────────────────────────────────
  /** @default "elevated" */
  panelVariant?: SurfaceVariant;
  /** Panel fill tone; the selected days use the field `tone` instead. @default "neutral" */
  panelTone?: TrueColor;
  /** @default the shared container corner */
  panelCorner?: SurfaceCorner;
  panelClassName?: string;

  // ── Events & copy ─────────────────────────────────────────────────────────
  onShow?: () => void;
  onHide?: () => void;
  /** Fires with the raw text while it cannot be parsed. */
  onInvalidInputChange?: (text: string) => void;
  /** Accessible name for the input. @default the `placeholder` or "Date" */
  ariaLabel?: string;
  /** Accessible name for the calendar panel. Derived from the mode by default. */
  panelAriaLabel?: string;
  /** Button bar copy. @default "Today" / "Clear" */
  todayButtonLabel?: React.ReactNode;
  clearButtonLabel?: React.ReactNode;
}
