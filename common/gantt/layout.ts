/**
 * Gantt row layout — pure. Flattens the task hierarchy into renderable rows,
 * attaches lanes, computes row geometry and roll-up progress.
 *
 * Row order rules (top to bottom):
 * 1. Tasks are grouped by `lane` (a task with no `lane` id goes to a
 *    synthetic "default" lane, rendered without a band when no explicit
 *    lanes were provided at all).
 * 2. Within a lane, top-level tasks keep their input order (or the explicit
 *    `rowOrder` when supplied); children are depth-first under their parent.
 * 3. A lane or task with `open: false` collapses to its header row only.
 */

import type { GanttLane, GanttRow, GanttTask } from "./types";
import { toMs } from "./time";

export const DEFAULT_ROW_HEIGHT = 44;
export const GROUP_ROW_HEIGHT = 40;

const MS_ONE_DAY = 86_400_000;

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

/** Roll-up of a task's descendants: duration-weighted, clamped to 0..1. */
export function rollupProgress(
  task: GanttTask,
  tasksById: Map<string, GanttTask>,
  childrenByParent: Map<string, GanttTask[]>,
): number {
  const children = childrenByParent.get(task.id) ?? [];
  if (children.length === 0) return clamp01(task.progress ?? 0);
  let totalMs = 0;
  let weighted = 0;
  for (const child of children) {
    const dur = Math.max(MS_ONE_DAY, toMs(child.end) - toMs(child.start));
    totalMs += dur;
    weighted += dur * rollupProgress(child, tasksById, childrenByParent);
  }
  return totalMs === 0 ? 0 : clamp01(weighted / totalMs);
}

/**
 * Duration-weighted progress over the lane that owns `taskId`, with
 * `override` (a preview edit of that task — the live dates of an in-flight
 * bar drag, or the live progress of a knob drag) substituted in place of
 * the task's committed values. This is what lets a lane header recompute
 * its roll-up in real time while one of its children is being edited.
 * Returns `null` when `taskId` is not in the list.
 */
export function laneRollupProgress(
  tasks: GanttTask[],
  taskId: string,
  override?: GanttTask,
): { laneId: string; progress: number } | null {
  const tasksById = new Map<string, GanttTask>(tasks.map((t) => [t.id, t]));
  const target = tasksById.get(taskId);
  if (!target) return null;
  const laneId = target.lane ?? "";
  const edited = override ? tasks.map((t) => (t.id === taskId ? override : t)) : tasks;
  const childrenByParent = new Map<string, GanttTask[]>();
  for (const t of edited) {
    if (t.parent != null && tasksById.has(t.parent)) {
      let list = childrenByParent.get(t.parent);
      if (!list) {
        list = [];
        childrenByParent.set(t.parent, list);
      }
      list.push(t);
    }
  }
  const top = edited.filter(
    (t) => (t.parent == null || !tasksById.has(t.parent)) && (t.lane ?? "") === laneId,
  );
  return { laneId, progress: rollupLaneProgress(top, childrenByParent) };
}

/**
 * Build the row model.
 *
 * @param tasks    The task list (parents may precede or follow children).
 * @param lanes    Optional lane (swimlane) definitions; explicit lanes render
 *                 even when empty (an empty band).
 * @param rowOrder Optional explicit top-level order (task ids, per lane, in
 *                 lane order). Ids not listed keep their input order and
 *                 sort after the listed ones within their lane.
 * @param rowHeight Row height in px.
 */
