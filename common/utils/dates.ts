// Per-function entry points rather than the `date-fns` barrel: the barrel
// re-exports the whole library, and pulling it through the component barrel
// in the demo's vitest run was the slow part of the SmartGridLayout barrel
// test (2.5 s → the 5 s timeout). Per-function modules are tiny.
import { addMonths } from "date-fns/addMonths";
import { addYears } from "date-fns/addYears";
import { format } from "date-fns/format";
import { isBefore } from "date-fns/isBefore";
import { isSameDay } from "date-fns/isSameDay";
import { isValid } from "date-fns/isValid";
import { parse } from "date-fns/parse";
import { startOfDay } from "date-fns/startOfDay";

/**
 * Date mechanics for the kit's date controls (currently `DatePicker`).
 *
 * Framework-agnostic on purpose: the Vue port reuses this module, and keeping
 * the calendar maths out of the component files means a component test fails
 * on a wrong date, not on a wrong class. Formatting and parsing use
 * date-fns token strings so a `format` prop is exactly what date-fns
 * documents.
 */

export type DatePickerSelectionMode = "single" | "range";

/**
 * What a DatePicker holds.
 *
 * - `single` → `Date | null`
 * - `range`  → `[start, end | null] | null` — the second element is `null`
 *   while the range is still open (start picked, end not yet).
 */
export type DatePickerValue = Date | [Date, Date | null] | null;

export const DEFAULT_DATE_FORMAT = "MMM d, yyyy";
/** Literal separator range values and range input text use. */
export const RANGE_SEPARATOR = " - ";

/** Sunday-first, matching `Date.getDay()`. */
export const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const WEEKDAY_LABELS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Same calendar day (local time) — date-fns' `isSameDay` re-exported under a
 *  kit-facing name so callers don't need to know the library. */
export const isSameDayDate = isSameDay;

/** `Date` instances and ISO-ish strings/numbers normalise to a fresh `Date`, or `null`. */
export const normalizeDate = (
  value: Date | string | number | null | undefined,
): Date | null => {
  if (value === null || value === undefined) return null;
  const date = value instanceof Date ? value : new Date(value);
  return isValid(date) ? new Date(date.getTime()) : null;
};

/** Local-midnight display of a date: `format(value, "EEE d MMM yyyy")` for labels. */
export const formatDateLabel = (value: Date): string =>
  format(value, "EEEE, MMMM d, yyyy");

export const formatDate = (
  value: Date,
  formatString: string = DEFAULT_DATE_FORMAT,
): string => format(value, formatString);

/** A value (or each end of a range) rendered in the input. */
export const formatValue = (
  value: DatePickerValue,
  formatString: string = DEFAULT_DATE_FORMAT,
): string => {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) {
    const [start, end] = value;
    if (!start) return end ? format(end, formatString) : "";
    return end
      ? `${format(start, formatString)}${RANGE_SEPARATOR}${format(end, formatString)}`
      : format(start, formatString);
  }
  return format(value, formatString);
};

/** One date of text, in the given token format. Unparseable → `null`. */
/**
 * Full month name → three-letter form, and back, for input normalisation.
 * date-fns v4's `parse` matches `MMM` exactly (the input must be the
 * three-letter form), so "March 15" fails a `MMM d` pattern. Tries the raw
 * text first, then normalised variants, so either spelling parses against
 * either `MMM`/`MMMM` patterns.
 */
const MONTH_NAME_TO_ABBR: Record<string, string> = {};
const MONTH_ABBR_TO_NAME: Record<string, string> = {};
MONTH_NAMES.forEach((name, index) => {
  const abbr = MONTH_NAMES_SHORT[index];
  MONTH_NAME_TO_ABBR[name.toLowerCase()] = abbr;
  MONTH_ABBR_TO_NAME[abbr.toLowerCase()] = name;
});

// Longest full name first so no name prefixes another alternative.
const FULL_MONTH_REGEX = new RegExp(
  `\\b(${[...MONTH_NAMES].sort((a, b) => b.length - a.length).join("|")})\\b`,
  "gi",
);

const abbreviateMonthNames = (text: string): string =>
  text.replace(
    FULL_MONTH_REGEX,
    (match) => MONTH_NAME_TO_ABBR[match.toLowerCase()] ?? match,
  );

const ABBR_MONTH_REGEX =
  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g;

const expandMonthNames = (text: string): string =>
  text.replace(ABBR_MONTH_REGEX, (match) => {
    const expanded = MONTH_ABBR_TO_NAME[match.toLowerCase()];
    return expanded ? `${expanded.charAt(0) + expanded.slice(1).toLowerCase()}` : match;
  });

/** Candidate spellings to attempt, raw text first. */
const parseCandidates = (text: string): string[] => {
  const candidates = [text, abbreviateMonthNames(text), expandMonthNames(text)];
  return [...new Set(candidates)];
};

export const parseDateText = (
  text: string,
  formatString: string = DEFAULT_DATE_FORMAT,
  reference: Date = new Date(),
): Date | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;
  for (const candidate of parseCandidates(trimmed)) {
    const parsed = parse(candidate, formatString, reference);
    if (isValid(parsed)) return parsed;
  }
  return null;
};

/**
 * Free-typed input → value. Single: one date. Range: `start - end`, where a
 * missing or empty end yields an open range `[start, null]`. An end before the
 * start, or an unparseable start, yields `null` (the text stays as typed and
 * is flagged invalid by the caller).
 */
