import { useId, useRef, useState, type PointerEvent, type KeyboardEvent } from "react";

/** Footer percentages leave room for both scroll regions, even after a resize. */
const clamp = (value: number) => Number.isFinite(value) ? Math.max(10, Math.min(80, value)) : 30;

export function useWorkflowFooterResize({ height, defaultHeight, onChange, enabled }: {
  height?: number;
  defaultHeight: number;
  onChange?: (height: number) => void;
  enabled: boolean;
}) {
  const [internal, setInternal] = useState(() => clamp(defaultHeight));
  const percentage = clamp(height ?? internal);
  const bodyRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; height: number; percentage: number; pointerId: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const footerId = useId();
  const update = (next: number) => {
    const value = clamp(next);
    if (height === undefined) setInternal(value);
    onChange?.(value);
  };
  const finish = () => { drag.current = null; setDragging(false); };

  return {
    percentage, bodyRef, footerId, dragging: enabled && dragging,
    handleProps: {
      role: "separator" as const,
      tabIndex: 0,
      "aria-orientation": "horizontal" as const,
      "aria-valuemin": 10,
      "aria-valuemax": 80,
      "aria-valuenow": Math.round(percentage),
      "aria-valuetext": `${Math.round(percentage)}%`,
      "aria-controls": footerId,
      onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
        if (!enabled || event.button !== 0 || event.isPrimary === false) return;
        const bounds = bodyRef.current?.getBoundingClientRect();
        // The separator itself does not belong to either pane's share.
        const available = (bounds?.height ?? 0) - event.currentTarget.getBoundingClientRect().height;
        if (available <= 0) return;
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture?.(event.pointerId);
        drag.current = { y: event.clientY, height: available, percentage, pointerId: event.pointerId };
        setDragging(true);
      },
      onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
        const start = drag.current;
        if (!enabled || !start || start.pointerId !== event.pointerId) return;
        update(start.percentage + (start.y - event.clientY) / start.height * 100);
      },
      onPointerUp: finish,
      onPointerCancel: finish,
      onLostPointerCapture: finish,
      onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
        if (!enabled) return;
        const step = event.shiftKey ? 10 : 5;
        const next = event.key === "ArrowUp" ? percentage + step
          : event.key === "ArrowDown" ? percentage - step
          : event.key === "Home" ? 10 : event.key === "End" ? 80 : undefined;
        if (next === undefined) return;
        event.preventDefault();
        update(next);
      },
    },
  };
}
