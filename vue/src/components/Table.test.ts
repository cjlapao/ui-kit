import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Table from "./Table.vue";
import type { TableColumn, TableProps } from "./Table.vue";
import { TRUE_COLORS, NEUTRAL_TONES } from "../theme/Theme";
import {
  buildTableStorageKey,
  decodeStoredSettings,
  encodeStoredSettings,
  type TableStorageAdapter,
} from "../utils/tableStorage";

type Row = { id: number; name: string; role: string; age: number };

const rows: Row[] = [
  { id: 1, name: "Zoe", role: "Admin", age: 34 },
  { id: 2, name: "Ava", role: "Admin", age: 29 },
  { id: 3, name: "Leo", role: "Editor", age: 41 },
  { id: 4, name: "Max", role: "Editor", age: 25 },
];

const baseColumns: TableColumn<Row>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "role", header: "Role", accessor: "role", sortable: true },
  { id: "age", header: "Age", accessor: "age" },
];

function memoryStorage(): TableStorageAdapter & { store: Map<string, string> } {
  const store = new Map<string, string>();
  return {
    store,
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    setItem: (k, v) => {
      store.set(k, v);
    },
    removeItem: (k) => {
      store.delete(k);
    },
  };
}

// test-utils cannot infer the SFC's generic parameter from the props
// object, so the component is cast; the props object stays fully typed.
const mountTable = (props: Partial<TableProps<Row>> = {}) =>
  mount(Table as any, {
    props: { columns: baseColumns, data: rows, ...props },
  });

const firstTh = (wrapper: ReturnType<typeof mountTable>) =>
  wrapper.find("th");
const thByHeader = (
  wrapper: ReturnType<typeof mountTable>,
  header: string,
) => wrapper.findAll("th").find((th) => (th.text() ?? "").includes(header));

describe("Table — surface family", () => {
  it("defaults to the outlined panel surface", () => {
    expect(mountTable().find("section[data-variant='outlined']").exists()).toBe(
      true,
    );
  });

  it("forwards the panel family variant and tone", () => {
    const wrapper = mountTable({ variant: "glass", tone: "blue" });
    expect(wrapper.find("section").attributes("data-variant")).toBe("glass");
    expect(wrapper.find("section").attributes("data-tone")).toBe("blue");
  });
});

describe("Table — density", () => {
  it("uses the default density scale", () => {
    const cls = firstTh(mountTable()).classes().join(" ");
    expect(cls).toContain("px-6");
    expect(cls).toContain("py-5");
  });

  it("tightens cells at compact density", () => {
    const cls = firstTh(mountTable({ density: "compact" })).classes().join(" ");
    expect(cls).toContain("px-4");
    expect(cls).toContain("py-3");
  });

  it("drops font size at minimal density", () => {
    const cls = firstTh(mountTable({ density: "minimal" })).classes().join(" ");
    expect(cls).toContain("px-3");
    expect(cls).toContain("py-4");
    expect(cls).toContain("text-xs");
  });
});

describe("Table — bordered", () => {
  it("draws grid lines between columns", () => {
    const wrapper = mountTable({ bordered: true });
    expect(wrapper.find("table").classes().join(" ")).toContain("border");
    const ths = wrapper.findAll("th");
    expect(ths[0].classes()).toContain("border-r");
    expect(ths[1].classes()).toContain("border-r");
    expect(ths[2].classes()).not.toContain("border-r");
    // the rule carries its colour — a bare border-r paints currentColor
    expect(ths[0].classes()).toContain("border-neutral-200");
    expect(ths[0].classes()).toContain("dark:border-neutral-700");
    // and a little extra room so cell text never sits on the line
    expect(ths[0].classes()).toContain("pr-2");
    expect(ths[2].classes()).not.toContain("pr-2");
    const tds = wrapper.findAll("tbody td");
    expect(tds[0].classes()).toContain("pr-2");
    expect(tds[2].classes()).not.toContain("pr-2");
  });

  it("lets noBorders win over bordered", () => {
    const wrapper = mountTable({ bordered: true, noBorders: true });
    expect(firstTh(wrapper).classes()).not.toContain("border-r");
  });
});

