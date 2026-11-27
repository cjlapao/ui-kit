import { describe, it, expect } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { accordionConfig } from "./accordionPlayground";
import { accordionCode } from "./AccordionPlayground";
import { ACCORDION_PROPS } from "./AccordionPage";
import { ROWS } from "./accordionStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * Accordion's snippet.
 *
 * Two axes decide what the reader copies, and the prop list cannot state either:
 * the open set is printed as `defaultOpenIds` in one mode and `openIds` (plus
 * `onChange`) in the other — presence of the prop is what decides the mode, not
 * its contents (useAccordion.ts:29) — and everything the rows are made of lives
 * inside the printed `ITEMS` literal, so a lever the reader turned off has to
 * disappear from that literal too. These tests are the guard for both.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  // Every field carries the component's own default (:481-505); the cast is for
  // the type, which has no undefined, not for the data.
  for (const field of accordionConfig.fields)
    state[field.id] = field.default as PlaygroundValue;
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const data = Object.fromEntries(
    (accordionConfig.data ?? []).map((source) => [
      source.id,
      source.when
        ? source.when(state)
          ? source.value(state)
          : ""
        : source.value(state),
    ]),
  );
  return accordionCode({
    state,
    data,
    h: createEmitter(accordionConfig, state),
  });
};

/** The element itself — comments, declarations and children excluded. */
const tagOf = (code: string): string => {
  const open = code.indexOf("<Accordion");
  return code.slice(open, code.indexOf(">", open) + 1);
};

