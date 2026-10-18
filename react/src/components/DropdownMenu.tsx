import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";

export interface DropdownMenuOption {
  label: ReactNode;
  value: string;
  description?: ReactNode;
  icon?: string | React.ReactElement;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownMenuProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  items: DropdownMenuOption[];
  onSelect?: (item: DropdownMenuOption) => void;
  align?: "start" | "end";
  side?: "auto" | "top" | "bottom";
  width?: number | "trigger";
  maxHeight?: number;
  className?: string;
  itemClassName?: string;
}

const PORTAL_ROOT = typeof document !== "undefined" ? document.body : null;

type RectBounds = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};

const viewportBounds = (): RectBounds => ({
  top: 0,
  left: 0,
  right: window.innerWidth,
  bottom: window.innerHeight,
  width: window.innerWidth,
  height: window.innerHeight,
});

// The menu is `position: fixed` and teleported to `document.body`, so it is
// positioned relative to the viewport. An ancestor's `overflow` does NOT clip a
// `fixed` element (only a containing-block-establishing ancestor such as a
// transform/filter would), so the viewport — not any clipping parent — is the
// only correct collision boundary. Walking up for an `overflow` ancestor and
// using its rect (which can extend far beyond the visible viewport, e.g. a tall
// scrollable content container) made the menu believe there was room below and
// drop off-screen instead of flipping up.
const resolveBoundaryBounds = (): RectBounds => viewportBounds();

