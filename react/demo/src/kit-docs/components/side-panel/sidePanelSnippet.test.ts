import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { SIDE_PANEL_SLOTS, sidePanelConfig } from "./sidePanelPlayground";
import { sidePanelCode } from "./SidePanelPlayground";
import { SIDEPANEL_PROPS } from "./SidePanelPage";
import { ROWS } from "./sidePanelFixture";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is this page's claim about a 1300-line component, so it is tested as
 * a claim: the required prop always arrives, the slots print the markup the
 * preview mounts, and nothing the panel decides for itself — the surface it paints,
 * the state it owns, the keys it does not answer — leaks into the tag the reader is
 * handed. Every case is run through the same emitter the Code view uses, so the
 * test cannot pass by disagreeing with the page in the same way twice.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of sidePanelConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(sidePanelConfig, state);
  return sidePanelCode({ state, data: {}, h });
};

/** The `<SidePanel …>` tag itself, so the stage's props cannot be read as its own. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<SidePanel");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<SidePanel".length;
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
  for (const prop of SIDEPANEL_PROPS) {
    if (prop.name.startsWith("…")) continue;
    for (const part of prop.name.split(" / ")) names.add(part.trim());
  }
  return names;
};

/** One state per interesting combination, the way the controls can actually leave it. */
const EVERY_STATE: [string, Partial<PlaygroundState>][] = [
  ["as shipped", {}],
  ["left", { side: "left" }],
  ["top", { side: "top" }],
  ["bottom", { side: "bottom" }],
  ["closed", { open: false }],
  ["closed docked", { open: false, docked: true }],
  ["not closable", { closable: false }],
  ["docked", { docked: true }],
  ["overlay", { overlay: true }],
  ["overlay without a close handler", { overlay: true, closable: false }],
  ["collapsible", { collapsible: true }],
  ["collapsed", { collapsible: true, collapse: "collapsed" }],
  ["held open", { collapsible: true, collapse: "expanded" }],
  ["collapsing reported", { collapsible: true, collapseReport: true }],
  [
    "reported and owned",
    { collapsible: true, collapse: "collapsed", collapseReport: true },
  ],
  [
    "rail label",
    { collapsible: true, collapsedLabel: "  Build 412 — details  " },
  ],
  ["glass", { variant: "glass", noise: true }],
  ["legacy floating", { variant: "floating" }],
  ["legacy sidebar", { variant: "sidebar", inset: "none" }],
  ["toned", { surfaceTone: "blue", tone: "amber", size: "sm" }],
  ["square", { corner: "none", flush: false }],
  ["auto corner", { corner: "auto" }],
  ["inset", { inset: "md" }],
  ["flush inset", { inset: "none" }],
  ["resizable", { resizable: true }],
  [
    "resizable with bounds",
    { resizable: true, minWidth: 200, maxWidth: 640, width: 700 },
  ],
  ["narrow", { width: 160 }],
  ["short strip", { side: "top", height: 96, resizable: true }],
  ["every slot", { headerActions: true, headerPills: true, subHeader: true, footer: true }],
  ["no slot", { headerActions: false, headerPills: false, subHeader: false, footer: false }],
];

