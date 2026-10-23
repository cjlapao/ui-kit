/**
 * useTaskBoardColumnDrag — reorder columns by their grip (edit mode only).
 *
 * The card drag turned on its side: past a 4px threshold the column lifts
 * into a floating header clone, its slot stays in the row as a dashed
 * placeholder, and the order re-derives live (`moveColumn`) so the other
 * columns slide while you move. A column swaps the moment the pointer enters
 * a neighbour ahead in the direction of travel (`resolveColumnSwapIndex`,
 * mirrored in RTL). On the keyboard the
 * grip is the handle: Space picks up, arrows move one slot, Space drops,
 * Escape or Tab cancels — each step announced.
 */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { moveColumn, resolveColumnSwapIndex, type TaskBoardColumn } from "../../../../common/taskboard";
import type { TaskBoardText } from "./labels";

const DRAG_THRESHOLD_PX = 4;

export interface TaskBoardColumnDragState {
  id: string;
  from: number;
  to: number;
  x: number;
  y: number;
  grabOffset: { x: number; y: number };
  width: number;
  /** The column's height at grab — the clone is drawn at the same size. */
  height: number;
  keyboard?: boolean;
}

export interface UseTaskBoardColumnDragOptions {
  rootRef: React.RefObject<HTMLElement | null>;
  columns: TaskBoardColumn[];
  enabled: boolean;
  text: TaskBoardText;
  announce: (message: string) => void;
  onCommit: (next: TaskBoardColumn[]) => void;
}

const isRtl = (el: Element | null) => el?.closest("[dir]")?.getAttribute("dir") === "rtl";

export function useTaskBoardColumnDrag(opts: UseTaskBoardColumnDragOptions) {
  const [drag, setDrag] = useState<TaskBoardColumnDragState | null>(null);
  const optsRef = useRef(opts);
  optsRef.current = opts;
  const dragRef = useRef<TaskBoardColumnDragState | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const userSelectRef = useRef<string | null>(null);
  const refocusRef = useRef<string | null>(null);

  const set = useCallback((next: TaskBoardColumnDragState | null) => {
    dragRef.current = next;
    setDrag(next);
  }, []);

  const end = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (userSelectRef.current !== null) {
      document.body.style.userSelect = userSelectRef.current;
      userSelectRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    end();
    set(null);
  }, [end, set]);

  const commit = useCallback(() => {
    const d = dragRef.current;
    end();
    set(null);
    if (!d || d.to === d.from) return false;
    optsRef.current.onCommit(moveColumn(optsRef.current.columns, d.id, d.to));
    return true;
  }, [end, set]);

  // The grip re-mounts in a new place after a keyboard step — keep focus on it.
  useLayoutEffect(() => {
    const id = refocusRef.current;
    if (!id) return;
    refocusRef.current = null;
    opts.rootRef.current?.querySelector<HTMLElement>(`[data-column-grip="${CSS.escape(id)}"]`)?.focus();
  });

  useEffect(() => () => end(), [end]);

  const startPointer = useCallback(
    (column: TaskBoardColumn, from: number, e: React.PointerEvent<HTMLElement>) => {
      if (!optsRef.current.enabled || e.button !== 0) return;
      e.preventDefault();
      end();
      const target = e.currentTarget.closest("[data-column-target]") ?? e.currentTarget;
      const rect = target.getBoundingClientRect();
      const press = { x: e.clientX, y: e.clientY };
      const grabOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      let lastX = e.clientX;

      const onMove = (ev: PointerEvent) => {
        const { clientX: x, clientY: y } = ev;
        let d = dragRef.current;
        if (!d) {
          if (Math.hypot(x - press.x, y - press.y) < DRAG_THRESHOLD_PX) return;
          if (userSelectRef.current === null) {
            userSelectRef.current = document.body.style.userSelect;
            document.body.style.userSelect = "none";
          }
          d = { id: column.id, from, to: from, x, y, grabOffset, width: rect.width, height: rect.height };
        }
        const dx = Math.sign(x - lastX);
        lastX = x;
        const root = optsRef.current.rootRef.current;
        const rects = root
          ? [...root.querySelectorAll<HTMLElement>("[data-column-target]")].map((el) => {
              const r = el.getBoundingClientRect();
              return { id: el.getAttribute("data-column-target")!, left: r.left, width: r.width };
            })
          : [];
        const to = resolveColumnSwapIndex(rects, x, d.id, d.to, dx, isRtl(root));
        set({ ...d, x, y, to });
      };
      const onUp = () => {
        if (dragRef.current) commit();
        else end();
      };
      const onKey = (k: KeyboardEvent) => {
        if (k.key === "Escape" && dragRef.current) {
          k.preventDefault();
          cancel();
        }
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", cancel);
      window.addEventListener("keydown", onKey);
      cleanupRef.current = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", cancel);
        window.removeEventListener("keydown", onKey);
      };
    },
    [cancel, commit, end, set],
  );

  const onGripKey = useCallback(
    (column: TaskBoardColumn, from: number, e: React.KeyboardEvent<HTMLElement>) => {
      const o = optsRef.current;
      if (!o.enabled) return;
      const d = dragRef.current;
      const total = o.columns.length;
      if (!d || !d.keyboard || d.id !== column.id) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          set({ id: column.id, from, to: from, x: 0, y: 0, grabOffset: { x: 0, y: 0 }, width: 0, height: 0, keyboard: true });
          refocusRef.current = column.id;
          o.announce(o.text("columnGrabbed", { name: column.title }));
        }
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const forward = (e.key === "ArrowRight") !== isRtl(e.currentTarget);
        const to = Math.max(0, Math.min(total - 1, d.to + (forward ? 1 : -1)));
        if (to === d.to) return;
        set({ ...d, to });
        refocusRef.current = column.id;
        o.announce(o.text("columnMoved", { name: column.title, index: to + 1, total }));
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        refocusRef.current = column.id;
        commit();
      } else if (e.key === "Escape" || e.key === "Tab") {
        if (e.key === "Escape") e.preventDefault();
        refocusRef.current = e.key === "Escape" ? column.id : null;
        cancel();
        o.announce(o.text("cancelled"));
      }
    },
    [cancel, commit, set],
  );

  const previewColumns = useMemo(
    () => (drag && drag.to !== drag.from ? moveColumn(opts.columns, drag.id, drag.to) : opts.columns),
    [drag, opts.columns],
  );

  const gripProps = useCallback(
    (column: TaskBoardColumn, index: number): React.ButtonHTMLAttributes<HTMLButtonElement> & { "data-column-grip": string } => ({
      "data-column-grip": column.id,
      "aria-label": opts.text("moveColumn", { name: column.title }),
      onPointerDown: (e) => startPointer(column, index, e),
      onKeyDown: (e) => onGripKey(column, index, e),
    }),
    [opts.text, startPointer, onGripKey],
  );

  return { drag, previewColumns, gripProps };
}
