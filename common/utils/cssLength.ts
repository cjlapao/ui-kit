/**
 * Turn a length prop into something an inline `style` accepts.
 *
 * The kit's sizing props take either shape: a **number** is px — `width={220}`
 * is what a caller means when they say "two hundred and twenty" — and a
 * **string** is a ready CSS length, passed through untouched so
 * `"12rem"`, `"100%"` and `"min(24rem, 100%)"` all work without the kit
 * inventing a unit for them.
 *
 * `undefined` stays `undefined` rather than becoming `"undefined"`: React
 * omits an undefined style property, and Vue does the same, so an unset `width`
 * leaves the element's own sizing alone.
 */
export const cssLength = (value?: number | string): string | undefined =>
  typeof value === "number" ? `${value}px` : value;

/** True when at least one of the given lengths was actually provided. */
export const hasCssLength = (
  ...values: Array<number | string | undefined>
): boolean => values.some((value) => value != null);
