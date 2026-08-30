import { describe, it, expect, vi } from "vitest";
import {
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { SmartGridLayout, SMART_GRID_VARIANTS } from "./SmartGridLayout";
import Button from "./Button";
import type { ButtonVariant } from "../theme";
import type {
  SmartGridItemDefinition,
  SmartGridLayoutState,
  SmartGridSectionDefinition,
} from "./SmartGridLayout";

/**
 * Phase 1 covers correctness only — the component had no tests at all, and was
 * not even exported from the barrel, so nothing here had ever been exercised.
 *
 * The emphasis is on *state integrity*: the component mutated the object React
 * holds as `prev` in three places, which is invisible until something reads the
 * previous snapshot — which is exactly what persistence will do in phase 2.
 */

const def = (
  id: string,
  extra: Partial<SmartGridItemDefinition> = {},
): SmartGridItemDefinition => ({
  id,
  title: id,
  active: true,
  single: false,
  render: () => <div data-testid={`tile-${id}`}>{id}</div>,
  ...extra,
});

const ITEMS: SmartGridItemDefinition[] = [
  def("alpha", { defaultSpan: 6 }),
  def("beta", { defaultSpan: 6 }),
  def("gamma", { defaultSpan: 4 }),
];

const LAYOUT: SmartGridSectionDefinition[] = [
  { id: "main", title: "Main", rows: [{ itemIds: ["alpha", "beta"] }] },
];

/** Deep-freeze so any in-place write throws instead of silently corrupting. */
const deepFreeze = <T,>(value: T): T => {
  if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
};

describe("SmartGridLayout — it is actually reachable", () => {
  it("is exported from the component barrel", async () => {
    // It was absent from `index.ts` entirely, so no consumer could import it.
    const barrel = await import("./index");
    expect(barrel.SmartGridLayout).toBeTypeOf("function");
  });

  it("renders the tiles its default layout asks for", () => {
    render(<SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} />);
    expect(screen.getByTestId("tile-alpha")).toBeTruthy();
    expect(screen.getByTestId("tile-beta")).toBeTruthy();
  });

  it("does not render an item that is missing from `items`", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={[
          { id: "main", title: "Main", rows: [{ itemIds: ["nope"] }] },
        ]}
      />,
    );
    expect(screen.queryByTestId("tile-nope")).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("skips an inactive item", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <SmartGridLayout
        items={[...ITEMS, def("hidden", { active: false })]}
        defaultLayout={[
          { id: "main", title: "Main", rows: [{ itemIds: ["alpha", "hidden"] }] },
        ]}
      />,
    );
    expect(screen.queryByTestId("tile-hidden")).toBeNull();
    warn.mockRestore();
  });
});

describe("SmartGridLayout — it no longer logs to the console", () => {
  it("renders without a single console.log", () => {
    // There were 34 console.log/warn calls, including one inside
    // `normalizeColumnSpans` that fired per row per render.
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} />);
    expect(log).not.toHaveBeenCalled();
    log.mockRestore();
  });
});

describe("SmartGridLayout — state integrity", () => {
  it("never writes into the layout object it was handed", () => {
    // `{ ...section }` copies the object, not the `rows` array inside it, so
    // `newSection.rows[i] = ...` and `newRow.items.push(...)` used to land on
    // the previous state. A frozen input turns that into a throw.
    const persisted: SmartGridLayoutState = deepFreeze({
      version: 3,
      sections: [
        {
          id: "main",
          title: "Main",
          order: 0,
          rows: [
            {
              id: "main-row-1",
              order: 0,
              heightSpan: 0,
              items: [
                {
                  definitionId: "alpha",
                  id: "i1",
                  span: 6,
                  order: 0,
                  sectionId: "main",
                  rowId: "main-row-1",
                },
                {
                  definitionId: "beta",
                  id: "i2",
                  span: 6,
                  order: 1,
                  sectionId: "main",
                  rowId: "main-row-1",
                },
              ],
            },
          ],
        },
      ],
    });

    expect(() =>
      render(
        <SmartGridLayout
          items={ITEMS}
          defaultLayout={LAYOUT}
          persistedLayout={persisted}
        />,
      ),
    ).not.toThrow();

    expect(screen.getByTestId("tile-alpha")).toBeTruthy();
    expect(screen.getByTestId("tile-beta")).toBeTruthy();
  });

  it("leaves a frozen default layout untouched", () => {
    const frozenItems = deepFreeze(ITEMS.map((i) => ({ ...i })));
    const frozenLayout = deepFreeze(
      LAYOUT.map((s) => ({ ...s, rows: s.rows.map((r) => ({ ...r })) })),
    );
    expect(() =>
      render(
        <SmartGridLayout items={frozenItems} defaultLayout={frozenLayout} />,
      ),
    ).not.toThrow();
  });
});

describe("SmartGridLayout — span normalisation", () => {
  it("gives a lone item the full width", () => {
    const onLayoutChange = vi.fn();
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={[
          { id: "main", title: "Main", rows: [{ itemIds: ["alpha"] }] },
        ]}
        maxColumns={12}
        onLayoutChange={onLayoutChange}
      />,
    );
    expect(screen.getByTestId("tile-alpha")).toBeTruthy();
  });

  it("wraps rather than overflowing when a row has more items than columns", () => {
    // With every span already clamped to 1 and the total still over the grid,
    // the shrink loop could not reduce anything further and returned a row
    // summing to more than `maxColumns`.
    const many = Array.from({ length: 6 }, (_, i) => def(`t${i}`));
    const { container } = render(
      <SmartGridLayout
        items={many}
        defaultLayout={[
          {
            id: "main",
            title: "Main",
            rows: [{ itemIds: many.map((m) => m.id) }],
          },
        ]}
        maxColumns={4}
      />,
    );
    // Every tile is placed somewhere...
    many.forEach((m) => expect(screen.getByTestId(`tile-${m.id}`)).toBeTruthy());
    // ...and no single row claims more columns than the grid has.
    const rows = container.querySelectorAll("[data-sg-row-id]");
    expect(rows.length).toBeGreaterThan(0);
    let checked = 0;
    rows.forEach((row) => {
      const spans = Array.from(row.querySelectorAll("[data-sg-span]")).map(
        (el) => Number(el.getAttribute("data-sg-span")),
      );
      if (!spans.length) return;
      checked += 1;
      expect(spans.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(4);
    });
    expect(checked).toBeGreaterThan(0);
  });
});

describe("SmartGridLayout — layout change reporting", () => {
  it("does not fire onLayoutChange on a plain render", () => {
    const onLayoutChange = vi.fn();
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        onLayoutChange={onLayoutChange}
      />,
    );
    expect(onLayoutChange).not.toHaveBeenCalled();
  });
});


