import { describe, expect, it } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { toggleConfig } from "./togglePlayground";
import { toggleCode } from "./TogglePlayground";
import { TOGGLE_PROPS } from "./TogglePage";
import {
  ALIGN_DEFAULT,
  DESCRIPTION_EXAMPLE,
  GLASS_OPACITY_DEFAULT,
  LABEL_DEFAULT,
  PADDING_DEFAULT,
  PLACEMENT_DEFAULT,
  SIZE_DEFAULT,
  SPECULAR_DEFAULT,
  TONE_DEFAULT,
  TOOLTIP_POSITION_DEFAULT,
  VARIANT_DEFAULT,
  VIBRANCY_DEFAULT,
} from "./toggleStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is this page's claim about a 457-line component, so it is tested as a
 * claim: a Toggle at rest asks for one thing — a name — every attribute that appears is
 * a row of the API table, and nothing the component decides for itself (the `role` it
 * sets, the `data-*` it stamps, the `peer-*` classes that make the track light up)
 * leaks into the tag a reader is handed.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of toggleConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(toggleConfig, state);
  return toggleCode({ state, data: {}, h });
};

/** The `<Toggle …>` tag itself, so the wrapper's markup cannot read as its own. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<Toggle");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<Toggle".length;
  let depth = 0;
  for (let index = head; index < tag.length; index += 1) {
    const char = tag[index];
    if (char === "{") depth += 1;
    else if (char === "}") depth -= 1;
    else if (char === ">" && depth === 0) return tag.slice(0, index + 1);
  }
  throw new Error(`no closing > in ${tag}`);
};

/** Attribute names on the opening tag, braced- and quote-aware. */
const attributes = (code: string): string[] => {
  const tag = openingTag(code);
  const names: string[] = [];
  let depth = 0;
  let quote = "";
  let token = "";
  let precededBySpace = true;
  const push = () => {
    if (token && precededBySpace && /^[A-Za-z][A-Za-z0-9-]*$/.test(token)) {
      names.push(token);
    }
    token = "";
  };
  for (let index = 0; index < tag.length; index += 1) {
    const char = tag[index];
    if (quote) {
      if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "{") {
      push();
      depth += 1;
      continue;
    }
    if (char === "}") {
      push();
      depth -= 1;
      continue;
    }
    if (depth === 0 && /[A-Za-z0-9-]/.test(char)) {
      token += char;
      continue;
    }
    if (depth === 0 && char === "=") {
      push();
      continue;
    }
    if (depth === 0 && /\s/.test(char)) {
      push();
      precededBySpace = true;
      continue;
    }
    precededBySpace = false;
  }
  push();
  return names;
};

/** The props the API table vouches for, including the rows that share a line. */
const documented = (): Set<string> => {
  const names = new Set<string>();
  for (const prop of TOGGLE_PROPS) {
    if (prop.name.startsWith("…")) continue;
    for (const part of prop.name.split(" / ")) names.add(part.trim());
  }
  return names;
};

/** One state per lever, so "nothing undocumented" is said about every control. */
const EVERY_STATE: Array<[string, Partial<PlaygroundState>]> = [
  ["variant soft", { variant: "soft" }],
  ["variant glass", { variant: "glass" }],
  ["size xs", { size: "xs" }],
  ["size xl", { size: "xl" }],
  ["padding none", { padding: "none" }],
  ["padding xl", { padding: "xl" }],
  ["label first", { alignLabel: "left" }],
  ["full width", { fullWidth: true }],
  ["tone emerald", { tone: "emerald" }],
  ["legacy colour", { tone: "emerald", legacyColor: true }],
  ["no label", { label: "" }],
  ["description", { description: DESCRIPTION_EXAMPLE }],
  ["inline description", { description: DESCRIPTION_EXAMPLE, descriptionPlacement: "inline" }],
  ["icon on", { iconOn: "Sun" }],
  ["icon off", { iconOff: "Moon" }],
  ["both icons", { iconOn: "Sun", iconOff: "Moon" }],
  ["starts on", { defaultChecked: true }],
  ["controlled", { controlled: true }],
  ["disabled", { disabled: true }],
  ["read only", { readOnly: true }],
  ["tooltip", { tooltip: "One email a day, no more" }],
  ["tooltip below", { tooltip: "One email a day, no more", tooltipPosition: "bottom" }],
  ["glass", { glass: true }],
  ["vibrant glass", { glass: true, vibrancy: "high" }],
  ["clear glass", { glass: true, glassOpacity: "clear" }],
  ["halo glass", { glass: true, specularMode: "halo" }],
];

