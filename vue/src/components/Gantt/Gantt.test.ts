import { describe, it, expect } from "vitest";
import { mount, type VueWrapper } from "@vue/test-utils";
import { nextTick, h } from "vue";
import Gantt from "./Gantt.vue";
import {
  sampleGanttTasks,
  sampleGanttLanes,
  sampleGanttLinks,
  buildRows,
  dateToX,
  toMs,
  computeViewRange,
  laneRollupProgress,
  taskRollupProgress,
  applyRowReorder,
  MS_PER_DAY,
} from "../../../../common/gantt";
import type { GanttTask } from "../../../../common/gantt";
import { getSurfaceTextTokens, getSurfaceVariantClasses } from "../../theme/Theme";

const NOW = new Date("2026-08-30T12:00:00Z");
const tasks = sampleGanttTasks(NOW);
const links = sampleGanttLinks();

// test-utils cannot infer the SFC's generic parameter from the props object,
// so the component is cast; the props object stays fully typed.
const mountGantt = (props: Record<string, unknown> = {}) =>
  mount(Gantt as any, {
    props: { tasks, links, lanes: sampleGanttLanes, ...props },
    attachTo: document.body,
  });

function pointer(type: string, x: number, y: number) {
  window.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y, bubbles: true }));
}

describe("Gantt (Vue)", () => {
  it("renders lanes, tasks, bars, scale and the today marker", () => {
    const w: VueWrapper = mountGantt();
    expect(w.text()).toContain("Design");
    expect(w.text()).toContain("Engineering");
    expect(w.text()).toContain("Launch");
    expect(w.text()).toContain("API contracts");
    expect(w.find('[data-gantt-bar="api"]').exists()).toBe(true);
    expect(w.find('[data-gantt-bar="ship"]').exists()).toBe(true);
    expect(w.find('[data-gantt]').exists()).toBe(true);
    // Column headers.
    expect(w.text()).toContain("Owner");
    expect(w.text()).toContain("Progress");
    // Lane progress renders in the Progress column (inside the sticky left
    // block), not at the right edge of the row.
    const laneRow = w.element.querySelector('[data-row-key="lane:design"]');
    expect(laneRow).toBeTruthy();
    const laneLeft = laneRow?.querySelector(":scope > div.sticky");
    const laneTimeline = laneRow?.querySelector(":scope > div.relative");
    expect((laneLeft?.textContent ?? "").trim()).toMatch(/%$/);
    expect(laneTimeline?.textContent ?? "").not.toContain("%");
  });

  it("keeps the fixed columns opaque and gap-free so scrolled content can't bleed through", () => {
    const w: VueWrapper = mountGantt();
    // The row divider lives on each half (sticky block + timeline cell), not
    // on the row root: each half spans the full row height, so there is no
    // 1px strip under the sticky block that scrolled links/grid lines could
    // poke through.
    const taskRow = w.element.querySelector('[data-row-key="task:research"]')!;
    expect(taskRow.className).not.toContain("border-b");
    // The row pins its rendered height to the model height.
    expect(taskRow.className).toContain("overflow-hidden");
    const sticky = taskRow.querySelector(":scope > div.sticky") as HTMLElement;
    expect(sticky.className).toContain("border-b");
    expect(sticky.className).toContain("bg-white");
    const timelineHalf = taskRow.children[taskRow.children.length - 1] as HTMLElement;
    expect(timelineHalf.className).toContain("border-b");
    // The lane tint sits on an opaque surface inside the sticky block (the
    // translucent band is an overlay), so scrolling never shows through the
    // fixed lane cells.
    const laneRow = w.element.querySelector('[data-row-key="lane:design"]')!;
    const laneSticky = laneRow.querySelector(":scope > div.sticky") as HTMLElement;
    expect(laneSticky.className).toContain("bg-white");
    expect(laneSticky.className).not.toContain("bg-violet-50/70");
    const overlay = laneSticky.querySelector(":scope > div.absolute") as HTMLElement;
    expect(overlay).toBeTruthy();
    expect(overlay.className).toContain("bg-violet-50/70");
    // Every fixed-column divider (header cells, the header sticky edge, the
    // lane/task sticky edges) carries the same surface-divider token — one
    // line style, same width, same position on every row.
    const dividerToken = getSurfaceTextTokens("elevated").divider.split(" ")[0];
    // The detached header row: the only `items-stretch border-b` strip with a
    // sticky left block (first child, `border-r`) and a scale window.
    const headerRow = [...w.element.querySelectorAll("div")].find(
      (el) =>
        (el.className as string).includes("items-stretch") &&
        (el.className as string).includes("border-b") &&
        (el.children[0]?.getAttribute("class") || "").includes("border-r"),
    ) as HTMLElement;
    const headerLeft = headerRow.children[0] as HTMLElement;
    expect(headerLeft.className).toContain("border-r");
    expect(headerLeft.className).toContain(dividerToken);
    const headerCell = headerLeft.children[1] as HTMLElement;
    expect(headerCell.className).toContain(dividerToken);
    expect(headerCell.className).not.toContain("/70");
    expect(sticky.className).toContain("border-r");
    expect(laneSticky.className).toContain("border-r");
    w.unmount();
  });

  it("renders the optional chart header above the column header", () => {
    const w = mountGantt({
      title: "Northwind Logistics GmbH",
      subtitle: "Vendor onboarding · REQ-4128",
      icon: h("span", { "data-gantt-chart-icon": "" }, "R"),
      actions: h("span", { "data-gantt-chart-actions": "" }, "LIVE"),
    });
    expect(w.text()).toContain("Northwind Logistics GmbH");
    expect(w.text()).toContain("Vendor onboarding · REQ-4128");
    expect(w.find("[data-gantt-chart-icon]").exists()).toBe(true);
    expect(w.find("[data-gantt-chart-actions]").exists()).toBe(true);
    // The strip sits directly above the (52px) column header strip.
    const scroller = w.find(".gantt-scroller").element as HTMLElement;
    const columnHeader = scroller.previousElementSibling as HTMLElement;
    const chartHeader = columnHeader.previousElementSibling as HTMLElement;
    expect(chartHeader.textContent).toContain("Northwind Logistics GmbH");
    expect(chartHeader.textContent).not.toContain("Owner");
    // The zoom selector moves into the header (after the actions) and the
    // floating overlay over the scale window is suppressed.
    expect(chartHeader.textContent).toContain("Quarter");
    expect(columnHeader.textContent).not.toContain("Quarter");
  });

  it("always renders the header strip with the zoom selector, even without header props", () => {
    const w = mountGantt();
    const scroller = w.find(".gantt-scroller").element as HTMLElement;
    const columnHeader = scroller.previousElementSibling as HTMLElement;
    const chartHeader = columnHeader.previousElementSibling as HTMLElement;
    // The strip is always present and carries the zoom selector — it never
    // floats over the scale window.
    expect(chartHeader.textContent).toContain("Quarter");
    expect(chartHeader.textContent).not.toContain("Northwind");
    expect(columnHeader.textContent).not.toContain("Quarter");
  });

  it("shows the empty state when there are no tasks", () => {
    const w = mountGantt({ tasks: [] });
    expect(w.text()).toContain("No tasks to display");
  });

  it("shows a loading skeleton when loading", () => {
    const w = mountGantt({ loading: true });
    expect(w.find('[aria-busy="true"]').exists()).toBe(true);
  });

  it("emits select when a bar is clicked", async () => {
    const w = mountGantt();
    await w.find('[data-gantt-bar="api"]').trigger("click");
    expect(w.emitted("select")).toBeTruthy();
    expect(w.emitted("select")![0]).toEqual(["api"]);
  });

  it("moves a task by dragging the bar (snapped, duration preserved)", async () => {
    const w = mountGantt({ editable: true });
    const bar = w.find('[data-gantt-bar="api"]');
    expect(bar.exists()).toBe(true);
    await bar.trigger("pointerdown");
    await nextTick(); // let the drag watcher attach the window listeners
    pointer("pointermove", 160, 0);
    pointer("pointerup", 160, 0);
    await nextTick();

    expect(w.emitted("tasks-change")).toBeTruthy();
    const next = w.emitted("tasks-change")![0][0] as GanttTask[];
    const api = next.find((t) => t.id === "api")!;
    const apiOrig = tasks.find((t) => t.id === "api")!;
    expect(toMs(api.start)).toBe(toMs(apiOrig.start) + 10 * MS_PER_DAY);
    expect(toMs(api.end)).toBe(toMs(apiOrig.end) + 10 * MS_PER_DAY);
  });

  it("previews progress live while dragging the knob, committing only on drop", async () => {
    const w = mountGantt({ editable: true });
    // webapp-screens is a leaf (groups display their children's roll-up and
    // expose no knob).
    const bar = w.find('[data-gantt-bar="webapp-screens"]');
    const knob = bar.find('[title="Adjust progress"]');
    expect(knob.exists()).toBe(true);

    const range = computeViewRange(
      tasks.map((t) => toMs(t.start)),
      tasks.map((t) => toMs(t.end)),
    );
    const screens = tasks.find((t) => t.id === "webapp-screens")!;
    const left = dateToX(toMs(screens.start), range.start, 16);
    const width = Math.max(6, dateToX(toMs(screens.end), range.start, 16) - left);

    await knob.trigger("pointerdown");
    await nextTick();

    // Mid-drag: the pointer at 80% of the bar — the fill and the live %
    // chip follow in real time; nothing is committed yet.
    pointer("pointermove", left + width * 0.8, 100);
    await nextTick();
    const overlay = bar.find("[class*='rounded-l-md']");
    expect(overlay.attributes("style")).toContain("width: 80%");
    expect(bar.find("[class*='bg-neutral-900']").text()).toBe("80%");
    expect(w.emitted("tasks-change")).toBeFalsy();

    pointer("pointerup", left + width * 0.8, 100);
    await nextTick();
    expect(w.emitted("tasks-change")).toBeTruthy();
    const next = w.emitted("tasks-change")![0][0] as GanttTask[];
    expect(next.find((t) => t.id === "webapp-screens")!.progress).toBe(0.8);
  });

  it("re-rolls the lane progress live while dragging a child's knob", async () => {
    const w = mountGantt({ editable: true });
    // webapp-screens is a leaf of the eng lane (a group's own progress is
    // ignored by the leaf-based roll-up).
    const bar = w.find('[data-gantt-bar="webapp-screens"]');
    const knob = bar.find('[title="Adjust progress"]');
    expect(knob.exists()).toBe(true);

    const screens = tasks.find((t) => t.id === "webapp-screens")!;
    const committed = laneRollupProgress(tasks, "webapp-screens")!;
    const live = laneRollupProgress(tasks, "webapp-screens", { ...screens, progress: 0.8 })!;
    // The previewed edit actually moves the lane's roll-up (test guard).
    expect(Math.round(live.progress * 100)).not.toBe(Math.round(committed.progress * 100));

    const range = computeViewRange(
      tasks.map((t) => toMs(t.start)),
      tasks.map((t) => toMs(t.end)),
    );
    const left = dateToX(toMs(screens.start), range.start, 16);
    const width = Math.max(6, dateToX(toMs(screens.end), range.start, 16) - left);

    await knob.trigger("pointerdown");
    await nextTick();
    pointer("pointermove", left + width * 0.8, 100);
    await nextTick();

    // Mid-drag: the lane header reads the re-rolled %.
    const laneRow = w.find('[data-row-key="lane:eng"]');
    expect(laneRow.text()).toContain(`${Math.round(live.progress * 100)}%`);
    expect(w.emitted("tasks-change")).toBeFalsy();

    pointer("pointerup", left + width * 0.8, 100);
    await nextTick();
    expect(w.emitted("tasks-change")).toBeTruthy();
  });

  it("shows the children's roll-up on group rows — read-only, no progress knob", () => {
    const w = mountGantt({ editable: true });
    const webapp = tasks.find((t) => t.id === "webapp")!;
    const rollup = taskRollupProgress(tasks, "webapp")!;
    expect(rollup).not.toBeCloseTo(webapp.progress ?? 0, 5);
    const row = w.find('[data-row-key="task:webapp"]');
    expect(row.text()).toContain(`${Math.round(rollup * 100)}%`);
    const bar = w.find('[data-gantt-bar="webapp"]');
    const overlay = bar
      .element.children ? [...bar.element.children].find((c) => (c as HTMLElement).style.width) : null;
    expect((overlay as HTMLElement).style.width).toBe(`${rollup * 100}%`);
    expect(bar.find('[title="Adjust progress"]').exists()).toBe(false);
  });

  it("re-rolls the parent group's progress live while dragging a child's knob", async () => {
    const w = mountGantt({ editable: true });
    const bar = w.find('[data-gantt-bar="webapp-screens"]');
    const knob = bar.find('[title="Adjust progress"]');
    expect(knob.exists()).toBe(true);

    const screens = tasks.find((t) => t.id === "webapp-screens")!;
    const groupCommitted = taskRollupProgress(tasks, "webapp")!;
    const groupLive = taskRollupProgress(tasks, "webapp", { ...screens, progress: 0.8 })!;
    expect(Math.round(groupLive * 100)).not.toBe(Math.round(groupCommitted * 100));

    const range = computeViewRange(
      tasks.map((t) => toMs(t.start)),
      tasks.map((t) => toMs(t.end)),
    );
    const left = dateToX(toMs(screens.start), range.start, 16);
    const width = Math.max(6, dateToX(toMs(screens.end), range.start, 16) - left);

    await knob.trigger("pointerdown");
    await nextTick();
    pointer("pointermove", left + width * 0.8, 100);
    await nextTick();

    // Mid-drag: the parent group's Progress cell shows the re-rolled %.
    const groupRow = w.find('[data-row-key="task:webapp"]');
    expect(groupRow.text()).toContain(`${Math.round(groupLive * 100)}%`);
    expect(w.emitted("tasks-change")).toBeFalsy();

    pointer("pointerup", left + width * 0.8, 100);
    await nextTick();
    expect(w.emitted("tasks-change")).toBeTruthy();
  });

  it("reorders rows by dragging the row grip", async () => {
    const w = mountGantt({ editable: true });
    const { rows } = buildRows(tasks, sampleGanttLanes, undefined, 44);
    const apiRow = rows.find((r) => r.key === "task:api")!;
    const grip = w.find('[data-row-key="task:webapp"] [title="Drag to reorder"]');
    expect(grip.exists()).toBe(true);
    await grip.trigger("pointerdown");
    await nextTick();
    // Upper half of the "api" row (before its midpoint) → before api.
    pointer("pointermove", 0, apiRow.top + apiRow.height * 0.25);
    pointer("pointerup", 0, apiRow.top + apiRow.height * 0.25);
    await nextTick();

    expect(w.emitted("reorder")).toBeTruthy();
    const order = w.emitted("reorder")![0][0] as string[];
    expect(order.indexOf("webapp")).toBeLessThan(order.indexOf("api"));
    // A grip press starts a reorder — it must not leave the moved row
    // selected, or the selection tint lingers on it after the drop.
    const movedRow = w.element.querySelector('[data-row-key="task:webapp"]') as HTMLElement;
    expect(movedRow.className).not.toMatch(/bg-/);
    w.unmount();
  });

  it("lifts the dragged block into a floating clone with a full-height ghost slot", async () => {
    const w = mountGantt({ editable: true });
    const taskKeys = () =>
      // Exclude the floating clone (it duplicates the dragged block's keys).
      w.findAll('[data-row-key^="task:"]')
        .filter((el) => !el.element.closest('[data-gantt-drag-clone="true"]'))
        .map((el) => el.attributes("data-row-key"));
    const before = taskKeys();
    expect(before.indexOf("task:webapp")).toBeGreaterThan(before.indexOf("task:api"));

    const { rows } = buildRows(tasks, sampleGanttLanes, undefined, 44);
    const apiRow = rows.find((r) => r.key === "task:api")!;
    const grip = w.find('[data-row-key="task:webapp"] [title="Drag to reorder"]');
    await grip.trigger("pointerdown");
    await nextTick();

    // Press alone: the block's relative order is untouched (no immediate
    // shift), the in-flow rows close up (webapp's children travel to the
    // clone), a dashed ghost slot spans the whole expanded block, and a
    // floating clone carries the block with the accent grip.
    const afterPress = taskKeys();
    expect(afterPress).toEqual(
      before.filter(
        (k) =>
          k !== "task:webapp-shell" &&
          k !== "task:webapp-screens" &&
          k !== "task:webapp-polish",
      ),
    );
    expect(afterPress.indexOf("task:webapp")).toBeGreaterThan(
      afterPress.indexOf("task:api"),
    );
    const ghost = w.find('[data-row-key="task:webapp"][data-gantt-ghost="true"]');
    expect(ghost.exists()).toBe(true);
    expect(ghost.attributes("style")).toContain("height: 176px");
    // The clone is teleported to document.body — the variant surface's
    // backdrop-filter would otherwise make it the fixed clone's containing
    // block and the body scroller would clip it away.
    const clone = document.querySelector('[data-gantt-drag-clone="true"]');
    expect(clone).toBeTruthy();
    expect(clone!.querySelectorAll('[data-row-key^="task:"]').length).toBe(4);
    const cloneGrip = clone!.querySelector('[title="Drag to reorder"]') as HTMLElement;
    expect(cloneGrip).toBeTruthy();
    expect(cloneGrip.style.color).toContain("var(--color-");
    expect(cloneGrip.style.color).toContain("-500");
    expect(w.find("div.z-30.h-0\\.5").exists()).toBe(false);

    // Into api's upper half → the preview commits: webapp (and its children)
    // shifts above api and the line tracks api's new top edge.
    pointer("pointermove", 0, apiRow.top + apiRow.height * 0.25);
    await nextTick();
    const live = taskKeys();
    expect(live.indexOf("task:webapp")).toBeLessThan(live.indexOf("task:api"));
    expect(live.indexOf("task:webapp-shell")).toBeLessThan(live.indexOf("task:api"));
    const liveRows = buildRows(
      tasks,
      sampleGanttLanes,
      applyRowReorder(tasks, "webapp", "api", undefined).order,
      44,
    ).rows;
    const line = w.find("div.z-30.h-0\\.5");
    expect(line.exists()).toBe(true);
    expect(line.attributes("style")).toContain(`top: ${liveRows.find((r) => r.key === "task:api")!.top}px`);
    expect(w.emitted("reorder")).toBeFalsy();

    pointer("pointerup", 0, apiRow.top + apiRow.height * 0.25);
    await nextTick();
    expect(w.emitted("reorder")).toBeTruthy();
    const order = w.emitted("reorder")![0][0] as string[];
    expect(order.indexOf("webapp")).toBeLessThan(order.indexOf("api"));
    expect(document.querySelector('[data-gantt-drag-clone="true"]')).toBeNull();
    expect(w.find('[data-gantt-ghost="true"]').exists()).toBe(false);
  });

  it("reorders a child among its siblings and commits through the tasks channel", async () => {
    const w = mountGantt({ editable: true });
    const { rows } = buildRows(tasks, sampleGanttLanes, undefined, 44);
    const flowRow = rows.find((r) => r.key === "task:visual-flow")!;

    const grip = w.find('[data-row-key="task:visual-tokens"] [title="Drag to reorder"]');
    expect(grip.exists()).toBe(true);
    await grip.trigger("pointerdown");
    await nextTick();
    // Below the sibling's midpoint → after it (end of the sibling list).
    pointer("pointermove", 0, flowRow.top + flowRow.height * 0.75);
    pointer("pointerup", 0, flowRow.top + flowRow.height * 0.75);
    await nextTick();

    expect(w.emitted("reorder")).toBeFalsy();
    expect(w.emitted("tasks-change")).toBeTruthy();
    const next = w.emitted("tasks-change")![0][0] as GanttTask[];
    const kids = next.filter((t) => t.parent === "visual").map((t) => t.id);
    expect(kids).toEqual(["visual-flow", "visual-tokens"]);
  });

  it("creates a dependency by dragging from a bar edge handle", async () => {
    const w = mountGantt({ links: [], editable: true });
    const range = computeViewRange(
      tasks.map((t) => toMs(t.start)),
      tasks.map((t) => toMs(t.end)),
    );
    const geom = (id: string) => {
      const t = tasks.find((x) => x.id === id)!;
      const left = dateToX(toMs(t.start), range.start, 16);
      return { left, width: Math.max(6, dateToX(toMs(t.end), range.start, 16) - left) };
    };
    const webapp = geom("webapp");
    const { rows } = buildRows(tasks, sampleGanttLanes, undefined, 44);
    const webappRow = rows.find((r) => r.key === "task:webapp")!;

    const handle = w.find('[aria-label="Create dependency from end of API contracts"]');
    expect(handle.exists()).toBe(true);
    await handle.trigger("pointerdown");
    await nextTick();
    pointer("pointermove", webapp.left + 10, webappRow.top + 10);
    pointer("pointerup", webapp.left + 10, webappRow.top + 10);
    await nextTick();

    expect(w.emitted("links-change")).toBeTruthy();
    const next = w.emitted("links-change")![0][0] as import("../../../../common/gantt").GanttLink[];
    expect(next).toHaveLength(1);
    expect(next[0]).toMatchObject({ source: "api", target: "webapp", type: "fs" });
  });

  it("fans out the ports of links sharing a source (16px slots, no stacking)", () => {
    const fanTasks: GanttTask[] = [
      { id: "fa", name: "A", start: "2026-08-10", end: "2026-08-14", lane: "fl" },
      { id: "fb", name: "B", start: "2026-08-20", end: "2026-08-24", lane: "fl" },
      { id: "fc", name: "C", start: "2026-08-24", end: "2026-08-28", lane: "fl" },
    ];
    const w = mount(Gantt as any, {
      props: {
        tasks: fanTasks,
        links: [
          { id: "f1", source: "fa", target: "fb" },
          { id: "f2", source: "fa", target: "fc" },
        ],
        lanes: [{ id: "fl", label: "Lane" }],
      },
    });
    // Port dots: group by cx (each x position = one bar edge). The source's
    // right edge carries both links — its two distinct cy's differ by the
    // 16px fan spacing instead of stacking on one point.
    const circles = w.element.querySelectorAll("circle");
    const byX = new Map<number, Set<number>>();
    circles.forEach((c: Element) => {
      const x = Number(c.getAttribute("cx"));
      const y = Number(c.getAttribute("cy"));
      const set = byX.get(x) ?? new Set<number>();
      set.add(y);
      byX.set(x, set);
    });
    const fanned = [...byX.values()].find((ys) => ys.size === 2);
    expect(fanned).toBeTruthy();
    const [y1, y2] = [...fanned!];
    expect(Math.abs(y1 - y2)).toBeCloseTo(16, 5);
  });

  it("collapses a lane via its caret", async () => {
    const w = mountGantt();
    const before = w.findAll('[data-gantt-bar]').length;
    await w.find('[aria-label="Collapse Engineering"]').trigger("click");
    await nextTick();
    const after = w.findAll('[data-gantt-bar]').length;
    expect(after).toBeLessThan(before);
  });

  it("zooms to a preset through the toolbar (controlled)", async () => {
    const w = mountGantt({ zoom: 16, "onZoomChange": () => {} });
    const monthBtn = w.findAll("button").find((b) => b.text() === "Month");
    expect(monthBtn).toBeTruthy();
    await monthBtn!.trigger("click");
    expect(w.emitted("zoom-change")).toBeTruthy();
    expect(w.emitted("zoom-change")![0]).toEqual([5]);
  });

  it("emits nothing from a locked task drag", async () => {
    const locked = tasks.map((t) => (t.id === "api" ? { ...t, locked: true } : t));
    const w = mountGantt({ tasks: locked, editable: true });
    await w.find('[data-gantt-bar="api"]').trigger("pointerdown");
    await nextTick();
    pointer("pointermove", 160, 0);
    pointer("pointerup", 160, 0);
    await nextTick();
    expect(w.emitted("tasks-change")).toBeFalsy();
  });

  // ── Panel chrome + detached header ─────────────────────────────────────────

  it("renders as a Panel with the elevated surface by default", () => {
    const w = mountGantt();
    const root = w.find("[data-gantt]").element as HTMLElement;
    expect(root.tagName).toBe("SECTION");
    expect(root.getAttribute("data-variant")).toBe("elevated");
    expect(root.getAttribute("data-tone")).toBe("neutral");
  });

  it("keeps the toolbar and the today marker in the detached header, out of the body scroller", () => {
    const w = mountGantt();
    const scroller = w.find<HTMLElement>(".gantt-scroller").element;
    expect(scroller).toBeTruthy();

    // Zoom toolbar sits in the header strip, not the scrolling body.
    const weekBtn = w.findAll("button").find((b) => b.text() === "Week")!.element;
    expect(scroller.contains(weekBtn)).toBe(false);

    // The Today chip rides today's column in the header.
    const chip = w.findAll("span").find((s) => s.text() === "Today")!.element;
    expect(scroller.contains(chip)).toBe(false);

    // Two today lines: one in the header scale window, one in the body.
    const todayLines = w.findAll<HTMLElement>('[class*="border-l-2"]').map((el) => el.element);
    expect(todayLines.length).toBe(2);
    expect(todayLines.some((el) => !scroller.contains(el))).toBe(true);
  });

  it("does not duplicate the task column label in the header", () => {
    const w = mountGantt();
    const taskLabels = w.findAll("span").filter((s) => s.text() === "Task");
    expect(taskLabels.length).toBe(1);
  });

  it("propagates a non-default variant to the container, header hairline and toolbar", () => {
    const w = mountGantt({ variant: "glass" });
    const root = w.find("[data-gantt]").element as HTMLElement;
    expect(root.getAttribute("data-variant")).toBe("glass");

    // The header hairline follows the translucent surface divider. The
    // header is the strip directly above the body scroller (jsdom drops
    // unitless numeric styles, so don't rely on the height attribute).
    const header = w.find(".gantt-scroller").element.previousElementSibling as HTMLElement;
    expect(header.className).toContain(getSurfaceTextTokens("glass").divider.split(" ")[0]);

    // The toolbar pill follows the shared surface-variant chrome.
    const pill = w.find<HTMLElement>('[class*="pointer-events-auto"]').element;
    expect(pill.className).toContain(getSurfaceVariantClasses("glass", "neutral"));

    // Row hairlines follow the divider token — carried by the row's sticky
    // half, which owns the bottom border.
    const row = w.find<HTMLElement>("[data-row-key]").element;
    const rowSticky =
      row.querySelector<HTMLElement>(":scope > div.sticky") ?? (row.firstElementChild as HTMLElement);
    expect(rowSticky.className).toContain(getSurfaceTextTokens("glass").divider.split(" ")[0]);
  });
});
