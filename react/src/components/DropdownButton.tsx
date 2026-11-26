import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import Button, { type ButtonProps, type ButtonSize } from "./Button";
import type { ButtonVariant } from "../theme/Theme";
import DropdownMenu, { type DropdownMenuOption } from "./DropdownMenu";
import { cssLength, hasCssLength } from "../../../common/utils/cssLength";
import { useKitT } from "../i18n";

export interface DropdownButtonOption extends DropdownMenuOption {
  value: string;
}

export interface DropdownButtonProps
  extends Omit<
    ButtonProps,
    "children" | "leadingIcon" | "trailingIcon" | "iconOnly" | "fullWidth"
  > {
  label: React.ReactNode;
  options: DropdownButtonOption[];
  /**
   * The Button vocabulary, minus `clear`: a borderless button has no surface
   * for the caret seam to live on, so the split would render as text with a
   * mystery box next to it. Passing `clear` (JS callers) falls back to
   * `ghost`, the nearest thing that still reads as one control.
   * @default "solid"
   */
  variant?: Exclude<ButtonVariant, "clear">;
  onPrimaryClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onOptionSelect?: (option: DropdownButtonOption) => void;
  dropdownIcon?: ButtonProps["leadingIcon"];
  fullWidth?: boolean;
  split?: boolean;
  /**
   * Hide the dropdown caret trigger when there are no menu options.
   * Defaults to true so empty split buttons render as a single clean button.
   */
  hideDropdownTriggerWhenEmpty?: boolean;
  menuWidth?: number | "trigger";
  menuClassName?: string;
  /**
   * CSS width of the whole control — main button and caret together. A number
   * is px, a string any CSS length. The label ellipsizes inside it rather than
   * pushing the control wider, so a toolbar row of split buttons keeps one
   * clean edge; pair it with `menuWidth="trigger"` to floor the popup at that
   * width. Applied as an inline style on the container, over any `className`
   * width. (The HTML `width` attribute a bare `width` prop used to reach is
   * meaningless on a `<button>`, which is why this is the only width here.)
   */
  width?: number | string;
  /**
   * Cap on a content-sized control — a number is px. Long labels ellipsize at
   * this width instead of widening the control past the row it belongs to.
   */
  maxWidth?: number | string;
  /**
   * Accessible name for the caret button.
   * @default t("kit.dropdownbutton.toggle")
   */
  caretLabel?: string;
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  label,
  options,
  onPrimaryClick,
  onOptionSelect,
  dropdownIcon = "ArrowDown",
  variant = "solid",
  color = "blue",
  size = "md",
  className,
  disabled,
  fullWidth = false,
  split = true,
  hideDropdownTriggerWhenEmpty = true,
  menuWidth = 220,
  menuClassName,
  width,
  maxWidth,
  caretLabel,
  ...buttonProps
}) => {
  const t = useKitT();
  const [open, setOpen] = useState(false);
  // `clear` is excluded by the type; coerce it anyway for JS callers, so a
  // borderless split can never ship.
  const safeVariant: ButtonVariant =
    (variant as ButtonVariant) === "clear" ? "ghost" : (variant as ButtonVariant);
  const caretRef = useRef<HTMLButtonElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const containerClasses = classNames(
    "inline-flex items-stretch",
    fullWidth && "w-full",
    className,
  );

  const handleSelect = (option: DropdownButtonOption) => {
    onOptionSelect?.(option);
    setOpen(false);
  };

  const { onClick: restOnClick, ...restButtonProps } = buttonProps;

  const handlePrimaryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    restOnClick?.(event);
    onPrimaryClick?.(event);
  };

  const handleCaretToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen((prev) => !prev);
  };

  const menuOptions = useMemo(() => options ?? [], [options]);
  const hasOptions = menuOptions.length > 0;
  const showCaret = hasOptions || !hideDropdownTriggerWhenEmpty;
  const menuOpen = open && hasOptions && showCaret;
  // Only a sized control pays for the shrink chain: `min-w-0` on the main
  // button (the flex item) plus `truncate` on the label is what makes a long
  // label ellipsize instead of widening the control past the row. Left alone
  // otherwise, so an unsized control keeps its exact DOM and wrapping.
  const sized = hasCssLength(width, maxWidth);

  useEffect(() => {
    if (!hasOptions && open) {
      setOpen(false);
    }
  }, [hasOptions, open]);

  const caretWidthMap: Record<ButtonSize, string> = {
    xs: "min-w-[2rem]",
    sm: "min-w-[2.25rem]",
    md: "min-w-[2.5rem]",
    lg: "min-w-[2.75rem]",
    xl: "min-w-[3rem]",
  };

  const caretIconClassMap: Record<ButtonSize, string> = {
    xs: "[&>svg]:h-3 [&>svg]:w-3 [&>svg]:min-w-[0.75rem]",
    sm: "[&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:min-w-[0.875rem]",
    md: "[&>svg]:h-4 [&>svg]:w-4 [&>svg]:min-w-4",
    lg: "[&>svg]:h-4.5 [&>svg]:w-4.5 [&>svg]:min-w-[1.125rem]",
    xl: "[&>svg]:h-5 [&>svg]:w-5 [&>svg]:min-w-[1.25rem]",
  };

  const renderCaretButton = () => (
    <Button
      ref={caretRef as React.Ref<HTMLButtonElement>}
      type="button"
      variant={safeVariant}
      color={color}
      size={size}
      iconOnly
      aria-label={caretLabel ?? t("kit.dropdownbutton.toggle")}
      aria-haspopup="menu"
      aria-expanded={menuOpen}
      leadingIcon={dropdownIcon}
      data-dropdown-caret
      className={classNames(
        "rounded-l-none border-l border-white/20 text-inherit dark:border-white/10",
        split && caretWidthMap[size],
        caretIconClassMap[size],
      )}
      onClick={handleCaretToggle}
      disabled={disabled || options.length === 0}
    />
  );

  const mainButton = (
    <Button
      type="button"
      variant={safeVariant}
      color={color}
      size={size}
      className={classNames(
        split && showCaret && "rounded-r-none",
        fullWidth ? "flex-1" : "",
        sized && "min-w-0",
      )}
      disabled={disabled}
      onClick={handlePrimaryClick}
      {...restButtonProps}
      // The open popup owns the space under the trigger now; a tip left
      // floating there (portal, z 9999) would sit over the rows. Same rule
      // `MenuButton` follows — and it wins over a caller's `false`, which
      // cannot mean "show it anyway while the menu is up".
      tooltipDisabled={menuOpen || restButtonProps.tooltipDisabled}
    >
      {sized ? <span className="min-w-0 truncate">{label}</span> : label}
    </Button>
  );

  return (
    <div
      ref={anchorRef}
      className={containerClasses}
      style={
        sized
          ? { width: cssLength(width), maxWidth: cssLength(maxWidth) }
          : undefined
      }
    >
      {mainButton}
      {showCaret ? renderCaretButton() : null}
      <DropdownMenu
        anchorRef={anchorRef}
        open={menuOpen}
        onClose={() => setOpen(false)}
        items={menuOptions}
        onSelect={handleSelect}
        width={menuWidth}
        align="end"
        side="auto"
        className={menuClassName}
      />
    </div>
  );
};

DropdownButton.displayName = "DropdownButton";

export default DropdownButton;
