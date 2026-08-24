import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  IconButton,
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
  SpecularMode,
} from "@cjlapao/ui-kit";
import {
  trueColorOptions,
  buttonVariantAllOptions,
  controlSizeOptions,
  iconRoundedOptions,
  GLOBAL_NOTIFICATION_CHANNEL,
} from "../constants";
import notificationService from "../mocks/NotificationService";
import { v4 as uuidv4 } from "uuid";

type IconRounded = "md" | "lg" | "xl" | "full";

const ROUNDED_SHAPES: IconRounded[] = ["md", "lg", "xl", "full"];
const SPECULAR_MODES: SpecularMode[] = ["none", "classic", "halo"];

const createUpdateToast = (message?: string) => {
  const id = uuidv4();
  notificationService.createNotification({
    id: id,
    message: `You clicked something!`,
    details: message ?? "This is a detailed message for the notification toast.",
    autoClose: true,
    dismissible: true,
    showAsToast: true,
    channel: GLOBAL_NOTIFICATION_CHANNEL,
  });
};

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const Swatch: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">
      {label}
    </span>
  </div>
);

export const IconButtonDemo: React.FC = () => {
  const [iconButtonVariant, setIconButtonVariant] =
    useState<ButtonVariant>("solid");
  const [iconButtonSize, setIconButtonSize] = useState<ButtonSize>("md");
  const [iconButtonColor, setIconButtonColor] = useState<ButtonColor>("blue");
  const [iconButtonRounded, setIconButtonRounded] =
    useState<IconRounded>("full");
  const [iconButtonLoading, setIconButtonLoading] = useState(false);
  const [iconButtonDisabled, setIconButtonDisabled] = useState(false);
  const [iconButtonAccent, setIconButtonAccent] = useState(false);
  const [iconButtonGlass, setIconButtonGlass] = useState(false);
  const [iconButtonTooltip, setIconButtonTooltip] = useState(false);

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
      title="Icon Buttons"
      label="[IconButton]"
      description="A square icon-only control. Pick any of the full palette, then browse the fixed specimens for variant, size, tone, corner radius, states and glass."
      controls={
        <div className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Color
              </span>
              <Select
                size="sm"
                value={iconButtonColor}
                onChange={(event) =>
                  setIconButtonColor(event.target.value as ButtonColor)
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
                value={iconButtonVariant}
                onChange={(event) =>
                  setIconButtonVariant(event.target.value as ButtonVariant)
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
                value={iconButtonSize}
                size="sm"
                onChange={(value) => setIconButtonSize(value as ButtonSize)}
              />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Rounded
              </span>
              <MultiToggle
                fullWidth
                options={iconRoundedOptions}
                value={iconButtonRounded}
                size="sm"
                onChange={(value) => setIconButtonRounded(value as IconRounded)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {stateToggle("Loading", iconButtonLoading, setIconButtonLoading)}
            {stateToggle(
              "Disabled",
              iconButtonDisabled,
              setIconButtonDisabled,
            )}
            {stateToggle("Accent", iconButtonAccent, setIconButtonAccent)}
            {stateToggle("Glass", iconButtonGlass, setIconButtonGlass)}
            {stateToggle("Tooltip", iconButtonTooltip, setIconButtonTooltip)}
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
              <IconButton
                icon="Send"
                variant={iconButtonVariant}
                color={iconButtonColor}
                size={iconButtonSize}
                rounded={iconButtonRounded}
                loading={iconButtonLoading}
                disabled={iconButtonDisabled}
                accent={iconButtonAccent}
                glass={iconButtonGlass}
                tooltip={iconButtonTooltip ? "Send message" : undefined}
                tooltipPosition="top"
                srLabel="Send"
                onClick={() => createUpdateToast("Icon button clicked")}
              />
            </div>
          </div>

          {/* Fixed reference specimens — none of these move with the controls.
              Icon buttons carry no text label, so each swatch names itself below. */}
          <div className="space-y-6 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <div className="flex flex-col gap-3">
              <Caption>Every variant — fixed tone and size</Caption>
              <div className="grid gap-3 md:grid-cols-2">
                {BUTTON_VARIANTS.map((each) => (
                  <div key={each} className="flex items-center gap-3">
                    <IconButton
                      icon="Send"
                      variant={each}
                      color="blue"
                      size="md"
                      srLabel={each}
                    />
                    <span className="text-sm opacity-70">{each}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Caption>Size ladder — solid, fixed tone</Caption>
              <div className="flex flex-wrap items-end gap-3">
                {CONTROL_SIZES.map((each) => (
                  <Swatch key={each} label={each}>
                    <IconButton
                      icon="Send"
                      variant="solid"
                      color="blue"
                      size={each}
                      srLabel={each}
                    />
                  </Swatch>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Caption>All {TRUE_COLORS.length} tones — solid, fixed size</Caption>
              <div className="flex flex-wrap items-end gap-3">
                {TRUE_COLORS.map((each) => (
                  <Swatch key={each} label={each}>
                    <IconButton
                      icon="Send"
                      variant="solid"
                      color={each}
                      size="md"
                      srLabel={each}
                    />
                  </Swatch>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Caption>Corner radius — solid, fixed tone</Caption>
              <div className="flex flex-wrap items-end gap-4">
                {ROUNDED_SHAPES.map((each) => (
                  <Swatch key={each} label={each}>
                    <IconButton
                      icon="Send"
                      variant="solid"
                      color="blue"
                      size="lg"
                      rounded={each}
                      srLabel={each}
                    />
                  </Swatch>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Caption>States — hover and press these</Caption>
              <div className="flex flex-wrap items-end gap-4">
                <Swatch label="Default">
                  <IconButton
                    icon="Send"
                    variant="solid"
                    color="blue"
                    size="lg"
                    srLabel="Default"
                  />
                </Swatch>
                <Swatch label="Loading">
                  <IconButton
                    icon="Send"
                    variant="solid"
                    color="blue"
                    size="lg"
                    loading
                    srLabel="Loading"
                  />
                </Swatch>
                <Swatch label="Disabled">
                  <IconButton
                    icon="Send"
                    variant="solid"
                    color="blue"
                    size="lg"
                    disabled
                    srLabel="Disabled"
                  />
                </Swatch>
                <Swatch label="Accent">
                  <IconButton
                    icon="Send"
                    variant="soft"
                    color="blue"
                    size="lg"
                    accent
                    srLabel="Accent"
                  />
                </Swatch>
                <Swatch label="Icon tint">
                  <IconButton
                    icon="Heart"
                    variant="soft"
                    color="neutral"
                    size="lg"
                    iconColor="red"
                    srLabel="Tinted icon"
                  />
                </Swatch>
                <Swatch label="Tooltip">
                  <IconButton
                    icon="Send"
                    variant="solid"
                    color="blue"
                    size="lg"
                    tooltip="Hover me"
                    tooltipPosition="top"
                    srLabel="Tooltip"
                  />
                </Swatch>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Caption>Glass — hover and press these</Caption>
              <div className="flex flex-wrap items-end gap-4">
                {SPECULAR_MODES.map((each) => (
                  <Swatch key={each} label={each}>
                    <IconButton
                      icon="Search"
                      variant="glass"
                      color="blue"
                      size="lg"
                      specularMode={each}
                      srLabel={each}
                    />
                  </Swatch>
                ))}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Fill opacity, vibrancy and the full glass playground live in the
                Glass Buttons section above.
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
};
