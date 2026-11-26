/** Geometry stays bounded during spring overshoot, including simultaneous resizing. */
export const getMultiToggleMotionStyle = (
  offset: number,
  width: number,
  trackWidth: number,
  paddingLeft: number,
  paddingRight: number,
  inset: number,
) => {
  const left = paddingLeft + inset;
  const right = Math.max(left, trackWidth - paddingRight - inset);
  return {
    "--mt-offset": `${offset}px`,
    "--mt-width": `${width}px`,
    "--mt-left": `${left}px`,
    "--mt-right": `${right}px`,
  };
};

/**
 * Horizontal padding a separator keeps on each side of its rule. The item
 * `gap` is deliberately *not* added here — the separator's own padding is what
 * spaces it from its neighbours on both sides. Shared so React and Vue agree.
 */
export const DEFAULT_SEPARATOR_PADDING = 8;
