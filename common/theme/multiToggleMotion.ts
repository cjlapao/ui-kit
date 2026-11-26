/**
 * Geometry stays bounded during spring overshoot, including simultaneous
 * resizing. `visible` is the pill's alpha as a custom property: a withdrawn
 * pill (the selected option is `hidden`) reads `--mt-opacity: 0`, and because
 * that property is deliberately *not* transitioned, the vanish/appear is a
 * jump rather than a slide.
 */
export const getMultiToggleMotionStyle = (
  offset: number,
  width: number,
  trackWidth: number,
  paddingLeft: number,
  paddingRight: number,
  inset: number,
  visible = true,
) => {
  const left = paddingLeft + inset;
  const right = Math.max(left, trackWidth - paddingRight - inset);
  return {
    "--mt-offset": `${offset}px`,
    "--mt-width": `${width}px`,
    "--mt-left": `${left}px`,
    "--mt-right": `${right}px`,
    "--mt-opacity": visible ? "1" : "0",
  };
};

/**
 * Horizontal padding a separator keeps on each side of its rule. The item
 * `gap` is deliberately *not* added here — the separator's own padding is what
 * spaces it from its neighbours on both sides. Shared so React and Vue agree.
 */
export const DEFAULT_SEPARATOR_PADDING = 8;
