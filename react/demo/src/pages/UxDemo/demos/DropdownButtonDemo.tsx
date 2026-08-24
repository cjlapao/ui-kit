import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  DropdownButton,
  MultiToggle,
  Toggle,
  Select,
  TRUE_COLORS,
  BUTTON_VARIANTS,
  CONTROL_SIZES,
} from "@cjlapao/ui-kit";
import type {
  ButtonColor,
  ButtonSize,
  ButtonVariant,
} from "@cjlapao/ui-kit";
import {
  dropdownButtonOptions,
  trueColorOptions,
  buttonVariantAllOptions,
  controlSizeOptions,
  dropdownWidthOptions,
  GLOBAL_NOTIFICATION_CHANNEL,
} from "../constants";
import notificationService from "../mocks/NotificationService";
import { v4 as uuidv4 } from "uuid";

const createUpdateToast = (message?: string) => {
  const id = uuidv4();
  notificationService.createNotification({
    id: id,
    message: `You clicked something!`,
    details:
      message ?? "This is a detailed message for the notification toast.",
    autoClose: true,
    dismissible: true,
    showAsToast: true,
    channel: GLOBAL_NOTIFICATION_CHANNEL,
  });
};

const safeLabelText = (label: React.ReactNode, fallback: string) =>
  typeof label === "string" ? label : fallback;

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

export const DropdownButtonDemo: React.FC = () => {
  const [dropdownButtonVariant, setDropdownButtonVariant] =
    useState<ButtonVariant>("solid");
  const [dropdownButtonSize, setDropdownButtonSize] =
    useState<ButtonSize>("md");
  const [dropdownButtonColor, setDropdownButtonColor] =
    useState<ButtonColor>("blue");
  const [dropdownButtonDisabled, setDropdownButtonDisabled] = useState(false);
  const [dropdownButtonFullWidth, setDropdownButtonFullWidth] = useState(false);
  const [dropdownButtonSplit, setDropdownButtonSplit] = useState(true);
  const [dropdownMenuWidthChoice, setDropdownMenuWidthChoice] = useState<
    "trigger" | "240" | "320"
  >("trigger");
  const [dropdownSelection, setDropdownSelection] = useState<string>("None");
  const dropdownMenuWidthValue =
    dropdownMenuWidthChoice === "trigger"
      ? "trigger"
      : Number(dropdownMenuWidthChoice);

  // Fixed conditions for the reference specimens below. Those blocks never
  // change with the controls above — each one varies exactly one named
  // dimension (variant / size / tone) so it reads as a stable specimen, not a
  // second live control.
  const example: {
    color: ButtonColor;
    size: ButtonSize;
    split: boolean;
  } = {
    color: "blue",
    size: "md",
    split: true,
  };

  const stateToggle = (
    label: string,
    value: boolean,
    setter: (value: boolean) => void,
  ) => (
    <Toggle
      size="sm"
      label={label}
      checked={value}
      onChange={(event) => setter(event.target.checked)}
    />
  );

  return (
    <PlaygroundSection
      title="Dropdown Button"
      label="[DropdownButton]"
      description="A split button whose caret opens a menu. Pick any of the full palette, then browse the fixed specimens."
      controls={
        <div className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Color
              </span>
              <Select
                size="sm"
                value={dropdownButtonColor}
                onChange={(event) =>
                  setDropdownButtonColor(event.target.value as ButtonColor)
                }
                aria-label="Color"
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Variant
              </span>
              <Select
                size="sm"
                value={dropdownButtonVariant}
                onChange={(event) =>
                  setDropdownButtonVariant(event.target.value as ButtonVariant)
                }
                aria-label="Variant"
              >
                {buttonVariantAllOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Size
              </span>
              <MultiToggle
                fullWidth
                options={controlSizeOptions}
                value={dropdownButtonSize}
                size="sm"
                onChange={(value) => setDropdownButtonSize(value as ButtonSize)}
              />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Menu Width
              </span>
              <MultiToggle
                fullWidth
                options={dropdownWidthOptions}
                value={dropdownMenuWidthChoice}
                size="sm"
                onChange={(value) =>
                  setDropdownMenuWidthChoice(value as "trigger" | "240" | "320")
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {stateToggle(
              "Split trigger",
              dropdownButtonSplit,
              setDropdownButtonSplit,
            )}
            {stateToggle(
              "Full width",
              dropdownButtonFullWidth,
              setDropdownButtonFullWidth,
            )}
            {stateToggle(
              "Disabled",
              dropdownButtonDisabled,
              setDropdownButtonDisabled,
            )}
          </div>
          <div className="space-y-2 rounded-2xl border border-neutral-200/80 bg-white/80 p-4 text-sm text-neutral-600 dark:border-neutral-700/70 dark:bg-neutral-900/60 dark:text-neutral-200">
            <p className="text-xs uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              Last selection
            </p>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">
              {dropdownSelection}
            </p>
          </div>
        </div>
      }
      preview={
        <div className="space-y-6 p-4">
          {/* The only block the controls drive. The button sits in a plain
              (block) surface so `inline-flex` sizes it to its content. */}
          <div className="flex flex-col gap-2">
            <Caption>Current settings</Caption>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <DropdownButton
                label="Something"
                options={dropdownButtonOptions}
                variant={dropdownButtonVariant}
                color={dropdownButtonColor}
                size={dropdownButtonSize}
                disabled={dropdownButtonDisabled}
                fullWidth={dropdownButtonFullWidth}
                split={dropdownButtonSplit}
                menuWidth={dropdownMenuWidthValue}
                onPrimaryClick={() => createUpdateToast("Primary action clicked")}
                onOptionSelect={(option) => {
                  setDropdownSelection(option.value);
                  const labelText = safeLabelText(
                    option.label,
                    option.value ?? "",
                  );
                  createUpdateToast(`Selected ${labelText}`);
                }}
              />
            </div>
          </div>

          {/* Fixed reference specimens — none of these move with the controls. */}
          <div className="space-y-6 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <div className="flex flex-col gap-2">
              <Caption>Every variant — fixed tone and size</Caption>
              <div className="grid gap-3 md:grid-cols-2">
                {BUTTON_VARIANTS.map((each) => (
                  <DropdownButton
                    key={each}
                    {...example}
                    options={dropdownButtonOptions}
                    variant={each}
                    label={each}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Caption>Size ladder — solid, fixed tone</Caption>
              <div className="flex flex-wrap items-center gap-3">
                {CONTROL_SIZES.map((each) => (
                  <DropdownButton
                    key={each}
                    {...example}
                    options={dropdownButtonOptions}
                    variant="solid"
                    size={each}
                    label={each}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Caption>All {TRUE_COLORS.length} tones — solid, fixed size</Caption>
              <div className="grid gap-2 md:grid-cols-3">
                {TRUE_COLORS.map((each) => (
                  <DropdownButton
                    key={each}
                    {...example}
                    options={dropdownButtonOptions}
                    variant="solid"
                    color={each}
                    label={each}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};
