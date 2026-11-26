/**
 * A resting edge has to be *seen*, and only arithmetic can say so.
 *
 * `tonal` shipped for a long time with no edge at all — `ring-transparent` in
 * light mode and a `white/5` haze in dark, over a `{c}-200/60` / `{c}-500/15`
 * fill. When it finally got one, the two hairlines already in the palette each
 * fitted in only one mode: `border`'s light rung reads (1.18:1) while its dark
 * `{c}-500/50` measures 1.59:1 — a frame, not an edge; `outlineBorder`'s dark
 * rung reads (1.13:1) while its light `{c}-200` measures 1.06:1 on the fill it
 * would sit on, the same one-step-off-the-fill mistake as a divider sinking
 * into the tinted card it belongs to.
 *
 * So `palette.tonalBorder` is `border`'s light half plus `outlineBorder`'s
 * dark half, and this file is what keeps it that way: it reads the classes the
 * theme emits, resolves them against the palette Tailwind will compile them
 * to, composites them on the page, and asserts the four things a resting edge
 * must do —
 *
 *   - **separate from its own fill**, ≥1.10:1, in both modes;
 *   - **separate from the page** it usually sits on, ≥1.20:1;
 *   - **one step further than the fill already went** — darker than the page
 *     in light, lighter in dark, never a rim that lands back on the ground it
 *     was meant to leave;
 *   - **beaten by the hover rung**, ≥1.10:1 rim-to-rim, or the pointer
 *     *lightens* the edge it is supposed to ignite.
 *
 * The last block runs the pair this test was written from — the old
 * `hover:ring-{c}-300/70` ignition, which was lighter than the new resting
 * edge — through the same bar and requires it to fail.
 *
 * Colour maths lives in `paletteProbe.ts` (jsdom computes no colours, so no
 * other test in the kit can measure any of this).
 */
import { describe, it, expect } from "vitest";
import {
  TRUE_COLORS,
  getPanelToneStyles,
  getSurfaceHoverTokens,
  type TrueColor,
} from "../../../common/theme/Theme";
import {
  luminance,
  page,
  paint,
  ratio,
  type Mode,
  type Rgb,
} from "./paletteProbe";

// ── The bars ──────────────────────────────────────────────────────────────────
// A hairline is not text, but at 1px it is the only thing saying "this card is
// one object". 1.10:1 against the fill is the level at which an edge stops
// being a rumour; 1.20:1 against the page is what `elevated`'s ring already
// clears on the same ground, so the toned card is never the weaker of the two.
const RIM_VS_FILL = 1.1;
const RIM_VS_PAGE = 1.2;
const RIM_STEP = 1.1;

const rimOf = (tone: TrueColor, mode: Mode): Rgb =>
  paint(getPanelToneStyles(tone).tonalBorder, mode);
const fillOf = (tone: TrueColor, mode: Mode): Rgb =>
  paint(getPanelToneStyles(tone).tonalBg, mode);
const hoverRimOf = (tone: TrueColor, mode: Mode): Rgb =>
  paint(getSurfaceHoverTokens("tonal", tone).rim, mode);

