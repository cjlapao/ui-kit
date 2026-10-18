import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SplitView, { SPLIT_VIEW_LOADERS } from "./SplitView";
import { SURFACE_VARIANTS } from "../theme/Theme";

const ITEMS = [
  { id: "a", label: "Alpha", subtitle: "one", panel: <div>Alpha panel</div> },
  { id: "b", label: "Beta", subtitle: "two", panel: <div>Beta panel</div> },
  { id: "c", label: "Gamma", subtitle: "three", panel: <div>Gamma panel</div> },
];

describe("SplitView — surfaces", () => {
  it("renders every surface variant without throwing", () => {
    for (const variant of SURFACE_VARIANTS) {
      const { unmount } = render(<SplitView items={ITEMS} variant={variant} />);
      expect(screen.getByText("Alpha")).toBeTruthy();
      unmount();
    }
  });

  it("gives the detail pane no fill of its own", () => {
    // It was a bare `bg-white` with no `dark:` partner, so the whole detail
    // half stayed a white slab in dark mode. The *container* may legitimately
    // carry a white surface from its variant — this is about the pane.
    const { container } = render(<SplitView items={ITEMS} />);
    const detail = screen
      .getByText("Alpha panel")
      .closest("div")!.parentElement!;
    expect(detail.className).not.toContain("bg-white");
    expect(container.innerHTML).not.toContain("h-full bg-white");
  });

  it("tints the list pane translucently rather than filling it", () => {
    // An opaque fill replaces the container's surface, so a glass SplitView
    // lost its backdrop on that half.
    const { container } = render(<SplitView items={ITEMS} variant="glass" />);
    expect(container.innerHTML).toContain("bg-black/[0.025]");
    expect(container.innerHTML).not.toContain("bg-gray-50/80");
  });

  it("keeps the surface neutral by default, so the accent still stands out", () => {
    // `tone` drives the accent; using it for the surface too tinted the whole
    // two-pane layout in the accent colour, which is both a lot of colour and
    // self-defeating — the accent's job is to stand out against the surface.
    const { container } = render(<SplitView items={ITEMS} tone="blue" />);
    const cls = container.firstElementChild!.className;
    // The convention default: `elevated` — a clean lifted surface, untouched
    // by either tone.
    expect(cls).toContain("shadow-xl");
    expect(cls).toContain("bg-white");
    expect(cls).not.toContain("bg-blue");
  });

  it("`surfaceTone` paints the divider on every variant", () => {
    const { container } = render(
      <SplitView items={ITEMS} tone="blue" surfaceTone="violet" />,
    );
    expect(container.innerHTML).toContain("border-violet-200");
    // The accent is untouched.
    expect(container.innerHTML).toContain("bg-blue-600 dark:bg-blue-400");
  });

  it("`surfaceTone` colours every variant that has a treatment for it", () => {
    // Each variant decides HOW the tone lands — a tinted fill, a coloured
    // wash, a rule — but none of them drop it; `elevated` is the single
    // exception, being white by design.
    for (const variant of SURFACE_VARIANTS) {
      const { container, unmount } = render(
        <SplitView items={ITEMS} variant={variant} surfaceTone="violet" />,
      );
      const cls = container.firstElementChild!.className;
      if (variant === "elevated" || variant === "default") {
        // `elevated` is white by design; `default`'s rim is deliberately
        // tone-free (SURFACE_GLASS_RIM) — both carry the tone on the divider.
        expect(cls).not.toMatch(/violet/);
      } else {
        expect(cls).toMatch(/violet/);
      }
      // And the divider always carries the tone.
      expect(container.innerHTML).toContain("border-violet-200");
      unmount();
    }
  });

  it("rounds its corners with its container, not against it", () => {
    // The elevated box draws a ring and a shadow, so square corners inside a
    // rounded host used to print a rectangular edge over the curve.
    const { container } = render(<SplitView items={ITEMS} />);
    expect(container.firstElementChild!.className).toContain(
      "rounded-[inherit]",
    );
  });

  it("carries the variant's surface classes on the container", () => {
    const { container } = render(
      <SplitView items={ITEMS} variant="outlined" tone="violet" />,
    );
    expect(container.firstElementChild!.className).toContain("border");
  });
});

