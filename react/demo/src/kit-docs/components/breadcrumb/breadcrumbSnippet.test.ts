import { describe, it, expect } from "vitest";
import { createEmitter, defaultDeclarations } from "../../shared/playground/emit";
import { breadcrumbConfig } from "./BreadcrumbPlayground";
import {
  BREADCRUMB_ITEM_PROPS,
  BREADCRUMB_PROPS,
} from "./BreadcrumbPage";
import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * Breadcrumb's snippet — the declarative path, checked against the component.
 *
 * The page's claim is that the Code view opens saying nothing, because the
 * controls open on the component's own defaults. That is the whole test: a field
 * whose `default` drifted from `src/components/Breadcrumb.tsx` would print a prop
 * the reader never asked for, and no amount of reading the preview would show it.
 */

/** What the controls show on load — every one of them a documented default. */
const OPENING: PlaygroundState = {
  showHome: false,
  ellipsis: false,
  separator: "chevron",
  size: "md",
  color: "blue",
  ariaLabel: "Breadcrumb",
};

const snippet = (changes: Partial<PlaygroundState> = {}): string => {
  const state = Object.assign({}, OPENING, changes) as PlaygroundState;
  const h = createEmitter(breadcrumbConfig, state);
  return h.snippet({
    imports: ["Breadcrumb"],
    decls: defaultDeclarations(breadcrumbConfig, state, h),
    body: h.demo(h.element("Breadcrumb", h.props(), 2)),
  });
};

/** Every attribute on the element, whatever the data declarations say below it. */
const attributes = (code: string): string[] => {
  const element = code.slice(
    code.indexOf("<Breadcrumb") + "<Breadcrumb".length,
    code.indexOf("/>"),
  );
  const named = [...element.matchAll(/([A-Za-z]\w*)=(?:"|\{)/g)].map((m) => m[1]);
  const flags = element
    .replace(/[A-Za-z]\w*=(?:"[^"]*"|\{[^}]*\})/g, "")
    .match(/(^|\s)([A-Za-z]\w*)(?=\s|$)/g)
    ?.map((flag) => flag.trim());
  return [...named, ...(flags ?? [])];
};

describe("the opening", () => {
  it("says nothing but the trail it was handed", () => {
    const code = snippet();
    expect(attributes(code)).toEqual(["items"]);
    for (const untouched of ["size", "color", "ariaLabel", "separator", "home"]) {
      expect(code, untouched).not.toContain(`${untouched}=`);
    }
    expect(code).toContain('import { Breadcrumb } from "@cjlapao/ui-kit";');
  });

  it("opens on the component's own defaults, read from its source", () => {
    // Breadcrumb.tsx: color "blue" (:72), size "md" (:73), ariaLabel
    // "Breadcrumb" (:74); `home` and `separator` have no default to match, so
    // the switch is off and the chevron prints nothing.
    const documented = new Map(
      BREADCRUMB_PROPS.map((row) => [row.name, row.default]),
    );
    expect(documented.get("color")).toBe('"blue"');
    expect(documented.get("size")).toBe('"md"');
    expect(documented.get("ariaLabel")).toBe('"Breadcrumb"');
    expect(documented.has("home")).toBe(true);
    expect(documented.get("home")).toBeUndefined();
    for (const [id, value] of Object.entries(OPENING)) {
      const field = breadcrumbConfig.fields.find((f) => f.id === id);
      expect(field, id).toBeDefined();
      expect(field?.default, id).toBe(value);
    }
  });

  it("names the trail as data, with the last crumb marked as where you are", () => {
    const code = snippet();
    expect(code).toContain("// The trail — the crumbs, last one marked current");
    expect(code).toContain("const items = [");
    expect(code).toContain('{ label: "Products", to: "/products" }');
    expect(code).toContain('{ label: "Dell", current: true }');
    // The attribute names the const; the crumbs are not spelled inside the tag.
    expect(code.slice(code.indexOf("<Breadcrumb"))).not.toContain("Dell");
  });
});

describe("a crumb switched on", () => {
  it("brings the home crumb's declaration with its attribute", () => {
    const code = snippet({ showHome: true });
    expect(attributes(code)).toEqual(["items", "home"]);
    expect(code).toContain("const home = {");
    expect(code).toContain('ariaLabel: "Home"');
  });

  it("takes both away again", () => {
    const code = snippet({ showHome: false });
    expect(code).not.toContain("home={home}");
    expect(code).not.toContain("const home =");
  });

  it("swaps the first crumb for the ellipsis, and says why it has an aria-label", () => {
    const code = snippet({ ellipsis: true });
    expect(code).toContain('{ icon: "Dots", to: "/products", ariaLabel: "Skipped items" }');
    expect(code).not.toContain('{ label: "Products", to: "/products" }');
    // The rest of the trail is untouched.
    expect(code).toContain('{ label: "Laptops", to: "/products/electronics/laptops" }');
  });
});

describe("a deviation", () => {
  it("prints the line the moment the reader moves the option", () => {
    const code = snippet({ size: "lg", color: "rose", ariaLabel: "Fil d'Ariane" });
    expect(code).toContain('size="lg"');
    expect(code).toContain('color="rose"');
    expect(code).toContain('ariaLabel="Fil d\'Ariane"');
    expect(code).not.toContain("separator=");
  });

  it("keeps the default separator out of the source entirely", () => {
    // The component's fallback is a chevron, so "Chevron" means *pass nothing*:
    // printing `separator="…"` there would teach a prop that is not being used.
    expect(snippet({ separator: "chevron" })).not.toContain("separator=");
    expect(snippet({ separator: "slash" })).toContain('separator="/"');
    expect(snippet({ separator: "dot" })).toContain('separator="·"');
  });
});

describe("the guard", () => {
  it("names only props the page documents", () => {
    const documented = BREADCRUMB_PROPS.map((row) => row.name);
    const printed = attributes(snippet({ showHome: true, size: "lg", color: "rose", separator: "slash" }));
    expect(printed).toEqual(expect.arrayContaining(["items", "home", "size", "color", "separator"]));
    expect(printed.filter((name) => !documented.includes(name))).toEqual([]);
  });

  it("covers every option the playground can speak for", () => {
    const documented = BREADCRUMB_PROPS.map((row) => row.name);
    for (const field of breadcrumbConfig.fields) {
      if (field.prop === null) continue;
      expect(documented, `field "${field.id}"`).toContain(field.prop ?? field.id);
    }
    for (const source of breadcrumbConfig.data ?? []) {
      expect(documented, `data source "${source.id}"`).toContain(source.prop ?? source.id);
    }
  });

  it("only asks of a crumb what a crumb can carry", () => {
    // The trail is typed data, so the compiler checks this — but the *printed*
    // keys are what the reader copies, and a typo there is not a type error.
    const crumbFields = new Set(BREADCRUMB_ITEM_PROPS.map((row) => row.name));
    for (const source of breadcrumbConfig.data ?? []) {
      const value = source.value({} as PlaygroundState);
      const rows = (Array.isArray(value) ? value : [value]) as Record<string, unknown>[];
      for (const row of rows) {
        for (const key of Object.keys(row)) {
          expect(crumbFields, `crumb key "${key}"`).toContain(key);
        }
      }
    }
  });
});