/** Everything at once: long enough that the tag wraps, so bare flags print on a line. */
const HEAVY: Partial<PlaygroundState> = {
  variant: "outline",
  size: "lg",
  padding: "lg",
  alignLabel: "left",
  fullWidth: true,
  tone: "emerald",
  description: DESCRIPTION_EXAMPLE,
  descriptionPlacement: "inline",
  iconOn: "Sun",
  iconOff: "Moon",
  defaultChecked: true,
  disabled: true,
  readOnly: true,
  tooltip: "One email a day, no more",
  tooltipPosition: "bottom",
  glass: true,
  vibrancy: "high",
  glassOpacity: "clear",
  specularMode: "halo",
};

describe("toggle snippet", () => {
  it("asks for one thing at rest — the name — and nothing else", () => {
    const code = snippet();
    expect(attributes(code)).toEqual(["label"]);
    expect(code).toContain(`label="${LABEL_DEFAULT}"`);
    expect(code).toContain('import { Toggle } from "@cjlapao/ui-kit";');
    expect(code).toContain("<Toggle");
    expect(code).toContain("/>");
  });

  it("does not print the documented defaults", () => {
    const code = snippet();
    for (const [name, value] of [
      ["variant", VARIANT_DEFAULT],
      ["size", SIZE_DEFAULT],
      ["padding", PADDING_DEFAULT],
      ["alignLabel", ALIGN_DEFAULT],
      ["descriptionPlacement", PLACEMENT_DEFAULT],
      ["tone", TONE_DEFAULT],
      ["vibrancy", VIBRANCY_DEFAULT],
      ["glassOpacity", GLASS_OPACITY_DEFAULT],
      ["specularMode", SPECULAR_DEFAULT],
      ["tooltipPosition", TOOLTIP_POSITION_DEFAULT],
    ] as const) {
      expect(code, `${name}=${value}`).not.toContain(`${name}="${value}"`);
    }
    expect(code).not.toContain("defaultChecked");
    expect(code).not.toContain("disabled");
    expect(code).not.toContain("readOnly");
    expect(code).not.toContain("fullWidth");
  });

  it("prints a decision for each of them once it is made", () => {
    expect(snippet({ variant: "soft" })).toContain('variant="soft"');
    expect(snippet({ size: "xs" })).toContain('size="xs"');
    expect(snippet({ padding: "none" })).toContain('padding="none"');
    expect(snippet({ alignLabel: "left" })).toContain('alignLabel="left"');
    expect(snippet({ tone: "emerald" })).toContain('tone="emerald"');
  });

  it("spells the colour the deprecated way when asked to", () => {
    const legacy = snippet({ tone: "emerald", legacyColor: true });
    expect(legacy).toContain('color="emerald"');
    expect(legacy).not.toContain("tone=");
  });

  it("prints a bare flag, never `={true}`", () => {
    const code = snippet(HEAVY);
    expect(code).toContain("defaultChecked\n");
    expect(code).toContain("fullWidth\n");
    expect(code).toContain("disabled\n");
    expect(code).toContain("readOnly\n");
    expect(code).toContain("glass\n");
    expect(code).not.toContain("={true}");
  });

  it("keeps the deprecated `glass` a different claim from the variant", () => {
    expect(snippet({ glass: true })).toContain("glass />");
    expect(snippet({ glass: true })).not.toContain('variant="glass"');
    expect(snippet({ variant: "glass" })).toContain('variant="glass"');
    expect(snippet({ variant: "glass" })).not.toContain("glass />");
  });

  it("hides the knobs that belong to a surface the reader has not asked for", () => {
    expect(snippet({ vibrancy: "high" })).not.toContain("vibrancy");
    expect(snippet({ glassOpacity: "clear" })).not.toContain("glassOpacity");
    expect(snippet({ specularMode: "halo" })).not.toContain("specularMode");
    expect(snippet({ tooltipPosition: "bottom" })).not.toContain("tooltipPosition");
    expect(snippet({ descriptionPlacement: "inline" })).not.toContain(
      "descriptionPlacement",
    );
    // …and shows them the moment the thing they belong to exists.
    expect(snippet({ glass: true, specularMode: "halo" })).toContain(
      'specularMode="halo"',
    );
    expect(snippet({ tooltip: "Tip", tooltipPosition: "bottom" })).toContain(
      'tooltipPosition="bottom"',
    );
    expect(
      snippet({ description: DESCRIPTION_EXAMPLE, descriptionPlacement: "inline" }),
    ).toContain('descriptionPlacement="inline"');
  });

  it("pairs a controlled switch with the state it needs", () => {
    const code = snippet({ controlled: true });
    expect(code).toContain("checked={isOn}");
    expect(code).toContain("onChange={(event) => setIsOn(event.target.checked)}");
    expect(code).toContain("const [isOn, setIsOn] = useState(false);");
    expect(code).toContain('import { useState } from "react";');
    // …and does not seed a switch whose state somebody else owns.
    expect(code).not.toContain("defaultChecked");
  });

  it("treats `defaultChecked` as the uncontrolled seed it is", () => {
    expect(snippet({ defaultChecked: true })).toContain("defaultChecked />");
    expect(snippet({ defaultChecked: true, controlled: true })).not.toContain(
      "defaultChecked",
    );
  });

  it("quotes the caller's strings and nothing else", () => {
    expect(snippet({ description: DESCRIPTION_EXAMPLE })).toContain(
      `description="${DESCRIPTION_EXAMPLE}"`,
    );
    expect(snippet({ iconOn: "Sun", iconOff: "Moon" })).toContain('iconOn="Sun"');
    expect(snippet({ iconOn: "Sun", iconOff: "Moon" })).toContain('iconOff="Moon"');
    expect(snippet({ iconOn: "none" })).not.toContain("iconOn");
  });

  it("prints the label even at its example value, because it is the name", () => {
    expect(snippet()).toContain(`label="${LABEL_DEFAULT}"`);
    expect(snippet({ label: "  " })).not.toContain("label=");
  });

  it("says nothing the component decides for itself", () => {
    const code = snippet(HEAVY);
    for (const leak of [
      "data-variant",
      "data-glass",
      "aria-hidden",
      "aria-describedby",
      "role=",
      'type="checkbox"',
      "peer-",
      "sr-only",
      "backdrop-blur",
      "translate-x",
      "htmlFor",
      "useId",
    ]) {
      expect(code, leak).not.toContain(leak);
    }
  });

  it("keeps the attributes in the order the config lists them", () => {
    expect(attributes(snippet(HEAVY))).toEqual([
      "variant",
      "size",
      "padding",
      "alignLabel",
      "fullWidth",
      "tone",
      "label",
      "description",
      "descriptionPlacement",
      "iconOn",
      "iconOff",
      "defaultChecked",
      "disabled",
      "readOnly",
      "tooltip",
      "tooltipPosition",
      "glass",
      "vibrancy",
      "glassOpacity",
      "specularMode",
    ]);
  });

  it("prints nothing the API table does not vouch for, in every state", () => {
    const rows = documented();
    const every: Array<[string, Partial<PlaygroundState>]> = [
      ...EVERY_STATE,
      ["everything", HEAVY],
    ];
    for (const [name, changes] of every) {
      for (const attribute of attributes(snippet(changes))) {
        expect(rows.has(attribute), `${name} prints ${attribute}`).toBe(true);
      }
    }
  });

  it("documents every prop the config is allowed to write", () => {
    const rows = documented();
    for (const field of toggleConfig.fields) {
      if (!field.prop) continue;
      expect(rows.has(field.prop), `${field.id} writes ${field.prop}`).toBe(true);
    }
  });

  it("pins each knob to the component's own default", () => {
    const byId = new Map(toggleConfig.fields.map((f) => [f.id, f]));
    const pins: Record<string, string> = {
      variant: VARIANT_DEFAULT,
      size: SIZE_DEFAULT,
      padding: PADDING_DEFAULT,
      alignLabel: ALIGN_DEFAULT,
      descriptionPlacement: PLACEMENT_DEFAULT,
      vibrancy: VIBRANCY_DEFAULT,
      glassOpacity: GLASS_OPACITY_DEFAULT,
      specularMode: SPECULAR_DEFAULT,
      tooltipPosition: TOOLTIP_POSITION_DEFAULT,
    };
    for (const [id, value] of Object.entries(pins)) {
      const field = byId.get(id);
      expect(field, id).toBeDefined();
      expect(field?.default, id).toBe(value);
    }
    for (const id of ["fullWidth", "disabled", "readOnly", "glass", "defaultChecked"]) {
      expect(byId.get(id)?.default, id).toBe(false);
    }
  });

  it("gives the scratch lever no control and no printed trace", () => {
    const code = snippet({ report: "true" });
    expect(code).not.toContain("report");
    expect(toggleConfig.fields.find((f) => f.id === "report")?.when?.({} as PlaygroundState)).toBe(
      false,
    );
  });

  it("names only Toggle", () => {
    const code = snippet(HEAVY);
    expect(code.match(/import \{[^}]+\} from "@cjlapao\/ui-kit";/g)).toEqual([
      'import { Toggle } from "@cjlapao/ui-kit";',
    ]);
  });

  it("wraps the tag rather than printing a wall of attributes", () => {
    const code = snippet(HEAVY);
    expect(openingTag(code).includes("\n")).toBe(true);
    expect(code).toContain("export default function Demo() {");
    expect(code).toMatch(/return \(\n\s+<Toggle/);
  });
});
