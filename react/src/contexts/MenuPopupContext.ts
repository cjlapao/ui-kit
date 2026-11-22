import { createContext, useContext } from "react";

/**
 * The z-index tier portaled popups should open at when they are anchored
 * inside a SideMenu.
 *
 * A portaled popup lives on `<body>`, so its clipping chain is gone — the
 * only thing that can hide it is paint order. `resolveZIndex` walks the
 * trigger's ancestor chain, but a docked menu's aside carries no z-index
 * (only the hover rail and the mobile drawer do), so a picker embedded in
 * the menu resolves to the default tier (21) and any positioned content
 * column above it paints over the popup the moment it leaves the sidebar.
 * The menu provides this tier so its popups belong to the menu's own
 * stacking layer; consumers take `max(chainResolved, tier)`.
 *
 * 61: one notch above the tallest chrome the menu itself renders — the
 * `z-[60]` mobile drawer (then the `z-50` backdrop/header, the `z-40`
 * hover rail).
 */
export const MENU_POPUP_Z_INDEX = 61;

export const MenuPopupContext = createContext<number | undefined>(undefined);

/** The popup tier offered by the enclosing menu, if any. */
export const useMenuPopupZIndex = (): number | undefined =>
  useContext(MenuPopupContext);
