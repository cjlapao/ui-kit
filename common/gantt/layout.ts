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

/** Children index — a task whose parent id is unknown degrades to top level. */
function childrenIndex(tasks: GanttTask[]): Map<string, GanttTask[]> {
  const byId = new Map<string, GanttTask>(tasks.map((t) => [t.id, t]));
  const childrenByParent = new Map<string, GanttTask[]>();
  for (const t of tasks) {
    if (t.parent != null && byId.has(t.parent)) {
      let list = childrenByParent.get(t.parent);
      if (!list) {
        list = [];
        childrenByParent.set(t.parent, list);
      }
      list.push(t);
    }
  }
  return childrenByParent;
}

/**
 * Roll-up of the task identified by `taskId`: its own progress for a leaf,
 * the duration-weighted roll-up of its descendants for a group (the value a
 * group row displays — groups have no progress of their own). `override` is
 * a preview edit of *any* task (usually the dragged child — live dates or
 * live progress) substituted in place of that task's committed values before
 * the roll-up is computed, which is what makes a group's percentage follow
 * its child in real time while the child is being edited.
 * Returns `null` when `taskId` is not in the list.
 */
export function taskRollupProgress(
  tasks: GanttTask[],
  taskId: string,
  override?: GanttTask,
): number | null {
  const tasksById = new Map<string, GanttTask>(tasks.map((t) => [t.id, t]));
  if (!tasksById.has(taskId)) return null;
  const edited = override
    ? tasks.map((t) => (t.id === override.id ? override : t))
    : tasks;
  return rollupProgress(edited.find((t) => t.id === taskId)!, new Map(), childrenIndex(edited));
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
  const edited = override
    ? tasks.map((t) => (t.id === override.id ? override : t))
    : tasks;
  const childrenByParent = childrenIndex(edited);
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
  const childrenByParent = childrenIndex(tasks);

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
 * Y (px, body-relative) of the reorder insertion indicator for the given
 * displayed row order: the top edge of the row the dragged row is being
 * inserted before, or — for an end drop — the bottom of the scope block
 * (the parent's visible block for a child drag, the lane segment for a
 * top-level drag). Pass the *previewed* row order while a live reorder is
 * in flight so the indicator tracks the slot the dragged row currently
 * occupies. Returns `null` when the dragged row can't be found.
 */
export function reorderPreviewTop(
  rows: GanttRow[],
  dragKey: string,
  beforeId: string | null,
): number | null {
  const dragRow = rows.find((r) => r.key === dragKey);
  if (!dragRow) return null;
  if (beforeId != null) {
    const target = rows.find((r) => r.key === `task:${beforeId}`);
    if (target) return target.top;
  }
  // End drop: the bottom of the scope block the dragged row moves within.
  // A child drag scopes to its parent's visible block (end of the sibling
  // list); a top-level drag scopes to the lane segment (the first row of a
  // foreign lane — segments are contiguous — or the bottom of the body).
  const byId = new Map<string, GanttTask>();
  for (const r of rows) if (r.task) byId.set(r.task.id, r.task);
  const scopeRoot =
    dragRow.task?.parent != null && byId.has(dragRow.task.parent)
      ? byId.get(dragRow.task.parent)!
      : null;
  if (scopeRoot) {
    const parentIdx = rows.findIndex((r) => r.key === `task:${scopeRoot.id}`);
    if (parentIdx !== -1) {
      let bottom = rows[parentIdx].top + rows[parentIdx].height;
      for (let i = parentIdx + 1; i < rows.length; i++) {
        const r = rows[i];
        if (r.task == null || !inSubtree(r.task, scopeRoot.id, byId)) break;
        bottom = r.top + r.height;
      }
      return bottom;
    }
  }
  const dragLane = dragRow.task?.lane ?? dragRow.lane?.id ?? "";
  for (let i = rows.indexOf(dragRow) + 1; i < rows.length; i++) {
    const r = rows[i];
    const rLane = r.task ? (r.task.lane ?? "") : (r.lane?.id ?? "");
    if (rLane !== dragLane) return r.top;
  }
  return rows.reduce((sum, r) => sum + r.height, 0);
}

/**
 * Apply a reorder drop to the dataset.
 *
 * - Top-level drag (`dragId` has no parent): `order` is the new per-lane
 *   top-level id order for `buildRows`; `tasks` is the input array.
 * - Child drag (`dragId` has a parent): the row moves among its *siblings*
 *   (same parent). The top-level `order` is unchanged; `tasks` is a new flat
 *   array with the dragged task repositioned relative to its siblings
 *   (sibling order is the tasks-array order).
 *
 * `beforeId` is the top-level / sibling task id to insert before, or `null`
 * for the end of the lane / sibling list. Returns the input references
 * unchanged when the drop is a no-op (onto itself, across parents or lanes,
 * or landing where the row already is).
 */
export interface RowReorderResult {
  /** Per-lane top-level id order for `buildRows` (unchanged for child drags). */
  order: string[];
  /** Flat tasks array with the child-level move applied (the input array for
   *  top-level drags and no-ops). */
  tasks: GanttTask[];
}

export function applyRowReorder(
  tasks: GanttTask[],
  dragId: string,
  beforeId: string | null,
  currentOrder?: string[],
): RowReorderResult {
  const tasksById = new Map<string, GanttTask>(tasks.map((t) => [t.id, t]));
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

  // Re-emit in the original lane sequence.
  const unchangedOrder = (): string[] => {
    const out: string[] = [];
    const lanes = new Set(topLevel.map((t) => laneOf(t.id)));
    for (const lane of lanes) out.push(...(laneLists.get(lane) ?? []));
    return out;
  };

  const dragTask = tasksById.get(dragId);
  if (!dragTask) return { order: unchangedOrder(), tasks };

  // ── Child level: move among the siblings of the same parent ─────────────
  if (dragTask.parent != null && tasksById.has(dragTask.parent)) {
    const parentId = dragTask.parent;
    const target = beforeId != null ? tasksById.get(beforeId) : null;
    if (beforeId === dragId) return { order: unchangedOrder(), tasks }; // onto itself
    if (
      beforeId != null &&
      (!target || target.parent !== parentId)
    ) {
      // Cross-parent (or unknown target) — no-op: v1 keeps children in
      // their group.
      return { order: unchangedOrder(), tasks };
    }
    const cur = tasks.filter((t) => t.parent === parentId).map((t) => t.id);
    const from = cur.indexOf(dragId);
    if (from === -1) return { order: unchangedOrder(), tasks };
    const next = cur.filter((id) => id !== dragId);
    let to = next.length; // `null` → end of the sibling list
    if (beforeId != null) {
      const idx = next.indexOf(beforeId);
      to = idx === -1 ? next.length : idx;
    }
    next.splice(to, 0, dragId);
    if (next.every((id, i) => id === cur[i])) {
      return { order: unchangedOrder(), tasks }; // lands where it already is
    }
    // Rebuild the flat array: the drag task sits just before its target
    // sibling (or is appended) so the tasks-array order — the sibling order
    // — reflects the drop.
    const out: GanttTask[] = [];
    let placed = false;
    for (const t of tasks) {
      if (t.id === dragId) continue;
      if (!placed && beforeId != null && t.id === beforeId) {
        out.push(dragTask);
        placed = true;
      }
      out.push(t);
    }
    if (!placed) out.push(dragTask);
    return { order: unchangedOrder(), tasks: out };
  }

  // ── Top level: reorder within the dragged lane ───────────────────────────
  const dragLane = laneOf(dragId);
  const dragList = laneLists.get(dragLane);
  if (!dragList) return { order: unchangedOrder(), tasks };

  const from = dragList.indexOf(dragId);
  if (from === -1) return { order: unchangedOrder(), tasks };

  if (beforeId === dragId) return { order: unchangedOrder(), tasks }; // dropped on itself
  if (beforeId != null && laneOf(beforeId) !== dragLane) {
    // Different lane — no-op (v1 keeps rows in their lane).
    return { order: unchangedOrder(), tasks };
  }

  dragList.splice(from, 1);
  let to = dragList.length;
  if (beforeId != null) {
    const idx = dragList.indexOf(beforeId);
    to = idx === -1 ? dragList.length : idx;
  }
  dragList.splice(to, 0, dragId);

  return { order: unchangedOrder(), tasks };
}

function t_isTopLevel(id: string, tasksById: Map<string, GanttTask>): boolean {
  const t = tasksById.get(id);
  return t != null && (t.parent == null || !tasksById.has(t.parent));
}

/**
 * Resolve the reorder drop target for a live pointer position (`pointerY`
 * in the row area's pixel space) — the same before/after system
 * SmartGridLayout uses, evaluated against *blocks*: a row and its visible
 * descendants form one unit, because a top-level drag can only address
 * top-level rows and a child drag can only address its siblings.
 *
 * - Top-level drag: the candidate blocks are the other top-level subtrees
 *   of the dragged lane.
 * - Child drag: the candidate blocks are the sibling subtrees (same
 *   parent).
 *
 * The pointer decides at the *block's* midpoint:
 * - Above the midpoint → insert before the block.
 * - Below the midpoint → insert after the block (i.e. before the next
 *   block; `null` = end of the lane / sibling list).
 * - Over the object being dragged (the dragged subtree's band) → the
 *   previous target is kept. This is also the press itself: nothing shifts
 *   until the pointer crosses into a neighbouring block, and the shift
 *   happens once it has passed that block's midpoint — never "almost over
 *   the second item".
 * - Above the first block (the lane header band) → top of the lane; below
 *   the last block → end of the lane.
 *
 * `currentBeforeId` is `undefined` before the first decision (right after
 * the press) — no preview until the pointer commits. Because resolution
 * runs against the *live preview* rows, a committed move parks the pointer
 * over the dragged object's new band, where the target is kept — a stable
 * fixed point, no oscillation.
 */
export function resolveDropBeforeId(
  rows: GanttRow[],
  tasksById: Map<string, GanttTask>,
  dragKey: string,
  pointerY: number,
  currentBeforeId?: string | null,
): { beforeId: string | null | undefined } {
  const dragRow = rows.find((r) => r.key === dragKey);
  if (!dragRow?.task) return { beforeId: currentBeforeId };
  const dragTask = dragRow.task;

  // The dragged subtree: the drag task and all of its descendants (hidden
  // ones included — they can't render anyway).
  const childrenMap = new Map<string, string[]>();
  for (const t of tasksById.values()) {
    if (t.parent != null && tasksById.has(t.parent)) {
      let list = childrenMap.get(t.parent);
      if (!list) {
        list = [];
        childrenMap.set(t.parent, list);
      }
      list.push(t.id);
    }
  }
  const dragSubtree = new Set<string>([dragTask.id]);
  {
    const stack = [dragTask.id];
    while (stack.length > 0) {
      const id = stack.pop()!;
      for (const child of childrenMap.get(id) ?? []) {
        if (!dragSubtree.has(child)) {
          dragSubtree.add(child);
          stack.push(child);
        }
      }
    }
  }
  const isChild = dragTask.parent != null && tasksById.has(dragTask.parent);

  // The dragged lane's row segment (top-level drags only): from its own
  // header (or the top) to the next foreign lane header.
  let segStart = 0;
  let segEnd = rows.length;
  if (!isChild && dragTask.lane != null) {
    const headerIdx = rows.findIndex((r) => r.key === `lane:${dragTask.lane}`);
    if (headerIdx !== -1) {
      segStart = headerIdx;
      for (let i = headerIdx + 1; i < rows.length; i++) {
        const r = rows[i];
        if (r.task == null && r.lane != null && r.lane.id !== dragTask.lane) {
          segEnd = i;
          break;
        }
      }
    }
  }

  // Candidate blocks in visual order. A block starts at its root row (a
  // top-level task row for top-level drags, a sibling row for child drags)
  // and spans its visible descendants.
  const blocks: { top: number; bottom: number; target: string }[] = [];
  for (let i = segStart; i < segEnd; i++) {
    const r = rows[i];
    if (r.task == null || dragSubtree.has(r.task.id)) continue;
    const isCandidateRoot = isChild
      ? r.task.parent === dragTask.parent
      : r.task.parent == null || !tasksById.has(r.task.parent);
    if (!isCandidateRoot) continue; // a descendant row: part of its root's block
    let j = i;
    while (j + 1 < segEnd) {
      const n = rows[j + 1];
      if (n.task == null || !inSubtree(n.task, r.task.id, tasksById)) break;
      j++;
    }
    blocks.push({ top: r.top, bottom: rows[j].top + rows[j].height, target: r.task.id });
    i = j;
  }
  if (blocks.length === 0) return { beforeId: currentBeforeId };

  // The dragged object's band (its visible subtree, contiguous in the live
  // model): the pointer over the object never changes the target.
  let dragBottom = dragRow.top + dragRow.height;
  for (let i = rows.indexOf(dragRow) + 1; i < rows.length; i++) {
    const r = rows[i];
    if (r.task == null || !dragSubtree.has(r.task.id)) break;
    dragBottom = r.top + r.height;
  }
  if (pointerY >= dragRow.top && pointerY < dragBottom) {
    return { beforeId: currentBeforeId };
  }

  const first = blocks[0];
  const last = blocks[blocks.length - 1];
  // Above the first block (the lane header band, or above the siblings for a
  // child drag) → top of the lane / first sibling.
  if (pointerY < first.top) return { beforeId: first.target };
  // Below the last block → end of the lane / sibling list.
  if (pointerY >= last.bottom) return { beforeId: null };

  for (let bi = 0; bi < blocks.length; bi++) {
    const b = blocks[bi];
    if (pointerY >= b.top && pointerY < b.bottom) {
      const mid = b.top + (b.bottom - b.top) / 2;
      if (pointerY < mid) return { beforeId: b.target }; // before the block
      return { beforeId: blocks[bi + 1]?.target ?? null }; // after the block
    }
  }
  return { beforeId: currentBeforeId };
}

/** True when `task` is `rootId` itself or a descendant of it. */
function inSubtree(
  task: GanttTask,
  rootId: string,
  tasksById: Map<string, GanttTask>,
): boolean {
  let t: GanttTask | undefined = task;
  const seen = new Set<string>();
  while (t) {
    if (t.id === rootId) return true;
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    t = t.parent != null ? tasksById.get(t.parent) : undefined;
  }
  return false;
}

/**
 * The visible object being dragged for a reorder: the dragged row plus its
 * visible descendant rows (contiguous in the live model — a single row for
 * a leaf, the whole expanded block for an open group). `null` when the drag
 * row can't be found. Used for the dashed ghost slot (its total height) and
 * the floating clone (its stacked rows).
 */
export function reorderDragSubtree(
  rows: GanttRow[],
  dragKey: string,
): GanttRow[] | null {
  const idx = rows.findIndex((r) => r.key === dragKey);
  if (idx === -1) return null;
  const dragRow = rows[idx];
  if (!dragRow.task) return null;
  const byId = new Map<string, GanttTask>();
  for (const r of rows) if (r.task) byId.set(r.task.id, r.task);
  const out = [dragRow];
  for (let i = idx + 1; i < rows.length; i++) {
    const r = rows[i];
    if (r.task == null || !inSubtree(r.task, dragRow.task.id, byId)) break;
    out.push(r);
  }
  return out;
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
