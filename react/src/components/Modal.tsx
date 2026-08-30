import classNames from "classnames";
import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useKitT } from "../i18n";
import {
  Loader,
  Tabs,
  type TabsProps,
  IconButton,
  Button,
  type ButtonColor,
  type ButtonProps,
  type ButtonVariant,
} from ".";
import Panel from "./Panel";
import { type Size as ModalSize } from "../theme";
import { DEFAULT_SURFACE_CORNER, getSurfaceTextTokens } from "../theme/Theme";
import type { TrueColor } from "../theme/Theme";
import type { PanelCorner, PanelSpecularMode, PanelVariant } from "./Panel";
import type { GlassOpacity, GlassVibrancy } from "../theme/glass";
import { type IconName } from "../icons/registry";
import { renderIcon } from "../utils/renderIcon";

type ModalActionsAlign = "start" | "center" | "end" | "between";

/** Where the dialog sits in the viewport before any dragging. */
export const MODAL_POSITIONS = [
  "center",
  "top",
  "bottom",
  "left",
  "right",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;
export type ModalPosition = (typeof MODAL_POSITIONS)[number];

const POSITION_CLASSES: Record<ModalPosition, string> = {
  center: "items-center justify-center",
  top: "items-start justify-center",
  bottom: "items-end justify-center",
  left: "items-center justify-start",
  right: "items-center justify-end",
  "top-left": "items-start justify-start",
  "top-right": "items-start justify-end",
  "bottom-left": "items-end justify-start",
  "bottom-right": "items-end justify-end",
};

/**
 * Every open dialog, innermost last. Escape used to be handled by a document
 * listener in *every* mounted Modal, so one key press closed the whole stack.
 */
const modalStack: string[] = [];

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Keeps the dialog at least this far inside the viewport when dragged. */
const DRAG_MARGIN = 48;

const sizePresets: Record<
  ModalSize,
  {
    width?: number;
    className: string;
  }
> = {
  xs: { width: 320, className: "sm:max-w-[320px]" },
  sm: { width: 400, className: "sm:max-w-[400px]" },
  md: { width: 600, className: "sm:max-w-[600px]" },
  lg: { width: 800, className: "sm:max-w-[800px]" },
  xl: { width: 1000, className: "sm:max-w-[1000px]" },
  xxl: { width: 1120, className: "sm:max-w-[1120px]" },
  "2xl": { width: 1120, className: "sm:max-w-[1120px]" },
  xxxl: { width: 1280, className: "sm:max-w-[1280px]" },
  "3xl": { width: 1280, className: "sm:max-w-[1280px]" },
  full: { className: "sm:max-w-none sm:w-full" },
};

const toCssDimension = (value?: number | string): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value === "number") {
    return `${value}px`;
  }
  return value;
};

const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

interface ModalActionsProps {
  children: ReactNode;
  align?: ModalActionsAlign;
  className?: string;
}

const alignmentClassMap: Record<ModalActionsAlign, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

const ModalActions: React.FC<ModalActionsProps> = ({
  children,
  align = "end",
  className,
}) => {
  const alignmentClass = alignmentClassMap[align] ?? alignmentClassMap.end;
  return (
    <div
      className={classNames(
        "flex w-full flex-wrap items-center gap-2",
        alignmentClass,
        className,
      )}
    >
      {children}
    </div>
  );
};