export function buildRows(
  tasks: GanttTask[],
  lanes?: GanttLane[],
  rowOrder?: string[],
  rowHeight: number = DEFAULT_ROW_HEIGHT,
): {
  rows: GanttRow[];
  tasksById: Map<string, GanttTask>;
  laneById: Map<string, GanttLane>;
  laneOrder: string[];
} {
  const tasksById = new Map<string, GanttTask>(tasks.map((t) => [t.id, t]));

  // Children index — a task whose parent id is unknown degrades to top level.
  const childrenByParent = new Map<string, GanttTask[]>();
  for (const t of tasks) {
    if (t.parent != null && tasksById.has(t.parent)) {
      let list = childrenByParent.get(t.parent);
      if (!list) {
        list = [];
        childrenByParent.set(t.parent, list);
      }
      list.push(t);
    }
  }

  // Lane specs: explicit lanes first, then lanes discovered from tasks.
  const laneSpecs = new Map<string, GanttLane>();
  const laneOrder: string[] = [];
  for (const lane of lanes ?? []) {
    laneSpecs.set(lane.id, lane);
    laneOrder.push(lane.id);
  }
  for (const t of tasks) {
    if (t.lane != null && !laneSpecs.has(t.lane)) {
      laneSpecs.set(t.lane, { id: t.lane, label: t.lane });
      laneOrder.push(t.lane);
    }
  }
  const hasUnassigned = tasks.some((t) => t.lane == null);
  const laneSpecsAll = laneOrder.length > 0 || hasUnassigned;

  // Top-level tasks grouped by lane ("" = unassigned).
  const laneTasks = new Map<string, GanttTask[]>();
  for (const t of tasks) {
    if (t.parent != null && tasksById.has(t.parent)) continue;
    const laneId = t.lane ?? "";
    let list = laneTasks.get(laneId);
    if (!list) {
      list = [];
      laneTasks.set(laneId, list);
    }
    list.push(t);
  }

  // Apply the explicit row order (top-level ids, per lane).
  const orderIndex = new Map<string, number>((rowOrder ?? []).map((id, i) => [id, i]));
  for (const list of laneTasks.values()) {
    list.sort((a, b) => {
      const ia = orderIndex.has(a.id) ? orderIndex.get(a.id)! : Number.MAX_SAFE_INTEGER;
      const ib = orderIndex.has(b.id) ? orderIndex.get(b.id)! : Number.MAX_SAFE_INTEGER;
      return ia - ib;
    });
  }

  const rows: GanttRow[] = [];
  let cursor = 0;

  const pushTaskRow = (task: GanttTask, depth: number, lane?: GanttLane) => {
    const isGroup = task.type === "project" || (childrenByParent.get(task.id) ?? []).length > 0;
    const row: GanttRow = {
      key: `task:${task.id}`,
      task,
      lane,
      isGroup,
      depth,
      childCount: (childrenByParent.get(task.id) ?? []).length,
      height: rowHeight,
      top: cursor,
    };
    if (isGroup) row.progress = rollupProgress(task, tasksById, childrenByParent);
    rows.push(row);
    cursor += rowHeight;
    if (task.open !== false) {
      for (const child of childrenByParent.get(task.id) ?? []) {
        pushTaskRow(child, depth + 1, lane);
      }
    }
  };

  const pushLaneHeader = (lane: GanttLane, list: GanttTask[]) => {
    const header: GanttRow = {
      key: `lane:${lane.id}`,
      lane,
      isGroup: true,
      depth: 0,
      childCount: list.length,
      height: GROUP_ROW_HEIGHT,
      top: cursor,
      progress: rollupLaneProgress(list, childrenByParent),
    };
    rows.push(header);
    cursor += GROUP_ROW_HEIGHT;
  };

  // Render explicit lanes in order; the unassigned lane renders after them
  // when both are present (no header band when no explicit lanes exist).
  const renderLane = (laneId: string) => {
    const list = laneTasks.get(laneId) ?? [];
    const lane = laneSpecs.get(laneId);
    if (laneId === "") {
      if (laneOrder.length > 0) {
        pushLaneHeader({ id: "", label: "General" }, list);
        for (const task of list) pushTaskRow(task, 0, { id: "", label: "General" });
      } else {
        for (const task of list) pushTaskRow(task, 0);
      }
      return;
    }
    if (!lane) return;
    pushLaneHeader(lane, list);
    if (lane.open === false) return; // collapsed: header row only
    for (const task of list) pushTaskRow(task, 0, lane);
  };

  if (laneSpecsAll) {
    for (const laneId of laneOrder) renderLane(laneId);
    if (hasUnassigned) renderLane("");
  }

  return { rows, tasksById, laneById: laneSpecs, laneOrder };
}

/** Duration-weighted progress over a lane's top-level subtrees. */
function rollupLaneProgress(
  topTasks: GanttTask[],
  childrenByParent: Map<string, GanttTask[]>,
): number {
  let total = 0;
  let weighted = 0;
  const visit = (task: GanttTask) => {
    const kids = childrenByParent.get(task.id) ?? [];
    if (kids.length === 0) {
      const dur = Math.max(MS_ONE_DAY, toMs(task.end) - toMs(task.start));
      total += dur;
      weighted += dur * (task.progress ?? 0);
    } else {
      for (const k of kids) visit(k);
    }
  };
  for (const t of topTasks) visit(t);
  return total === 0 ? 0 : clamp01(weighted / total);
}

/**
 * Apply a vertical reorder within one lane: move top-level task `dragId` so
 * it sits just before `beforeId` (or at the lane's end when `beforeId` is
 * null). Returns the new per-lane top-level id order for `buildRows`.
 * Reordering across lanes is out of scope in v1 — both ids must share a lane.
 */