describe("SidePanel snippet", () => {
  it("opens with one sorted kit import, and react only when the demo holds state", () => {
    const plain = snippet({
      closable: false,
      headerPills: false,
      subHeader: false,
      footer: false,
    });
    expect(plain.match(/^import .*$/gm)).toEqual([
      'import { SidePanel } from "@cjlapao/ui-kit";',
    ]);

    const hosted = snippet();
    const imports = hosted.match(/^import .*$/gm) ?? [];
    expect(imports).toEqual([
      'import { useState } from "react";',
      'import { Button, Pill, SidePanel } from "@cjlapao/ui-kit";',
    ]);
  });

  it("imports every component a slot mounts and none it does not", () => {
    const none = snippet({
      headerActions: false,
      headerPills: false,
      subHeader: false,
      footer: false,
    });
    expect((none.match(/^import .*$/gm) ?? [])[1]).toBe(
      'import { SidePanel } from "@cjlapao/ui-kit";',
    );
    const pills = snippet({ subHeader: false, footer: false, headerActions: false });
    expect(pills).toContain("Pill, SidePanel");
    const actions = snippet({ headerActions: true });
    expect(actions).toContain("Button, Pill, SidePanel");
  });

  it("always prints the required isOpen, in the form the host is really using", () => {
    expect(openingTag(snippet())).toContain("isOpen={open}");
    expect(openingTag(snippet({ closable: false }))).toMatch(/\sisOpen(\s|>|$)/);
    expect(openingTag(snippet({ closable: false, open: false }))).toContain(
      "isOpen={false}",
    );
    for (const [, changes] of EVERY_STATE) {
      expect(attributes(snippet(changes))).toContain("isOpen");
    }
  });

  it("keeps host state inside the component where hooks belong", () => {
    const code = snippet({ collapsible: true, collapseReport: true });
    const demo = code.slice(code.indexOf("export default function Demo()"));
    expect(demo).toContain("const [open, setOpen] = useState(true);");
    expect(demo.indexOf("useState(true)")).toBeLessThan(
      demo.indexOf("return ("),
    );
    // Module scope may import the hook; it may not call it.
    expect(code.slice(0, code.indexOf("export default function Demo()"))).not.toContain(
      "useState(",
    );
  });

  it("prints the controlled pair only when the host both owns and is told", () => {
    const told = snippet({ collapsible: true, collapse: "collapsed", collapseReport: true });
    expect(openingTag(told)).toContain("collapsed={collapsed}");
    expect(told).toContain("const [collapsed, setCollapsed] = useState(true);");
    expect(openingTag(told)).toContain(
      "onCollapsedChange={(next) => setCollapsed(next)}",
    );

    const watched = snippet({ collapsible: true, collapseReport: true });
    expect(openingTag(watched)).not.toContain("collapsed=");
    expect(openingTag(watched)).toContain("onCollapsedChange=");

    const owned = snippet({ collapsible: true });
    expect(openingTag(owned)).not.toContain("collapsed");
    expect(openingTag(owned)).not.toContain("onCollapsedChange");
  });

  it("keeps every collapse prop behind the collapsible gate", () => {
    const tag = openingTag(snippet({ collapse: "collapsed", collapseReport: true, collapsedLabel: "Build" }));
    for (const name of ["collapsed", "onCollapsedChange", "collapsedLabel"]) {
      expect(tag, `${name} leaked without collapsible`).not.toContain(`${name}=`);
    }
    expect(tag).not.toMatch(/\scollapsed(\s|>|$)/);
  });

  it("trims the rail label and stays silent when it is blank", () => {
    expect(snippet({ collapsible: true, collapsedLabel: "  Logs  " })).toContain(
      'collapsedLabel="Logs"',
    );
    expect(snippet({ collapsible: true, collapsedLabel: "   " })).not.toContain(
      "collapsedLabel",
    );
  });

  it("never gives a docked panel a scrim", () => {
    expect(openingTag(snippet({ docked: true, overlay: true }))).not.toContain(
      "overlay",
    );
    expect(openingTag(snippet({ overlay: true }))).toContain("overlay");
  });

  it("moves the geometry to the axis the edge is on", () => {
    expect(openingTag(snippet({ side: "top" }))).not.toContain("width=");
    expect(openingTag(snippet({ side: "top", height: 96 }))).toContain(
      "height={96}",
    );
    expect(openingTag(snippet({ side: "left", width: 300 }))).toContain(
      "width={300}",
    );
    expect(openingTag(snippet({ side: "left", width: 300 }))).not.toContain(
      "height=",
    );
  });

  it("prints numbers as expressions, never as strings", () => {
    const tag = openingTag(
      snippet({ resizable: true, width: 500, minWidth: 200, maxWidth: 700 }),
    );
    expect(tag).toContain("width={500}");
    expect(tag).toContain("minWidth={200}");
    expect(tag).toContain("maxWidth={700}");
    expect(tag).not.toContain('width="500"');
  });

  it("keeps the bounds with the handle that obeys them", () => {
    // At rest the two bounds are the component's own numbers (280 / 900, :459-460)
    // and the snippet stays silent about them; moved, they travel with the handle.
    expect(openingTag(snippet({ resizable: true }))).not.toContain("minWidth=");
    expect(openingTag(snippet({ resizable: true }))).not.toContain("maxWidth=");
    const bounds = openingTag(
      snippet({ resizable: true, minWidth: 200, maxWidth: 640 }),
    );
    expect(bounds).toContain("minWidth={200}");
    expect(bounds).toContain("maxWidth={640}");
    expect(openingTag(snippet({ minWidth: 200 }))).not.toContain("minWidth=");
  });

  it("sends inset only when the reader pins it", () => {
    expect(openingTag(snippet())).not.toContain("inset");
    expect(openingTag(snippet({ inset: "none" }))).toContain("inset={false}");
    expect(openingTag(snippet({ inset: "md" }))).toContain('inset="md"');
  });

  it("names the variant the reader chose, aliases included", () => {
    expect(openingTag(snippet({ variant: "floating" }))).toContain(
      'variant="floating"',
    );
    expect(openingTag(snippet({ variant: "glass" }))).toContain('variant="glass"');
    expect(openingTag(snippet())).not.toContain("variant=");
  });

  it("prints the surface the reader changed and none of the ones they did not", () => {
    const rest = openingTag(snippet());
    for (const name of [
      "side",
      "docked",
      "overlay",
      "collapsible",
      "variant",
      "surfaceTone",
      "tone",
      "size",
      "corner",
      "flush",
      "noise",
      "resizable",
      "width",
      "height",
    ]) {
      expect(rest, `${name} printed at its default`).not.toContain(`${name}=`);
      expect(rest, `${name} printed bare at its default`).not.toMatch(
        new RegExp(`\\s${name}(\\s|>|$)`),
      );
    }
    const changed = openingTag(
      snippet({ side: "left", surfaceTone: "blue", tone: "amber", flush: false }),
    );
    expect(changed).toContain('side="left"');
    expect(changed).toContain('surfaceTone="blue"');
    expect(changed).toContain('tone="amber"');
    expect(changed).toContain("flush={false}");
  });

  it("keeps the noise grain off a legacy alias that paints its own fill", () => {
    // `when` hides the control; the emit is gated too, so a stale state cannot
    // print a prop the component would ignore.
    const code = snippet({ variant: "sidebar", noise: true });
    expect(openingTag(code)).not.toContain("noise");
  });

  it("prints each slot as a declaration the tag can point at", () => {
    const code = snippet();
    for (const slot of SIDE_PANEL_SLOTS) {
      if (!slot.on) continue;
      expect(code, `${slot.constName} declared`).toContain(
        `const ${slot.constName} = `,
      );
      expect(openingTag(code)).toContain(`${slot.id}={${slot.constName}}`);
    }
    const off = snippet({ headerActions: false, headerPills: false, subHeader: false, footer: false });
    for (const slot of SIDE_PANEL_SLOTS) {
      expect(off, `${slot.constName} leaked`).not.toContain(slot.constName);
    }
  });

  it("mounts the body from the rows it prints", () => {
    const code = snippet();
    expect(code).toContain("const ROWS = [");
    expect(code.match(/const ROWS = \[/g)).toHaveLength(1);
    for (const row of ROWS) expect(code).toContain(JSON.stringify(row));
    expect(code).toContain("{ROWS.map((row) => (");
    expect(code.slice(code.indexOf("<SidePanel"), code.indexOf("</SidePanel>"))).toContain(
      "Build details",
    );
  });

  it("names the header it shows", () => {
    const tag = openingTag(snippet());
    expect(tag).toContain("title=");
    expect(tag).toContain("subtitle=");
  });

  it("prints nothing the API table has not vouched for", () => {
    const documentedNames = documented();
    for (const [name, changes] of EVERY_STATE) {
      for (const attribute of attributes(snippet(changes))) {
        expect(documentedNames, `${attribute} printed in "${name}"`).toContain(
          attribute,
        );
      }
    }
  });

  it("has a config prop for every prop the table claims the playground edits", () => {
    const documentedNames = documented();
    for (const field of sidePanelConfig.fields) {
      if (field.prop === null || field.prop === undefined) continue;
      expect(documentedNames, `${field.prop} undocumented`).toContain(field.prop);
    }
  });

  it("never speaks for a prop that does not exist", () => {
    const never = [
      "zIndex",
      "panelScrollable",
      "closeOnBackdrop",
      "draggableCollapse",
      "draggableCollapseThreshold",
      "panelPadding",
      "onWidthChange",
      "onHeightChange",
      "position",
      "portal",
      "focusTrap",
      "modal",
      "ariaLabel",
      "label",
      "motion",
      "raisedSurface",
      "glassOpacity",
      "noiseScale",
      "minHeight",
      "maxHeight",
      "closeIconSize",
      "className",
      "color",
      "icon",
      "defaultCollapsed",
      "transparency",
      "vibrancy",
      "specularMode",
    ];
    for (const [, changes] of EVERY_STATE) {
      const tag = openingTag(snippet(changes));
      for (const name of never) {
        expect(tag, `${name} leaked`).not.toContain(`${name}=`);
        expect(tag, `${name} leaked bare`).not.toMatch(
          new RegExp(`\\s${name}(\\s|>|$)`),
        );
      }
    }
  });

  it("keeps the braces balanced whatever the state", () => {
    for (const [name, changes] of EVERY_STATE) {
      const code = snippet(changes);
      const opens = (code.match(/\{/g) ?? []).length;
      const closes = (code.match(/\}/g) ?? []).length;
      expect(opens, `braces in "${name}"`).toBe(closes);
      expect(code).toContain("</SidePanel>");
      expect(code).toContain("export default function Demo()");
    }
  });
});
