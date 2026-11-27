import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { splitViewConfig } from "./splitViewPlayground";
import { splitViewCode } from "./SplitViewPlayground";
import { SPLITVIEW_PROPS } from "./SplitViewPage";
import { CAPSULES, ROW_MENU } from "./splitViewFixture";
import {
  LOADER_DEFAULT,
  PROGRESS_DEFAULT,
} from "./splitViewStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is this page's claim about a 1561-line component, so it is tested as
 * a claim: the one required prop always arrives, the rows printed are the rows the
 * preview mounts, and nothing the component decides for itself — the search it
 * withholds, the width it seeds, the selection it owns — leaks into the tag the
 * reader is handed.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of splitViewConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(splitViewConfig, state);
  return splitViewCode({ state, data: {}, h });
};

/** The `<SplitView …>` tag itself, so a fixture's props cannot be read as its own. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<SplitView");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<SplitView".length;
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

const itemsBlock = (code: string): string => {
  const start = code.indexOf("const ITEMS = [");
  expect(start).toBeGreaterThanOrEqual(0);
  const end = code.indexOf("];", start);
  return code.slice(start, end);
};

/** The props the API table vouches for, including the rows that share a line. */
const documented = (): Set<string> => {
  const names = new Set<string>();
  for (const prop of SPLITVIEW_PROPS) {
    if (prop.name.startsWith("…")) continue;
    for (const part of prop.name.split(" / ")) names.add(part.trim());
  }
  return names;
};

/** Every lever at a value that differs from its default, so nothing can hide. */
const EVERY_STATE: Array<[string, Partial<PlaygroundState>]> = [
  ["at rest", {}],
  ["no sub-items", { subItems: false }],
  ["a titled list", { listTitle: true, listActions: true }],
  ["a written placeholder", { searchPlaceholder: "Find a capsule" }],
  ["a chosen surface", { searchVariant: "ghost" }],
  ["pinned dots", { menuVisibility: "always" }],
  ["no dot", { showHighlightIndicator: false }],
  ["draggable", { resizable: true, minListWidth: 220, maxListWidth: "400" }],
  ["a chosen width", { listWidth: "w-96" }],
  ["collapsible", { collapsible: true, collapse: "collapsed", collapseReport: true }],
  ["glass and toned", { variant: "glass", surfaceTone: "rose", tone: "amber" }],
  ["large", { size: "lg" }],
  ["raised and ruled", { raisedSurface: true, borderLeft: true }],
  ["a custom header", { panelHeader: true, panelHeaderProps: false }],
  ["nothing selected", { selection: "__none" }],
  ["a hidden row chosen", { selection: "sidecar" }],
  ["placeholders filled", { panelEmptyState: true, emptyState: true }],
  ["a stuck detail", { panelScrollable: false }],
  ["loading", { loading: true }],
  ["a progress loader", { loading: true, loaderType: "progress", loadingProgress: 35 }],
  ["a custom loader", { loading: true, loadingState: true }],
  ["broken", { error: true, errorText: "Registry unreachable" }],
  ["retryable", { error: true, onRetry: true }],
];

