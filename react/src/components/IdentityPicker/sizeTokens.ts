import type { ControlSize } from "../../theme/Theme";

/** Component density follows the same ladder as the embedded controls. */
export const identitySizeTokens: Record<ControlSize, {
  preview: string; tile: string; title: string; description: string;
  headerGap: string; panel: string; section: string; gridHeight: string; action: ControlSize;
}> = {
  xs: { preview: "h-8 w-8 text-lg", tile: "h-7 text-sm", title: "text-xs", description: "text-[10px]", headerGap: "gap-2", panel: "space-y-2 p-2", section: "mt-2", gridHeight: "max-h-48", action: "xs" },
  sm: { preview: "h-12 w-12 text-2xl", tile: "h-8 text-base", title: "text-sm", description: "text-xs", headerGap: "gap-3", panel: "space-y-3 p-3", section: "mt-3", gridHeight: "max-h-56", action: "xs" },
  md: { preview: "h-16 w-16 text-3xl", tile: "h-10 text-xl", title: "text-base", description: "text-sm", headerGap: "gap-4", panel: "space-y-4 p-3 sm:p-4", section: "mt-4", gridHeight: "max-h-64", action: "sm" },
  lg: { preview: "h-20 w-20 text-4xl", tile: "h-12 text-2xl", title: "text-lg", description: "text-base", headerGap: "gap-5", panel: "space-y-5 p-4 sm:p-5", section: "mt-5", gridHeight: "max-h-72", action: "md" },
  xl: { preview: "h-24 w-24 text-5xl", tile: "h-14 text-3xl", title: "text-xl", description: "text-lg", headerGap: "gap-6", panel: "space-y-6 p-5 sm:p-6", section: "mt-6", gridHeight: "max-h-80", action: "lg" },
};

export const compactIdentitySpacing: Record<ControlSize, { panel: string; section: string; gridHeight: string }> = {
  xs: { panel: "space-y-1.5 p-1", section: "mt-1.5", gridHeight: "max-h-28" },
  sm: { panel: "space-y-2 p-1.5", section: "mt-2", gridHeight: "max-h-32" },
  md: { panel: "space-y-2 p-2", section: "mt-2", gridHeight: "max-h-40" },
  lg: { panel: "space-y-3 p-2.5", section: "mt-3", gridHeight: "max-h-48" },
  xl: { panel: "space-y-3 p-3", section: "mt-3", gridHeight: "max-h-56" },
};
