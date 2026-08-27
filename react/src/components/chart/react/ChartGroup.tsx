/**
 * <Chart.Group> — hover sync across multiple charts.
 *
 * Wraps several `Chart.Svg`/`Chart.Canvas` roots marked with `sync`.
 * Hovering any member broadcasts the hovered **category** (the shared
 * categorical x value, e.g. a month name) to every other member, which
 * renders its own crosshair + tooltip at its own pixel position for
 * that category. Members may have different sizes, y scales, and
 * series types; the shared key is the category, not the pixel.
 *
 * Scope (v1): cartesian members only. Non-cartesian series (pie,
 * gauge, heatmap, treemap) keep local hover and ignore broadcasts.
 */
import { createContext, useCallback, useContext, useRef } from "react";
import type { ReactNode } from "react";

export interface ChartGroupContextValue {
  /** Register a member chart's inbound apply (called on broadcasts). */
  register(id: string, apply: (rawX: string | number | null) => void): void;
  /** Remove a member (chart unmount). */
  unregister(id: string): void;
  /**
   * Broadcast a hovered category — or `null` to clear — to every member
   * except `sourceId`.
   */
  broadcast(rawX: string | number | null, sourceId: string): void;
}

export const ChartGroupContext =
  createContext<ChartGroupContextValue | null>(null);

/** Read the nearest chart-group sync context (null when not inside one). */
export function useChartGroup(): ChartGroupContextValue | null {
  return useContext(ChartGroupContext);
}

export interface ChartGroupProps {
  children?: ReactNode;
}

/**
 * Hover-sync group. Renders children verbatim (no chrome) and provides
 * the sync context. Charts opt in with the `sync` prop.
 */
export function ChartGroup({ children }: ChartGroupProps) {
  const membersRef = useRef(new Map<string, (rawX: string | number | null) => void>());

  const register = useCallback(
    (id: string, apply: (rawX: string | number | null) => void) => {
      membersRef.current.set(id, apply);
    },
    [],
  );
  const unregister = useCallback((id: string) => {
    membersRef.current.delete(id);
  }, []);
  const broadcast = useCallback(
    (rawX: string | number | null, sourceId: string) => {
      for (const [id, apply] of membersRef.current) {
        if (id !== sourceId) apply(rawX);
      }
    },
    [],
  );

  return (
    <ChartGroupContext.Provider
      value={{ register, unregister, broadcast }}
    >
      <div>{children}</div>
    </ChartGroupContext.Provider>
  );
}

ChartGroup.displayName = "Chart.Group";
