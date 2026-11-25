import React, { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { resolveTooltipPlacement } from "../../../../common/tooltip/placement";
import { resolveOverlayZIndex } from "../../../../common/utils/overlayZIndex";
import { useMenuPopupZIndex } from "../../contexts/MenuPopupContext";

/**
 * How the popup aligns with the anchor along the axis the placement runs
 * away from (horizontal for `top`/`bottom`, vertical for `left`/`right`).
 */
export type MenuPopupAlign = "start" | "end" | "grow";

/**
 * Shared viewport collision and stacking rules used by the kit's overlays.
 *
 * The positioning vocabulary matches the legacy `DropdownMenu` so a
 * `Menu` can stand in for it: `align: "end"` snaps the popup's trailing edge
 * to the anchor's (flush-right kebab/caret menus), `width: "trigger"` floors
 * the popup at the anchor's width, and a `[data-dropdown-caret]` descendant
 * of the anchor becomes the alignment reference — the menu reads as growing
 * out of the caret it belongs to, not the outer split-button container.
 * Stacking takes the higher of the anchor-chain tier and the enclosing
 * `MenuPopupContext` tier, so menus anchored inside a SideMenu's rail open
 * above the page's content column.
 */
export function MenuPopup({ anchor, placement, width = 256, maxWidth = 380, align = "grow", children }: {
  anchor: React.RefObject<HTMLElement | null>;
  placement: "top" | "bottom" | "left" | "right";
  /** Floor: the popup never renders narrower than this. `"trigger"` floors it
   * at the anchor's own width instead. @default 256 */
  width?: number | string | "trigger";
  /** Cap for content-driven growth; the viewport (100vw − 16px) clamps on top. @default 380 */
  maxWidth?: number;
  /** @default "grow" */
  align?: MenuPopupAlign;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const menuPopupZ = useMenuPopupZIndex();
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: "hidden" });
  useLayoutEffect(() => {
    const update = () => {
      if (!anchor.current || !ref.current) return;
      const trigger = anchor.current.getBoundingClientRect();
      const rect = ref.current.getBoundingClientRect();
      // Cross-axis alignment honours the anchor's split-button caret when it
      // has one; the placement axis (which side has room) still measures the
      // whole anchor so a flip never keys off the narrower caret.
      const caret = anchor.current.querySelector("[data-dropdown-caret]")?.getBoundingClientRect();
      const horizontal = placement === "top" || placement === "bottom";
      const basis: { left: number; top: number; width: number; height: number } = {
        left: trigger.left, top: trigger.top, width: trigger.width, height: trigger.height,
      };
      if (caret) {
        if (horizontal) { basis.left = caret.left; basis.width = caret.width; }
        else { basis.top = caret.top; basis.height = caret.height; }
      }
      const position = resolveTooltipPlacement({
        trigger: basis,
        tooltip: { width: rect.width, height: rect.height },
        viewport: { width: window.innerWidth, height: window.innerHeight },
        preferred: placement, align, offset: 4,
      });
      // Room left on the chosen (possibly flipped) side, below the popup's top
      // edge. MenuSurface folds it into its scroll cap, so a menu that cannot
      // fit shrinks and scrolls internally instead of hanging off-screen.
      const available = Math.max(0, window.innerHeight - position.top - 8);
      // Trigger-width mode floors at the anchor's width — never past the
      // viewport clamp the static style already carries.
      const minWidth = width === "trigger"
        ? `${Math.max(0, Math.min(trigger.width, window.innerWidth - 16))}px`
        : width;
      setStyle(prev => {
        const next = { left: position.left, top: position.top, minWidth,
          zIndex: Math.max(resolveOverlayZIndex(anchor.current!), menuPopupZ ?? 0),
          visibility: "visible",
          "--menu-popup-max-height": `${available}px` } as React.CSSProperties;
        const same = prev.minWidth === next.minWidth && prev.left === next.left && prev.top === next.top
          && prev.zIndex === next.zIndex && prev.visibility === next.visibility
          && prev["--menu-popup-max-height" as keyof React.CSSProperties] === next["--menu-popup-max-height" as keyof React.CSSProperties];
        return same ? prev : next;
      });
    };
    update();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (ref.current) observer?.observe(ref.current);
    if (anchor.current) observer?.observe(anchor.current);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => { observer?.disconnect(); window.removeEventListener("resize", update); window.removeEventListener("scroll", update, true); };
  }, [anchor, placement, width, maxWidth, align, menuPopupZ]);
  if (typeof document === "undefined") return null;
  // No fixed width: the popup shrink-wraps to its longest row, floored at
  // `width` (or the anchor's width in `"trigger"` mode) and capped at
  // `maxWidth` (the viewport clamp rides on top).
  return createPortal(<div ref={ref} style={{ position: "fixed", maxWidth: `min(${maxWidth}px, calc(100vw - 16px))`, ...style }}>{children}</div>, document.body);
}