describe("Table — translucent surfaces", () => {
  const footer = "3 rows";

  it("keeps the header band and footer see-through on glass", () => {
    const wrapper = mountTable({ variant: "glass", footer });
    expect(firstTh(wrapper).classes()).toContain("bg-white/20");
    expect(firstTh(wrapper).classes()).toContain("dark:bg-white/5");
    const footerEl = wrapper.find(".border-t");
    expect(footerEl.classes()).toContain("bg-white/20");
    expect(footerEl.classes()).not.toContain("bg-neutral-50");
  });

  it("tints the glass header with a translucent tone veil", () => {
    const wrapper = mountTable({ variant: "liquid-glass", tone: "blue" });
    const cls = firstTh(wrapper).classes();
    expect(cls).toContain("bg-blue-50/50");
    expect(cls).toContain("border-blue-200/60");
    expect(cls).toContain("dark:bg-blue-500/15");
    expect(cls).toContain("dark:border-blue-500/30");
  });

  it("keeps opaque header and footer on solid surfaces", () => {
    const wrapper = mountTable({ variant: "outlined", tone: "blue", footer });
    const cls = firstTh(wrapper).classes();
    expect(cls).toContain("bg-blue-50");
    expect(cls).not.toContain("bg-blue-50/50");
    expect(wrapper.find(".border-t").classes()).toContain("bg-neutral-50");
  });
});

describe("Table — control tone", () => {
  const sorted = { columnId: "name", direction: "asc" as const };

  const sortButton = (wrapper: ReturnType<typeof mountTable>) =>
    thByHeader(wrapper, "Name")!.find("button");

  it("tints the interior controls with the table tone by default", () => {
    const wrapper = mountTable({ tone: "emerald", defaultSort: sorted });
    expect(sortButton(wrapper).classes().join(" ")).toContain("emerald");
  });

  it("lets `color` override the control tone without touching the surface", () => {
    const wrapper = mountTable({
      tone: "emerald",
      color: "blue",
      defaultSort: sorted,
    });
    // the control switches to blue…
    expect(sortButton(wrapper).classes().join(" ")).toContain("blue");
    expect(sortButton(wrapper).classes().join(" ")).not.toContain("emerald");
    // …while the header band keeps the table tone
    expect(firstTh(wrapper).classes()).toContain("bg-emerald-50");
  });
});

describe("Table — tone treatment", () => {
  it("emits the full dark-mode header rule set for every tone", () => {
    for (const tone of TRUE_COLORS) {
      const cls = firstTh(mountTable({ tone })).classes().join(" ");
      if (NEUTRAL_TONES.includes(tone)) {
        expect(cls).toContain("bg-neutral-50");
      } else {
        expect(cls).toContain(`bg-${tone}-50`);
        expect(cls).toContain(`dark:border-${tone}-500/30`);
        expect(cls).toContain(`dark:bg-${tone}-500/15`);
      }
    }
  });

  it("tints the selected row with the table color", () => {
    const wrapper = mountTable({
      rowKey: (r: Row) => r.id,
      selectedItems: [rows[0]],
      color: "rose",
    });
    const tr = wrapper.findAll("tbody tr").find((t) => t.text().includes("Zoe"));
    expect(tr!.classes().join(" ")).toContain("bg-rose-50");
  });
});

