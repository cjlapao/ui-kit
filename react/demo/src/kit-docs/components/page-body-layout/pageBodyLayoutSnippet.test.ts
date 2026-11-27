import { describe, it, expect } from "vitest";
import { isValidElement } from "react";
import { Panel } from "@cjlapao/ui-kit";
import { createEmitter } from "../../shared/playground/emit";
import {
  ZONES,
  pageBodyLayoutCode,
  pageBodyLayoutConfig,
} from "./PageBodyLayoutPlayground";
import { PAGE_BODY_LAYOUT_PROPS } from "./PageBodyLayoutPage";
import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * PageBodyLayout's snippet.
 *
 * Two things are being checked here that the engine cannot check for itself.
 * First, that the Code view opens saying nothing: a layout playground whose
 * snippet arrives pre-styled would teach the reader the playground's taste
 * rather than the component's defaults. Second — the one that matters for a page
 * like this — that the zone the reader sees and the `const` the reader is handed
 * are the same panel, because those are two descriptions of one thing, written
 * by hand, and nothing in the types can stop them drifting.
 */

/** What the controls show on load — derived from the config, so it cannot go stale. */
const OPENING = Object.fromEntries(
  pageBodyLayoutConfig.fields.map((field) => [field.id, field.default]),
) as PlaygroundState;

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign({}, OPENING, changes) as PlaygroundState;
  const h = createEmitter(pageBodyLayoutConfig, state);
  return pageBodyLayoutCode({ state, data: {}, h });
};

