import React, { useMemo, useState, type ReactNode } from "react";
import {
  MultiToggle,
  Panel,
  Select,
  Toggle,
  useTheme,
} from "@cjlapao/ui-kit";
import type { MultiToggleOption } from "@cjlapao/ui-kit";
import backdropLight from "@assets/images/backdrop_demo_light.png";
import backdropDark from "@assets/images/backdrop_demo_dark.png";

interface PlaygroundPanelProps {
  /** Controls column (left on wide screens). */
  controls: ReactNode;
  /** The live demo (right on wide screens). No code is shown here. */
  preview: ReactNode;
  /** Extra classes for the preview stage. */
  previewClassName?: string;
  /**
   * Hide the header's background-image toggle for playgrounds that supply
   * their own backdrop (GlassBackground draws one itself, so a second
   * would fight it).
   */
  hideBackgroundToggle?: boolean;
}

/**
 * The interactive playground at the top of every component page:
 * controls on the left, the live result on the right. Deliberately
 * carries no code — the copy-paste source lives in the ExampleCards
 * further down the page.
 *
 * The header's "Background image" toggle (same as the legacy docs)
 * paints a theme-aware backdrop behind the preview so translucent and
 * glass components can be judged over a real backdrop.
 */
export const PlaygroundPanel: React.FC<PlaygroundPanelProps> = ({
  controls,
  preview,
  previewClassName = "",
  hideBackgroundToggle = false,
}) => {
  const { effectiveTheme } = useTheme();
  const [showBackground, setShowBackground] = useState(false);

  const previewBackgroundStyle = useMemo<React.CSSProperties | undefined>(
    () =>
      showBackground
        ? {
            backgroundImage: `url(${
              effectiveTheme === "dark" ? backdropDark : backdropLight
            })`,
          }
        : undefined,
    [showBackground, effectiveTheme],
  );

  return (
    <Panel variant="outlined" padding="none" scrollable={false}>
      <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
            Playground
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
            Tweak the controls — the preview updates live.
          </p>
        </div>
        {!hideBackgroundToggle && (
          <Toggle
            size="sm"
            alignLabel="left"
            color="blue"
            label="Background image"
            checked={showBackground}
            onChange={(event) => setShowBackground(event.target.checked)}
          />
        )}
      </div>
      <div className="grid lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
        <div className="space-y-4 border-b border-neutral-100 p-5 dark:border-neutral-800 lg:border-b-0 lg:border-r">
          {controls}
        </div>
        <div
          className={`flex min-h-44 flex-wrap items-start justify-center gap-4 p-6 ${
            showBackground
              ? "overflow-hidden bg-cover bg-center bg-no-repeat"
              : ""
          } ${previewClassName}`}
          style={previewBackgroundStyle}
        >
          {preview}
        </div>
      </div>
    </Panel>
  );
};

/** A labelled control block: small caps label on top, control below. */
export const Control: React.FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => (
  <div className="space-y-1.5">
    <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
      {label}
    </span>
    {children}
  </div>
);

/**
 * A labelled dropdown, for option lists too long for a segmented MultiToggle
 * (the kit's Select, which wraps a native <select>).
 */
export const SelectControl: React.FC<{
  label: string;
  options: MultiToggleOption[];
  value: string;
  onChange: (value: string) => void;
}> = ({ label, options, value, onChange }) => (
  <Control label={label}>
    <Select
      size="sm"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  </Control>
);

/**
 * Picks the control that suits the number of options: a segmented
 * `MultiToggle` for a short list, a `Select` once there are enough entries
 * that segments would be unreadably narrow. Always full width, so the controls
 * column stays a single tidy stack.
 */
export const CHOICE_CONTROL_MAX_SEGMENTS = 4;

export const ChoiceControl: React.FC<{
  label: string;
  options: MultiToggleOption[];
  value: string;
  onChange: (value: string) => void;
}> = ({ label, options, value, onChange }) => (
  <Control label={label}>
    {options.length < CHOICE_CONTROL_MAX_SEGMENTS ? (
      <MultiToggle
        fullWidth
        size="sm"
        options={options}
        value={value}
        onChange={onChange}
      />
    ) : (
      <Select
        size="sm"
        className="w-full"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    )}
  </Control>
);

/** A single on/off row for the playground controls column. */
export const ToggleRow: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-neutral-700 dark:text-neutral-300">
    <span>{label}</span>
    <Toggle
      size="sm"
      color="blue"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  </label>
);
