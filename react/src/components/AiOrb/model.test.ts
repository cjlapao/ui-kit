import { describe, expect, it } from "vitest";
import { AI_ORB_PRESETS, AI_ORB_QUALITY, backingSize, resolveAppearance } from "../../../../common/aiOrb/model";

describe("AiOrb appearance and budgets", () => {
  it("validates colors and clamps finite overrides without changing presets", () => {
    expect(resolveAppearance("solar", { coreColor: "#abc", accentColor: "red", glow: 8, motionIntensity: NaN })).toEqual({
      ...AI_ORB_PRESETS.solar, coreColor: "#aabbcc", glow: 1,
    });
    expect(resolveAppearance("ember", { glow: -1, motionIntensity: Infinity }).glow).toBe(0);
    expect(AI_ORB_PRESETS.solar.glow).toBe(0.7);
    expect(resolveAppearance("solar", { definition: -1 }).definition).toBe(0);
    expect(resolveAppearance("solar", { definition: NaN }).definition).toBe(1);
  });
  it("caps resolution and effects for every quality tier", () => {
    expect(backingSize(240, 3, "balanced")).toBe(360);
    expect(backingSize(4000, 4, "high")).toBe(1024);
    expect(backingSize(0, 1, "low")).toBe(1);
    for (const budget of Object.values(AI_ORB_QUALITY)) {
      expect(budget.fps).toBeLessThanOrEqual(60);
      expect(budget.particles).toBeLessThanOrEqual(24);
      expect(budget.flares).toBeLessThanOrEqual(14);
      expect(budget.rings).toBeLessThanOrEqual(3);
    }
  });
});