describe("tonal panel has a resting edge you can see", () => {
  it("separates from its own fill and from the page, in both modes", () => {
    const offenders: string[] = [];
    for (const tone of TRUE_COLORS)
      for (const mode of ["light", "dark"] as const) {
        const rim = rimOf(tone, mode);
        const againstFill = ratio(rim, fillOf(tone, mode));
        const againstPage = ratio(rim, page(mode));
        if (againstFill < RIM_VS_FILL)
          offenders.push(
            `${tone}/${mode}: rim only ${againstFill.toFixed(3)}:1 against the fill`,
          );
        if (againstPage < RIM_VS_PAGE)
          offenders.push(
            `${tone}/${mode}: rim only ${againstPage.toFixed(3)}:1 against the page`,
          );
      }
    expect(offenders).toEqual([]);
  });

  /**
   * The direction rule the whole kit runs on — deepen in light, lift in dark —
   * stated for the edge instead of the wash: the rim has to keep going the way
   * the fill already went. A `{c}-100` rim on a `{c}-200/60` fill is visible
   * and still wrong, because it walks back toward the page the card is meant
   * to be separated from.
   */
  it("keeps walking in the direction the fill already went", () => {
    const offenders: string[] = [];
    for (const tone of TRUE_COLORS) {
      const fillLight = luminance(fillOf(tone, "light"));
      const pageLight = luminance(page("light"));
      const rimLight = luminance(rimOf(tone, "light"));
      if (!(pageLight > fillLight && fillLight > rimLight))
        offenders.push(
          `${tone}/light: page ${pageLight.toFixed(3)} → fill ${fillLight.toFixed(3)} → rim ${rimLight.toFixed(3)} is not a descent`,
        );

      const fillDark = luminance(fillOf(tone, "dark"));
      const pageDark = luminance(page("dark"));
      const rimDark = luminance(rimOf(tone, "dark"));
      if (!(pageDark < fillDark && fillDark < rimDark))
        offenders.push(
          `${tone}/dark: page ${pageDark.toFixed(3)} → fill ${fillDark.toFixed(3)} → rim ${rimDark.toFixed(3)} is not an ascent`,
        );
    }
    expect(offenders).toEqual([]);
  });

  it("is ignited by a rim one step past itself, not one behind it", () => {
    const offenders: string[] = [];
    for (const tone of TRUE_COLORS)
      for (const mode of ["light", "dark"] as const) {
        const rim = rimOf(tone, mode);
        const hover = hoverRimOf(tone, mode);
        const measured = ratio(hover, rim);
        const onward =
          mode === "dark"
            ? luminance(hover) > luminance(rim)
            : luminance(hover) < luminance(rim);
        if (!onward || measured < RIM_STEP)
          offenders.push(
            `${tone}/${mode}: hover rim only ${measured.toFixed(3)}:1 past the resting edge${onward ? "" : " (and in the wrong direction)"}`,
          );
      }
    expect(offenders).toEqual([]);
  });

  it("ignites the property the variant actually wears", () => {
    // `tonal` carries a real `border`, so a `ring` ignition is inert and a
    // `border` ignition of the wrong shade is worse than none.
    for (const tone of TRUE_COLORS) {
      const { rim } = getSurfaceHoverTokens("tonal", tone);
      expect(rim).toContain(`hover:border-${tone}-400`);
      expect(rim).toContain(`dark:hover:border-${tone}-400/50`);
      expect(rim).not.toMatch(/(?:^|\s)(?:dark:)?hover:ring-/);
    }
  });

  it("leaves the rimless variants on the lighter rung — this is not a global re-tone", () => {
    // `outlined` has no resting edge to step from, so its ignition is its
    // first step; deepening it too would make two variants answer a pointer
    // with the same word for different reasons.
    for (const tone of TRUE_COLORS) {
      const { rim } = getSurfaceHoverTokens("outlined", tone);
      expect(rim).toContain(`hover:border-${tone}-300`);
      expect(rim).toContain(`dark:hover:border-${tone}-500/50`);
    }
  });

  it("gives the untinted card the neutral hairline at the same weight", () => {
    const untinted = getPanelToneStyles("none").tonalBorder;
    expect(untinted).toBe("border-neutral-200 dark:border-white/10");
    // Its fill is the page itself (`bg-white` / `bg-neutral-900`), so the fill
    // test would be a tautology — the page bar is the one that matters.
    for (const mode of ["light", "dark"] as const)
      expect(ratio(paint(untinted, mode), page(mode))).toBeGreaterThanOrEqual(
        RIM_VS_PAGE,
      );
  });

  /**
   * The canary. This is the ignition that shipped, measured against the edge
   * `tonal` now rests on. It fails twice over: in light it walks the rim *back
   * up* toward the page (`-{c}-300/70` over white is lighter than the solid
   * `-{c}-300` it now has to beat), and at the worst tone in the palette it
   * never clears the step bar in either mode — an ignition that leaves the
   * edge where it found it is not an ignition. If loosening a threshold above
   * ever lets the worst tone through, the threshold was moved to admit the bug.
   */
  it("the pair this test was written from still fails the bar", () => {
    const worstPast = (mode: Mode, token: (c: TrueColor) => string): number =>
      Math.min(...TRUE_COLORS.map((c) => ratio(paint(token(c), mode), rimOf(c, mode))));

    // Light: every tone goes the wrong way, not merely far enough.
    for (const tone of TRUE_COLORS)
      expect(luminance(paint(`hover:ring-${tone}-300/70`, "light"))).toBeGreaterThan(
        luminance(rimOf(tone, "light")),
      );

    expect(worstPast("light", (c) => `hover:ring-${c}-300/70`)).toBeLessThan(RIM_STEP);
    expect(worstPast("dark", (c) => `dark:hover:ring-${c}-500/30`)).toBeLessThan(RIM_STEP);
  });
});
