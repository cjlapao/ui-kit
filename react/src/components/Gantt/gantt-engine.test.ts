import { describe, it, expect } from "vitest";
import {
  toMs,
  daysBetween,
  startOfWeek,
  computeViewRange,
  buildTimeScale,
  snapDate,
  getIsoWeekNumber,
  formatDuration,
  dateToX,
  xToDate,
  MS_PER_DAY,
} from "../../../../common/gantt/time";
import {
  buildRows,
  applyRowReorder,
  resolveDropBeforeId,
  rollupProgress,
} from "../../../../common/gantt/layout";
import {
  applyDragDates,
  commitDragEdit,
  linkPath,
  rubberLinkPath,
  computeLinkPaths,
  progressFromPointer,
  linkDistance,
  pickLinkAt,
  LINK_HIT_RADIUS,
  LINK_PASS_PADDING,
  computeLinkFanOffsets,
  fanSlotOffset,
} from "../../../../common/gantt/drag";
import { getGanttBarTokens, getGanttLaneTokens } from "../../../../common/gantt/tokens";
import {
  sampleGanttTasks,
  sampleGanttLinks,
  sampleGanttLanes,
} from "../../../../common/gantt/sample";
import type {
  GanttTask,
  GanttBarGeometry,
  GanttLink,
  GanttLinkPath,
} from "../../../../common/gantt/types";

// A Monday at *local* midnight — the engine's calendar math is local.
const MON = new Date(2026, 7, 24).getTime(); // 2026-08-24 is a Monday

describe("time engine", () => {
  it("normalises date inputs to epoch ms", () => {
    expect(toMs("2026-08-24T00:00:00Z")).toBe(toMs(new Date("2026-08-24T00:00:00Z")));
    expect(toMs(1234)).toBe(1234);
  });

  it("computes whole-day spans", () => {
    expect(daysBetween(MON, MON + 3 * MS_PER_DAY)).toBe(3);
  });

  it("aligns weeks to the configured weekday (Monday)", () => {
    // 2026-08-24 is a Monday; startOfWeek of a Wednesday should land on it.
    expect(startOfWeek(MON + 2 * MS_PER_DAY)).toBe(MON);
  });

  it("produces ISO week numbers", () => {
    // 2026-08-24 (Mon) belongs to ISO week 35 of 2026.
    expect(getIsoWeekNumber(MON)).toBe(35);
    // 2026-01-05 is the first Monday of the year → week 2 (W1 holds Jan 1, a Thursday).
    expect(getIsoWeekNumber(toMs("2026-01-05T00:00:00Z"))).toBe(2);
  });

  it("snaps to the configured unit", () => {
    const t = toMs("2026-08-24T15:30:00Z");
    expect(snapDate(t, "day")).toBe(startOfDay(t));
    expect(snapDate(t, "none")).toBe(t);
  });

  it("round-trips the date→x→date projection", () => {
    const x = dateToX(MON, MON - 7 * MS_PER_DAY, 16);
    expect(x).toBeCloseTo(7 * 16, 3);
    const back = xToDate(x, MON - 7 * MS_PER_DAY, 16);
    expect(back).toBeCloseTo(MON, 0);
  });

  it("computes a data-driven, zoom-independent view range", () => {
    const r = computeViewRange([MON], [MON + 10 * MS_PER_DAY]);
    expect(r.start).toBeLessThanOrEqual(MON - 7 * MS_PER_DAY);
    expect(r.end).toBeGreaterThanOrEqual(MON + 10 * MS_PER_DAY + 7 * MS_PER_DAY);
  });

  it("builds two header levels with calendar-true column widths", () => {
    const r = computeViewRange([MON], [MON + 40 * MS_PER_DAY]);
    // Week zoom → month (coarse) + week (fine).
    const scale = buildTimeScale(r.start, r.end, 16);
    expect(scale).toHaveLength(2);
    const [coarse, fine] = scale;
    expect(coarse.id).toBe("month");
    expect(fine.id).toBe("week");
    // Fine columns tile the range without gaps.
    const total = fine.columns.reduce((a, c) => a + c.width, 0);
    const expectWidth = ((r.end - r.start) / MS_PER_DAY) * 16;
    expect(total).toBeCloseTo(expectWidth, 0);
    // Inner week columns are exactly 7 days wide at 16px/day; the first and
    // last are clamped to the (non-week-aligned) range boundaries.
    for (const c of fine.columns.slice(1, -1)) {
      expect(c.width).toBeCloseTo(7 * 16, 0);
    }
  });

  it("picks day granularity at high zoom", () => {
    const r = computeViewRange([MON], [MON + 14 * MS_PER_DAY]);
    const scale = buildTimeScale(r.start, r.end, 48);
    expect(scale[scale.length - 1].id).toBe("day");
  });

  it("formats durations compactly", () => {
    expect(formatDuration(MON, MON + 2 * MS_PER_DAY + 8 * 3_600_000)).toBe("2d 8h");
    expect(formatDuration(MON, MON + 1 * MS_PER_DAY)).toBe("1d");
  });
});