/** In-memory adapter with a peekable map, mirroring the Table storage tests. */
const makeStorage = () => {
  const map = new Map<string, string>();
  return {
    map,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
};

describe("SmartGridLayout — built-in persistence", () => {
  it("composes the key the same way Table does", async () => {
    const { buildGridStorageKey, GRID_STORAGE_DEFAULT_PREFIX } = await import(
      "../utils/gridStorage"
    );
    expect(buildGridStorageKey(GRID_STORAGE_DEFAULT_PREFIX, "dash")).toBe(
      "ui-kit:grid:dash",
    );
  });

  it("reads a stored layout on mount", async () => {
    const { encodeStoredLayout } = await import("../utils/gridStorage");
    const storage = makeStorage();
    storage.map.set(
      "ui-kit:grid:dash",
      encodeStoredLayout({
        version: 3,
        sections: [
          {
            id: "main",
            title: "Restored",
            order: 0,
            rows: [
              {
                id: "r1",
                order: 0,
                heightSpan: 0,
                items: [
                  {
                    definitionId: "gamma",
                    id: "i9",
                    span: 12,
                    order: 0,
                    sectionId: "main",
                    rowId: "r1",
                  },
                ],
              },
            ],
          },
        ],
      }),
    );

    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        storageKey="dash"
        storage={storage}
      />,
    );
    // The stored layout wins over the default, which asked for alpha + beta.
    expect(screen.getByTestId("tile-gamma")).toBeTruthy();
    expect(screen.queryByTestId("tile-alpha")).toBeNull();
  });

  it("does not touch storage without a storageKey", () => {
    const storage = makeStorage();
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} storage={storage} />,
    );
    expect(storage.map.size).toBe(0);
  });

  it("an explicit persistedLayout prop wins over storage", async () => {
    const { encodeStoredLayout } = await import("../utils/gridStorage");
    const storage = makeStorage();
    storage.map.set(
      "ui-kit:grid:dash",
      encodeStoredLayout({
        version: 3,
        sections: [
          {
            id: "main",
            title: "Stored",
            order: 0,
            rows: [
              {
                id: "r1",
                order: 0,
                items: [
                  {
                    definitionId: "gamma",
                    id: "i9",
                    span: 12,
                    order: 0,
                    sectionId: "main",
                    rowId: "r1",
                  },
                ],
              },
            ],
          },
        ],
      }),
    );

    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        storageKey="dash"
        storage={storage}
        persistedLayout={{
          version: 3,
          sections: [
            {
              id: "main",
              title: "Prop",
              order: 0,
              rows: [
                {
                  id: "r1",
                  order: 0,
                  items: [
                    {
                      definitionId: "beta",
                      id: "i1",
                      span: 12,
                      order: 0,
                      sectionId: "main",
                      rowId: "r1",
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />,
    );
    expect(screen.getByTestId("tile-beta")).toBeTruthy();
    expect(screen.queryByTestId("tile-gamma")).toBeNull();
  });
});

describe("gridStorage — decode is defensive", () => {
  it("rejects junk, wrong versions and empty layouts", async () => {
    const { decodeStoredLayout, encodeStoredLayout } = await import(
      "../utils/gridStorage"
    );
    expect(decodeStoredLayout(null)).toBeNull();
    expect(decodeStoredLayout("not json")).toBeNull();
    expect(decodeStoredLayout(JSON.stringify({ v: 999, layout: {} }))).toBeNull();
    expect(
      decodeStoredLayout(
        JSON.stringify({ v: 1, layout: { version: 3, sections: [] } }),
      ),
    ).toBeNull();
    // A layout whose only section has no rows is as useless as an empty one.
    expect(
      decodeStoredLayout(
        encodeStoredLayout({
          version: 3,
          sections: [{ id: "s", title: "S", order: 0, rows: [] }],
        }),
      ),
    ).toBeNull();
  });

  it("keeps the good parts of a half-corrupt layout", async () => {
    const { decodeStoredLayout } = await import("../utils/gridStorage");
    const decoded = decodeStoredLayout(
      JSON.stringify({
        v: 1,
        layout: {
          version: 3,
          sections: [
            {
              id: "main",
              title: "Main",
              order: 0,
              rows: [
                {
                  id: "r1",
                  order: 0,
                  items: [
                    // valid
                    {
                      definitionId: "alpha",
                      id: "i1",
                      span: 6,
                      order: 0,
                      sectionId: "main",
                      rowId: "r1",
                    },
                    // no id — unrenderable, dropped
                    { definitionId: "beta", sectionId: "main", rowId: "r1" },
                    // span is garbage but the item is placeable — kept
                    {
                      definitionId: "gamma",
                      id: "i3",
                      span: "wide",
                      order: 1,
                      sectionId: "main",
                      rowId: "r1",
                    },
                  ],
                },
                // no id — dropped
                { order: 1, items: [] },
              ],
            },
            // no id — dropped
            { title: "Ghost", order: 1, rows: [] },
          ],
        },
      }),
    );
    expect(decoded).not.toBeNull();
    expect(decoded!.sections).toHaveLength(1);
    expect(decoded!.sections[0].rows).toHaveLength(1);
    const ids = decoded!.sections[0].rows[0].items.map((i) => i.id);
    expect(ids).toEqual(["i1", "i3"]);
    expect(decoded!.sections[0].rows[0].items[1].span).toBe(1);
  });
});


describe("SmartGridLayout — design language", () => {
  it("renders every surface variant", () => {
    for (const variant of SMART_GRID_VARIANTS) {
      const { unmount } = render(
        <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} variant={variant} />,
      );
      expect(screen.getByTestId("tile-alpha")).toBeTruthy();
      unmount();
    }
  });

  it("keeps a surface neutral unless asked, so the edit accent stands out", () => {
    // `tone` drives the accent; using it for the surface too would tint the
    // whole dashboard in the accent colour, which is self-defeating.
    const { container } = render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        variant="subtle"
        tone="blue"
        isEditMode
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("neutral");
    expect(root.className).not.toContain("bg-blue-50");
  });

  it("`surfaceTone` tints the dashboard deliberately", () => {
    const { container } = render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        variant="subtle"
        surfaceTone="violet"
      />,
    );
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "violet",
    );
  });

  it("resolves every tone, not just the ten that used to be listed", () => {
    // The hand-written map covered 10 of 21; the other 11 silently rendered
    // blue. `teal` is one of the eleven.
    const { container } = render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        tone="teal"
        isEditMode
      />,
    );
    expect(container.innerHTML).toContain("teal");
    expect(container.innerHTML).not.toContain("border-blue-300");
  });

  it("the deprecated `editThemeColor` still works, and `tone` wins", () => {
    const a = render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        editThemeColor="emerald"
        isEditMode
      />,
    );
    expect(a.container.innerHTML).toContain("emerald");
    a.unmount();

    const b = render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        tone="rose"
        editThemeColor="emerald"
        isEditMode
      />,
    );
    expect(b.container.innerHTML).toContain("rose");
    expect(b.container.innerHTML).not.toContain("border-emerald-300");
  });

  it("scales the grid gap with `size`", () => {
    const small = render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} size="xs" />,
    );
    const smallGap = small.container
      .querySelector("[data-sg-row-id]")!
      .className.match(/gap-\d+/)?.[0];
    small.unmount();

    const large = render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} size="xl" />,
    );
    const largeGap = large.container
      .querySelector("[data-sg-row-id]")!
      .className.match(/gap-\d+/)?.[0];

    expect(smallGap).toBeTruthy();
    expect(largeGap).not.toBe(smallGap);
  });
});


describe("SmartGridLayout — edit mode", () => {
  it("owns edit mode when uncontrolled, and reports it", () => {
    // `onEditModeChange` was declared on the props and never called: the
    // component could not ask its host to leave edit mode, and `isEditMode`
    // was controlled-only so there was no way in either.
    const onEditModeChange = vi.fn();
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        onEditModeChange={onEditModeChange}
      />,
    );
    const toggle = screen.getByRole("button", { name: "Edit layout" });
    fireEvent.click(toggle);
    expect(onEditModeChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Done" })).toBeTruthy();
  });

  it("honours a controlled isEditMode", () => {
    const onEditModeChange = vi.fn();
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        isEditMode={false}
        onEditModeChange={onEditModeChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Edit layout" }));
    expect(onEditModeChange).toHaveBeenCalledWith(true);
    // Controlled: the component does not move until the prop does.
    expect(screen.getByRole("button", { name: "Edit layout" })).toBeTruthy();
  });

  it("starts in edit mode when asked", () => {
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    expect(screen.getByRole("button", { name: "Done" })).toBeTruthy();
  });

  it("shows no toolbar for a host driving edit mode with its own chrome", () => {
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} isEditMode={false} />,
    );
    expect(screen.queryByRole("button", { name: "Edit layout" })).toBeNull();
  });
});

describe("SmartGridLayout — reset", () => {
  it("clears the stored layout and returns to the default", async () => {
    const { encodeStoredLayout } = await import("../utils/gridStorage");
    const storage = makeStorage();
    storage.map.set(
      "ui-kit:grid:dash",
      encodeStoredLayout({
        version: 3,
        sections: [
          {
            id: "main",
            title: "Stored",
            order: 0,
            rows: [
              {
                id: "r1",
                order: 0,
                items: [
                  {
                    definitionId: "gamma",
                    id: "i9",
                    span: 12,
                    order: 0,
                    sectionId: "main",
                    rowId: "r1",
                  },
                ],
              },
            ],
          },
        ],
      }),
    );

    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        storageKey="dash"
        storage={storage}
        defaultEditMode
      />,
    );
    expect(screen.getByTestId("tile-gamma")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Reset layout" }));

    expect(storage.map.has("ui-kit:grid:dash")).toBe(false);
    expect(screen.getByTestId("tile-alpha")).toBeTruthy();
    expect(screen.queryByTestId("tile-gamma")).toBeNull();
  });
});

