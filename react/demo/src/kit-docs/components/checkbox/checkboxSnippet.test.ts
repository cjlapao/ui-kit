import { describe, expect, it } from "vitest";
import { createEmitter } from "../../shared/playground/emit";
import { checkboxConfig } from "./checkboxPlayground";
import { checkboxCode } from "./CheckboxPlayground";
import { CHECKBOX_PROPS } from "./CheckboxPage";
import {
  ALIGN_DEFAULT,
  DESCRIPTION_EXAMPLE,
  INPUT_CLASS_EXAMPLE,
  LABEL_DEFAULT,
  MESSAGE_EXAMPLE,
  PLACEMENT_DEFAULT,
  SIZE_DEFAULT,
  TONE_DEFAULT,
  VALIDATION_DEFAULT,
  VARIANT_DEFAULT,
} from "./checkboxStage";
import type {
  PlaygroundState,
  PlaygroundValue,
} from "../../shared/playground/schema";

/**
 * The snippet is this page's claim about a 444-line component, so it is tested as a
 * claim: a checkbox at rest asks for one thing — a name — every attribute that appears
 * is a row of the API table, and nothing the component decides for itself (the `type`
 * it renders, the `aria-hidden` it stamps on its own drawings, the `peer-*` classes
 * that light the box up) leaks into the tag a reader is handed.
 */

const seeds = (): PlaygroundState => {
  const state: PlaygroundState = {};
  for (const field of checkboxConfig.fields) {
    state[field.id] = field.default as PlaygroundValue;
  }
  return state;
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign(seeds(), changes) as PlaygroundState;
  const h = createEmitter(checkboxConfig, state);
  return checkboxCode({ state, data: {}, h });
};

/** The `<Checkbox …>` tag itself, so the wrapper's markup cannot read as its own. */
const openingTag = (code: string): string => {
  const start = code.indexOf("<Checkbox");
  expect(start).toBeGreaterThanOrEqual(0);
  const tag = code.slice(start);
  const head = "<Checkbox".length;
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
  for (const prop of CHECKBOX_PROPS) {
    if (prop.name.startsWith("…")) continue;
    for (const part of prop.name.split(" / ")) names.add(part.trim());
  }
  return names;
};

/** One decision per knob — the states a reader can actually arrive at. */
const EVERY_STATE: Array<[string, Partial<PlaygroundState>]> = [
  ["variant", { variant: "elevated" }],
  ["size", { size: "lg" }],
  ["controlAlign", { controlAlign: "right" }],
  ["fullWidth", { fullWidth: true }],
  ["tone", { tone: "emerald" }],
  ["legacyColor", { tone: "emerald", legacyColor: true }],
  ["label", { label: "Weekly digest" }],
  ["description", { description: DESCRIPTION_EXAMPLE }],
  ["descriptionPlacement", { description: DESCRIPTION_EXAMPLE, descriptionPlacement: "inline" }],
  ["required", { required: true }],
  ["aria-label", { ariaLabel: "Subscribe to the digest" }],
  ["validationStatus", { validationStatus: "error" }],
  ["validationMessage", { validationStatus: "error", validationMessage: MESSAGE_EXAMPLE }],
  ["indeterminate", { indeterminate: true }],
  ["defaultChecked", { defaultChecked: true }],
  ["controlled", { controlled: true }],
  ["disabled", { disabled: true }],
  ["inputClassName", { inputClassName: INPUT_CLASS_EXAMPLE }],
];

/** Every lever at once, which is also the only tag long enough to wrap. */
const HEAVY: Partial<PlaygroundState> = {
  variant: "elevated",
  size: "lg",
  controlAlign: "right",
  fullWidth: true,
  tone: "emerald",
  label: "Weekly digest",
  description: DESCRIPTION_EXAMPLE,
  descriptionPlacement: "inline",
  required: true,
  ariaLabel: "Subscribe to the digest",
  validationStatus: "error",
  validationMessage: MESSAGE_EXAMPLE,
  indeterminate: true,
  defaultChecked: true,
  disabled: true,
  inputClassName: INPUT_CLASS_EXAMPLE,
};

