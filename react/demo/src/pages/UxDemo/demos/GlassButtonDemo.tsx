import React, { useState } from "react";
import {
  BUTTON_SIZES,
  Button,
  IconButton,
  MultiToggle,
  Select,
} from "@cjlapao/ui-kit";
import type {
  ButtonSize,
  GlassOpacity,
  GlassVibrancy,
  MultiToggleOption,
  SpecularMode,
  TrueColor,
} from "@cjlapao/ui-kit";
import { PlaygroundSection } from "../PlaygroundSection";
import { trueColorOptions } from "../constants";

// Both lists trace back to the kit — `trueColorOptions` is derived from
// TRUE_COLORS, `BUTTON_SIZES` is what ButtonSize itself is built from — so a
// new colour or size appears here without the demo being touched.
const sizeOptions = BUTTON_SIZES;

const vibrancyOptions: MultiToggleOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const opacityOptions: MultiToggleOption[] = [
  { label: "Clear", value: "clear" },
  { label: "Frosted", value: "frosted" },
  { label: "Light", value: "light" },
];

const specularOptions: MultiToggleOption[] = [
  { label: "None", value: "none" },
  { label: "Classic", value: "classic" },
  { label: "Halo", value: "halo" },
];

const SPECULAR_MODES: SpecularMode[] = ["none", "classic", "halo"];
const OPACITY_PRESETS: GlassOpacity[] = ["clear", "frosted", "light"];

/** Label chip that stays readable with the playground backdrop on or off. */
const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="rounded bg-white/75 px-1.5 text-[10px] font-semibold uppercase tracking-widest text-neutral-600 dark:bg-black/45 dark:text-neutral-200">
    {children}
  </span>
);

const Group: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="space-y-2">
    <Caption>{label}</Caption>
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  </div>
);

const Swatch: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col items-center gap-1">
    {children}
    <span className="rounded bg-white/75 px-1.5 text-[10px] text-neutral-600 dark:bg-black/45 dark:text-neutral-200">
      {label}
    </span>
  </div>
);

export const GlassButtonDemo: React.FC = () => {
  const [color, setColor] = useState<TrueColor>("blue");
  const [size, setSize] = useState<ButtonSize>("md");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [specularMode, setSpecularMode] = useState<SpecularMode>("classic");

  const glass = {
    variant: "glass" as const,
    color,
    vibrancy,
    glassOpacity,
    specularMode,
  };

  return (
    <PlaygroundSection
      title="Glass Buttons"
      label="[Button variant=glass]"
      description="Glass Button and IconButton — fill opacity, backdrop vibrancy and specular highlight. Turn on the background image to judge them over a real backdrop."
      controls={
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Color
              </span>
              <Select
                size="sm"
                value={color}
                onChange={(event) => setColor(event.target.value as TrueColor)}
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
                Size
              </span>
              <Select
                size="sm"
                value={size}
                onChange={(event) => setSize(event.target.value as ButtonSize)}
              >
                {sizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.toUpperCase()}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Fill opacity
            </span>
            <MultiToggle
              fullWidth
              size="sm"
              options={opacityOptions}
              value={String(glassOpacity)}
              onChange={(value) => setGlassOpacity(value as GlassOpacity)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Specular
              </span>
              <MultiToggle
                fullWidth
                size="sm"
                options={specularOptions}
                value={specularMode}
                onChange={(value) => setSpecularMode(value as SpecularMode)}
              />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Vibrancy
              </span>
              <MultiToggle
                fullWidth
                size="sm"
                options={vibrancyOptions}
                value={String(vibrancy)}
                onChange={(value) => setVibrancy(value as GlassVibrancy)}
              />
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Glass labels use the tone&apos;s darkest shade in light mode. Over a
            dark or busy backdrop, raise the fill to{" "}
            <code>glassOpacity=&quot;light&quot;</code> to keep them legible.
          </p>
        </div>
      }
      preview={
        <div className="space-y-6">
          <Group label={`${color} · ${glassOpacity} · ${specularMode} · ${vibrancy}`}>
            <Button {...glass} size={size}>
              Glass Button
            </Button>
            <IconButton icon="Search" srLabel="Search" {...glass} size={size} />
          </Group>

          {/* States are live: hover and press them. Faking hover with a filter
              would show a look the component never actually produces. */}
          <Group label="States — hover and press these">
            <Swatch label="Default">
              <Button {...glass} size={size}>
                Default
              </Button>
            </Swatch>
            <Swatch label="Disabled">
              <Button {...glass} size={size} disabled>
                Disabled
              </Button>
            </Swatch>
            <Swatch label="Loading">
              <Button {...glass} size={size} loading>
                Loading
              </Button>
            </Swatch>
            <Swatch label="Icon">
              <IconButton icon="Search" srLabel="Search" {...glass} size={size} />
            </Swatch>
            <Swatch label="Icon disabled">
              <IconButton
                icon="Search"
                srLabel="Search"
                {...glass}
                size={size}
                disabled
              />
            </Swatch>
          </Group>

          <Group label="Specular modes">
            {SPECULAR_MODES.map((mode) => (
              <Swatch key={mode} label={mode}>
                <Button {...glass} specularMode={mode} size="lg">
                  {mode}
                </Button>
              </Swatch>
            ))}
          </Group>

          <Group label="Fill opacity">
            {OPACITY_PRESETS.map((preset) => (
              <Swatch key={String(preset)} label={String(preset)}>
                <Button {...glass} glassOpacity={preset} size="lg">
                  {String(preset)}
                </Button>
              </Swatch>
            ))}
          </Group>

          <Group label="Sizes">
            {sizeOptions.map((option) => (
              <Swatch key={option} label={option}>
                <Button {...glass} size={option}>
                  {option.toUpperCase()}
                </Button>
              </Swatch>
            ))}
          </Group>
        </div>
      }
    />
  );
};