/** Every attribute on the element itself — the zone panels are not the contract. */
const attributes = (code: string): string[] => {
  const open = /<PageBodyLayout([^>]*)>/.exec(code);
  if (!open) throw new Error(`snippet(): no <PageBodyLayout> in\n${code}`);
  const named = [...open[1].matchAll(/([A-Za-z]\w*)=(?:"|\{)/g)].map((m) => m[1]);
  const flags = open[1]
    .replace(/[A-Za-z]\w*=(?:"[^"]*"|\{[^}]*\})/g, "")
    .match(/(^|\s)([A-Za-z]\w*)(?=\s|$)/g)
    ?.map((flag) => flag.trim());
  return [...named, ...(flags ?? [])];
};

/** The hoisted `const … = ( … );` for one zone, or null when the state switched it off. */
const printedZone = (code: string, id: string): string | null =>
  new RegExp(`const ${id} = \\([\\s\\S]*?\\n\\);`).exec(code)?.[0] ?? null;

describe("the opening", () => {
  it("opens on the component's own defaults", () => {
    // Each of these is the `@default` in src/components — the rule the whole
    // pass exists to keep. Change one here and it has to change there.
    expect(OPENING).toMatchObject({
      gap: 8,
      padding: "xs",
      centerPadding: "none",
      minCenterWidth: 240,
      minCenterHeight: 120,
      variant: "outlined",
      tone: "none",
      corner: "rounded-md",
      transparency: "auto",
      vibrancy: "medium",
      glassOpacity: "frosted",
      specularMode: "classic",
      raisedSurface: false,
    });
  });

  it("says nothing but the zones it was handed", () => {
    const code = snippet();
    expect(attributes(code)).toEqual(["header", "left", "right", "bottom"]);
    // On the element: the zone `const`s below it legitimately carry their own
    // variant= and padding=, which are Panel's props, not this contract.
    const open = /<PageBodyLayout([^>]*)>/.exec(code)![1];
    for (const untouched of [
      "gap",
      "padding",
      "centerPadding",
      "minCenterWidth",
      "minCenterHeight",
      "variant",
      "tone",
      "corner",
      "transparency",
      "vibrancy",
      "glassOpacity",
      "specularMode",
      "raisedSurface",
    ]) {
      expect(open, untouched).not.toContain(`${untouched}=`);
    }
    expect(open).not.toContain("raisedSurface");
  });
});

describe("the zones", () => {
  it("arrive as data, each with the line that says what it is", () => {
    const code = snippet();
    expect(code).toContain("import { PageBodyLayout, Panel } from \"@cjlapao/ui-kit\";");
    expect(code).toContain("// Header zone — the caller's own content");
    expect(code).toContain("// Bottom zone — spans the centre only, not the side zones");
    for (const id of ["header", "left", "right", "bottom", "centre"]) {
      expect(printedZone(code, id), id).not.toBeNull();
    }
  });

  it("prints the very panel the stage is rendering", () => {
    const code = snippet();
    for (const id of ["header", "left", "right", "bottom", "centre"] as const) {
      const printed = printedZone(code, id);
      const props = ZONES[id].element.props as Record<string, unknown>;
      expect(printed, id).toContain(`title="${props.title}"`);
      expect(printed, id).toContain(`variant="${props.variant}"`);
      expect(printed, id).toContain(`padding="${props.padding}"`);
      if (props.className) expect(printed, id).toContain(`className="${props.className}"`);
      // The body line inside the panel, two levels down — the header zone has
      // none, being only a title.
      if (props.children) {
        const body = (props.children as { props: { children: string } }).props.children;
        expect(printed, id).toContain(body);
      }
    }
  });

  it("takes the attribute and the const together when a zone goes off", () => {
    const code = snippet({ withRight: false, withBottom: false });
    expect(code).not.toContain("right={right}");
    expect(code).not.toContain("const right =");
    expect(code).not.toContain("bottom={bottom}");
    expect(code).not.toContain("const bottom =");
    // A dangling reference would be the failure mode: the attribute gone, the
    // declaration — or the other way round — still there.
    expect(code).not.toContain("Activity");
    expect(attributes(code)).toEqual(["header", "left"]);
  });

  it("keeps the centre inside the element, where children belong", () => {
    const code = snippet();
    expect(code).toContain("{centre}");
    expect(code).toContain("</PageBodyLayout>");
    expect(code).not.toContain("children={centre}");
  });
});

describe("a deviation", () => {
  it("prints the line the moment the reader moves the option", () => {
    const code = snippet({
      gap: 16,
      padding: "md",
      centerPadding: "sm",
      minCenterWidth: 320,
      minCenterHeight: 200,
    });
    expect(code).toContain("gap={16}");
    expect(code).toContain('padding="md"');
    expect(code).toContain('centerPadding="sm"');
    expect(code).toContain("minCenterWidth={320}");
    expect(code).toContain("minCenterHeight={200}");
  });

  it("hands the glass knobs to the variant that reads them", () => {
    const glass = snippet({ variant: "liquid-glass", vibrancy: "high", glassOpacity: "clear", specularMode: "halo" });
    expect(glass).toContain('variant="liquid-glass"');
    expect(glass).toContain('vibrancy="high"');
    expect(glass).toContain('glassOpacity="clear"');
    expect(glass).toContain('specularMode="halo"');

    // `elevated` has no vibrancy, no fill alpha and no specular highlight to
    // set — printing them there would be a prop that does nothing.
    const plain = snippet({ variant: "elevated", vibrancy: "high", glassOpacity: "clear", specularMode: "halo" });
    expect(plain).not.toContain("vibrancy=");
    expect(plain).not.toContain("glassOpacity=");
    expect(plain).not.toContain("specularMode=");
  });

  it("keeps an unpinned transparency silent", () => {
    // `auto` means "let the variant answer", which is what the component does
    // when the prop is undefined — so it is what prints nothing.
    expect(snippet()).not.toContain("transparency=");
    expect(snippet({ transparency: "low" })).toContain('transparency="low"');
  });

  it("only prints raisedSurface where it paints something", () => {
    expect(snippet({ variant: "tonal", raisedSurface: true })).toContain("raisedSurface");
    expect(snippet({ variant: "elevated", raisedSurface: true })).not.toContain("raisedSurface");
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const documented = PAGE_BODY_LAYOUT_PROPS.map((row) => row.name);
    const printed = attributes(
      snippet({ withBottom: false, gap: 16, padding: "lg", variant: "tonal", tone: "emerald", raisedSurface: true, minCenterWidth: 320 }),
    );
    expect(printed).toEqual(
      expect.arrayContaining(["header", "left", "right", "gap", "padding", "variant", "tone", "raisedSurface", "minCenterWidth"]),
    );
    expect(printed.filter((name) => !documented.includes(name))).toEqual([]);
  });

  it("covers every option the playground can speak for", () => {
    const documented = PAGE_BODY_LAYOUT_PROPS.map((row) => row.name);
    for (const field of pageBodyLayoutConfig.fields) {
      if (field.prop === null) continue;
      expect(documented, `field "${field.id}"`).toContain(field.prop ?? field.id);
    }
    for (const source of pageBodyLayoutConfig.data ?? []) {
      if (source.prop === null) continue;
      expect(documented, `data source "${source.id}"`).toContain(source.prop);
    }
  });

  it("hands the stage a real Panel per zone", () => {
    // The engine would accept anything in `value`; this says the fixtures are
    // mountable elements of the component the page documents, so what the
    // snippet prints as `<Panel …>` is what the stage actually paints.
    for (const id of ["header", "left", "right", "bottom", "centre"] as const) {
      const fixture = ZONES[id].element;
      expect(isValidElement(fixture), id).toBe(true);
      expect(fixture.type, id).toBe(Panel);
    }
  });
});
