import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import StatCard from "./StatCard";
import StatTile from "./StatTile";
import StatCountTile from "./StatCountTile";
import StatGoalTile from "./StatGoalTile";
import StatChartTile from "./StatChartTile";
import StatHealthCard from "./StatHealthCard";
import { CONTROL_SIZES } from "../theme/Theme";

/**
 * The family contract: every Stat component is a `StatCard` with a body, so
 * every base prop has to survive the trip. These tests are written against the
 * *rendered output* rather than the prop types, because the failure mode being
 * guarded is a wrapper that declares a prop and forgets to pass it on — which
 * type-checks perfectly.
 */

const GOALS = [{ value: 72, label: "Uptime", icon: "HealthCheck" as const }];
const CHART = [
  {
    id: 1,
    label: "By state",
    centerLabel: "capsules",
    items: [
      { label: "Running", value: 12 },
      { label: "Paused", value: 4 },
    ],
  },
];

/** Each variant, rendered with an arbitrary set of base props. */
const variants: {
  name: string;
  render: (props: Record<string, unknown>) => React.ReactElement;
}[] = [
  { name: "StatCard", render: (p) => <StatCard {...p} value={128} /> },
  { name: "StatTile", render: (p) => <StatTile {...p} value={128} /> },
  { name: "StatCountTile", render: (p) => <StatCountTile {...p} value={128} /> },
  { name: "StatGoalTile", render: (p) => <StatGoalTile {...p} goals={GOALS} /> },
  { name: "StatChartTile", render: (p) => <StatChartTile {...p} data={CHART} /> },
  {
    name: "StatHealthCard",
    render: (p) => <StatHealthCard {...p} state="healthy" />,
  },
];

