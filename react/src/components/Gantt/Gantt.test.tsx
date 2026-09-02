import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Gantt } from "./Gantt";
import { getSurfaceTextTokens, getSurfaceVariantClasses, SURFACE_GLASS_RIM } from "../../theme/Theme";
import {
  sampleGanttTasks,
  sampleGanttLanes,
  sampleGanttLinks,
  buildRows,
  dateToX,
  toMs,
  computeViewRange,
  computeLinkPaths,
  laneRollupProgress,
  taskRollupProgress,
  MS_PER_DAY,
} from "../../../../common/gantt";
import type { GanttTask, GanttBarGeometry } from "../../../../common/gantt";

const NOW = new Date("2026-08-30T12:00:00Z");
const tasks = sampleGanttTasks(NOW);
const links = sampleGanttLinks();

const bar = (id: string) =>
  document.querySelector<HTMLElement>(`[data-gantt-bar="${id}"]`)!;

function pointer(win: Window & typeof globalThis, type: string, x: number, y: number) {
  fireEvent(win, new PointerEvent(type, { clientX: x, clientY: y, bubbles: true }));
}

describe("Gantt component", () => {
  it("renders lanes, tasks, bars, scale and the today marker", () => {
    const { container } = render(<Gantt tasks={tasks} links={links} lanes={sampleGanttLanes} />);
    // Lane headers.
    expect(screen.getByText("Design")).toBeTruthy();
    expect(screen.getByText("Engineering")).toBeTruthy();
    expect(screen.getByText("Launch")).toBeTruthy();
    // Task names (at least the top-level ones).
    expect(screen.getAllByText("API contracts").length).toBeGreaterThan(0);
    // Bars exist for tasks; the milestone renders its own bar node.
    expect(container.querySelector('[data-gantt-bar="api"]')).toBeTruthy();
    expect(container.querySelector('[data-gantt-bar="ship"]')).toBeTruthy();
    // Two-line time header: month-name label + full-year sublabel (no
    // two-digit year, which read as a day number at day zoom) + a today chip.
    expect(screen.getAllByText("Aug").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2026").length).toBeGreaterThan(0);
    expect(screen.queryByText(/Aug\s*26/)).toBeNull();
    expect(screen.getByText("Today")).toBeTruthy();
    // Lane progress renders in the Progress column (inside the sticky left
    // block), not at the right edge of the row.
    const laneRow = container.querySelector('[data-row-key="lane:design"]');
    expect(laneRow).toBeTruthy();
    const laneLeft = laneRow!.querySelector(":scope > div.sticky");
    const laneTimeline = laneRow!.querySelector(":scope > div.relative");
    expect(laneLeft?.textContent).toMatch(/%$/);
    expect(laneTimeline?.textContent ?? "").not.toContain("%");
    // Column headers.
    expect(screen.getByText("Owner")).toBeTruthy();
    expect(screen.getByText("Progress")).toBeTruthy();
  });

  it("renders the optional chart header above the column header", () => {
    const { container } = render(
      <Gantt
        tasks={tasks}
        icon={<span data-gantt-chart-icon>R</span>}
        subtitle="Vendor onboarding · REQ-4128"
        title="Northwind Logistics GmbH"
        actions={<span data-gantt-chart-actions>LIVE</span>}
      />,
    );
    expect(screen.getByText("Northwind Logistics GmbH")).toBeTruthy();
    expect(screen.getByText("Vendor onboarding · REQ-4128")).toBeTruthy();
    expect(container.querySelector("[data-gantt-chart-icon]")).toBeTruthy();
    expect(container.querySelector("[data-gantt-chart-actions]")).toBeTruthy();
    // The strip sits directly above the (52px) column header strip.
    const scroller = container.querySelector(".gantt-scroller")!;
    const columnHeader = scroller.previousElementSibling!;
    const chartHeader = columnHeader.previousElementSibling!;
    expect(chartHeader.textContent).toContain("Northwind Logistics GmbH");
    expect(chartHeader.textContent).not.toContain("Owner");
    // The zoom selector moves into the header (after the actions) and the
    // floating overlay over the scale window is suppressed.
    expect(chartHeader.textContent).toContain("Quarter");
    expect(columnHeader.textContent).not.toContain("Quarter");
  });

  it("always renders the header strip with the zoom selector, even without header props", () => {
    const { container } = render(<Gantt tasks={tasks} />);
    const scroller = container.querySelector(".gantt-scroller")!;
    const columnHeader = scroller.previousElementSibling!;
    const chartHeader = columnHeader.previousElementSibling!;
    // The strip is always present and carries the zoom selector — it never
    // floats over the scale window.
    expect(chartHeader.textContent).toContain("Quarter");
    expect(chartHeader.textContent).not.toContain("Northwind");
    expect(columnHeader.textContent).not.toContain("Quarter");
  });

  it("shows the empty state when there are no tasks", () => {
    render(<Gantt tasks={[]} />);
    expect(screen.getByText("No tasks to display")).toBeTruthy();
  });

  it("shows a loading skeleton when loading", () => {
    const { container } = render(<Gantt tasks={tasks} loading />);
    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy();
  });

  it("selects a task on click", () => {
    const onSelect = vi.fn();
    render(<Gantt tasks={tasks} lanes={sampleGanttLanes} onSelect={onSelect} />);
    fireEvent.click(bar("api"));
    expect(onSelect).toHaveBeenCalledWith("api");
  });

  it("moves a task by dragging the bar (snapped, duration preserved)", () => {
    const onTasksChange = vi.fn();
    const { container } = render(
      <Gantt tasks={tasks} lanes={sampleGanttLanes} onTasksChange={onTasksChange} />,
    );
    expect(container.querySelector('[data-gantt-bar="api"]')).toBeTruthy();

    fireEvent.pointerDown(bar("api"), { clientX: 0, clientY: 0, button: 0 });
    // 160px @ 16px/day = 10 days, snapped to the day.
    pointer(window, "pointermove", 160, 0);
    pointer(window, "pointerup", 160, 0);

    expect(onTasksChange).toHaveBeenCalledTimes(1);
    const next = onTasksChange.mock.calls[0][0] as GanttTask[];
    const api = next.find((t) => t.id === "api")!;
    const apiOrig = tasks.find((t) => t.id === "api")!;
    expect(toMs(api.start)).toBe(toMs(apiOrig.start) + 10 * MS_PER_DAY);
    expect(toMs(api.end)).toBe(toMs(apiOrig.end) + 10 * MS_PER_DAY);
  });

  it("resizes a task by dragging its start edge", () => {
    const onTasksChange = vi.fn();
    const { container } = render(
      <Gantt tasks={tasks} lanes={sampleGanttLanes} onTasksChange={onTasksChange} />,
    );
    const api = container.querySelector('[data-gantt-bar="api"]')!;
    const handle = api.querySelector('[title="Resize start"]') as HTMLElement;
    expect(handle).toBeTruthy();

    fireEvent.pointerDown(handle, { clientX: 0, clientY: 0, button: 0 });
    pointer(window, "pointermove", 32, 0); // +2 days on the start edge
    pointer(window, "pointerup", 32, 0);

    expect(onTasksChange).toHaveBeenCalledTimes(1);
    const next = onTasksChange.mock.calls[0][0] as GanttTask[];
    const apiNext = next.find((t) => t.id === "api")!;
    const apiOrig = tasks.find((t) => t.id === "api")!;
    expect(toMs(apiNext.start)).toBe(toMs(apiOrig.start) + 2 * MS_PER_DAY);
    expect(toMs(apiNext.end)).toBe(toMs(apiOrig.end)); // end unchanged
  });

  it("previews progress live while dragging the knob, committing only on drop", () => {
    const onTasksChange = vi.fn();
    const { container } = render(
      <Gantt tasks={tasks} lanes={sampleGanttLanes} onTasksChange={onTasksChange} />,
    );
    // webapp-screens is a leaf (groups display their children's roll-up and
    // expose no knob).
    const barEl = container.querySelector<HTMLElement>('[data-gantt-bar="webapp-screens"]')!;
    const knob = barEl.querySelector('[title="Adjust progress"]') as HTMLElement;
    expect(knob).toBeTruthy();

    const left = parseFloat(barEl.style.left);
    const width = parseFloat(barEl.style.width);
    expect(width).toBeGreaterThan(0);

    // Start a progress drag from the knob (webapp-screens is at 20%).
    fireEvent.pointerDown(knob, { clientX: left + width * 0.2, clientY: 100, button: 0 });

    // Mid-drag: the pointer at 80% of the bar — the fill, the knob and the
    // live % chip follow in real time, and the Progress column cell updates;
    // nothing is committed yet.
    pointer(window, "pointermove", left + width * 0.8, 100);
    const overlay = barEl.querySelector<HTMLElement>("[class*='rounded-l-md']")!;
    expect(overlay.style.width).toBe("80%");
    const chip = barEl.querySelector<HTMLElement>("[class*='bg-neutral-900']");
    expect(chip?.textContent).toBe("80%");
    // Chip (on the bar) + the live Progress column cell both read 80%.
    expect(screen.getAllByText("80%").length).toBe(2);
    expect(onTasksChange).not.toHaveBeenCalled();

    // Drop commits the pointer's value.
    pointer(window, "pointerup", left + width * 0.8, 100);
    expect(onTasksChange).toHaveBeenCalledTimes(1);
    const next = onTasksChange.mock.calls[0][0] as GanttTask[];
    expect(next.find((t) => t.id === "webapp-screens")!.progress).toBe(0.8);
  });

  it("shows the children's roll-up on group rows — read-only, no progress knob", () => {
    const { container } = render(
      <Gantt tasks={tasks} lanes={sampleGanttLanes} editable />,
    );
    const webapp = tasks.find((t) => t.id === "webapp")!;
    const rollup = taskRollupProgress(tasks, "webapp")!;
    // The roll-up differs from the group's own (now-ignored) progress.
    expect(rollup).not.toBeCloseTo(webapp.progress ?? 0, 5);
    const row = container.querySelector<HTMLElement>('[data-row-key="task:webapp"]')!;
    expect(row.textContent).toContain(`${Math.round(rollup * 100)}%`);
    // The bar's progress overlay is the roll-up width…
    const bar = container.querySelector<HTMLElement>('[data-gantt-bar="webapp"]')!;
    const overlay = ([...bar.children] as HTMLElement[]).find((c) => c.style.width)!;
    expect(overlay.style.width).toBe(`${rollup * 100}%`);
    // …and the group exposes no progress knob (its percentage is derived).
    expect(bar.querySelector('[title="Adjust progress"]')).toBeNull();
  });

  it("re-rolls the parent group's progress live while dragging a child's knob", () => {
    const onTasksChange = vi.fn();
    const { container } = render(
      <Gantt tasks={tasks} lanes={sampleGanttLanes} onTasksChange={onTasksChange} />,
    );
    const barEl = container.querySelector<HTMLElement>('[data-gantt-bar="webapp-screens"]')!;
    const knob = barEl.querySelector('[title="Adjust progress"]') as HTMLElement;
    const groupRow = container.querySelector<HTMLElement>('[data-row-key="task:webapp"]')!;

    const screens = tasks.find((t) => t.id === "webapp-screens")!;
    const groupCommitted = taskRollupProgress(tasks, "webapp")!;
    const groupLive = taskRollupProgress(tasks, "webapp", { ...screens, progress: 0.8 })!;
    expect(Math.round(groupLive * 100)).not.toBe(Math.round(groupCommitted * 100));

    const left = parseFloat(barEl.style.left);
    const width = parseFloat(barEl.style.width);
    fireEvent.pointerDown(knob, { clientX: left + width * 0.2, clientY: 100, button: 0 });
    pointer(window, "pointermove", left + width * 0.8, 100);
    // Mid-drag: the parent group's Progress cell shows the re-rolled %.
    expect(groupRow.textContent).toContain(`${Math.round(groupLive * 100)}%`);
    expect(onTasksChange).not.toHaveBeenCalled();

    pointer(window, "pointerup", left + width * 0.8, 100);
    expect(onTasksChange).toHaveBeenCalledTimes(1);
    const next = onTasksChange.mock.calls[0][0] as GanttTask[];
    // Committed roll-up holds on re-render (the group's own progress is still
    // whatever it was — the displayed value is the roll-up).
    const c2 = render(
      <Gantt tasks={next} lanes={sampleGanttLanes} onTasksChange={onTasksChange} />,
    ).container;
    expect(
      c2.querySelector('[data-row-key="task:webapp"]')!.textContent,
    ).toContain(`${Math.round(taskRollupProgress(next, "webapp")! * 100)}%`);
  });

  it("re-rolls the lane progress live while dragging a child's knob", () => {
    const onTasksChange = vi.fn();
    const { container } = render(
      <Gantt tasks={tasks} lanes={sampleGanttLanes} onTasksChange={onTasksChange} />,
    );
    // webapp-screens is a leaf of the eng lane (a group's own progress is
    // ignored by the leaf-based roll-up).
    const barEl = container.querySelector<HTMLElement>('[data-gantt-bar="webapp-screens"]')!;
    const knob = barEl.querySelector('[title="Adjust progress"]') as HTMLElement;
    const laneRow = container.querySelector<HTMLElement>('[data-row-key="lane:eng"]')!;

    const screens = tasks.find((t) => t.id === "webapp-screens")!;
    const committed = laneRollupProgress(tasks, "webapp-screens")!;
    const live = laneRollupProgress(tasks, "webapp-screens", { ...screens, progress: 0.8 })!;
    // The previewed edit actually moves the lane's roll-up (test guard).
    expect(Math.round(live.progress * 100)).not.toBe(Math.round(committed.progress * 100));

    const left = parseFloat(barEl.style.left);
    const width = parseFloat(barEl.style.width);
    fireEvent.pointerDown(knob, { clientX: left + width * 0.2, clientY: 100, button: 0 });
    pointer(window, "pointermove", left + width * 0.8, 100);
    // Mid-drag: the lane header reads the re-rolled %, nothing is committed.
    expect(laneRow.textContent).toContain(`${Math.round(live.progress * 100)}%`);
    expect(onTasksChange).not.toHaveBeenCalled();

    pointer(window, "pointerup", left + width * 0.8, 100);
    expect(onTasksChange).toHaveBeenCalledTimes(1);
    const next = onTasksChange.mock.calls[0][0] as GanttTask[];
    expect(next.find((t) => t.id === "webapp-screens")!.progress).toBe(0.8);
    // Re-render with the committed tasks: the lane keeps the re-rolled value.
    const c2 = render(
      <Gantt tasks={next} lanes={sampleGanttLanes} onTasksChange={onTasksChange} />,
    ).container;
    expect(c2.querySelector('[data-row-key="lane:eng"]')!.textContent).toContain(
      `${Math.round(live.progress * 100)}%`,
    );
  });

  it("re-rolls the lane progress live while resizing a child bar (duration weights)", () => {
    const onTasksChange = vi.fn();
    const { container } = render(
      <Gantt tasks={tasks} lanes={sampleGanttLanes} onTasksChange={onTasksChange} />,
    );
    const barEl = container.querySelector<HTMLElement>('[data-gantt-bar="api"]')!;
    const handle = barEl.querySelector('[title="Resize start"]') as HTMLElement;
    const laneRow = container.querySelector<HTMLElement>('[data-row-key="lane:eng"]')!;

    const api = tasks.find((t) => t.id === "api")!;
    const committed = laneRollupProgress(tasks, "api")!;
    // Start edge +2 days shrinks api's duration; api is 100% done, so the
    // lane's duration-weighted roll-up shifts.
    const live = laneRollupProgress(
      tasks,
      "api",
      { ...api, start: toMs(api.start) + 2 * MS_PER_DAY },
    )!;
    expect(Math.round(live.progress * 100)).not.toBe(Math.round(committed.progress * 100));

    fireEvent.pointerDown(handle, { clientX: 0, clientY: 0, button: 0 });
    pointer(window, "pointermove", 32, 0); // +2 days on the start edge
    expect(laneRow.textContent).toContain(`${Math.round(live.progress * 100)}%`);
    expect(onTasksChange).not.toHaveBeenCalled();

    pointer(window, "pointerup", 32, 0);
    expect(onTasksChange).toHaveBeenCalledTimes(1);
  });

  it("previews a move on the dragged bar only — other bars keep their geometry", () => {
    const onTasksChange = vi.fn();
    render(<Gantt tasks={tasks} lanes={sampleGanttLanes} onTasksChange={onTasksChange} />);

    const otherIds = ["research", "wireframes", "visual-tokens", "visual-flow", "qa", "docs"];
    const before = new Map<string, string>([["api", bar("api").style.left]]);
    for (const id of otherIds) before.set(id, bar(id).style.left);

    // Start a move drag on "api" and pull it 160px right (10 days @ 16px/day).
    fireEvent.pointerDown(bar("api"), { clientX: 0, clientY: 0, button: 0 });
    pointer(window, "pointermove", 160, 0);

    // The dragged bar previews its new position…
    expect(bar("api").style.left).not.toBe(before.get("api"));
    // …and no other bar picks up the preview (the live dates must not broadcast).
    for (const id of otherIds) {
      expect(bar(id).style.left, id).toBe(before.get(id));
    }

    // Commit: only the dragged task's dates change.
    pointer(window, "pointerup", 160, 0);
    expect(onTasksChange).toHaveBeenCalledTimes(1);
    const next = onTasksChange.mock.calls[0][0] as GanttTask[];
    for (const t of next) {
      if (t.id === "api") continue;
      expect(t, t.id).toEqual(tasks.find((o) => o.id === t.id));
    }
  });

  it("reorders rows by dragging the row grip", () => {
    const onReorder = vi.fn();
    const { container } = render(
      <Gantt tasks={tasks} lanes={sampleGanttLanes} onReorder={onReorder} />,
    );
    // Row geometry from the engine (same inputs the component uses).
    const { rows } = buildRows(tasks, sampleGanttLanes, undefined, 44);
    const webappRow = rows.find((r) => r.key === "task:webapp")!;
    const apiRow = rows.find((r) => r.key === "task:api")!;

    const grip = container.querySelector(
      `[data-row-key="task:webapp"] [title="Drag to reorder"]`,
    ) as HTMLElement;
    expect(grip).toBeTruthy();
    fireEvent.pointerDown(grip, { clientX: 0, clientY: 0, button: 0 });
    // Drop on the upper half of the "api" row → before api.
    pointer(window, "pointermove", 0, apiRow.top + 5);
    pointer(window, "pointerup", 0, apiRow.top + 5);

    expect(onReorder).toHaveBeenCalledTimes(1);
    const order = onReorder.mock.calls[0][0] as string[];
    expect(order.indexOf("webapp")).toBeLessThan(order.indexOf("api"));
    expect(webappRow.top).toBeGreaterThan(0);
  });

  it("creates a dependency by dragging from a bar edge handle", () => {
    const onLinksChange = vi.fn();
    const { container } = render(
      <Gantt tasks={tasks} links={[]} lanes={sampleGanttLanes} onLinksChange={onLinksChange} />,
    );
    const range = computeViewRange(
      tasks.map((t) => toMs(t.start)),
      tasks.map((t) => toMs(t.end)),
    );
    const apiGeom = (() => {
      const api = tasks.find((t) => t.id === "api")!;
      const left = dateToX(toMs(api.start), range.start, 16);
      const width = Math.max(6, dateToX(toMs(api.end), range.start, 16) - left);
      return { left, width };
    })();
    const webappGeom = (() => {
      const w = tasks.find((t) => t.id === "webapp")!;
      const left = dateToX(toMs(w.start), range.start, 16);
      return { left, width: Math.max(6, dateToX(toMs(w.end), range.start, 16) - left) };
    })();
    const { rows } = buildRows(tasks, sampleGanttLanes, undefined, 44);
    const webappRow = rows.find((r) => r.key === "task:webapp")!;

    const handle = container.querySelector(
      '[aria-label="Create dependency from end of API contracts"]',
    ) as HTMLElement;
    expect(handle).toBeTruthy();
    fireEvent.pointerDown(handle, { clientX: apiGeom.left + apiGeom.width, clientY: 0, button: 0 });
    // Drop inside the webapp bar.
    pointer(window, "pointermove", webappGeom.left + 10, webappRow.top + 10);
    pointer(window, "pointerup", webappGeom.left + 10, webappRow.top + 10);

    expect(onLinksChange).toHaveBeenCalledTimes(1);
    const next = onLinksChange.mock.calls[0][0];
    expect(next).toHaveLength(1);
    expect(next[0]).toMatchObject({ source: "api", target: "webapp", type: "fs" });
  });

  it("shows a collision-free rubber preview while dragging a dependency", () => {
    const { container } = render(
      <Gantt tasks={tasks} links={[]} lanes={sampleGanttLanes} onLinksChange={() => {}} />,
    );
    const range = computeViewRange(
      tasks.map((t) => toMs(t.start)),
      tasks.map((t) => toMs(t.end)),
    );
    const api = tasks.find((t) => t.id === "api")!;
    const apiGeom = {
      left: dateToX(toMs(api.start), range.start, 16),
      width: Math.max(6, dateToX(toMs(api.end), range.start, 16) - dateToX(toMs(api.start), range.start, 16)),
    };
    const { rows } = buildRows(tasks, sampleGanttLanes, undefined, 44);
    const webappRow = rows.find((r) => r.key === "task:webapp")!;
    const w = tasks.find((t) => t.id === "webapp")!;
    const webappGeom = {
      left: dateToX(toMs(w.start), range.start, 16),
      width: Math.max(6, dateToX(toMs(w.end), range.start, 16) - dateToX(toMs(w.start), range.start, 16)),
    };

    const handle = container.querySelector(
      '[aria-label="Create dependency from end of API contracts"]',
    ) as HTMLElement;
    fireEvent.pointerDown(handle, { clientX: apiGeom.left + apiGeom.width, clientY: 0, button: 0 });
    // Move over the webapp bar — before releasing, the rubber preview is live.
    pointer(window, "pointermove", webappGeom.left + 10, webappRow.top + 10);

    const rubberPath = Array.from(container.querySelectorAll("path")).find(
      (p) => p.getAttribute("stroke-dasharray") === "5 3",
    );
    expect(rubberPath).toBeTruthy(); // the preview is drawn
    const d = rubberPath!.getAttribute("d")!;
    expect(d).toMatch(/^M /); // a real routed path
    // Port nodes are drawn at both ends (source right edge + target left edge / pointer).
    const circles = Array.from(container.querySelectorAll("circle"));
    expect(circles.length).toBeGreaterThanOrEqual(4);
    const srcPortX = apiGeom.left + apiGeom.width;
    expect(
      circles.some((c) => Math.abs(Number(c.getAttribute("cx")) - srcPortX) < 1),
    ).toBe(true); // the source port node sits on the source's right edge

    pointer(window, "pointerup", webappGeom.left + 10, webappRow.top + 10);
  });

  it("fans out the ports of links sharing a source (16px slots, no stacking)", () => {
    const fanTasks: GanttTask[] = [
      { id: "fa", name: "A", start: "2026-08-10", end: "2026-08-14", lane: "fl" },
      { id: "fb", name: "B", start: "2026-08-20", end: "2026-08-24", lane: "fl" },
      { id: "fc", name: "C", start: "2026-08-24", end: "2026-08-28", lane: "fl" },
    ];
    const { container } = render(
      <Gantt
        tasks={fanTasks}
        links={[
          { id: "f1", source: "fa", target: "fb" },
          { id: "f2", source: "fa", target: "fc" },
        ]}
        lanes={[{ id: "fl", label: "Lane" }]}
      />,
    );
    // Port dots: group by cx (each x position = one bar edge). The source's
    // right edge carries both links — its two distinct cy's differ by the
    // 16px fan spacing instead of stacking on one point.
    const circles = Array.from(container.querySelectorAll("circle"));
    const byX = new Map<number, Set<number>>();
    for (const c of circles) {
      const x = Number(c.getAttribute("cx"));
      const y = Number(c.getAttribute("cy"));
      const set = byX.get(x) ?? new Set<number>();
      set.add(y);
      byX.set(x, set);
    }
    const fanned = [...byX.values()].find((ys) => ys.size === 2);
    expect(fanned).toBeTruthy();
    const [y1, y2] = [...fanned!];
    expect(Math.abs(y1 - y2)).toBeCloseTo(16, 5);
  });

  it("selects a link (revealing a delete control) and removes it via the Delete key", () => {
    const onLinksChange = vi.fn();
    const { container } = render(
      <Gantt
        tasks={tasks}
        links={[{ source: "research", target: "wireframes", type: "fs" }]}
        lanes={sampleGanttLanes}
        onLinksChange={onLinksChange}
      />,
    );
    const ganttRoot = container.querySelector("[data-gantt]") as HTMLElement;
    // Click the connector to select it (its <title> names the pair).
    const path = Array.from(container.querySelectorAll("path")).find(
      (p) => p.querySelector("title")?.textContent?.includes("→"),
    ) as SVGPathElement;
    expect(path).toBeTruthy();
    fireEvent.click(path);

    // A delete control appears and the chart gains focus (so Delete works).
    const chip = container.querySelector(
      'button[title="Remove this dependency (or press Delete)"]',
    );
    expect(chip).toBeTruthy();
    expect(document.activeElement).toBe(ganttRoot);

    // The Delete key removes the selected link.
    fireEvent.keyDown(ganttRoot, { key: "Delete" });
    expect(onLinksChange).toHaveBeenCalledTimes(1);
    expect(onLinksChange.mock.calls[0][0]).toHaveLength(0);
  });

  it("removes the selected link by clicking its delete control", () => {
    const onLinksChange = vi.fn();
    const { container } = render(
      <Gantt
        tasks={tasks}
        links={[{ source: "research", target: "wireframes", type: "fs" }]}
        lanes={sampleGanttLanes}
        onLinksChange={onLinksChange}
      />,
    );
    const path = Array.from(container.querySelectorAll("path")).find(
      (p) => p.querySelector("title")?.textContent?.includes("→"),
    ) as SVGPathElement;
    fireEvent.click(path);
    const chip = container.querySelector(
      'button[title="Remove this dependency (or press Delete)"]',
    ) as HTMLButtonElement;
    expect(chip).toBeTruthy();
    fireEvent.click(chip);
    expect(onLinksChange).toHaveBeenCalledTimes(1);
    expect(onLinksChange.mock.calls[0][0]).toHaveLength(0);
  });

  it("clears the link selection (and its delete control) when clicking outside", () => {
    const { container } = render(
      <Gantt
        tasks={tasks}
        links={[{ source: "research", target: "wireframes", type: "fs" }]}
        lanes={sampleGanttLanes}
        onLinksChange={vi.fn()}
      />,
    );
    const path = Array.from(container.querySelectorAll("path")).find(
      (p) => p.querySelector("title")?.textContent?.includes("→"),
    ) as SVGPathElement;
    fireEvent.click(path);
    const chip = container.querySelector(
      'button[title="Remove this dependency (or press Delete)"]',
    );
    expect(chip).toBeTruthy();
    // Pressing a bar (outside the connector) → the selection clears.
    // (Pointerdown, not click: interactive bars suppress the click event.)
    fireEvent.pointerDown(document.querySelector('[data-gantt-bar="api"]')!);
    expect(
      container.querySelector('button[title="Remove this dependency (or press Delete)"]'),
    ).toBeNull();
    // Re-select, then press the chart background → clears again.
    fireEvent.click(path);
    expect(chip).toBeTruthy();
    fireEvent.pointerDown(container.querySelector("[data-gantt]")!);
    expect(
      container.querySelector('button[title="Remove this dependency (or press Delete)"]'),
    ).toBeNull();
  });

  it("selects a link by clicking a few px off the stroke (hit radius)", () => {
    const onLinksChange = vi.fn();
    const { container } = render(
      <Gantt tasks={tasks} links={links} lanes={sampleGanttLanes} onLinksChange={onLinksChange} />,
    );

    // Mirror the component's link geometry (same engine inputs).
    const range = computeViewRange(
      tasks.map((t) => toMs(t.start)),
      tasks.map((t) => toMs(t.end)),
    );
    const zoom = 16;
    const { rows } = buildRows(tasks, sampleGanttLanes, undefined, 44);
    const bars = new Map<string, GanttBarGeometry>();
    for (const row of rows) {
      if (!row.task) continue;
      const t = row.task;
      const milestone = t.type === "milestone";
      const left = dateToX(toMs(t.start), range.start, zoom);
      const width = milestone ? 0 : Math.max(6, dateToX(toMs(t.end), range.start, zoom) - left);
      bars.set(t.id, { taskId: t.id, left, width, top: row.top, height: row.height, milestone });
    }
    const paths = computeLinkPaths(links, bars, "blue");

    // Aim at a horizontal leg's middle, 3px below it — outside the 1.5px
    // stroke (previously unselectable), inside the hit radius.
    let aim: { index: number; x: number; y: number } | null = null;
    paths.forEach((p, index) => {
      if (aim) return;
      for (let i = 0; i + 1 < p.points.length; i++) {
        const [x1, y1] = p.points[i];
        const [x2, y2] = p.points[i + 1];
        if (y1 === y2 && Math.abs(x2 - x1) > 40) {
          aim = { index, x: (x1 + x2) / 2, y: y1 + 3 };
          return;
        }
      }
    });
    expect(aim).toBeTruthy();
    const a = aim!;

    // jsdom reports zero rects, so client coords == local svg coords.
    const hitPath = container.querySelectorAll("[data-gantt-link-hit]")[a.index] as SVGPathElement;
    expect(hitPath).toBeTruthy();
    fireEvent.click(hitPath, { clientX: a.x, clientY: a.y });

    // The off-stroke click selects the aimed link: exactly one visible path is
    // thickened (2.5) and its delete chip is visible.
    const chip = container.querySelector(
      'button[title="Remove this dependency (or press Delete)"]',
    );
    expect(chip).toBeTruthy();
    const visible = Array.from(
      container.querySelectorAll("path[data-gantt-keep-link-selection]"),
    ).filter((p) => (p.getAttribute("stroke-width") ?? "1.5") === "2.5");
    expect(visible.length).toBe(1);
  });

  it("re-routes a dependency live while its source bar is dragged", () => {
    const onTasksChange = vi.fn();
    const { container } = render(
      <Gantt tasks={tasks} links={links} lanes={sampleGanttLanes} onTasksChange={onTasksChange} />,
    );
    // The VISIBLE stroke path (the hit path also carries the same <title>).
    const visibleOf = (pair: string) =>
      Array.from(container.querySelectorAll("path"))
        .filter((p) => p.querySelector("title")?.textContent?.includes(pair))
        .pop() as SVGPathElement;
    const startX = (d: string) => Number(d.match(/^M\s*([\d.-]+)/)![1]);
    const endXY = (d: string) => {
      const n = d.match(/-?\d+(\.\d+)?/g)!;
      return [Number(n[n.length - 2]), Number(n[n.length - 1])] as const;
    };

    const dBefore = visibleOf("research → wireframes").getAttribute("d")!;
    const endBefore = endXY(dBefore);

    // Drag the source bar 160px right (10 days @ 16px/day) — mid-drag.
    fireEvent.pointerDown(bar("research"), { clientX: 0, clientY: 0, button: 0 });
    pointer(window, "pointermove", 160, 0);

    const dMid = visibleOf("research → wireframes").getAttribute("d")!;
    expect(dMid).not.toBe(dBefore);
    // The route departs from the source port, which moved with the bar…
    expect(startX(dMid) - startX(dBefore)).toBeCloseTo(160, 1);
    // …while it still lands on the (unmoved) target port.
    expect(endXY(dMid)).toEqual(endBefore);

    pointer(window, "pointerup", 160, 0);
    expect(onTasksChange).toHaveBeenCalledTimes(1);
  });

  it("moves a focused task with the arrow keys", () => {
    const onTasksChange = vi.fn();
    render(<Gantt tasks={tasks} lanes={sampleGanttLanes} onTasksChange={onTasksChange} />);
    const el = bar("api");
    el.focus();
    fireEvent.keyDown(el, { key: "ArrowRight" });
    expect(onTasksChange).toHaveBeenCalledTimes(1);
    const next = onTasksChange.mock.calls[0][0] as GanttTask[];
    const api = next.find((t) => t.id === "api")!;
    const apiOrig = tasks.find((t) => t.id === "api")!;
    expect(toMs(api.start)).toBe(toMs(apiOrig.start) + MS_PER_DAY);
  });

  it("collapses a lane via its caret", () => {
    const { container } = render(<Gantt tasks={tasks} lanes={sampleGanttLanes} />);
    const before = container.querySelectorAll('[data-gantt-bar]').length;
    const engCaret = screen.getByLabelText("Collapse Engineering");
    fireEvent.click(engCaret);
    const after = container.querySelectorAll('[data-gantt-bar]').length;
    expect(after).toBeLessThan(before);
  });

  it("zooms to a preset through the toolbar (controlled)", () => {
    const onZoomChange = vi.fn();
    render(
      <Gantt
        tasks={tasks}
        lanes={sampleGanttLanes}
        zoom={16}
        onZoomChange={onZoomChange}
      />,
    );
    fireEvent.click(screen.getByText("Month"));
    expect(onZoomChange).toHaveBeenCalledWith(5);
  });

  it("emits nothing from a locked task drag", () => {
    const onTasksChange = vi.fn();
    const locked = tasks.map((t) => (t.id === "api" ? { ...t, locked: true } : t));
    render(<Gantt tasks={locked} lanes={sampleGanttLanes} onTasksChange={onTasksChange} />);
    fireEvent.pointerDown(bar("api"), { clientX: 0, clientY: 0, button: 0 });
    pointer(window, "pointermove", 160, 0);
    pointer(window, "pointerup", 160, 0);
    expect(onTasksChange).not.toHaveBeenCalled();
  });

  // ── Panel chrome + detached header ─────────────────────────────────────────

  it("renders as a Panel with the elevated surface by default", () => {
    const { container } = render(
      <Gantt tasks={tasks} links={links} lanes={sampleGanttLanes} />,
    );
    const root = container.querySelector<HTMLElement>("[data-gantt]")!;
    expect(root.tagName).toBe("SECTION");
    expect(root.getAttribute("data-variant")).toBe("elevated");
    expect(root.getAttribute("data-tone")).toBe("neutral");
  });

  it("keeps the toolbar and the today marker in the detached header, out of the body scroller", () => {
    const { container } = render(
      <Gantt tasks={tasks} links={links} lanes={sampleGanttLanes} />,
    );
    const scroller = container.querySelector<HTMLElement>(".gantt-scroller")!;
    expect(scroller).toBeTruthy();

    // Zoom toolbar sits in the header strip, not the scrolling body.
    const weekBtn = screen.getByText("Week").closest("button")!;
    expect(scroller.contains(weekBtn)).toBe(false);

    // The Today chip rides today's column in the header.
    const chip = screen.getByText("Today");
    expect(scroller.contains(chip)).toBe(false);

    // Two today lines: one in the header scale window, one in the body.
    const todayLines = [...container.querySelectorAll<HTMLElement>('[class*="border-l-2"]')];
    expect(todayLines.length).toBe(2);
    expect(todayLines.some((el) => !scroller.contains(el))).toBe(true);
  });

  it("does not duplicate the task column label in the header", () => {
    const { container } = render(<Gantt tasks={tasks} lanes={sampleGanttLanes} />);
    const root = container.querySelector<HTMLElement>("[data-gantt]")!;
    const taskLabels = [...root.querySelectorAll("span")].filter(
      (el) => el.textContent === "Task",
    );
    expect(taskLabels.length).toBe(1);
  });

  it("propagates a non-default variant to the container, header hairline and toolbar", () => {
    const { container } = render(
      <Gantt tasks={tasks} links={links} lanes={sampleGanttLanes} variant="glass" />,
    );
    const root = container.querySelector<HTMLElement>("[data-gantt]")!;
    expect(root.getAttribute("data-variant")).toBe("glass");

    // The header hairline follows the translucent surface divider.
    const header = [...container.querySelectorAll<HTMLElement>('[class*="border-b"]')].find(
      (el) => el.style.height === "52px",
    )!;
    expect(header.className).toContain(getSurfaceTextTokens("glass").divider.split(" ")[0]);

    // The toolbar pill follows the shared surface-variant chrome (glass rim).
    const pill = screen.getByText("Week").closest("[class*='pointer-events-auto']")!;
    expect(pill.className).toContain(getSurfaceVariantClasses("glass", "neutral"));
    expect(pill.className).toContain(SURFACE_GLASS_RIM.split(" ")[0]);

    // Row hairlines follow the divider token (solid → neutral-200 hairline by
    // default, the translucent divider on glass).
    const row = container.querySelector<HTMLElement>("[data-row-key]")!;
    expect(row.className).toContain(getSurfaceTextTokens("glass").divider.split(" ")[0]);
  });
});