export interface ModalProps
  // `color` is omitted because `Panel` redefines it as a TrueColor; the plain
  // HTML attribute of the same name would collide when forwarded.
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "title" | "children" | "color"
  > {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: IconName | React.ReactElement;
  children: ReactNode;
  bodyHeader?: ReactNode;
  bodyClassName?: string;
  footer?: ReactNode;
  actions?: ReactNode;
  size?: ModalSize;
  maxWidth?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  backgroundClassName?: string;
  background_color?: string;
  darkOverlay?: boolean;
  dark_overlay?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  preventScroll?: boolean;
  overlayClassName?: string;
  showFooterDivider?: boolean;
  headerActions?: ButtonProps[];
  header_actions?: ButtonProps[];
  headerTabs?: TabsProps;
  /** @deprecated Declared but never read. Use `headerTabs`. */
  header_tabs?: TabsProps;
  loading?: boolean;
  loadingTitle?: ReactNode;
  loadingLabel?: ReactNode;
  hideCloseButton?: boolean;
  /** When provided, a back arrow button is shown on the left of the header. */
  onBack?: () => void;
  /** Tooltip for the back button. Defaults to "Go back". */
  backTooltip?: string;
  initialFocusRef?: React.RefObject<HTMLElement>;
  ariaLabel?: string;
  role?: "dialog" | "alertdialog";

  // ── Window behaviour ──────────────────────────────────────────────────────
  /**
   * Lets the dialog be dragged by its header, like a window.
   * @default true
   */
  draggable?: boolean;
  /** Where the dialog sits before it is dragged. @default "center" */
  position?: ModalPosition;
  /** Opens filling the whole viewport. */
  showMaximized?: boolean;
  /** Adds a maximise / restore toggle to the header. */
  showMaximizeButton?: boolean;
  /** Called whenever the maximised state changes. */
  onMaximizedChange?: (maximized: boolean) => void;
  /** Drops the header entirely — no title, no close button, no drag handle. */
  headless?: boolean;
  /**
   * On a narrow viewport, ignore `position`, dragging and the size preset and
   * fill the screen instead. A dialog dragged half off a phone is unusable.
   * @default true
   */
  responsive?: boolean;
  /** Width below which `responsive` takes over, in pixels. @default 640 */
  responsiveBreakpoint?: number;
  /**
   * Render the dialog inside this element rather than at the top of the
   * document.
   *
   * The overlay switches from `fixed` to `absolute`, so it fills the container
   * instead of the viewport — for a dialog that belongs to one widget and
   * should not escape it. The container needs a positioning context of its own
   * (`relative`), which is the caller's job.
   *
   * Dragging is disabled when this is set: a dialog scoped to a box that can
   * be dragged out of that box is a contradiction.
   */
  container?: HTMLElement | null;

  // ── Surface ───────────────────────────────────────────────────────────────
  /** Corner rounding. Defaults to the same scale the Panels use. */
  corner?: PanelCorner;
  /** Surface treatment, shared with `Panel`. @default "elevated" */
  variant?: PanelVariant;
  tone?: TrueColor;
  glassOpacity?: GlassOpacity;
  vibrancy?: GlassVibrancy;
  specularMode?: PanelSpecularMode;
  /** Icon for the maximise toggle. @default "Scale" */
  maximizeIcon?: IconName;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  bodyHeader,
  bodyClassName,
  footer,
  actions,
  size = "md",
  maxWidth,
  minWidth,
  minHeight,
  backgroundClassName,
  background_color,
  darkOverlay,
  dark_overlay,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  preventScroll = true,
  className,
  overlayClassName,
  style,
  headerActions,
  header_actions,
  headerTabs,
  // Destructured only so the deprecated alias cannot land on the DOM.
  header_tabs: _headerTabs,
  loading,
  loadingTitle,
  loadingLabel,
  hideCloseButton = false,
  onBack,
  backTooltip = "Go back",
  initialFocusRef,
  ariaLabel,
  role = "dialog",
  showFooterDivider,
  draggable = true,
  position = "center",
  showMaximized = false,
  showMaximizeButton = false,
  onMaximizedChange,
  headless = false,
  responsive = true,
  responsiveBreakpoint = 640,
  container,
  corner = DEFAULT_SURFACE_CORNER,
  variant = "elevated",
  tone = "neutral",
  glassOpacity,
  vibrancy,
  specularMode,
  maximizeIcon = "Scale",
  onMouseDown,
  onClick,
  onKeyDown,
  ...rest
}) => {
  const t = useKitT();
  const hasDom = isBrowser;
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const headingId = useId();
  const bodyId = useId();
  const instanceId = useId();

  const [maximized, setMaximized] = useState(showMaximized);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
  } | null>(null);

  // ── Responsive ────────────────────────────────────────────────────────────
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    if (!hasDom || !responsive) {
      setIsNarrow(false);
      return undefined;
    }
    const query = window.matchMedia(`(max-width: ${responsiveBreakpoint}px)`);
    const update = () => setIsNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [hasDom, responsive, responsiveBreakpoint]);

  /** Narrow viewports fill the screen; a dialog dragged half off a phone is unusable. */
  const isFullScreen = maximized || isNarrow;
  // A dialog scoped to a container that can be dragged out of that container
  // is a contradiction, so `container` disables it.
  const canDrag = draggable && !isFullScreen && !container;

  const toggleMaximized = useCallback(() => {
    setMaximized((previous) => {
      const next = !previous;
      onMaximizedChange?.(next);
      return next;
    });
    // Restoring should put the dialog back where `position` says, not where it
    // happened to be dragged to before it was maximised.
    setOffset({ x: 0, y: 0 });
  }, [onMaximizedChange]);

  // Reopening resets the window state, so a dialog never returns dragged
  // off-screen from a previous session.
  useEffect(() => {
    if (isOpen) {
      setMaximized(showMaximized);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, showMaximized]);

  // ── Dragging ──────────────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!canDrag || event.button !== 0) return;
      // Never start a drag from a control inside the header.
      if (
        (event.target as HTMLElement).closest(
          "button, a, input, select, textarea, [role='tab'], [data-no-drag]",
        )
      ) {
        return;
      }
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX - offset.x,
        startY: event.clientY - offset.y,
      };
    },
    [canDrag, offset.x, offset.y],
  );

  const handleDragMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      const rect = contentRef.current?.getBoundingClientRect();
      let nextX = event.clientX - drag.startX;
      let nextY = event.clientY - drag.startY;

      // Clamped so the dialog can never be dragged fully off-screen and
      // stranded — its header stays reachable.
      if (rect) {
        const minX = -(rect.left - offset.x) - rect.width + DRAG_MARGIN;
        const maxX = window.innerWidth - (rect.left - offset.x) - DRAG_MARGIN;
        const minY = -(rect.top - offset.y);
        const maxY = window.innerHeight - (rect.top - offset.y) - DRAG_MARGIN;
        nextX = Math.min(Math.max(nextX, minX), maxX);
        nextY = Math.min(Math.max(nextY, minY), maxY);
      }

      setOffset({ x: nextX, y: nextY });
    },
    [offset.x, offset.y],
  );

  const handleDragEnd = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (dragRef.current?.pointerId !== event.pointerId) return;
      event.currentTarget.releasePointerCapture(event.pointerId);
      dragRef.current = null;
    },
    [],
  );

  const isDarkOverlay = darkOverlay ?? dark_overlay ?? false;
  const footerContent = footer ?? actions;
  const effectiveHeaderActions = headerActions ?? header_actions ?? [];

  const tabsConfig = useMemo(() => {
    if (headerTabs) {
      return headerTabs;
    }
  }, [headerTabs]);

  const presetForSize =
    typeof size === "string" ? sizePresets[size] : undefined;
  const fallbackPreset = sizePresets.md;
  const resolvedPreset = presetForSize ?? fallbackPreset;
  const isFullWidth = size === "full";
  const explicitSize =
    typeof size === "number" ||
    (typeof size === "string" && presetForSize === undefined && !isFullWidth);
  const sizeClass = !explicitSize ? resolvedPreset.className : undefined;
  const presetWidth =
    !explicitSize && !isFullWidth ? resolvedPreset.width : undefined;
  const presetWidthValue = presetWidth
    ? toCssDimension(presetWidth)
    : undefined;
  const explicitWidthValue = explicitSize
    ? toCssDimension(size as number | string)
    : undefined;
  const resolvedMaxWidth =
    maxWidth !== undefined
      ? toCssDimension(maxWidth)
      : isFullWidth
        ? "100%"
        : (explicitWidthValue ?? presetWidthValue);
  const resolvedWidth = isFullWidth
    ? "100%"
    : explicitWidthValue
      ? `min(100%, ${explicitWidthValue})`
      : presetWidthValue
        ? `min(100%, ${presetWidthValue})`
        : undefined;

  // The dialog's own regions — the recessed body, the footer, the hairlines —
  // are painted here rather than left to the Panel, so they have to follow the
  // variant. An opaque `bg-neutral-50` over a glass card reads as a hole
  // punched through it: the header looked like glass and nothing else did.
  const surfaceTokens = getSurfaceTextTokens(variant);
  const isTranslucent = surfaceTokens.translucent;

  /** Slightly recessed area behind the body and footer. */
  const recessedClass = isTranslucent
    ? "bg-white/10 dark:bg-white/5"
    : "bg-neutral-50 dark:bg-neutral-800/60";
  /** Hairline between the dialog's regions. */
  const dividerClass = isTranslucent
    ? surfaceTokens.divider
    : "border-neutral-200/70 dark:border-neutral-700/60";

  const isContained = Boolean(container);
  const overlayClasses = classNames(
    isContained
      ? "absolute inset-0 z-40 flex overflow-y-auto"
      : "fixed inset-0 z-[1600] flex min-h-full overflow-y-auto",
    isFullScreen ? "p-0 sm:p-4" : "px-4 py-6 sm:px-8 sm:py-12",
    // `position` decides where the dialog sits; it was hardcoded to
    // start-then-centre.
    isFullScreen ? "items-stretch justify-center" : POSITION_CLASSES[position],
    isDarkOverlay ? "bg-neutral-950/70" : "bg-neutral-900/40",
    "backdrop-blur-sm",
    overlayClassName,
  );

  const contentClasses = classNames(
    "relative flex w-full flex-col",
    isFullScreen ? "h-full max-h-none" : "max-h-[90vh] sm:max-h-[85vh]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
    `focus-visible:ring-${tone === "neutral" ? "blue" : tone}-400`,
    !isFullScreen && sizeClass,
    backgroundClassName,
    background_color,
    className,
  );

  const showFooterDividerClass = showFooterDivider
    ? classNames("border-t", dividerClass)
    : "";

  const contentStyle: React.CSSProperties = {
    ...(offset.x || offset.y
      ? { transform: `translate(${offset.x}px, ${offset.y}px)` }
      : undefined),
    ...(isFullScreen
      ? { width: "100%", maxWidth: "none" }
      : {
          ...(resolvedWidth ? { width: resolvedWidth } : undefined),
          ...(resolvedMaxWidth ? { maxWidth: resolvedMaxWidth } : undefined),
        }),
    ...(minWidth !== undefined
      ? { minWidth: toCssDimension(minWidth) }
      : undefined),
    ...(minHeight !== undefined
      ? { minHeight: toCssDimension(minHeight) }
      : undefined),
    ...style,
  };

  const ariaLabelValue =
    ariaLabel ?? (typeof title === "string" ? title : undefined);
  const ariaLabelledBy = ariaLabelValue ? undefined : headingId;
  const ariaDescribedBy = description || bodyHeader ? bodyId : undefined;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!closeOnEsc || event.key !== "Escape") return;
      // Only the innermost dialog reacts. Every mounted Modal used to add its
      // own document listener, so one Escape closed the entire stack.
      if (modalStack[modalStack.length - 1] !== instanceId) return;
      event.preventDefault();
      onClose();
    },
    [closeOnEsc, onClose, instanceId],
  );

  // ── Stack registration ────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasDom || !isOpen) return undefined;
    modalStack.push(instanceId);
    return () => {
      const index = modalStack.indexOf(instanceId);
      if (index >= 0) modalStack.splice(index, 1);
    };
  }, [hasDom, isOpen, instanceId]);

  // ── Focus trap ────────────────────────────────────────────────────────────
  // `aria-modal="true"` promises focus stays inside; nothing enforced it, so
  // Tab walked straight out into the page behind the overlay.
  const handleTrapKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key !== "Tab") return;
      const root = contentRef.current;
      if (!root) return;

      // Filtering on `offsetParent` would be wrong twice over: it is `null`
      // for any `position: fixed` element, and always `null` without layout.
      // Hidden markers are what actually matter here.
      const focusable = [
        ...root.querySelectorAll<HTMLElement>(FOCUSABLE),
      ].filter(
        (element) =>
          !element.closest("[inert], [hidden], [aria-hidden='true']"),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        root.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === root)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [],
  );

  // Effect to handle initial focus
  useEffect(() => {
    if (!hasDom) {
      return;
    }

    if (isOpen) {
      previouslyFocusedRef.current =
        document.activeElement as HTMLElement | null;

      const focusTarget =
        initialFocusRef?.current ??
        (!hideCloseButton ? closeButtonRef.current : null) ??
        (contentRef.current as HTMLElement | null);

      // Use requestAnimationFrame to ensure the modal is rendered and refs are available
      const focusFrame = requestAnimationFrame(() => {
        focusTarget?.focus({ preventScroll: true });
      });

      return () => {
        cancelAnimationFrame(focusFrame);
      };
    }
  }, [hasDom, isOpen, hideCloseButton, initialFocusRef]); // Minimal dependencies to ensure focus only runs on open or relevant prop change that might affect focus target

  // Effect to handle event listeners and scroll locking
  useEffect(() => {
    if (!hasDom) {
      return;
    }

    if (isOpen) {
      if (closeOnEsc) {
        document.addEventListener("keydown", handleKeyDown);
      }

      if (preventScroll) {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
          document.removeEventListener("keydown", handleKeyDown);
          document.body.style.overflow = originalOverflow;
        };
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeOnEsc, handleKeyDown, hasDom, isOpen, preventScroll]);

  useEffect(() => {
    if (!hasDom) {
      return;
    }

    if (!isOpen && previouslyFocusedRef.current) {
      const node = previouslyFocusedRef.current;
      previouslyFocusedRef.current = null;
      node.focus({ preventScroll: true });
    }
  }, [hasDom, isOpen]);

  const handleBackdropMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!closeOnBackdropClick) {
        return;
      }
      if (event.target === event.currentTarget) {
        event.stopPropagation();
        onClose();
      }
    },
    [closeOnBackdropClick, onClose],
  );

  const handleContentMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onMouseDown?.(event);
    },
    [onMouseDown],
  );

  const handleContentClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      onClick?.(event);
    },
    [onClick],
  );

  const handleContentKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
    },
    [onKeyDown],
  );

  if (!hasDom || !isOpen) {
    return null;
  }

  const header = headless ? null : (
    <div
      // The drag handle. Pointer events, so a pen or touch works the same as a
      // mouse, and `setPointerCapture` keeps the drag alive when the cursor
      // outruns the header.
      onPointerDown={handleDragStart}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
      onPointerCancel={handleDragEnd}
      className={classNames(
        "flex shrink-0 items-start justify-between gap-4 border-b py-4 pl-4 pr-3",
        dividerClass,
        canDrag && "cursor-grab select-none active:cursor-grabbing",
      )}
    >
      {onBack && (
        <div className="flex shrink-0 items-center self-center">
          <IconButton
            icon="ArrowChevronLeft"
            variant="ghost"
            color="slate"
            size="sm"
            tooltip={backTooltip}
            tooltipPosition="bottom"
            aria-label={backTooltip}
            onClick={onBack}
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <div
              className={classNames(
                "flex shrink-0 items-center justify-center",
                surfaceTokens.muted,
              )}
            >
              {renderIcon(icon, "sm")}
            </div>
          )}
          <div className="min-w-0">
            <h2
              id={headingId}
              className={classNames(
                "truncate text-xl font-medium tracking-tight",
                surfaceTokens.heading,
              )}
            >
              {title}
            </h2>
          </div>
        </div>
        {description && (
          <p className={classNames("text-sm", surfaceTokens.description)}>
            {description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {effectiveHeaderActions.map((action, index) => (
          <Button key={`modal-header-action-${index}`} {...action} />
        ))}
        {showMaximizeButton && !isNarrow && (
          <IconButton
            icon={maximizeIcon}
            variant="ghost"
            color="slate"
            size="sm"
            aria-label={maximized ? "Restore dialog" : "Maximise dialog"}
            tooltip={maximized ? "Restore" : "Maximise"}
            aria-pressed={maximized}
            onClick={toggleMaximized}
          />
        )}
        {!hideCloseButton && (
          <IconButton
            ref={closeButtonRef}
            icon="Close"
            variant="ghost"
            color="slate"
            size="sm"
            aria-label={t("kit.modal.closeAria")}
            onClick={onClose}
          />
        )}
      </div>
    </div>
  );

  const content = (
    <div className={overlayClasses} onMouseDown={handleBackdropMouseDown}>
      <Panel
        // The dialog is a card, so it renders one — every surface, tone and
        // corner comes from the shared scale instead of a hardcoded
        // `rounded-[28px]` white box.
        ref={contentRef}
        variant={variant}
        tone={tone}
        corner={isFullScreen && isNarrow ? "none" : corner}
        padding="none"
        scrollable={false}
        // The dialog's own header / body / footer are a flex column, so the
        // Panel's children wrapper has to be one too — otherwise the body's
        // `flex-1` has no flex parent and a maximised dialog leaves the space
        // below its footer empty.
        flexBody
        bodyClassName="!space-y-0 !gap-0"
        glassOpacity={glassOpacity}
        vibrancy={vibrancy}
        specularMode={specularMode}
        className={contentClasses}
        style={contentStyle}
        role={role}
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabelValue}
        aria-describedby={ariaDescribedBy}
        aria-busy={loading ? "true" : undefined}
        tabIndex={-1}
        onMouseDown={handleContentMouseDown}
        onClick={handleContentClick}
        onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
          handleTrapKeyDown(event);
          handleContentKeyDown(event as React.KeyboardEvent<HTMLDivElement>);
        }}
        {...rest}
      >
        {header}

        {tabsConfig && (
          <div
            className={classNames("shrink-0 border-b px-6 py-2", dividerClass)}
          >
            <Tabs
              {...tabsConfig}
              className={classNames(
                "w-full overflow-x-auto",
                tabsConfig.className,
              )}
            />
          </div>
        )}

        {bodyHeader && (
          <div
            className={classNames(
              "shrink-0 border-b px-6 py-3",
              dividerClass,
              recessedClass,
            )}
          >
            {bodyHeader}
          </div>
        )}
        <div
          className={classNames(
            "relative flex min-h-0 flex-1 overflow-hidden",
            recessedClass,
          )}
        >
          {loading && (
            <Loader
              overlay
              title={loadingTitle}
              label={loadingLabel}
              className="z-30"
            />
          )}
          <div
            id={bodyId}
            className={classNames(
              "relative min-h-0 flex-1 overflow-y-auto px-6 py-5",
              "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent",
              bodyClassName,
              loading && "pointer-events-none",
            )}
          >
            <div className="flex flex-col gap-4">{children}</div>
          </div>
        </div>
        {footerContent && (
          <div
            className={classNames(
              "flex shrink-0 items-center justify-end gap-3 px-6 py-4",
              recessedClass,
              showFooterDividerClass,
            )}
          >
            {footerContent}
          </div>
        )}
      </Panel>
    </div>
  );

  return createPortal(content, container ?? document.body);
};