describe("SplitView — search follows the surface", () => {
  const searchBox = () => screen.getByPlaceholderText("Search...");

  it("uses a glass field on a glass surface", () => {
    render(<SplitView items={ITEMS} variant="glass" />);
    expect(searchBox().closest("div")!.className).toContain("backdrop");
  });

  it("uses a ghost field on a subtle surface", () => {
    render(<SplitView items={ITEMS} variant="subtle" />);
    expect(searchBox().closest("div")!.className).toContain(
      "border-transparent",
    );
  });

  it("`searchVariant` overrides what the surface implies", () => {
    render(
      <SplitView items={ITEMS} variant="subtle" searchVariant="elevated" />,
    );
    expect(searchBox().closest("div")!.className).toContain("shadow-sm");
  });

  it("hides the search when there is nothing to filter", () => {
    render(<SplitView items={[ITEMS[0]]} />);
    expect(screen.queryByPlaceholderText("Search...")).toBeNull();
  });
});

describe("SplitView — tone replaces color", () => {
  it("`tone` drives the active row accent", () => {
    const { container } = render(<SplitView items={ITEMS} tone="violet" />);
    expect(container.innerHTML).toContain("bg-violet-600 dark:bg-violet-400");
  });

  it("the deprecated `color` still works", () => {
    const { container } = render(<SplitView items={ITEMS} color="violet" />);
    expect(container.innerHTML).toContain("bg-violet-600 dark:bg-violet-400");
  });

  it("`tone` wins when both are given", () => {
    const { container } = render(
      <SplitView items={ITEMS} tone="emerald" color="violet" />,
    );
    expect(container.innerHTML).toContain("bg-emerald-600 dark:bg-emerald-400");
    expect(container.innerHTML).not.toContain(
      "bg-violet-600 dark:bg-violet-400",
    );
  });
});

