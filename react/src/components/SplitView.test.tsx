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
    const detail = screen.getByText("Alpha panel").closest("div")!.parentElement!;
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
    expect(cls).toContain("bg-neutral-50/80");
    expect(cls).not.toContain("bg-blue-50/80");
  });

  it("`surfaceTone` tints the panes deliberately", () => {
    const { container } = render(
      <SplitView items={ITEMS} tone="blue" surfaceTone="violet" />,
    );
    const cls = container.firstElementChild!.className;
    expect(cls).toContain("bg-violet-50/80");
    // The accent is untouched.
    expect(container.innerHTML).toContain("border-l-blue-600");
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
    expect(searchBox().closest("div")!.className).toContain("border-transparent");
  });

  it("`searchVariant` overrides what the surface implies", () => {
    render(<SplitView items={ITEMS} variant="subtle" searchVariant="elevated" />);
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
    expect(container.innerHTML).toContain("border-l-violet-600");
  });

  it("the deprecated `color` still works", () => {
    const { container } = render(<SplitView items={ITEMS} color="violet" />);
    expect(container.innerHTML).toContain("border-l-violet-600");
  });

  it("`tone` wins when both are given", () => {
    const { container } = render(
      <SplitView items={ITEMS} tone="emerald" color="violet" />,
    );
    expect(container.innerHTML).toContain("border-l-emerald-600");
    expect(container.innerHTML).not.toContain("border-l-violet-600");
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
    expect([...SPLIT_VIEW_LOADERS]).toEqual(["skeleton", "spinner", "progress"]);
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
      screen.getByRole("button", { name: "Collapse details" }).getAttribute(
        "aria-expanded",
      ),
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
    expect(onChange).toHaveBeenCalledWith("b", expect.objectContaining({ id: "b" }));
  });
});
