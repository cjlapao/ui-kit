import { describe, expect, it } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { pillCode, pillConfig } from "./pillPlayground";
import { PILL_PROPS } from "./PillPage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The printed tag is the page's claim about a component whose two elements
 * behave differently, so it is tested as a claim: at rest the tag carries
 * nothing, every attribute on it is a row of this page's own table, the workbench
 * levers (`locale`, `backdrop`) and the two report fields never reach it, and
 * none of the machinery the captions describe (the pulse class, the tone fill
 * classes, the focus ring, the `aria-hidden` overlay) is ever handed to the
 * reader as code.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of pillConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(pillConfig, state);
  return pillCode({ state, data: {}, h });
};

/** The `<Pill …>` / `<Pill … />` tag itself, so the wrapper cannot read as its own. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<Pill");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<Pill".length;
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

/** What this page's own table documents — an undocumented attribute is a lie. */
const documented = (): Set<string> => {
  const names = new Set<string>();
  for (const prop of PILL_PROPS) {
    if (prop.name.startsWith("…")) continue;
    for (const part of prop.name.split(" / ")) names.add(part.trim());
  }
  return names;
};

const field = (id: string) => {
  const found = pillConfig.fields.find((entry) => entry.id === id);
  if (!found) throw new Error(`no field "${id}" in the config`);
  return found;
};

/** One decision per knob — the states a reader can actually arrive at. */
const EVERY_STATE: Array<[string, Partial<PlaygroundState>]> = [
  ["solid", { variant: "solid" }],
  ["outline", { variant: "outline" }],
  ["glass", { variant: "glass" }],
  ["liquid glass", { variant: "liquid-glass" }],
  ["glass tuned", { variant: "liquid-glass", glassOpacity: "clear", vibrancy: "high" }],
  ["specular none", { variant: "liquid-glass", specularMode: "none" }],
  ["specular halo on glass", { variant: "glass", specularMode: "halo" }],
  ["emerald", { tone: "emerald" }],
  ["xs", { size: "xs" }],
  ["xl uppercase", { size: "xl", uppercase: true }],
  ["square", { corner: "none" }],
  ["leading icon", { icon: "Check" }],
  ["trailing icon", { trailingIcon: "ChevronDown" }],
  ["truncated", { maxWidth: 200 }],
  ["dot", { dot: true }],
  ["named dot", { dot: true, dotLabel: "Degraded" }],
  ["pulsing", { pulse: true }],
  ["pulsing but disabled", { pulse: true, disabled: true }],
  ["clickable", { onClick: true }],
  ["removable", { onRemove: true }],
  ["removable, named", { onRemove: true, removeLabel: "Remove filter" }],
  ["clickable and removable", { onClick: true, onRemove: true }],
  ["french", { locale: "fr", onRemove: true }],
  ["everything", {
    variant: "liquid-glass",
    tone: "fuchsia",
    size: "lg",
    corner: "sm",
    uppercase: true,
    icon: "Search",
    trailingIcon: "ChevronDown",
    maxWidth: 180,
    pulse: true,
    onClick: true,
    onRemove: true,
    removeLabel: "Drop",
    specularMode: "halo",
    locale: "de",
  }],
];