describe("SplitView — highlight indicator", () => {
  // Highlight a row that is *not* the default selection: an active row already
  // has the accent, so the "something is new" cue is only drawn on the others.
  const withHighlight = [ITEMS[0], { ...ITEMS[1], highlight: true }, ITEMS[2]];

  it("draws the pulsing dot by default", () => {
    const { container } = render(<SplitView items={withHighlight} />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("drops the dot but keeps the accent tint when turned off", () => {
    const { container } = render(
      <SplitView items={withHighlight} showHighlightIndicator={false} />,
    );
    expect(container.querySelector(".animate-pulse")).toBeNull();
    // The row is still tinted — the cue is gone, not the state.
    expect(container.innerHTML).toContain("bg-blue-100");
  });
});

describe("SplitView — loading", () => {
  it("defaults to a skeleton that keeps both panes", () => {
    const { container } = render(<SplitView items={ITEMS} loading />);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    // The skeleton replaces the content rather than covering it.
    expect(screen.queryByText("Alpha")).toBeNull();
  });

  it("covers the layout for the overlay treatments", () => {
    for (const loaderType of ["spinner", "progress"] as const) {
      const { unmount } = render(
        <SplitView items={ITEMS} loading loaderType={loaderType} />,
      );
      // The content stays mounted underneath, so the previous view is visible.
      expect(screen.getByText("Alpha")).toBeTruthy();
      unmount();
    }
  });

  it("exposes all three loader types", () => {
    expect([...SPLIT_VIEW_LOADERS]).toEqual([
      "skeleton",
      "spinner",
      "progress",
    ]);
  });

  it("a custom loadingState replaces whichever treatment would draw", () => {
    render(
      <SplitView
        items={ITEMS}
        loading
        loadingState={<div>Custom loading</div>}
      />,
    );
    expect(screen.getByText("Custom loading")).toBeTruthy();
  });
});

describe("SplitView — sub content", () => {
  const withSub = ITEMS.map((item) => ({
    ...item,
    subContent: <div>{item.label} sub</div>,
  }));

  it("expands the active row's sub content when autoExpand is on", () => {
    render(<SplitView items={withSub} />);
    expect(screen.getByText("Alpha sub")).toBeTruthy();
  });

  it("gates sub content behind the expand button when autoExpand is off", () => {
    render(<SplitView items={withSub} autoExpand={false} />);
    const expand = screen.getAllByRole("button", { name: "Expand details" })[0];
    expect(expand.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(expand);
    expect(
      screen
        .getByRole("button", { name: "Collapse details" })
        .getAttribute("aria-expanded"),
    ).toBe("true");
  });

  it("shows the expand caret without needing a hover", () => {
    // It was `opacity-0` until hover, so the only cue that a row *had*
    // sub-items was hovering it — the feature was undiscoverable on a list
    // where only some rows expand.
    render(<SplitView items={withSub} autoExpand={false} />);
    const caret = screen.getAllByRole("button", { name: "Expand details" })[0];
    expect(caret.className).not.toContain("opacity-0");
    expect(caret.className).toContain("opacity-60");
  });

  it("selecting a row still reports through onChange", () => {
    const onChange = vi.fn();
    render(<SplitView items={withSub} onChange={onChange} />);
    fireEvent.click(screen.getByText("Beta"));
    expect(onChange).toHaveBeenCalledWith(
      "b",
      expect.objectContaining({ id: "b" }),
    );
  });
});

describe("SplitView — collapse animation", () => {
  it("declares the width transition for expanding, not just collapsing", () => {
    // The transition class used to be gated on `isCollapsed`, so opening
    // dropped the class and the 48px inline width in the same commit — the
    // computed style jumped with nothing declared to animate. Collapse
    // animated; expand snapped.
    render(<SplitView items={ITEMS} collapsible />);
    const panel = screen
      .getByText("Alpha")
      .closest("div[class*='overflow-hidden']") as HTMLElement;
    fireEvent.click(screen.getByLabelText("Collapse list"));
    expect(panel.style.width).toBe("48px");
    fireEvent.click(screen.getByLabelText("Expand list"));
    expect(panel.className).toContain("transition-[width]");
  });
});

describe("SplitView — the resize handle", () => {
  it("is a focusable separator with a tone pill inside, SidePanel-style", () => {
    const { container } = render(<SplitView items={ITEMS} resizable />);
    const sep = container.querySelector('[role="separator"]') as HTMLElement;
    expect(sep).toBeTruthy();
    expect(sep.tabIndex).toBe(0);
    expect(sep.className).toContain("cursor-col-resize");
    // The affordance lives inside the hit area, so a wider grab target no
    // longer means an invisible one.
    const pill = sep.querySelector("span") as HTMLElement;
    expect(pill.className).toContain("rounded-full");
    expect(pill.className).toContain("bg-blue-400");
  });

  it("stands down while the list is collapsed", () => {
    const { container } = render(
      <SplitView items={ITEMS} resizable collapsible defaultCollapsed />,
    );
    expect(container.querySelector('[role="separator"]')).toBeNull();
  });
});

describe("SplitView — surfaceTone auto", () => {
  it("`auto` hands the surface to the accent tone", () => {
    const { container } = render(
      <SplitView
        items={ITEMS}
        tone="violet"
        variant="tonal"
        surfaceTone="auto"
      />,
    );
    expect(container.firstElementChild!.className).toContain(
      "bg-violet-100/80",
    );
    expect(container.innerHTML).toContain("border-violet-200");
  });
});

describe("SplitView — row overflow menus", () => {
  const MENU_ITEMS = [
    { label: "Rename", value: "rename" },
    { label: "Delete", value: "delete", danger: true },
  ];

  it("opens the kit DropdownMenu without selecting the row", () => {
    const onSelect = vi.fn();
    const onMenu = vi.fn();
    const items = [{ ...ITEMS[0], menu: MENU_ITEMS }, ...ITEMS.slice(1)];
    render(
      <SplitView items={items} onChange={onSelect} onMenuSelect={onMenu} />,
    );
    fireEvent.click(screen.getByLabelText("More options"));
    const menu = document.querySelector('[role="menu"]');
    expect(menu).toBeTruthy();
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
    expect(onMenu).toHaveBeenCalledWith(
      expect.objectContaining({ id: "a" }),
      expect.objectContaining({ value: "delete" }),
    );
    expect(onSelect).not.toHaveBeenCalled();
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });

  it("clicking a sub-item fires its own handler, not a selection", () => {
    const onSelect = vi.fn();
    const onClick = vi.fn();
    const items = [
      {
        ...ITEMS[0],
        subItems: [{ id: "s1", label: "worker-01", onClick }],
      },
      ...ITEMS.slice(1),
    ];
    render(<SplitView items={items} onChange={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: "worker-01" }));
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ id: "s1" }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("menuVisibility=always leaves the dots visible", () => {
    const items = [{ ...ITEMS[0], menu: MENU_ITEMS }, ...ITEMS.slice(1)];
    const { container } = render(
      <SplitView items={items} menuVisibility="always" />,
    );
    const wrap = screen
      .getByLabelText("More options")
      .closest("div[class*='opacity']") as HTMLElement;
    expect(wrap.className).toContain("opacity-100");
    expect(container).toBeTruthy();
  });

  it("gives sub-items the same affordance", () => {
    const onMenu = vi.fn();
    const items = [
      {
        ...ITEMS[0],
        subItems: [{ id: "s1", label: "worker-01", menu: MENU_ITEMS }],
      },
      ...ITEMS.slice(1),
    ];
    render(<SplitView items={items} onMenuSelect={onMenu} />);
    fireEvent.click(screen.getByLabelText("More options"));
    expect(document.querySelector('[role="menu"]')).toBeTruthy();
    fireEvent.click(screen.getByRole("menuitem", { name: "Rename" }));
    expect(onMenu).toHaveBeenCalledWith(
      expect.objectContaining({ id: "s1" }),
      expect.objectContaining({ value: "rename" }),
    );
  });
});

describe("SplitView — state overlays scale with size", () => {
  const sizeTokenOf = (el: Element | null) =>
    [...(el?.classList ?? [])].find((c) => /^text-(xs|sm|base|lg)$/.test(c));

  it("the error state keeps md legibility at xs/sm but grows at lg", () => {
    const bySize = {} as Record<string, string | undefined>;
    for (const size of ["xs", "sm", "md", "lg", "xl"] as const) {
      const { container, unmount } = render(
        <SplitView items={ITEMS} size={size} error="boom" />,
      );
      bySize[size] = sizeTokenOf(
        container.querySelector('[role="alert"] strong') ??
          container.querySelector('[class*="font-semibold"]'),
      );
      unmount();
    }
    // xs and sm must read exactly as md; lg and xl step up together.
    expect(bySize.xs).toBe(bySize.md);
    expect(bySize.sm).toBe(bySize.md);
    expect(bySize.lg).not.toBe(bySize.md);
    expect(bySize.xl).toBe(bySize.lg);
  });

  it("the loader spinner follows the parent size", () => {
    const tokenFor = (size: "xs" | "md" | "xl") => {
      const { container, unmount } = render(
        <SplitView items={ITEMS} size={size} loading loaderType="spinner" />,
      );
      const token = sizeTokenOf(
        container
          .querySelector("[role='status']")
          ?.querySelector("span,div,p") ?? null,
      );
      unmount();
      return token;
    };
    expect(tokenFor("md")).not.toBe(tokenFor("xl"));
  });
});
