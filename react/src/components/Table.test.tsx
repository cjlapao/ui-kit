import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Table from "./Table";
import type { TableColumn } from "./Table";
import {
  buildTableStorageKey,
  createSafeLocalStorage,
  decodeStoredSettings,
  encodeStoredSettings,
  TABLE_SETTINGS_STORAGE_VERSION,
  TABLE_STORAGE_DEFAULT_PREFIX,
  type TableStorageAdapter,
} from "../utils/tableStorage";
import type { TableSettings } from "../types/TableSettings";
import { TRUE_COLORS, NEUTRAL_TONES } from "../theme";

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

/** In-memory TableStorageAdapter with a peekable map. */
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

const firstTh = (container: HTMLElement) =>
  container.querySelector("th")!;
const thByHeader = (container: HTMLElement, header: string) => {
  const ths = Array.from(container.querySelectorAll("th"));
  return ths.find((th) => th.textContent?.includes(header))!;
};

// ── Storage utilities ──────────────────────────────────────────────────────────

describe("tableStorage — key composition", () => {
  it("joins prefix and key with a colon", () => {
    expect(buildTableStorageKey("myapp", "users")).toBe("myapp:users");
  });

  it("uses ui-kit:table as the default prefix", () => {
    expect(TABLE_SETTINGS_STORAGE_VERSION).toBe(1);
    expect(TABLE_STORAGE_DEFAULT_PREFIX).toBe("ui-kit:table");
    expect(buildTableStorageKey(TABLE_STORAGE_DEFAULT_PREFIX, "users")).toBe(
      "ui-kit:table:users",
    );
  });
});

describe("tableStorage — envelope", () => {
  const settings: TableSettings = {
    columnVisibility: { name: true, role: false },
    columnWidths: { name: 180 },
    activeView: "table",
    groupBy: null,
    showGroupHeader: false,
    stickyColumns: { name: "left" },
  };

  it("round-trips a full snapshot", () => {
    expect(decodeStoredSettings(encodeStoredSettings(settings))).toEqual(
      settings,
    );
  });

  it("returns null for corrupt payloads", () => {
    expect(decodeStoredSettings(null)).toBeNull();
    expect(decodeStoredSettings("not-json{")).toBeNull();
    expect(decodeStoredSettings("42")).toBeNull();
  });

  it("returns null for the wrong envelope version", () => {
    const wrong = JSON.stringify({ v: 99, settings: { activeView: "table" } });
    expect(decodeStoredSettings(wrong)).toBeNull();
  });

  it("sanitizes unknown fields out of a stored snapshot", () => {
    const payload = encodeStoredSettings(settings);
    const mutated = JSON.parse(payload) as Record<string, unknown>;
    mutated.settings = {
      ...(mutated.settings as Record<string, unknown>),
      evil: "x",
      columnVisibility: "not-an-object",
    };
    const decoded = decodeStoredSettings(JSON.stringify(mutated));
    expect(decoded?.columnVisibility).toBeUndefined();
  });
});

describe("tableStorage — safe adapter", () => {
  it("round-trips through the default backend without throwing", () => {
    const safe = createSafeLocalStorage();
    expect(() => safe.setItem("ui-kit:test", "v")).not.toThrow();
    expect(safe.getItem("ui-kit:test")).toBe("v");
    expect(() => safe.removeItem("ui-kit:test")).not.toThrow();
    expect(safe.getItem("ui-kit:test")).toBeNull();
  });

  it("degrades to null when storage access is blocked", () => {
    const original = window.localStorage;
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get: () => {
        throw new Error("denied");
      },
    });
    try {
      const safe = createSafeLocalStorage();
      expect(() => safe.getItem("k")).not.toThrow();
      expect(() => safe.setItem("k", "v")).not.toThrow();
      expect(safe.getItem("k")).toBeNull();
    } finally {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        writable: true,
        value: original,
      });
    }
  });
});

// ── Surface family ─────────────────────────────────────────────────────────────

describe("Table — surface family", () => {
  it("defaults to the outlined panel surface", () => {
    const { container } = render(<Table columns={baseColumns} data={rows} />);
    expect(container.querySelector("section[data-variant='outlined']")).not.toBeNull();
  });

  it("forwards the panel family variant and tone", () => {
    const { container } = render(
      <Table columns={baseColumns} data={rows} variant="glass" tone="blue" />,
    );
    const section = container.querySelector("section");
    expect(section?.getAttribute("data-variant")).toBe("glass");
    expect(section?.getAttribute("data-tone")).toBe("blue");
  });
});

// ── Density ────────────────────────────────────────────────────────────────────

