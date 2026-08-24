import type { ReactElement, ReactNode } from "react";
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
 * Icon renderer function type
 */
export type IconRenderer = (
  icon: BaseIconName | ReactElement | undefined,
  size: IconSize | undefined,
  className?: string,
) => ReactNode;

/**
 * No-op icon renderer: renders React elements as-is and drops icon *names*.
 *
 * No longer the `IconContext` default — that is the registry-backed
 * `renderIcon` from `utils/renderIcon`, so names resolve without a provider.
 * Kept for apps that deliberately want names ignored.
 */
export const defaultIconRenderer: IconRenderer = (icon, _size, _className) => {
  if (!icon) return null;
  if (typeof icon === "string") {
    // Return a placeholder span for string icons when no renderer is configured
    return null;
  }
  // For React elements, return as-is
  return icon;
};
