import {
  computed,
  getCurrentScope,
  onScopeDispose,
  ref,
  toValue,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";

export interface UseResizableOptions {
  /** Initial width in pixels */
  initialWidth: number;
  /** Minimum width in pixels */
  minWidth?: number;
  /** Maximum width in pixels (or function returning max) */
  maxWidth?: number | (() => number);
  /** Called on every resize frame */
  onResize?: (width: number) => void;
  /** Called when drag ends */
  onResizeEnd?: (width: number) => void;
  /** Whether resizing is enabled */
  enabled?: MaybeRefOrGetter<boolean>;
}

export interface ResizableHandleProps {
  onPointerdown: (e: PointerEvent) => void;
  onKeydown: (e: KeyboardEvent) => void;
  role: "separator";
  "aria-orientation": "vertical";
  "aria-valuenow": number;
  "aria-valuemin": number;
  "aria-valuemax": number;
  tabindex: number;
}

export interface UseResizableReturn {
  /** Current width in pixels */
  width: Ref<number>;
  /** Whether the user is currently dragging */
  isDragging: Ref<boolean>;
  /** Props to spread (`v-bind`) onto the resize handle element */
  handleProps: ComputedRef<ResizableHandleProps>;
}

export function useResizable({
  initialWidth,
  minWidth = 100,
  maxWidth: maxWidthOpt = 600,
  onResize,
  onResizeEnd,
  enabled = true,
}: UseResizableOptions): UseResizableReturn {
  const width = ref(initialWidth);
  const isDragging = ref(false);
  let startX = 0;
  let startWidth = 0;

  const getMaxWidth = (): number => {
    return typeof maxWidthOpt === "function" ? maxWidthOpt() : maxWidthOpt;
  };

  const clamp = (value: number): number =>
    Math.max(minWidth, Math.min(getMaxWidth(), value));

  const handlePointerMove = (e: PointerEvent): void => {
    const delta = e.clientX - startX;
    const newWidth = clamp(startWidth + delta);
    width.value = newWidth;
    onResize?.(newWidth);
  };

  const detachDragListeners = (): void => {
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  function handlePointerUp(): void {
    isDragging.value = false;
    detachDragListeners();
    onResizeEnd?.(width.value);
  }

  const attachDragListeners = (): void => {
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const onPointerdown = (e: PointerEvent): void => {
    if (!toValue(enabled)) return;
    e.preventDefault();
    startX = e.clientX;
    startWidth = width.value;
    isDragging.value = true;
    attachDragListeners();
  };

  const onKeydown = (e: KeyboardEvent): void => {
    if (!toValue(enabled)) return;
    const step = 20;
    let newWidth = width.value;
    if (e.key === "ArrowRight") {
      newWidth = clamp(width.value + step);
    } else if (e.key === "ArrowLeft") {
      newWidth = clamp(width.value - step);
    } else {
      return;
    }
    e.preventDefault();
    width.value = newWidth;
    onResize?.(newWidth);
    onResizeEnd?.(newWidth);
  };

  // Remove document listeners / body styles if the owning scope is disposed
  // mid-drag. Guarded so the composable also works outside a component scope.
  if (getCurrentScope()) {
    onScopeDispose(() => {
      if (isDragging.value) {
        detachDragListeners();
      }
    });
  }

  const handleProps = computed<ResizableHandleProps>(() => ({
    onPointerdown,
    onKeydown,
    role: "separator" as const,
    "aria-orientation": "vertical" as const,
    "aria-valuenow": width.value,
    "aria-valuemin": minWidth,
    "aria-valuemax": getMaxWidth(),
    tabindex: toValue(enabled) ? 0 : -1,
  }));

  return {
    width,
    isDragging,
    handleProps,
  };
}
