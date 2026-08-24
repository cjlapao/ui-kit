import classNames from "classnames";
import {
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  forwardRef,
  useRef,
  useState,
} from "react";
import { getSliderVariantTokens, SLIDER_VARIANTS } from "../theme/Theme";
import type { SliderVariant, TrueColor } from "../theme/Theme";

export const SLIDER_ORIENTATIONS = ["horizontal", "vertical"] as const;
export type SliderOrientation = (typeof SLIDER_ORIENTATIONS)[number];

/** Re-exported from the theme, where the runtime lists live. */
export { SLIDER_VARIANTS };
export type { SliderVariant };

/** A single value, or a `[min, max]` pair in range mode. */
export type SliderValue = number | [number, number];

export interface SliderProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  /** The value — a number, or a `[min, max]` pair in range mode. */
  value?: SliderValue | null;
  /** Initial value when uncontrolled. @default min (or `[min, max]` in range mode) */
  defaultValue?: SliderValue;
  /** Fired on every change — while dragging, after a track click and on keyboard input. */
  onChange?: (value: SliderValue) => void;
  /** Fired when a pointer drag ends. */
  onSlideEnd?: (value: SliderValue) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** Two handles picking a `[min, max]` pair. @default false */
  range?: boolean;
  /** @default "horizontal" */
  orientation?: SliderOrientation;
  /** Minimum number of steps the range handles may sit apart. @default 0 */
  minStepsBetweenHandles?: number;
  /** Visual treatment — the same eight values `Button` offers. @default "solid" */
  variant?: SliderVariant;
  /** Colour of the fill and handle. @default "blue" */
  color?: TrueColor;
  /** Alias for `color`, matching the input family's `tone`. @deprecated */
  tone?: TrueColor;
  /** Paint the fill and handle in the error colour. */
  invalid?: boolean;
  /** Freeze everything: the handles leave the tab order and ignore input. */
  disabled?: boolean;
  /** Range only: freeze just the start (min) handle. */
  disabledMinHandle?: boolean;
  /** Range only: freeze just the end (max) handle. */
  disabledMaxHandle?: boolean;
  /** Focusable but not editable — visually unchanged. */
  readOnly?: boolean;
  /** Accessible name for the handle(s). @default "Slider" */
  ariaLabel?: string;
}

const INVALID_FILL = "bg-rose-500";
const INVALID_HANDLE = "border-rose-400";
const INVALID_RING = "focus-visible:ring-rose-400";

const roundToStep = (value: number) => Number(value.toFixed(10));

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const snap = (value: number, min: number, max: number, step: number) =>
  roundToStep(min + Math.round((clamp(value, min, max) - min) / step) * step);

/** Normalize anything the props or state may hold into a sorted `[lo, hi]` pair. */
const toPair = (
  raw: SliderValue | null | undefined,
  min: number,
  max: number,
  step: number,
): [number, number] => {
  if (Array.isArray(raw)) {
    const lo = snap(raw[0] ?? min, min, max, step);
    const hi = snap(raw[1] ?? lo, min, max, step);
    return [Math.min(lo, hi), Math.max(lo, hi)];
  }
  const value = snap(typeof raw === "number" ? raw : min, min, max, step);
  return [value, value];
};

