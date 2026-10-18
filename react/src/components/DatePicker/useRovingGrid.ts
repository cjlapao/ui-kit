import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Roving tabindex for a grid of cells — the day grid, the month view and the
 * year view all need exactly this: one cell is tabbable (`tabIndex=0`,
 * the "active" one), every other cell is `tabIndex=-1`, arrow keys move the
 * active cell (skipping disabled ones), and focus follows the active cell.
 *
 * The active cell is recomputed from `activeKey` (selected → today → first
 * selectable, owned by the caller) whenever the cell set changes, so a month
 * flip lands focus on the right cell instead of a stale one.
 */
export const useRovingGrid = (config: {
  /** Stable key per cell, in visual order. */
  keys: string[];
  /** Which keys may be focused/selected. */
  isDisabled: (key: string) => boolean;
  /** The preferred active key (may be disabled or absent). */
  activeKey: string | null;
}) => {
  const { keys, isDisabled, activeKey } = config;
  const refs = useRef(new Map<string, HTMLElement>());
  const [activeIndex, setActiveIndex] = useState(-1);

  const resolveActive = useCallback((): number => {
    const preferred = keys.indexOf(activeKey ?? "");
    if (preferred >= 0 && !isDisabled(keys[preferred])) return preferred;
    const firstEnabled = keys.findIndex((key) => !isDisabled(key));
    return firstEnabled >= 0 ? firstEnabled : -1;
  }, [keys, activeKey, isDisabled]);

  // Keep a valid index whenever the cell set or its active key changes.
  const keysSignature = keys.join("\u0000");
  useEffect(() => {
    setActiveIndex(resolveActive());
  }, [keysSignature, activeKey, resolveActive]);

  /**
   * Ref callback for the cell with `key`. Typed as a plain function (not
   * `RefCallback<HTMLElement>`) so the type stays structural — the demo
   * typechecks the kit source in its own program, and a named `RefCallback`
   * from one `@types/react` copy is not accepted where another copy's
   * `Ref` is expected.
   */
  const registerRef = useCallback(
    (key: string): ((node: HTMLElement | null) => void) =>
      (el: HTMLElement | null) => {
        if (el) refs.current.set(key, el);
        else refs.current.delete(key);
      },
    [],
  );

  /** Make a cell the active one and focus it. */
  const move = useCallback(
    (key: string) => {
      const index = keys.indexOf(key);
      if (index < 0) return;
      setActiveIndex(index);
      // Focus on the next frame: the re-render that flips the tabIndex has to
      // land first, or `:focus-visible` rings and roving state disagree.
      window.requestAnimationFrame(() => {
        refs.current.get(key)?.focus();
      });
    },
    [keys],
  );

  /** Focus the current active cell (ArrowDown from the input, re-open, …). */
  const focusActive = useCallback(() => {
    const index = resolveActive();
    if (index < 0) return;
    refs.current.get(keys[index])?.focus();
  }, [keys, resolveActive]);

  return {
    /** tabIndex for cell at `index`. */
    tabIndexFor: (index: number): number =>
      index === activeIndex ? 0 : -1,
    registerRef,
    move,
    focusActive,
    /** The currently focused cell's index, for edge math. */
    activeIndex,
  };
};