/** Attribute names on the printed element, in printed order. */
const attributes = (code: string): string[] => {
  const tag = tagOf(code);
  const named = [...tag.matchAll(/([A-Za-z]\w*)=(?:"|\{)/g)].map((m) => m[1]);
  const flags = tag
    .replace(/[A-Za-z]\w*=(?:"[^"]*"|\{[^}]*\})/g, "")
    .match(/(^|\s)([A-Za-z]\w*)(?=\s|>)/g)
    ?.map((flag) => flag.trim())
    .filter((flag) => flag !== "Accordion");
  return [...named, ...(flags ?? [])];
};

/** One item's lines, sliced out of the printed `ITEMS` literal by its id. */
const itemBlock = (code: string, id: string): string => {
  const start = code.indexOf(`id: "${id}"`);
  if (start === -1) return "";
  return code.slice(start, code.indexOf("}", start) + 1);
};

/** Every prop name the API table documents, composite rows split apart. */
const documented = (): string[] =>
  ACCORDION_PROPS.flatMap((row) =>
    row.name
      .replace(/^[a-z]+:\s*/, "")
      .split("/")
      .map((part) => part.trim().replace(/[^A-Za-z]\w*$/, ""))
      .filter((part) => part && !part.startsWith("…")),
  );

describe("the opening", () => {
  it("prints the rows, the seed and the name — nothing the component answers", () => {
    // elevated, tone none, rounded-md, sm, md density, chevron on the right,
    // animated, single-open, everything enabled are the component's own answers
    // (:481-505), so the honest opening carries only what the docs chose.
    expect(attributes(snippet())).toEqual(["items", "defaultOpenIds", "ariaLabel"]);
  });

  it("declares the fixture and points the prop at it", () => {
    const code = snippet();
    expect(code).toContain("const ITEMS = [");
    expect(tagOf(code)).toContain("items={ITEMS}");
    expect(code).toContain("Button");
    expect((code.match(/^ {4}id: "/gm) ?? []).length).toBe(3);
  });

  it("keeps the card's surface answers out while they are still defaults", () => {
    const tag = tagOf(snippet());
    for (const prop of [
      "variant",
      "tone",
      "corner",
      "padding",
      "raisedSurface",
      "hoverable",
      "transparency",
      "loading",
      "loaderType",
    ]) {
      expect(tag, prop).not.toContain(prop);
    }
  });

  it("follows the row levers into the literal, not onto the tag", () => {
    const code = snippet({
      withIcons: false,
      withBadge: false,
      withDescription: true,
      oneDisabled: true,
      oneLoading: true,
    });
    for (const lever of [
      "withIcons",
      "withBadge",
      "withDescription",
      "oneDisabled",
      "oneLoading",
    ]) {
      expect(code, lever).not.toMatch(new RegExp(`\\b${lever}=`));
    }
    expect(itemBlock(code, "us-east")).not.toContain("icon:");
    expect(itemBlock(code, "us-east")).not.toContain("badge:");
    expect(itemBlock(code, "us-east")).toContain("description:");
    expect(itemBlock(code, "us-east")).toContain("loading: true");
    expect(itemBlock(code, "eu-central")).toContain("disabled: true");
    // Only the second row is disabled, so the list-level prop stays silent.
    expect(tagOf(code)).not.toMatch(/\bdisabled/);
  });

  it("prints an empty list as an empty list", () => {
    // Zero rows is the component's EmptyState branch (:213-226): no seed to
    // print, no action to import, and the array is the only attribute with a
    // decision in it.
    const code = snippet({ itemCount: 0 });
    expect(code).toContain("const ITEMS = [];");
    expect(tagOf(code)).not.toContain("defaultOpenIds");
    expect(code).not.toMatch(/import \{[^}]*Button/);
  });
});

describe("the open set is one decision, printed two ways", () => {
  it("hands the uncontrolled list a seed and no handler", () => {
    const code = snippet();
    expect(tagOf(code)).toContain('defaultOpenIds={["us-east"]}');
    expect(code).not.toMatch(/openIds=\{|onChange=/);
  });

  it("pairs the controlled array with the handler that lets it move", () => {
    const code = snippet({ mode: "controlled" });
    expect(code).toContain('openIds={["us-east"]}');
    expect(code).toContain("onChange={handleOpenIds}");
    expect(code).toMatch(/const handleOpenIds = \(next: string\[\]\) => \{/);
  });

  it("prints an empty controlled array as an answer, not an absence", () => {
    // Presence decides the mode (useAccordion.ts:29), so `[]` is a real state.
    const code = snippet({ mode: "controlled", startOpen: "none" });
    expect(code).toContain("openIds={[]}");
  });

  it("prints nothing at all when an uncontrolled list starts closed", () => {
    // `defaultOpenIds ?? []` (useAccordion.ts:26) — the component's own answer.
    expect(tagOf(snippet({ startOpen: "none" }))).not.toMatch(
      /defaultOpenIds|openIds/,
    );
  });

  it("lists the rows that exist, not the rows it imagines", () => {
    const all = snippet({ startOpen: "all", itemCount: 4 });
    for (const row of ROWS) expect(all).toContain(`"${row.id}"`);
    // Two rows visible, two ids printed — the third and fourth are not in the tag.
    const trimmed = snippet({ startOpen: "all", itemCount: 2 });
    expect(trimmed).toContain('defaultOpenIds={["us-east", "eu-central"]}');
    expect(trimmed).not.toContain('"ap-southeast"');
  });

  it("never lets the two modes speak at once", () => {
    const controlled = tagOf(snippet({ mode: "controlled", startOpen: "all" }));
    expect(controlled).not.toContain("defaultOpenIds");
    const uncontrolled = tagOf(snippet({ mode: "uncontrolled" }));
    expect(uncontrolled).not.toMatch(/openIds=\{|onChange=/);
  });

  it("still prints the array when the handler is dropped", () => {
    const code = snippet({ mode: "controlled", onChange: false });
    expect(code).toContain('openIds={["us-east"]}');
    expect(code).not.toContain("handleOpenIds");
  });

  it("adds the per-row handler on its own terms", () => {
    const code = snippet({ onItemToggle: true });
    expect(code).toContain("onItemToggle={handleItemToggle}");
    expect(code).toMatch(/const handleItemToggle = \(id: string/);
    expect(snippet()).not.toContain("onItemToggle");
  });
});

describe("rows, density and the loader", () => {
  it("prints density and indicator only when they leave the defaults", () => {
    expect(tagOf(snippet())).not.toMatch(/size=|indicator|animated/);
    expect(snippet({ size: "lg" })).toContain('size="lg"');
    expect(snippet({ indicator: "plus-minus" })).toContain(
      'indicator="plus-minus"',
    );
    expect(snippet({ animated: false })).toContain("animated={false}");
  });

  it("drops the side with the indicator it would place", () => {
    // :351,425 render nothing when indicator is "none", so there is no side.
    expect(snippet({ indicator: "none", indicatorPlacement: "left" })).not.toMatch(
      /indicatorPlacement/,
    );
    expect(snippet({ indicator: "none" })).toContain('indicator="none"');
    expect(snippet({ indicatorPlacement: "left" })).toContain(
      'indicatorPlacement="left"',
    );
  });

  it("keeps loaderType with the loading that reads it", () => {
    // Panel only consults loaderType while loading is true (Panel.tsx:1217,1487).
    expect(tagOf(snippet({ loaderType: "spinner" }))).not.toMatch(/loaderType|loading/);
    const skeleton = snippet({ loading: true });
    expect(skeleton).toMatch(/\bloading\b/);
    expect(skeleton).not.toContain("loaderType");
    expect(snippet({ loading: true, loaderType: "spinner" })).toContain(
      'loaderType="spinner"',
    );
  });

  it("says so when the list is switched to several-open and to disabled", () => {
    expect(tagOf(snippet())).not.toMatch(/\bmultiple|\bdisabled/);
    expect(snippet({ multiple: true })).toContain("multiple");
    expect(snippet({ disabled: true })).toContain("disabled");
  });

  it("keeps the group named", () => {
    // No fallback exists for the group's accessible name (:290).
    expect(snippet()).toContain('ariaLabel="Cloud regions"');
    expect(tagOf(snippet({ ariaLabel: "   " }))).not.toContain("ariaLabel");
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const rows = documented();
    for (const state of [
      {},
      { mode: "controlled" },
      { mode: "controlled", onChange: false, startOpen: "none" },
      { mode: "controlled", startOpen: "all", multiple: true },
      {
        variant: "liquid-glass",
        tone: "amber",
        vibrancy: "high",
        glassOpacity: "clear",
        specularMode: "halo",
        transparency: "medium",
        raisedSurface: true,
        hoverable: true,
      },
      { loading: true, loaderType: "spinner", disabled: true, animated: false },
      { indicator: "none", size: "xs", onItemToggle: true, itemCount: 0 },
      { withActions: false, withIcons: false, oneDisabled: true, oneLoading: true },
    ]) {
      for (const attribute of attributes(snippet(state))) {
        expect(rows, `${attribute} from ${JSON.stringify(state)}`).toContain(
          attribute,
        );
      }
    }
  });

  it("documents every prop the playground can speak for", () => {
    const printed = new Set(
      accordionConfig.fields
        .filter((field) => field.prop !== null)
        .map((field) => field.prop ?? field.id),
    );
    for (const source of accordionConfig.data ?? []) {
      if (source.prop !== null) printed.add(source.prop ?? source.id);
    }
    for (const name of printed) expect(documented(), name).toContain(name);
  });

  it("keeps the playground's own vocabulary out of the source", () => {
    const code = snippet({
      mode: "controlled",
      startOpen: "all",
      withActions: true,
      withIcons: true,
      oneLoading: true,
    });
    // Levers, not props: they never reach the reader's code as attributes.
    for (const lever of [
      "mode",
      "startOpen",
      "itemCount",
      "withIcons",
      "withBadge",
      "withDescription",
      "withActions",
      "oneDisabled",
      "oneLoading",
    ]) {
      expect(code, lever).not.toMatch(new RegExp(`\\b${lever}=`));
    }
    // The docs' captions are not strings in the reader's code.
    expect(code).not.toContain("Auto —");
  });
});
