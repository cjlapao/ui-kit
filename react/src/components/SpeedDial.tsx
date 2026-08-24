import React, { useEffect, useId, useRef, useState } from "react";
import classNames from "classnames";
import IconButton from "./IconButton";
import {
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from "./Button";
import { type IconName } from "../icons/registry";
import {
  type GlassOpacity,
  type GlassVibrancy,
  type SpecularMode,
} from "../theme/glass";

export type SpeedDialType = "linear" | "semi-circle" | "quarter-circle" | "circle";
export type SpeedDialDirection =
  | "up"
  | "down"
  | "left"
  | "right"
  | "up-left"
  | "up-right"
  | "down-left"
  | "down-right";

export interface SpeedDialItem {
  icon: IconName | React.ReactElement;
  label?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  /** Overrides the dial-level `itemVariant` for this button. */
  variant?: ButtonVariant;
  /** Overrides the dial-level `itemColor` for this button. */
  color?: ButtonColor;
  /** Overrides the dial-level `itemSize` for this button. */
  size?: ButtonSize;
}

export interface SpeedDialProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  items: SpeedDialItem[];
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  type?: SpeedDialType;
  direction?: SpeedDialDirection;
  radius?: number;
  transitionDelay?: number;
  mask?: boolean;
  disabled?: boolean;
  hideOnClickOutside?: boolean;
  showLabels?: boolean;
  mainIcon?: IconName | React.ReactElement;
  expandedIcon?: IconName | React.ReactElement;
  rotateAnimation?: boolean;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  itemVariant?: ButtonVariant;
  itemColor?: ButtonColor;
  itemSize?: ButtonSize;
  /** Backdrop vibrancy of a glass main button. */
  vibrancy?: GlassVibrancy;
  /** Glass fill transparency of a glass main button. */
  glassOpacity?: GlassOpacity;
  /** Specular highlight of a glass main button. */
  specularMode?: SpecularMode;
}

const GAP = 8;
const SIZE_PX: Record<ButtonSize, number> = {
  xs: 28,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
};

const VALID_DIRECTIONS: Record<SpeedDialType, SpeedDialDirection[]> = {
  linear: ["up", "down", "left", "right"],
  "semi-circle": ["up", "down", "left", "right"],
  "quarter-circle": ["up-left", "up-right", "down-left", "down-right"],
  circle: [
    "up",
    "down",
    "left",
    "right",
    "up-left",
    "up-right",
    "down-left",
    "down-right",
  ],
};

const FALLBACK_DIRECTIONS: Record<SpeedDialType, SpeedDialDirection> = {
  linear: "up",
  "semi-circle": "up",
  "quarter-circle": "up-right",
  circle: "up",
};

const toRad = (deg: number): number => (deg * Math.PI) / 180;
const fmt = (value: number): string => `${Math.round(value * 100) / 100}px`;

const arcFor = (
  type: SpeedDialType,
  direction: SpeedDialDirection,
): [number, number] => {
  if (type === "semi-circle") {
    if (direction === "down") return [180, 360];
    if (direction === "left") return [90, 270];
    if (direction === "right") return [270, 90];
    return [180, 0];
  }
  if (type === "quarter-circle") {
    if (direction === "up-left") return [90, 180];
    if (direction === "down-left") return [180, 270];
    if (direction === "down-right") return [0, -90];
    return [90, 0];
  }
  return [90, -270];
};

const autoRadius = (
  type: SpeedDialType,
  total: number,
  unit: number,
): number => {
  if (total <= 1) return unit;
  if (type === "circle") return (unit * 1.15) / (2 * Math.sin(Math.PI / total));
  const step = type === "semi-circle" ? Math.PI / (2 * (total - 1)) : Math.PI / (4 * (total - 1));
  return (unit * 1.15) / (2 * Math.sin(step));
};

const itemOffset = (
  index: number,
  total: number,
  type: SpeedDialType,
  direction: SpeedDialDirection,
  unit: number,
  radius?: number,
): { x: number; y: number } => {
  if (type === "linear") {
    const d = (index + 1) * unit;
    if (direction === "up") return { x: 0, y: -d };
    if (direction === "down") return { x: 0, y: d };
    if (direction === "left") return { x: -d, y: 0 };
    return { x: d, y: 0 };
  }

  const R = radius && radius > 0 ? radius : autoRadius(type, total, unit);
  let angle: number;
  if (type === "circle") {
    angle = 90 - (360 / total) * index;
  } else {
    const [start, end] = arcFor(type, direction);
    angle = total > 1 ? start + ((end - start) * index) / (total - 1) : (start + end) / 2;
  }
  return {
    x: R * Math.cos(toRad(angle)),
    y: -R * Math.sin(toRad(angle)),
  };
};