// Local helper to avoid an import cycle with time's startOfDay export name.
function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

describe("layout engine", () => {
  const tasks = sampleGanttTasks(new Date("2026-08-30T12:00:00Z"));
  const { rows, tasksById } = buildRows(tasks, sampleGanttLanes, undefined, 44);

  it("flattens lanes + hierarchy into ordered rows with geometry", () => {
    expect(rows.length).toBeGreaterThan(10);
    // First row is the first lane header.
    expect(rows[0].key).toBe("lane:design");
    expect(rows[0].isGroup).toBe(true);
    expect(rows[0].top).toBe(0);
    // A nested child is indented (depth 1) and positioned after its parent.
    const visual = rows.find((r) => r.key === "task:visual");
    const visualTokens = rows.find((r) => r.key === "task:visual-tokens");
    expect(visual?.depth).toBe(0);
    expect(visualTokens?.depth).toBe(1);
    expect(visualTokens?.top).toBeGreaterThan(visual!.top);
  });

  it("computes duration-weighted roll-up progress for groups", () => {
    const visual = tasksById.get("visual")!;
    const children = new Map<string, GanttTask[]>([
      ["visual", tasks.filter((t) => t.parent === "visual")],
    ]);
    const p = rollupProgress(visual, tasksById, children);
    // tokens: 3d @ 1.0, flow: 4d @ 0.5 → (3 + 2) / 7 ≈ 0.7143
    expect(p).toBeCloseTo(5 / 7, 5);
  });

  it("collapses a lane to its header row when open === false", () => {
    const closedLanes = sampleGanttLanes.map((l) => (l.id === "eng" ? { ...l, open: false } : l));
    const { rows: collapsed } = buildRows(tasks, closedLanes, undefined, 44);
    const engRows = collapsed.filter((r) => r.lane?.id === "eng" || r.task?.lane === "eng");
    // Only the eng lane header remains.
    expect(engRows.filter((r) => r.task == null)).toHaveLength(1);
    expect(engRows.filter((r) => r.task != null)).toHaveLength(0);
  });

  it("reorders a top-level row within its lane", () => {
    // In the eng lane the input order is api, webapp, qa. Move webapp before api.
    const order = applyRowReorder(tasks, "webapp", "api", undefined);
    const engIdx = (id: string) => order.indexOf(id);
    expect(engIdx("webapp")).toBeLessThan(engIdx("api"));
    expect(engIdx("api")).toBeLessThan(engIdx("qa"));
  });

  it("no-ops a reorder onto itself or across lanes", () => {
    const before = applyRowReorder(tasks, "api", "api", undefined);
    expect(before).toEqual(applyRowReorder(tasks, "api", "api", undefined));
    // "docs" is in the launch lane; dropping "api" (eng) before it is a no-op.
    const cross = applyRowReorder(tasks, "api", "docs", undefined);
    const engOrder = cross.filter((id) => ["api", "webapp", "qa"].includes(id));
    expect(engOrder).toEqual(["api", "webapp", "qa"]);
  });

  it("resolves a drop target by pointer position within the lane segment", () => {
    // Dragging "webapp" (eng) to the upper half of "api"'s row → before "api".
    const apiRow = rows.find((r) => r.key === "task:api")!;
    const { beforeId } = resolveDropBeforeId(rows, tasksById, "task:webapp", apiRow.top + 5);
    expect(beforeId).toBe("api");
  });
});

