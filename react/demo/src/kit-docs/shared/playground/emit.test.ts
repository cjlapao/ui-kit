import { describe, it, expect, vi, afterEach } from "vitest";
import { createElement, Fragment } from "react";
import { createEmitter, defaultDeclarations } from "./emit";
import type {
  PlaygroundConfig,
  PlaygroundDataSource,
  PlaygroundField,
  PlaygroundState,
} from "./schema";

/**
 * The printer, tested as a string function: no DOM, no React render, because
 * that is all it is. These are the guarantees the Code view rests on — that the
 * snippet is the *diff*, that hidden options cannot leak into it, and that a
 * value with no literal fails loudly instead of printing `undefined`.
 */

const choice = (field: Partial<PlaygroundField> & { id: string }): PlaygroundField =>
  ({
    kind: "choice",
    label: field.id,
    group: "core",
    default: "a",
    options: [
      { value: "a", label: "A" },
      { value: "b", label: "B" },
    ],
    ...field,
  }) as PlaygroundField;

const config = (
  fields: PlaygroundField[],
  data?: PlaygroundDataSource[],
): PlaygroundConfig => ({
  groups: [{ id: "core", title: "Core" }],
  fields,
  data,
});

const emitter = (fields: PlaygroundField[], state: PlaygroundState = {}, data?: PlaygroundDataSource[]) =>
  createEmitter(config(fields, data), state);

describe("attribute and entry printing", () => {
  const size = choice({ id: "size", default: "md", docDefault: "md" });
  const maxVisible = choice({
    id: "maxVisible",
    default: "5",
    valueType: "number",
    options: [
      { value: "4", label: "4" },
      { value: "5", label: "5" },
    ],
  });

  it("omits what the component already defaults to", () => {
    const h = emitter([size as PlaygroundField], { size: "md" });
    expect(h.props()).toEqual([]);
  });

  it("prints a value that differs from the documented default", () => {
    const h = emitter([size as PlaygroundField], { size: "lg" });
    expect(h.props()).toEqual(['size="lg"']);
  });

  it("uses the documented default as the bar, not the opening value", () => {
    // The deck opens at 22.5rem while the viewport defaults to 18.75rem: the
    // width the reader sees must still be printed.
    const width = choice({ id: "width", default: "22.5rem", docDefault: "18.75rem" });
    const h = emitter([width as PlaygroundField], { width: "22.5rem" });
    expect(h.props()).toEqual(['width="22.5rem"']);
  });

  it("prints a flag bare, and its inverse explicitly", () => {
    // The two cases a reader needs spelled out: a prop the component leaves
    // off, switched on; and one the component turns on, switched off.
    const on = { kind: "toggle", id: "border", label: "border", group: "core", default: false, docDefault: false } as const;
    const off = { kind: "toggle", id: "border", label: "border", group: "core", default: true, docDefault: true } as const;
    expect(emitter([on as unknown as PlaygroundField], { border: true }).props()).toEqual([
      "border",
    ]);
    expect(emitter([off as unknown as PlaygroundField], { border: false }).props()).toEqual([
      "border={false}",
    ]);
  });

  it("prints an object entry with its value, never shorthand", () => {
    const off = {
      kind: "toggle",
      id: "dismissible",
      label: "dismissible",
      group: "core",
      default: true,
      docDefault: true,
    } as const;
    const h = emitter([off as unknown as PlaygroundField], { dismissible: false });
    expect(h.payload()).toEqual(["dismissible: false"]);
  });

  it("prints a numeric ladder unquoted", () => {
    const h = emitter([maxVisible as PlaygroundField], { maxVisible: "4" });
    expect(h.props()).toEqual(["maxVisible={4}"]);
    expect(h.payload()).toEqual(["maxVisible: 4"]);
  });

  it("skips a prop: null lever unless it emits something", () => {
    const quiet = { kind: "toggle", id: "override", label: "o", group: "core", default: false, prop: null } as unknown as PlaygroundField;
    expect(emitter([quiet], { override: true }).props()).toEqual([]);
    expect(emitter([quiet], { override: true }).payload()).toEqual([]);
  });

  it("routes one control to two props through emit", () => {
    const life = choice({
      id: "life",
      default: "5000",
      prop: null,
      emit: (value) => (value === "0" ? "sticky: true" : value === "5000" ? null : `life: ${value}`),
    });
    const fields = [life as PlaygroundField];
    expect(emitter(fields, { life: "5000" }).payload()).toEqual([]);
    expect(emitter(fields, { life: "0" }).payload()).toEqual(["sticky: true"]);
    expect(emitter(fields, { life: "2000" }).payload()).toEqual(["life: 2000"]);
  });

  it("hides the line of code along with the control", () => {
    const color = choice({ id: "color", default: "emerald", when: (state) => state.on === true });
    const fields = [
      {
        kind: "toggle",
        id: "on",
        label: "on",
        group: "core",
        default: false,
        prop: null,
      } as unknown as PlaygroundField,
      color as PlaygroundField,
    ];
    expect(emitter(fields, { on: false, color: "rose" }).props()).toEqual([]);
    expect(emitter(fields, { on: true, color: "rose" }).props()).toEqual(['color="rose"']);
  });

  it("keeps one field out of the element with set", () => {
    const position = choice({ id: "position", default: "top-right", set: "viewport" });
    const sizeField = choice({ id: "size", default: "sm", docDefault: "xs" });
    const fields = [sizeField as PlaygroundField, position as PlaygroundField];
    const h = emitter(fields, { size: "sm", position: "bottom-left" });
    expect(h.props()).toEqual(['size="sm"']);
    expect(h.props({ set: "viewport" })).toEqual(['position="bottom-left"']);
    expect(h.payload()).toEqual(['size: "sm"']);
  });

  it("quotes what needs it and leaves identifiers alone", () => {
    const h = emitter([]);
    expect(h.lit({ "not an id": 1, ok: "x" })).toEqual('{ "not an id": 1, ok: "x" }');
  });
});