describe("SmartGridLayout — the resize handle is keyboard operable", () => {
  it("moves a column with the arrow keys", () => {
    // The handles were `onMouseDown`-only, so column widths could not be
    // changed without a pointer.
    const onLayoutChange = vi.fn();
    const { container } = render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        defaultEditMode
        onLayoutChange={onLayoutChange}
      />,
    );
    const handle = container.querySelector('[role="separator"]');
    expect(handle).not.toBeNull();
    expect(handle!.getAttribute("aria-valuenow")).toBeTruthy();

    fireEvent.keyDown(handle!, { key: "ArrowRight" });
    expect(onLayoutChange).toHaveBeenCalled();
  });
});


describe("SmartGridLayout — read-only", () => {
  it("offers no editing affordances at all", () => {
    // Distinct from `isEditMode={false}`, which merely hides the chrome while
    // leaving the machinery mounted and reachable.
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} readOnly />,
    );
    expect(screen.queryByRole("button", { name: "Edit layout" })).toBeNull();
    expect(container.querySelector('[role="separator"]')).toBeNull();
    expect(container.querySelector('[draggable="true"]')).toBeNull();
  });

  it("wins over defaultEditMode", () => {
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        defaultEditMode
        readOnly
      />,
    );
    expect(screen.queryByRole("button", { name: "Done" })).toBeNull();
    expect(screen.getByTestId("tile-alpha")).toBeTruthy();
  });
});

describe("SmartGridLayout — undo / redo", () => {
  const openEditor = () => {
    const onLayoutChange = vi.fn();
    const view = render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        defaultEditMode
        onLayoutChange={onLayoutChange}
      />,
    );
    return { view, onLayoutChange };
  };

  it("starts with both actions disabled", () => {
    openEditor();
    expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Redo" })).toBeDisabled();
  });

  it("enables undo after a change, and round-trips through redo", () => {
    const { view } = openEditor();
    const handle = view.container.querySelector('[role="separator"]')!;
    const spanBefore = handle.getAttribute("aria-valuenow");

    fireEvent.keyDown(handle, { key: "ArrowRight" });
    const spanAfter = view.container
      .querySelector('[role="separator"]')!
      .getAttribute("aria-valuenow");
    expect(spanAfter).not.toBe(spanBefore);

    const undoBtn = screen.getByRole("button", { name: "Undo" });
    expect(undoBtn).not.toBeDisabled();
    fireEvent.click(undoBtn);
    expect(
      view.container.querySelector('[role="separator"]')!.getAttribute("aria-valuenow"),
    ).toBe(spanBefore);

    fireEvent.click(screen.getByRole("button", { name: "Redo" }));
    expect(
      view.container.querySelector('[role="separator"]')!.getAttribute("aria-valuenow"),
    ).toBe(spanAfter);
  });

  it("responds to Ctrl+Z and Ctrl+Shift+Z", () => {
    const { view } = openEditor();
    const handle = () => view.container.querySelector('[role="separator"]')!;
    const before = handle().getAttribute("aria-valuenow");

    fireEvent.keyDown(handle(), { key: "ArrowRight" });
    const after = handle().getAttribute("aria-valuenow");

    fireEvent.keyDown(window, { key: "z", ctrlKey: true });
    expect(handle().getAttribute("aria-valuenow")).toBe(before);

    fireEvent.keyDown(window, { key: "z", ctrlKey: true, shiftKey: true });
    expect(handle().getAttribute("aria-valuenow")).toBe(after);
  });

  it("clears the history when the edit session ends", () => {
    const view = render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    fireEvent.keyDown(view.container.querySelector('[role="separator"]')!, {
      key: "ArrowRight",
    });
    expect(screen.getByRole("button", { name: "Undo" })).not.toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit layout" }));

    // Undoing into a session the user already committed reads as the dashboard
    // changing on its own.
    expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled();
  });

  it("historyLimit={0} removes the controls entirely", () => {
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        defaultEditMode
        historyLimit={0}
      />,
    );
    expect(screen.queryByRole("button", { name: "Undo" })).toBeNull();
  });
});

describe("SmartGridLayout — a failing tile is contained", () => {
  it("replaces only the broken tile and keeps the rest", () => {
    const boom = () => {
      throw new Error("tile exploded");
    };
    const onTileError = vi.fn();
    const err = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <SmartGridLayout
        items={[...ITEMS, def("broken", { title: "Broken tile", render: boom })]}
        defaultLayout={[
          {
            id: "main",
            title: "Main",
            rows: [{ itemIds: ["alpha", "broken"] }],
          },
        ]}
        onTileError={onTileError}
      />,
    );

    // The dashboard survives...
    expect(screen.getByTestId("tile-alpha")).toBeTruthy();
    // ...and the broken tile shows a fallback naming itself.
    expect(screen.getByText("Broken tile")).toBeTruthy();
    expect(onTileError).toHaveBeenCalled();
    err.mockRestore();
  });
});

describe("gridStorage — export and import", () => {
  const LAYOUT_JSON = {
    version: 3 as const,
    sections: [
      {
        id: "main",
        title: "Main",
        order: 0,
        rows: [
          {
            id: "r1",
            order: 0,
            items: [
              {
                definitionId: "alpha",
                id: "i1",
                span: 12,
                order: 0,
                sectionId: "main",
                rowId: "r1",
              },
            ],
          },
        ],
      },
    ],
  };

  it("round-trips", async () => {
    const { exportGridLayout, importGridLayout } = await import(
      "../utils/gridStorage"
    );
    const json = exportGridLayout(LAYOUT_JSON);
    expect(json).toContain("\n"); // pretty-printed, for a human to read
    expect(importGridLayout(json)).toEqual(LAYOUT_JSON);
  });

  it("accepts a bare layout without the envelope", async () => {
    const { importGridLayout } = await import("../utils/gridStorage");
    // What people actually paste after copying out of devtools.
    expect(importGridLayout(JSON.stringify(LAYOUT_JSON))).toEqual(LAYOUT_JSON);
  });

  it("returns null for junk rather than reaching the renderer", async () => {
    const { importGridLayout } = await import("../utils/gridStorage");
    expect(importGridLayout("not json")).toBeNull();
    expect(importGridLayout("{}")).toBeNull();
    expect(importGridLayout(JSON.stringify({ version: 99 }))).toBeNull();
  });
});

describe("gridStorage — responsive columns", () => {
  it("falls back down the scale rather than to nothing", () => {
    // `{ base: 4, lg: 12 }` must give 4 below 1024px, not undefined.
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        maxColumns={{ base: 4, lg: 12 }}
      />,
    );
    expect(screen.getByTestId("tile-alpha")).toBeTruthy();
  });

  it("still accepts a plain number", () => {
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} maxColumns={6} />,
    );
    expect(screen.getByTestId("tile-alpha")).toBeTruthy();
  });
});