const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    value,
    defaultValue,
    onChange,
    onSlideEnd,
    min = 0,
    max = 100,
    step = 1,
    range = false,
    orientation = "horizontal",
    minStepsBetweenHandles = 0,
    variant = "solid",
    color,
    tone,
    invalid = false,
    disabled = false,
    disabledMinHandle = false,
    disabledMaxHandle = false,
    readOnly = false,
    ariaLabel = "Slider",
    className,
    ...rest
  },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? Math.max(safeMin, max) : 100;
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  const span = safeMax - safeMin;

  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = useState<SliderValue>(() => {
    if (defaultValue !== undefined) return defaultValue;
    return range ? [safeMin, safeMax] : safeMin;
  });

  const currentPair = toPair(
    isControlled ? value : innerValue,
    safeMin,
    safeMax,
    safeStep,
  );

  const inert = disabled || readOnly;
  const effectiveColor = color ?? tone ?? "blue";
  const tokens = getSliderVariantTokens(effectiveColor, variant);

  // One entry per interactive handle, so range and single share the same
  // pointer/keyboard paths. `index` is the handle's position in this array.
  const handles: { value: number; disabled: boolean; label: string }[] = range
    ? [
        {
          value: currentPair[0],
          disabled: disabled || disabledMinHandle,
          label: ariaLabel === "Slider" ? "Minimum" : `${ariaLabel} min`,
        },
        {
          value: currentPair[1],
          disabled: disabled || disabledMaxHandle,
          label: ariaLabel === "Slider" ? "Maximum" : `${ariaLabel} max`,
        },
      ]
    : [{ value: currentPair[1], disabled, label: ariaLabel }];

  const pct = (v: number) => (span > 0 ? ((v - safeMin) / span) * 100 : 0);

  const commit = (next: SliderValue) => {
    if (!isControlled) setInnerValue(next);
    onChange?.(next);
  };

  const valueOf = (pair: [number, number]): SliderValue =>
    range ? [pair[0], pair[1]] : pair[1];

  // Move one handle to `raw`, snapped to the step and kept inside the bounds.
  // In range mode the handles may not cross, and may not come closer than
  // `minStepsBetweenHandles` steps apart.
  const update = (handleIndex: number, raw: number) => {
    const next = snap(raw, safeMin, safeMax, safeStep);
    if (!range) {
      commit(next);
      return;
    }
    const [lo0, hi0] = currentPair;
    const gap = Math.max(0, minStepsBetweenHandles) * safeStep;
    let lo = lo0;
    let hi = hi0;
    if (handleIndex === 0) lo = Math.min(next, hi0 - gap);
    else hi = Math.max(next, lo0 + gap);
    commit([clamp(lo, safeMin, safeMax), clamp(hi, safeMin, safeMax)]);
  };

  // ── Pointer: drag a handle, or press the track to jump the nearest one ────

  const trackRef = useRef<HTMLDivElement | null>(null);
  const handleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragRef = useRef<{ handle: number; source: "handle" | "track" } | null>(
    null,
  );

  const valueAt = (clientX: number, clientY: number) => {
    const track = trackRef.current;
    if (!track) return safeMin;
    const rect = track.getBoundingClientRect();
    const ratio =
      orientation === "horizontal"
        ? rect.width > 0
          ? (clientX - rect.left) / rect.width
          : 0
        : rect.height > 0
          ? 1 - (clientY - rect.top) / rect.height
          : 0;
    return snap(
      safeMin + clamp(ratio, 0, 1) * span,
      safeMin,
      safeMax,
      safeStep,
    );
  };

  const beginDrag =
    (handle: number, source: "handle" | "track") =>
    (event: PointerEvent<HTMLDivElement>) => {
      if (inert || handles[handle].disabled) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = { handle, source };
      event.currentTarget.focus();
    };

  const onTrackPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (inert) return;
    const target = valueAt(event.clientX, event.clientY);
    if (!range) {
      beginDrag(0, "track")(event);
      handleRefs.current[0]?.focus();
      update(0, target);
      return;
    }
    const [lo, hi] = currentPair;
    let handle = Math.abs(target - lo) <= Math.abs(target - hi) ? 0 : 1;
    if (handles[handle].disabled) handle = handle === 0 ? 1 : 0;
    if (handles[handle].disabled) return;
    beginDrag(handle, "track")(event);
    // The track is not focusable; park focus on the handle that now owns the
    // drag so keyboard adjustment continues from the new position.
    handleRefs.current[handle]?.focus();
    update(handle, target);
  };

  const onHandlePointerMove =
    (handle: number) => (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.handle !== handle) return;
      update(handle, valueAt(event.clientX, event.clientY));
    };

  const onTrackPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.source !== "track") return;
    update(drag.handle, valueAt(event.clientX, event.clientY));
  };

  const endDrag = (source: "handle" | "track") => {
    const drag = dragRef.current;
    if (!drag || drag.source !== source) return;
    dragRef.current = null;
    onSlideEnd?.(valueOf(currentPair));
  };

  // ── Keyboard: the slider role's standard key set ──────────────────────────

  const onHandleKeyDown =
    (handle: number) => (event: KeyboardEvent<HTMLDivElement>) => {
      if (inert || handles[handle].disabled) return;
      const current = handles[handle].value;
      let next: number | null = null;
      switch (event.key) {
        case "ArrowLeft":
        case "ArrowDown":
          next = current - safeStep;
          break;
        case "ArrowRight":
        case "ArrowUp":
          next = current + safeStep;
          break;
        case "PageDown":
          next = current - safeStep * 10;
          break;
        case "PageUp":
          next = current + safeStep * 10;
          break;
        case "Home":
          next = safeMin;
          break;
        case "End":
          next = safeMax;
          break;
        default:
          return;
      }
      event.preventDefault();
      update(handle, next);
    };

  const fillStart = range ? currentPair[0] : safeMin;
  const fillEnd = currentPair[1];
  const fillStyle =
    orientation === "horizontal"
      ? {
          left: `${pct(fillStart)}%`,
          width: `${pct(fillEnd) - pct(fillStart)}%`,
        }
      : {
          bottom: `${pct(fillStart)}%`,
          height: `${pct(fillEnd) - pct(fillStart)}%`,
        };

  return (
    <div
      ref={ref}
      className={classNames(
        "relative touch-none select-none",
        // Children are absolutely positioned, so the root has no intrinsic
        // size: `w-full` keeps a horizontal slider from collapsing when its
        // container centres its flex items.
        orientation === "horizontal"
          ? "h-6 w-full"
          : classNames("w-6", !className && "h-64"),
        disabled && "opacity-60",
        className,
      )}
      data-variant={variant}
      data-color={effectiveColor}
      {...rest}
    >
      <div
        ref={trackRef}
        className={classNames(
          "absolute cursor-pointer rounded-full bg-neutral-200 dark:bg-neutral-700",
          orientation === "horizontal"
            ? "inset-x-0 top-1/2 h-1.5 -translate-y-1/2"
            : "inset-y-0 left-1/2 w-1.5 -translate-x-1/2",
        )}
        onPointerDown={onTrackPointerDown}
        onPointerMove={onTrackPointerMove}
        onPointerUp={() => endDrag("track")}
        onPointerCancel={() => endDrag("track")}
      >
        <div
          className={classNames(
            "absolute rounded-full",
            orientation === "horizontal" ? "inset-y-0" : "inset-x-0",
            invalid ? INVALID_FILL : tokens.fill,
          )}
          style={fillStyle}
          aria-hidden="true"
        />
      </div>

      {handles.map((handle, index) => (
        <div
          key={index}
          ref={(el) => {
            handleRefs.current[index] = el;
          }}
          role="slider"
          tabIndex={handle.disabled ? -1 : 0}
          aria-orientation={orientation}
          aria-valuemin={safeMin}
          aria-valuemax={safeMax}
          aria-valuenow={handle.value}
          aria-label={handle.label}
          aria-disabled={handle.disabled || undefined}
          aria-readonly={readOnly || undefined}
          className={classNames(
            "absolute z-10 h-4 w-4 rounded-full border-2 bg-white shadow-sm",
            "dark:bg-neutral-950",
            invalid ? INVALID_HANDLE : tokens.handle,
            orientation === "horizontal"
              ? "top-1/2 -translate-x-1/2 -translate-y-1/2"
              : "left-1/2 -translate-x-1/2 -translate-y-1/2",
            "focus:outline-none focus-visible:ring-2",
            invalid ? INVALID_RING : tokens.ring,
            handle.disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-grab active:cursor-grabbing",
          )}
          style={
            orientation === "horizontal"
              ? { left: `${pct(handle.value)}%` }
              : { bottom: `${pct(handle.value)}%` }
          }
          onPointerDown={beginDrag(index, "handle")}
          onPointerMove={onHandlePointerMove(index)}
          onPointerUp={() => endDrag("handle")}
          onPointerCancel={() => endDrag("handle")}
          onKeyDown={onHandleKeyDown(index)}
        />
      ))}
    </div>
  );
});

Slider.displayName = "Slider";

export default Slider;