describe("literals", () => {
  it("prints a Date as the constructor that makes it", () => {
    expect(createEmitter(config([]), {}).lit(new Date("2026-11-27T00:00:00.000Z"))).toBe(
      'new Date("2026-11-27T00:00:00.000Z")',
    );
  });

  it("refuses to print what only emit: \"source\" can say", () => {
    const h = createEmitter(config([]), {});
    expect(() => h.lit(undefined)).toThrow(/undefined has no literal/);
    expect(() => h.lit(() => 1)).toThrow(/a function has no literal/);
    expect(() => h.lit(createElement("div"))).toThrow(/a React element has no literal/);
    expect(() => h.lit(Number.NaN)).toThrow(/cannot print NaN/);
  });

  it("drops undefined members of an object rather than printing them", () => {
    expect(createEmitter(config([]), {}).lit({ a: 1, b: undefined })).toEqual("{ a: 1 }");
  });

  it("does not nag about a long literal printed as a fragment", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const rows = Array.from({ length: 40 }, (_, index) => ({ name: `Row ${index}`, value: index }));
    createEmitter(config([]), {}).lit(rows);
    // The warning belongs to declarations, where a fixture is printed whole.
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("warns when a declared fixture is a generator wearing a mask", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const rows = Array.from({ length: 40 }, (_, index) => ({ name: `A row with a longish name ${index}`, value: index }));
    const h = createEmitter(
      config([], [{ id: "rows", label: "Rows", emit: "literal", value: () => rows }]),
      {},
    );
    h.decl("rows");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('fixture "rows"'));
    warn.mockRestore();
  });
});

describe("layout", () => {
  it("keeps a short element on one line and stacks a long one", () => {
    const h = createEmitter(config([]), {});
    expect(h.element("Tag", ['a="1"'], 0)).toBe('<Tag a="1" />');
    const long = h.element("Tag", ['a="1"', `b="${"x".repeat(60)}"`, 'c="3"'], 0);
    expect(long.split("\n")).toHaveLength(5);
    expect(long).toMatch(/^<Tag\n {2}a="1"\n {2}b="/);
    expect(long.endsWith("/>")).toBe(true);
  });

  it("keeps a short object flat and breaks a long one one entry per line", () => {
    const h = createEmitter(config([]), {});
    expect(h.object(["a: 1"])).toBe("{ a: 1 }");
    const wide = h.object(Array.from({ length: 8 }, (_, i) => `key${i}: "value ${i}"`));
    expect(wide.split("\n").length).toBe(10);
    expect(wide).toMatch(/,\n\}$/);
  });

  it("sorts and dedupes imports into one statement", () => {
    const h = createEmitter(config([]), {});
    const snippet = h.snippet({
      imports: ["useToast", "Button", "Button"],
      body: "const x = 1;",
    });
    expect(snippet).toBe(
      'import { Button, useToast } from "@cjlapao/ui-kit";\n\nconst x = 1;',
    );
  });

  it("wraps the body as a default-exported Demo", () => {
    const h = createEmitter(config([]), {});
    expect(h.demo("<Tag />")).toBe(
      "export default function Demo() {\n  return (\n    <Tag />\n  );\n}",
    );
  });

  it("pads every line of a fragment", () => {
    const h = createEmitter(config([]), {});
    expect(h.indent("a\nb", 4)).toBe("    a\n    b");
  });
});