describe("checkbox snippet", () => {
  it("asks for one thing at rest — the name — and nothing else", () => {
    expect(attributes(snippet())).toEqual(["label"]);
  });

  it("does not print the documented defaults", () => {
    const code = snippet();
    for (const absent of [
      'variant="',
      'size="',
      'controlAlign="',
      'descriptionPlacement="',
      'validationStatus="',
      "fullWidth",
      "required",
      "indeterminate",
      "disabled",
      'tone="',
      'color="',
    ]) {
      expect(code, `default state prints ${absent}`).not.toContain(absent);
    }
  });

  it("prints a decision for each of them once it is made", () => {
    expect(snippet({ variant: "elevated" })).toContain('variant="elevated"');
    expect(snippet({ size: "lg" })).toContain('size="lg"');
    expect(snippet({ controlAlign: "right" })).toContain('controlAlign="right"');
    expect(snippet({ validationStatus: "error" })).toContain(
      'validationStatus="error"',
    );
    expect(snippet({ description: DESCRIPTION_EXAMPLE, descriptionPlacement: "inline" })).toContain(
      'descriptionPlacement="inline"',
    );
  });

  it("spells the colour the deprecated way when asked to", () => {
    expect(snippet({ tone: "emerald" })).toContain('tone="emerald"');
    expect(snippet({ tone: "emerald", legacyColor: true })).toContain(
      'color="emerald"',
    );
    expect(snippet({ tone: "emerald", legacyColor: true })).not.toContain("tone=");
  });

  it("prints a bare flag, never `={true}`", () => {
    const code = snippet({ fullWidth: true });
    expect(code).toMatch(/\sfullWidth(?=[ \/>])/);
    expect(code).not.toContain("fullWidth={true}");
    expect(code).not.toContain('fullWidth=""');
  });

  it("keeps the tri-state a claim about the box, not about checked", () => {
    const code = snippet({ indeterminate: true });
    expect(code).toMatch(/\sindeterminate(?=[ \/>])/);
    expect(code).not.toContain("defaultChecked");
    expect(code).not.toMatch(/\schecked=/);
  });

  it("treats `defaultChecked` as the uncontrolled seed it is", () => {
    expect(snippet({ defaultChecked: true })).toMatch(/\sdefaultChecked(?=[ \/>])/);
    // A controlled input ignores the seed, so the tag must not claim both (:295).
    const both = snippet({ defaultChecked: true, controlled: true });
    expect(both).not.toContain("defaultChecked");
    expect(both).toContain("checked={isOn}");
  });

  it("pairs a controlled box with the state it needs", () => {
    const code = snippet({ controlled: true });
    expect(code).toContain("checked={isOn}");
    expect(code).toContain("onChange={(event) => setIsOn(event.target.checked)}");
    expect(code).toContain('import { useState } from "react";');
    expect(code).toContain("const [isOn, setIsOn] = useState(false);");
  });

  it("hides the fields that belong to a state the reader has not asked for", () => {
    expect(snippet()).not.toContain("descriptionPlacement");
    expect(snippet()).not.toContain("validationMessage");
    expect(
      snippet({ description: DESCRIPTION_EXAMPLE, descriptionPlacement: "inline" }),
    ).toContain('descriptionPlacement="inline"');
    expect(snippet({ validationStatus: "error" })).toContain("validationMessage=");
  });

  it("quotes the caller's strings and nothing else", () => {
    const code = snippet({ label: 'Weekly & "monthly" digest' });
    expect(code).toContain('label="Weekly & \\"monthly\\" digest"');
    // The only braces on the tag would be an expression; the label stayed a string.
    expect(openingTag(code)).not.toContain("{");
  });

  it("prints the label even at its example value, because it is the name", () => {
    expect(snippet()).toContain(`label="${LABEL_DEFAULT}"`);
    expect(snippet({ label: "" })).not.toContain("label=");
  });

  it("names the aria-label only when someone typed one", () => {
    expect(snippet()).not.toContain("aria-label");
    expect(snippet({ ariaLabel: "Subscribe" })).toContain('aria-label="Subscribe"');
  });

  it("calls the box's class what the component calls it", () => {
    expect(snippet({ inputClassName: INPUT_CLASS_EXAMPLE })).toContain(
      `inputClassName="${INPUT_CLASS_EXAMPLE}"`,
    );
  });

  it("says nothing the component decides for itself", () => {
    const leaks = [
      "type",
      "role",
      "class",
      "className",
      "data-state",
      "aria-hidden",
      "aria-checked",
      "aria-invalid",
      "aria-describedby",
      "peer-checked",
      "peer-indeterminate",
      "peer-focus-visible",
      "opacity-0",
      "htmlFor",
      "useId",
    ];
    const printed = new Set(attributes(snippet(HEAVY)));
    for (const leak of leaks) {
      expect([...printed], `HEAVY prints ${leak}`).not.toContain(leak);
      expect(snippet(HEAVY), `HEAVY prints ${leak}`).not.toContain(leak);
    }
  });

  it("keeps the attributes in the order the config lists them", () => {
    expect(attributes(snippet(HEAVY))).toEqual([
      "variant",
      "size",
      "controlAlign",
      "fullWidth",
      "tone",
      "label",
      "description",
      "descriptionPlacement",
      "required",
      "aria-label",
      "validationStatus",
      "validationMessage",
      "indeterminate",
      "defaultChecked",
      "disabled",
      "inputClassName",
    ]);
  });

  it("prints nothing the API table does not vouch for, in every state", () => {
    const rows = documented();
    const every: Array<[string, Partial<PlaygroundState>]> = [
      ...EVERY_STATE,
      ["everything", HEAVY],
    ];
    for (const [name, changes] of every) {
      for (const attribute of attributes(snippet(changes))) {
        expect(rows.has(attribute), `${name} prints ${attribute}`).toBe(true);
      }
    }
  });

  it("documents every prop the config is allowed to write", () => {
    const rows = documented();
    for (const field of checkboxConfig.fields) {
      if (!field.prop) continue;
      expect(rows.has(field.prop), `${field.id} writes ${field.prop}`).toBe(true);
    }
  });

  it("pins each knob to the component's own default", () => {
    const byId = new Map(checkboxConfig.fields.map((field) => [field.id, field]));
    const pins: Record<string, string> = {
      variant: VARIANT_DEFAULT,
      size: SIZE_DEFAULT,
      controlAlign: ALIGN_DEFAULT,
      descriptionPlacement: PLACEMENT_DEFAULT,
      validationStatus: VALIDATION_DEFAULT,
    };
    for (const [id, documentedValue] of Object.entries(pins)) {
      const field = byId.get(id);
      expect(field, `${id} is a knob`).toBeDefined();
      expect(field?.default, `${id} starts elsewhere`).toBe(documentedValue);
      expect(field?.docDefault, `${id} is not pinned to the doc default`).toBe(
        documentedValue,
      );
    }
    expect(byId.get("tone")?.default).toBe(TONE_DEFAULT);
  });

  it("gives the scratch lever no control and no printed trace", () => {
    const report = checkboxConfig.fields.find((field) => field.id === "report");
    expect(report?.prop).toBeNull();
    expect(report?.when?.({} as PlaygroundState)).toBe(false);
    expect(snippet({ report: "true" })).toBe(snippet());
  });

  it("names only Checkbox", () => {
    const code = snippet(HEAVY);
    expect(code).toContain('import { Checkbox } from "@cjlapao/ui-kit";');
    expect(code.match(/<[A-Z][A-Za-z]*/g)).toEqual(["<Checkbox"]);
  });

  it("wraps the tag rather than printing a wall of attributes", () => {
    const code = snippet(HEAVY);
    expect(code).toMatch(/\n\s+variant="elevated"/);
    expect(code).toMatch(/\n\s+inputClassName="/);
    expect(code).not.toMatch(/ {10,}\w+=/);
  });
});