describe("drag / interaction math", () => {
  it("moves a task, preserving duration, snapped to the unit", () => {
    const s = toMs("2026-01-01T08:00:00Z");
    const e = toMs("2026-01-05T08:00:00Z");
    const { start, end } = applyDragDates({ kind: "move", originStart: s, originEnd: e }, 64, 16, "day");
    // 64px @ 16px/day = 4 days → Jan 5 (snapped to day boundary).
    expect(start).toBe(toMs("2026-01-05T00:00:00Z"));
    expect(end - start).toBe(4 * MS_PER_DAY);
  });

  it("clamps a resize to the minimum duration", () => {
    const s = toMs("2026-01-01T00:00:00Z");
    const e = toMs("2026-01-02T00:00:00Z");
    const r = applyDragDates({ kind: "resize-start", originStart: s, originEnd: e }, 400, 16, "none");
    expect(r.end - r.start).toBe(3_600_000); // one-hour minimum
  });

  it("commits edits as ISO dates and short-circuits no-ops", () => {
    const t: GanttTask = { id: "a", name: "A", start: "2026-01-01T00:00:00Z", end: "2026-01-03T00:00:00Z" };
    const same = commitDragEdit(t, toMs(t.start), toMs(t.end));
    expect(same).toBe(t);
    const moved = commitDragEdit(t, toMs(t.start) + MS_PER_DAY, toMs(t.end) + MS_PER_DAY);
    expect(moved).not.toBe(t);
    expect(moved.start).not.toBe(t.start);
  });

  it("computes progress from the pointer within the bar", () => {
    expect(progressFromPointer(50, 0, 100)).toBeCloseTo(0.5, 2);
    expect(progressFromPointer(200, 0, 100)).toBe(1);
    expect(progressFromPointer(-20, 0, 100)).toBe(0);
  });

  it("routes a finish-to-start arrow into the target's left edge via a clear channel", () => {
    const from = { taskId: "a", left: 100, width: 80, top: 0, height: 44, milestone: false };
    const to = { taskId: "b", left: 220, width: 80, top: 88, height: 44, milestone: false };
    const { d, arrow, from: fp, to: tp } = linkPath(from, to, "fs");
    // Ports sit exactly on the bar edges: source RIGHT (100+80), target LEFT (220).
    expect(fp).toEqual({ x: 180, y: 22 });
    expect(tp).toEqual({ x: 220, y: 110 });
    // Departs the source right edge at the port, then routes through a vertical
    // channel in the gap between the two bars (x = midpoint of 180 and 220 = 200).
    expect(d.startsWith("M 184.5 22")).toBe(true);
    expect(d).toContain("200"); // the clear vertical channel between the bars
    expect(arrow).toBeDefined();
    // The arrowhead tip lands on the target's left edge.
    expect(arrow!.startsWith("220,110")).toBe(true);
  });

  it("routes a going-back (overlapping) link through the clear band into the target's left edge", () => {
    // Target starts before the source finishes: there is no horizontal gap, so
    // the connector steps out of the source row into the clear band (the row
    // boundary, where no bar is drawn), travels across it left of both bars,
    // and still enters the target's LEFT edge — it never crosses a bar and
    // never enters the "children" (right) side.
    const from = { taskId: "a", left: 100, width: 80, top: 0, height: 44, milestone: false }; // right = 180
    const to = { taskId: "b", left: 140, width: 80, top: 88, height: 44, milestone: false }; // left = 140
    const { d, arrow, to: tp } = linkPath(from, to, "fs");
    // Enters the target's LEFT edge (140), pointing right.
    expect(tp).toEqual({ x: 140, y: 110 });
    expect(arrow!.startsWith("140,110")).toBe(true);
    // Travels across the clear band at the source row's bottom boundary (y = 44),
    // hugging just left of the target's left edge (x = 140 - 11 = 129).
    expect(d).toContain("44"); // the clear row-boundary band
    expect(d).toContain("129"); // channel just left of the target's left edge
  });

  it("rubber previews the exact committed path when the pointer is over a target bar", () => {
    const source = { taskId: "a", left: 100, width: 80, top: 0, height: 44, milestone: false };
    const target = { taskId: "b", left: 220, width: 80, top: 88, height: 44, milestone: false };
    const snapped = rubberLinkPath(source, 230, 110, target);
    const committed = linkPath(source, target, "fs");
    // The preview is identical to the committed connector (same path + ports).
    expect(snapped.d).toBe(committed.d);
    expect(snapped.from).toEqual(committed.from);
    expect(snapped.to).toEqual(committed.to);
    expect(snapped.arrow).toBe(committed.arrow);
    // It routes in the clear channel (does not cross either bar).
    expect(snapped.d).toContain("200");
  });

  it("swings a link around the right of every bar when a bar blocks the gap", () => {
    // Source row 0 (right edge 180), target row 2 (left edge 240): a gap
    // exists, but the intermediate bar (row 1, spanning 150→270) fills it.
    // The route must swing out to the right of every bar in the corridor
    // (x = 320 + 6 = 326), drop to the target row's clear band (a row
    // boundary), travel back along it, and enter the target's left port.
    const from = { taskId: "a", left: 100, width: 80, top: 0, height: 44, milestone: false };
    const to = { taskId: "b", left: 240, width: 80, top: 88, height: 44, milestone: false };
    const obstacle = { taskId: "c", left: 150, width: 120, top: 44, height: 44, milestone: false };
    const { d, arrow } = linkPath(from, to, "fs", 0, 0, [obstacle]);
    expect(d).toContain("326"); // outside column: right of every bar in the corridor
    expect(d).toContain("235"); // the band travel stops 6px short of the drop corner (x = 229 + 6)
    expect(arrow!.startsWith("240,110")).toBe(true);
  });

  it("keeps the channel in a clear column when a bar blocks the gap middle", () => {
    // Gap (186, 294), midpoint 240 — blocked by the intermediate bar
    // (174→246 expanded). The channel slides to the nearest clear column
    // (246) instead of crossing the bar.
    const from = { taskId: "a", left: 100, width: 80, top: 0, height: 44, milestone: false };
    const to = { taskId: "b", left: 300, width: 80, top: 88, height: 44, milestone: false };
    const obstacle = { taskId: "c", left: 180, width: 60, top: 44, height: 44, milestone: false };
    const { d } = linkPath(from, to, "fs", 0, 0, [obstacle]);
    expect(d).toContain("246"); // clear column hugging the blocking bar's right edge
  });

  it("steps a going-back link left of a blocking bar when the tight slot is taken", () => {
    // Tight slot (x = 129) is blocked by the intermediate bar (104→176
    // expanded); the drop column steps to the nearest clear one (x = 104).
    const from = { taskId: "a", left: 100, width: 80, top: 0, height: 44, milestone: false };
    const to = { taskId: "b", left: 140, width: 80, top: 88, height: 44, milestone: false };
    const obstacle = { taskId: "c", left: 110, width: 60, top: 44, height: 44, milestone: false };
    const { d } = linkPath(from, to, "fs", 0, 0, [obstacle]);
    expect(d).toContain("104"); // clear column hugging the blocking bar's left edge
    expect(d).toContain("44"); // still travels the clear row-boundary band
  });

  it("keeps the dangling rubber band clear of intermediate bars", () => {
    const source = { taskId: "a", left: 100, width: 80, top: 0, height: 44, milestone: false };
    const obstacle = { taskId: "c", left: 200, width: 100, top: 44, height: 44, milestone: false };
    // Pointer (280, 110) sits in the blocking bar's column (194→306 expanded);
    // the preview descends in the nearest clear column (306) instead.
    const { d } = rubberLinkPath(source, 280, 110, undefined, [obstacle]);
    expect(d).toContain("306");
    expect(d.startsWith("M 184.5 22")).toBe(true);
    expect(d).not.toContain("L 280 22"); // the vertical run is not at the pointer x
  });

  it("rubber snapped preview matches the committed path, obstacles included", () => {
    const source = { taskId: "a", left: 100, width: 80, top: 0, height: 44, milestone: false };
    const target = { taskId: "b", left: 240, width: 80, top: 88, height: 44, milestone: false };
    const obstacle = { taskId: "c", left: 150, width: 120, top: 44, height: 44, milestone: false };
    const snapped = rubberLinkPath(source, 280, 110, target, [obstacle]);
    const committed = linkPath(source, target, "fs", 0, 0, [obstacle]);
    expect(snapped.d).toBe(committed.d);
    expect(snapped.arrow).toBe(committed.arrow);
    expect(committed.d).toContain("326"); // the detour is shared by both
  });

  it("rubber dangles to the pointer, routed clear of the source bar", () => {
    const source = { taskId: "a", left: 100, width: 80, top: 0, height: 44, milestone: false }; // right = 180
    // Dangling to the right: a simple out-and-over run that stays right of the source.
    const right = rubberLinkPath(source, 260, 60);
    expect(right.d.startsWith("M 184.5 22")).toBe(true);
    expect(right.arrow).toBeUndefined(); // no target → no arrowhead
    // Dangling to the left: steps into the clear band (row boundary y = 44) so
    // it never crosses the source bar.
    const left = rubberLinkPath(source, 40, 130);
    expect(left.d).toContain("44"); // the clear row-boundary band
    expect(left.arrow).toBeUndefined();
  });

  it("resolves links to draw-ready paths and skips dangling ones", () => {
    const tasks = sampleGanttTasks(new Date("2026-08-30T12:00:00Z"));
    const { tasksById } = buildRows(tasks, sampleGanttLanes);
    const bars = new Map(
      tasks.filter((t) => ["research", "wireframes"].includes(t.id)).map((t) => {
        const s = toMs(t.start);
        const left = dateToX(s, s - 7 * MS_PER_DAY, 16);
        return [t.id, { taskId: t.id, left, width: 80, top: 0, height: 44, milestone: false }];
      }),
    );
    const paths = computeLinkPaths(sampleGanttLinks(), bars, "blue");
    // Only the research→wireframes link has both bars present.
    expect(paths).toHaveLength(1);
    expect(paths[0].link.source).toBe("research");
    expect(tasksById.size).toBe(tasks.length);
  });

  it("aligns overlapping vertical channels into a shared column", () => {
    // Two "going back" links whose vertical drops overlap in y but would
    // naturally drop in different columns (each hugs the left of its own
    // target). The global alignment pass must slide both into one shared,
    // clear column so the two legs read as a single line.
    const bar = (
      taskId: string,
      left: number,
      width: number,
      top: number,
    ): GanttBarGeometry => ({ taskId, left, width, top, height: 44, milestone: false });
    const a0 = bar("a0", 250, 100, 0); // A source  (right edge 350)
    const b0 = bar("b0", 200, 90, 44); // B source  (right edge 290)
    const c = bar("c", 230, 80, 88); // obstacle in the way
    const b1 = bar("b1", 120, 80, 176); // B target (left edge 120)
    const a1 = bar("a1", 90, 220, 220); // A target  (left edge 90)
    const bars = new Map([a0, b0, c, b1, a1].map((g) => [g.taskId, g]));
    const links: GanttLink[] = [
      { source: "a0", target: "a1", type: "fs" },
      { source: "b0", target: "b1", type: "fs" },
    ];
    const paths = computeLinkPaths(links, bars, "blue");
    expect(paths).toHaveLength(2);

    // The x of the longest vertical run in a path = its drop column.
    const dropX = (d: string): number => {
      const pts: [number, number][] = [];
      const m = d.match(/^M\s*([\d.-]+)\s+([\d.-]+)/);
      if (m) pts.push([Number(m[1]), Number(m[2])]);
      for (const q of d.matchAll(/Q\s*([\d.-]+)\s+([\d.-]+)\s+[\d.-]+\s+[\d.-]+/g)) {
        pts.push([Number(q[1]), Number(q[2])]);
      }
      const nums = d.match(/-?\d+(\.\d+)?/g) ?? [];
      if (nums.length >= 2) pts.push([Number(nums[nums.length - 2]), Number(nums[nums.length - 1])]);
      let best = 0;
      let bestLen = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        if (pts[i][0] === pts[i + 1][0]) {
          const len = Math.abs(pts[i][1] - pts[i + 1][1]);
          if (len > 1 && len > bestLen) {
            bestLen = len;
            best = pts[i][0];
          }
        }
      }
      return best;
    };

    const xa = dropX(paths[0].d);
    const xb = dropX(paths[1].d);
    // Both drops land in the same clear column hugging A's target bar at the
    // passing padding (6px left of it), instead of the two different columns
    // (79 and 109) they'd pick alone.
    expect(xa).toBe(xb);
    expect(xa).toBe(84);
  });

  it("hugs the nearest passed bar at the passing padding when aligning a group", () => {
    // Two band drops share a corridor and both pass the middle bar `c`. Their
    // natural columns (49 and 54) put the group's mean (51.5) in a clear gap
    // — a mean-based placement would float there at an arbitrary margin. The
    // alignment must instead hug the nearest passed bar at exactly
    // LINK_PASS_PADDING: both drops land 6px left of A's target bar (left 60).
    const bar = (
      taskId: string,
      left: number,
      width: number,
      top: number,
    ): GanttBarGeometry => ({ taskId, left, width, top, height: 44, milestone: false });
    const a0 = bar("a0", 300, 100, 0); // A source (right edge 400)
    const b0 = bar("b0", 300, 100, 44); // B source (right edge 400)
    const c = bar("c", 100, 80, 88); // passed by both drops
    const a1 = bar("a1", 60, 200, 220); // A target (left edge 60)
    const b1 = bar("b1", 90, 200, 264); // B target (left edge 90)
    const bars = new Map([a0, b0, c, a1, b1].map((g) => [g.taskId, g]));
    const links: GanttLink[] = [
      { source: "a0", target: "a1", type: "fs" },
      { source: "b0", target: "b1", type: "fs" },
    ];
    const paths = computeLinkPaths(links, bars, "blue");
    expect(paths).toHaveLength(2);

    const dropX = (d: string): number => {
      const pts: [number, number][] = [];
      const m = d.match(/^M\s*([\d.-]+)\s+([\d.-]+)/);
      if (m) pts.push([Number(m[1]), Number(m[2])]);
      for (const q of d.matchAll(/Q\s*([\d.-]+)\s+([\d.-]+)\s+[\d.-]+\s+[\d.-]+/g)) {
        pts.push([Number(q[1]), Number(q[2])]);
      }
      const nums = d.match(/-?\d+(\.\d+)?/g) ?? [];
      if (nums.length >= 2) pts.push([Number(nums[nums.length - 2]), Number(nums[nums.length - 1])]);
      let best = 0;
      let bestLen = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        if (pts[i][0] === pts[i + 1][0]) {
          const len = Math.abs(pts[i][1] - pts[i + 1][1]);
          if (len > 1 && len > bestLen) {
            bestLen = len;
            best = pts[i][0];
          }
        }
      }
      return best;
    };

    const xa = dropX(paths[0].d);
    const xb = dropX(paths[1].d);
    // Shared column, at exactly the passing padding left of the nearest
    // passed bar's left edge — not the floating mean (51.5) between them.
    expect(xa).toBe(xb);
    expect(xa).toBe(a1.left - LINK_PASS_PADDING);
    expect(xa).not.toBeCloseTo(51.5, 1);
  });
});

