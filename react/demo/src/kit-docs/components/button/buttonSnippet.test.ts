import { describe, expect, it } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { buttonConfig } from "./buttonPlayground";
import { buttonCode } from "./ButtonPlayground";
import { BUTTON_PROPS } from "./ButtonPage";
import { COUNT_TEXT } from "./buttonFixture";
import {
  ARIA_LABEL_EXAMPLE,
  COLOR_DEFAULT,
  GLASS_OPACITY_DEFAULT,
  ICON_COLOR_EXAMPLE,
  LABEL_DEFAULT,
  SIZE_DEFAULT,
  SPECULAR_DEFAULT,
  TOOLTIP_DEFAULT,
  TOOLTIP_DELAY_DEFAULT,
  TOOLTIP_POSITION_DEFAULT,
  TYPE_DEFAULT,
  VARIANT_DEFAULT,
  VIBRANCY_DEFAULT,
  WEIGHT_DEFAULT,
} from "./buttonStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is this page's claim about a 370-line component, so it is tested as a
 * claim: a Button at rest asks for nothing — the tag has no attributes at all — every
 * attribute that does appear is a row of the API table, and nothing the component
 * decides for itself (the `data-*` it stamps, the `aria-busy` it keeps, the spinner it
 * swaps in) leaks into the tag a reader is handed.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of buttonConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(buttonConfig, state);
  return buttonCode({ state, data: {}, h });
};

/** The `<Button …>` tag itself, so the hoisted `LABEL`'s props cannot read as its own. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<Button");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<Button".length;
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
  for (const prop of BUTTON_PROPS) {
    if (prop.name.startsWith("…")) continue;
    for (const part of prop.name.split(" / ")) names.add(part.trim());
  }
  return names;
};

/** One state per lever, so "nothing undocumented" is said about every control. */
const EVERY_STATE: Array<[string, Partial<PlaygroundState>]> = [
  ["variant soft", { variant: "soft" }],
  ["variant link", { variant: "link" }],
  ["variant icon", { variant: "icon" }],
  ["variant glass", { variant: "glass" }],
  ["size xs", { size: "xs" }],
  ["weight bold", { weight: "bold" }],
  ["full width", { fullWidth: true }],
  ["icon only", { iconOnly: true }],
  ["colour emerald", { color: "emerald" }],
  ["accent color rose", { accentColor: "rose" }],
  ["accent", { accent: true }],
  ["active", { active: true }],
  ["active with accent color", { active: true, accentColor: "rose" }],
  ["no label", { label: "" }],
  ["rich label", { richLabel: true }],
  ["leading icon", { leadingIcon: "Search" }],
  ["trailing icon", { trailingIcon: "ArrowDown" }],
  ["icon color", { iconColor: ICON_COLOR_EXAMPLE }],
  ["submit", { type: "submit" }],
  ["reset", { type: "reset" }],
  ["aria-label", { ariaLabel: ARIA_LABEL_EXAMPLE }],
  ["popup open", { open: true }],
  ["loading", { loading: true }],
  ["disabled", { disabled: true }],
  ["wired", { onClick: true }],
  ["in a form", { inForm: true }],
  ["tooltip", { tooltip: TOOLTIP_DEFAULT }],
  ["tooltip bottom", { tooltip: TOOLTIP_DEFAULT, tooltipPosition: "bottom" }],
  [
    "tooltip instant",
    { tooltip: TOOLTIP_DEFAULT, tooltipDelay: 0 },
  ],
  ["tooltip suppressed", { tooltip: TOOLTIP_DEFAULT, tooltipDisabled: true }],
  ["glass", { glass: true }],
  ["glass with specular", { glass: true, specularMode: "halo" }],
  ["glass vibrancy", { glass: true, vibrancy: "high" }],
  ["glass opacity clear", { glass: true, glassOpacity: "clear" }],
  ["everything", {
    variant: "outline",
    iconOnly: true,
    size: "lg",
    weight: "semibold",
    fullWidth: true,
    color: "emerald",
    accentColor: "rose",
    accent: true,
    active: true,
    leadingIcon: "Download",
    trailingIcon: "Rocket",
    iconColor: ICON_COLOR_EXAMPLE,
    type: "submit",
    ariaLabel: ARIA_LABEL_EXAMPLE,
    open: true,
    loading: true,
    onClick: true,
    inForm: true,
    tooltip: TOOLTIP_DEFAULT,
    tooltipPosition: "left",
    tooltipDelay: 200,
    tooltipDisabled: true,
    glass: true,
    vibrancy: "high",
    glassOpacity: "clear",
    specularMode: "classic",
  }],
];