describe("data sources", () => {
  const roster: PlaygroundDataSource = {
    id: "roster",
    constName: "ROSTER",
    prop: "items",
    label: "The roster",
    note: "seven people",
    emit: "literal",
    value: () => [{ name: "Ada" }],
  };

  it("declares the value the preview renders, with its how-was-this-made line", () => {
    const h = createEmitter(config([], [roster]), {});
    expect(h.decl("roster")).toBe(
      '// The roster — seven people\nconst ROSTER = [{ name: "Ada" }];',
    );
  });

  it("prints the generator, not the rows, for emit: \"source\"", () => {
    const generated: PlaygroundDataSource = {
      id: "series",
      label: "Series",
      emit: "source",
      prop: null,
      value: () => [1, 2],
      source: (state) => `Array.from({ length: ${state.n} }, (_, i) => i)`,
    };
    const h = createEmitter(config([], [generated]), { n: 3 });
    expect(h.source("series")).toBe("Array.from({ length: 3 }, (_, i) => i)");
    expect(h.decl("series")).toContain("const series = Array.from");
  });

  it("names the const it will print, so a page can place it itself", () => {
    expect(createEmitter(config([], [roster]), {}).constName("roster")).toBe("ROSTER");
  });

  it("refuses a source it was never given", () => {
    const h = createEmitter(config([], [roster]), {});
    expect(() => h.source("roster")).toThrow(/no source\(\)/);
    expect(() => h.decl("missing")).toThrow(/no data source "missing"/);
  });

  it("hands the element its data first, and never a prop: null source", () => {
    const fields = [choice({ id: "size", default: "lg", docDefault: "md" }) as PlaygroundField];
    const hidden: PlaygroundDataSource = {
      id: "actions",
      prop: null,
      label: "Actions",
      emit: "literal",
      value: () => [],
    };
    const h = createEmitter(config(fields, [roster, hidden]), { size: "lg" });
    expect(h.props()).toEqual(["items={ROSTER}", 'size="lg"']);
  });

  it("hoists only the declarations the default element places", () => {
    const h = createEmitter(config([], [roster, { ...roster, id: "extra", hoist: false }]), {});
    expect(defaultDeclarations(config([], [roster, { ...roster, id: "extra", hoist: false }]), {}, h)).toEqual([
      h.decl("roster"),
    ]);
  });

  /*
   * Optional content — a layout zone, an extra section — is gated by a control.
   * The predicate has to be honoured by both halves of the printer at once: a
   * snippet that prints `left={left}` with no `const left` above it, or a
   * declaration the preview never renders, is a snippet that does not run.
   */
  it("drops a fixture the state switched off, its attribute and its const together", () => {
    const zone: PlaygroundDataSource = {
      id: "left",
      label: "Left zone",
      emit: "source",
      value: () => null,
      source: () => `<Rail />`,
      when: (state) => state.withLeft === "on",
    };
    const withLeft = choice({ id: "withLeft", default: "on", prop: null }) as PlaygroundField;
    const off = createEmitter(config([withLeft], [zone]), { withLeft: "off" });
    expect(off.props()).toEqual([]);
    expect(defaultDeclarations(config([withLeft], [zone]), { withLeft: "off" }, off)).toEqual([]);

    const on = createEmitter(config([withLeft], [zone]), { withLeft: "on" });
    expect(on.props()).toEqual(["left={left}"]);
    expect(defaultDeclarations(config([withLeft], [zone]), { withLeft: "on" }, on)).toEqual([
      on.decl("left"),
    ]);
  });

  it("still lets a page place a switched-off fixture itself", () => {
    const zone: PlaygroundDataSource = {
      id: "left",
      label: "Left zone",
      emit: "source",
      value: () => null,
      source: () => `<Rail />`,
      when: () => false,
    };
    // `code` composes deliberately: `when` keeps the *default* emission honest,
    // it does not veto a page that asks for the declaration by name.
    expect(createEmitter(config([], [zone]), {}).decl("left")).toContain("const left = <Rail />;");
  });
});

