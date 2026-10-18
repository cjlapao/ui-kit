import { describe, expect, it } from "vitest";
import {
  MONTH_NAMES,
  buildMonthGrid,
  formatValue,
  getDecadeRange,
  getDaysInMonth,
  getViewDate,
  isBeforeDay,
  isDateBetween,
  isDateSelectable,
  isSameDayDate,
  isValueEmpty,
  normalizeDate,
  parseDateText,
  parseValueText,
} from "../../../../common/utils/dates";

const day = (year: number, month: number, date: number) =>
  new Date(year, month, date);

describe("normalizeDate", () => {
  it("accepts Date, ISO string and timestamp", () => {
    const d = day(2026, 2, 15);
    expect(normalizeDate(d)?.getTime()).toBe(d.getTime());
    expect(normalizeDate("2026-03-15T00:00:00")?.getDate()).toBe(15);
    expect(normalizeDate(d.getTime())?.getTime()).toBe(d.getTime());
  });

  it("rejects invalid input", () => {
    expect(normalizeDate("nonsense")).toBeNull();
    expect(normalizeDate(null)).toBeNull();
    expect(normalizeDate(undefined)).toBeNull();
  });
});

describe("formatValue", () => {
  it("formats a single date with the default format", () => {
    expect(formatValue(day(2026, 2, 15))).toBe("Mar 15, 2026");
  });

  it("formats a completed range with the ' - ' separator", () => {
    expect(formatValue([day(2026, 2, 10), day(2026, 2, 15)])).toBe(
      "Mar 10, 2026 - Mar 15, 2026",
    );
  });

  it("shows only the start while a range is open", () => {
    expect(formatValue([day(2026, 2, 10), null])).toBe("Mar 10, 2026");
  });

  it("honours a custom format", () => {
    expect(formatValue(day(2026, 0, 5), "yyyy-MM-dd")).toBe("2026-01-05");
  });

  it("returns an empty string for no value", () => {
    expect(formatValue(null)).toBe("");
  });
});

describe("parseDateText / parseValueText", () => {
  it("round-trips the default format", () => {
    const parsed = parseDateText("Mar 15, 2026");
    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(2);
    expect(parsed?.getDate()).toBe(15);
  });

  it("uses the reference date for fields missing from the pattern", () => {
    const parsed = parseDateText("Mar 15", "MMM d", day(2027, 0, 1));
    expect(parsed?.getFullYear()).toBe(2027);
    expect(parsed?.getMonth()).toBe(2);
    expect(parsed?.getDate()).toBe(15);
  });

  it("accepts full month names against MMM patterns and vice versa", () => {
    // The default format uses MMM — full names still parse (normalised).
    expect(parseDateText("March 15, 2026")?.getDate()).toBe(15);
    // A MMMM format — abbreviations still parse (expanded).
    expect(parseDateText("Mar 15, 2026", "MMMM d, yyyy")?.getMonth()).toBe(2);
  });

  it("returns null for unparseable text", () => {
    expect(parseDateText("not a date")).toBeNull();
    expect(parseDateText("")).toBeNull();
  });

  it("parses range text", () => {
    const parsed = parseValueText("Mar 10, 2026 - Mar 15, 2026", "range");
    expect(parsed).not.toBeNull();
    if (Array.isArray(parsed)) {
      expect(parsed[0]?.getDate()).toBe(10);
      expect(parsed[1]?.getDate()).toBe(15);
    }
  });

  it("yields an open range when the end is missing", () => {
    const parsed = parseValueText("Mar 10, 2026 -", "range");
    expect(parsed).toEqual(expect.arrayContaining([expect.any(Date)]));
    if (Array.isArray(parsed)) expect(parsed[1]).toBeNull();
  });

  it("rejects a range whose end precedes its start", () => {
    expect(parseValueText("Mar 15, 2026 - Mar 10, 2026", "range")).toBeNull();
  });
});

