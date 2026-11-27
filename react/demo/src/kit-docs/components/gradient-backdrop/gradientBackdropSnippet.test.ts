import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { gradientBackdropConfig } from "./gradientBackdropPlayground";
import { gradientBackdropCode } from "./GradientBackdropPlayground";
import { GRADIENT_BACKDROP_PROPS } from "./GradientBackdropPage";
import { STAGE_CLASS, overlayFor, themeFor } from "./gradientBackdropStage";
import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * Gradient Backdrop's snippet.
 *
 * The page claims the Code view says nothing on load — every control opens on
 * the value `GradientBackdrop.tsx:55` destructures — that a template id is the
 * only honest way to print `theme`, that the derived side of a custom theme is
 * absent rather than invented, and that `noiseScale` cannot speak unless `noise`
 * is on, because the component reads it only inside the `noise &&` layer
 * (GradientBackdrop.tsx:87-101). Each assertion fails if a default drifts, if a
 * colour the reader never picked reaches the source, or if a knob that needs a
 * partner prints on its own.
 */

/** The controls open on the config's own defaults, which are the component's. */
const OPENING: PlaygroundState = {};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign({}, OPENING, changes) as PlaygroundState;
  const h = createEmitter(gradientBackdropConfig, state);
  // Resolved by the same functions the stage mounts, so the snippet cannot
  // describe a theme or a panel that is not on screen.
  return gradientBackdropCode({
    state,
    data: { theme: themeFor(state), overlay: overlayFor() },
    h,
  });
};

/** The element itself, comment and children excluded. */
const tagOf = (code: string): string => {
  const open = code.indexOf("<GradientBackdrop");
  return code.slice(open, code.indexOf(">", open) + 1);
};

