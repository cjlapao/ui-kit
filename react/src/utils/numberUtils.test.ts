import { describe, expect, it } from "vitest";
import { formatCompact } from "./numberUtils";

describe("formatCompact", () => {
  it("keeps small numbers as-is", () => {
    expect(formatCompact(780)).toBe("780");
    expect(formatCompact(0)).toBe("0");
    expect(formatCompact(999)).toBe("999");
    expect(formatCompact(780.4)).toBe("780");
  });

  it("formats thousands as k (truncated integer)", () => {
    expect(formatCompact(87047)).toBe("87k");
    expect(formatCompact(1000)).toBe("1k");
    expect(formatCompact(9999)).toBe("9k");
    expect(formatCompact(999999)).toBe("999k");
  });

  it("formats millions as m (truncated one decimal)", () => {
    expect(formatCompact(3572680)).toBe("3.5m");
    expect(formatCompact(1000000)).toBe("1m");
    expect(formatCompact(4000000)).toBe("4m");
    expect(formatCompact(9999999)).toBe("9.9m");
  });

  it("formats billions and trillions", () => {
    expect(formatCompact(1_000_000_000)).toBe("1b");
    expect(formatCompact(3_572_680_000)).toBe("3.5b");
    expect(formatCompact(999_999_999_999)).toBe("999.9b");
    expect(formatCompact(1_000_000_000_000)).toBe("1t");
    expect(formatCompact(2_500_000_000_000)).toBe("2.5t");
  });

  it("keeps the sign on negatives", () => {
    expect(formatCompact(-87047)).toBe("-87k");
    expect(formatCompact(-3572680)).toBe("-3.5m");
    expect(formatCompact(-780)).toBe("-780");
  });

  it("passes through non-finite values", () => {
    expect(formatCompact(NaN)).toBe("NaN");
    expect(formatCompact(Infinity)).toBe("Infinity");
  });
});