interface ConfirmModalProps extends Omit<
  ModalProps,
  "footer" | "actions" | "children" | "onClose" | "title"
> {
  title: ReactNode;
  children?: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  confirmVariant?: ButtonVariant;
  confirmColor?: ButtonColor;
  isConfirmDisabled?: boolean;
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  description?: ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
  confirmVariant = "solid",
  isConfirmDisabled = false,
  confirmButtonProps,
  cancelButtonProps,
  children,
  ...props
}) => {
  const t = useKitT();
  const resolvedConfirmLabel = confirmLabel ?? t("kit.modal.confirm");
  const resolvedCancelLabel = cancelLabel ?? t("kit.modal.cancel");
  return (
    <Modal
      {...props}
      onClose={onClose}
      footer={
        <ModalActions>
          <Button
            variant="soft"
            color="slate"
            onClick={onClose}
            {...cancelButtonProps}
          >
            {resolvedCancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            color={props.confirmColor || "blue"}
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            {...confirmButtonProps}
          >
            {resolvedConfirmLabel}
          </Button>
        </ModalActions>
      }
    >
      {children}
    </Modal>
  );
};

interface DeleteConfirmModalProps extends Omit<
  ConfirmModalProps,
  "confirmLabel" | "confirmVariant" | "confirmColor"
> {
  /** The exact string the user must type to enable the delete button. */
  confirmValue: string;
  /** Human-readable label shown in the instruction, e.g. "key name". Default: "name" */
  confirmValueLabel?: string;
  confirmLabel?: ReactNode;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  confirmValue,
  confirmValueLabel = "name",
  confirmLabel,
  onConfirm,
  onClose,
  isConfirmDisabled,
  children,
  cancelLabel,
  cancelButtonProps,
  confirmButtonProps,
  ...props
}) => {
  const t = useKitT();
  const resolvedConfirmLabel = confirmLabel ?? t("kit.modal.delete");
  const resolvedCancelLabel = cancelLabel ?? t("kit.modal.cancel");
  const resolvedConfirmValueLabel =
    confirmValueLabel ?? t("kit.modal.confirmValueLabel");
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isMatch = inputValue === confirmValue;

  useEffect(() => {
    if (!props.isOpen) setInputValue("");
  }, [props.isOpen]);

  return (
    <Modal
      {...props}
      onClose={onClose}
      role="alertdialog"
      initialFocusRef={inputRef as React.RefObject<HTMLElement>}
      footer={
        <ModalActions>
          <Button
            variant="soft"
            color="slate"
            onClick={onClose}
            {...cancelButtonProps}
          >
            {resolvedCancelLabel}
          </Button>
          <Button
            variant="solid"
            color="rose"
            onClick={onConfirm}
            disabled={!isMatch || isConfirmDisabled}
            {...confirmButtonProps}
          >
            {resolvedConfirmLabel}
          </Button>
        </ModalActions>
      }
    >
      {children}
      <div className="flex flex-col gap-2 pt-1">
        <label className="text-sm text-neutral-600 dark:text-neutral-400">
          {t("kit.modal.typeValuePrefix")} {resolvedConfirmValueLabel}{" "}
          <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
            {confirmValue}
          </span>{" "}
          {t("kit.modal.typeValueSuffix")}
        </label>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isMatch && !isConfirmDisabled) onConfirm();
          }}
          placeholder={confirmValue}
          className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-mono text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/30"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </Modal>
  );
};

