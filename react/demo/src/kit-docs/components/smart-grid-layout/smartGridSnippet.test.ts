import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { smartGridConfig } from "./smartGridPlayground";
import { smartGridCode } from "./SmartGridLayoutPlayground";
import { SMARTGRID_PROPS } from "./SmartGridLayoutPage";
import { TILE_COUNT } from "./smartGridFixture";
import {
  COLUMNS_DEFAULT,
  DEBOUNCE_DEFAULT,
  HISTORY_DEFAULT,
  STORAGE_PREFIX_DEFAULT,
  SURFACE_TONE_DEFAULT,
  TONE_DEFAULT,
} from "./smartGridStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is this page's claim about a 4800-line component, so it is tested
 * as a claim: the two required props always arrive, the data behind them is
 * printed from the same records the preview mounts, and nothing the grid decides
 * for itself — the toolbar it withholds, the padding it hard-codes, the state it
 * owns — leaks into the tag the reader is given.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of smartGridConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(smartGridConfig, state);
  return smartGridCode({ state, data: {}, h });
};

/** The `<SmartGridLayout …>` tag itself, so a fixture's props cannot be read as its own. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<SmartGridLayout");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<SmartGridLayout".length;
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
  for (const prop of SMARTGRID_PROPS) {
    if (prop.name.startsWith("…")) continue;
    for (const part of prop.name.split(" / ")) names.add(part.trim());
  }
  return names;
};

/** Every lever at a value that differs from its default, so nothing hides. */
const EVERY_STATE: Array<[string, Partial<PlaygroundState>]> = [
  ["at rest", {}],
  ["four tiles", { tiles: "4" }],
  ["all tiles", { tiles: String(TILE_COUNT) }],
  ["two sections", { layout: "sections" }],
  ["narrow", { columns: "4" }],
  ["responsive", { responsive: true, columns: "8" }],
  ["glass", { variant: "glass", surfaceTone: "rose", controlVariant: "solid" }],
  ["accented", { tone: "amber", size: "lg" }],
  ["host editing", { editMode: "on", onEditModeChange: true }],
  ["host viewing", { editMode: "off", defaultEditMode: true }],
  ["read-only", { readOnly: true, editMode: "on" }],
  ["no undo", { historyLimit: 0 }],
  ["persisted", { storageKey: "board", storagePrefix: "ops", autoSave: false }],
  [
    "persisted and slow",
    { storageKey: "board", autoSaveDebounceMs: 1200 },
  ],
  ["classes", { className: "  min-h-[24rem]  " }],
];

