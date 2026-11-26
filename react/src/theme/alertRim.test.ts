/**
 * A callout's edge has to be *seen*, and only arithmetic can say so.
 *
 * `solid` shipped with `border: "border-transparent"` for the whole life of
 * `getAlertVariantTokens`. Measured, that is 1.000:1 against its own fill and
 * 1.000:1 against the page: not a weak edge, no edge. One card gets away with
 * it on the fill's own luminance. A stacked deck does not — five identical
 * `{c}-400` fills agree with each other, the deck reads as one shape with
 * stepped protrusions, and the seam between two cards is exactly the thing the
 * card is being asked to say. That is the report this file was written from:
 * the toast playground, `emerald`, `solid`, stacked.
 *
 * Two rules fall out of measuring it, and both are asserted here:
 *
 *   - **the bars**, shared with `tonalRim.test.ts`: every rim clears ≥1.10:1
 *     against the fill it frames and ≥1.20:1 against the page, in both modes,
 *     at all 21 tones;
 *   - **the rung next to the fill**. The rim is the fill's neighbour on the
 *     ramp, one step toward the page — so in light the order is page → rim →
 *     fill and in dark page → rim → fill as well. The first attempt at this
 *     went the *other* way (`-{c}-800` light) and cleared both bars: 1.250:1
 *     against the fill, and 6.875:1 against the page, which is a frame dropped
 *     over the tone rather than the tone's own edge. It was rejected by eye
 *     and it is kept here as an assertion that the rim stays where it is.
 *
 * `tonal` is measured against `Panel`'s `tonal` too — deliberately *not*
 * borrowed from it. A panel sits inside content and its tint is a whisper; a
 * toast arrives in the corner of someone's work and was reading as a card made
 * of air. The last test is the one that keeps them from quietly converging
 * again.
 */
import { describe, it, expect } from "vitest";
import {
  ALERT_VARIANTS,
  TRUE_COLORS,
  getAlertVariantTokens,
  getPanelToneStyles,
  type TrueColor,
} from "../../../common/theme/Theme";
import {
  luminance,
  page,
  paint,
  ratio,
  worstOf,
  type Mode,
  type Rgb,
} from "./paletteProbe";

// ── The bars (shared with tonalRim.test.ts) ───────────────────────────────────
const RIM_VS_FILL = 1.1;
const RIM_VS_PAGE = 1.2;

/** The two variants that answer for their own edge. `glass` wears white. */
const RIMMED = ["solid", "tonal"] as const;
type Rimmed = (typeof RIMMED)[number];

const tokensOf = (tone: TrueColor, variant: Rimmed) =>
  getAlertVariantTokens(tone, variant);

/** What the 1px line composites to, laid on `ground`. */
const rimOn = (
  tone: TrueColor,
  variant: Rimmed,
  mode: Mode,
  ground: Rgb,
): Rgb => paint(tokensOf(tone, variant).border, mode, { ground });

const fillOn = (tone: TrueColor, variant: Rimmed, mode: Mode): Rgb =>
  paint(tokensOf(tone, variant).surface, mode, { ground: page(mode) });

/** The 1px line against the card it frames — the seam. */
const seam = (tone: TrueColor, variant: Rimmed, mode: Mode): number => {
  const fill = fillOn(tone, variant, mode);
  return ratio(rimOn(tone, variant, mode, fill), fill);
};

/** The 1px line against the page — the silhouette. */
const silhouette = (tone: TrueColor, variant: Rimmed, mode: Mode): number =>
  ratio(rimOn(tone, variant, mode, page(mode)), page(mode));

const classesOf = (
  variant: Rimmed,
  key: "border" | "surface",
  tone: TrueColor,
): string => tokensOf(tone, variant)[key];