/** Every lever off its default — the state long enough that the tag must wrap. */
const HEAVY = EVERY_STATE[EVERY_STATE.length - 1][1];

describe("ButtonPlayground snippet", () => {
  it("asks for nothing at all when every lever is where the component put it", () => {
    expect(attributes(snippet())).toEqual([]);
    expect(openingTag(snippet())).toContain(`<Button>`);
  });

  it("prints the label as the children, which are not an attribute", () => {
    expect(snippet()).toContain(`>${LABEL_DEFAULT}<`);
    expect(snippet()).not.toContain("children=");
    // An empty label is still a label: the pair is there, empty (:268-273).
    expect(snippet({ label: "" })).toContain(`></Button>`);
  });

  it("quotes a label that contains markup characters instead of printing them raw", () => {
    expect(snippet({ label: "Deploy {build}" })).toContain(`>{"Deploy {build}"}<`);
  });

  it("keeps every documented default out of the tag", () => {
    const atRest = snippet({
      variant: VARIANT_DEFAULT,
      color: COLOR_DEFAULT,
      size: SIZE_DEFAULT,
      weight: WEIGHT_DEFAULT,
      type: TYPE_DEFAULT,
      vibrancy: VIBRANCY_DEFAULT,
      glassOpacity: GLASS_OPACITY_DEFAULT,
      specularMode: SPECULAR_DEFAULT,
      tooltipPosition: TOOLTIP_POSITION_DEFAULT,
      tooltipDelay: TOOLTIP_DELAY_DEFAULT,
    });
    expect(attributes(atRest)).toEqual([]);
    for (const name of [
      "variant",
      "color",
      "size",
      "weight",
      "type",
      "glass",
      "vibrancy",
      "glassOpacity",
      "specularMode",
      "tooltipPosition",
      "tooltipDelay",
      "loading",
      "disabled",
    ]) {
      expect(atRest).not.toContain(`${name}=`);
    }
  });

  it("keeps the HTML submit default home (:141,:300-303)", () => {
    expect(snippet()).not.toContain("type=");
    expect(snippet({ type: "submit" })).toContain('type="submit"');
    expect(snippet({ type: "reset" })).toContain('type="reset"');
  });

  it("prints the seven flags bare, not as ={true}", () => {
    const heavy = snippet(HEAVY);
    for (const name of [
      "fullWidth",
      "accent",
      "active",
      "glass",
      "loading",
      "tooltipDisabled",
    ]) {
      expect(heavy).toContain(`${name}\n`);
      expect(heavy).not.toContain(`${name}={true}`);
    }
    expect(heavy).toContain("iconOnly\n");
  });

  it("prints aria-expanded as the expression a caller writes, never a string (:211)", () => {
    expect(snippet({ open: true })).toContain("aria-expanded={true}");
    expect(snippet({ open: true })).not.toContain('aria-expanded="true"');
    expect(snippet({ open: false })).not.toContain("aria-expanded");
  });

  it("prints an icon by name and prints nothing for the sentinel", () => {
    expect(snippet({ leadingIcon: "Search" })).toContain('leadingIcon="Search"');
    expect(snippet({ trailingIcon: "Rocket" })).toContain('trailingIcon="Rocket"');
    expect(snippet({ leadingIcon: "none", trailingIcon: "none" })).not.toContain(
      "Icon=",
    );
    expect(snippet({ leadingIcon: "none" })).not.toContain("none");
  });

  it("tints the glyph with a raw colour, which is what iconColor is (:70,:286-294)", () => {
    expect(snippet({ iconColor: ICON_COLOR_EXAMPLE })).toContain(
      `iconColor="${ICON_COLOR_EXAMPLE}"`,
    );
    expect(snippet({ iconColor: "   " })).not.toContain("iconColor");
  });

  it("places and times a tooltip only once there is one to place (:330-341)", () => {
    expect(snippet({ tooltipPosition: "bottom" })).not.toContain("tooltipPosition");
    expect(snippet({ tooltipDelay: 0 })).not.toContain("tooltipDelay");
    expect(snippet({ tooltipDisabled: true })).not.toContain("tooltipDisabled");
    const placed = snippet({
      tooltip: TOOLTIP_DEFAULT,
      tooltipPosition: "bottom",
      tooltipDelay: 200,
      tooltipDisabled: true,
    });
    expect(placed).toContain(`tooltip="${TOOLTIP_DEFAULT}"`);
    expect(placed).toContain('tooltipPosition="bottom"');
    expect(placed).toContain("tooltipDelay={200}");
    expect(placed).toContain("tooltipDisabled\n");
  });

  it("treats variant=\"glass\" as glass, and prints the glass knobs only then (:189)", () => {
    const byVariant = snippet({ variant: "glass", specularMode: "halo" });
    expect(byVariant).toContain('variant="glass"');
    expect(byVariant).not.toContain("glass\n");
    expect(byVariant).toContain('specularMode="halo"');
    // Without a glass surface the specular control is hidden, so it prints nothing.
    expect(snippet({ specularMode: "halo" })).not.toContain("specularMode");
    expect(snippet({ vibrancy: "high" })).not.toContain("vibrancy");
    const byProp = snippet(HEAVY);
    expect(byProp).toContain("glass\n");
    expect(byProp).toContain('vibrancy="high"');
    expect(byProp).toContain('glassOpacity="clear"');
  });

  it("hoists children that are not a string, and imports what they mount", () => {
    const code = snippet({ richLabel: true });
    expect(code).toContain(`const LABEL = <>`);
    expect(code).toContain(`${COUNT_TEXT}</Pill>`);
    expect(code.indexOf("const LABEL")).toBeLessThan(
      code.indexOf("export default function Demo"),
    );
    expect(code).toContain(">{LABEL}<");
    expect(code).toContain('import { Button, Pill } from "@cjlapao/ui-kit";');
  });

  it("prints the form it is sitting in, and the state that remembers a submit", () => {
    const code = snippet({ inForm: true });
    expect(code).toContain("<form");
    expect(code).toContain("onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}");
    expect(code).toContain("const [submitted, setSubmitted] = useState(false);");
    expect(code).toContain('import { useState } from "react";');
  });

  it("prints the click handler it wires, in the shape the reader can copy (:311)", () => {
    const code = snippet({ onClick: true });
    expect(code).toContain("onClick={() => setClicked(true)}");
    expect(code).toContain("const [clicked, setClicked] = useState(false);");
    expect(code).not.toContain("onClick\n");
  });

  it("keeps what the component decides for itself out of the reader's tag", () => {
    const heavy = snippet(HEAVY);
    for (const leak of [
      "data-variant",
      "data-color",
      "data-size",
      "data-glass",
      "aria-busy",
      "aria-hidden",
      "aria-describedby",
      "disabled:opacity-50",
      "sr-only",
    ]) {
      expect(heavy).not.toContain(leak);
    }
  });

  it("names the kit components it actually mounts", () => {
    expect(snippet()).toContain('import { Button } from "@cjlapao/ui-kit";');
    expect(snippet()).not.toContain("Pill");
  });

  it("prints attributes in the order the config declares them", () => {
    const printed = attributes(snippet(HEAVY));
    const declared = buttonConfig.fields
      .filter(
        (field) =>
          field.prop !== null &&
          !(field.when && !field.when(seeds())) &&
          !(typeof seeds()[field.id] === "string" && (seeds()[field.id] as string) === ""),
      )
      .map((field) => (field.prop ?? field.id) as string);
    // `glass` and the tooltip trio are printed by their own emits; the order test
    // only compares the names that both lists agree on.
    const shared = printed.filter((name) => declared.includes(name));
    expect(shared).toEqual(declared.filter((name) => printed.includes(name)));
  });

  it("documents every prop the config can print", () => {
    const rows = documented();
    for (const field of buttonConfig.fields) {
      if (field.prop === null || field.prop === undefined) continue;
      expect([...rows], `PropsTable is missing "${field.prop}"`).toContain(
        field.prop as string,
      );
    }
  });

  it("prints nothing that is not a row of the API table, in every state", () => {
    const rows = documented();
    for (const [name, changes] of EVERY_STATE) {
      for (const attribute of attributes(snippet(changes))) {
        expect(rows, `${name} prints an undocumented ${attribute}`).toContain(
          attribute,
        );
      }
    }
  });

  it("keeps the field defaults pinned to the lines they were read from", () => {
    const byId = new Map(buttonConfig.fields.map((field) => [field.id, field]));
    expect(byId.get("variant")?.default).toBe("solid");
    expect(byId.get("color")?.default).toBe("blue");
    expect(byId.get("size")?.default).toBe("md");
    expect(byId.get("weight")?.default).toBe("normal");
    expect(byId.get("type")?.default).toBe("button");
    expect(byId.get("vibrancy")?.default).toBe("medium");
    expect(byId.get("glassOpacity")?.default).toBe("frosted");
    expect(byId.get("specularMode")?.default).toBe("none");
    expect(byId.get("tooltipPosition")?.docDefault).toBe("top");
    expect(byId.get("tooltipDelay")?.docDefault).toBe(1000);
  });
});
