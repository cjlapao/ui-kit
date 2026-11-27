import React, { useState } from "react";
import classNames from "classnames";
import Button from "../Button";
import Pill from "../Pill";
import Menu from "../Menu";
import { cssLength, hasCssLength } from "../../../../common/utils/cssLength";
import type { MenuButtonPillConfig, MenuButtonProps } from "./types";

export type { MenuButtonPillConfig, MenuButtonProps } from "./types";

const isPillConfig = (pill: React.ReactNode | MenuButtonPillConfig): pill is MenuButtonPillConfig =>
  !React.isValidElement(pill) && typeof pill === "object" && pill !== null && "label" in pill;

// The pill and the caret are furniture on the right edge; the text is what
// flexes. Wrapping a raw node keeps `shrink-0` honest for both pill forms —
// in a flex row an unwrapped node shrinks with everything else.
const renderPill = (pill: React.ReactNode | MenuButtonPillConfig) => {
  if (!isPillConfig(pill)) return <span className="inline-flex shrink-0 items-center">{pill}</span>;
  const { label, ...pillProps } = pill;
  return <Pill size="sm" {...pillProps} className={classNames("shrink-0", pillProps.className)}>{label}</Pill>;
};

/**
 * How the stacked title/subtitle sit inside the trigger. The caret and pill
 * stay pinned to the right edge in all three — `align` moves the copy, never
 * the affordance that opens the menu, so a right-aligned picker still has its
 * chevron exactly where every other picker's chevron is.
 */
const ALIGN_CLASSES: Record<NonNullable<MenuButtonProps["align"]>, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

/**
 * A Button trigger with icon, stacked title/subtitle, trailing pill and caret,
 * wired to a Menu popup — the Claude-style model picker. Composes the kit's
 * own Button and Menu (popup mode), so keyboard activation, outside dismiss,
 * typeahead, tiered/inline submenus, selection checks and viewport-aware
 * flip/clamp/scroll positioning all come from them unchanged.
 *
 * Selection is one prop: `selectedKey` renders the check on the matching row
 * at any depth and echoes the selected descendant's label on its parent row.
 *
 * Layout: the title/subtitle column is the only flexible child, so the pill
 * and caret hold the right edge at any `width` and `align` only moves the
 * copy. While the popup is open the trigger keeps its hover paint (Button
 * reads `aria-expanded`, which Menu sets) and its tooltip stands down — both
 * for free, no prop to remember.
 */
export function MenuButton({
  icon,
  title,
  subtitle,
  pill,
  caret = true,
  caretIcon = "ArrowDown",
  align = "left",
  width,
  maxWidth,
  items,
  selectedKey,
  washSelected,
  submenuMode,
  closeOnSelect,
  onSelect,
  open,
  defaultOpen,
  onOpenChange,
  expandedKeys,
  defaultExpandedKeys,
  onExpandedKeysChange,
  renderItem,
  itemTone,
  itemPadding,
  itemCorner,
  menuAlign,
  menuWidth,
  menuMaxWidth,
  menuMaxHeight,
  menuPlacement,
  menuVariant,
  menuTone,
  menuPadding,
  menuCorner,
  menuGlassOpacity,
  menuTransparency,
  menuVibrancy,
  menuSpecularMode,
  menuHeader,
  menuFooter,
  menuClassName,
  menuStyle,
  ...buttonProps
}: MenuButtonProps) {
  // The trigger's tooltip must know when the popup is open — mirroring the
  // menu's open state keeps that correct even for the uncontrolled menu.
  const [mirrorOpen, setMirrorOpen] = useState(defaultOpen ?? false);
  const isOpen = open ?? mirrorOpen;
  // `width`/`maxWidth` sit on top of a caller's own `style`. The text column
  // already carries `min-w-0` and each line `truncate`, so the narrower box
  // clips the title with an ellipsis instead of shoving the icon, pill and
  // caret outside — a picker pinned to 12rem stays a picker pinned to 12rem.
  const triggerStyle =
    !hasCssLength(width, maxWidth)
      ? buttonProps.style
      : {
          ...buttonProps.style,
          width: cssLength(width),
          maxWidth: cssLength(maxWidth),
        };
  const trigger = (
    <Button
      {...buttonProps}
      style={triggerStyle}
      tooltipDisabled={isOpen || buttonProps.tooltipDisabled}
      leadingIcon={icon}
      trailingIcon={caret ? caretIcon : undefined}
    >
      <span className={classNames("flex min-w-0 flex-1 flex-col leading-tight", ALIGN_CLASSES[align])}>
        <span className="w-full min-w-0 truncate font-semibold">{title}</span>
        {subtitle != null && (
          <span className="w-full min-w-0 truncate text-xs font-normal opacity-70">{subtitle}</span>
        )}
      </span>
      {pill != null && renderPill(pill)}
    </Button>
  );
  return (
    <Menu
      trigger={trigger}
      items={items}
      selectedKey={selectedKey}
      washSelected={washSelected}
      submenuMode={submenuMode}
      closeOnSelect={closeOnSelect}
      onSelect={onSelect}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(value) => {
        setMirrorOpen(value);
        onOpenChange?.(value);
      }}
      expandedKeys={expandedKeys}
      defaultExpandedKeys={defaultExpandedKeys}
      onExpandedKeysChange={onExpandedKeysChange}
      renderItem={renderItem}
      itemTone={itemTone}
      itemPadding={itemPadding}
      itemCorner={itemCorner}
      width={menuWidth}
      maxWidth={menuMaxWidth}
      maxHeight={menuMaxHeight}
      placement={menuPlacement}
      align={menuAlign}
      variant={menuVariant}
      tone={menuTone}
      padding={menuPadding}
      corner={menuCorner}
      glassOpacity={menuGlassOpacity}
      transparency={menuTransparency}
      vibrancy={menuVibrancy}
      specularMode={menuSpecularMode}
      header={menuHeader}
      footer={menuFooter}
      className={menuClassName}
      style={menuStyle}
      aria-label={typeof title === "string" ? title : undefined}
    />
  );
}

export default MenuButton;
