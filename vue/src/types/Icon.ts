import type { VNode, VNodeChild } from "vue";
import type { ControlSize } from "../theme/Theme";

/**
 * Aliased from the shared control scale rather than redeclared — the two lists
 * were identical and free to drift.
 */
export type IconSize = ControlSize;

/**
 * Base icon name type - apps can extend this with their own icon names
 */
export type BaseIconName = string;

/**
 * Icon renderer function type (Vue flavor — accepts a VNode where the React
 * kit accepts a ReactElement, returns renderable VNode children).
 */
export type IconRenderer = (
  icon: BaseIconName | VNode | undefined,
  size: IconSize | undefined,
  className?: string,
) => VNodeChild;

/**
 * No-op icon renderer: renders elements as-is and drops icon *names*.
 *
 * No longer the `useIconRenderer` fallback — that is the registry-backed
 * `renderIcon` from `utils/renderIcon`. Kept for apps that deliberately want
 * names ignored.
 */
export const defaultIconRenderer: IconRenderer = (icon, _size, _className) => {
  if (!icon) return null;
  if (typeof icon === "string") {
    // Return a placeholder for string icons when no renderer is configured
    return null;
  }
  // For VNodes, return as-is
  return icon;
};