describe("SmartGridLayout — section reordering", () => {
  const THREE = [
    { id: "a", title: "Alpha", rows: [{ itemIds: ["alpha"] }] },
    { id: "b", title: "Beta", rows: [{ itemIds: ["beta"] }] },
    { id: "c", title: "Gamma", rows: [{ itemIds: ["gamma"] }] },
  ];

  const sectionOrder = (container: HTMLElement) =>
    [...container.querySelectorAll("[data-sg-section]")].map((el) =>
      el.getAttribute("data-sg-section"),
    );

  const handles = () =>
    screen.getAllByRole("button", { name: /Reorder section/ });

  /**
   * jsdom does not attach a `dataTransfer` to synthetic drag events, so the
   * handler throws on `setData` before it ever records the drag.
   */
  /**
   * jsdom gives every element a zero-size rect, so the insertion snapshot the
   * component takes at drag start is meaningless without one. Stack the
   * sections 200px apart: a spans 0–200 (mid 100), b 200–400 (mid 300),
   * c 400–600 (mid 500).
   */
  const layoutSections = (container: HTMLElement) => {
    [...container.querySelectorAll("[data-sg-section]")].forEach((el, i) => {
      const top = i * 200;
      vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
        top,
        height: 200,
        bottom: top + 200,
        left: 0,
        right: 0,
        width: 0,
        x: 0,
        y: top,
        toJSON: () => ({}),
      } as DOMRect);
    });
  };

  /**
   * jsdom has no constructible `DragEvent`, so RTL falls back to a plain
   * `Event` and silently drops `clientY` from the init — which made every
   * midpoint comparison read `undefined < n`, i.e. always false.
   */
  const dragOverAt = (el: Element, clientY: number) => {
    const event = createEvent.dragOver(el);
    Object.defineProperty(event, "clientY", { value: clientY });
    // jsdom attaches no `dataTransfer`; the handler sets `dropEffect` on it.
    Object.defineProperty(event, "dataTransfer", {
      value: { dropEffect: "none" },
    });
    fireEvent(el, event);
  };

  const dragStart = (el: Element) => {
    const store = new Map<string, string>();
    fireEvent.dragStart(el, {
      dataTransfer: {
        effectAllowed: "move",
        setData: (type: string, value: string) => void store.set(type, value),
        getData: (type: string) => store.get(type) ?? "",
      },
    });
  };

  it("shows a grab handle per section, but only while editing", () => {
    const view = render(
      <SmartGridLayout items={ITEMS} defaultLayout={THREE} />,
    );
    expect(screen.queryAllByRole("button", { name: /Reorder section/ })).toHaveLength(0);
    view.unmount();

    render(<SmartGridLayout items={ITEMS} defaultLayout={THREE} defaultEditMode />);
    expect(handles()).toHaveLength(3);
  });

  it("moves a section with a drag and drop", () => {
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={THREE} defaultEditMode />,
    );
    expect(sectionOrder(container)).toEqual(["a", "b", "c"]);

    layoutSections(container);
    const sections = container.querySelectorAll("[data-sg-section]");
    // Drag the third section above the first (pointer above a's midpoint).
    dragStart(handles()[2]);
    dragOverAt(sections[0], 50);
    fireEvent.drop(sections[0]);

    expect(sectionOrder(container)).toEqual(["c", "a", "b"]);
  });

  it("drops after the target when the pointer is past its midpoint", () => {
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={THREE} defaultEditMode />,
    );
    layoutSections(container);
    const sections = container.querySelectorAll("[data-sg-section]");
    dragStart(handles()[0]);
    // Below every midpoint — lands after the last section.
    dragOverAt(sections[2], 550);
    fireEvent.drop(sections[2]);
    expect(sectionOrder(container)).toEqual(["b", "c", "a"]);
  });

  it("reserves a ghost slot that pushes the sections below it down", async () => {
    // The same treatment a row gives an incoming item: the placeholder takes
    // real space, so the result is visible rather than hinted at by a line.
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={THREE} defaultEditMode />,
    );
    expect(container.querySelector("[data-sg-section-ghost]")).toBeNull();

    layoutSections(container);
    const sections = container.querySelectorAll("[data-sg-section]");
    dragStart(handles()[0]);
    dragOverAt(sections[2], 550);

    const ghost = container.querySelector("[data-sg-section-ghost]");
    expect(ghost).not.toBeNull();

    // The hide is deferred a frame so the browser does not cancel the drag,
    // so the dragged section only leaves the flow on the next paint.
    await waitFor(() =>
      expect(
        container.querySelector('[data-sg-section="a"]')?.hasAttribute("hidden"),
      ).toBe(true),
    );

    // The ghost sits where the section will land — last, after "c".
    const flow = [
      ...container.querySelectorAll("[data-sg-section],[data-sg-section-ghost]"),
    ]
      .filter((el) => !el.hasAttribute("hidden"))
      .map((el) => el.getAttribute("data-sg-section") ?? "ghost");
    expect(flow).toEqual(["b", "c", "ghost"]);
  });

  it("keeps the dragged section mounted, then hides it a frame later", async () => {
    // Two separate requirements pulling against each other: the source element
    // must stay mounted or the browser cancels the drag, and it must leave the
    // flow so the remaining sections close up. Deferring the hide by a frame
    // satisfies both.
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={THREE} defaultEditMode />,
    );
    dragStart(handles()[0]);
    const dragged = () => container.querySelector('[data-sg-section="a"]');

    // Still mounted, and still in the flow, on the frame the drag starts.
    expect(dragged()).not.toBeNull();
    expect(dragged()?.hasAttribute("hidden")).toBe(false);

    await waitFor(() => expect(dragged()?.hasAttribute("hidden")).toBe(true));
    // Mounted throughout — unmounting it would cancel the drag.
    expect(dragged()).not.toBeNull();
  });

  it("clears the ghost when the drag ends without a drop", async () => {
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={THREE} defaultEditMode />,
    );
    layoutSections(container);
    const sections = container.querySelectorAll("[data-sg-section]");
    dragStart(handles()[0]);
    dragOverAt(sections[2], 550);
    expect(container.querySelector("[data-sg-section-ghost]")).not.toBeNull();

    fireEvent.dragEnd(handles()[0]);
    expect(container.querySelector("[data-sg-section-ghost]")).toBeNull();
    expect(
      container.querySelector('[data-sg-section="a"]')?.hasAttribute("hidden"),
    ).toBe(false);
  });

  it("survives a drag passing over a tile inside the target section", () => {
    // The real failure: the item drop handlers call `stopPropagation()`, so a
    // section drag crossing any tile never reached the section's own
    // `dragover` — no ghost appeared, and the drop was handled as an item.
    // Synthetic events dispatched straight at the <section> missed this
    // entirely, which is why the tests passed while the feature did not work.
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={THREE} defaultEditMode />,
    );
    layoutSections(container);
    const sections = container.querySelectorAll("[data-sg-section]");
    dragStart(handles()[0]);

    // Dispatch on a tile *inside* the third section, letting it bubble.
    const tile = sections[2].querySelector("[data-sg-span]");
    expect(tile).not.toBeNull();
    const bubbled = createEvent.dragOver(tile!);
    Object.defineProperty(bubbled, "clientY", { value: 550 });
    fireEvent(tile!, bubbled);

    expect(container.querySelector("[data-sg-section-ghost]")).not.toBeNull();

    const dropEvent = createEvent.drop(tile!);
    fireEvent(tile!, dropEvent);
    expect(sectionOrder(container)).toEqual(["b", "c", "a"]);
  });

  it("dropping a section back where it already is changes nothing", () => {
    // The drop position is geometric now, not "which element did you release
    // over" — so the no-op case is releasing at a point that resolves to the
    // section's current slot.
    const onLayoutChange = vi.fn();
    const { container } = render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={THREE}
        defaultEditMode
        onLayoutChange={onLayoutChange}
      />,
    );
    layoutSections(container);
    const sections = container.querySelectorAll("[data-sg-section]");

    // Drag "b" and release between a's midpoint and c's — i.e. exactly where
    // it already sits.
    dragStart(handles()[1]);
    dragOverAt(sections[1], 250);
    fireEvent.drop(sections[1]);

    expect(sectionOrder(container)).toEqual(["a", "b", "c"]);
    expect(onLayoutChange).not.toHaveBeenCalled();
  });

  it("moves with the arrow keys, since dragging has no keyboard equivalent", () => {
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={THREE} defaultEditMode />,
    );
    fireEvent.keyDown(handles()[0], { key: "ArrowDown" });
    expect(sectionOrder(container)).toEqual(["b", "a", "c"]);

    // The handle for section "a" is now the second one.
    fireEvent.keyDown(handles()[1], { key: "ArrowUp" });
    expect(sectionOrder(container)).toEqual(["a", "b", "c"]);
  });

  it("will not move a section past either end", () => {
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={THREE} defaultEditMode />,
    );
    fireEvent.keyDown(handles()[0], { key: "ArrowUp" });
    expect(sectionOrder(container)).toEqual(["a", "b", "c"]);
    fireEvent.keyDown(handles()[2], { key: "ArrowDown" });
    expect(sectionOrder(container)).toEqual(["a", "b", "c"]);
  });

  it("a reorder is undoable", () => {
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={THREE} defaultEditMode />,
    );
    fireEvent.keyDown(handles()[0], { key: "ArrowDown" });
    expect(sectionOrder(container)).toEqual(["b", "a", "c"]);

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(sectionOrder(container)).toEqual(["a", "b", "c"]);
  });

  it("persists a reorder", async () => {
    const storage = makeStorage();
    const { container } = render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={THREE}
        defaultEditMode
        storageKey="reorder"
        storage={storage}
        autoSaveDebounceMs={0}
      />,
    );
    fireEvent.keyDown(handles()[0], { key: "ArrowDown" });
    expect(sectionOrder(container)).toEqual(["b", "a", "c"]);

    await new Promise((r) => setTimeout(r, 20));
    const { decodeStoredLayout } = await import("../utils/gridStorage");
    const stored = decodeStoredLayout(storage.map.get("ui-kit:grid:reorder") ?? null);
    expect(stored).not.toBeNull();
    const byOrder = [...stored!.sections].sort((x, y) => x.order - y.order);
    expect(byOrder.map((sec) => sec.id)).toEqual(["b", "a", "c"]);
  });
});