describe("smartGrid snippet", () => {
  it("always passes the two required props (:96-97)", () => {
    for (const [name, changes] of EVERY_STATE) {
      expect(attributes(snippet(changes)), name).toEqual(
        expect.arrayContaining(["items", "defaultLayout"]),
      );
    }
    expect(openingTag(snippet())).toContain("items={ITEMS}");
    expect(openingTag(snippet())).toContain("defaultLayout={LAYOUT}");
  });

  it("prints the catalogue as the component reads it (:40-51)", () => {
    const code = snippet();
    expect(code).toContain("const ITEMS = [");
    expect(code).toContain('id: "capsules"');
    expect(code).toContain("active: true");
    expect(code).toContain("single: true");
    expect(code).toContain("defaultSpan: 3");
    expect(code).toContain(
      'render: () => tile("Active capsules", 128, "Rocket")',
    );
  });

  it("declares the helper the catalogue closes over before the catalogue", () => {
    const code = snippet();
    expect(code).toContain("const tile = (label: string");
    expect(code.indexOf("const tile =")).toBeLessThan(code.indexOf("const ITEMS ="));
    expect(code).toContain('import { SmartGridLayout, StatCard } from "@cjlapao/ui-kit";');
  });

  it("counts the tiles the reader chose and keeps one spare unplaced", () => {
    // Counted inside the catalogue only — a section is declared by id too.
    const itemsBlock = (code: string): string =>
      code.slice(code.indexOf("const ITEMS ="), code.indexOf("const LAYOUT ="));
    const four = snippet({ tiles: "4" });
    expect(itemsBlock(four).split("id: ").length - 1).toBe(4);
    expect(four).not.toContain('"queue"');
    const all = snippet({ tiles: String(TILE_COUNT) });
    expect(itemsBlock(all).split("id: ").length - 1).toBe(TILE_COUNT);
    // The last entry exists but no row names it, which is what "Add Item" offers.
    expect(all).toContain('id: "queue"');
    expect(all.slice(all.indexOf("const LAYOUT =")).indexOf("queue")).toBe(-1);
  });

  it("writes a layout from the tiles that exist, never from a fixed id list", () => {
    const one = snippet();
    expect(one).toContain('title: "Overview"');
    expect(one).toContain('itemIds: ["capsules", "requests"]');
    expect(one).not.toContain('"detail"');
    const two = snippet({ layout: "sections" });
    expect(two).toContain('title: "Detail"');
    expect(two).toContain("defaultHeightSpan: 2");
    // Four catalogue entries, one of them spare: nothing may name a missing tile.
    const small = snippet({ tiles: "4", layout: "sections" });
    expect(small.slice(small.indexOf("const LAYOUT ="))).not.toContain("queue");
  });

  it("keeps 12 columns out of the tag and prints every other count", () => {
    expect(COLUMNS_DEFAULT).toBe(12);
    expect(attributes(snippet())).not.toContain("maxColumns");
    expect(openingTag(snippet({ columns: "4" }))).toContain("maxColumns={4}");
    // The engine field is called `columns`; the component prop is `maxColumns`.
    expect(openingTag(snippet({ columns: "8" }))).not.toContain("columns=\"8\"");
  });

  it("replaces the number with a map in responsive mode, never both", () => {
    const code = openingTag(snippet({ responsive: true, columns: "8" }));
    expect(code).toContain(
      "maxColumns={{ base: 4, md: 8, lg: 8 }}",
    );
    expect(code.split("maxColumns=").length - 1).toBe(1);
    expect(openingTag(snippet({ responsive: true }))).toContain("lg: 12");
  });

  it("suppresses the documented surface defaults (:948-950,:965)", () => {
    expect(attributes(snippet())).not.toContain("variant");
    expect(attributes(snippet())).not.toContain("surfaceTone");
    expect(attributes(snippet())).not.toContain("tone");
    expect(attributes(snippet())).not.toContain("size");
    expect(attributes(snippet())).not.toContain("controlVariant");
    expect(SURFACE_TONE_DEFAULT).toBe("none");
    expect(TONE_DEFAULT).toBe("blue");
  });

  it("prints the surface choices that differ, and only the visible ones", () => {
    // `plain` never consults surfaceTone (:992-994), so a tone left behind is
    // not a prop the reader should be shown.
    expect(
      attributes(snippet({ surfaceTone: "rose" })),
    ).not.toContain("surfaceTone");
    const glass = openingTag(
      snippet({ variant: "glass", surfaceTone: "rose", size: "lg", tone: "amber", controlVariant: "solid" }),
    );
    expect(glass).toContain('variant="glass"');
    expect(glass).toContain('surfaceTone="rose"');
    expect(glass).toContain('size="lg"');
    expect(glass).toContain('tone="amber"');
    expect(glass).toContain('controlVariant="solid"');
    // The default member of a union is still the default.
    expect(
      attributes(snippet({ variant: "glass", surfaceTone: SURFACE_TONE_DEFAULT })),
    ).not.toContain("surfaceTone");
  });

  it("shows controlled edit mode as the three different things it can be", () => {
    expect(attributes(snippet({ editMode: "self", onEditModeChange: true }))).not.toContain(
      "isEditMode",
    );
    expect(openingTag(snippet({ editMode: "on" }))).toMatch(/\sisEditMode(?!=)/);
    expect(openingTag(snippet({ editMode: "off" }))).toContain("isEditMode={false}");
  });

  it("hoists the edit-mode report and prints the reference it hoisted", () => {
    const code = snippet({ onEditModeChange: true });
    expect(openingTag(code)).toContain("onEditModeChange={logEditMode}");
    expect(code).toContain("const editReports = [] as boolean[];");
    expect(code).toContain(
      "const logEditMode = (isEditMode: boolean) => editReports.push(isEditMode);",
    );
    expect(snippet()).not.toContain("logEditMode");
  });

  it("hides the uncontrolled starting state from a controlled host (:956)", () => {
    expect(openingTag(snippet({ defaultEditMode: true }))).toMatch(
      /\sdefaultEditMode(?!=)/,
    );
    expect(
      attributes(snippet({ editMode: "on", defaultEditMode: true })),
    ).not.toContain("defaultEditMode");
  });

  it("prints readOnly as the bare name, and historyLimit even when it is 0", () => {
    expect(attributes(snippet())).not.toContain("readOnly");
    expect(openingTag(snippet({ readOnly: true }))).toMatch(/\sreadOnly(?!=)/);
    expect(HISTORY_DEFAULT).toBe(50);
    expect(attributes(snippet())).not.toContain("historyLimit");
    expect(openingTag(snippet({ historyLimit: 0 }))).toContain("historyLimit={0}");
    expect(openingTag(snippet({ historyLimit: 5 }))).toContain("historyLimit={5}");
  });

  it("makes storageKey the gate for the rest of persistence (:1015-1020)", () => {
    const orphan = attributes(
      snippet({
        storageKey: "  ",
        storagePrefix: "ops",
        autoSave: false,
        autoSaveDebounceMs: 1200,
      }),
    );
    for (const name of ["storageKey", "storagePrefix", "autoSave", "autoSaveDebounceMs"]) {
      expect(orphan, name).not.toContain(name);
    }
    const code = openingTag(snippet({ storageKey: " board " }));
    expect(code).toContain('storageKey="board"');
  });

  it("leaves the composed default prefix alone and prints the delay it changed", () => {
    expect(STORAGE_PREFIX_DEFAULT).toBe("ui-kit:grid");
    expect(
      attributes(snippet({ storageKey: "board", storagePrefix: "  ui-kit:grid  " })),
    ).not.toContain("storagePrefix");
    expect(openingTag(snippet({ storageKey: "board", storagePrefix: "ops" }))).toContain(
      'storagePrefix="ops"',
    );
    expect(DEBOUNCE_DEFAULT).toBe(400);
    expect(
      attributes(snippet({ storageKey: "board", autoSaveDebounceMs: 400 })),
    ).not.toContain("autoSaveDebounceMs");
    expect(openingTag(snippet({ storageKey: "board", autoSaveDebounceMs: 1200 }))).toContain(
      "autoSaveDebounceMs={1200}",
    );
    // Off is off: a delay cannot be printed for writes that never happen.
    expect(
      attributes(
        snippet({ storageKey: "board", autoSave: false, autoSaveDebounceMs: 1200 }),
      ),
    ).not.toContain("autoSaveDebounceMs");
    expect(openingTag(snippet({ storageKey: "board", autoSave: false }))).toContain(
      "autoSave={false}",
    );
  });

  it("trims the class name and drops a blank one", () => {
    expect(attributes(snippet({ className: "   " }))).not.toContain("className");
    expect(openingTag(snippet({ className: "  min-h-[24rem]  " }))).toContain(
      'className="min-h-[24rem]"',
    );
  });

  it("keeps the attributes in the order the controls are listed", () => {
    expect(
      attributes(
        snippet({
          columns: "8",
          variant: "glass",
          surfaceTone: "rose",
          tone: "amber",
          size: "lg",
          controlVariant: "solid",
          editMode: "on",
          onEditModeChange: true,
          readOnly: true,
          historyLimit: 0,
          storageKey: "board",
          storagePrefix: "ops",
          autoSave: false,
          className: "mt-4",
        }),
      ),
    ).toEqual([
      "items",
      "defaultLayout",
      "maxColumns",
      "variant",
      "surfaceTone",
      "tone",
      "size",
      "controlVariant",
      "isEditMode",
      "onEditModeChange",
      "readOnly",
      "historyLimit",
      "storageKey",
      "storagePrefix",
      "autoSave",
      "className",
    ]);
  });

  it("names the grid and everything it printed", () => {
    for (const [, changes] of EVERY_STATE) {
      const imports = snippet(changes).match(
        /import \{([^}]*)\} from "@cjlapao\/ui-kit";/,
      );
      expect(imports, "one import line").not.toBeNull();
      expect(imports![1].split(",").map((name) => name.trim())).toContain(
        "SmartGridLayout",
      );
    }
  });

  it("documents everything it prints, in every state", () => {
    const table = documented();
    for (const [name, changes] of EVERY_STATE) {
      for (const attribute of attributes(snippet(changes))) {
        expect(table.has(attribute), `${name} prints ${attribute}`).toBe(true);
      }
    }
  });

  it("gives every config prop a row in the table", () => {
    const table = documented();
    for (const field of smartGridConfig.fields) {
      if (typeof field.prop !== "string") continue;
      expect(table.has(field.prop), `undocumented prop ${field.prop}`).toBe(true);
    }
    for (const source of smartGridConfig.data ?? []) {
      if (typeof source.prop !== "string") continue;
      expect(table.has(source.prop), `undocumented prop ${source.prop}`).toBe(true);
    }
  });

  it("keeps what the grid owns out of the tag", () => {
    // The manual persistence pair, the adapter, the error report and the
    // deprecated alias all have rows but no control, and the layout's own
    // vocabulary must not leak onto the element.
    const never = [
      "persistedLayout",
      "onLayoutChange",
      "storage",
      "storageAdapter",
      "onTileError",
      "editThemeColor",
      "columns",
      "rows",
      "itemIds",
      "sections",
      "render",
      "key",
      "isSpacer",
      "version",
    ];
    for (const [, changes] of EVERY_STATE) {
      const tag = openingTag(snippet(changes));
      for (const name of never) {
        expect(tag, `${name} leaked`).not.toContain(`${name}=`);
      }
    }
  });

  it("prints one section per section it shows", () => {
    const one = snippet();
    expect(one.split("title: ").length - 1).toBe(
      1 + Math.min(TILE_COUNT - 1, TILE_COUNT), // one per item, one per section
    );
    const two = snippet({ layout: "sections" });
    expect(two).toContain('title: "Overview"');
    expect(two).toContain('title: "Detail"');
    expect(two.split('id: "overview"').length - 1).toBe(1);
  });
});