const resolveAnchorLayerZIndex = (anchor: HTMLElement): number => {
  let node: HTMLElement | null = anchor;
  let highest: number | null = null;

  while (node && node !== document.body) {
    const zIndex = window.getComputedStyle(node).zIndex;
    if (zIndex && zIndex !== "auto") {
      const parsed = Number(zIndex);
      if (Number.isFinite(parsed)) {
        highest = highest === null ? parsed : Math.max(highest, parsed);
      }
    }
    node = node.parentElement;
  }

  const base = highest ?? 20;
  return Math.max(1, base + 1);
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  anchorRef,
  open,
  onClose,
  items,
  onSelect,
  align = "end",
  side = "auto",
  width = "trigger",
  maxHeight = 288,
  className,
  itemClassName,
}) => {
  const renderIcon = useIconRenderer();
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // The element that was focused when the menu opened (the trigger); focus is
  // returned to it when the menu closes via Escape / item activation.
  const triggerRef = useRef<HTMLElement | null>(null);
  // Set when the menu is closed by an outside pointerdown. Focus is NOT
  // restored to the trigger in that case — the user deliberately clicked
  // elsewhere (restoring would steal focus and scroll the page back).
  const closedByOutsideRef = useRef(false);
  const [style, setStyle] = useState<React.CSSProperties>();
  const [computedMaxHeight, setComputedMaxHeight] = useState<number>(maxHeight);
  const [activeIndex, setActiveIndex] = useState(0);

  const enabledIndices = items
    .map((item, index) => (item.disabled ? -1 : index))
    .filter((index) => index >= 0);

  const handleSelect = useCallback(
    (item: DropdownMenuOption) => {
      if (item.disabled) {
        return;
      }
      onSelect?.(item);
      onClose();
    },
    [onClose, onSelect],
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    const handlePointer = (event: MouseEvent) => {
      if (
        menuRef.current?.contains(event.target as Node) ||
        anchorRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      closedByOutsideRef.current = true;
      onClose();
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose, anchorRef]);

  useEffect(() => {
    if (!open) {
      setStyle(undefined);
      setComputedMaxHeight(maxHeight);
      setActiveIndex(0);
    }
  }, [maxHeight, open]);

  // On open: capture the trigger (currently focused element) and move focus to
  // the first enabled item. Runs after the positioning layout-effect, so the
  // menu is already visible and focusable.
  useEffect(() => {
    if (!open) {
      return;
    }
    closedByOutsideRef.current = false;
    triggerRef.current = (document.activeElement as HTMLElement) ?? null;
    const first = enabledIndices[0] ?? 0;
    setActiveIndex(first);
    // Defer to the next frame: a synchronous focus() here loses a race against
    // the browser settling focus onto the trigger from the opening click.
    const frame = requestAnimationFrame(() => {
      itemRefs.current[first]?.focus();
    });
    return () => cancelAnimationFrame(frame);
    // `enabledIndices` derives from `items`, which is stable for the life of an
    // open menu; re-running only on `open` is intentional.
  }, [open]);

  // On close: if the close was NOT an outside click and focus was left on
  // <body> (the focused menu item unmounted — i.e. Escape or item activation),
  // return it to the trigger. An outside click is never restored (the user
  // deliberately clicked elsewhere; restoring would steal focus and scroll).
  useEffect(() => {
    if (open) {
      return;
    }
    if (closedByOutsideRef.current) {
      return;
    }
    const active = document.activeElement;
    const trigger = triggerRef.current;
    if (trigger?.isConnected && (active === document.body || active === null)) {
      trigger.focus();
    }
  }, [open]);

  const focusItem = (index: number) => {
    setActiveIndex(index);
    itemRefs.current[index]?.focus();
  };

  const moveActive = (delta: number) => {
    if (enabledIndices.length === 0) {
      return;
    }
    const position = enabledIndices.indexOf(activeIndex);
    // If the active item is unknown/disabled, start just past the end (down) or
    // before the start (up) so wrapping lands on a sensible item.
    const base = position === -1 ? (delta > 0 ? -1 : 0) : position;
    const next =
      (base + delta + enabledIndices.length) % enabledIndices.length;
    focusItem(enabledIndices[next]);
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        event.preventDefault();
        if (enabledIndices.length > 0) focusItem(enabledIndices[0]);
        break;
      case "End":
        event.preventDefault();
        if (enabledIndices.length > 0)
          focusItem(enabledIndices[enabledIndices.length - 1]);
        break;
      case "Tab":
        // Closing on Tab (rather than trapping focus) matches the ARIA menu
        // button pattern: the menu is not a modal dialog.
        event.preventDefault();
        onClose();
        break;
      default:
        break;
    }
  };

  const updatePosition = useCallback(() => {
    if (!open || !anchorRef.current || !menuRef.current) {
      return;
    }

    const anchorRect = anchorRef.current.getBoundingClientRect();
    const caretElement = anchorRef.current.querySelector(
      "[data-dropdown-caret]",
    );
    const alignReferenceRect =
      caretElement?.getBoundingClientRect() ?? anchorRect;
    const menuRect = menuRef.current.getBoundingClientRect();
    const boundary = resolveBoundaryBounds();
    const zIndex = resolveAnchorLayerZIndex(anchorRef.current);
    const offset = 8;
    const minMargin = 8;

    const maxAllowedWidth = Math.max(120, boundary.width - minMargin * 2);
    const unclampedWidth =
      typeof width === "number"
        ? width
        : width === "trigger"
          ? Math.max(anchorRect.width, menuRect.width)
          : menuRect.width;
    const computedWidth = Math.min(unclampedWidth, maxAllowedWidth);
    const computedHeight = menuRect.height;

    const belowTop = anchorRect.bottom + offset;
    const aboveTop = anchorRect.top - offset - computedHeight;

    const overflowForTop = (top: number): number => {
      const overflowTop = Math.max(0, boundary.top + minMargin - top);
      const overflowBottom = Math.max(
        0,
        top + computedHeight - (boundary.bottom - minMargin),
      );
      return overflowTop + overflowBottom;
    };

    const chooseTop = (): { top: number; isTopSide: boolean } => {
      if (side === "top") return { top: aboveTop, isTopSide: true };
      if (side === "bottom") return { top: belowTop, isTopSide: false };

      const belowOverflow = overflowForTop(belowTop);
      const aboveOverflow = overflowForTop(aboveTop);
      if (aboveOverflow < belowOverflow)
        return { top: aboveTop, isTopSide: true };
      return { top: belowTop, isTopSide: false };
    };

    const verticalChoice = chooseTop();
    const clampedTop = Math.min(
      Math.max(verticalChoice.top, boundary.top + minMargin),
      Math.max(
        boundary.top + minMargin,
        boundary.bottom - computedHeight - minMargin,
      ),
    );

    const availableBelow = Math.max(
      120,
      boundary.bottom - minMargin - belowTop,
    );
    const availableAbove = Math.max(
      120,
      anchorRect.top - offset - (boundary.top + minMargin),
    );
    const nextMaxHeight = Math.max(
      120,
      Math.min(
        maxHeight,
        verticalChoice.isTopSide ? availableAbove : availableBelow,
      ),
    );

    const startLeft = alignReferenceRect.left;
    const endLeft = alignReferenceRect.right - computedWidth;
    const overflowForLeft = (left: number): number => {
      const overflowLeft = Math.max(0, boundary.left + minMargin - left);
      const overflowRight = Math.max(
        0,
        left + computedWidth - (boundary.right - minMargin),
      );
      return overflowLeft + overflowRight;
    };

    const preferredLeft = align === "start" ? startLeft : endLeft;
    const alternateLeft = align === "start" ? endLeft : startLeft;
    const leftCandidate =
      overflowForLeft(preferredLeft) <= overflowForLeft(alternateLeft)
        ? preferredLeft
        : alternateLeft;
    const clampedLeft = Math.min(
      Math.max(leftCandidate, boundary.left + minMargin),
      Math.max(
        boundary.left + minMargin,
        boundary.right - computedWidth - minMargin,
      ),
    );

    const nextStyle: React.CSSProperties = {
      top: `${clampedTop}px`,
      left: `${clampedLeft}px`,
      maxWidth: `${maxAllowedWidth}px`,
      zIndex,
    };

    if (typeof width === "number") {
      nextStyle.width = computedWidth;
    } else if (width === "trigger") {
      nextStyle.minWidth = computedWidth;
    }

    setComputedMaxHeight(nextMaxHeight);
    setStyle((prev) => {
      const prevTop = typeof prev?.top === "string" ? prev.top : "";
      const prevLeft = typeof prev?.left === "string" ? prev.left : "";
      const prevWidth =
        typeof prev?.width === "number" ? prev.width : undefined;
      const prevMinWidth =
        typeof prev?.minWidth === "number" ? prev.minWidth : undefined;
      const prevMaxWidth =
        typeof prev?.maxWidth === "string" ? prev.maxWidth : "";
      const prevZIndex =
        typeof prev?.zIndex === "number" ? prev.zIndex : undefined;

      if (
        prevTop === nextStyle.top &&
        prevLeft === nextStyle.left &&
        prevWidth === nextStyle.width &&
        prevMinWidth === nextStyle.minWidth &&
        prevMaxWidth === nextStyle.maxWidth &&
        prevZIndex === nextStyle.zIndex
      ) {
        return prev;
      }
      return nextStyle;
    });
  }, [align, anchorRef, maxHeight, open, side, width]);

  useLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    if (!open) return;

    let frame = 0;
    const scheduleUpdate = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        updatePosition();
        frame = 0;
      });
    };

    const handleResize = () => scheduleUpdate();
    const handleScroll = () => scheduleUpdate();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => scheduleUpdate())
        : undefined;

    if (resizeObserver) {
      if (anchorRef.current) resizeObserver.observe(anchorRef.current);
      if (menuRef.current) resizeObserver.observe(menuRef.current);
    }

    scheduleUpdate();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
      resizeObserver?.disconnect();
    };
  }, [anchorRef, open, updatePosition]);

  if (!open || !PORTAL_ROOT) {
    return null;
  }

  const resolvedStyle = style ?? { visibility: "hidden" };

  return createPortal(
    <div
      ref={menuRef}
      style={resolvedStyle}
      role="menu"
      aria-orientation="vertical"
      // Programmatic focus stop for the menu container (roving tabindex
      // lives on the menuitems) — required so the container is focusable
      // even though it is not in the tab order.
      tabIndex={-1}
      onKeyDown={handleMenuKeyDown}
      className={classNames(
        "fixed min-w-[10rem] overflow-hidden rounded-lg border border-neutral-200 bg-white/95 p-1 text-sm shadow-xl ring-1 ring-black/5 backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95",
        !style && "invisible opacity-0",
        className,
      )}
    >
      {/* Not a user interaction: this only stops click events inside the
          menu from bubbling to the document-level outside-click handler. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- propagation guard for the outside-click handler */}
      <ul
        className="overflow-auto"
        style={{ maxHeight: computedMaxHeight }}
        onClick={(event) => event.stopPropagation()}
      >
        {items.map((item, index) => (
          <li key={item.value}>
            <button
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={(event) => {
                event.stopPropagation();
                handleSelect(item);
              }}
              className={classNames(
                "flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
                item.disabled
                  ? "cursor-not-allowed opacity-50"
                  : item.danger
                    ? "text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                itemClassName,
              )}
            >
              {item.icon && (
                <span className="mt-0.5 flex h-4 w-4 items-center justify-center text-neutral-400 dark:text-neutral-300">
                  {typeof item.icon === "string"
                    ? renderIcon(item.icon, "sm")
                    : item.icon}
                </span>
              )}
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                  {item.label}
                </span>
                {item.description && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {item.description}
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>,
    PORTAL_ROOT,
  );
};

DropdownMenu.displayName = "DropdownMenu";

export default DropdownMenu;