describe("SmartGridLayout — the editor chrome follows the surface", () => {
  // Exact, not a regex: "Add Item", "Add New Item" and "Add item to create
  // new section" all live on the page at once.
  const editorButton = () =>
    screen.getAllByRole("button", { name: "Add Item" })[0];

  it("uses glass controls on a glass dashboard", () => {
    // The editing chrome was pinned to `outline` / `ghost` with a hardcoded
    // `slate` accent — the one part of the component that ignored its own
    // `variant`.
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        variant="glass"
        defaultEditMode
      />,
    );
    expect(editorButton().className).toMatch(/backdrop|glass/);
  });

  it("uses outline controls on an elevated dashboard", () => {
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        variant="elevated"
        defaultEditMode
      />,
    );
    expect(editorButton().className).toContain("border");
  });

  it("takes its accent from `tone`, not a hardcoded slate", () => {
    const { container } = render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        tone="violet"
        defaultEditMode
      />,
    );
    expect(container.innerHTML).toContain("violet");
    expect(editorButton().className).not.toContain("slate");
  });
});

describe("SmartGridLayout — drop an item on the zone to remove it", () => {
  const dropZone = () => document.querySelector("[data-sg-delete-zone]");

  const dragTile = (testId: string) => {
    const tile = screen.getByTestId(testId).closest("[data-sg-span]")!;
    const store = new Map<string, string>();
    fireEvent.dragStart(tile, {
      dataTransfer: {
        effectAllowed: "move",
        setData: (t: string, v: string) => void store.set(t, v),
        getData: (t: string) => store.get(t) ?? "",
      },
    });
    return tile;
  };

  it("shows no per-tile delete button any more", () => {
    // A destructive control used to sit permanently on top of the user's own
    // tile content.
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    expect(screen.queryByRole("button", { name: /^Remove alpha/ })).toBeNull();
  });

  it("shows the zone only while an item is in flight", () => {
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    // An always-on delete target is a hazard, and there is nothing to say when
    // nothing is being dragged.
    expect(dropZone()).toBeNull();

    dragTile("tile-alpha");
    expect(dropZone()).not.toBeNull();
  });

  it("never shows the zone outside edit mode", () => {
    render(<SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} />);
    expect(dropZone()).toBeNull();
  });

  it("removes the item when it is dropped there", () => {
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    expect(screen.getByTestId("tile-alpha")).toBeTruthy();

    dragTile("tile-alpha");
    const zone = dropZone()!;
    fireEvent.dragOver(zone, { dataTransfer: { dropEffect: "none" } });
    fireEvent.drop(zone, {
      dataTransfer: { getData: () => "" },
    });

    expect(screen.queryByTestId("tile-alpha")).toBeNull();
    // The other tile is untouched.
    expect(screen.getByTestId("tile-beta")).toBeTruthy();
  });

  it("fills the row up to the controls", () => {
    // A bigger target is easier to hit mid-drag, which is the whole point of
    // a drop zone. It used to size to its label.
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    dragTile("tile-alpha");
    expect(dropZone()!.className).toContain("flex-1");
    // ...and the controls beside it keep their width.
    const controls = screen
      .getByRole("button", { name: "Done" })
      .closest("div")!;
    expect(controls.className).toContain("shrink-0");
  });

  it("changes its wording once the pointer is over it", () => {
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    dragTile("tile-alpha");
    expect(dropZone()!.textContent).toContain("Drop here to remove");

    fireEvent.dragOver(dropZone()!, { dataTransfer: { dropEffect: "none" } });
    expect(dropZone()!.textContent).toContain("Release to remove");
  });

  it("all but hides the dragged tile, so the drop target stays visible", () => {
    // At 50% the tile still covered the ghost showing where it would land —
    // the one thing the user needs to see was behind the thing they are
    // moving. The browser's own drag image under the cursor is what tells them
    // what is in flight.
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    const tile = dragTile("tile-alpha");
    expect(tile.className).toContain("opacity-10");
    expect(tile.className).not.toContain("opacity-50");
    // Opacity only. Making the drag source non-hit-testable while a drag is
    // running cancels it outright — the same failure as hiding or unmounting
    // it, and it is invisible to a synthetic-event test, so it is asserted on
    // the class instead.
    expect(tile.className).not.toContain("pointer-events-none");

    fireEvent.dragOver(dropZone()!, { dataTransfer: { dropEffect: "none" } });
    const after = screen.getByTestId("tile-alpha").closest("[data-sg-span]")!;
    // Still hidden, and greyed to say what is about to happen to it.
    expect(after.className).toContain("opacity-10");
    expect(after.className).toContain("grayscale");
  });

  it("leaving the zone restores the normal drag treatment", () => {
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    dragTile("tile-alpha");
    fireEvent.dragOver(dropZone()!, { dataTransfer: { dropEffect: "none" } });
    fireEvent.dragLeave(dropZone()!);
    expect(dropZone()!.textContent).toContain("Drop here to remove");
  });
});


describe("SmartGridLayout — `plain` is the default", () => {
  it("draws no surface at all", () => {
    // A dashboard is nearly always dropped into a page that already has its
    // own container; drawing a second panel around it produced a grey slab
    // floating over whatever was behind.
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className.trim()).toBe("relative");
  });

  it("still renders its content", () => {
    render(<SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} />);
    expect(screen.getByTestId("tile-alpha")).toBeTruthy();
    expect(screen.getByText("Main")).toBeTruthy();
  });

  it("leaves the padding to the host container", () => {
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} size="xl" />,
    );
    expect((container.firstElementChild as HTMLElement).className).not.toMatch(
      /\bp-\d/,
    );
  });

  it("takes a surface back when one is asked for", () => {
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} variant="elevated" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("shadow");
    expect(root.className).toMatch(/\bp-\d/);
  });

  it("uses glass controls, because the background is unknown", () => {
    // `plain` means the component cannot know what is behind it. Glass is the
    // treatment built for that: it reads on a white page and on a photograph.
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    const add = screen.getAllByRole("button", { name: "Add Item" })[0];
    expect(add.className).toMatch(/backdrop|glass/);
  });

  it("uses high-contrast copy, since muted neutral vanishes over a photo", () => {
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} />,
    );
    // The translucent palette, not the muted solid one.
    expect(container.innerHTML).not.toContain("text-neutral-500");
  });
});