interface ApplyConfirmModalProps extends Omit<
  ConfirmModalProps,
  "confirmLabel" | "confirmVariant" | "confirmColor"
> {
  /** The exact string the user must type to enable the apply button. */
  confirmValue: string;
  /** Human-readable label shown in the instruction, e.g. "key name". Default: "name" */
  confirmValueLabel?: string;
  confirmLabel?: ReactNode;
}

const ApplyConfirmModal: React.FC<ApplyConfirmModalProps> = ({
  confirmValue,
  confirmValueLabel = "name",
  confirmLabel,
  onConfirm,
  onClose,
  isConfirmDisabled,
  children,
  cancelLabel,
  cancelButtonProps,
  confirmButtonProps,
  ...props
}) => {
  const t = useKitT();
  const resolvedConfirmLabel = confirmLabel ?? t("kit.modal.apply");
  const resolvedCancelLabel = cancelLabel ?? t("kit.modal.cancel");
  const resolvedConfirmValueLabel =
    confirmValueLabel ?? t("kit.modal.confirmValueLabel");
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isMatch = inputValue === confirmValue;

  useEffect(() => {
    if (!props.isOpen) setInputValue("");
  }, [props.isOpen]);

  return (
    <Modal
      {...props}
      onClose={onClose}
      role="alertdialog"
      initialFocusRef={inputRef as React.RefObject<HTMLElement>}
      footer={
        <ModalActions>
          <Button
            variant="soft"
            color="slate"
            onClick={onClose}
            {...cancelButtonProps}
          >
            {resolvedCancelLabel}
          </Button>
          <Button
            variant="solid"
            color="blue"
            onClick={onConfirm}
            disabled={!isMatch || isConfirmDisabled}
            {...confirmButtonProps}
          >
            {resolvedConfirmLabel}
          </Button>
        </ModalActions>
      }
    >
      {children}
      <div className="flex flex-col gap-2 pt-1">
        <label className="text-sm text-neutral-600 dark:text-neutral-400">
          {t("kit.modal.typeValuePrefix")} {resolvedConfirmValueLabel}{" "}
          <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
            {confirmValue}
          </span>{" "}
          {t("kit.modal.typeValueSuffix")}
        </label>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isMatch && !isConfirmDisabled) onConfirm();
          }}
          placeholder={confirmValue}
          className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-mono text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </Modal>
  );
};

type ModalComponentType = typeof Modal & {
  Actions: typeof ModalActions;
  Confirm: typeof ConfirmModal;
  DeleteConfirm: typeof DeleteConfirmModal;
  ApplyConfirm: typeof ApplyConfirmModal;
};

(Modal as ModalComponentType).Actions = ModalActions;
(Modal as ModalComponentType).Confirm = ConfirmModal;
(Modal as ModalComponentType).DeleteConfirm = DeleteConfirmModal;
(Modal as ModalComponentType).ApplyConfirm = ApplyConfirmModal;

export { ModalActions, ConfirmModal, DeleteConfirmModal, ApplyConfirmModal };
export type {
  ModalActionsProps,
  DeleteConfirmModalProps,
  ApplyConfirmModalProps,
};
export default Modal as ModalComponentType;