describe("alert + toast variants have a resting edge you can see", () => {
  it("separates from its own fill and from the page, in both modes", () => {
    const offenders: string[] = [];
    for (const variant of RIMMED)
      for (const tone of TRUE_COLORS)
        for (const mode of ["light", "dark"] as const) {
          const againstFill = seam(tone, variant, mode);
          const againstPage = silhouette(tone, variant, mode);
          if (againstFill < RIM_VS_FILL)
            offenders.push(
              `${variant}/${tone}/${mode}: rim only ${againstFill.toFixed(3)}:1 against the fill it frames`,
            );
          if (againstPage < RIM_VS_PAGE)
            offenders.push(
              `${variant}/${tone}/${mode}: rim only ${againstPage.toFixed(3)}:1 against the page`,
            );
        }
    expect(offenders).toEqual([]);
  });

  /**
   * The copy has to sit *on* the fill, not near it: the pair is measured per
   * tone, so a `-50` on a `-50`-ish fill cannot hide behind a tone that works.
   * 4.5:1 is the body-copy bar the rest of the kit uses; the worst tone in the
   * palette has to clear it, not the average one.
   */
  it("keeps its copy legible on its own fill", () => {
    const offenders: string[] = [];
    for (const variant of RIMMED)
      for (const tone of TRUE_COLORS)
        for (const mode of ["light", "dark"] as const) {
          const fill = fillOn(tone, variant, mode);
          const tokens = tokensOf(tone, variant);
          for (const [label, classes] of [
            ["title", tokens.surface],
            ["body", tokens.text],
            ["icon", tokens.icon],
          ] as const) {
            // Icons are graphical objects: 3:1 (WCAG 1.4.11), not 4.5.
            const bar = label === "icon" ? 3 : 4.5;
            const measured = ratio(paint(classes, mode, { ground: fill, props: ["text"] }), fill);
            if (measured < bar)
              offenders.push(
                `${variant}/${tone}/${mode}: ${label} only ${measured.toFixed(3)}:1 on the fill (needs ${bar})`,
              );
          }
        }
    expect(offenders).toEqual([]);
  });

  /**
   * `solid`: page → rim → fill. The rim is the fill's neighbour *toward the
   * page*, one step, in each mode. This is the rule that separates the chosen
   * `-600` / `-500` from the first attempt's `-800` / `-600`: both clear the
   * ratio bars, only one of them keeps the edge between the card and the
   * ground instead of dropping a dark outline over the tone.
   */
  it("sits solid's edge between its fill and the page", () => {
    const offenders: string[] = [];
    for (const tone of TRUE_COLORS)
      for (const mode of ["light", "dark"] as const) {
        const p = luminance(page(mode));
        const f = luminance(fillOn(tone, "solid", mode));
        const r = luminance(rimOn(tone, "solid", mode, fillOn(tone, "solid", mode)));
        const between = mode === "light" ? p > r && r > f : p < r && r < f;
        if (!between)
          offenders.push(
            `solid/${tone}/${mode}: page ${p.toFixed(3)} / rim ${r.toFixed(3)} / fill ${f.toFixed(3)} — the rim is not between them`,
          );
      }
    expect(offenders).toEqual([]);
  });

  /**
   * `tonal`: page → fill → rim. Its fill is a pale tint, so an edge *between*
   * the fill and the page would be a rim lighter than the card — visible and
   * wrong, the mistake `tonalRim.test.ts` documents for Panel. The rim has to
   * pass the fill and go away from the page, which is the same law the Panel
   * card obeys.
   */
  it("steps tonal's edge past its fill, away from the page", () => {
    const offenders: string[] = [];
    for (const tone of TRUE_COLORS)
      for (const mode of ["light", "dark"] as const) {
        const p = luminance(page(mode));
        const f = luminance(fillOn(tone, "tonal", mode));
        const r = luminance(rimOn(tone, "tonal", mode, fillOn(tone, "tonal", mode)));
        const onward = mode === "light" ? p > f && f > r : p < f && f < r;
        if (!onward)
          offenders.push(
            `tonal/${tone}/${mode}: page ${p.toFixed(3)} / fill ${f.toFixed(3)} / rim ${r.toFixed(3)} — the rim does not step away from the page`,
          );
      }
    expect(offenders).toEqual([]);
  });

  it("names the rungs the measurements picked", () => {
    // Anti-drift: the table in Theme.ts and this test agree on the exact step,
    // not merely on a ratio a future edit could satisfy with a frame.
    for (const tone of TRUE_COLORS) {
      expect(classesOf("solid", "border", tone)).toBe(
        `border-${tone}-600 dark:border-${tone}-500`,
      );
      expect(classesOf("tonal", "border", tone)).toBe(
        `border-${tone}-400 dark:border-${tone}-600`,
      );
      expect(classesOf("tonal", "surface", tone)).toBe(
        `bg-${tone}-200 text-${tone}-950 dark:bg-${tone}-800 dark:text-${tone}-50`,
      );
    }
  });

  it("is a stronger object than Panel's tonal, on purpose", () => {
    // A callout arrives from off-page; a panel sits inside content. Measured
    // against the page, the callout's fill must never be the weaker of the two
    // and its worst tone must be clearly stronger than Panel's — otherwise the
    // toast has quietly become Panel's whisper again, which is the report this
    // variant was added for.
    const presence = (classes: string, mode: Mode): number =>
      ratio(paint(classes, mode, { ground: page(mode) }), page(mode));

    // Per tone the two are allowed to converge — at the palest tones a
    // 60%-alpha `-200` over white and an opaque `-200` are nearly the same
    // colour — but the callout may never be the *weaker* card, and its worst
    // tone has to be clearly stronger than Panel's worst. That worst-to-worst
    // number is the one the user saw: a toast that measured like the page.
    for (const tone of TRUE_COLORS)
      for (const mode of ["light", "dark"] as const) {
        const mine = presence(classesOf("tonal", "surface", tone), mode);
        const panel = presence(getPanelToneStyles(tone).tonalBg, mode);
        expect(mine).toBeGreaterThanOrEqual(panel - 0.01);
      }
    for (const mode of ["light", "dark"] as const)
      expect(
        worstOf(TRUE_COLORS, (c) => presence(classesOf("tonal", "surface", c), mode)),
      ).toBeGreaterThanOrEqual(
        worstOf(TRUE_COLORS, (c) => presence(getPanelToneStyles(c).tonalBg, mode)) + 0.02,
      );

    // And it is not `solid` either: the two have to be tellable apart.
    for (const tone of TRUE_COLORS)
      for (const mode of ["light", "dark"] as const)
        expect(
          ratio(fillOn(tone, "solid", mode), fillOn(tone, "tonal", mode)),
        ).toBeGreaterThanOrEqual(1.5);
  });

  it("leaves the glass pair's achromatic rim alone", () => {
    // The white rim is what lets a glass card read over a photo; tinting it
    // would answer a deck problem the blur already solves.
    for (const tone of TRUE_COLORS)
      for (const variant of ["glass", "liquid-glass"] as const)
        expect(getAlertVariantTokens(tone, variant).border).toBe("");
  });

  it("lists tonal where it reads — after solid, before outline", () => {
    expect([...ALERT_VARIANTS]).toEqual([
      "subtle",
      "solid",
      "tonal",
      "outline",
      "glass",
      "liquid-glass",
    ]);
  });

  /**
   * The canaries: the rungs that were measured and rejected, required to keep
   * failing. `border-transparent` is the state the card shipped in. Light
   * `-{c}-700` is the fill itself — a rim that agrees with its own card. And
   * dark `-{c}-900` is the strongest-looking candidate of the six, 3.367:1
   * against its fill, that measures 1.000:1 against the page on the neutrals:
   * a rim that lands back on the ground it was meant to leave. If loosening a
   * threshold above ever admits one of them, the threshold was moved to admit
   * the bug.
   */
  it("the rejected rungs still fail the bar", () => {
    const seamAgainst = (
      token: (c: TrueColor) => string,
      mode: Mode,
    ): number =>
      worstOf(TRUE_COLORS, (c) => {
        const fill = fillOn(c, "solid", mode);
        return ratio(paint(token(c), mode, { ground: fill }), fill);
      });
    const pageAgainst = (token: (c: TrueColor) => string, mode: Mode): number =>
      worstOf(TRUE_COLORS, (c) =>
        ratio(paint(token(c), mode, { ground: page(mode) }), page(mode)),
      );

    // No edge at all, in either mode.
    for (const mode of ["light", "dark"] as const)
      expect(seamAgainst(() => "border-transparent", mode)).toBeLessThan(RIM_VS_FILL);

    // A rim that agrees with its own card: the fill's own shade, 1.000:1.
    expect(seamAgainst((c) => `border-${c}-700`, "light")).toBeLessThan(RIM_VS_FILL);

    // A rim that lands back on the ground it was meant to leave.
    expect(pageAgainst((c) => `dark:border-${c}-900`, "dark")).toBeLessThan(RIM_VS_PAGE);

    // And the frame: `-800` light passes both ratio bars — 1.250 against the
    // fill, 6.875 against the page — so the bars alone would have shipped it.
    // It fails the *ordering*: the edge belongs between the card and the page,
    // not on the far side of the fill. This is the assertion that keeps a
    // future "make the border more visible" edit from doubling the outline.
    const beyondFill = worstOf(TRUE_COLORS, (c) => {
      const fill = fillOn(c, "solid", "light");
      const rim = paint(`border-${c}-800`, "light", { ground: fill });
      return luminance(rim) < luminance(fill) ? 1 : -1;
    });
    expect(beyondFill).toBe(1);
  });
});
