import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { gridBackgroundConfig } from "./gridBackgroundPlayground";
import { gridBackgroundCode } from "./GridBackgroundPlayground";
import { GRID_BACKGROUND_PROPS } from "./GridBackgroundPage";
import { CONTENT_TEXT, STAGE_CLASS, contentFor } from "./gridBackgroundStage";
import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * Grid Background's snippet.
 *
 * The page claims the Code view opens with no attribute at all — every control
 * starts on the value `GridBackground.tsx:37` destructures — that a control the
 * component cannot see is never printed (the dot radius without the dots branch,
 * the fade start without a fade), and that the snippet's structure is the
 * structure on screen: a fill sits beside the content, a wrapper contains it.
 * Each assertion fails if a default drifts, if an inert prop is printed as if
 * the component read it, or if `position` flips the DOM in the preview and not
 * in the source.
 */

const OPENING: PlaygroundState = {};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign({}, OPENING, changes) as PlaygroundState;
  const h = createEmitter(gridBackgroundConfig, state);
  // The same element the stage mounts, from the same function.
  return gridBackgroundCode({
    state,
    data: { content: contentFor() },
    h,
  });
};

/** The element itself, comment, stage and children excluded. */
const tagOf = (code: string): string => {
  const open = code.indexOf("<GridBackground");
  return code.slice(open, code.indexOf(">", open) + 1);
};