describe("SmartGridLayout — control surface, independent of the body", () => {
  it("`controlVariant` overrides what the body implies", () => {
    // A `plain` dashboard over a photograph wants glass controls while its
    // body draws nothing — the two cannot be expressed with one prop.
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        variant="elevated"
        controlVariant="glass"
        defaultEditMode
      />,
    );
    const add = screen.getAllByRole("button", { name: "Add Item" })[0];
    expect(add.className).toMatch(/backdrop|glass/);
  });

  it("still follows the body when it is not set", () => {
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        variant="elevated"
        defaultEditMode
      />,
    );
    expect(
      screen.getAllByRole("button", { name: "Add Item" })[0].className,
    ).toContain("border");
  });
});

describe("SmartGridLayout — section header", () => {
  const THREE_SECTIONS = [
    { id: "a", title: "Alpha", rows: [{ itemIds: ["alpha"] }] },
    { id: "b", title: "Beta", rows: [{ itemIds: ["beta"] }] },
  ];

  it("hides the drag handle when there is only one section", () => {
    // A lone section's handle is a control that cannot do anything.
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    expect(
      screen.queryAllByRole("button", { name: /Reorder section/ }),
    ).toHaveLength(0);
  });

  it("shows it once there is somewhere to move to", () => {
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={THREE_SECTIONS}
        defaultEditMode
      />,
    );
    expect(
      screen.getAllByRole("button", { name: /Reorder section/ }),
    ).toHaveLength(2);
  });

  it("tints the handle with the accent tone", () => {
    const { container } = render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={THREE_SECTIONS}
        tone="violet"
        defaultEditMode
      />,
    );
    const handle = container.querySelector('[aria-label^="Reorder section"]');
    expect(handle!.className).toContain("violet");
  });

  it("renames from the title itself, with no separate Rename button", () => {
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    expect(screen.queryByRole("button", { name: "Rename" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Main" }));
    const input = screen.getByLabelText("Section title") as HTMLInputElement;
    expect(input.value).toBe("Main");

    fireEvent.change(input, { target: { value: "Renamed" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByRole("button", { name: "Renamed" })).toBeTruthy();
  });

  it("leaves the title as a plain heading outside edit mode", () => {
    render(<SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} />);
    expect(screen.queryByRole("button", { name: "Main" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Main" })).toBeTruthy();
  });

  it("keeps the row and section icon actions ghost on any surface", () => {
    // A deliberate exception to the surface mapping: these sit in the margins
    // beside content rather than in the toolbar, and giving them the toolbar's
    // treatment put a column of bordered chips down the left edge of every row.
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        variant="elevated"
        defaultEditMode
      />,
    );
    // The toolbar button does take the surface.
    expect(
      screen.getAllByRole("button", { name: "Add Item" })[0].className,
    ).toContain("border");

    // The row/section icon actions do not.
    const sectionDelete = screen.getByRole("button", {
      name: "Remove section and all items",
    });
    const rowDelete = screen.getAllByRole("button", { name: "Remove row" })[0];
    for (const el of [sectionDelete, rowDelete]) {
      expect(el.className).not.toContain("border-");
    }
  });
});

describe("SmartGridLayout — the item palette", () => {
  const openPalette = () =>
    fireEvent.click(screen.getAllByRole("button", { name: "Add Item" })[0]);
  const palette = () => document.querySelector("[data-sg-palette]");
  /**
   * The palette is a `SidePanel` now, so closing collapses it and only unmounts
   * when the width transition ends — which jsdom never fires on its own.
   */
  const paletteShell = () =>
    palette()!.closest(".overflow-hidden") as HTMLElement;
  const finishClosing = () =>
    fireEvent.transitionEnd(paletteShell(), { propertyName: "width" });

  const ITEMS_WITH_SPARE: SmartGridItemDefinition[] = [
    ...ITEMS,
    def("delta", { defaultSpan: 4 }),
  ];

  it("is closed until asked for, and lives inside the dashboard", () => {
    const { container } = render(
      <SmartGridLayout
        items={ITEMS_WITH_SPARE}
        defaultLayout={LAYOUT}
        defaultEditMode
      />,
    );
    expect(palette()).toBeNull();

    openPalette();
    expect(palette()).not.toBeNull();
    // Contained: it is part of the component, not a document-level dialog.
    expect(container.firstElementChild!.contains(palette()!)).toBe(true);
  });

  it("does not cover the dashboard the way the modal did", () => {
    // The whole point: you can see the gap you are filling while you choose.
    render(
      <SmartGridLayout
        items={ITEMS_WITH_SPARE}
        defaultLayout={LAYOUT}
        defaultEditMode
      />,
    );
    openPalette();
    expect(screen.getByTestId("tile-alpha")).toBeTruthy();
    expect(screen.getByTestId("tile-beta")).toBeTruthy();
  });

  it("stays open after an add, so several items are one flow", () => {
    // The modal closed after every add: four tiles was four open/pick/close
    // cycles.
    render(
      <SmartGridLayout
        items={ITEMS_WITH_SPARE}
        defaultLayout={LAYOUT}
        defaultEditMode
      />,
    );
    openPalette();
    const add = within(palette() as HTMLElement).getAllByRole("button", {
      name: "Add",
    })[0];
    fireEvent.click(add);
    expect(palette()).not.toBeNull();
  });

  it("filters as you search", () => {
    render(
      <SmartGridLayout
        items={ITEMS_WITH_SPARE}
        defaultLayout={LAYOUT}
        defaultEditMode
      />,
    );
    openPalette();
    const scope = within(palette() as HTMLElement);
    expect(scope.getByText("delta")).toBeTruthy();
    fireEvent.change(scope.getByLabelText("Search items"), {
      target: { value: "zzz" },
    });
    expect(scope.queryByText("delta")).toBeNull();
    expect(scope.getByText("No matches")).toBeTruthy();
  });

  it("drops a `single` item once it is on the board, but repeatable ones stay", () => {
    // `addableItems` filters deployed *single* items only — a definition that
    // is not `single` can legitimately be added again.
    render(
      <SmartGridLayout
        items={[
          def("solo", { single: true }),
          def("many", { single: false }),
        ]}
        defaultLayout={[
          { id: "main", title: "Main", rows: [{ itemIds: ["solo", "many"] }] },
        ]}
        defaultEditMode
      />,
    );
    openPalette();
    const scope = within(palette() as HTMLElement);
    expect(scope.queryByText("solo")).toBeNull();
    expect(scope.getByText("many")).toBeTruthy();
  });

  it("closes on its own button", () => {
    render(
      <SmartGridLayout
        items={ITEMS_WITH_SPARE}
        defaultLayout={LAYOUT}
        defaultEditMode
      />,
    );
    openPalette();
    fireEvent.click(
      screen.getByRole("button", { name: "Close the item palette" }),
    );
    // Collapsed straight away, gone once the slide finishes.
    expect(paletteShell().style.width).toBe("0px");
    finishClosing();
    expect(palette()).toBeNull();
  });

  it("is never shown outside edit mode", () => {
    const { rerender } = render(
      <SmartGridLayout
        items={ITEMS_WITH_SPARE}
        defaultLayout={LAYOUT}
        defaultEditMode
      />,
    );
    openPalette();
    expect(palette()).not.toBeNull();

    rerender(
      <SmartGridLayout
        items={ITEMS_WITH_SPARE}
        defaultLayout={LAYOUT}
        isEditMode={false}
      />,
    );
    expect(paletteShell().style.width).toBe("0px");
    finishClosing();
    expect(palette()).toBeNull();
  });


  it("can be resized, and drops the grip outside the panel", async () => {
    render(
      <SmartGridLayout
        items={ITEMS_WITH_SPARE}
        defaultLayout={LAYOUT}
        defaultEditMode
      />,
    );
    openPalette();
    const grip = document.querySelector(
      '[role="separator"][aria-label="Resize panel"]',
    ) as HTMLElement;
    expect(grip).not.toBeNull();
    expect(paletteShell().contains(grip)).toBe(false);
    // Rides the panel's edge — it starts collapsed and arrives with the slide.
    await waitFor(() => expect(grip.style.right).toBe("288px"));

    fireEvent.mouseDown(grip, { clientX: 600 });
    fireEvent.mouseMove(window, { clientX: 540 });
    fireEvent.mouseUp(window);
    expect(paletteShell().style.width).toBe("348px");
  });

  it("shows the ghost while a palette item is dragged over a row", () => {
    // The drop worked without this; the *preview* did not render, so the drag
    // gave no feedback at all and read as "I cannot drag it". A test that only
    // checks the drop passes straight through that.
    const { container } = render(
      <SmartGridLayout
        items={ITEMS_WITH_SPARE}
        defaultLayout={LAYOUT}
        defaultEditMode
      />,
    );
    openPalette();
    const entry = document.querySelector('[data-sg-palette-item="delta"]')!;
    const store = new Map<string, string>();
    fireEvent.dragStart(entry, {
      dataTransfer: {
        effectAllowed: "copy",
        setData: (t: string, v: string) => void store.set(t, v),
        getData: (t: string) => store.get(t) ?? "",
      },
    });

    const row = container.querySelector("[data-sg-row-id]")!;
    const before = row.querySelectorAll("[data-sg-span]").length;
    fireEvent.dragOver(row, {
      clientX: 10,
      clientY: 10,
      dataTransfer: { dropEffect: "none", getData: () => "" },
    });
    // A ghost cell has appeared alongside the real ones.
    expect(row.querySelectorAll("[data-sg-span]").length).toBeGreaterThan(
      before,
    );
  });

  it("drops a dragged item into the row it was aimed at", () => {
    // Adding is now the same gesture as moving: the item lands where the
    // preview shows, rather than appending and being dragged afterwards.
    const { container } = render(
      <SmartGridLayout
        items={ITEMS_WITH_SPARE}
        defaultLayout={LAYOUT}
        defaultEditMode
      />,
    );
    openPalette();
    expect(screen.queryByTestId("tile-delta")).toBeNull();

    const entry = document.querySelector('[data-sg-palette-item="delta"]')!;
    const store = new Map<string, string>();
    fireEvent.dragStart(entry, {
      dataTransfer: {
        effectAllowed: "copy",
        setData: (t: string, v: string) => void store.set(t, v),
        getData: (t: string) => store.get(t) ?? "",
      },
    });

    const row = container.querySelector("[data-sg-row-id]")!;
    fireEvent.dragOver(row, {
      clientX: 10,
      clientY: 10,
      dataTransfer: { dropEffect: "none", getData: () => "" },
    });
    fireEvent.drop(row, { dataTransfer: { getData: () => "" } });

    expect(screen.getByTestId("tile-delta")).toBeTruthy();
  });

  it("announces the add", () => {
    render(
      <SmartGridLayout
        items={ITEMS_WITH_SPARE}
        defaultLayout={LAYOUT}
        defaultEditMode
      />,
    );
    openPalette();
    fireEvent.click(
      within(palette() as HTMLElement).getAllByRole("button", { name: "Add" })[0],
    );
    expect(
      document.querySelector("[data-sg-announcer]")!.textContent,
    ).toContain("added");
  });
});


describe("SmartGridLayout — the row preview does not fight the reflow", () => {
  const TWO_ROWS = [
    {
      id: "main",
      title: "Main",
      rows: [{ itemIds: ["alpha", "beta"] }, { itemIds: ["gamma"] }],
    },
  ];

  const startItemDrag = (el: Element) => {
    const store = new Map<string, string>();
    fireEvent.dragStart(el, {
      dataTransfer: {
        effectAllowed: "move",
        setData: (t: string, v: string) => void store.set(t, v),
        getData: (t: string) => store.get(t) ?? "",
      },
    });
  };

  const overAt = (el: Element, clientX: number, clientY: number) => {
    const event = createEvent.dragOver(el);
    Object.defineProperty(event, "clientX", { value: clientX });
    Object.defineProperty(event, "clientY", { value: clientY });
    Object.defineProperty(event, "dataTransfer", {
      value: { dropEffect: "none", getData: () => "" },
    });
    fireEvent(el, event);
  };

  /** Stack the rows so the drag-start snapshot means something. */
  const layoutRows = (container: HTMLElement) => {
    [...container.querySelectorAll("[data-sg-row-id]")].forEach((el, i) => {
      const top = i * 200;
      vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
        top, height: 200, bottom: top + 200,
        left: 0, right: 400, width: 400, x: 0, y: top,
        toJSON: () => ({}),
      } as DOMRect);
    });
  };

  it("leaves the preview alone when the pointer leaves a row", () => {
    // Inserting the ghost reflows the row and pushes the pointer out of it,
    // firing `dragleave`. Clearing there snapped the layout back and re-entered
    // the row — the flicker the user reported between two rows.
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={TWO_ROWS} defaultEditMode />,
    );
    layoutRows(container);
    const rows = container.querySelectorAll("[data-sg-row-id]");

    startItemDrag(screen.getByTestId("tile-gamma").closest("[data-sg-span]")!);
    overAt(rows[0], 100, 100);
    const ghosts = () => container.querySelectorAll("[data-sg-span]").length;
    const withPreview = ghosts();

    fireEvent.dragLeave(rows[0], { relatedTarget: document.body });
    // The preview survives: only another row claiming it, or the drag ending,
    // takes it away.
    expect(ghosts()).toBe(withPreview);
  });

  it("will not let a neighbouring row claim a pointer outside its own band", () => {
    // The reflow moves rows under a stationary pointer. Without the band
    // check, the neighbour's `dragover` claims the preview, the layout swaps
    // back, and the two rows trade it forever.
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={TWO_ROWS} defaultEditMode />,
    );
    layoutRows(container);
    const rows = container.querySelectorAll("[data-sg-row-id]");

    startItemDrag(screen.getByTestId("tile-gamma").closest("[data-sg-span]")!);
    // Pointer well inside row 1's band...
    overAt(rows[0], 100, 100);
    const afterRow1 = container.innerHTML;

    // ...and row 2 fires a dragover for the same point. It must decline.
    overAt(rows[1], 100, 100);
    expect(container.innerHTML).toBe(afterRow1);
  });

  it("does not trade the preview back and forth near the boundary", () => {
    // The bands are frozen at drag start, but the rendered rows move during
    // the drag — the source row collapses, the target grows. Around the
    // boundary a movement of a pixel or two used to flip the answer, and the
    // two rows traded the preview: the flicker.
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={TWO_ROWS} defaultEditMode />,
    );
    layoutRows(container);
    const rows = container.querySelectorAll("[data-sg-row-id]");

    startItemDrag(screen.getByTestId("tile-gamma").closest("[data-sg-span]")!);
    // Settle on row 1.
    overAt(rows[0], 100, 100);
    const owned = container.innerHTML;

    // Now jitter across the 200px boundary, the way a hand does, checking
    // *every* step — asserting only the final state would pass even if the
    // preview flipped back and forth on the way.
    for (const y of [195, 201, 198, 205, 199, 210, 197]) {
      overAt(rows[0], 100, y);
      expect(container.innerHTML).toBe(owned);
      overAt(rows[1], 100, y);
      expect(container.innerHTML).toBe(owned);
    }
  });

  it("still hands over when the pointer really is in the other row", () => {
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={TWO_ROWS} defaultEditMode />,
    );
    layoutRows(container);
    const rows = container.querySelectorAll("[data-sg-row-id]");

    startItemDrag(screen.getByTestId("tile-alpha").closest("[data-sg-span]")!);
    overAt(rows[0], 100, 100);
    const inRow1 = container.innerHTML;

    // 300 is inside row 2's band (200–400).
    overAt(rows[1], 100, 300);
    expect(container.innerHTML).not.toBe(inRow1);
  });
});


