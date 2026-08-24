import { describe, it, expect } from "vitest";
import { decimate } from "./decimation";

describe("decimate", () => {
  it("returns the input unchanged under the cap", () => {
    expect(decimate([1, 2, 3], 10)).toEqual([1, 2, 3]);
  });

  it("caps the point count", () => {
    const items = Array.from({ length: 100 }, (_, i) => i);
    const out = decimate(items, 20);
    expect(out.length).toBeLessThanOrEqual(21); // +1 for the guaranteed last point
    expect(out.length).toBeGreaterThanOrEqual(20);
  });

  it("always keeps the first and last points", () => {
    const items = Array.from({ length: 100 }, (_, i) => i);
    const out = decimate(items, 10);
    expect(out[0]).toBe(0);
    expect(out[out.length - 1]).toBe(99);
  });

  it("handles degenerate caps", () => {
    expect(decimate([1, 2, 3], 0)).toEqual([]);
    expect(decimate([], 10)).toEqual([]);
    const out = decimate([1, 2, 3], 1);
    expect(out).toEqual([1, 3]);
  });
});
