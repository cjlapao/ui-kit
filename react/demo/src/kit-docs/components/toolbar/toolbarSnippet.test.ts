import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { toolbarConfig } from "./toolbarPlayground";
import { toolbarCode } from "./ToolbarPlayground";
import { TOOLBAR_PROPS } from "./ToolbarPage";
import { DEFAULT_ARIA_LABEL } from "./toolbarStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is the docs' claim about `Toolbar.tsx`, so it gets tested like a
 * claim: at rest the bar must print only what the component does not already do
 * for itself, every control that changes something must be legible in the tag,
 * and no control may speak where the component ignores it.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of toolbarConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(toolbarConfig, state);
  return toolbarCode({ state, data: {}, h });
};

/** The `<Toolbar …>` tag itself, so assertions cannot hit a fixture's props. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<Toolbar");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<Toolbar".length;
  let depth = 0;
  for (let index = head; index < tag.length; index += 1) {
    const char = tag[index];
    if (char === "{") depth += 1;
    else if (char === "}") depth -= 1;
    else if (char === ">" && depth === 0) return tag.slice(0, index + 1);
  }
  throw new Error(`no closing > in ${tag}`);
};

/**
 * Attribute names on the opening tag, read by a scanner that knows about JSX
 * braces and string literals. A flat regex dive would find the `className` of
 * an `Input` inside `start={SEARCH}` and report it as the bar's own.
 */
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
    push();
    precededBySpace = char === " ";
  }
  return names.filter((name) => name !== "Toolbar");
};

/** Every prop the page documents, spread regions included. */
const documented = (): Set<string> => {
  const names = new Set<string>();
  for (const row of TOOLBAR_PROPS) {
    for (const part of row.name.split("/")) {
      const name = part.trim();
      if (name.startsWith("…")) {
        // The div pass-through row vouches for the naming props the printer uses.
        names.add("aria-label");
        continue;
      }
      names.add(name);
    }
  }
  return names;
};