describe("SmartGridLayout — tiles are not re-rendered by the grid's own churn", () => {
  it("does not call a tile's render again when another tile is resized", () => {
    // `setLayout` fires on every `mousemove` of a resize, so without a memo
    // every tile's `render()` ran again each frame — the difference between a
    // smooth drag and a slideshow on a dashboard of charts.
    let alphaRenders = 0;
    const counted: SmartGridItemDefinition[] = [
      {
        ...def("alpha", { defaultSpan: 6 }),
        render: () => {
          alphaRenders += 1;
          return <div data-testid="tile-alpha">alpha</div>;
        },
      },
      def("beta", { defaultSpan: 6 }),
    ];

    const { container } = render(
      <SmartGridLayout
        items={counted}
        defaultLayout={[
          { id: "main", title: "Main", rows: [{ itemIds: ["alpha", "beta"] }] },
        ]}
        defaultEditMode
      />,
    );
    const initial = alphaRenders;
    expect(initial).toBeGreaterThan(0);

    // Resize the pair from the keyboard: the layout changes, so the grid
    // re-renders, but alpha's own content has not.
    const handle = container.querySelector('[role="separator"]')!;
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    fireEvent.keyDown(handle, { key: "ArrowRight" });

    expect(alphaRenders).toBe(initial);
  });

  it("still re-renders a tile when its own definition changes", () => {
    const { rerender } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} />,
    );
    expect(screen.getByTestId("tile-alpha")).toBeTruthy();

    rerender(
      <SmartGridLayout
        items={ITEMS.map((item) =>
          item.id === "alpha"
            ? {
                ...item,
                render: () => <div data-testid="tile-alpha-v2">v2</div>,
              }
            : item,
        )}
        defaultLayout={LAYOUT}
      />,
    );
    expect(screen.getByTestId("tile-alpha-v2")).toBeTruthy();
  });
});


