import { describe, it, expect } from "vitest";
import {
  INPUT_VARIANTS,
  getInputVariantTokens,
  stripBorderColor,
} from "./Theme";

describe("stripBorderColor", () => {
  it("removes the colour and keeps the width and sides", () => {
    expect(stripBorderColor("rounded-lg border border-neutral-300 bg-white")).toBe(
      "rounded-lg border bg-white",
    );
    expect(
      stripBorderColor("rounded-none border-0 border-b border-neutral-400"),
    ).toBe("rounded-none border-0 border-b");
  });

  it("removes the dark-mode partner too", () => {
    // Leaving it behind would put the variant's colour back in dark mode only.
    expect(
      stripBorderColor("border border-neutral-300 dark:border-neutral-700"),
    ).toBe("border");
  });

  it("handles the opacity-modified and keyword colours glass uses", () => {
    expect(
      stripBorderColor("border border-white/50 dark:border-white/10"),
    ).toBe("border");
    expect(stripBorderColor("border border-transparent")).toBe("border");
  });

  it("leaves every variant with no border colour at all", () => {
    for (const variant of INPUT_VARIANTS) {
      const stripped = stripBorderColor(getInputVariantTokens(variant).surface);
      for (const token of stripped.split(/\s+/)) {
        // Colour-shaped only — `border-b` and `border-0` must survive.
        expect(token).not.toMatch(
          /^(?:dark:)?border-(?:[a-z]+-\d{2,3}|white|black|transparent|current)/,
        );
      }
    }
  });

  it("keeps the side and width classes underline depends on", () => {
      const stripped = stripBorderColor(
        getInputVariantTokens("underline").surface,
      );
      expect(stripped).toContain("border-0");
      expect(stripped).toContain("border-b");
  });

  it("does not touch a surface that has no border colour", () => {
    const input = "rounded-lg bg-white shadow-sm";
    expect(stripBorderColor(input)).toBe(input);
  });
});