describe("Table — density", () => {
  it("uses the default density scale", () => {
    const { container } = render(<Table columns={baseColumns} data={rows} />);
    const cls = firstTh(container).className;
    expect(cls).toContain("px-6");
    expect(cls).toContain("py-5");
  });

  it("tightens cells at compact density", () => {
    const { container } = render(
      <Table columns={baseColumns} data={rows} density="compact" />,
    );
    const cls = firstTh(container).className;
    expect(cls).toContain("px-4");
    expect(cls).toContain("py-3");
  });

  it("drops font size at minimal density", () => {
    const { container } = render(
      <Table columns={baseColumns} data={rows} density="minimal" />,
    );
    const cls = firstTh(container).className;
    expect(cls).toContain("px-3");
    expect(cls).toContain("py-4");
    expect(cls).toContain("text-xs");
  });
});

// ── Bordered ───────────────────────────────────────────────────────────────────

describe("Table — bordered", () => {
  it("draws grid lines between columns", () => {
    const { container } = render(
      <Table columns={baseColumns} data={rows} bordered />,
    );
    expect(container.querySelector("table")!.className).toContain("border");
    // every column except the last gets a right rule, header and body alike
    const ths = Array.from(container.querySelectorAll("th"));
    expect(ths[0].className).toContain("border-r");
    expect(ths[1].className).toContain("border-r");
    expect(ths[2].className).not.toContain("border-r");
    const tds = Array.from(container.querySelectorAll("tbody td"));
    expect(tds[0].className).toContain("border-r");
    expect(tds[2].className).not.toContain("border-r");
    // the rule carries its colour — a bare border-r paints currentColor
    expect(ths[0].className).toContain("border-neutral-200");
    expect(ths[0].className).toContain("dark:border-neutral-700");
    expect(tds[0].className).toContain("border-neutral-200");
    // and a little extra room so cell text never sits on the line
    expect(ths[0].className).toContain("pr-2");
    expect(tds[0].className).toContain("pr-2");
    expect(ths[2].className).not.toContain("pr-2");
    expect(tds[2].className).not.toContain("pr-2");
  });

  it("lets noBorders win over bordered", () => {
    const { container } = render(
      <Table columns={baseColumns} data={rows} bordered noBorders />,
    );
    expect(container.querySelector("th")!.className).not.toContain("border-r");
  });
});

// ── Translucent surfaces (glass / liquid-glass) ────────────────────────────────

describe("Table — translucent surfaces", () => {
  const footer = <span>3 rows</span>;

  it("keeps the header band and footer see-through on glass", () => {
    const { container } = render(
      <Table columns={baseColumns} data={rows} variant="glass" footer={footer} />,
    );
    // header band: the neutral tone steps down to a white veil, not paper-white
    expect(firstTh(container).className).toContain("bg-white/20");
    expect(firstTh(container).className).toContain("dark:bg-white/5");
    const footerEl = container.querySelector(".border-t");
    expect(footerEl?.className).toContain("bg-white/20");
    expect(footerEl?.className).not.toContain("bg-neutral-50");
  });

  it("tints the glass header with a translucent tone veil", () => {
    const { container } = render(
      <Table
        columns={baseColumns}
        data={rows}
        variant="liquid-glass"
        tone="blue"
      />,
    );
    const cls = firstTh(container).className;
    expect(cls).toContain("bg-blue-50/50");
    expect(cls).toContain("border-blue-200/60");
    expect(cls).toContain("dark:bg-blue-500/15");
    expect(cls).toContain("dark:border-blue-500/30");
  });

  it("keeps opaque header and footer on solid surfaces", () => {
    const { container } = render(
      <Table
        columns={baseColumns}
        data={rows}
        variant="outlined"
        tone="blue"
        footer={footer}
      />,
    );
    const cls = firstTh(container).className;
    expect(cls).toContain("bg-blue-50");
    expect(cls).not.toContain("bg-blue-50/50");
    expect(container.querySelector(".border-t")?.className).toContain(
      "bg-neutral-50",
    );
  });
});

// ── Control tone (tone drives the controls, `color` overrides just them) ─────

describe("Table — control tone", () => {
  const sorted = { columnId: "name", direction: "asc" as const };

  const sortButton = (container: HTMLElement) =>
    thByHeader(container, "Name")!.querySelector("button")!;

  it("tints the interior controls with the table tone by default", () => {
    const { container } = render(
      <Table
        columns={baseColumns}
        data={rows}
        tone="emerald"
        defaultSort={sorted}
      />,
    );
    expect(sortButton(container).className).toContain("emerald");
  });

  it("lets `color` override the control tone without touching the surface", () => {
    const { container } = render(
      <Table
        columns={baseColumns}
        data={rows}
        tone="emerald"
        color="blue"
        defaultSort={sorted}
      />,
    );
    // the control switches to blue…
    expect(sortButton(container).className).toContain("blue");
    expect(sortButton(container).className).not.toContain("emerald");
    // …while the header band keeps the table tone
    expect(firstTh(container).className).toContain("bg-emerald-50");
  });
});