describe("Table — built-in persistence", () => {
  const key = buildTableStorageKey("ui-kit:table", "users");

  it("restores stored column visibility on mount", () => {
    const storage = memoryStorage();
    storage.setItem(
      key,
      encodeStoredSettings({ columnVisibility: { role: false } }),
    );
    const wrapper = mountTable({ storageKey: "users", storage });
    expect(thByHeader(wrapper, "Role")).toBeUndefined();
  });

  it("persists a settings change under {prefix}:{key}", async () => {
    const storage = memoryStorage();
    const wrapper = mountTable({
      storageKey: "users",
      storage,
      showColumnSelector: true,
    });
    await wrapper
      .find("button[aria-label='Toggle column visibility']")
      .trigger("click");
    const roleLabel = wrapper
      .findAll("label")
      .find((l) => l.text().trim() === "Role");
    await roleLabel!.find("input").trigger("change");

    const stored = decodeStoredSettings(storage.getItem(key));
    expect(stored?.columnVisibility?.role).toBe(false);
    const emitted = wrapper.emitted("tableSettingsChange");
    expect(emitted?.[0]?.[0]).toMatchObject({
      columnVisibility: { role: false },
    });
  });

  it("respects a custom storage prefix", async () => {
    const storage = memoryStorage();
    const wrapper = mountTable({
      storageKey: "users",
      storagePrefix: "myapp",
      storage,
      showColumnSelector: true,
    });
    await wrapper
      .find("button[aria-label='Toggle column visibility']")
      .trigger("click");
    await wrapper
      .findAll("label")
      .find((l) => l.text().trim() === "Role")!
      .find("input")
      .trigger("change");
    expect(storage.getItem("myapp:users")).not.toBeNull();
    expect(storage.getItem(key)).toBeNull();
  });

  it("lets an explicit tableSettings prop win over the stored snapshot", () => {
    const storage = memoryStorage();
    storage.setItem(
      key,
      encodeStoredSettings({ columnVisibility: { role: false } }),
    );
    const wrapper = mountTable({
      storageKey: "users",
      storage,
      tableSettings: { columnVisibility: { role: true } },
    });
    expect(thByHeader(wrapper, "Role")).toBeDefined();
  });

  it("does not touch storage when storageKey is omitted", async () => {
    const storage = memoryStorage();
    const wrapper = mountTable({
      storage,
      showColumnSelector: true,
    });
    await wrapper
      .find("button[aria-label='Toggle column visibility']")
      .trigger("click");
    await wrapper
      .findAll("label")
      .find((l) => l.text().trim() === "Role")!
      .find("input")
      .trigger("change");
    expect(wrapper.emitted("tableSettingsChange")).toBeTruthy();
    expect(storage.store.size).toBe(0);
  });
});

describe("Table — sorting", () => {
  const sortCols: TableColumn<Row>[] = [
    { id: "name", header: "Name", accessor: "name", sortable: true },
    { id: "age", header: "Age", accessor: "age" },
  ];

  const mountSort = () =>
    mount(Table as any, { props: { columns: sortCols, data: rows } });

  it("marks sortable-but-unsorted columns with aria-sort=other", () => {
    const wrapper = mountSort();
    expect(thByHeader(wrapper, "Name")!.attributes("aria-sort")).toBe("other");
    expect(thByHeader(wrapper, "Age")!.attributes("aria-sort")).toBe("none");
  });

  it("cycles asc → desc → clear, emitting each step", async () => {
    const wrapper = mountSort();
    const button = () =>
      wrapper.find("button[aria-label='Toggle sort']");
    const th = () => thByHeader(wrapper, "Name")!;

    await button().trigger("click");
    expect(th().attributes("aria-sort")).toBe("ascending");
    await button().trigger("click");
    expect(th().attributes("aria-sort")).toBe("descending");
    await button().trigger("click");
    expect(th().attributes("aria-sort")).toBe("other");

    const events = (wrapper.emitted("sortChange") ?? []).map((e) => e[0]);
    expect(events).toEqual([
      { columnId: "name", direction: "asc" },
      { columnId: "name", direction: "desc" },
      null,
    ]);
  });
});

describe("Table — pagination", () => {
  it("offers the active page size even when it is not a preset", () => {
    const wrapper = mountTable({
      pagination: {
        page: 1,
        pageSize: 25,
        total: 100,
        onPageChange: () => {},
        onPageSizeChange: () => {},
      },
    });
    const options = wrapper
      .findAll("option")
      .map((o) => o.text())
      .map((t) => t.trim());
    expect(options).toContain("25 per page");
    expect(options).toContain("20 per page");
  });
});

describe("Table — grouping", () => {
  it("renders group headers with expansion state", () => {
    const wrapper = mountTable({ groupable: true, defaultGroupBy: "role" });
    const groups = wrapper.findAll("tbody [role='button'][aria-expanded]");
    expect(groups.length).toBe(2);
    for (const g of groups) {
      expect(g.attributes("aria-expanded")).toBe("true");
    }
  });

  it("collapses a group via keyboard", async () => {
    const wrapper = mountTable({ groupable: true, defaultGroupBy: "role" });
    const groups = () =>
      wrapper.findAll("tbody [role='button'][aria-expanded]");
    expect(wrapper.findAll("tbody tr").length).toBe(6);

    await groups()[0].trigger("keydown", { key: "Enter" });
    expect(groups()[0].attributes("aria-expanded")).toBe("false");
    expect(wrapper.findAll("tbody tr").length).toBe(4);
  });
});
