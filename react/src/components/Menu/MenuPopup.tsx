import React, { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { resolveTooltipPlacement } from "../../../../common/tooltip/placement";
import { resolveOverlayZIndex } from "../../../../common/utils/overlayZIndex";

/** Shared viewport collision and stacking rules used by the kit's overlays. */
export function MenuPopup({ anchor, placement, width, children }: {
  anchor: React.RefObject<HTMLElement | null>;
  placement: "top" | "bottom" | "left" | "right";
  width: number | string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: "hidden" });
  useLayoutEffect(() => {
    const update = () => {
      if (!anchor.current || !ref.current) return;
      const trigger = anchor.current.getBoundingClientRect();
      const rect = ref.current.getBoundingClientRect();
      const position = resolveTooltipPlacement({
        trigger: { left: trigger.left, top: trigger.top, width: trigger.width, height: trigger.height },
        tooltip: { width: rect.width, height: rect.height },
        viewport: { width: window.innerWidth, height: window.innerHeight },
        preferred: placement, align: "grow", offset: 4,
      });
      setStyle({ left: position.left, top: position.top, zIndex: resolveOverlayZIndex(anchor.current), visibility: "visible" });
    };
    update();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (ref.current) observer?.observe(ref.current);
    if (anchor.current) observer?.observe(anchor.current);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => { observer?.disconnect(); window.removeEventListener("resize", update); window.removeEventListener("scroll", update, true); };
  }, [anchor, placement, width]);
  if (typeof document === "undefined") return null;
  return createPortal(<div ref={ref} style={{ position: "fixed", width, maxWidth: "calc(100vw - 16px)", ...style }}>{children}</div>, document.body);
}
