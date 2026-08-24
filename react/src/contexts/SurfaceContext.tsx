import React, { createContext, useContext, type ReactNode } from "react";
import {
  getSurfaceTextTokens,
  type SurfaceTextTokens,
  type SurfaceVariant,
} from "../theme/Theme";

/**
 * Tells descendants what kind of surface they are drawn on.
 *
 * Content cannot work this out for itself: a `FormField` has no idea whether
 * the card around it is opaque white or glass over a photograph, and the muted
 * end of the neutral scale disappears on the latter. `FormSection` publishes
 * its variant here so the fields inside can pick text that survives it.
 */
const SurfaceContext = createContext<SurfaceTextTokens>(
  getSurfaceTextTokens("elevated"),
);

export interface SurfaceProviderProps {
  variant: SurfaceVariant;
  children: ReactNode;
}

export const SurfaceProvider: React.FC<SurfaceProviderProps> = ({
  variant,
  children,
}) => (
  <SurfaceContext.Provider value={getSurfaceTextTokens(variant)}>
    {children}
  </SurfaceContext.Provider>
);

/** Text tokens for the nearest surface. Defaults to a solid one. */
export const useSurfaceText = (): SurfaceTextTokens =>
  useContext(SurfaceContext);

export { SurfaceContext };
