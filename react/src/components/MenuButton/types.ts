import type React from "react";
import type { ButtonProps } from "../Button";
import type { PillProps } from "../Pill";
import type { MenuItem, MenuProps } from "../Menu";
import type { IconName } from "../../icons/registry";

/** Declarative form of `MenuButtonProps.pill` — maps straight onto `Pill`. */
export interface MenuButtonPillConfig extends Omit<PillProps, "children" | "label"> {
  /** Pill content — rendered as the Pill's children. */
  label: React.ReactNode;
}

/**
 * A `Button` trigger with structured slots (icon, stacked title/subtitle,
 * trailing pill, caret) wired to a `Menu` popup — the model-picker pattern.
 * Button vocabulary wins name collisions; every Menu-specific prop is
 * prefixed `menu*` (the DropdownButton `menuWidth`/`menuClassName` precedent).
 */
export interface MenuButtonProps
  extends Omit<ButtonProps, "children" | "leadingIcon" | "trailingIcon" | "iconOnly" | "width" | "onSelect" | "title"> {
  // ---- trigger slots ----
  /** Leading glyph: kit icon name or element. Rendered via Button's leadingIcon slot. */
  icon?: IconName | React.ReactElement;
  /** Bold first line of the trigger. */
  title: React.ReactNode;
  /** Muted line under the title. */
  subtitle?: React.ReactNode;
  /** Trailing pill. A ReactNode renders verbatim; the config form maps to `Pill`. */
  pill?: React.ReactNode | MenuButtonPillConfig;
  /** Trailing caret on the trigger. @default true */
  caret?: boolean;
  /** Caret glyph. @default "ArrowDown" */
  caretIcon?: string | React.ReactElement;
  /** How the stacked title and subtitle sit inside the trigger. The caret (and
   * the pill) are pinned to the right edge in all three — `align` moves the
   * copy, never the affordance that opens the menu — so a column of pickers
   * keeps its chevrons on one line however the labels are set. Widening the
   * trigger with `width`/`maxWidth` is what gives the setting room to read:
   * at content width there is no spare space to align within. @default "left" */
  align?: "left" | "center" | "right";
  /** CSS width of the trigger — a number is px, a string is any CSS length
   * (`"12rem"`, `"100%"`). Applied as an inline style on top of any `style` you
   * pass, so a column of pickers lines up on one edge: the stacked title and
   * subtitle ellipsize rather than pushing the icon, pill and caret outside the
   * box, which is what keeps a fixed-width trigger from growing on a long name. */
  width?: number | string;
  /** Cap on a content-sized trigger — a number is px. Long titles ellipsize at
   * this width instead of widening the trigger past the row it belongs to. */
  maxWidth?: number | string;
  // ---- menu vocabulary (passed through to Menu) ----
  /** Menu tree — rows carry icons, labels, descriptions, badges, sub-items. */
  items: MenuItem[];
  /** Selected item id at any depth: right-aligned check + parent value echo. */
  selectedKey?: string;
  /** Faded tone wash on the checked radio row. Passed through to `Menu`. */
  washSelected?: MenuProps["washSelected"];
  submenuMode?: MenuProps["submenuMode"];
  /** Menu-wide default for the per-item closeOnSelect flag. */
  closeOnSelect?: MenuProps["closeOnSelect"];
  onSelect?: (item: MenuItem) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  expandedKeys?: string[];
  defaultExpandedKeys?: string[];
  onExpandedKeysChange?: (keys: string[]) => void;
  renderItem?: MenuProps["renderItem"];
  itemTone?: MenuProps["itemTone"];
  itemPadding?: MenuProps["itemPadding"];
  itemCorner?: MenuProps["itemCorner"];
  // ---- menu surface ----
  /** Popup alignment with the trigger. `"end"` keeps a right-anchored trigger's
   * menu flush right; @default "grow" (Menu's). */
  menuAlign?: MenuProps["align"];
  /** Minimum popup width (floor); content widens the menu up to `menuMaxWidth`.
   * `"trigger"` floors at the trigger's own width. @default 256 (Menu's) */
  menuWidth?: MenuProps["width"];
  /** Cap for content-driven popup growth; the viewport clamp always applies on top. @default 380 (Menu's) */
  menuMaxWidth?: number;
  /** Upper bound on the popup's scroll area; the viewport cap always applies on top. */
  menuMaxHeight?: number;
  /** Preferred side. Flip/clamp collision handling is always on. @default "bottom" */
  menuPlacement?: MenuProps["placement"];
  menuVariant?: MenuProps["variant"];
  menuTone?: MenuProps["tone"];
  menuPadding?: MenuProps["padding"];
  menuCorner?: MenuProps["corner"];
  menuGlassOpacity?: MenuProps["glassOpacity"];
  menuTransparency?: MenuProps["transparency"];
  menuVibrancy?: MenuProps["vibrancy"];
  menuSpecularMode?: MenuProps["specularMode"];
  menuHeader?: React.ReactNode;
  menuFooter?: React.ReactNode;
  menuClassName?: string;
  menuStyle?: React.CSSProperties;
}
