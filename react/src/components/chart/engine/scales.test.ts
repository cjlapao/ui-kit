import { describe, it, expect } from "vitest";
import {
  createBandScale,
  createLinearScale,
  createPointScale,
  createTimeScale,
  formatFullDate,
  formatSI,
  formatTimeTick,
  isTimeDomain,
  MS_DAY,
  timeTickFormat,
  timeTicks,
  toDate,
} from "./scales";

describe("createLinearScale", () => {
  it("maps domain endpoints onto the range", () => {
    const s = createLinearScale({ domain: [0, 10], range: [0, 100] });
    expect(s.map(0)).toBeCloseTo(0);
    expect(s.map(10)).toBeCloseTo(100);
    expect(s.map(5)).toBeCloseTo(50);
  });

  it("nices the domain and reports nice ticks", () => {
    const s = createLinearScale({ domain: [3, 97], range: [0, 100], nice: true });
    // nice() should extend to round bounds
    expect(s.domain[0]).toBeLessThanOrEqual(3);
    expect(s.domain[1]).toBeGreaterThanOrEqual(97);
    const ticks = s.ticks(5);
    expect(ticks.length).toBeGreaterThan(1);
    for (let i = 1; i < ticks.length; i++) {
      expect(Number(ticks[i])).toBeGreaterThan(Number(ticks[i - 1]));
      expect(Number.isInteger(Number(ticks[i]))).toBe(true);
    }
  });

  it("inverts pixels back to values", () => {
    const s = createLinearScale({ domain: [0, 100], range: [0, 500], nice: false });
    expect(s.invert(250)).toBeCloseTo(50);
  });
});

describe("createTimeScale + adaptive formatting", () => {
  const start = new Date(2024, 0, 1); // Jan 1 2024
  const end = new Date(2025, 5, 13); // Jun 13 2025

  it("reproduces the reference demo's tick label set", () => {
    const s = createTimeScale({ domain: [start, end], range: [0, 1000] });
    const format = timeTickFormat(s);
    const labels = s.ticks().map(format);

    // Every 2 months from Jan 2024. The screenshot's "Nov 2024" slot is
    // present but visually occupied by the Nov 1 crosshair date label.
    expect(labels).toEqual([
      "2024",
      "Mar 2024",
      "May 2024",
      "Jul 2024",
      "Sep 2024",
      "Nov 2024",
      "2025",
      "Mar 2025",
      "May 2025",
    ]);
  });

  it("formats Jan-1 ticks as bare years and others as Mon yyyy for long spans", () => {
    expect(formatTimeTick(new Date(2024, 0, 1), 400 * 86400000)).toBe("2024");
    expect(formatTimeTick(new Date(2024, 2, 1), 400 * 86400000)).toBe("Mar 2024");
  });

  it("uses day labels for short spans", () => {
    expect(formatTimeTick(new Date(2024, 10, 5), 30 * 86400000)).toBe("5 Nov");
    expect(formatTimeTick(new Date(2024, 10, 1), 30 * 86400000)).toBe("1 Nov");
  });

  it("maps and inverts dates", () => {
    const s = createTimeScale({ domain: [start, end], range: [0, 1000] });
    const mid = s.map(new Date(2024, 5, 1)); // Jul 1 2024
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(1000);
    const back = s.invert(mid);
    expect(back instanceof Date).toBe(true);
    expect((back as Date).getTime()).toBe(new Date(2024, 5, 1).getTime());
  });
});

describe("createBandScale", () => {
  it("places bands in order with equal widths", () => {
    const s = createBandScale({
      categories: ["Q1", "Q2", "Q3", "Q4"],
      range: [0, 400],
    });
    const positions = ["Q1", "Q2", "Q3", "Q4"].map((c) => s.map(c));
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i]).toBeGreaterThan(positions[i - 1]);
    }
    expect(s.bandWidth).toBeGreaterThan(0);
    // centers are mid-band
    expect(s.center("Q2")).toBeCloseTo(s.map("Q2") + s.bandWidth / 2);
  });

  it("handles a single category", () => {
    const s = createBandScale({ categories: ["only"], range: [0, 100] });
    expect(s.map("only")).toBeGreaterThanOrEqual(0);
    expect(s.bandWidth).toBeGreaterThan(0);
  });
});

describe("createPointScale", () => {
  it("spreads points evenly", () => {
    const s = createPointScale({ categories: ["a", "b", "c"], range: [0, 100] });
    expect(s.map("a")).toBeCloseTo(0);
    expect(s.map("c")).toBeCloseTo(100);
    expect(s.map("b")).toBeCloseTo(50);
    expect(s.bandWidth).toBe(0);
  });
});