/* -------------------------------------------------------------------------- *
 * jsx — the printer for fixtures that are markup rather than data
 * -------------------------------------------------------------------------- */

/** A component with no printable name of its own; the page must supply one. */
const Pill = (_props: { tone?: string; children?: unknown }) => null;

const bare = () => createEmitter(config([]), {});

describe("jsx", () => {
  it("prints an intrinsic element, its props and its text", () => {
    expect(bare().jsx(createElement("span", { className: "rounded-full" }, "4"))).toBe(
      '<span className="rounded-full">4</span>',
    );
    expect(bare().jsx(createElement("img", { src: "a.webp", alt: "" }))).toBe(
      '<img src="a.webp" alt="" />',
    );
  });

  it("prints a fragment as markup, not as an array", () => {
    const row = createElement(Fragment, null, [
      createElement("button", { key: "a" }, "Edit"),
      createElement("button", { key: "b" }, "Delete"),
    ]);
    const printed = bare().jsx(row);
    // Commas between two elements are not JSX: a fixture's `actions` has to be
    // pasteable back into a file, which is the whole point of the Code view.
    expect(printed).not.toContain(",");
    expect(printed).toBe("<>\n  <button>Edit</button>\n  <button>Delete</button>\n</>");
    expect(bare().jsx(createElement(Fragment, null))).toBe("<></>");
  });

  it("uses the identifier the page names, never the function's name", () => {
    expect(bare().jsx(createElement(Pill, { tone: "blue" }, "4"), { names: { Pill } })).toBe(
      '<Pill tone="blue">4</Pill>',
    );
    // Without it the alternative is `fn.name`, which a built docs site mangles —
    // so the printer refuses rather than print a name the reader cannot import.
    expect(() => bare().jsx(createElement(Pill, {}, "4"))).toThrow(/no identifier/);
  });

  it("keeps a boolean prop as JSX shorthand", () => {
    const printed = bare().jsx(createElement("button", { disabled: true, hidden: false }, "x"), {
      names: {},
    });
    expect(printed).toBe("<button disabled hidden={false}>x</button>");
  });

  it("throws at a callback instead of dropping the prop that makes it work", () => {
    const withHandler = createElement("button", { onClick: () => undefined }, "x");
    expect(() => bare().jsx(withHandler)).toThrow(/onClick/);
    expect(
      bare().jsx(withHandler, { replace: { onClick: "onClick={() => dismiss()}" } }),
    ).toBe("<button onClick={() => dismiss()}>x</button>");
  });

  it("leaves out what the page has said about elsewhere", () => {
    expect(
      bare().jsx(createElement("div", { "data-testid": "x", id: "y" }), { omit: ["data-testid"] }),
    ).toBe('<div id="y" />');
  });

  it("walks into the data around it — an array of rows is still a fixture", () => {
    const items = [
      { slug: "jobs", label: "Jobs", badge: createElement(Pill, { tone: "blue" }, "4") },
      { slug: "settings", label: "Settings" },
    ];
    // Two rows do not fit on one line, so the array stacks — the same wrapping
    // rule every other literal obeys, with the markup intact inside it.
    expect(bare().jsx(items, { names: { Pill } })).toBe(
      "[\n  { slug: \"jobs\", label: \"Jobs\", badge: <Pill tone=\"blue\">4</Pill> },\n  { slug: \"settings\", label: \"Settings\" },\n]",
    );
  });

  it("nests children that will not fit on one line", () => {
    const printed = bare().jsx(
      createElement(
        "div",
        { className: "very long class string that will not fit inside the print width at all because it is long" },
        createElement("p", null, "one"),
        createElement("p", null, "two"),
      ),
    );
    expect(printed.split("\n").length).toBeGreaterThan(3);
    expect(printed).toContain("  <p>one</p>");
    expect(printed).toContain("</div>");
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