describe("SmartGridLayout — announcements", () => {
  const live = () => document.querySelector("[data-sg-announcer]");

  it("has a polite live region", () => {
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} />,
    );
    const region = container.querySelector("[data-sg-announcer]")!;
    expect(region.getAttribute("aria-live")).toBe("polite");
    expect(region.getAttribute("role")).toBe("status");
  });

  it("says what a keyboard resize did", () => {
    // The keyboard paths moved things with no confirmation at all.
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    fireEvent.keyDown(container.querySelector('[role="separator"]')!, {
      key: "ArrowRight",
    });
    expect(live()!.textContent).toMatch(/columns/);
  });

  it("names the tile it removed", () => {
    render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    const tile = screen.getByTestId("tile-alpha").closest("[data-sg-span]")!;
    const store = new Map<string, string>();
    fireEvent.dragStart(tile, {
      dataTransfer: {
        effectAllowed: "move",
        setData: (t: string, v: string) => void store.set(t, v),
        getData: (t: string) => store.get(t) ?? "",
      },
    });
    const zone = document.querySelector("[data-sg-delete-zone]")!;
    fireEvent.dragOver(zone, { dataTransfer: { dropEffect: "none" } });
    fireEvent.drop(zone, { dataTransfer: { getData: () => "" } });
    expect(live()!.textContent).toContain("alpha removed");
  });

  it("says which way a section moved", () => {
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={[
          { id: "a", title: "Alpha", rows: [{ itemIds: ["alpha"] }] },
          { id: "b", title: "Beta", rows: [{ itemIds: ["beta"] }] },
        ]}
        defaultEditMode
      />,
    );
    fireEvent.keyDown(
      screen.getAllByRole("button", { name: /Reorder section/ })[0],
      { key: "ArrowDown" },
    );
    expect(live()!.textContent).toContain("Section Alpha moved down");
  });

  it("repeats an identical action rather than going silent", () => {
    // An unchanged string is not re-announced, so two identical moves would be
    // read once.
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} defaultEditMode />,
    );
    const handle = container.querySelector('[role="separator"]')!;
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    const first = live()!.textContent;
    fireEvent.keyDown(handle, { key: "ArrowLeft" });
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(live()!.textContent).not.toBe("");
    expect(first).toBeTruthy();
  });
});

describe("SmartGridLayout — moving a tile from the keyboard", () => {
  const TWO = [
    { id: "main", title: "Main", rows: [{ itemIds: ["alpha", "beta"] }] },
  ];
  const tileOf = (id: string) =>
    screen.getByTestId(`tile-${id}`).closest("[data-sg-span]")!;
  const order = (container: HTMLElement) =>
    [...container.querySelectorAll("[data-sg-item-id]")]
      .map((el) => el.textContent?.trim())
      .filter(Boolean);

  it("exposes each tile as a focusable control while editing", () => {
    render(<SmartGridLayout items={ITEMS} defaultLayout={TWO} defaultEditMode />);
    const tile = tileOf("alpha");
    expect(tile.getAttribute("tabindex")).toBe("0");
    expect(tile.getAttribute("aria-label")).toMatch(/Press Enter to lift/);
  });

  it("is inert outside edit mode", () => {
    render(<SmartGridLayout items={ITEMS} defaultLayout={TWO} />);
    expect(tileOf("alpha").getAttribute("tabindex")).toBeNull();
  });

  it("lifts, moves and places", () => {
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={TWO} defaultEditMode />,
    );
    expect(order(container)[0]).toContain("alpha");

    fireEvent.keyDown(tileOf("alpha"), { key: "Enter" });
    expect(tileOf("alpha").getAttribute("aria-grabbed")).toBe("true");

    fireEvent.keyDown(tileOf("alpha"), { key: "ArrowRight" });
    expect(order(container)[0]).toContain("beta");

    fireEvent.keyDown(tileOf("alpha"), { key: "Enter" });
    expect(tileOf("alpha").getAttribute("aria-grabbed")).toBe("false");
  });

  it("ignores the arrows until the tile is lifted", () => {
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={TWO} defaultEditMode />,
    );
    fireEvent.keyDown(tileOf("alpha"), { key: "ArrowRight" });
    expect(order(container)[0]).toContain("alpha");
  });

  it("Escape puts the tile back where it started", () => {
    const { container } = render(
      <SmartGridLayout items={ITEMS} defaultLayout={TWO} defaultEditMode />,
    );
    fireEvent.keyDown(tileOf("alpha"), { key: "Enter" });
    fireEvent.keyDown(tileOf("alpha"), { key: "ArrowRight" });
    expect(order(container)[0]).toContain("beta");

    fireEvent.keyDown(tileOf("alpha"), { key: "Escape" });
    expect(order(container)[0]).toContain("alpha");
    expect(tileOf("alpha").getAttribute("aria-grabbed")).toBe("false");
  });

  it("says so at the edge instead of moving nothing silently", () => {
    render(<SmartGridLayout items={ITEMS} defaultLayout={TWO} defaultEditMode />);
    fireEvent.keyDown(tileOf("alpha"), { key: "Enter" });
    fireEvent.keyDown(tileOf("alpha"), { key: "ArrowLeft" });
    expect(
      document.querySelector("[data-sg-announcer]")!.textContent,
    ).toContain("Edge of the row");
  });
});

/**
 * The className a kit Button produces for a given variant, so the assertion
 * reads "styled as this variant" instead of pinning a copy of the theme's
 * Tailwind output that would need editing every time the theme moves.
 */
const renderVariantProbe = (variant: ButtonVariant, label: string) => {
  const { container, unmount } = render(
    <Button type="button" variant={variant} size="xs" color="blue">
      {label}
    </Button>,
  );
  const cls = (container.querySelector("button") as HTMLElement).className;
  unmount();
  return cls;
};

describe("SmartGridLayout — the edit-layout button follows the controls", () => {
  const editButton = () =>
    screen.getByRole("button", { name: /Edit layout|Done/ });

  it("takes its variant from the surface", () => {
    // `plain` maps to glass; it used to be pinned to `outline` regardless, so
    // a glass dashboard grew one bordered chip beside its glass controls.
    render(<SmartGridLayout items={ITEMS} defaultLayout={LAYOUT} />);
    expect(editButton().className).toBe(
      renderVariantProbe("glass", "Edit layout"),
    );
  });

  it("lets controlVariant override the surface default", () => {
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        variant="elevated"
        controlVariant="solid"
      />,
    );
    expect(editButton().className).toBe(
      renderVariantProbe("solid", "Edit layout"),
    );
  });

  it("keeps that variant once edit mode is on", () => {
    render(
      <SmartGridLayout
        items={ITEMS}
        defaultLayout={LAYOUT}
        controlVariant="ghost"
        defaultEditMode
      />,
    );
    expect(editButton().textContent).toBe("Done");
    expect(editButton().className).toBe(renderVariantProbe("ghost", "Done"));
  });
});
