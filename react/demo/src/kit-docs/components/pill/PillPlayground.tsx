import React, { useState } from "react";
import {
  MultiToggle,
  Panel,
  Pill,
} from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  PillSize,
  PillTone,
  PillVariant,
  SpecularMode,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelSpecularOptions,
  pillVariantOptions,
  trueColorOptions,
} from "../../shared/options";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

export const PillPlayground: React.FC = () => {
  const [tone, setTone] = useState<PillTone>("blue");
  const [variant, setVariant] = useState<PillVariant>("soft");
  const [size, setSize] = useState<PillSize>("md");
  const [uppercase, setUppercase] = useState(false);
  const [withIcon, setWithIcon] = useState(true);
  const [withTrailingIcon, setWithTrailingIcon] = useState(false);
  const [clickable, setClickable] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [truncate, setTruncate] = useState(false);
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] = useState<SpecularMode | undefined>(
    undefined,
  );
  const [clicked, setClicked] = useState<string | null>(null);

  const isGlass = variant === "glass" || variant === "liquid-glass";

  const shared = {
    tone,
    variant,
    size,
    uppercase,
    disabled,
    icon: withIcon ? "Check" : undefined,
    trailingIcon: withTrailingIcon ? "ArrowRight" : undefined,
    maxWidth: truncate ? 140 : undefined,
    glassOpacity,
    vibrancy,
    specularMode,
  };

  return (
    <PlaygroundPanel
      controls={
        <>
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={tone}
            onChange={(v) => setTone(v as PillTone)}
          />
          <Control label="Variant">
            <MultiToggle
              fullWidth
              size="sm"
              options={pillVariantOptions}
              value={variant}
              onChange={(v) => setVariant(v as PillVariant)}
            />
          </Control>
          <Control label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={controlSizeOptions}
              value={size}
              onChange={(v) => setSize(v as PillSize)}
            />
          </Control>
          <div className="grid grid-cols-2 gap-2">
            <ToggleRow label="Uppercase" checked={uppercase} onChange={setUppercase} />
            <ToggleRow
              label="Leading icon"
              checked={withIcon}
              onChange={setWithIcon}
            />
            <ToggleRow
              label="Trailing icon"
              checked={withTrailingIcon}
              onChange={setWithTrailingIcon}
            />
            <ToggleRow label="Clickable" checked={clickable} onChange={setClickable} />
            <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
            <ToggleRow
              label="Truncate label"
              checked={truncate}
              onChange={setTruncate}
            />
          </div>
          {isGlass && (
            <div className="flex flex-col gap-3">
              <Control label="Specular">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={panelSpecularOptions}
                  value={
                    specularMode ??
                    (variant === "liquid-glass" ? "classic" : "none")
                  }
                  onChange={(v) => setSpecularMode(v as SpecularMode)}
                />
              </Control>
              <Control label="Vibrancy">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassVibrancyOptions}
                  value={vibrancy as string}
                  onChange={(v) => setVibrancy(v as GlassVibrancy)}
                />
              </Control>
              <Control label="Glass opacity">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassOpacityOptions}
                  value={glassOpacity as string}
                  onChange={(v) => setGlassOpacity(v as GlassOpacity)}
                />
              </Control>
            </div>
          )}
          <p className="text-xs opacity-70">
            The <strong>glass</strong> variants drop the tone fill for a
            translucent one. <strong>Clickable</strong> renders a real{" "}
            <code>&lt;button&gt;</code>
            {clicked && ` Last clicked: ${clicked}.`}
          </p>
        </>
      }
      preview={
        <div className="w-full">
          <Panel
            variant={isGlass ? "liquid-glass" : "outlined"}
            tone={isGlass ? tone : "neutral"}
            padding="md"
          >
            <div className="flex flex-col gap-2">
              <Caption>Current settings</Caption>
              <div className="flex flex-wrap items-center gap-2">
                <Pill
                  {...shared}
                  onClick={clickable ? () => setClicked("Operational") : undefined}
                >
                  Operational
                </Pill>
                <Pill
                  {...shared}
                  onClick={
                    clickable
                      ? () => setClicked("A long label that runs on")
                      : undefined
                  }
                >
                  A long label that runs on
                </Pill>
              </div>
            </div>
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