export function applyRowReorder(
  tasks: GanttTask[],
  dragId: string,
  beforeId: string | null,
  currentOrder?: string[],
): string[] {
  const tasksById = new Map(tasks.map((t) => [t.id, t]));
  const laneOf = (id: string): string => tasksById.get(id)?.lane ?? "";

  const topLevel = tasks.filter(
    (t) => t.parent == null || !tasksById.has(t.parent),
  );

  // Per-lane top-level order, from the current order (or input order).
  const seen = new Set<string>();
  const laneLists = new Map<string, string[]>();
  for (const id of currentOrder ?? topLevel.map((t) => t.id)) {
    if (!tasksById.has(id)) continue;
    if (t_isTopLevel(id, tasksById)) {
      const lane = laneOf(id);
      let list = laneLists.get(lane);
      if (!list) {
        list = [];
        laneLists.set(lane, list);
      }
      list.push(id);
      seen.add(id);
    }
  }
  for (const t of topLevel) {
    if (seen.has(t.id)) continue;
    const lane = laneOf(t.id);
    let list = laneLists.get(lane);
    if (!list) {
      list = [];
      laneLists.set(lane, list);
    }
    list.push(t.id);
  }

  const unchanged = () => currentOrder ?? topLevel.map((t) => t.id);
  const dragLane = laneOf(dragId);
  const dragList = laneLists.get(dragLane);
  if (!dragList) return unchanged();

  const from = dragList.indexOf(dragId);
  if (from === -1) return unchanged();

  if (beforeId === dragId) return unchanged(); // dropped on itself
  if (beforeId != null && laneOf(beforeId) !== dragLane) {
    // Different lane — no-op (v1 keeps rows in their lane).
    return unchanged();
  }

  dragList.splice(from, 1);
  let to = dragList.length;
  if (beforeId != null) {
    const idx = dragList.indexOf(beforeId);
    to = idx === -1 ? dragList.length : idx;
  }
  dragList.splice(to, 0, dragId);

  // Re-emit in the original lane sequence.
  const lanes = new Set(topLevel.map((t) => laneOf(t.id)));
  const out: string[] = [];
  for (const lane of lanes) out.push(...(laneLists.get(lane) ?? []));
  return out;
}

function t_isTopLevel(id: string, tasksById: Map<string, GanttTask>): boolean {
  const t = tasksById.get(id);
  return t != null && (t.parent == null || !tasksById.has(t.parent));
}

/**
 * Resolve where a row being dragged vertically lands. `pointerY` is in the
 * row area's pixel space. Returns the top-level task id to insert *before*
 * (null = end of the dragged task's lane), constrained to the dragged row's
 * lane so cross-lane drops are ignored.
 *
 * Dropping on the lower half of a row means "after it"; on the upper half,
 * "before it". Dropping on a child row targets its top-level ancestor — the
 * thing the `rowOrder` list actually addresses.
 */
export function resolveDropBeforeId(
  rows: GanttRow[],
  tasksById: Map<string, GanttTask>,
  dragKey: string,
  pointerY: number,
): { beforeId: string | null } {
  const dragRow = rows.find((r) => r.key === dragKey);
  if (!dragRow?.task) return { beforeId: null };
  const dragLane = dragRow.task.lane ?? "";
  const dragAncestor = topAncestorId(dragRow, tasksById);

  // The dragged lane's row segment: from its own header (or the top) to the
  // next foreign lane header. Only rows inside the segment are candidates.
  const laneHeaderKey = `lane:${dragLane}`;
  let segStart = 0;
  let segEnd = rows.length;
  if (dragLane !== "") {
    // The header always exists for a named lane (buildRows materialises a
    // spec for any lane a task references), so the segment is well-defined.
    const headerIdx = rows.findIndex((r) => r.key === laneHeaderKey);
    if (headerIdx !== -1) {
      segStart = headerIdx;
      for (let i = headerIdx + 1; i < rows.length; i++) {
        const r = rows[i];
        if (r.task == null && r.lane != null && r.lane.id !== dragLane) {
          segEnd = i;
          break;
        }
      }
    }
  }

  for (let i = segStart; i < segEnd; i++) {
    const r = rows[i];
    if (r.key === dragKey || r.key === laneHeaderKey) continue;
    const mid = r.top + r.height / 2;
    if (pointerY < mid) {
      const ancestor = r.task ? topAncestorId(r, tasksById) : null;
      if (ancestor == null || ancestor === dragAncestor) continue; // self/descendant
      return { beforeId: ancestor };
    }
  }
  return { beforeId: null };
}

/** The top-level ancestor task id of a row (the row's task when top level). */
export function topAncestorId(
  row: GanttRow,
  tasksById: Map<string, GanttTask>,
): string | null {
  if (row.task == null) return null;
  let t = row.task;
  const seen = new Set<string>([t.id]);
  while (t.parent != null) {
    const parent = tasksById.get(t.parent);
    if (!parent || seen.has(parent.id)) break;
    seen.add(parent.id);
    t = parent;
  }
  return t.id;
}
