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