describe("isTimeDomain", () => {
  it("detects Date arrays", () => {
    expect(isTimeDomain([new Date(), new Date(), new Date()])).toBe(true);
  });

  it("detects ISO string arrays", () => {
    expect(isTimeDomain(["2024-01-01", "2024-02-01", "2024-03-01"])).toBe(true);
  });

  it("falls back to category for mixed or plain strings", () => {
    expect(isTimeDomain(["Jan", "Feb", "Mar"])).toBe(false);
    expect(isTimeDomain(["2024-01-01", "Feb", "Mar", "Apr"])).toBe(false);
    expect(isTimeDomain([])).toBe(false);
  });
});

describe("toDate", () => {
  it("parses ISO dates without timezone drift", () => {
    const d = toDate("2024-11-01");
    expect(d?.getFullYear()).toBe(2024);
    expect(d?.getMonth()).toBe(10);
    expect(d?.getDate()).toBe(1);
  });

  it("parses epoch numbers and Date passthrough", () => {
    expect(toDate(new Date(2024, 0, 1))?.getTime()).toBe(new Date(2024, 0, 1).getTime());
    expect(toDate(1700000000000) instanceof Date).toBe(true);
  });

  it("rejects garbage and impossible dates", () => {
    expect(toDate("not a date")).toBeNull();
    expect(toDate(1700000000000) !== null).toBe(true);
  });
});

describe("formatSI", () => {
  it("formats magnitudes", () => {
    expect(formatSI(1234)).toBe("1234");
    expect(formatSI(12_000)).toBe("12k");
    expect(formatSI(1_500_000)).toBe("1.5M");
    expect(formatSI(2_300_000_000)).toBe("2.3B");
  });
});

describe("timeTicks", () => {
  it("steps weekly over a 60-day span (candlestick demo)", () => {
    const start = new Date(2024, 9, 1); // Oct 1 2024
    const end = new Date(2024, 10, 30); // Nov 30 2024 (61 days)
    const ticks = timeTicks(start, end, 8);
    expect(ticks.length).toBeGreaterThanOrEqual(8);
    expect(ticks.length).toBeLessThanOrEqual(10);
    // spacing is exactly 7 calendar days (DST-safe comparison)
    for (let i = 1; i < ticks.length; i++) {
      const next = new Date(ticks[i - 1]);
      next.setDate(next.getDate() + 7);
      expect(ticks[i].getTime()).toBe(next.getTime());
    }
  });

  it("steps yearly over a decade", () => {
    const ticks = timeTicks(new Date(2015, 0, 1), new Date(2025, 0, 1), 8);
    expect(ticks.map((d) => d.getFullYear())).toEqual([
      2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
    ]);
  });

  it("aligns month ticks to absolute month indices (stable under domain shifts)", () => {
    const a = timeTicks(new Date(2024, 0, 1), new Date(2025, 5, 13), 8);
    const b = timeTicks(new Date(2024, 1, 1), new Date(2025, 5, 13), 8);
    // same step (2 months, Jan-anchored) — the second domain just drops Jan 2024
    expect(b.map((d) => d.getTime())).toEqual(
      a.map((d) => d.getTime()).filter((t) => t >= new Date(2024, 1, 1).getTime()),
    );
  });

  it("delegates sub-week spans to d3", () => {
    const ticks = timeTicks(new Date(2024, 0, 1, 0), new Date(2024, 0, 1, 12), 8);
    expect(ticks.length).toBeGreaterThanOrEqual(2);
  });

  it("returns a single tick for zero/invalid spans", () => {
    expect(timeTicks(new Date(2024, 0, 1), new Date(2024, 0, 1))).toHaveLength(1);
    expect(timeTicks(new Date(2024, 5, 1), new Date(2024, 1, 1))).toHaveLength(1);
  });
});

describe("formatFullDate", () => {
  it("matches the reference tooltip header", () => {
    expect(formatFullDate(new Date(2024, 10, 1))).toBe("Friday, Nov 1, 2024");
  });
});

describe("formatTimeTick intraday", () => {
  it("uses clock labels for sub-day spans", () => {
    const start = new Date(2025, 10, 3, 6, 0);
    const end = new Date(2025, 10, 3, 16, 30);
    const s = createTimeScale({ domain: [start, end], range: [0, 1000] });
    const labels = s.ticks().map(timeTickFormat(s));
    // every label is a clock time, no repeated day labels
    expect(labels.every((l) => /\d{1,2}:\d{2} (AM|PM)/.test(l))).toBe(true);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("keeps day labels for multi-day spans", () => {
    expect(formatTimeTick(new Date(2025, 10, 3, 6, 0), 5 * MS_DAY)).toBe(
      "3 Nov",
    );
  });
});