// ── Tone treatment (the dark:border safelist regression) ───────────────────────

describe("Table — tone treatment", () => {
  it("emits the full dark-mode header rule set for every tone", () => {
    for (const tone of TRUE_COLORS) {
      const { container, unmount } = render(
        <Table columns={baseColumns} data={rows} tone={tone} />,
      );
      const cls = firstTh(container).className;
      if (NEUTRAL_TONES.includes(tone)) {
        expect(cls).toContain("bg-neutral-50");
      } else {
        expect(cls).toContain(`bg-${tone}-50`);
        expect(cls).toContain(`dark:border-${tone}-500/30`);
        expect(cls).toContain(`dark:bg-${tone}-500/15`);
      }
      unmount();
    }
  });

  it("shares one treatment across the neutral tones", () => {
    for (const tone of ["slate", "gray", "zinc", "stone"] as const) {
      const { container, unmount } = render(
        <Table columns={baseColumns} data={rows} tone={tone} />,
      );
      expect(firstTh(container).className).toContain("bg-neutral-50");
      unmount();
    }
  });

  it("tints the selected row with the table color", () => {
    const { container } = render(
      <Table
        columns={baseColumns}
        data={rows}
        rowKey={(r) => r.id}
        selectedItems={[rows[0]]}
        color="rose"
      />,
    );
    const tr = Array.from(container.querySelectorAll("tbody tr")).find((t) =>
      t.textContent?.includes("Zoe"),
    )!;
    expect(tr.className).toContain("bg-rose-50");
    expect(tr.className).toContain("dark:bg-rose-500/10");
  });
});

// ── Built-in persistence ───────────────────────────────────────────────────────

describe("Table — built-in persistence", () => {
  const key = buildTableStorageKey("ui-kit:table", "users");

  it("restores stored column visibility on mount", () => {
    const storage = memoryStorage();
    storage.setItem(
      key,
      encodeStoredSettings({ columnVisibility: { role: false } }),
    );
    const { container } = render(
      <Table columns={baseColumns} data={rows} storageKey="users" storage={storage} />,
    );
    expect(thByHeader(container, "Role")).toBeUndefined();
  });

  it("persists a settings change under {prefix}:{key}", () => {
    const storage = memoryStorage();
    const onSettings = vi.fn();
    const { container } = render(
      <Table
        columns={baseColumns}
        data={rows}
        storageKey="users"
        storage={storage}
        showColumnSelector
        onTableSettingsChange={onSettings}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle column visibility" }),
    );
    fireEvent.click(screen.getByLabelText("Role"));

    const stored = decodeStoredSettings(storage.getItem(key));
    expect(stored?.columnVisibility?.role).toBe(false);
    expect(onSettings).toHaveBeenCalledWith(
      expect.objectContaining({ columnVisibility: expect.objectContaining({ role: false }) }),
    );
    void container;
  });

  it("respects a custom storage prefix", () => {
    const storage = memoryStorage();
    const onSettings = vi.fn();
    render(
      <Table
        columns={baseColumns}
        data={rows}
        storageKey="users"
        storagePrefix="myapp"
        storage={storage}
        showColumnSelector
        onTableSettingsChange={onSettings}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle column visibility" }),
    );
    fireEvent.click(screen.getByLabelText("Role"));
    expect(storage.getItem("myapp:users")).not.toBeNull();
    expect(storage.getItem(key)).toBeNull();
  });

  it("lets an explicit tableSettings prop win over the stored snapshot", () => {
    const storage = memoryStorage();
    storage.setItem(
      key,
      encodeStoredSettings({ columnVisibility: { role: false } }),
    );
    const { container } = render(
      <Table
        columns={baseColumns}
        data={rows}
        storageKey="users"
        storage={storage}
        tableSettings={{ columnVisibility: { role: true } }}
      />,
    );
    expect(thByHeader(container, "Role")).toBeDefined();
  });

  it("writes the full snapshot back when reset to default", () => {
    const storage = memoryStorage();
    const onSettings = vi.fn();
    render(
      <Table
        columns={baseColumns}
        data={rows}
        storageKey="users"
        storage={storage}
        showColumnSelector
        onTableSettingsChange={onSettings}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle column visibility" }),
    );
    fireEvent.click(screen.getByLabelText("Role"));
    fireEvent.click(screen.getByRole("button", { name: "Reset to default" }));

    const stored = decodeStoredSettings(storage.getItem(key));
    expect(stored?.columnVisibility?.role).toBe(true);
  });

  it("does not touch storage when storageKey is omitted", () => {
    const storage = memoryStorage();
    const onSettings = vi.fn();
    render(
      <Table
        columns={baseColumns}
        data={rows}
        storage={storage}
        showColumnSelector
        onTableSettingsChange={onSettings}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle column visibility" }),
    );
    fireEvent.click(screen.getByLabelText("Role"));
    expect(onSettings).toHaveBeenCalled();
    expect(storage.store.size).toBe(0);
  });
});

