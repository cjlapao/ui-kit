import type { VNode, VNodeChild } from "vue";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

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
 * Default no-op icon renderer - returns null for string icons
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