describe("splitView snippet", () => {
  it("always passes the one required prop (:177)", () => {
    for (const [name, changes] of EVERY_STATE) {
      expect(attributes(snippet(changes)), name).toContain("items");
    }
    expect(openingTag(snippet())).toContain("items={ITEMS}");
  });

  it("prints every row the preview mounts, in the order it mounts them", () => {
    const block = itemsBlock(snippet());
    let previous = -1;
    for (const spec of CAPSULES) {
      const at = block.indexOf(`id: ${JSON.stringify(spec.id)}`);
      expect(at, spec.id).toBeGreaterThanOrEqual(0);
      expect(at).toBeGreaterThan(previous);
      previous = at;
      expect(block).toContain(`label: ${JSON.stringify(spec.label)}`);
      expect(block).toContain(`panel: <div className="p-6 text-sm">${spec.detail}</div>`);
    }
  });

  it("carries the flags the rows actually have, and no others", () => {
    const block = itemsBlock(snippet());
    expect(block).toContain("highlight: true");
    expect(block).toContain("disabled: true");
    expect(block).toContain("hidden: true");
    // Only one row has hover actions, one row has badges — asserted against the
    // spec so a fixture edit cannot pass this test by accident.
    expect(block.split("actions: <Button").length - 1).toBe(
      CAPSULES.filter((spec) => spec.id === "gateway").length,
    );
    expect(block.split("badges: [").length - 1).toBe(
      CAPSULES.filter((spec) => spec.id === "batch").length,
    );
  });

  it("hoists the menu entries the rows reference, before the rows", () => {
    const code = snippet();
    const menu = code.indexOf("const ROW_MENU = [");
    const items = code.indexOf("const ITEMS = [");
    expect(menu).toBeGreaterThanOrEqual(0);
    expect(menu).toBeLessThan(items);
    expect(code).toContain("const ITEMS = [");
    for (const entry of ROW_MENU) expect(code).toContain(`"${entry.label}"`);
  });

  it("prints the child rows only while the data has them", () => {
    const withSubs = snippet();
    expect(withSubs).toContain("subItems: [");
    expect(withSubs).toContain("subContent: <Replicas names={");
    expect(withSubs).toContain("const Replicas");
    expect(withSubs).toContain("const SUB_MENU = [");
    const without = snippet({ subItems: false });
    expect(without).not.toContain("subItems:");
    expect(without).not.toContain("subContent:");
    expect(without).not.toContain("const Replicas");
    expect(without).not.toContain("const SUB_MENU");
  });

  it("makes exactly one child row clickable, because that is what is mounted", () => {
    const block = itemsBlock(snippet());
    const subs = block.slice(block.indexOf("subItems: ["));
    expect(subs.split("onClick:").length - 1).toBe(1);
    expect(subs).toContain("onClick: (sub) => console.log(sub.id)");
  });

  it("suppresses every documented default the component already applies", () => {
    const tag = openingTag(snippet());
    for (const name of [
      "variant",
      "surfaceTone",
      "tone",
      "size",
      "menuVisibility",
      "showHighlightIndicator",
      "resizable",
      "minListWidth",
      "maxListWidth",
      "listWidth",
      "collapsible",
      "collapsed",
      "panelScrollable",
      "raisedSurface",
      "borderLeft",
      "searchVariant",
      "loading",
      "loaderType",
      "error",
      "value",
    ]) {
      expect(attributes(snippet()), name).not.toContain(name);
    }
    // …and the title is only there because this page turns it on.
    expect(tag).toContain("listTitle=");
  });

  it("prints the surface choices that differ, quoted as the union spells them", () => {
    const code = snippet({
      variant: "glass",
      surfaceTone: "rose",
      tone: "amber",
      size: "lg",
      searchVariant: "ghost",
    });
    expect(code).toContain('variant="glass"');
    expect(code).toContain('surfaceTone="rose"');
    expect(code).toContain('tone="amber"');
    expect(code).toContain('size="lg"');
    expect(code).toContain('searchVariant="ghost"');
  });

  it("never prints the word auto to the component (:67-77)", () => {
    expect(snippet({ searchVariant: "auto" })).not.toContain("searchVariant=");
    expect(snippet({ listWidth: "auto", maxListWidth: "auto" })).not.toContain(
      "listWidth=",
    );
    expect(snippet({ maxListWidth: "auto" })).not.toContain("maxListWidth=");
  });

  it("prints the numbers as expressions and the widths as strings", () => {
    const code = snippet({
      resizable: true,
      minListWidth: 220,
      maxListWidth: "400",
      listWidth: "w-96",
    });
    expect(code).toContain("minListWidth={220}");
    expect(code).toContain("maxListWidth={400}");
    expect(code).toContain('listWidth="w-96"');
  });

  it("shows the selected row as the three different things it can be", () => {
    expect(snippet({ selection: "auto" })).not.toContain("value=");
    expect(snippet({ selection: "__none" })).toContain('value=""');
    expect(snippet({ selection: "batch" })).toContain('value="batch"');
    // A `hidden` row is still a legal id to name — and selects nothing (:573,:669).
    expect(snippet({ selection: "sidecar" })).toContain('value="sidecar"');
  });

  it("keeps a list that cannot collapse from printing collapse props", () => {
    const code = snippet({ collapsible: false, collapse: "collapsed", collapseReport: true });
    expect(code).not.toContain("collapsible");
    expect(code).not.toContain("collapsed=");
    expect(code).not.toContain("onCollapsedChange");
    const open = snippet({ collapsible: true });
    expect(open).toContain("collapsible");
    expect(open).not.toContain("collapsed=");
  });

  it("hoists the collapse report together with the state it writes", () => {
    const code = snippet({
      collapsible: true,
      collapseReport: true,
      collapse: "self",
    });
    expect(code).toContain("onCollapsedChange={(next) => setCollapsed(next)}");
    expect(code).toContain("const [collapsed, setCollapsed] = useState(false);");
    expect(code).toContain('import { useState } from "react";');
    // Controlled both ways, the prop is a boolean and not a bare name.
    expect(snippet({ collapsible: true, collapse: "collapsed" })).toContain(
      "collapsed={true}",
    );
    expect(snippet({ collapsible: true, collapse: "expanded" })).toContain(
      "collapsed={false}",
    );
  });

  it("prints the progress value only for the loader that reads it (:957)", () => {
    expect(snippet({ loading: true })).not.toContain("loadingProgress=");
    expect(snippet({ loading: true, loaderType: "spinner" })).not.toContain(
      "loadingProgress=",
    );
    const progress = snippet({ loading: true, loaderType: "progress" });
    expect(progress).toContain(`loadingProgress={${PROGRESS_DEFAULT}}`);
    expect(progress).toContain('loaderType="progress"');
    // The default loader is what the component would pick anyway (:471).
    expect(snippet({ loading: true, loaderType: LOADER_DEFAULT })).not.toContain(
      "loaderType=",
    );
  });

  it("prints a loader override as the node it replaces, not beside it", () => {
    const code = snippet({ loading: true, loadingState: true });
    expect(code).toContain("loadingState={<LOADING_STATE />}");
    expect(code).toContain("const LOADING_STATE = <div");
  });

  it("prints the error as a string, and the retry pair only together", () => {
    const plain = snippet({ error: true });
    expect(plain).toContain('error="Could not reach the registry"');
    expect(plain).not.toContain("onRetry");
    expect(plain).not.toContain("useState");
    const retryable = snippet({ error: true, onRetry: true });
    expect(retryable).toContain('error={errored ? "Could not reach the registry" : undefined}');
    expect(retryable).toContain("onRetry={() => setErrored(false)}");
    expect(retryable).toContain("const [errored, setErrored] = useState(true);");
  });

  it("prints the message the reader typed, not the placeholder it showed", () => {
    expect(snippet({ error: true, errorText: "Registry unreachable" })).toContain(
      'error="Registry unreachable"',
    );
  });

  it("hoists a slot const for every slot it fills, and only those", () => {
    const code = snippet({
      listActions: true,
      panelHeader: true,
      panelEmptyState: true,
      emptyState: true,
    });
    const slots: Record<string, string> = {
      LIST_ACTIONS: "listActions",
      PANEL_HEADER: "panelHeader",
      PANEL_EMPTY: "panelEmptyState",
      EMPTY_LIST: "emptyState",
    };
    for (const [name, attribute] of Object.entries(slots)) {
      expect(code, name).toContain(`const ${name} = `);
      expect(code, name).toContain(`${attribute}={<${name} />}`);
    }
    expect(code).not.toContain("const LOADING_STATE");
    expect(snippet()).not.toContain("const LIST_ACTIONS");
  });

  it("prints the built-in header's slots as functions of the row (:722-730)", () => {
    const code = snippet();
    expect(code).toContain("panelHeaderProps={PANEL_HEADER_PROPS}");
    expect(code).toContain("const PANEL_HEADER_PROPS = {");
    expect(code).toContain("title: (item) =>");
    expect(code).toContain("headerDetails: {");
    const bare = snippet({ headerDetails: false });
    expect(bare).not.toContain("headerDetails:");
    expect(bare).toContain("title: (item) =>");
    expect(snippet({ panelHeaderProps: false })).not.toContain("PANEL_HEADER_PROPS");
  });

  it("names the kit components it actually printed", () => {
    const imports = (code: string): string[] => {
      const line = code.match(/import \{([^}]*)\} from "@cjlapao\/ui-kit";/);
      expect(line).not.toBeNull();
      return (line?.[1] ?? "").split(",").map((name) => name.trim());
    };
    expect(imports(snippet())).toEqual(expect.arrayContaining(["SplitView"]));
    expect(imports(snippet({ subItems: false, headerDetails: false }))).not.toContain(
      "Pill",
    );
    expect(imports(snippet({ subItems: true }))).toContain("Pill");
    expect(imports(snippet({ listActions: true }))).toContain("Button");
  });

  it("keeps the dead fields out of the rows it prints (:123)", () => {
    const block = itemsBlock(snippet());
    for (const dead of ["tags:", "panelTitle", "badge:", "divider:"]) {
      expect(block, dead).not.toContain(dead);
    }
  });

  it("documents everything it prints, in every state", () => {
    const table = documented();
    for (const [name, changes] of EVERY_STATE) {
      for (const attribute of attributes(snippet(changes))) {
        expect(table, `${name}: ${attribute}`).toContain(attribute);
      }
    }
  });

  it("gives every config prop a row in the table", () => {
    const table = documented();
    for (const field of splitViewConfig.fields) {
      if (field.prop === null || field.prop === undefined) continue;
      expect(table, `${field.id} → ${field.prop}`).toContain(field.prop);
    }
  });

  it("keeps the attributes in the order the controls are listed", () => {
    const printed = attributes(
      snippet({
        listActions: true,
        resizable: true,
        variant: "glass",
        panelHeader: true,
        loading: true,
        loaderType: "progress",
      }),
    );
    // The data source's own attribute leads, the way `props()` puts data first.
    const order = ["items"].concat(
      splitViewConfig.fields
        .filter((field) => printed.includes(field.prop ?? field.id))
        .map((field) => field.prop ?? field.id),
    );
    expect(printed).toEqual(order);
  });

  it("keeps what the component owns out of the tag", () => {
    const code = snippet({ resizable: true, loading: true, error: true });
    for (const own of [
      "filter=",
      "internalValue",
      "autoHideList",
      "shouldHideList",
      "data-",
      "onItemClick",
      "listHeader",
      "promoteItemActions",
    ]) {
      expect(code, own).not.toContain(own);
    }
  });
});
