import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { pagedPanelConfig } from "./pagedPanelPlayground";
import { pagedPanelCode } from "./PagedPanelPlayground";
import { PAGEDPANEL_PROPS } from "./PagedPanelPage";
import { PAGE_TEMPLATE, REGIONS } from "./pagedPanelFixture";
import { PAGE_UNCONTROLLED, TONE_DEFAULT, VARIANT_DEFAULT } from "./pagedPanelStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is this page's claim about `PagedPanel.tsx`, so it is tested as a
 * claim: the required `pages` always arrives, one control per decision, and no
 * control speaks where the component has already decided — which here means the
 * loader props outside `loading`, the variants under `bare`, and the index a
 * caller never asked to control.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of pagedPanelConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(pagedPanelConfig, state);
  return pagedPanelCode({ state, data: {}, h });
};

/** The `<PagedPanel …>` tag itself, so assertions cannot hit a card's props. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<PagedPanel");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<PagedPanel".length;
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
 * braces and string literals — a flat regex would find the `className` of a
 * region card and report it as the panel's own.
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
    precededBySpace = false;
  }
  push();
  return names;
};

/** The props the API table vouches for, including the rows that share a line. */
const documented = (): Set<string> => {
  const names = new Set<string>();
  for (const prop of PAGEDPANEL_PROPS) {
    if (prop.name.startsWith("…")) {
      // The pass-through row is what vouches for the Panel props the page lets
      // the reader touch (:376-382).
      names.add("variant");
      names.add("className");
      continue;
    }
    for (const part of prop.name.split(" / ")) names.add(part.trim());
  }
  return names;
};

/** Every lever at a value that differs from its default, so nothing hides. */
const EVERY_STATE: Array<[string, Partial<PlaygroundState>]> = [
  ["at rest", {}],
  ["one page", { pageCount: "1" }],
  ["five pages", { pageCount: "5" }],
  ["per-page titles", { titles: "per-page" }],
  ["no header", { titles: "none", subtitle: "rolling deploy" }],
  ["loading", { state: "loading" }],
  ["progress bar", { state: "loading", loaderType: "progress", progress: 40 }],
  ["labelled spinner", { state: "loading", loaderType: "spinner", loadingLabel: "Syncing" }],
  ["custom loading", { state: "loading", loadingState: true }],
  ["error", { state: "error" }],
  ["empty", { state: "empty" }],
  ["empty with copy", { state: "empty", emptyMessage: " Nothing yet " }],
  ["empty with a block", { state: "empty", emptyState: true }],
  ["controlled", { page: 2, onPageChange: true }],
  ["toned and large", { tone: "emerald", size: "lg" }],
  ["glass panel", { variant: "glass" }],
  ["bare", { bare: true, variant: "glass", className: " max-w-sm " }],
];

