import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { pageHeaderConfig } from "./pageHeaderPlayground";
import { pageHeaderCode } from "./PageHeaderPlayground";
import { PAGEHEADER_PROPS } from "./PageHeaderPage";
import { DEFAULT_ARIA_LABEL } from "./pageHeaderStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is the docs' claim about `PageHeader.tsx`, so it is tested as a
 * claim: at rest the bar prints only what the component does not already do for
 * itself, every control that changes something is legible in the tag, and no
 * control speaks where the component ignores it — which on this page is most of
 * them, because five of the knobs are forwarded to a `Panel` that is not always
 * rendered (:143,:181-186).
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of pageHeaderConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(pageHeaderConfig, state);
  return pageHeaderCode({ state, data: {}, h });
};

/** The `<PageHeader …>` tag itself, so assertions cannot hit a fixture's props. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<PageHeader");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<PageHeader".length;
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
 * braces and string literals. A flat regex dive would find the `ariaLabel` of the
 * `Breadcrumb` inside `start={TRAIL}` and report it as the bar's own.
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
  return names.filter((name) => name !== "PageHeader");
};

/** Every prop the page documents. */
const documented = (): Set<string> => {
  const names = new Set<string>();
  for (const row of PAGEHEADER_PROPS) {
    const name = row.name.trim();
    if (name.startsWith("…")) {
      // The pass-through row vouches for the name the bar never invents itself.
      names.add("aria-label");
      continue;
    }
    names.add(name);
  }
  return names;
};

const EVERY_STATE: Partial<PlaygroundState>[] = [
  {},
  { variant: "liquid-glass", tone: "indigo", vibrancy: "high", glassOpacity: "clear", specularMode: "halo" },
  { variant: "tonal", tone: "teal", transparency: "medium", raisedSurface: true },
  { variant: "outlined", corner: "none", className: "w-full" },
  { variant: "default", tone: "rose", transparency: "high", raisedSurface: true },
  { variant: "floating", accentColor: "emerald", paddingTop: "lg", corner: "auto" },
  { variant: "floating-glass", accentColor: "violet", paddingRight: "sm", paddingBottom: "md" },
  { variant: "plain", tone: "amber", padding: "xl", corner: "rounded-4xl" },
  { variant: "subtle", tone: "none", transparency: "subtle" },
  { start: false, center: true, extra: true, ariaLabel: "Document actions" },
  { start: false, center: false, end: false, extra: false, ariaLabel: "" },
];

