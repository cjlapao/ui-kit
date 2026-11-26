import type React from "react";
import type { PanelProps } from "../Panel";
import type { ControlSize } from "../../theme/Theme";
import type { IconName } from "../../icons/registry";

export interface MenuItem {
  /** Unique across the entire menu tree. */
  id: string;
  /** `toggle` carries checkbox semantics (`checked`/`onCheckedChange`,
   * `menuitemcheckbox`) but draws a presentational switch at the row's end. */
  type?: "item" | "group" | "separator" | "checkbox" | "radio" | "toggle" | "section";
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
  /** Muted note rendered above this item's submenu list (inline or tiered). */
  submenuHeader?: React.ReactNode;
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
  /** End the menu interaction when this row activates. Explicit true closes
   * the whole menu at any depth; explicit false keeps this row exactly where
   * it is — including its open submenu. Unset: root rows close, plain rows
   * inside a submenu collapse their branch back to the root list (menu stays
   * open, focus returns to the opening row), and checkable rows stay put.
   * Overrides the menu-wide `closeOnSelect`. */
  closeOnSelect?: boolean;
}
export interface MenuProps extends Pick<PanelProps, "variant" | "tone" | "corner" | "padding" | "glassOpacity" | "transparency" | "vibrancy" | "specularMode" | "raisedSurface"> {
  items: MenuItem[];
  /** Inline by default. Supplying trigger or anchorRef makes it a popup. */
  popup?: boolean;
  trigger?: React.ReactElement;
  anchorRef?: React.RefObject<HTMLElement | null>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (item: MenuItem) => void;
  /**
   * Id of the selected item, at any depth. A matching row gets a right-aligned
   * check and `menuitemradio` semantics; a parent whose selection lives inside
   * it echoes the selected descendant's text right-aligned (before its chevron)
   * unless an explicit `trailing` is provided. Checkbox/radio rows keep their
   * own left-side checks — `checkable` types win on the same row.
   */
  selectedKey?: string;
  /** Paint the checked `type: "radio"` row with a faded wash of its own tone —
   * pale `bg-{c}-50` in light, sunk `dark:bg-{c}-900/20` in dark — so the
   * selection reads before the gutter dot is even noticed. The tone resolves
   * like the row's other tone-driven styles (`item.tone ?? itemTone ?? tone`,
   * "none" washes neutral, `danger` washes rose). The row's copy and its dot
   * take the tone too. Decorative only — `aria-checked` and the dot stay the
   * truth. @default false */
  washSelected?: boolean;
  /** Submenu presentation — a tiered popup flyout by default, `inline` expands in place. */
  submenuMode?: "inline" | "tiered";
  expandedKeys?: string[];
  defaultExpandedKeys?: string[];
  onExpandedKeysChange?: (keys: string[]) => void;
  /** Menu-wide default for the per-item `closeOnSelect` — false keeps the root
   * list open while rows activate (multi-pick panels, live previews). It does
   * not pin submenus: plain submenu rows still collapse their branch back to
   * the root list. */
  closeOnSelect?: boolean;
  placement?: "top" | "bottom" | "left" | "right";
  /**
   * Popup alignment with the anchor along the axis the placement runs away
   * from (left/right for `top`/`bottom`, top/bottom for `left`/`right`).
   * `"grow"` (default) pins the near edge and grows toward the room;
   * `"start"` pins the leading edges; `"end"` pins the trailing edges —
   * right-anchored kebab/caret menus stay flush right. Popup-only.
   */
  align?: "start" | "end" | "grow";
  size?: ControlSize;
  /** Row tone; defaults to the surface tone. Individual items may override it. */
  itemTone?: PanelProps["tone"];
  /** Compact menu inset scale (xs: p-1 sm:p-1.5); omitted follows size.
   * Separate from the menu surface padding. */
  itemPadding?: PanelProps["padding"];
  /** Row corners. @default "rounded-sm" (rounded-lg) */
  itemCorner?: PanelProps["corner"];
  /** Floor for the popup width; content may widen the menu up to `maxWidth`.
   * `"trigger"` floors it at the anchor's own width (legacy DropdownMenu's
   * `width: "trigger"`; inline menus ignore it and keep the 256 default).
   * Also the fixed width of inline menus that fit. @default 256 */
  width?: number | string | "trigger";
  /** Cap for content-driven popup growth (long titles/descriptions widen the
   * menu instead of clipping); the viewport always clamps on top
   * (100vw − 16px). @default 380 */
  maxWidth?: number;
  maxHeight?: number;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  renderItem?: (item: MenuItem, state: { expanded: boolean; checked: boolean }) => React.ReactNode;
  /** Inline surface styling, including shared motion custom properties. */
  style?: React.CSSProperties;
  className?: string;
  "aria-label"?: string;
}
