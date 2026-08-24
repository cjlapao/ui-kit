import React, { createContext, useContext, type ReactNode } from "react";
import type { IconRenderer } from "../types/Icon";
import { renderIcon as registryIconRenderer } from "../utils/renderIcon";

interface IconContextValue {
  renderIcon: IconRenderer;
}

/**
 * Default to the kit's own registry-backed renderer, so `icon="Search"` resolves
 * against `src/icons` out of the box.
 *
 * This used to default to `defaultIconRenderer`, which returns `null` for string
 * icons — every component that takes an icon *name* (Button, IconButton, Modal,
 * Table, SideMenu, Hero, the Stat tiles…) silently rendered nothing unless the
 * app happened to wrap itself in an `IconProvider`. Passing a React element
 * worked, which is why it looked inconsistent rather than broken.
 *
 * `IconProvider` still overrides this for apps with their own icon set.
 */
const IconContext = createContext<IconContextValue>({
  renderIcon: registryIconRenderer,
});

export interface IconProviderProps {
  renderIcon: IconRenderer;
  children: ReactNode;
}

/**
 * Provider for customizing icon rendering in ui-kit components.
 * Wrap your app with this provider to supply a custom icon renderer.
 */
export const IconProvider: React.FC<IconProviderProps> = ({
  renderIcon,
  children,
}) => {
  return (
    <IconContext.Provider value={{ renderIcon }}>
      {children}
    </IconContext.Provider>
  );
};

/**
 * Hook to access the icon renderer from context
 */
export const useIconRenderer = (): IconRenderer => {
  const context = useContext(IconContext);
  return context.renderIcon;
};

export { IconContext };
