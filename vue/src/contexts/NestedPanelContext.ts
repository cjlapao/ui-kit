import type { ComputedRef, InjectionKey } from "vue";
import type { NestedPanelSurface } from "../../../common/theme/nestedPanel";

export const NestedPanelKey: InjectionKey<ComputedRef<NestedPanelSurface>> = Symbol("NestedPanel");
