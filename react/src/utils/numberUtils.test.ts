import { describe, expect, it } from "vitest";
import { formatCompact, formatCompactBytes } from "./numberUtils";

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

describe("formatCompactBytes", () => {
  it("auto-picks the largest unit that is ≥ 1", () => {
    expect(formatCompactBytes(0)).toBe("0b");
    expect(formatCompactBytes(512)).toBe("512b");
    expect(formatCompactBytes(2048)).toBe("2kb");
    expect(formatCompactBytes(999)).toBe("999b");
    expect(formatCompactBytes(999_999)).toBe("999.9kb");
    expect(formatCompactBytes(24_739_898)).toBe("24.7mb");
    expect(formatCompactBytes(2_500_000_000)).toBe("2.5gb");
    expect(formatCompactBytes(9_999_999_999)).toBe("9.9gb");
    expect(formatCompactBytes(3_000_000_000_000)).toBe("3tb");
  });

  it("forces the display unit", () => {
    expect(formatCompactBytes(2_048_000, { unit: "MB" })).toBe("2mb");
    expect(formatCompactBytes(2_500_000_000, { unit: "gb" })).toBe("2.5gb");
    expect(formatCompactBytes(1_500_000, { unit: "kb" })).toBe("1500kb");
    // forcing a bigger unit than the value fills → honest "0gb"
    expect(formatCompactBytes(2048, { unit: "GB" })).toBe("0gb");
    // forcing a smaller unit keeps the full magnitude
    expect(formatCompactBytes(24_739_898, { unit: "b" })).toBe("24739898b");
  });

  it("supports the 1024 base for memory math", () => {
    expect(formatCompactBytes(2048, { base: 1024 })).toBe("2kb");
    expect(formatCompactBytes(1_048_576, { base: 1024 })).toBe("1mb");
    expect(formatCompactBytes(2_048, { base: 1024, unit: "mb" })).toBe("0mb");
  });

  it("keeps signs and passes through non-finite values", () => {
    expect(formatCompactBytes(-24_739_898)).toBe("-24.7mb");
    expect(formatCompactBytes(-2_500_000_000, { unit: "gb" })).toBe("-2.5gb");
    expect(formatCompactBytes(NaN)).toBe("NaN");
  });
});