/** Attribute names on the printed `<GridBackground …>`, in printed order. */
const attributes = (code: string): string[] => {
  const tag = tagOf(code);
  const named = [...tag.matchAll(/([A-Za-z]\w*)=(?:"|\{)/g)].map((m) => m[1]);
  const flags = tag
    .replace(/[A-Za-z]\w*=(?:"[^"]*"|\{[^}]*\})/g, "")
    .match(/(^|\s)([A-Za-z]\w*)(?=\s|>)/g)
    ?.map((flag) => flag.trim())
    .filter((flag) => flag !== "GridBackground");
  return [...named, ...(flags ?? [])];
};

/** Every prop name the API table documents, composite rows split apart. */
const documented = (): string[] =>
  GRID_BACKGROUND_PROPS.flatMap((row) =>
    row.name
      .replace(/^[a-z]+:\s*/, "")
      .split("/")
      .map((part) => part.trim().replace(/\s*\(inherited\)$/, ""))
      .filter((part) => part && part !== "…"),
  );

describe("the opening", () => {
  it("prints no prop at all", () => {
    const code = snippet();
    expect(attributes(code)).toEqual([]);
    for (const untouched of [
      "pattern",
      "size",
      "opacity",
      "lineColor",
      "dotSize",
      "fade",
      "fadeStart",
      "position",
    ]) {
      expect(tagOf(code), untouched).not.toContain(`${untouched}=`);
    }
    expect(tagOf(code)).toBe("<GridBackground />");
    expect(code).toContain(
      'import { GridBackground, Panel } from "@cjlapao/ui-kit";',
    );
  });

  it("opens on the values GridBackground.tsx destructures", () => {
    // GB:37 `pattern = "grid"`, `size = 32`, `lineColor = "currentColor"`,
    // `dotSize = DOT_DEFAULT_RADIUS` (1), `opacity = 0.12`, `fade = "none"`,
    // `fadeStart = 15`, `position = "absolute"`.
    const field = (id: string) =>
      gridBackgroundConfig.fields.find((f) => f.id === id);
    expect(field("pattern")?.default).toBe("grid");
    expect(field("size")?.default).toBe(32);
    expect(field("lineColor")?.default).toBe("currentColor");
    expect(field("dotSize")?.default).toBe(1);
    expect(field("opacity")?.default).toBe(0.12);
    expect(field("fade")?.default).toBe("none");
    expect(field("fadeStart")?.default).toBe(15);
    expect(field("position")?.default).toBe("absolute");
    // The surface on the lattice is content, so it can never become an attribute.
    expect(gridBackgroundConfig.data?.[0].prop).toBeNull();
  });

  it("prints the box the fill needs and the surface on it", () => {
    const code = snippet();
    // An absolutely positioned fill with no positioned parent paints nothing, so
    // the snippet owes the reader the parent too.
    expect(code).toContain(`className="${STAGE_CLASS}"`);
    expect(code).toContain(CONTENT_TEXT);
    expect(code).toContain("<Panel");
  });
});

describe("the lattice", () => {
  it("prints the pattern only when it is not the default lattice", () => {
    expect(snippet({ pattern: "dots" })).toContain('pattern="dots"');
    expect(tagOf(snippet({ pattern: "grid" }))).not.toContain("pattern=");
  });

  it("prints numbers bare, never quoted", () => {
    const code = snippet({ size: 48, opacity: 0.4 });
    expect(code).toContain("size={48}");
    expect(code).toContain("opacity={0.4}");
    expect(code).not.toContain('size="48"');
    expect(tagOf(snippet({ size: 32, opacity: 0.12 }))).not.toContain("size=");
    expect(tagOf(snippet({ size: 32, opacity: 0.12 }))).not.toContain("opacity=");
  });

  it("says nothing about colour while the lattice follows the text", () => {
    // `currentColor` is the component's own default: the lines inherit the
    // surrounding text colour, and there is no colour to print.
    expect(tagOf(snippet())).not.toContain("lineColor");
    expect(snippet({ lineColor: "cyan" })).toContain('lineColor="cyan"');
    expect(snippet({ lineColor: "currentColor" })).not.toContain("lineColor=");
  });
});

describe("props the component cannot see on their own", () => {
  it("keeps the dot radius with the dots branch", () => {
    // GB:47 reads dotSize only on the dots side of the ternary.
    expect(tagOf(snippet({ dotSize: 3 }))).not.toContain("dotSize");
    expect(snippet({ pattern: "dots", dotSize: 3 })).toContain("dotSize={3}");
    expect(tagOf(snippet({ pattern: "dots", dotSize: 1 }))).not.toContain(
      "dotSize=",
    );
  });

  it("keeps the fade start with a fade", () => {
    // GB:43 builds the mask only when `fade` is radial or vertical.
    expect(tagOf(snippet({ fadeStart: 40 }))).not.toContain("fadeStart");
    expect(snippet({ fade: "radial", fadeStart: 40 })).toContain(
      "fadeStart={40}",
    );
    expect(tagOf(snippet({ fade: "vertical" }))).not.toContain("fadeStart=");
    expect(tagOf(snippet({ fade: "none", fadeStart: 40 }))).not.toContain("fade");
  });
});

describe("placement, which decides the shape of the snippet", () => {
  it("prints a fill beside the content and a wrapper around it", () => {
    const fill = snippet();
    expect(fill).toContain("<GridBackground />");
    // Self-closing, with the surface after it — as mounted.
    expect(fill.indexOf("</GridBackground>")).toBe(-1);
    expect(fill.indexOf(STAGE_CLASS)).toBeLessThan(fill.indexOf(CONTENT_TEXT));

    const wrapper = snippet({ position: "relative" });
    expect(tagOf(wrapper)).toContain('position="relative"');
    expect(wrapper.indexOf("<GridBackground")).toBeLessThan(
      wrapper.indexOf(CONTENT_TEXT),
    );
    expect(wrapper.indexOf(CONTENT_TEXT)).toBeLessThan(
      wrapper.indexOf("</GridBackground>"),
    );
  });

  it("names the placement only once it is off the default fill", () => {
    expect(tagOf(snippet({ position: "absolute" }))).not.toContain("position=");
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const rows = documented();
    for (const state of [
      {},
      { pattern: "dots", dotSize: 2, size: 12 },
      { fade: "vertical", fadeStart: 60, opacity: 0.6 },
      { lineColor: "amber", position: "relative" },
    ]) {
      for (const attribute of attributes(snippet(state))) {
        expect(rows, attribute).toContain(attribute);
      }
    }
  });

  it("documents every prop the playground can speak for", () => {
    const printed = new Set(
      gridBackgroundConfig.fields
        .filter((field) => field.prop !== null)
        .map((field) => field.prop ?? field.id),
    );
    for (const name of printed) expect(documented(), name).toContain(name);
  });

  it("never lets the content or the readout reach the source", () => {
    const code = snippet({ pattern: "dots", fade: "radial" });
    expect(tagOf(code)).not.toMatch(/\bcontent\b/);
    expect(code).not.toMatch(/\bcontent=/);
    // The docs' own caption is not a prop and not a string in the snippet.
    expect(code).not.toContain("lattice ·");
  });
});
