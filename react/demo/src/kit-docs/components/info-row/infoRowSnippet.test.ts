import { describe, expect, it } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { infoRowConfig } from "./infoRowPlayground";
import { infoRowCode } from "./InfoRowPlayground";
import { INFOROW_PROPS } from "./InfoRowPage";
import { SUB_ITEMS } from "./infoRowFixture";
import {
  COLLAPSE_OFF,
  COLLAPSE_ON,
  COUNT_NUMBER,
  CUSTOM_PLACEHOLDER,
  DIGEST_TEXT,
  EMPTY_TEXT_DEFAULT,
  ERROR_TEXT,
  EXPAND_OPEN,
  EXPAND_SHUT,
  FIXED_LABEL_WIDTH,
  GROW,
  LOADER_DEFAULT,
  NO_PLACEHOLDER,
  TONE_DEFAULT,
  VALUE_BOOLEAN,
  VALUE_COUNT,
  VALUE_DIGEST,
  VALUE_EMPTY,
  VALUE_NODE,
  VARIANT_DEFAULT,
} from "./infoRowStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is this page's claim about a 1016-line component, so it is tested as
 * a claim: the label always arrives, the four shapes of `value` print as the four
 * types they are, the kit's own defaults stay home, and nothing the component
 * decides for itself — the truncation it measured, the confirmation it is running,
 * the region id it minted — leaks into the tag the reader is handed.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of infoRowConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(infoRowConfig, state);
  return infoRowCode({ state, data: {}, h });
};

/** The `<InfoRow …>` tag itself, so a hoisted const's props cannot read as its own. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<InfoRow");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<InfoRow".length;
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
  for (const prop of INFOROW_PROPS) {
    if (prop.name.startsWith("…")) continue;
    for (const part of prop.name.split(" / ")) names.add(part.trim());
  }
  return names;
};

/** Every lever at a value that differs from its default, so nothing can hide. */
const EVERY_STATE: Array<[string, Partial<PlaygroundState>]> = [
  ["at rest", {}],
  ["a number", { value: VALUE_COUNT }],
  ["a boolean", { value: VALUE_BOOLEAN }],
  ["a node", { value: VALUE_NODE }],
  ["nothing", { value: VALUE_EMPTY, subItems: true }],
  ["no placeholder", { value: VALUE_EMPTY, emptyText: NO_PLACEHOLDER }],
  ["a written placeholder", { value: VALUE_EMPTY, emptyText: CUSTOM_PLACEHOLDER }],
  ["monospace", { mono: true }],
  ["wrapping", { wrap: true, tooltipOnTruncate: false }],
  ["no copy button", { copyable: false }],
  ["a copy report", { onCopy: true }],
  ["a growing label", { labelWidth: GROW }],
  ["a fixed label", { labelWidth: FIXED_LABEL_WIDTH }],
  ["sized columns", { labelSize: "sm", valueSize: "lg" }],
  ["its own colour", { valueClassName: true }],
  ["a chosen surface", { variant: "tonal", tone: "emerald", size: "lg" }],
  ["glass", { variant: "glass", glassOpacity: "clear", vibrancy: "high", transparency: "low" }],
  ["liquid", { variant: "liquid-glass" }],
  ["square", { corner: "none" }],
  ["raised", { raisedSurface: true }],
  ["flat and ruleless", { variant: "none", padding: "none", noBorder: true, noPadding: true }],
  ["hoverable", { hoverable: true }],
  ["a ruled table", { variant: "simple", bottomBorder: true }],
  ["an icon of its own", { icon: "Key", iconClassName: true }],
  ["sub-items", { subItems: true }],
  ["a body", { body: true }],
  ["a forced toggle", { collapsible: COLLAPSE_ON }],
  ["a body that cannot fold", { body: true, collapsible: COLLAPSE_OFF }],
  ["host-opened", { body: true, expanded: EXPAND_OPEN }],
  ["host-folded", { body: true, expanded: EXPAND_SHUT }],
  ["a toggle report", { body: true, expandReport: true }],
  ["starting open", { body: true, defaultExpanded: true }],
  ["loading", { loading: true }],
  ["a spinner", { loading: true, loaderType: "spinner" }],
  ["broken", { error: true, errorText: ERROR_TEXT }],
  ["a hidden blank", { value: VALUE_EMPTY, hideIfEmpty: false }],
];