export const parseValueText = (
  text: string,
  selectionMode: DatePickerSelectionMode = "single",
  formatString: string = DEFAULT_DATE_FORMAT,
  reference: Date = new Date(),
): DatePickerValue | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;
  if (selectionMode === "single") {
    return parseDateText(trimmed, formatString, reference);
  }
  // Split on the raw text (not pre-trimmed) so a trailing separator with a
  // blank end — "Mar 10, 2026 -" — still parses as an open range; each part
  // is trimmed by parseDateText.
  const withTrailingSeparator = /\s-$/.test(text) ? `${text} ` : text;
  const parts = withTrailingSeparator.split(RANGE_SEPARATOR);
  if (parts.length !== 2) return null;
  const start = parseDateText(parts[0], formatString, reference);
  if (!start) return null;
  if (parts[1].trim() === "") return [start, null];
  const end = parseDateText(parts[1], formatString, reference);
  if (end && isBefore(startOfDay(end), startOfDay(start))) return null;
  return [start, end ?? null];
};

export interface DateConstraints {
  /** Earliest selectable day (inclusive), day-level. */
  minDate?: Date | null;
  /** Latest selectable day (inclusive), day-level. */
  maxDate?: Date | null;
  /** Weekdays that are never selectable — `getDay()` numbering, 0 = Sunday. */
  disabledDays?: number[];
  /** Exact dates (compared day-level) or a predicate. */
  disabledDates?: Date[] | ((date: Date) => boolean) | null;
}

/** Whether a calendar day may be picked, under the given constraints. */
export const isDateSelectable = (
  date: Date,
  constraints: DateConstraints = {},
): boolean => {
  const { minDate, maxDate, disabledDays, disabledDates } = constraints;
  const day = startOfDay(date);
  if (minDate && isBefore(day, startOfDay(minDate))) return false;
  if (maxDate && isBefore(startOfDay(maxDate), day)) return false;
  if (disabledDays && disabledDays.length > 0 && disabledDays.includes(date.getDay())) {
    return false;
  }
  if (typeof disabledDates === "function") return !disabledDates(date);
  if (Array.isArray(disabledDates)) {
    return !disabledDates.some((disabled) => isSameDay(disabled, date));
  }
  return true;
};

export interface DayCell {
  date: Date;
  /** Day of month — the number drawn in the cell. */
  day: number;
  /** Day belongs to a neighbouring month (leading/trailing filler). */
  otherMonth: boolean;
  /** Day is today. */
  today: boolean;
  /** Passes the constraints AND is allowed by `selectOtherMonths`. */
  selectable: boolean;
}

/**
 * A full 6×7 month grid — always 42 cells.
 *
 * Other-month days fill the leading and trailing slots, so the panel's height
 * never changes from month to month. PrimeVue renders 4–6 rows instead and the
 * overlay resizes mid-animation; a fixed grid is the only shape the open/close
 * motion can rely on.
 */
export const buildMonthGrid = (
  year: number,
  month: number,
  options: {
    weekStartsOn?: 0 | 1;
    constraints?: DateConstraints;
    today?: Date;
    selectOtherMonths?: boolean;
  } = {},
): DayCell[] => {
  const {
    weekStartsOn = 1,
    constraints = {},
    today = new Date(),
    selectOtherMonths = false,
  } = options;
  const firstOfMonth = new Date(year, month, 1);
  const offset = (firstOfMonth.getDay() - weekStartsOn + 7) % 7;
  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(year, month, 1 - offset + i);
    const inMonth =
      date.getMonth() === month && date.getFullYear() === year;
    cells.push({
      date,
      day: date.getDate(),
      otherMonth: !inMonth,
      today: isSameDay(date, today),
      selectable:
        (inMonth || selectOtherMonths) && isDateSelectable(date, constraints),
    });
  }
  return cells;
};

/** Days in the given (0-based) month. */
export const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

/** Month arithmetic with date-fns' end-of-month clamping (Jan 31 + 1m → Feb 28/29). */
export const addMonthsToDate = (date: Date, amount: number): Date =>
  addMonths(date, amount);
export const addYearsToDate = (date: Date, amount: number): Date =>
  addYears(date, amount);

/** Day-level `a < b` — the comparison the range model makes everywhere. */
export const isBeforeDay = (a: Date, b: Date): boolean =>
  isBefore(startOfDay(a), startOfDay(b));

/** Inclusive, day-level `start <= date <= end`. */
export const isDateBetween = (start: Date, end: Date, date: Date): boolean =>
  !isBefore(startOfDay(date), startOfDay(start)) &&
  !isBefore(startOfDay(end), startOfDay(date));

/** The decade a year view covers: `2025` → `[2020, 2029]`. */
export const getDecadeRange = (year: number): [number, number] => {
  const base = year - (year % 10);
  return [base, base + 9];
};

/**
 * Which month the calendar should show for a value — PrimeVue's `viewDate`
 * rule: single → the date, range → the start, empty → today clamped into the
 * constraint range (so an out-of-bounds "today" does not open on a dead month).
 */
export const getViewDate = (
  value: DatePickerValue,
  constraints: DateConstraints = {},
): Date => {
  const anchor = Array.isArray(value) ? value[0] : value;
  if (anchor) return anchor;
  const today = new Date();
  const { minDate, maxDate } = constraints;
  if (minDate && isBefore(startOfDay(today), startOfDay(minDate))) {
    return new Date(minDate.getTime());
  }
  if (maxDate && isBefore(startOfDay(maxDate), startOfDay(today))) {
    return new Date(maxDate.getTime());
  }
  return today;
};

/** `true` when nothing is selected (single: `null`; range: start unset). */
export const isValueEmpty = (
  value: DatePickerValue | [Date | null, Date | null],
): boolean =>
  value === null ||
  value === undefined ||
  (Array.isArray(value) && value[0] === null);