describe("Page Header snippet", () => {
  it("prints the two regions it was given, its name, and nothing else", () => {
    // :119 opens on "default", :121 on "none", the gutters inherit and the corner
    // sits on Panel's default — none of them is worth a line.
    expect(attributes(snippet())).toEqual(["start", "end", "aria-label"]);
  });

  it("hoists each group you keep, under the name the tag points at", () => {
    const code = snippet();
    expect(code).toContain("const TRAIL = (<>");
    expect(code).toContain("const ACTIONS = (<>");
    expect(code).toContain("<Breadcrumb");
    expect(code).toContain('ariaLabel="Playground breadcrumb"');
    expect(code).toContain('<IconButton icon="Search" variant="ghost" srLabel="Search" />');
    expect(code).toContain("start={TRAIL}");
    expect(code).toContain("end={ACTIONS}");
    // The notes are part of the claim: the three regions stay in the DOM.
    expect(code).toContain("never collapses an empty one away");
  });

  it("imports only the components the surviving groups use", () => {
    expect(snippet()).toContain(
      'import { Breadcrumb, Button, IconButton, PageHeader } from "@cjlapao/ui-kit";',
    );
    expect(snippet({ start: false, center: false })).toContain(
      'import { Button, IconButton, PageHeader } from "@cjlapao/ui-kit";',
    );
    expect(
      snippet({ start: false, center: false, end: false, extra: true }),
    ).toContain('import { Button, PageHeader } from "@cjlapao/ui-kit";');
    // A bar with nothing in it still imports the bar, and only the bar.
    expect(
      snippet({ start: false, center: false, end: false, extra: false }),
    ).toContain('import { PageHeader } from "@cjlapao/ui-kit";');
  });

  it("prints a name it was given, and none when the field is emptied", () => {
    // The component names nothing itself (:161 passes the caller's label through).
    expect(openingTag(snippet())).toContain(`aria-label="${DEFAULT_ARIA_LABEL}"`);
    expect(attributes(snippet({ ariaLabel: "" }))).not.toContain("aria-label");
    expect(openingTag(snippet({ ariaLabel: "  Document actions  " }))).toContain(
      'aria-label="Document actions"',
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
    expect(openingTag(code)).toBe("<PageHeader />");
    expect(code).not.toContain("const TRAIL");
  });

  it("keeps the fourth group as a child, not an attribute", () => {
    const code = snippet({ extra: true });
    expect(code).toContain("const EXTRA = (<Button");
    expect(openingTag(code)).not.toContain("children");
    expect(code).toMatch(/\{EXTRA\}\s*\n\s*<\/PageHeader>/);
    expect(snippet()).not.toContain("const EXTRA");
  });

  it("turns the centred group on and off like any other region", () => {
    expect(attributes(snippet({ center: true }))).toEqual([
      "start",
      "center",
      "end",
      "aria-label",
    ]);
    expect(snippet({ center: true })).toContain("const NOTE = (<span");
    expect(snippet({ center: true })).toContain("center={NOTE}");
  });

  it("stays silent on the variant it opens with", () => {
    expect(attributes(snippet())).not.toContain("variant");
    expect(attributes(snippet({ variant: "elevated" }))).toContain("variant");
    // `plain` is a real spelling (:22), and an off-default one.
    expect(openingTag(snippet({ variant: "plain" }))).toContain('variant="plain"');
    expect(openingTag(snippet({ variant: "floating-glass" }))).toContain(
      'variant="floating-glass"',
    );
  });

  it("hides the tone where no palette is read", () => {
    // Nothing outside the shared variants renders a Panel (:143,:181-186), and
    // `elevated` reads no palette even when it does (Panel.tsx:963-968).
    for (const variant of ["default", "floating", "floating-glass", "none", "plain", "elevated"]) {
      const printed = attributes(snippet({ variant, tone: "violet" }));
      expect(printed, variant).not.toContain("tone");
    }
    expect(attributes(snippet({ variant: "tonal", tone: "violet" }))).toContain(
      "tone",
    );
    expect(openingTag(snippet({ variant: "subtle", tone: "teal" }))).toContain(
      'tone="teal"',
    );
  });

  it("speaks for the three glass knobs on liquid-glass only", () => {
    // :59-62 forward them; Panel.tsx:1011-1012 is the only place they are spent.
    const quiet = attributes(
      snippet({ variant: "glass", vibrancy: "high", glassOpacity: "clear", specularMode: "halo" }),
    );
    expect(quiet).not.toContain("vibrancy");
    expect(quiet).not.toContain("glassOpacity");
    expect(quiet).not.toContain("specularMode");

    const atRest = attributes(snippet({ variant: "liquid-glass" }));
    expect(atRest).not.toContain("vibrancy");
    expect(atRest).not.toContain("glassOpacity");
    expect(atRest).not.toContain("specularMode");

    const loud = attributes(
      snippet({ variant: "liquid-glass", vibrancy: "high", glassOpacity: "clear", specularMode: "halo" }),
    );
    expect(loud).toContain("vibrancy");
    expect(loud).toContain("glassOpacity");
    expect(loud).toContain("specularMode");
  });

  it("offers transparency only where an alpha fill exists", () => {
    // No `/alpha` in the class list → the resolver hands the classes back
    // untouched (surfaceTransparency.ts:27), so the level would be a lie.
    expect(openingTag(snippet({ variant: "outlined", transparency: "high" }))).toContain(
      'transparency="high"',
    );
    expect(
      attributes(snippet({ variant: "tonal", tone: "indigo", transparency: "medium" })),
    ).toContain("transparency");
    for (const state of [
      { variant: "elevated", transparency: "high" },
      { variant: "subtle", tone: "none", transparency: "medium" },
      { variant: "simple", tone: "none", transparency: "medium" },
      { variant: "floating", transparency: "high" },
      { variant: "glass", tone: "none", transparency: "inherit" },
    ] as Partial<PlaygroundState>[]) {
      expect(attributes(snippet(state)), JSON.stringify(state)).not.toContain(
        "transparency",
      );
    }
  });

  it("offers raisedSurface only where the nesting ladder answers to it", () => {
    // Panel.tsx:312-314 documents it a no-op on elevated and outlined.
    expect(attributes(snippet({ variant: "elevated", raisedSurface: true }))).not.toContain(
      "raisedSurface",
    );
    expect(attributes(snippet({ variant: "outlined", raisedSurface: true }))).not.toContain(
      "raisedSurface",
    );
    expect(attributes(snippet({ variant: "subtle", raisedSurface: true }))).toContain(
      "raisedSurface",
    );
    expect(openingTag(snippet({ variant: "tonal", raisedSurface: true }))).toContain(
      "raisedSurface",
    );
    expect(attributes(snippet({ variant: "tonal" }))).not.toContain("raisedSurface");
  });

  it("keeps accentColor for the frosted card alone", () => {
    // :144 reads it for the floating names; test :115-124 shows the opaque card
    // ignores it, so the control exists for `floating-glass` only.
    expect(attributes(snippet({ variant: "floating-glass" }))).not.toContain(
      "accentColor",
    );
    expect(openingTag(snippet({ variant: "floating-glass", accentColor: "emerald" }))).toContain(
      'accentColor="emerald"',
    );
    // "inherit" is the docs' spelling for leaving the prop out (:120 fills blue back in).
    expect(
      attributes(snippet({ variant: "floating-glass", accentColor: "inherit" })),
    ).not.toContain("accentColor");
    for (const variant of ["floating", "default", "tonal", "glass"]) {
      expect(
        attributes(snippet({ variant, accentColor: "emerald" })),
        variant,
      ).not.toContain("accentColor");
    }
  });

  it("prints the gutter props as the axes they are, and none of them at rest", () => {
    // The space outside the bar (:165-168); every axis opens on "inherit".
    for (const name of [
      "padding",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
    ]) {
      expect(attributes(snippet()), name).not.toContain(name);
    }
    expect(attributes(snippet({ padding: "sm" }))).toEqual([
      "start",
      "end",
      "padding",
      "aria-label",
    ]);
    expect(attributes(snippet({ paddingLeft: "lg" }))).toContain("paddingLeft");
    expect(attributes(snippet({ paddingLeft: "lg" }))).not.toContain("padding");
    expect(openingTag(snippet({ paddingBottom: "md" }))).toContain(
      'paddingBottom="md"',
    );
  });

  it("prints className trimmed, and not at all when blank", () => {
    expect(attributes(snippet({ className: "   " }))).not.toContain("className");
    expect(openingTag(snippet({ className: " shadow-sm " }))).toContain(
      'className="shadow-sm"',
    );
  });

  it("documents every attribute it prints, and prints nothing it does not", () => {
    const names = documented();
    for (const state of EVERY_STATE) {
      for (const name of attributes(snippet(state))) {
        expect(names.has(name), `${name} printed but undocumented`).toBe(true);
      }
    }
  });

  it("has a config prop for every documented lever", () => {
    const configurable = new Set(
      pageHeaderConfig.fields.map((field) => field.prop ?? field.id),
    );
    for (const name of [
      "variant",
      "tone",
      "accentColor",
      "corner",
      "glassOpacity",
      "vibrancy",
      "specularMode",
      "transparency",
      "raisedSurface",
      "padding",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "className",
    ]) {
      expect(configurable.has(name), `${name} is documented but not adjustable`).toBe(
        true,
      );
    }
  });

  it("keeps the preview's shell out of the printed page", () => {
    // The SideMenu beside the bar is the docs' stand-in for the pairing, never a
    // claim that the header renders one.
    for (const state of EVERY_STATE) {
      const code = snippet(state);
      expect(code).not.toContain("SideMenu");
      expect(code).not.toContain("DEMO_ITEMS");
      const printed = attributes(code);
      for (const lever of ["shell", "collapsed", "extra", "ariaLabel", "style", "role", "children"]) {
        expect(printed, `${lever} printed`).not.toContain(lever);
      }
    }
  });

  it("keeps the region props out of the tag when their toggle is off", () => {
    for (const id of ["start", "center", "end"] as const) {
      const printed = attributes(snippet({ [id]: false }));
      expect(printed).not.toContain(id);
      const constName = { start: "TRAIL", center: "NOTE", end: "ACTIONS" }[id];
      expect(snippet({ [id]: false })).not.toContain(`const ${constName} =`);
    }
  });
});