describe.each(variants)("$name inherits StatCard's props", ({ render: renderVariant }) => {
  it("renders the label", () => {
    render(renderVariant({ label: "Capsules" }));
    expect(screen.getByText("Capsules")).toBeTruthy();
  });

  it("renders the icon chip and the trend pill", () => {
    render(
      renderVariant({
        label: "L",
        icon: "Database",
        trend: { value: "+12%", direction: "up" },
      }),
    );
    expect(screen.getByText("+12%")).toBeTruthy();
  });

  it("passes `tone` down to the surface", () => {
    const { container } = render(renderVariant({ label: "L", tone: "violet" }));
    expect(container.innerHTML).toContain("violet");
  });

  it("passes `corner` and `padding` down to the Panel", () => {
    const { container } = render(
      // The corner *token* is not the Tailwind class: the scale maps
      // "rounded-xl" onto `rounded-4xl`. "none" is the unambiguous one.
      renderVariant({ label: "L", corner: "none", padding: "lg" }),
    );
    expect(container.innerHTML).toContain("rounded-none");
  });

  it("draws the progress bar, which is the base card's", () => {
    render(
      renderVariant({
        label: "L",
        progress: 60,
        progressType: "bar",
        progressLabel: "Used",
      }),
    );
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAccessibleName("Used");
    expect(bar.getAttribute("aria-valuenow")).toBe("60");
  });

  it("replaces the body with the base card's error block, retry included", () => {
    const onRetry = vi.fn();
    render(
      renderVariant({
        label: "L",
        error: { message: "Registry unreachable", onRetry },
      }),
    );
    expect(screen.getByText("Registry unreachable")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Try Again" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("renders the base card's skeleton when loading", () => {
    const { container } = render(renderVariant({ label: "L", loading: true }));
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("renders meta and footer", () => {
    render(
      renderVariant({
        label: "L",
        meta: [{ text: "3 regions", icon: "Globe" }],
        footer: <span>Updated just now</span>,
      }),
    );
    expect(screen.getByText("3 regions")).toBeTruthy();
    expect(screen.getByText("Updated just now")).toBeTruthy();
  });

  it("accepts every control size without throwing", () => {
    for (const size of CONTROL_SIZES) {
      const { unmount } = render(renderVariant({ label: "L", size }));
      unmount();
    }
  });
});

describe("StatTile — the deprecated names still map", () => {
  it("`title`, `color` and `textColor` reach their modern counterparts", () => {
    const { container } = render(
      <StatTile title="Capsules" value={1} color="violet" textColor="amber" />,
    );
    expect(screen.getByText("Capsules")).toBeTruthy();
    expect(container.innerHTML).toContain("violet");
    expect(container.innerHTML).toContain("amber");
  });

  it("the modern name wins when both are given", () => {
    render(<StatTile title="old" label="new" value={1} />);
    expect(screen.getByText("new")).toBeTruthy();
    expect(screen.queryByText("old")).toBeNull();
  });

  it("the `progress` object still implies the bar", () => {
    render(<StatTile label="L" value={1} progress={{ value: 40, label: "Used" }} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAccessibleName("Used");
    expect(bar.getAttribute("aria-valuenow")).toBe("40");
  });

  it("a plain number still means the corner spinner", () => {
    render(<StatTile label="L" value={1} progress={40} />);
    // A determinate ProgressSpinner publishes the role too; what distinguishes
    // it from the bar is that it carries no bar label.
    expect(screen.getByRole("progressbar")).toHaveAccessibleName("Progress");
  });
});

describe("StatCountTile", () => {
  it("renders the breakdown rows", () => {
    render(
      <StatCountTile
        label="Total"
        value={412}
        breakdown={[
          { label: "Running", value: 128 },
          { label: "Stopped", value: 284 },
        ]}
      />,
    );
    expect(screen.getByText("Running")).toBeTruthy();
    expect(screen.getByText("284")).toBeTruthy();
  });

  it("still answers to `title` and `count`", () => {
    render(<StatCountTile title="Total" count={412} />);
    expect(screen.getByText("Total")).toBeTruthy();
    expect(screen.getByText("412")).toBeTruthy();
  });
});

describe("StatGoalTile", () => {
  it("names each ring for a screen reader", () => {
    render(<StatGoalTile label="Goals" goals={GOALS} />);
    expect(screen.getByRole("img", { name: "Uptime: 72%" })).toBeTruthy();
  });

  it("clamps a value outside 0–100 rather than overdrawing the ring", () => {
    render(
      <StatGoalTile
        label="Goals"
        goals={[{ value: 140, label: "Over", icon: "Check" }]}
      />,
    );
    expect(screen.getByRole("img", { name: "Over: 100%" })).toBeTruthy();
  });

  it("scales the ring with the card's size", () => {
    const small = render(<StatGoalTile label="G" size="xs" goals={GOALS} />);
    const ring = () =>
      screen.getByRole("img", { name: "Uptime: 72%" }).parentElement!;
    const smallWidth = ring().style.width;
    expect(smallWidth).toBeTruthy();
    small.unmount();

    render(<StatGoalTile label="G" size="xl" goals={GOALS} />);
    expect(ring().style.width).not.toBe(smallWidth);
  });

  it("`ringSize` overrides what the size implies", () => {
    render(<StatGoalTile label="G" size="xs" ringSize={99} goals={GOALS} />);
    expect(
      screen.getByRole("img", { name: "Uptime: 72%" }).parentElement!.style.width,
    ).toBe("99px");
  });
});

describe("StatChartTile", () => {
  it("names the donut and lists its legend", () => {
    render(<StatChartTile label="Dist" data={CHART} />);
    expect(
      screen.getByRole("img", { name: /Running 12, Paused 4/ }),
    ).toBeTruthy();
    expect(screen.getByText("Running")).toBeTruthy();
  });

  it("hides the arrows when there is only one dataset", () => {
    render(<StatChartTile label="Dist" data={CHART} />);
    expect(
      screen.getByRole("button", { name: "Next page" }).className,
    ).toContain("invisible");
  });

  it("steps between datasets", () => {
    const two = [...CHART, { ...CHART[0], id: 2, label: "By tier" }];
    render(<StatChartTile label="Dist" data={two} />);
    expect(screen.getByText("By state")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("By tier")).toBeTruthy();
  });

  it("scales the donut with the card's size", () => {
    // Not `querySelector("svg")`: the dataset arrows are svgs too and come
    // first in the DOM. The donut is the one carrying the accessible name.
    const donut = () => screen.getByRole("img", { name: /Running 12/ });
    const small = render(<StatChartTile label="D" size="xs" data={CHART} />);
    const smallWidth = donut().getAttribute("width");
    expect(smallWidth).toBeTruthy();
    small.unmount();
    render(<StatChartTile label="D" size="xl" data={CHART} />);
    expect(donut().getAttribute("width")).not.toBe(smallWidth);
  });

  it("survives a dataset list that shrinks under it", () => {
    const two = [...CHART, { ...CHART[0], id: 2, label: "By tier" }];
    const { rerender } = render(<StatChartTile label="D" data={two} />);
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("By tier")).toBeTruthy();
    // The index now points past the end of the new list.
    rerender(<StatChartTile label="D" data={CHART} />);
    expect(screen.getByText("By state")).toBeTruthy();
  });
});


describe("StatCard — paging", () => {
  const PAGES = [
    { id: "a", title: "By region", value: 128 },
    { id: "b", title: "By tier", value: 64 },
    { id: "c", title: "By plan", value: 32 },
  ];

  it("shows the first page and its title", () => {
    render(<StatCard label="Capsules" pages={PAGES} />);
    expect(screen.getByText("By region")).toBeTruthy();
    expect(screen.getByText("128")).toBeTruthy();
  });

  it("steps forward and back", () => {
    render(<StatCard label="Capsules" pages={PAGES} />);
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("By tier")).toBeTruthy();
    expect(screen.getByText("64")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    expect(screen.getByText("By region")).toBeTruthy();
  });

  it("stops at the ends unless asked to loop", () => {
    render(<StatCard label="L" pages={PAGES} />);
    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("By plan")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("wraps both ways when `loopPages` is set", () => {
    render(<StatCard label="L" pages={PAGES} loopPages />);
    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    expect(screen.getByText("By plan")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("By region")).toBeTruthy();
  });

  it("announces the position politely", () => {
    render(<StatCard label="L" pages={PAGES} />);
    const status = screen.getByRole("status");
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.textContent).toContain("1 / 3");
  });

  it("hides the counter when asked", () => {
    render(<StatCard label="L" pages={PAGES} showPageIndicator={false} />);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("is controllable", () => {
    const onPageChange = vi.fn();
    const { rerender } = render(
      <StatCard label="L" pages={PAGES} page={1} onPageChange={onPageChange} />,
    );
    expect(screen.getByText("By tier")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    // Controlled: the card does not move until the prop does.
    expect(screen.getByText("By tier")).toBeTruthy();
    rerender(
      <StatCard label="L" pages={PAGES} page={2} onPageChange={onPageChange} />,
    );
    expect(screen.getByText("By plan")).toBeTruthy();
  });

  it("clamps when the page list shrinks underneath it", () => {
    const { rerender } = render(<StatCard label="L" pages={PAGES} />);
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("By plan")).toBeTruthy();
    rerender(<StatCard label="L" pages={PAGES.slice(0, 1)} />);
    expect(screen.getByText("By region")).toBeTruthy();
  });

  it("falls back to the card's own content for anything a page omits", () => {
    render(
      <StatCard
        label="Capsules"
        value={999}
        icon="Database"
        trend={{ value: "+12%", direction: "up" }}
        pages={[{ title: "Page one" }, { title: "Page two", value: 1 }]}
      />,
    );
    // Page one sets no value, so the card's own shows through.
    expect(screen.getByText("999")).toBeTruthy();
    expect(screen.getByText("+12%")).toBeTruthy();
  });

  it("does not activate a clickable card when an arrow is pressed", () => {
    const onClick = vi.fn();
    render(<StatCard label="L" pages={PAGES} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText("By tier")).toBeTruthy();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders no pager at all without `pages`", () => {
    render(<StatCard label="L" value={1} />);
    expect(screen.queryByRole("button", { name: "Next page" })).toBeNull();
  });

  it("places the pager at the bottom when asked", () => {
    const { container } = render(
      <StatCard label="L" pages={PAGES} pagerPlacement="bottom" />,
    );
    expect(container.innerHTML).toContain("mt-auto");
  });
});