/** Attribute names on the printed `<GradientBackdrop …>`, in printed order. */
const attributes = (code: string): string[] => {
  const tag = tagOf(code);
  const named = [...tag.matchAll(/([A-Za-z]\w*)=(?:"|\{)/g)].map((m) => m[1]);
  const flags = tag
    .replace(/[A-Za-z]\w*=(?:"[^"]*"|\{[^}]*\})/g, "")
    .match(/(^|\s)([A-Za-z]\w*)(?=\s|>)/g)
    ?.map((flag) => flag.trim())
    .filter((flag) => flag !== "GradientBackdrop");
  return [...named, ...(flags ?? [])];
};

/** Everything after the theme's `const`, so assertions cannot hit prose. */
const themeConst = (code: string): string => {
  const start = code.indexOf("const THEME");
  return start < 0 ? "" : code.slice(start, code.indexOf("};", start) + 2);
};

/** Every prop name the API table documents, composite rows split apart. */
const documented = (): string[] =>
  GRADIENT_BACKDROP_PROPS.flatMap((row) =>
    row.name
      .replace(/^[a-z]+:\s*/, "")
      .split("/")
      .map((part) => part.trim().replace(/\s*\(inherited\)$/, ""))
      .filter((part) => part && part !== "…"),
  );

describe("the opening", () => {
  it("prints no prop beyond the size it needs", () => {
    const code = snippet();
    // `className` is the one attribute that prints at its default: it is not a
    // preference, it is what makes the box visible at all.
    expect(attributes(code)).toEqual(["className"]);
    for (const untouched of ["theme", "scheme", "noise", "noiseScale"]) {
      expect(tagOf(code), untouched).not.toContain(`${untouched}=`);
    }
    expect(tagOf(code)).toMatch(/^<GradientBackdrop\s/);
    expect(code).toContain(
      'import { GradientBackdrop, Panel } from "@cjlapao/ui-kit";',
    );
  });

  it("opens on the values GradientBackdrop.tsx destructures", () => {
    // GB:55 `theme = "slate"`, `scheme = "auto"`, `noise = false`, and no
    // noiseScale at all — so the field opens at the value that means "absent".
    const field = (id: string) =>
      gradientBackdropConfig.fields.find((f) => f.id === id);
    expect(field("template")?.default).toBe("slate");
    expect(field("template")?.prop).toBe("theme");
    expect(field("scheme")?.default).toBe("auto");
    expect(field("noise")?.default).toBe(false);
    expect(field("noiseScale")?.default).toBe("auto");
    // The two levers that decide what `theme` holds are not props themselves.
    expect(field("source")?.prop).toBeNull();
    expect(field("sides")?.prop).toBeNull();
    expect(field("lightGlow")?.prop).toBeNull();
    expect(field("darkTo")?.prop).toBeNull();
  });

  it("prints the panel it is mounting, at the size the stage gave it", () => {
    const code = snippet();
    // A different stage on screen must be a different string in the snippet.
    const banner = snippet({ size: "flex min-h-32 items-center rounded-xl px-6" });
    expect(tagOf(banner)).toContain('className="flex min-h-32 items-center rounded-xl px-6"');
    expect(tagOf(banner)).not.toContain(STAGE_CLASS);
    expect(code).toContain("<Panel");
    expect(code).toContain('variant="glass"');
    expect(code).toContain('title="Glass over the backdrop"');
    expect(tagOf(code)).toContain(`className="${STAGE_CLASS}"`);
    // Children, not an invented attribute list — the tag opens with what the
    // reader chose and closes around the panel.
    expect(code).toMatch(/<GradientBackdrop\s/);
    expect(code).toContain("</GradientBackdrop>");
  });
});

describe("the theme", () => {
  it("prints a template id only once it is off slate", () => {
    expect(snippet({ template: "mist" })).toContain('theme="mist"');
    expect(snippet({ template: "graphite" })).toContain('theme="graphite"');
    expect(tagOf(snippet({ template: "slate" }))).not.toContain("theme=");
  });

  it("lifts the sample theme into a const the moment it is custom", () => {
    const code = snippet({ source: "custom" });
    expect(tagOf(code)).toContain("theme={THEME}");
    expect(code).toContain("const THEME = {");
    expect(code).toContain('glow: "#fde68a"');
    // The derivation is what the reader cannot see on screen, so it is said.
    expect(code).toContain("deriveDarkColor");
    // Nothing invented for the hidden side.
    expect(themeConst(code)).not.toContain("dark: {");
    expect(themeConst(code)).not.toContain("undefined");
  });

  it("gives the side the reader asks for and lets the kit derive the other", () => {
    expect(themeConst(snippet({ source: "custom", sides: "dark" }))).toContain(
      'to: "#35302a"',
    );
    expect(themeConst(snippet({ source: "custom", sides: "dark" }))).not.toContain(
      "light: {",
    );
    const both = themeConst(snippet({ source: "custom", sides: "both" }));
    expect(both).toContain("light: {");
    expect(both).toContain("dark: {");
  });

  it("prints the colour the picker holds, not the one it started with", () => {
    expect(themeConst(snippet({ source: "custom", lightVia: "#123456" }))).toContain(
      'via: "#123456"',
    );
    // A colour of the hidden side cannot reach the snippet.
    expect(themeConst(snippet({ source: "custom", sides: "light", darkVia: "#654321" }))).not.toContain(
      "#654321",
    );
  });

  it("never prints a template id and a theme object together", () => {
    const custom = snippet({ source: "custom", template: "mist" });
    expect(tagOf(custom)).toContain("theme={THEME}");
    expect(custom).not.toContain('theme="mist"');
    const preset = snippet({ template: "mist", lightGlow: "#123456" });
    expect(tagOf(preset)).toContain('theme="mist"');
    expect(preset).not.toContain("THEME");
  });
});

describe("the texture", () => {
  it("makes grain scale need grain", () => {
    // GradientBackdrop.tsx:87 gates the only read of noiseScale (:97), so a
    // snippet with a scale and no grain would describe a prop the component
    // cannot see.
    expect(tagOf(snippet({ noiseScale: "0.5" }))).not.toContain("noiseScale");
    const grain = snippet({ noise: true, noiseScale: "0.5" });
    expect(attributes(grain)).toContain("noiseScale");
    expect(grain).toContain("noiseScale={0.5}");
    expect(grain).toContain("noise");
    // The automatic value is the absent one: getNoiseBackgroundSize keeps its
    // own sizing when noiseScale is undefined.
    expect(tagOf(snippet({ noise: true, noiseScale: "auto" }))).not.toContain(
      "noiseScale",
    );
    expect(tagOf(snippet({ noise: false, noiseScale: "2" }))).not.toContain("noise");
  });
});

describe("the scheme", () => {
  it("names a scheme only when it pins one", () => {
    expect(snippet({ scheme: "light" })).toContain('scheme="light"');
    expect(snippet({ scheme: "dark" })).toContain('scheme="dark"');
    expect(tagOf(snippet({ scheme: "auto" }))).not.toContain("scheme=");
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const rows = documented();
    for (const state of [
      {},
      { template: "fog", scheme: "dark" },
      { noise: true, noiseScale: "0.25" },
      { source: "custom", sides: "both", template: "dune" },
    ]) {
      for (const attribute of attributes(snippet(state))) {
        expect(rows, attribute).toContain(attribute);
      }
    }
  });

  it("documents every prop the playground can speak for", () => {
    const printed = new Set(
      gradientBackdropConfig.fields
        .filter((field) => field.prop !== null)
        .map((field) => field.prop ?? field.id),
    );
    for (const name of printed) expect(documented(), name).toContain(name);
  });

  it("keeps the content levers and the overlay out of the source", () => {
    // `source` and `sides` decide what `theme` holds; `overlay` is children.
    // None of them is a prop, so none may reach the snippet.
    const code = snippet({ source: "custom", sides: "both", noise: true });
    expect(tagOf(code)).not.toMatch(/\bsource=/);
    expect(tagOf(code)).not.toMatch(/\bsides=/);
    expect(tagOf(code)).not.toMatch(/\boverlay/);
    expect(code).not.toMatch(/\boverlay=/);
  });
});