describe("pagedPanel snippet", () => {
  it("always passes the pages it is showing", () => {
    for (const [name, changes] of EVERY_STATE) {
      expect(attributes(snippet(changes)), name).toContain("pages");
    }
  });

  it("prints the cards the preview is mounting, not a paraphrase", () => {
    const code = snippet();
    expect(code).toContain("const PAGES = [");
    expect(code).toContain(`className="${PAGE_TEMPLATE.card}"`);
    expect(code).toContain(`className="${PAGE_TEMPLATE.track}"`);
    expect(code).toContain(REGIONS[0].name);
    expect(openingTag(code)).toContain("pages={PAGES}");
  });

  it("draws exactly the number of pages the reader chose", () => {
    const one = snippet({ pageCount: "1" });
    expect(one.split(PAGE_TEMPLATE.card).length - 1).toBe(1);
    expect(one).toContain(REGIONS[0].name);
    expect(one).not.toContain(REGIONS[1].name);
    const five = snippet({ pageCount: "5" });
    expect(five.split(PAGE_TEMPLATE.card).length - 1).toBe(5);
  });

  it("leaves the page-count lever out of the tag", () => {
    expect(attributes(snippet({ pageCount: "5" }))).not.toContain("pageCount");
  });

  it("never prints the title twice", () => {
    for (const titles of ["static", "per-page", "none"]) {
      const code = snippet({ titles });
      const printed = openingTag(code).match(/\btitle=/g) ?? [];
      expect(printed.length, titles).toBe(titles === "none" ? 0 : 1);
    }
  });

  it("hoists per-page titles beside the pages they describe", () => {
    const code = snippet({ titles: "per-page" });
    expect(code).toContain("const TITLES = [");
    expect(code).toContain(`"${REGIONS[0].name}"`);
    expect(openingTag(code)).toContain("title={TITLES}");
    expect(code).toMatch(/\/\/ [Oo]ne title per page/);
  });

  it("prints a static title as the string it is", () => {
    const code = snippet({ titles: "static", title: "  Regions  " });
    expect(openingTag(code)).toContain('title="Regions"');
  });

  it("drops a blank title, subtitle or class rather than printing empty strings", () => {
    expect(attributes(snippet({ titles: "none" }))).not.toContain("title");
    expect(attributes(snippet({ subtitle: "   " }))).not.toContain("subtitle");
    expect(attributes(snippet({ className: "  " }))).not.toContain("className");
    expect(openingTag(snippet({ className: "  max-w-sm  " }))).toContain(
      'className="max-w-sm"',
    );
  });

  it("says loading only while the body is loading", () => {
    expect(attributes(snippet())).not.toContain("loading");
    expect(openingTag(snippet({ state: "loading" }))).toMatch(/\sloading(?!=)/);
  });

  it("keeps every loader prop out of the tag while the body is ready", () => {
    const ready = attributes(
      snippet({
        loaderType: "progress",
        progress: 20,
        loadingLabel: "Syncing",
        loadingState: true,
      }),
    );
    for (const name of ["loaderType", "progress", "loadingLabel", "loadingState"]) {
      expect(ready, name).not.toContain(name);
    }
  });

  it("keeps the skeleton's own name out of the snippet (:22-23)", () => {
    expect(attributes(snippet({ state: "loading" }))).not.toContain("loaderType");
    expect(openingTag(snippet({ state: "loading", loaderType: "spinner" }))).toContain(
      'loaderType="spinner"',
    );
  });

  it("prints progress only where a value is read, and always as a number", () => {
    expect(attributes(snippet({ state: "loading", loaderType: "spinner" }))).not.toContain(
      "progress",
    );
    expect(
      openingTag(snippet({ state: "loading", loaderType: "progress", progress: 40 })),
    ).toContain("progress={40}");
  });

  it("gives the skeleton no copy to print (:266-274)", () => {
    expect(
      attributes(snippet({ state: "loading", loadingLabel: "Syncing" })),
    ).not.toContain("loadingLabel");
    expect(
      openingTag(snippet({ state: "loading", loaderType: "spinner", loadingLabel: " Syncing " })),
    ).toContain('loadingLabel="Syncing"');
  });

  it("replaces all three treatments with one hoisted block", () => {
    const code = snippet({ state: "loading", loadingState: true });
    expect(openingTag(code)).toContain("loadingState={LOADING_CARD}");
    expect(code).toContain("const LOADING_CARD = ");
    expect(code).toContain("Fetching the fleet");
    expect(attributes(code)).not.toContain("loaderType");
  });

  it("treats an empty error string as no error (:284)", () => {
    expect(openingTag(snippet({ state: "error" }))).toContain(
      'error="Could not reach the registry"',
    );
    expect(attributes(snippet({ state: "error", error: "   " }))).not.toContain(
      "error",
    );
  });

  it("makes no pages an empty array, which is what draws the empty state", () => {
    const code = snippet({ state: "empty", titles: "per-page" });
    expect(code).toContain("const PAGES = [];");
    expect(code).not.toContain("const TITLES");
    expect(openingTag(code)).toContain("pages={PAGES}");
  });

  it("lets a caller bring their own empty block", () => {
    const code = snippet({ state: "empty", emptyState: true, emptyMessage: "Nope" });
    expect(openingTag(code)).toContain("emptyState={EMPTY_BLOCK}");
    // The block replaces the whole thing, copy included (:294-305).
    expect(attributes(code)).not.toContain("emptyMessage");
    expect(code).toContain("const EMPTY_BLOCK = ");
  });

  it("prints the index only when the caller says they own it", () => {
    expect(attributes(snippet())).not.toContain("page");
    expect(attributes(snippet({ page: PAGE_UNCONTROLLED }))).not.toContain("page");
    expect(openingTag(snippet({ page: 2 }))).toContain("page={2}");
    expect(openingTag(snippet({ page: -1, onPageChange: true }))).toContain(
      "onPageChange={(next) => setRegion(next)}",
    );
  });

  it("keeps the tone, size and variant defaults out of the tag", () => {
    expect(TONE_DEFAULT).toBe("none");
    expect(attributes(snippet())).not.toContain("tone");
    expect(openingTag(snippet({ tone: "emerald" }))).toContain('tone="emerald"');
    expect(attributes(snippet())).not.toContain("size");
    expect(openingTag(snippet({ size: "lg" }))).toContain('size="lg"');
    expect(VARIANT_DEFAULT).toBe("elevated");
    expect(attributes(snippet())).not.toContain("variant");
    expect(openingTag(snippet({ variant: "glass" }))).toContain('variant="glass"');
  });

  it("has no Panel to pass a variant to once bare is on (:367-372)", () => {
    const code = snippet({ bare: true, variant: "glass" });
    expect(openingTag(code)).toMatch(/\sbare(?!=)/);
    expect(attributes(code)).not.toContain("variant");
  });

  it("prints nothing for the states the reader did not choose", () => {
    const ready = attributes(
      snippet({ emptyMessage: "Nope", emptyState: true, error: "boom" }),
    );
    for (const name of ["error", "emptyMessage", "emptyState"]) {
      expect(ready, name).not.toContain(name);
    }
  });

  it("keeps the attributes in the order the controls are listed", () => {
    expect(
      attributes(
        snippet({
          titles: "static",
          subtitle: "rolling deploy",
          state: "loading",
          loaderType: "progress",
          loadingState: true,
          page: 1,
          onPageChange: true,
          tone: "rose",
          size: "sm",
          bare: true,
          className: "max-w-sm",
        }),
      ),
    ).toEqual([
      "pages",
      "title",
      "subtitle",
      "loading",
      "loadingState",
      "page",
      "onPageChange",
      "tone",
      "size",
      "bare",
      "className",
    ]);
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
    for (const field of pagedPanelConfig.fields) {
      if (typeof field.prop !== "string") continue;
      expect(table.has(field.prop), `undocumented prop ${field.prop}`).toBe(true);
    }
  });

  it("keeps what the component owns out of the tag", () => {
    const never = [
      "aria-live",
      "role",
      "padding",
      "bodyClassName",
      "srLabel",
      "tooltip",
      "disabled",
      "loop",
    ];
    for (const [, changes] of EVERY_STATE) {
      const tag = openingTag(snippet(changes));
      for (const name of never) {
        expect(tag, `${name} leaked`).not.toContain(`${name}=`);
      }
      expect(tag).not.toMatch(/\srole(?!=)/);
    }
  });

  it("imports only the panel, whatever the reader changed", () => {
    for (const [, changes] of EVERY_STATE) {
      expect(snippet(changes)).toContain(
        'import { PagedPanel } from "@cjlapao/ui-kit";',
      );
    }
  });
});
