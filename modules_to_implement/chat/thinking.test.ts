import { describe, it, expect } from "vitest";
import { formatThinkingDuration } from "./thinking";

describe("formatThinkingDuration", () => {
  it("formats sub-second durations as <1s", () => {
    expect(formatThinkingDuration(0)).toBe("<1s");
    expect(formatThinkingDuration(400)).toBe("<1s");
  });

  it("formats whole seconds (rounding to the nearest second)", () => {
    expect(formatThinkingDuration(1000)).toBe("1s");
    expect(formatThinkingDuration(2500)).toBe("3s");
    expect(formatThinkingDuration(59000)).toBe("59s");
  });

  it("formats minutes and minutes + seconds", () => {
    expect(formatThinkingDuration(60000)).toBe("1m");
    expect(formatThinkingDuration(90000)).toBe("1m 30s");
    expect(formatThinkingDuration(3599000)).toBe("59m 59s");
  });

  it("formats hours (dropping trailing zero units)", () => {
    expect(formatThinkingDuration(3600000)).toBe("1h");
    expect(formatThinkingDuration(3600000 + 300000)).toBe("1h 5m");
    expect(formatThinkingDuration(7200000)).toBe("2h");
  });

  it("treats negative durations as sub-second", () => {
    expect(formatThinkingDuration(-500)).toBe("<1s");
  });
});
