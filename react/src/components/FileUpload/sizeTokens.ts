import type { ControlSize } from "../../theme/Theme";
export const uploadSizeTokens: Record<ControlSize, {
  dropzone: string; icon: string; preview: string; title: string; detail: string; row: string; remove: ControlSize;
}> = {
  xs: { dropzone: "gap-2 p-2", icon: "h-4 w-4", preview: "h-6 w-6", title: "text-xs", detail: "text-[10px]", row: "gap-2 px-2 py-1", remove: "xs" },
  sm: { dropzone: "gap-2.5 p-3", icon: "h-5 w-5", preview: "h-8 w-8", title: "text-sm", detail: "text-[11px]", row: "gap-2 px-2 py-1.5", remove: "xs" },
  md: { dropzone: "gap-3 p-4", icon: "h-7 w-7", preview: "h-10 w-10", title: "text-base", detail: "text-xs", row: "gap-3 px-3 py-2", remove: "sm" },
  lg: { dropzone: "gap-4 p-5", icon: "h-8 w-8", preview: "h-12 w-12", title: "text-lg", detail: "text-sm", row: "gap-4 px-4 py-2.5", remove: "md" },
  xl: { dropzone: "gap-5 p-6", icon: "h-10 w-10", preview: "h-14 w-14", title: "text-xl", detail: "text-base", row: "gap-5 px-5 py-3", remove: "lg" },
};