// ── Sorting ────────────────────────────────────────────────────────────────────

describe("Table — sorting", () => {
  const sortCols: TableColumn<Row>[] = [
    { id: "name", header: "Name", accessor: "name", sortable: true },
    { id: "age", header: "Age", accessor: "age" },
  ];

  it("marks sortable-but-unsorted columns with aria-sort=other", () => {
    const { container } = render(<Table columns={sortCols} data={rows} />);
    expect(thByHeader(container, "Name").getAttribute("aria-sort")).toBe("other");
    expect(thByHeader(container, "Age").getAttribute("aria-sort")).toBe("none");
  });

  it("cycles asc → desc → clear, reporting each step", () => {
    const onSort = vi.fn();
    const { container } = render(
      <Table columns={sortCols} data={rows} onSortChange={onSort} />,
    );
    const th = thByHeader(container, "Name");
    const button = () =>
      screen.getByRole("button", { name: "Toggle sort" });

    fireEvent.click(button());
    expect(th.getAttribute("aria-sort")).toBe("ascending");
    expect(onSort).toHaveBeenLastCalledWith({
      columnId: "name",
      direction: "asc",
    });

    fireEvent.click(button());
    expect(th.getAttribute("aria-sort")).toBe("descending");

    // the third click actually clears — the tooltip has promised this
    fireEvent.click(button());
    expect(th.getAttribute("aria-sort")).toBe("other");
    expect(onSort).toHaveBeenLastCalledWith(null);
  });

  it("orders the rows", () => {
    const { container } = render(<Table columns={sortCols} data={rows} />);
    const firstBodyRow = () =>
      container.querySelector("tbody tr")!.textContent!;
    expect(firstBodyRow()).toContain("Zoe"); // original order

    fireEvent.click(screen.getByRole("button", { name: "Toggle sort" }));
    expect(firstBodyRow()).toContain("Ava");
  });
});

// ── Pagination ─────────────────────────────────────────────────────────────────

describe("Table — pagination", () => {
  const pagination = {
    page: 1,
    pageSize: 25,
    total: 100,
    onPageChange: () => {},
    onPageSizeChange: () => {},
  };

  it("offers the active page size even when it is not a preset", () => {
    render(<Table columns={baseColumns} data={rows} pagination={pagination} />);
    const options = screen
      .getAllByRole("option")
      .map((o) => o.textContent);
    expect(options).toContain("25 per page");
    expect(options).toContain("20 per page");
  });
});

// ── Grouping ───────────────────────────────────────────────────────────────────

describe("Table — grouping", () => {
  it("renders group headers with expansion state", () => {
    const { container } = render(
      <Table
        columns={baseColumns}
        data={rows}
        groupable
        defaultGroupBy="role"
      />,
    );
    const groupButtons = container.querySelectorAll(
      "tbody [role='button'][aria-expanded]",
    );
    expect(groupButtons.length).toBe(2); // Admin, Editor
    expect(
      Array.from(groupButtons).every(
        (b) => b.getAttribute("aria-expanded") === "true",
      ),
    ).toBe(true);
  });

  it("collapses a group via keyboard", () => {
    const { container } = render(
      <Table
        columns={baseColumns}
        data={rows}
        groupable
        defaultGroupBy="role"
      />,
    );
    const groupButtons = () =>
      Array.from(
        container.querySelectorAll("tbody [role='button'][aria-expanded]"),
      );
    expect(container.querySelectorAll("tbody tr").length).toBe(
      2 + 4, // group rows + data rows
    );

    fireEvent.keyDown(groupButtons()[0], { key: "Enter" });
    expect(groupButtons()[0].getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelectorAll("tbody tr").length).toBe(
      2 + 2, // the collapsed group hides its two rows
    );
  });

  it("fires settings callbacks once per click under StrictMode", () => {
    const onSettings = vi.fn();
    render(
      <React.StrictMode>
        <Table
          columns={baseColumns}
          data={rows}
          groupable
          defaultGroupBy="role"
          onTableSettingsChange={onSettings}
        />
      </React.StrictMode>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Configure row grouping" }),
    );
    fireEvent.click(screen.getByLabelText("Show group header"));
    expect(onSettings).toHaveBeenCalledTimes(1);
    expect(onSettings).toHaveBeenCalledWith(
      expect.objectContaining({ showGroupHeader: false }),
    );
  });
});
