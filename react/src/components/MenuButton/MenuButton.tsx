import React, { useState } from "react";
import Button from "../Button";
import Pill from "../Pill";
import Menu from "../Menu";
import type { MenuButtonPillConfig, MenuButtonProps } from "./types";

export type { MenuButtonPillConfig, MenuButtonProps } from "./types";

const isPillConfig = (pill: React.ReactNode | MenuButtonPillConfig): pill is MenuButtonPillConfig =>
  !React.isValidElement(pill) && typeof pill === "object" && pill !== null && "label" in pill;

const renderPill = (pill: React.ReactNode | MenuButtonPillConfig) => {
  if (!isPillConfig(pill)) return pill;
  const { label, ...pillProps } = pill;
  return <Pill size="sm" {...pillProps}>{label}</Pill>;
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
 */
export function MenuButton({
  icon,
  title,
  subtitle,
  pill,
  caret = true,
  caretIcon = "ArrowDown",
  items,
  selectedKey,
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
  menuWidth,
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
  const trigger = (
    <Button {...buttonProps} tooltipDisabled={isOpen || buttonProps.tooltipDisabled} leadingIcon={icon} trailingIcon={caret ? caretIcon : undefined}>
      <span className="flex min-w-0 flex-col items-start leading-tight">
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
      maxHeight={menuMaxHeight}
      placement={menuPlacement}
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