describe("pill snippet", () => {
  it("prints nothing but the label at rest", () => {
    const code = snippet();
    expect(openingTag(code)).toBe("<Pill>");
    expect(code).toContain("<Pill>Operational</Pill>");
    expect(code).toContain('import { Pill } from "@cjlapao/ui-kit";');
  });

  it("never prints a documented default onto the tag", () => {
    for (const name of ["variant", "tone", "size", "corner", "glassOpacity", "vibrancy"]) {
      expect(attributes(snippet({ variant: "glass" })), `${name} at its default`).not.toContain(
        name,
      );
    }
    for (const name of ["dot", "pulse", "uppercase", "disabled", "onClick", "onRemove"]) {
      expect(attributes(snippet()), `${name} off`).not.toContain(name);
    }
  });

  it("prints only attributes this page's table documents", () => {
    const rows = documented();
    for (const [name, changes] of EVERY_STATE) {
      for (const attribute of attributes(snippet(changes))) {
        expect(rows.has(attribute), `${name}: undocumented ${attribute}`).toBe(true);
      }
    }
  });

  it("keeps the tag's attributes in the order the props are declared", () => {
    const code = snippet({
      variant: "outline",
      tone: "amber",
      size: "lg",
      corner: "md",
      uppercase: true,
      icon: "Check",
      trailingIcon: "ChevronDown",
      maxWidth: 160,
      dot: true,
      dotLabel: "Degraded",
      pulse: true,
      onClick: true,
      onRemove: true,
      removeLabel: "Drop",
      disabled: true,
    });
    expect(attributes(code)).toEqual([
      "variant",
      "tone",
      "size",
      "corner",
      "uppercase",
      "icon",
      "trailingIcon",
      "maxWidth",
      "dot",
      "label",
      "pulse",
      "onClick",
      "onRemove",
      "removeLabel",
      "disabled",
    ]);
  });

  it("keeps the glass knobs out of the tag unless the variant is see-through", () => {
    expect(attributes(snippet({ glassOpacity: "clear", vibrancy: "high" }))).toEqual([]);
    const glass = snippet({ variant: "glass", glassOpacity: "clear", vibrancy: "high" });
    expect(attributes(glass)).toEqual(["variant", "glassOpacity", "vibrancy"]);
    expect(glass).toContain('glassOpacity="clear"');
    expect(glass).toContain('vibrancy="high"');
  });

  it("lets the variant answer for specularMode unless the reader overrides it", () => {
    // Both variants at their own default print no specularMode at all (:197-198).
    expect(attributes(snippet({ variant: "glass" }))).not.toContain("specularMode");
    expect(attributes(snippet({ variant: "liquid-glass" }))).not.toContain("specularMode");
    // "none" is a value, not the absence of one, and on liquid-glass it is not
    // the default either.
    const off = snippet({ variant: "liquid-glass", specularMode: "none" });
    expect(off).toContain('specularMode="none"');
    expect(snippet({ variant: "glass", specularMode: "halo" })).toContain(
      'specularMode="halo"',
    );
  });

  it("hands the label to the children, never to an attribute", () => {
    const code = snippet({ labelText: "Quarterly report" });
    expect(code).toContain(">Quarterly report</Pill>");
    expect(attributes(code)).not.toContain("label");
    expect(attributes(code)).not.toContain("children");
    // A label with markup characters in it stops being JSX text (:202-203).
    const braced = snippet({ labelText: "5 < 6 {now}" });
    expect(braced).toContain('{"5 < 6 {now}"}');
  });

  it("prints no children at all for a dot, which drops them (:99-103)", () => {
    const code = snippet({ dot: true, labelText: "Operational", icon: "Check" });
    expect(openingTag(code)).toMatch(/\/>$/);
    expect(code).not.toContain("Operational");
    expect(attributes(code)).toEqual(["dot"]);
    expect(field("dot").default).toBe(false);
  });

  it("asks for a dot name only while there is a dot", () => {
    const named = snippet({ dot: true, dotLabel: "Degraded" });
    expect(named).toContain('label="Degraded"');
    expect(field("dotLabel").prop).toBe("label");
    expect(field("dotLabel").when?.(seeds())).toBe(false);
    expect(field("dotLabel").when?.(Object.assign(seeds(), { dot: true }))).toBe(true);
    // Typed whitespace is no name.
    expect(snippet({ dot: true, dotLabel: "   " })).not.toContain("label=");
  });

  it("asks for a remove name only while there is a remove button", () => {
    expect(field("removeLabel").when?.(seeds())).toBe(false);
    expect(
      field("removeLabel").when?.(Object.assign(seeds(), { onRemove: true })),
    ).toBe(true);
    expect(snippet({ onRemove: true, removeLabel: "" })).not.toContain("removeLabel=");
    expect(snippet({ onRemove: true, removeLabel: "Remove filter" })).toContain(
      'removeLabel="Remove filter"',
    );
    // The catalog string is a fallback, so it is never printed as a value.
    expect(snippet({ onRemove: true })).not.toContain("kit.pill.remove");
  });

  it("prints a number as an expression, and no maxWidth at all when it is 0", () => {
    expect(snippet({ maxWidth: 200 })).toContain("maxWidth={200}");
    expect(snippet({ maxWidth: 200 })).not.toContain('maxWidth="200"');
    expect(attributes(snippet({ maxWidth: 0 }))).not.toContain("maxWidth");
  });

  it("prints an adornment as the registry name it is, not as markup", () => {
    expect(snippet({ icon: "Check" })).toContain('icon="Check"');
    expect(snippet({ trailingIcon: "ChevronDown" })).toContain('trailingIcon="ChevronDown"');
    expect(snippet({ icon: "None" })).not.toContain("icon=");
    expect(snippet({ icon: "Check" })).not.toContain("icon={");
  });

  it("gives the printed handlers the state they need to exist", () => {
    const clickable = snippet({ onClick: true });
    expect(clickable).toContain("onClick={() => setPinned(true)}");
    expect(clickable).toContain("const [pinned, setPinned] = useState(false);");
    expect(clickable).toContain('import { useState } from "react";');

    const removable = snippet({ onRemove: true });
    expect(removable).toContain("onRemove={() => setShown(false)}");
    expect(removable).toContain("const [shown, setShown] = useState(true);");

    const both = snippet({ onClick: true, onRemove: true });
    expect(both).toContain("const [pinned, setPinned] = useState(false);");
    expect(both).toContain("const [shown, setShown] = useState(true);");
    // An inert pill declares state it never uses — nothing is imported for it.
    expect(snippet()).not.toContain("useState");
  });

  it("prints the provider the preview is actually inside, and only then", () => {
    expect(snippet({ locale: "en", onRemove: true })).not.toContain("I18nProvider");
    const french = snippet({ locale: "fr", onRemove: true });
    expect(french).toContain('<I18nProvider locale="fr">');
    expect(french).toContain("import { Pill, I18nProvider } from");
    // The locale is context, not a prop: it never rides onto the pill itself.
    expect(openingTag(french)).not.toContain("locale");
    expect(field("locale").prop).toBeNull();
    expect(field("locale").emit?.("", seeds(), createEmitter(pillConfig, seeds()))).toBeNull();
  });

  it("keeps the workbench levers and the reports out of the code", () => {
    for (const id of ["locale", "backdrop", "clickReport", "removeReport"]) {
      const entry = field(id);
      expect(entry.prop, `${id} owns no prop`).toBeNull();
      expect(
        entry.emit?.("", seeds(), createEmitter(pillConfig, seeds())),
        `${id} prints nothing`,
      ).toBeNull();
    }
    const code = snippet({ backdrop: true, clickReport: "clicked", removeReport: "removed" });
    expect(code).not.toContain("backdrop");
    expect(code).not.toContain("clicked");
    expect(code).not.toContain("removed");
  });

  it("never leaks a class, a style or a focus ring into the snippet", () => {
    for (const [name, changes] of EVERY_STATE) {
      const code = snippet(changes);
      for (const leak of [
        "pill-pulse",
        "bg-blue-50",
        "text-blue-700",
        "rounded-full",
        "inline-flex",
        "ring-current",
        "focus-visible",
        "backdrop-blur",
        "aria-hidden",
        "opacity-50",
        "truncate",
        "uppercase tracking",
        "--pill-glow",
      ]) {
        expect(code.includes(leak), `${name}: leaked ${leak}`).toBe(false);
      }
    }
  });

  it("prints exactly one pill per state, and one import line", () => {
    for (const [name, changes] of EVERY_STATE) {
      const code = snippet(changes);
      expect((code.match(/<Pill[\s/>]/g) ?? []).length, `${name} printed two pills`).toBe(1);
      expect((code.match(/@cjlapao\/ui-kit/g) ?? []).length, `${name} import line`).toBe(1);
    }
  });

  it("wraps the tag when the attributes no longer fit", () => {
    const code = snippet({
      variant: "outline",
      tone: "rose",
      size: "xl",
      corner: "lg",
      icon: "Search",
      onRemove: true,
      removeLabel: "Remove the quarterly report filter entirely",
      maxWidth: 260,
    });
    expect(code).toMatch(/\n\s+variant="outline"/);
  });

  it("documents a row for every knob it prints and a spread for the rest", () => {
    const rows = PILL_PROPS.map((prop) => prop.name);
    for (const name of [
      "variant",
      "tone",
      "size",
      "corner",
      "uppercase",
      "icon",
      "trailingIcon",
      "maxWidth",
      "dot",
      "label",
      "pulse",
      "onClick",
      "onRemove",
      "removeLabel",
      "disabled",
      "glassOpacity",
      "vibrancy",
      "specularMode",
      "children",
      "className",
      "style",
    ]) {
      expect(rows, `${name} prints but has no row`).toContain(name);
    }
    const spread = PILL_PROPS.find((prop) => prop.name.startsWith("…"));
    expect(spread).toBeDefined();
    expect(String(spread?.type)).toContain("HTMLAttributes");
    expect(String(spread?.description)).toContain("spread");
  });

  it("carries a documented default only where the component documents one", () => {
    const withDocDefault = pillConfig.fields
      .filter((entry) => entry.docDefault !== undefined)
      .map((entry) => entry.id);
    expect(withDocDefault.sort()).toEqual(
      ["variant", "tone", "size", "corner", "glassOpacity", "vibrancy"].sort(),
    );
    // The three whose kit default is not a printable value govern themselves.
    for (const id of ["icon", "trailingIcon", "specularMode", "maxWidth", "dotLabel", "removeLabel"]) {
      expect(field(id).docDefault, `${id} has no printed default`).toBeUndefined();
      expect(field(id).emit, `${id} decides what it prints`).toBeDefined();
    }
  });

  it("offers one option per real value, from the kit's own lists", () => {
    const variant = field("variant");
    expect((variant.options ?? []).map((option) => option.value)).toEqual([
      "solid",
      "soft",
      "outline",
      "glass",
      "liquid-glass",
    ]);
    expect((field("corner").options ?? []).map((option) => option.value)).toEqual([
      "none",
      "sm",
      "md",
      "lg",
      "full",
    ]);
    expect((field("specularMode").options ?? []).map((option) => option.value)).toEqual([
      "default",
      "none",
      "classic",
      "halo",
    ]);
  });
});
