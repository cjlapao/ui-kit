import React, { useState } from "react";
import { IconButton, MultiToggle } from "@cjlapao/ui-kit";
import type {
  ButtonSize,
  ButtonVariant,
  SpecularMode,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  buttonVariantOptions,
  controlSizeOptions,
  iconButtonRoundedOptions,
  panelSpecularOptions,
  trueColorOptions,
} from "../../shared/options";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

type IconRounded = "md" | "lg" | "xl" | "full";

export const IconButtonPlayground: React.FC = () => {
  const [variant, setVariant] = useState<ButtonVariant>("icon");
  const [size, setSize] = useState<ButtonSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [rounded, setRounded] = useState<IconRounded>("full");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [accent, setAccent] = useState(false);
  const [glass, setGlass] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [specularMode, setSpecularMode] = useState<SpecularMode>("none");
  const [clicks, setClicks] = useState(0);

  return (
    <PlaygroundPanel
      controls={
        <>
          <SelectControl
            label="Variant"
            options={buttonVariantOptions}
            value={variant}
            onChange={(v) => setVariant(v as ButtonVariant)}
          />
          <Control label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={controlSizeOptions}
              value={size}
              onChange={(v) => setSize(v as ButtonSize)}
            />
          </Control>
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={color}
            onChange={(v) => setColor(v as TrueColor)}
          />
          <Control label="Rounded">
            <MultiToggle
              fullWidth
              size="sm"
              options={iconButtonRoundedOptions}
              value={rounded}
              onChange={(v) => setRounded(v as IconRounded)}
            />
          </Control>
          {glass && (
            <Control label="Specular">
              <MultiToggle
                fullWidth
                size="sm"
                options={panelSpecularOptions}
                value={specularMode}
                onChange={(v) => setSpecularMode(v as SpecularMode)}
              />
            </Control>
          )}
          <div className="grid grid-cols-2 gap-2">
            <ToggleRow label="Loading" checked={loading} onChange={setLoading} />
            <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
            <ToggleRow label="Accent" checked={accent} onChange={setAccent} />
            <ToggleRow label="Glass" checked={glass} onChange={setGlass} />
            <ToggleRow label="Tooltip" checked={tooltip} onChange={setTooltip} />
          </div>
          <p className="text-xs opacity-70">
            Icon buttons carry no text — the <strong>srLabel</strong> is what
            gets announced and doubles as the native title. Loading swaps the
            glyph for a spinner and blocks clicks.
          </p>
        </>
      }
      preview={
        <div className="flex w-full flex-col gap-3">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900">
            <IconButton
              icon="Send"
              variant={variant}
              color={color}
              size={size}
              rounded={rounded}
              loading={loading}
              disabled={disabled}
              accent={accent}
              glass={glass}
              specularMode={glass ? specularMode : "none"}
              tooltip={tooltip ? "Send message" : undefined}
              tooltipPosition="top"
              srLabel="Send"
              onClick={() => setClicks((n) => n + 1)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Caption>Clicks</Caption>
            <code className="rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10">
              {clicks}
            </code>
          </div>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
