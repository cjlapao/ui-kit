import type React from "react";
import type { PanelProps } from "../Panel";
import type { ControlSize } from "../../theme/Theme";
import type { IconName } from "../../icons/registry";

export interface MenuItem {
  /** Unique across the entire menu tree. */
  id: string;
  type?: "item" | "group" | "separator" | "checkbox" | "radio" | "section";
  label?: React.ReactNode;
  /** Used for accessibility and typeahead when label is rich content. */
  textValue?: string;
  icon?: IconName | React.ReactElement;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  shortcut?: React.ReactNode;
  trailing?: React.ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  danger?: boolean;
  /** Per-row overrides of the menu item defaults. */
  tone?: PanelProps["tone"];
  padding?: PanelProps["padding"];
  corner?: PanelProps["corner"];
  items?: MenuItem[];
  /** Override the menu-level expansion mode for this parent. */
  submenuMode?: "inline" | "tiered";
  /** Custom section content or expandable detail (e.g. account usage). */
  content?: React.ReactNode;
  command?: (item: MenuItem) => void;
  /** Router link (requires a router provider). */
  to?: string;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  /** Controlled checked state. Radio exclusivity is managed by the consumer. */
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Checkbox/radio items stay open by default; commands close by default. */
  closeOnSelect?: boolean;
}
export interface MenuProps extends Pick<PanelProps, "variant" | "tone" | "corner" | "padding" | "glassOpacity" | "vibrancy" | "specularMode"> {
  items: MenuItem[];
  /** Inline by default. Supplying trigger or anchorRef makes it a popup. */
  popup?: boolean;
  trigger?: React.ReactElement;
  anchorRef?: React.RefObject<HTMLElement | null>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (item: MenuItem) => void;
  submenuMode?: "inline" | "tiered";
  expandedKeys?: string[];
  defaultExpandedKeys?: string[];
  onExpandedKeysChange?: (keys: string[]) => void;
  placement?: "top" | "bottom" | "left" | "right";
  size?: ControlSize;
  /** Row tone; defaults to the surface tone. Individual items may override it. */
  itemTone?: PanelProps["tone"];
  /** Row inset; omitted follows size. Separate from the menu surface padding. */
  itemPadding?: PanelProps["padding"];
  /** Row corners. @default "rounded-sm" (rounded-lg) */
  itemCorner?: PanelProps["corner"];
  width?: number | string;
  maxHeight?: number;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  renderItem?: (item: MenuItem, state: { expanded: boolean; checked: boolean }) => React.ReactNode;
  className?: string;
  "aria-label"?: string;
}