describe("buildMonthGrid", () => {
  it("always produces 42 cells in full weeks", () => {
    expect(buildMonthGrid(2026, 2).length).toBe(42);
    expect(buildMonthGrid(2024, 1).length).toBe(42);
  });

  it("covers a leap February completely", () => {
    const grid = buildMonthGrid(2024, 1);
    const days = grid
      .filter((cell) => !cell.otherMonth)
      .map((cell) => cell.day);
    expect(days).toContain(29);
    expect(getDaysInMonth(2024, 1)).toBe(29);
  });

  it("starts on Monday by default and on Sunday when weekStartsOn=0", () => {
    // 2026-08-01 is a Saturday (Europe/London test TZ).
    const mondayFirst = buildMonthGrid(2026, 7, { weekStartsOn: 1 });
    const sundayFirst = buildMonthGrid(2026, 7, { weekStartsOn: 0 });
    // Monday start: the grid opens on the Monday of the first week, and the
    // Saturday 1st sits in the sixth column.
    expect(mondayFirst[0].date.getDay()).toBe(1);
    expect(mondayFirst[5].day).toBe(1);
    // Sunday start: the grid opens on the preceding Sunday.
    expect(sundayFirst[0].date.getDay()).toBe(0);
    expect(sundayFirst[6].day).toBe(1);
  });

  it("marks other-month cells and gates their selectability", () => {
    const grid = buildMonthGrid(2026, 2);
    const others = grid.filter((cell) => cell.otherMonth);
    expect(others.length).toBeGreaterThan(0);
    expect(others.every((cell) => cell.selectable)).toBe(false);
    const gridSelectable = buildMonthGrid(2026, 2, { selectOtherMonths: true });
    expect(
      gridSelectable.filter((cell) => cell.otherMonth).every((c) => c.selectable),
    ).toBe(true);
  });

  it("marks today", () => {
    const grid = buildMonthGrid(2026, 2, { today: day(2026, 2, 15) });
    expect(grid.filter((cell) => cell.today).map((c) => c.day)).toEqual([15]);
  });
});

describe("isDateSelectable", () => {
  const base = day(2026, 2, 15);

  it("respects min/max bounds (inclusive)", () => {
    expect(isDateSelectable(base, { minDate: base, maxDate: base })).toBe(true);
    expect(isDateSelectable(day(2026, 2, 14), { minDate: base })).toBe(false);
    expect(isDateSelectable(day(2026, 2, 16), { maxDate: base })).toBe(false);
  });

  it("respects disabled weekdays (getDay numbering)", () => {
    const saturday = day(2026, 2, 14); // 2026-03-14 is a Saturday
    expect(saturday.getDay()).toBe(6);
    expect(isDateSelectable(saturday, { disabledDays: [6] })).toBe(false);
    expect(isDateSelectable(base, { disabledDays: [6] })).toBe(true);
  });

  it("respects a disabledDates list (day-level)", () => {
    const otherTime = new Date(2026, 2, 15, 13, 30);
    expect(isDateSelectable(base, { disabledDates: [otherTime] })).toBe(false);
  });

  it("respects a predicate", () => {
    expect(isDateSelectable(base, { disabledDates: (d) => d.getDate() === 15 })).toBe(false);
  });
});

describe("range helpers", () => {
  it("isBeforeDay compares day-level only", () => {
    const a = new Date(2026, 2, 10, 23, 59);
    const b = new Date(2026, 2, 10, 0, 1);
    expect(isBeforeDay(a, b)).toBe(false);
    expect(isBeforeDay(day(2026, 2, 9), b)).toBe(true);
  });

  it("isDateBetween is inclusive", () => {
    const start = day(2026, 2, 10);
    const end = day(2026, 2, 20);
    expect(isDateBetween(start, end, start)).toBe(true);
    expect(isDateBetween(start, end, end)).toBe(true);
    expect(isDateBetween(start, end, day(2026, 2, 15))).toBe(true);
    expect(isDateBetween(start, end, day(2026, 2, 21))).toBe(false);
  });

  it("getDecadeRange covers ten years from the decade start", () => {
    expect(getDecadeRange(2025)).toEqual([2020, 2029]);
    expect(getDecadeRange(2020)).toEqual([2020, 2029]);
  });
});

describe("getViewDate", () => {
  it("anchors on the value (range: the start)", () => {
    expect(getViewDate(day(2026, 5, 9)).getMonth()).toBe(5);
    expect(getViewDate([day(2026, 5, 9), day(2026, 7, 1)])?.getMonth()).toBe(5);
  });

  it("clamps an out-of-bounds today into the range", () => {
    // Today (Aug 2026 in the component tests; real today here) is after the
    // range → clamp to the max end.
    const view = getViewDate(null, {
      minDate: day(2020, 2, 1),
      maxDate: day(2020, 2, 31),
    });
    expect(view.getFullYear()).toBe(2020);
    expect(view.getMonth()).toBe(2);
    expect(view.getDate()).toBe(31);

    // A future range clamps to the min end.
    const future = getViewDate(null, {
      minDate: day(2099, 2, 1),
      maxDate: day(2099, 2, 31),
    });
    expect(future.getDate()).toBe(1);
  });

  it("isValueEmpty handles single and range", () => {
    expect(isValueEmpty(null)).toBe(true);
    expect(isValueEmpty([null, null])).toBe(true);
    expect(isValueEmpty(day(2026, 2, 1))).toBe(false);
    expect(isValueEmpty([day(2026, 2, 1), null])).toBe(false);
  });
});

describe("labels", () => {
  it("exposes the month names", () => {
    expect(MONTH_NAMES[2]).toBe("March");
    expect(isSameDayDate(day(2026, 2, 1), day(2026, 2, 1))).toBe(true);
  });
});
