import React, { type ReactNode } from "react";
import { Panel, Select, Toggle } from "@cjlapao/ui-kit";
import type { MultiToggleOption } from "@cjlapao/ui-kit";

interface PlaygroundPanelProps {
  /** Controls column (left on wide screens). */
  controls: ReactNode;
  /** The live demo (right on wide screens). No code is shown here. */
  preview: ReactNode;
  /** Extra classes for the preview stage. */
  previewClassName?: string;
}

/**
 * The interactive playground at the top of every component page:
 * controls on the left, the live result on the right. Deliberately
 * carries no code — the copy-paste source lives in the ExampleCards
 * further down the page.
 */
export const PlaygroundPanel: React.FC<PlaygroundPanelProps> = ({
  controls,
  preview,
  previewClassName = "",
}) => (
  <Panel variant="outlined" padding="none" scrollable={false}>
    <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
      <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
        Playground
      </h2>
      <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
        Tweak the controls — the preview updates live.
      </p>
    </div>
    <div className="grid lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
      <div className="space-y-4 border-b border-neutral-100 p-5 dark:border-neutral-800 lg:border-b-0 lg:border-r">
        {controls}
      </div>
      <div
        className={`flex min-h-44 flex-wrap items-center justify-center gap-4 p-6 ${previewClassName}`}
      >
        {preview}
      </div>
    </div>
  </Panel>
);

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