describe("infoRow snippet", () => {
  it("always passes the label, because a row without one says nothing", () => {
    for (const [name, changes] of EVERY_STATE) {
      expect(attributes(snippet(changes)), name).toContain("label");
    }
    expect(openingTag(snippet())).toContain('label="Image digest"');
  });

  it("prints the one prop's four types as the four types they are (:312-329)", () => {
    expect(snippet({ value: VALUE_DIGEST })).toContain(`value="${DIGEST_TEXT}"`);
    expect(snippet({ value: VALUE_COUNT })).toContain(`value={${COUNT_NUMBER}}`);
    expect(snippet({ value: VALUE_BOOLEAN })).toContain("value={true}");
    expect(snippet({ value: VALUE_NODE })).toContain("value={<STATUS_NODE />}");
    expect(snippet({ value: VALUE_EMPTY })).toContain('value=""');
  });

  it("hoists the node it prints, and only when it prints one", () => {
    const code = snippet({ value: VALUE_NODE });
    expect(code).toContain("const STATUS_NODE = <Pill");
    expect(code).toContain("healthy");
    expect(snippet()).not.toContain("const STATUS_NODE");
  });

  it("keeps the em dash home and prints a placeholder only when it differs", () => {
    expect(snippet({ value: VALUE_EMPTY })).not.toContain("emptyText");
    expect(snippet({ value: VALUE_EMPTY, emptyText: NO_PLACEHOLDER })).toContain(
      "emptyText={null}",
    );
    expect(
      snippet({ value: VALUE_EMPTY, emptyText: CUSTOM_PLACEHOLDER }),
    ).toContain(`emptyText="${CUSTOM_PLACEHOLDER}"`);
    // The default option is the component's own value (:378), not a claim about it.
    expect(snippet({ value: VALUE_EMPTY, emptyText: EMPTY_TEXT_DEFAULT })).not.toContain(
      "emptyText",
    );
  });

  it("suppresses every documented default the component already applies", () => {
    for (const name of [
      "variant",
      "tone",
      "size",
      "padding",
      "corner",
      "raisedSurface",
      "glassOpacity",
      "vibrancy",
      "transparency",
      "hoverable",
      "noBorder",
      "noPadding",
      "bottomBorder",
      "icon",
      "iconClassName",
      "labelWidth",
      "labelSize",
      "valueSize",
      "valueClassName",
      "collapsible",
      "expanded",
      "onToggle",
      "defaultExpanded",
      "loading",
      "loaderType",
      "error",
      "mono",
      "wrap",
      "subItems",
      "body",
      "onCopy",
    ]) {
      expect(attributes(snippet()), name).not.toContain(name);
    }
  });

  it("prints a documented default only as the exception it is", () => {
    // `copyable`, `tooltipOnTruncate` and `hideIfEmpty` are default-true (:375,:380,:913),
    // so the only interesting thing to say about them is that they are off.
    expect(snippet({ copyable: false })).toContain("copyable={false}");
    expect(snippet({ tooltipOnTruncate: false })).toContain("tooltipOnTruncate={false}");
    expect(snippet({ hideIfEmpty: false })).toContain("hideIfEmpty={false}");
    expect(snippet({ copyable: true })).not.toContain("copyable=");
  });

  it("prints the flags the component reads as bare names (:605,:613,:620,:629)", () => {
    const code = snippet({
      mono: true,
      wrap: true,
      hoverable: true,
      noBorder: true,
      noPadding: true,
      bottomBorder: true,
      loading: true,
    });
    for (const name of [
      "mono",
      "wrap",
      "hoverable",
      "noBorder",
      "noPadding",
      "bottomBorder",
      "loading",
    ]) {
      expect(code, name).toContain(`${name}\n`);
    }
  });

  it("prints a chosen union quoted the way the union spells it", () => {
    const code = snippet({
      variant: "tonal",
      tone: "emerald",
      size: "lg",
      padding: "none",
      corner: "rounded-lg",
      loaderType: "spinner",
      loading: true,
    });
    expect(code).toContain('variant="tonal"');
    expect(code).toContain('tone="emerald"');
    expect(code).toContain('size="lg"');
    expect(code).toContain('padding="none"');
    expect(code).toContain('corner="rounded-lg"');
    expect(code).toContain('loaderType="spinner"');
  });

  it("never prints the word auto to the component", () => {
    const code = snippet({
      labelWidth: "",
      labelSize: "",
      valueSize: "",
      padding: "",
      corner: "",
      icon: "",
      glassOpacity: "",
      vibrancy: "",
      transparency: "",
      expanded: "auto",
    });
    for (const name of [
      "labelWidth",
      "labelSize",
      "valueSize",
      "padding",
      "corner",
      "icon",
      "glassOpacity",
      "vibrancy",
      "transparency",
      "expanded",
    ]) {
      expect(code, name).not.toContain(`${name}=`);
    }
    expect(code).not.toContain("auto");
  });

  it("says the three things the label column can mean (:657-659)", () => {
    expect(snippet({ labelWidth: GROW })).toContain('labelWidth=""');
    expect(snippet({ labelWidth: FIXED_LABEL_WIDTH })).toContain(
      `labelWidth="${FIXED_LABEL_WIDTH}"`,
    );
    expect(snippet()).not.toContain("labelWidth");
  });

  it("keeps the glass trio off a surface that has no glass in it (:992-1004)", () => {
    const glassy = snippet({
      variant: "glass",
      glassOpacity: "clear",
      vibrancy: "high",
      transparency: "low",
    });
    expect(glassy).toContain('glassOpacity="clear"');
    expect(glassy).toContain('vibrancy="high"');
    expect(glassy).toContain('transparency="low"');
    const opaque = snippet({
      variant: "elevated",
      glassOpacity: "clear",
      vibrancy: "high",
      transparency: "low",
    });
    expect(opaque).not.toContain("glassOpacity");
    expect(opaque).not.toContain("vibrancy");
    expect(opaque).not.toContain("transparency");
  });

  it("gives a plain row the card it cannot draw for itself (:980-990)", () => {
    const code = snippet({ variant: "plain" });
    expect(code).toContain("<Panel");
    expect(code).toContain('variant="outlined"');
    expect(code).toContain("scrollable={false}");
    expect(code).toContain("</Panel>");
    expect(code).toContain("import { InfoRow, Panel }");
    expect(snippet()).not.toContain("<Panel");
    expect(snippet()).toContain('import { InfoRow } from "@cjlapao/ui-kit";');
  });

  it("hoists the sub-items together with the attribute that names them", () => {
    const code = snippet({ subItems: true });
    expect(code).toContain("subItems={SUB_ITEMS}");
    expect(code).toContain("const SUB_ITEMS = [");
    for (const item of SUB_ITEMS) {
      if (item.text) expect(code).toContain(`"${item.text}"`);
      if (typeof item.value === "string" && item.value !== "") {
        expect(code).toContain(`"${item.value}"`);
      }
    }
    const bare = snippet();
    expect(bare).not.toContain("subItems");
    expect(bare).not.toContain("SUB_ITEMS");
  });

  it("prints a body as the node it replaces, hoisted above the demo", () => {
    const code = snippet({ body: true });
    expect(code).toContain("body={<BODY />}");
    expect(code).toContain("const BODY = <ul");
    expect(code).toContain("Pushed by the release pipeline");
    expect(code.indexOf("const BODY")).toBeLessThan(
      code.indexOf("export default function Demo()"),
    );
    expect(snippet()).not.toContain("BODY");
  });

  it("keeps a row that cannot fold from printing disclosure props (:450,:455)", () => {
    const sealed = snippet({ body: true, collapsible: COLLAPSE_OFF });
    expect(sealed).toContain("collapsible={false}");
    expect(sealed).toContain("body={<BODY />}");
    expect(sealed).not.toContain("expanded");
    expect(sealed).not.toContain("defaultExpanded");
    expect(sealed).not.toContain("onToggle");
  });

  it("asks the disclosure questions only of a disclosure (:449-452)", () => {
    const forced = snippet({ collapsible: COLLAPSE_ON });
    expect(forced).toContain("collapsible");
    // No body: the region is never rendered, so the printer still says nothing about
    // how it would open — and the page says why the aria-controls dangles.
    expect(forced).not.toContain("expanded");

    const reported = snippet({ body: true, expandReport: true });
    expect(reported).toContain("onToggle={(next) => setExpanded(next)}");
    expect(reported).toContain("const [expanded, setExpanded] = useState(false);");
    expect(reported).toContain('import { useState } from "react";');
    // A report the demo never reads back would be a claim the code does not make.
    expect(reported).toContain("expanded={expanded}");

    expect(snippet({ body: true, expanded: EXPAND_OPEN })).toContain("expanded={true}");
    expect(snippet({ body: true, expanded: EXPAND_SHUT })).toContain("expanded={false}");
    expect(snippet({ body: true })).not.toContain("useState");
  });

  it("prints the loader the reader can actually see (:382,:681-701)", () => {
    expect(snippet({ loading: true })).not.toContain("loaderType");
    expect(snippet({ loading: true, loaderType: LOADER_DEFAULT })).not.toContain(
      "loaderType",
    );
    expect(snippet({ loading: true, loaderType: "spinner" })).toContain(
      'loaderType="spinner"',
    );
    // The loader choice is invisible while nothing is loading, so it cannot print.
    expect(snippet({ loaderType: "spinner" })).not.toContain("loaderType");
  });

  it("prints the message the reader typed, not the placeholder it showed", () => {
    expect(snippet({ error: true })).toContain(`error={"${ERROR_TEXT}"}`);
    expect(snippet({ error: true, errorText: "Quota exceeded" })).toContain(
      'error={"Quota exceeded"}',
    );
    // An empty message falls back to the page's own sentence, not to `""`.
    expect(snippet({ error: true, errorText: "   " })).toContain(
      `error={"${ERROR_TEXT}"}`,
    );
    expect(snippet({ errorText: "Quota exceeded" })).not.toContain("error=");
  });

  it("names the kit components it actually printed", () => {
    const imports = (code: string): string[] => {
      const line = code.match(/import \{([^}]*)\} from "@cjlapao\/ui-kit";/);
      expect(line).not.toBeNull();
      return (line?.[1] ?? "").split(",").map((name) => name.trim());
    };
    expect(imports(snippet())).toEqual(["InfoRow"]);
    expect(imports(snippet({ value: VALUE_NODE }))).toContain("Pill");
    expect(imports(snippet({ value: VALUE_DIGEST }))).not.toContain("Pill");
    expect(imports(snippet({ variant: "plain" }))).toContain("Panel");
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
    for (const field of infoRowConfig.fields) {
      if (field.prop === null || field.prop === undefined) continue;
      expect(table, `${field.id} → ${field.prop}`).toContain(field.prop);
    }
  });

  it("keeps the attributes in the order the controls are listed", () => {
    const printed = attributes(
      snippet({
        subItems: true,
        variant: "glass",
        glassOpacity: "clear",
        icon: "Key",
        body: true,
        loading: true,
        loaderType: "spinner",
        error: true,
      }),
    );
    // The data source's own attribute leads, the way `props()` puts data first.
    const order = ["subItems"].concat(
      infoRowConfig.fields
        .map((field) => field.prop ?? null)
        .filter((prop): prop is string => prop !== null)
        .filter((prop) => printed.includes(prop)),
    );
    expect(printed).toEqual(order);
  });

  it("keeps what the component owns out of the tag", () => {
    const code = snippet({
      body: true,
      collapsible: COLLAPSE_ON,
      loading: true,
      error: true,
      tooltipOnTruncate: true,
    });
    for (const own of [
      "data-",
      "aria-",
      "inert",
      "copyState",
      "truncated",
      "dismissed",
      "contentId",
      "headerId",
      "role=",
      "tabIndex",
      "onMouseEnter",
      "onKeyDown",
      "subContent",
      "panelTitle",
      "InfoRowSection",
    ]) {
      expect(code, own).not.toContain(own);
    }
  });

  it("prints the tone the component destructures, not the one its JSDoc claims (:116,:388)", () => {
    // The default option is the runtime value, so a default snippet says nothing —
    // if the JSDoc's "blue" were the truth, this state would print it.
    expect(TONE_DEFAULT).toBe("none");
    expect(snippet()).not.toContain("tone");
    expect(snippet({ tone: "blue" })).toContain('tone="blue"');
    // …and the surface default is what a bare <InfoRow> really gets (:914).
    expect(VARIANT_DEFAULT).toBe("elevated");
    expect(snippet()).not.toContain("variant");
  });
});
