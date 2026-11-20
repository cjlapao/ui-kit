import { createContext } from "react";
import type { NestedPanelSurface } from "../../../common/theme/nestedPanel";

export const NestedPanelContext = createContext<NestedPanelSurface | null>(null);