const SpeedDial: React.FC<SpeedDialProps> = ({
  items,
  visible,
  defaultVisible = false,
  onVisibleChange,
  type = "linear",
  direction = "up",
  radius = 0,
  transitionDelay = 30,
  mask = false,
  disabled = false,
  hideOnClickOutside = true,
  showLabels = true,
  mainIcon = "Add",
  expandedIcon,
  rotateAnimation = true,
  variant = "solid",
  color = "blue",
  size = "lg",
  itemVariant,
  itemColor,
  itemSize,
  vibrancy,
  glassOpacity,
  specularMode,
  className,
  ...rest
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mainButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuId = useId();
  const { "aria-label": ariaLabel, ...divRest } = rest;

  const isControlled = visible !== undefined;
  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const expanded = isControlled ? visible : internalVisible;

  const setExpanded = (next: boolean) => {
    if (!isControlled) setInternalVisible(next);
    onVisibleChange?.(next);
  };

  const toggle = () => {
    if (disabled) return;
    setExpanded(!expanded);
  };

  const effectiveDirection = VALID_DIRECTIONS[type].includes(direction)
    ? direction
    : FALLBACK_DIRECTIONS[type];

  // Spacing is driven by the largest button in play (main or any item) so a
  // single oversized item never collides with its neighbours.
  const unit =
    Math.max(
      SIZE_PX[size] ?? SIZE_PX.lg,
      ...items.map((item) => SIZE_PX[item.size ?? size] ?? SIZE_PX.lg),
    ) + GAP;
  const resolvedItemSize = itemSize ?? size;
  const resolvedItemVariant = itemVariant ?? (variant === "glass" ? "glass" : "soft");
  const resolvedItemColor = itemColor ?? color;
  const labelOnTop = effectiveDirection === "left" || effectiveDirection === "right";

  useEffect(() => {
    if (!expanded || !hideOnClickOutside) return undefined;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, hideOnClickOutside]);

  useEffect(() => {
    if (!expanded) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
        mainButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const mainIconClass =
    rotateAnimation && !expandedIcon
      ? classNames(
          "transition-transform duration-200",
          expanded && "rotate-45",
        )
      : undefined;

  // The root is the positioning context for the items, but a consumer that
  // places the dial (`absolute bottom-6 right-6`) must win over it.
  const positioned =
    className != null &&
    /(^|\s)(absolute|relative|fixed|sticky)(\s|$)/.test(className);

  return (
    <div
      ref={rootRef}
      className={classNames("z-50", !positioned && "relative", className)}
      {...divRest}
    >
      {mask && expanded && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setExpanded(false)}
          aria-hidden="true"
        />
      )}

      <IconButton
        ref={mainButtonRef}
        icon={expanded && expandedIcon ? expandedIcon : mainIcon}
        size={size}
        variant={variant}
        color={color}
        rounded="full"
        disabled={disabled}
        srLabel={ariaLabel ?? "Actions"}
        aria-haspopup="menu"
        aria-expanded={expanded}
        aria-controls={menuId}
        onClick={toggle}
        iconClassName={mainIconClass}
        vibrancy={vibrancy}
        glassOpacity={glassOpacity}
        specularMode={specularMode}
        className="relative z-20"
      />

      <div role="menu" id={menuId} className="absolute inset-0 pointer-events-none">
        {items.map((item, index) => {
          const { x, y } = itemOffset(
            index,
            items.length,
            type,
            effectiveDirection,
            unit,
            radius,
          );
          const delay = `${index * transitionDelay}ms`;
          const labelVisible = showLabels && !!item.label && (type === "circle" ? false : expanded);

          return (
            <div
              key={index}
              className="group absolute top-1/2 left-1/2"
              style={{
                transform: `translate(-50%, -50%) translate(${fmt(x)}, ${fmt(y)}) scale(${expanded ? 1 : 0})`,
                opacity: expanded ? 1 : 0,
                transition:
                  "transform 200ms cubic-bezier(0.34, 1.3, 0.5, 1), opacity 150ms ease",
                transitionDelay: expanded ? delay : "0ms",
                pointerEvents: expanded ? "auto" : "none",
              }}
            >
              <IconButton
                icon={item.icon}
                size={item.size ?? resolvedItemSize}
                variant={item.variant ?? resolvedItemVariant}
                color={item.color ?? resolvedItemColor}
                rounded="full"
                disabled={item.disabled}
                srLabel={item.label ?? `Action ${index + 1}`}
                role="menuitem"
                onClick={(event) => {
                  item.onClick?.(event);
                  setExpanded(false);
                }}
                className="pointer-events-auto"
              />
              {showLabels && item.label && (
                <span
                  className={classNames(
                    "pointer-events-none absolute whitespace-nowrap rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-neutral-700 shadow-sm ring-1 ring-black/5 transition-opacity duration-150 dark:bg-neutral-800/95 dark:text-neutral-200 dark:ring-white/10",
                    labelOnTop
                      ? "bottom-full left-1/2 -translate-x-1/2 mb-2"
                      : "right-full top-1/2 -translate-y-1/2 mr-2",
                    type === "circle"
                      ? "opacity-0 group-hover:opacity-100"
                      : labelVisible
                        ? "opacity-100"
                        : "opacity-0",
                  )}
                  style={{ transitionDelay: expanded ? delay : "0ms" }}
                >
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpeedDial;