describe("Toolbar snippet", () => {
  it("prints the regions and the name, and nothing the component defaults for free", () => {
    expect(attributes(snippet())).toEqual([
      "start",
      "center",
      "end",
      "aria-label",
    ]);
  });

  it("hoists each group you keep, under the name the tag points at", () => {
    const code = snippet();
    expect(code).toContain("const START = (<>");
    expect(code).toContain('<IconButton icon="Add" variant="ghost" srLabel="Add" />');
    expect(code).toContain("const SEARCH = (<Input");
    expect(code).toContain("const END = (<Button");
    expect(code).toContain("start={START}");
    expect(code).toContain("center={SEARCH}");
    expect(code).toContain("end={END}");
    // The notes are part of the claim: the groups stay in the DOM.
    expect(code).toContain("never collapses an empty one away");
  });

  it("imports only the components the surviving groups use", () => {
    expect(snippet({ start: false, center: false })).toContain(
      'import { Button, Toolbar } from "@cjlapao/ui-kit";',
    );
    // A bar with nothing in it still imports the bar, and only the bar.
    expect(
      snippet({ start: false, center: false, end: false, extra: false }),
    ).toContain('import { Toolbar } from "@cjlapao/ui-kit";');
    expect(snippet()).toContain(
      'import { Button, IconButton, Input, Toolbar } from "@cjlapao/ui-kit";',
    );
  });

  it("prints a name it was given, and none when the field is emptied", () => {
    expect(openingTag(snippet())).toContain(`aria-label="${DEFAULT_ARIA_LABEL}"`);
    expect(attributes(snippet({ ariaLabel: "" }))).not.toContain("aria-label");
    expect(openingTag(snippet({ ariaLabel: "  Filters  " }))).toContain(
      'aria-label="Filters"',
    );
  });

  it("is self-closing when the reader kept nothing", () => {
    const code = snippet({
      start: false,
      center: false,
      end: false,
      extra: false,
      ariaLabel: "",
    });
    expect(openingTag(code)).toBe("<Toolbar />");
    expect(code).not.toContain("const START");
  });

  it("keeps the fourth group as a child of its own const", () => {
    const code = snippet({ extra: true });
    expect(code).toContain("const EXTRA = (<Button");
    expect(openingTag(code)).not.toContain("children");
    expect(code).toMatch(/\{EXTRA\}\s*\n\s*<\/Toolbar>/);
    expect(snippet()).not.toContain("const EXTRA");
  });

  it("stays quiet on the four surface props that match the component", () => {
    // :93-96 destructures elevated / DEFAULT_SURFACE_TONE / xs / DEFAULT_SURFACE_CORNER.
    for (const name of ["variant", "tone", "padding", "corner"]) {
      expect(attributes(snippet())).not.toContain(name);
    }
    expect(attributes(snippet({ variant: "outlined" }))).toContain("variant");
    expect(attributes(snippet({ padding: "md" }))).toContain("padding");
    expect(attributes(snippet({ corner: "rounded-xl" }))).toContain("corner");
    expect(attributes(snippet({ variant: "none", tone: "violet" }))).toContain("tone");
  });

  it("hides the tone swatches where there is no tint to paint", () => {
    // :141-143 (elevated) and :126-127 (default) never read the palette.
    for (const variant of ["elevated", "default"]) {
      // Neither branch reads the palette, so the tone stays in the controls.
      const printed = attributes(snippet({ variant, tone: "violet" }));
      expect(printed).not.toContain("tone");
    }
    // Only one of the two is off :93's default, so only that one is printed.
    expect(attributes(snippet({ variant: "default" }))).toContain("variant");
    expect(attributes(snippet({ variant: "tonal", tone: "violet" }))).toContain(
      "tone",
    );
  });

  it("speaks for vibrancy and the glass fill on liquid-glass only", () => {
    // :133-134 — the one branch that reads them.
    const quiet = attributes(snippet({ variant: "subtle", vibrancy: "high" }));
    expect(quiet).not.toContain("vibrancy");
    expect(quiet).not.toContain("glassOpacity");

    const atRest = attributes(snippet({ variant: "liquid-glass" }));
    expect(atRest).not.toContain("vibrancy"); // "medium" is :97's own default
    expect(atRest).not.toContain("glassOpacity");

    const loud = attributes(
      snippet({ variant: "liquid-glass", vibrancy: "high", glassOpacity: "clear" }),
    );
    expect(loud).toContain("vibrancy");
    expect(loud).toContain("glassOpacity");
  });

  it("offers transparency only where an alpha fill exists", () => {
    const code = snippet({ variant: "tonal", tone: "indigo", transparency: "medium" });
    expect(openingTag(code)).toContain('transparency="medium"');
    // "inherit" is the docs' spelling for "the variant decides" (:99 has none).
    expect(
      attributes(snippet({ variant: "tonal", tone: "indigo" })),
    ).not.toContain("transparency");
    // No `/alpha` in the class list → the resolver returns it untouched.
    expect(
      attributes(snippet({ variant: "elevated", transparency: "high" })),
    ).not.toContain("transparency");
    expect(
      attributes(snippet({ variant: "subtle", tone: "none", transparency: "low" })),
    ).not.toContain("transparency");
  });

  it("prints className trimmed, and not at all when blank", () => {
    expect(attributes(snippet({ className: "   " }))).not.toContain("className");
    expect(openingTag(snippet({ className: " mt-2 " }))).toContain(
      'className="mt-2"',
    );
  });

  it("documents every attribute it prints, and prints nothing it does not", () => {
    const names = documented();
    const states: Partial<PlaygroundState>[] = [
      {},
      { variant: "liquid-glass", tone: "indigo", vibrancy: "high", glassOpacity: "clear" },
      { variant: "tonal", tone: "teal", transparency: "low", padding: "lg" },
      { variant: "outlined", corner: "none", className: "w-full" },
      { variant: "default", tone: "rose", transparency: "medium" },
      { variant: "none", tone: "amber", padding: "none", corner: "rounded-4xl" },
      { start: false, center: false, extra: true, ariaLabel: "Document actions" },
      { start: false, center: false, end: false, extra: false, ariaLabel: "" },
    ];
    for (const state of states) {
      for (const name of attributes(snippet(state))) {
        expect(names.has(name), `${name} printed but undocumented`).toBe(true);
      }
    }
  });

  it("never prints the two props the component keeps for itself", () => {
    // `{...rest}` sits before role and className (:149-151) — role is fixed,
    // and className can only ever be merged, so neither is a lever here.
    for (const state of [{}, { variant: "glass", tone: "sky" }] as Partial<PlaygroundState>[]) {
      const printed = attributes(snippet(state));
      expect(printed).not.toContain("role");
      expect(printed).not.toContain("style");
      expect(printed).not.toContain("children");
    }
  });

  it("has a config prop for every documented surface prop", () => {
    const configurable = new Set(
      toolbarConfig.fields.map((field) => field.prop ?? field.id),
    );
    for (const name of [
      "variant",
      "tone",
      "padding",
      "corner",
      "vibrancy",
      "glassOpacity",
      "transparency",
      "className",
    ]) {
      expect(configurable.has(name), `${name} is documented but not adjustable`).toBe(
        true,
      );
    }
  });

  it("keeps the region props out of the tag when their toggle is off", () => {
    for (const id of ["start", "center", "end"] as const) {
      const printed = attributes(snippet({ [id]: false }));
      expect(printed).not.toContain(id);
      expect(snippet({ [id]: false })).not.toContain(`const ${id.toUpperCase()} =`);
    }
  });
});