describe("link fan slots (port distribution)", () => {
  const bar = (
    taskId: string,
    left: number,
    width: number,
    top: number,
  ): GanttBarGeometry => ({ taskId, left, width, top, height: 44, milestone: false });

  it("a single link stays centred on both edges", () => {
    const s = bar("s", 100, 80, 0);
    const t = bar("t", 250, 80, 44);
    const bars = new Map([s, t].map((g) => [g.taskId, g]));
    const fan = computeLinkFanOffsets([{ source: "s", target: "t" }], bars);
    expect(fan.bars.get("s")!.out).toEqual([0]);
    expect(fan.bars.get("t")!.inc).toEqual([0]);
    expect(fan.perLink).toEqual([{ src: 0, tgt: 0 }]);
  });

  it("two links sharing a source fan out ±8, ordered by the other endpoint's Y", () => {
    const s = bar("s", 100, 80, 0); // centre y 22
    const tUp = bar("tUp", 250, 80, 88); // centre y 110
    const tDown = bar("tDown", 250, 80, 176); // centre y 198
    const bars = new Map([s, tUp, tDown].map((g) => [g.taskId, g]));
    const links = [
      { source: "s", target: "tDown" }, // listed first, but the lower target
      { source: "s", target: "tUp" },
    ];
    const fan = computeLinkFanOffsets(links, bars);
    // bar height 44 → visual 24 → spacing min(16, (24-8)/(2-1)) = 16 → ±8.
    // Dense slots in slot order (top → bottom): tUp takes -8, tDown +8.
    expect(fan.bars.get("s")!.out).toEqual([-8, 8]);
    // Per-link: the listed-first link (lower target) gets the lower slot.
    expect(fan.perLink[0].src).toBe(8);
    expect(fan.perLink[1].src).toBe(-8);
    expect(fan.bars.get("tUp")!.inc).toEqual([0]);
    expect(fan.bars.get("tDown")!.inc).toEqual([0]);
  });

  it("three links clamp to the bar edge (−8, 0, +8)", () => {
    const s = bar("s", 100, 80, 0);
    const t1 = bar("t1", 250, 80, 88);
    const t2 = bar("t2", 250, 80, 132);
    const t3 = bar("t3", 250, 80, 176);
    const bars = new Map([s, t1, t2, t3].map((g) => [g.taskId, g]));
    const links = [
      { source: "s", target: "t1" },
      { source: "s", target: "t2" },
      { source: "s", target: "t3" },
    ];
    const fan = computeLinkFanOffsets(links, bars);
    // spacing min(16, (24-8)/(3-1)) = 8 → −8, 0, +8 (all within ±8).
    expect(fan.bars.get("s")!.out).toEqual([-8, 0, 8]);
  });

  it("computeLinkPaths routes shared-source links through the fan slots", () => {
    const s = bar("s", 100, 80, 0);
    const t1 = bar("t1", 250, 80, 88);
    const t2 = bar("t2", 250, 80, 176);
    const bars = new Map([s, t1, t2].map((g) => [g.taskId, g]));
    const links = [
      { source: "s", target: "t1" },
      { source: "s", target: "t2" },
    ];
    const paths = computeLinkPaths(links, bars, "blue");
    expect(paths).toHaveLength(2);
    // Port y's differ by the 16px fan spread (not stacked on one point).
    const dy = Math.abs(paths[0].from.y - paths[1].from.y);
    expect(dy).toBeCloseTo(16, 5);
    // The upper target departs from the upper port.
    const up = paths.find((p) => p.link.target === "t1")!;
    const down = paths.find((p) => p.link.target === "t2")!;
    expect(up.from.y).toBeLessThan(down.from.y);
  });

  it("fanSlotOffset picks the centre of the largest free gap", () => {
    // Empty side → bar centre.
    expect(fanSlotOffset(24, [])).toBe(0);
    // Two ports at ±8 → the largest free gap is the centre between them.
    expect(fanSlotOffset(24, [-8, 8])).toBe(0);
    // A single centred port → one of the two side gaps (±7 from centre).
    expect(Math.abs(fanSlotOffset(24, [0]))).toBeCloseTo(7, 5);
  });

  it("rubberLinkPath departs from the requested slot offset", () => {
    const s = bar("s", 100, 80, 0);
    const plain = rubberLinkPath(s, 400, 200);
    const offset = rubberLinkPath(s, 400, 200, undefined, [], 5);
    expect(offset.from.y).toBeCloseTo(plain.from.y + 5, 5);
  });
});

