import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { panelConfig } from "./panelPlayground";
import { panelCode } from "./PanelPlayground";
import { PANEL_PROPS } from "./PanelPage";
import { BODY_TEXT } from "./panelStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * Panel's snippet.
 *
 * Panel has ~50 props and a long list of props that are only read under some
 * other prop's value — the skeleton lines without `loading`, the loader copy
 * under the skeleton, the decoration under `overlay` media, the two glass knobs
 * on a variant that never reads them, the depth sheet without `disabled`. The
 * controls hide themselves in each of those cases, so the Code view must too;
 * these tests are what stops a printed `skeletonLines={5}` from describing a
 * component that was never told to load.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  // Every field carries the component's own default; the cast is for the type,
  // which has no undefined, not for the data.
  for (const field of panelConfig.fields)
    state[field.id] = field.default as PlaygroundValue;
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const data = Object.fromEntries(
    (panelConfig.data ?? []).map((source) => [source.id, source.value(state)]),
  );
  return panelCode({ state, data, h: createEmitter(panelConfig, state) });
};

/** The element itself — comments, declarations and children excluded. */
const tagOf = (code: string): string => {
  const open = code.indexOf("<Panel");
  return code.slice(open, code.indexOf(">", open) + 1);
};

/** Attribute names on the printed `<Panel …>`, in printed order. */
const attributes = (code: string): string[] => {
  const tag = tagOf(code);
  const named = [...tag.matchAll(/([A-Za-z]\w*)=(?:"|\{)/g)].map((m) => m[1]);
  const flags = tag
    .replace(/[A-Za-z]\w*=(?:"[^"]*"|\{[^}]*\})/g, "")
    .match(/(^|\s)([A-Za-z]\w*)(?=\s|>)/g)
    ?.map((flag) => flag.trim())
    .filter((flag) => flag !== "Panel");
  return [...named, ...(flags ?? [])];
};

/** Every prop name the API table documents, composite rows split apart. */
const documented = (): string[] =>
  PANEL_PROPS.flatMap((row) =>
    row.name
      .replace(/^[a-z]+:\s*/, "")
      .split("/")
      .map((part) => part.trim().replace(/[?]\d$/, ""))
      .filter((part) => part && part !== "…"),
  );

describe("the opening", () => {
  it("prints the content it shows and nothing that is a default", () => {
    const code = snippet();
    expect(attributes(code)).toEqual([
      "media",
      "actions",
      "badge",
      "title",
      "subtitle",
      "description",
    ]);
    // The reader sees an elevated, untinted, sm, rounded-md card. None of that
    // is an attribute, because none of it is off the component's own defaults.
    for (const untouched of [
      "variant",
      "tone",
      "transparency",
      "corner",
      "padding",
      "hoverable",
      "clickable",
      "onClick",
      "loading",
      "decoration",
    ]) {
      expect(tagOf(code), untouched).not.toContain(`${untouched}=`);
    }
    expect(code).toContain('import { Panel } from "@cjlapao/ui-kit";');
  });

  it("opens on the values Panel.tsx destructures", () => {
    // Panel.tsx:645-711 — the container standard the page describes.
    const field = (id: string) => panelConfig.fields.find((f) => f.id === id);
    expect(field("variant")?.default).toBe("elevated");
    expect(field("tone")?.default).toBe("none");
    expect(field("corner")?.default).toBe("rounded-md");
    expect(field("padding")?.default).toBe("sm");
    expect(field("mediaPlacement")?.default).toBe("top");
    expect(field("actionLayout")?.default).toBe("auto");
    expect(field("decoration")?.default).toBe("none");
    expect(field("loading")?.default).toBe(false);
    expect(field("loaderType")?.default).toBe("skeleton");
    expect(field("skeletonLines")?.default).toBe(3);
    expect(field("hoverShadow")?.default).toBe(false);
    expect(field("disabledVeil")?.default).toBe(true);
    expect(field("nestedSurface")?.default).toBe(true);
    expect(field("scrollable")?.default).toBe(true);
    // Three-state props: the component's own answer to an absent prop is
    // Boolean(onClick), so the playground leaves them absent rather than
    // printing a decision the reader did not make.
    expect(field("hoverable")?.default).toBe("auto");
    expect(field("clickable")?.default).toBe("auto");
    // …and `onClick` starts off, so `auto` is honestly an inert card.
    expect(field("onClick")?.default).toBe(false);
  });

  it("declares what it names, in the order the module needs", () => {
    const code = snippet();
    expect(code).toContain("const MEDIA = <div");
    expect(code).toContain("const ACTIONS = [");
    // ACTIONS reads onAction while it is built: after it would be a
    // temporal-dead-zone error in the code a reader copies.
    expect(code.indexOf("const onAction")).toBeLessThan(
      code.indexOf("const ACTIONS"),
    );
    expect(code).toContain("onClick: onAction,");
  });

  it("prints the body as children, never as a prop", () => {
    const code = snippet();
    expect(code).toContain(BODY_TEXT);
    expect(tagOf(code)).not.toMatch(/children|body=/);
  });
});

describe("props the component cannot see on their own", () => {
  it("keeps the skeleton with loading", () => {
    // Panel.tsx:1217 — showSkeleton is `loading && loaderType === "skeleton"`.
    expect(tagOf(snippet({ skeletonLines: 5 }))).not.toContain("skeletonLines");
    expect(snippet({ loading: true, skeletonLines: 5 })).toContain(
      "skeletonLines={5}",
    );
    expect(tagOf(snippet({ loading: true }))).not.toContain("skeletonLines=");
  });

  it("keeps the loader copy with the loader that reads it", () => {
    // The skeleton draws bars; only the Loader overlay takes title and label
    // (:1487-1494), and only the progress bar a number (:1493).
    expect(tagOf(snippet({ loading: true }))).not.toContain("loaderTitle");
    expect(tagOf(snippet({ loading: true }))).not.toContain("loaderProgress");
    const spinner = snippet({ loading: true, loaderType: "spinner" });
    expect(spinner).toContain('loaderTitle="Loading…"');
    expect(spinner).not.toContain("loaderProgress");
    expect(snippet({ loading: true, loaderType: "progress" })).toContain(
      "loaderProgress={30}",
    );
  });

  it("keeps each fixture with the toggle that mounts it", () => {
    // media (:1205-1215), actions (:1166), badge (:1128).
    expect(tagOf(snippet({ showMedia: false }))).not.toContain("media=");
    expect(snippet({ showMedia: false })).not.toContain("const MEDIA");
    expect(tagOf(snippet({ showActions: false }))).not.toContain("actions=");
    expect(snippet({ showActions: false })).not.toContain("const ACTIONS");
    expect(tagOf(snippet({ showBadge: false }))).not.toContain("badge=");
    // …and the levers that only shape them.
    expect(tagOf(snippet({ showMedia: false }))).not.toContain(
      "mediaPlacement",
    );
    // …and the placement returns with the media it describes (:1205-1215).
    expect(snippet({ mediaPlacement: "start" })).toContain(
      'mediaPlacement="start"',
    );
    expect(tagOf(snippet({ showActions: false }))).not.toContain("actionLayout");
  });

  it("keeps decoration out of the overlay that suppresses it", () => {
    // Panel.tsx:927-930 — overlay hides decoration entirely.
    const overlay = snippet({ mediaPlacement: "overlay", decoration: "shapes" });
    expect(tagOf(overlay)).toContain('mediaPlacement="overlay"');
    expect(tagOf(overlay)).not.toContain("decoration");
    expect(snippet({ decoration: "shapes" })).toContain('decoration="shapes"');
  });

  it("says nothing about the glass knobs on a variant that drops them", () => {
    // getGlassVibrancyClass / getSurfaceGlassFillClass are computed (:958-959)
    // and used in one branch only (:1011-1012).
    for (const variant of ["glass", "default", "elevated"]) {
      const code = tagOf(snippet({ variant, vibrancy: "high", glassOpacity: "clear" }));
      expect(code, variant).not.toContain("vibrancy");
      expect(code, variant).not.toContain("glassOpacity");
    }
    const liquid = snippet({
      variant: "liquid-glass",
      vibrancy: "high",
      glassOpacity: "clear",
    });
    expect(liquid).toContain('vibrancy="high"');
    expect(liquid).toContain('glassOpacity="clear"');
  });

  it("keeps the lift with the hover that shows it", () => {
    // :1283 sits inside the hoverable condition, and :1301 with it.
    expect(tagOf(snippet({ hoverable: "off", hoverShadow: true }))).not.toContain(
      "hoverShadow",
    );
    expect(snippet({ hoverShadow: true })).toContain("hoverShadow");
  });

  it("keeps the depth sheet with disabled, and each hue with its state", () => {
    // The veil is painted inside the `disabled` branch (:1479-1484).
    expect(tagOf(snippet({ disabledVeil: false }))).not.toContain("disabledVeil");
    expect(snippet({ disabled: true, disabledVeil: false })).toContain(
      "disabledVeil={false}",
    );
    // The selection hue is read by the rim (:891-894); the glow hue follows it
    // and the glow itself is cancelled by disabled (:921-922).
    expect(tagOf(snippet({ activeTone: "amber" }))).not.toContain("activeTone");
    expect(snippet({ active: true, activeTone: "amber" })).toContain(
      'activeTone="amber"',
    );
    expect(tagOf(snippet({ pulseTone: "rose" }))).not.toContain("pulseTone");
    expect(tagOf(snippet({ pulse: true, disabled: true, pulseTone: "rose" }))).not.toContain(
      "pulseTone",
    );
    expect(snippet({ pulse: true, pulseTone: "rose" })).toContain('pulseTone="rose"');
  });
});

describe("the props whose absence is the interesting state", () => {
  it("prints nothing for an untinted card", () => {
    // `none` is what resolvePanelTone answers for an absent tone (:494-498).
    // `tone` is checked as an attribute name — the description's own wording
    // ("the surface's muted tone.") is not one.
    expect(attributes(snippet({ tone: "none" }))).not.toContain("tone");
    expect(snippet({ tone: "amber" })).toContain('tone="amber"');
  });

  it("prints transparency only when the reader overrode the variant", () => {
    // resolveSurfaceTransparency picks per variant when the prop is absent
    // (surfaceTransparency.ts:7), so `auto` has no literal to print.
    expect(tagOf(snippet({ transparency: "auto" }))).not.toContain("transparency");
    expect(snippet({ transparency: "low" })).toContain('transparency="low"');
  });

  it("speaks the three-state props as booleans, not strings", () => {
    expect(tagOf(snippet({ hoverable: "auto", clickable: "auto" }))).not.toMatch(
      /hoverable|clickable/,
    );
    const on = tagOf(snippet({ hoverable: "on", clickable: "on" }));
    expect(on).toContain(" hoverable");
    expect(on).toContain(" clickable");
    expect(on).not.toContain('hoverable="on"');
    const off = tagOf(snippet({ hoverable: "off", clickable: "off" }));
    expect(off).toContain("hoverable={false}");
    expect(off).toContain("clickable={false}");
  });

  it("names a handler only once there is one", () => {
    expect(tagOf(snippet())).not.toContain("onClick");
    expect(snippet()).not.toContain("const onActivate");
    const code = snippet({ onClick: true });
    expect(code).toContain("onClick={onActivate}");
    expect(code).toContain("const onActivate = () => {");
    expect(code.indexOf("const onActivate")).toBeLessThan(
      code.indexOf("<Panel"),
    );
  });

  it("prints numbers bare, and never a zero the component reads as unset", () => {
    // A number becomes `${n}px` at :934-941; 0 is the control's own "no style".
    const code = snippet({ maxWidth: 320, minHeight: 240 });
    expect(code).toContain("maxWidth={320}");
    expect(code).toContain("minHeight={240}");
    expect(code).not.toContain('maxWidth="320"');
    expect(tagOf(snippet({ maxWidth: 0, minHeight: 0 }))).not.toMatch(
      /maxWidth|minHeight/,
    );
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const rows = documented();
    for (const state of [
      {},
      { loading: true, loaderType: "spinner", loaderProgress: 80 },
      { variant: "liquid-glass", vibrancy: "high", glassOpacity: "clear", specularMode: "halo" },
      { onClick: true, clickable: "on", hoverable: "on", active: true, activeTone: "amber" },
      { disabled: true, disabledVeil: false, nestedSurface: false, scrollable: false, flexBody: true },
      { transparency: "medium", corner: "rounded-xl", padding: "none", decoration: "both" },
    ]) {
      for (const attribute of attributes(snippet(state))) {
        expect(rows, attribute).toContain(attribute);
      }
    }
  });

  it("documents every prop the playground can speak for", () => {
    const printed = new Set(
      panelConfig.fields
        .filter((field) => field.prop !== null)
        .map((field) => field.prop ?? field.id),
    );
    for (const source of panelConfig.data ?? []) {
      if (source.prop !== null) printed.add(source.prop ?? source.id);
    }
    for (const name of printed) expect(documented(), name).toContain(name);
  });

  it("keeps the playground's own vocabulary out of the source", () => {
    const code = snippet({ loading: true, showMedia: false, showBadge: false });
    // Levers, not props: they must never appear as attributes or consts.
    for (const lever of ["showMedia", "showBadge", "showActions"]) {
      expect(code).not.toContain(lever);
    }
    // The docs' captions are not strings in the reader's code.
    expect(code).not.toContain("Auto —");
  });
});
