import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Panel, { getPanelEdgeChrome } from "../components/Panel";
import { getSurfaceTransparencyClasses, getSurfaceVariantClasses, resolveSurfaceTransparency, SURFACE_TRANSPARENCIES, SURFACE_VARIANTS } from "./Theme";

describe("surface background transparency", () => {
  it("defaults every variant to opaque except glass, liquid-glass and subtle", () => {
    for (const variant of SURFACE_VARIANTS) {
      const translucent = ["glass", "liquid-glass", "subtle"].includes(variant);
      expect(resolveSurfaceTransparency(variant)).toBe(translucent ? "high" : "none");
      const classes = getSurfaceVariantClasses(variant, "blue");
      if (!translucent && variant !== "elevated") expect(classes).toContain("ui-surface-transparency-none");
      if (translucent) expect(classes).toBe(getSurfaceVariantClasses(variant, "blue", { transparency: "high" }));
    }
  });
  it("caps high at the original background and preserves borders and shadows", () => {
    const original = "border-blue-300/50 bg-blue-100/80 dark:bg-blue-500/15 shadow-xl ring-white/5";
    expect(getSurfaceTransparencyClasses(original, "tonal", "high")).toBe(original);
    for (const level of ["none", "low", "medium"] as const) {
      const classes = getSurfaceTransparencyClasses(original, "tonal", level);
      expect(classes).toContain(`ui-surface-transparency-${level}`);
      expect(classes).toContain("[--ui-surface-color:var(--color-blue-100)] [--ui-surface-alpha:80%]");
      expect(classes).toContain("dark:[--ui-surface-color:var(--color-blue-500)] dark:[--ui-surface-alpha:15%]");
      expect(classes).toContain("border-blue-300/50");
      expect(classes).toContain("shadow-xl ring-white/5");
      expect(classes).not.toMatch(/(?:^|\s)(?:dark:)?bg-/);
    }
  });
  it("does not invent transparency for an already opaque surface", () => {
    for (const level of SURFACE_TRANSPARENCIES) {
      expect(getSurfaceTransparencyClasses("bg-white dark:bg-neutral-900 shadow-xl", "elevated", level)).toBe("bg-white dark:bg-neutral-900 shadow-xl");
    }
  });
  it("keeps hover fills on the same transparency scale without affecting resting fills", () => {
    const classes = getSurfaceTransparencyClasses("bg-white dark:bg-neutral-900 hover:bg-rose-50 dark:hover:bg-rose-900/20", "elevated");
    expect(classes).toContain("[--ui-surface-color:var(--color-white)] [--ui-surface-alpha:100%]");
    expect(classes).toContain("dark:[--ui-surface-color:var(--color-neutral-900)] dark:[--ui-surface-alpha:100%]");
    expect(classes).toContain("dark:hover:[--ui-surface-color:var(--color-rose-900)] dark:hover:[--ui-surface-alpha:20%]");
  });
  it.each(SURFACE_VARIANTS)("keeps %s popover edge paint consistent with Panel at all levels", variant => {
    for (const transparency of SURFACE_TRANSPARENCIES) {
      const { container, unmount } = render(<Panel variant={variant} tone="blue" transparency={transparency}>Body</Panel>);
      const edge = getPanelEdgeChrome(variant, "blue", "frosted", "medium", transparency);
      const panel = container.querySelector("section")!;
      for (const token of edge.fill.split(/\s+/)) expect(panel.className.split(/\s+/)).toContain(token);
      expect(panel).not.toHaveAttribute("transparency");
      unmount();
    }
  });
  it("honours explicit background colours and isolates nested surface levels", () => {
    const { container } = render(<Panel variant="glass" transparency="medium"><Panel variant="tonal" backgroundColor="rose">Inner</Panel></Panel>);
    const [outer, inner] = container.querySelectorAll("section");
    expect(outer).toHaveClass("ui-surface-transparency-medium");
    expect(inner).toHaveClass("ui-surface-transparency-none");
    expect(inner.className).toContain("[--ui-surface-color:var(--color-rose-100)]");
  });
});