describe("pickLinkAt / linkDistance (hit radius)", () => {
  const mk = (id: string, points: [number, number][]): GanttLinkPath => ({
    link: { id, source: `${id}-s`, target: `${id}-t` },
    d: "M 0 0",
    points,
    from: { x: points[0][0], y: points[0][1] },
    to: { x: points[points.length - 1][0], y: points[points.length - 1][1] },
    type: "fs",
  });

  it("picks the nearest link when two connectors run close together", () => {
    const a = mk("a", [[0, 0], [100, 0]]);
    const b = mk("b", [[0, 4], [100, 4]]); // 4px below a
    // 1px from a, 3px from b → a wins.
    expect(pickLinkAt([a, b], 50, 1)?.link.id).toBe("a");
    // 3px from a, 1px from b → b wins (nearest, not first).
    expect(pickLinkAt([a, b], 50, 3)?.link.id).toBe("b");
  });

  it("breaks exact ties to the earlier link (deterministic)", () => {
    const a = mk("a", [[0, 0], [100, 0]]);
    const b = mk("b", [[0, 4], [100, 4]]);
    expect(pickLinkAt([a, b], 50, 2)?.link.id).toBe("a"); // 2px from both
  });

  it("returns null when the pointer is outside the hit radius", () => {
    const a = mk("a", [[0, 0], [100, 0]]);
    expect(pickLinkAt([a], 50, LINK_HIT_RADIUS + 0.5)).toBeNull();
    expect(pickLinkAt([a], 50, LINK_HIT_RADIUS - 0.5)?.link.id).toBe("a");
    // Honours a custom (tighter) radius.
    expect(pickLinkAt([a], 50, 3, 2)).toBeNull();
    expect(pickLinkAt([a], 50, 2, 2)?.link.id).toBe("a");
  });

  it("measures perpendicular distance to oblique and vertical legs", () => {
    const diag = mk("d", [[0, 0], [100, 100]]);
    // (50, 42) is 8/sqrt(2)≈5.66px off the diagonal → within radius 6.
    expect(pickLinkAt([diag], 50, 42)?.link.id).toBe("d");
    const vert = mk("v", [[50, 0], [50, 40]]);
    expect(pickLinkAt([vert], 53, 20)?.link.id).toBe("v"); // 3px right of the leg
    expect(pickLinkAt([vert], 58, 20)).toBeNull(); // 8px → outside
  });

  it("also hits near the route endpoints (port nodes)", () => {
    const a = mk("a", [[0, 0], [100, 0]]);
    expect(pickLinkAt([a], 4, 0)?.link.id).toBe("a"); // just past the start
    expect(pickLinkAt([a], 96, 0)?.link.id).toBe("a"); // just before the end
  });

  it("linkDistance is the min over all segments (Infinity for empty)", () => {
    expect(linkDistance([[0, 0], [10, 0], [10, 10]], 5, 3)).toBe(3);
    expect(linkDistance([], 5, 5)).toBe(Infinity);
  });

  it("computeLinkPaths exposes the raw route points for hit-testing", () => {
    const bars = new Map<string, GanttBarGeometry>([
      [
        "s",
        { taskId: "s", left: 100, width: 100, top: 44, height: 44, milestone: false },
      ],
      [
        "t",
        { taskId: "t", left: 250, width: 80, top: 132, height: 44, milestone: false },
      ],
    ]);
    const paths = computeLinkPaths(
      [{ id: "l", source: "s", target: "t" }],
      bars,
      "blue",
    );
    expect(paths).toHaveLength(1);
    expect(paths[0].points.length).toBeGreaterThanOrEqual(2);
    // The polyline departs from the source port and lands on the target port
    // (the endpoints sit at the port node's edge, i.e. within its radius).
    const [px0, py0] = paths[0].points[0];
    expect(Math.hypot(px0 - paths[0].from.x, py0 - paths[0].from.y)).toBeLessThanOrEqual(5);
    // …and stops at the arrowhead's base (the head covers the final 7px).
    const last = paths[0].points[paths[0].points.length - 1];
    expect(
      Math.hypot(last[0] - paths[0].to.x, last[1] - paths[0].to.y),
    ).toBeLessThanOrEqual(7);
  });
});

describe("tokens", () => {
  it("emits TrueColor-derived class maps (no hand hex)", () => {
    const bar = getGanttBarTokens("blue");
    expect(bar.fill).toBe("bg-blue-500");
    expect(bar.progress).toBe("bg-blue-700/70");
    const lane = getGanttLaneTokens("violet");
    expect(lane.band).toContain("bg-violet-50/70");
    expect(lane.band).toContain("dark:bg-violet-950/40");
  });
});
