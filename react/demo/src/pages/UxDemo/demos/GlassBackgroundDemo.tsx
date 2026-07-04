import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  GlassBackground,
  Panel,
  Input,
  Button,
  Toggle,
  Badge,
  MultiToggle,
  Select,
  type ThemeColor,
  type GradientDirection,
  type GlassBackgroundPosition,
} from "@cjlapao/ui-kit";

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

const colorOptions: { label: string; value: ThemeColor }[] = [
  { label: "Purple", value: "purple" },
  { label: "Blue", value: "blue" },
  { label: "Indigo", value: "indigo" },
  { label: "Violet", value: "violet" },
  { label: "Rose", value: "rose" },
  { label: "Pink", value: "pink" },
  { label: "Emerald", value: "emerald" },
  { label: "Teal", value: "teal" },
  { label: "Amber", value: "amber" },
  { label: "Orange", value: "orange" },
  { label: "Cyan", value: "cyan" },
  { label: "Sky", value: "sky" },
  { label: "Lime", value: "lime" },
  { label: "Red", value: "red" },
  { label: "Slate", value: "slate" },
  { label: "Zinc", value: "zinc" },
  { label: "Stone", value: "stone" },
  { label: "Gray", value: "gray" },
  { label: "Neutral", value: "neutral" },
];

const directionOptions: { label: string; value: GradientDirection }[] = [
  { label: "Top", value: "t" },
  { label: "Top-Right", value: "tr" },
  { label: "Right", value: "r" },
  { label: "Bottom-Right", value: "br" },
  { label: "Bottom", value: "b" },
  { label: "Bottom-Left", value: "bl" },
  { label: "Left", value: "l" },
  { label: "Top-Left", value: "tl" },
];

const positionOptions: { label: string; value: GlassBackgroundPosition }[] = [
  { label: "Fixed", value: "fixed" },
  { label: "Absolute", value: "absolute" },
];

// ---------------------------------------------------------------------------
// Sign-in form preview
// ---------------------------------------------------------------------------

interface SignUpFormProps {
  color: ThemeColor;
  shimmer: boolean;
  ambient: boolean;
  direction: GradientDirection;
  position: GlassBackgroundPosition;
  colorSecondary?: ThemeColor;
  colorDeep?: ThemeColor;
}

const SignInFormPreview: React.FC<SignUpFormProps> = ({
  color,
  shimmer,
  ambient,
  direction,
  position,
  colorSecondary,
  colorDeep,
}) => {
  const [remembered, setRemembered] = useState(true);

  return (
    <GlassBackground
      position={position}
      color={color}
      colorSecondary={colorSecondary}
      colorDeep={colorDeep}
      direction={direction}
      shimmer={shimmer}
      ambient={ambient}
    >
      <div className="flex h-full min-h-0 flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-5">
          <Panel
            title="Sign in"
            variant="liquid-glass"
            corner="rounded-lg"
            glassOpacity="frosted"
            vibrancy="high"
          >
            <div className="space-y-3">
              <Input placeholder="Email" size="md" />
              <Input placeholder="Password" size="md" type="password" />
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Remember me
                </span>
                <Toggle
                  checked={remembered}
                  onChange={() => setRemembered(!remembered)}
                  color="blue"
                  size="sm"
                />
              </div>
              <Button fullWidth variant="solid" color="blue" size="md">
                Continue
              </Button>
              <button className="w-full py-2 text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
                Skip for now
              </button>
            </div>
          </Panel>

          <Panel
            variant="glass"
            corner="rounded-lg"
            tone="neutral"
            padding="sm"
          >
            <div className="flex items-start gap-3">
              <Badge dot tone="blue" />
              <div>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  Theme note
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Everything in this app is built from the same glass surface
                  treatment for consistency.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </GlassBackground>
  );
};

// ---------------------------------------------------------------------------
// Color swatch preview (small)
// ---------------------------------------------------------------------------

const ColorSwatchPreview: React.FC<{
  label: string;
  color: ThemeColor;
  colorSecondary?: ThemeColor;
  direction?: GradientDirection;
}> = ({ label, color, colorSecondary, direction: dir }) => (
  <GlassBackground
    position="absolute"
    color={color}
    colorSecondary={colorSecondary}
    direction={dir ?? "br"}
    ambient
  >
    <div className="flex h-full items-center justify-center p-3">
      <Panel variant="liquid-glass" corner="rounded-md" padding="sm">
        <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          {label}
        </p>
      </Panel>
    </div>
  </GlassBackground>
);

// ---------------------------------------------------------------------------
// Direction grid cell
// ---------------------------------------------------------------------------

const DirectionCell: React.FC<{
  label: string;
  direction: GradientDirection;
}> = ({ label, direction }) => (
  <GlassBackground position="absolute" direction={direction} ambient={false}>
    <div className="flex h-16 items-center justify-center">
      <Panel variant="glass" corner="rounded-sm" padding="none" tone="neutral">
        <span className="whitespace-nowrap px-2 py-1 text-[10px] font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
      </Panel>
    </div>
  </GlassBackground>
);

// ---------------------------------------------------------------------------
// Shimmer comparison
// ---------------------------------------------------------------------------

const ShimmerPreview: React.FC<{ shimmer: boolean; color: ThemeColor }> = ({
  shimmer,
  color,
}) => (
  <GlassBackground position="absolute" color={color} shimmer={shimmer} ambient>
    <div className="flex h-full items-center justify-center">
      <Panel variant="liquid-glass" corner="rounded-md" padding="sm">
        <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          {shimmer ? "Shimmer on" : "Shimmer off"}
        </p>
      </Panel>
    </div>
  </GlassBackground>
);

// ---------------------------------------------------------------------------
// Main demo sections
// ---------------------------------------------------------------------------

export const GlassBackgroundDemo: React.FC = () => {
  // --- Sign-in form controls ---
  const [formColor, setFormColor] = useState<ThemeColor>("purple");
  const [formColorSecondary, setFormColorSecondary] = useState<ThemeColor>(
    "blue",
  );
  const [formColorDeep, setFormColorDeep] = useState<ThemeColor>("indigo");
  const [formDirection, setFormDirection] = useState<GradientDirection>("br");
  const [formPosition, setFormPosition] = useState<GlassBackgroundPosition>(
    "absolute",
  );
  const [formShimmer, setFormShimmer] = useState(false);
  const [formAmbient, setFormAmbient] = useState(true);

  // --- Color presets controls ---
  const [presetColor, setPresetColor] = useState<ThemeColor>("blue");
  const [presetSecondary, setPresetSecondary] = useState<ThemeColor>("indigo");
  const [presetDirection, setPresetDirection] =
    useState<GradientDirection>("br");

  // --- Direction grid controls ---
  const [gridColor, setGridColor] = useState<ThemeColor>("rose");
  const [gridSecondary, setGridSecondary] = useState<ThemeColor>("purple");

  // --- Shimmer comparison controls ---
  const [shimmerLeft, setShimmerLeft] = useState(false);
  const [shimmerRight, setShimmerRight] = useState(true);
  const [shimmerColor, setShimmerColor] = useState<ThemeColor>("purple");

  // -----------------------------------------------------------------------
  // Preview container helper
  // -----------------------------------------------------------------------
  const previewContainer = (
    children: React.ReactNode,
  ): React.ReactNode => (
    <div className="relative h-96 w-full overflow-hidden rounded-xl">
      {children}
    </div>
  );

  // -----------------------------------------------------------------------
  return (
    <div className="space-y-8">
      {/* ───────── Sign-in form ───────── */}
      <PlaygroundSection
        title="Sign-in form"
        label="[GlassBackground]"
        description="Interactive preview matching the Liquid Glass reference screenshot."
        controls={
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex flex-col gap-2">
                <span>Primary color</span>
                <Select
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value as ThemeColor)}
                >
                  {colorOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="flex flex-col gap-2">
                <span>Secondary color</span>
                <Select
                  value={formColorSecondary}
                  onChange={(e) =>
                    setFormColorSecondary(e.target.value as ThemeColor)
                  }
                >
                  {colorOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="flex flex-col gap-2">
                <span>Deep color</span>
                <Select
                  value={formColorDeep}
                  onChange={(e) =>
                    setFormColorDeep(e.target.value as ThemeColor)
                  }
                >
                  {colorOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex flex-col gap-2">
                <span>Direction</span>
                <Select
                  value={formDirection}
                  onChange={(e) =>
                    setFormDirection(e.target.value as GradientDirection)
                  }
                >
                  {directionOptions.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="flex flex-col gap-2">
                <span>Position</span>
                <Select
                  value={formPosition}
                  onChange={(e) =>
                    setFormPosition(e.target.value as GlassBackgroundPosition)
                  }
                >
                  {positionOptions.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              <label className="flex items-center justify-between">
                <span>Shimmer</span>
                <Toggle
                  size="sm"
                  checked={formShimmer}
                  onChange={(e) => setFormShimmer(e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between">
                <span>Ambient</span>
                <Toggle
                  size="sm"
                  checked={formAmbient}
                  onChange={(e) => setFormAmbient(e.target.checked)}
                />
              </label>
            </div>
          </div>
        }
        preview={previewContainer(
          <SignInFormPreview
            color={formColor}
            colorSecondary={formColorSecondary}
            colorDeep={formColorDeep}
            direction={formDirection}
            position={formPosition}
            shimmer={formShimmer}
            ambient={formAmbient}
          />,
        )}
      />

      {/* ───────── Color presets ───────── */}
      <PlaygroundSection
        title="Color presets"
        label="[GlassBackground]"
        description="Explore different color combinations with a shared glass panel."
        controls={
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span>Primary color</span>
                <Select
                  value={presetColor}
                  onChange={(e) =>
                    setPresetColor(e.target.value as ThemeColor)
                  }
                >
                  {colorOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="flex flex-col gap-2">
                <span>Secondary color</span>
                <Select
                  value={presetSecondary}
                  onChange={(e) =>
                    setPresetSecondary(e.target.value as ThemeColor)
                  }
                >
                  {colorOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
            <label className="flex flex-col gap-2">
              <span>Direction</span>
              <Select
                value={presetDirection}
                onChange={(e) =>
                  setPresetDirection(e.target.value as GradientDirection)
                }
              >
                {directionOptions.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </Select>
            </label>
          </div>
        }
        preview={previewContainer(
          <div className="grid h-full grid-cols-2 gap-2 p-2">
            {colorOptions.slice(0, 6).map((c) => (
              <div
                key={c.value}
                className="relative overflow-hidden rounded-lg"
              >
                <ColorSwatchPreview
                  label={c.label}
                  color={c.value}
                  colorSecondary={presetSecondary}
                  direction={presetDirection}
                />
              </div>
            ))}
          </div>,
        )}
      />

      {/* ───────── Direction grid ───────── */}
      <PlaygroundSection
        title="Direction grid"
        label="[GlassBackground]"
        description="All eight gradient directions side by side."
        controls={
          <div className="space-y-4 text-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span>Primary color</span>
                <Select
                  value={gridColor}
                  onChange={(e) => setGridColor(e.target.value as ThemeColor)}
                >
                  {colorOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="flex flex-col gap-2">
                <span>Secondary color</span>
                <Select
                  value={gridSecondary}
                  onChange={(e) =>
                    setGridSecondary(e.target.value as ThemeColor)
                  }
                >
                  {colorOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
          </div>
        }
        preview={previewContainer(
          <div className="grid h-full grid-cols-4 gap-1 p-1">
            {directionOptions.map((d) => (
              <div
                key={d.value}
                className="relative overflow-hidden rounded-md"
              >
                <DirectionCell label={d.label} direction={d.value} />
              </div>
            ))}
          </div>,
        )}
      />

      {/* ───────── Shimmer comparison ───────── */}
      <PlaygroundSection
        title="Shimmer"
        label="[GlassBackground]"
        description="Toggle shimmer on and off to compare."
        controls={
          <div className="space-y-4 text-sm">
            <label className="flex flex-col gap-2">
              <span>Color</span>
              <Select
                value={shimmerColor}
                onChange={(e) =>
                  setShimmerColor(e.target.value as ThemeColor)
                }
              >
                {colorOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </label>
            <div className="grid gap-2 md:grid-cols-2">
              <label className="flex items-center justify-between">
                <span>Left: shimmer</span>
                <Toggle
                  size="sm"
                  checked={shimmerLeft}
                  onChange={(e) => setShimmerLeft(e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between">
                <span>Right: shimmer</span>
                <Toggle
                  size="sm"
                  checked={shimmerRight}
                  onChange={(e) => setShimmerRight(e.target.checked)}
                />
              </label>
            </div>
          </div>
        }
        preview={previewContainer(
          <div className="grid h-full grid-cols-2 gap-2 p-2">
            <div className="relative overflow-hidden rounded-lg">
              <ShimmerPreview shimmer={shimmerLeft} color={shimmerColor} />
            </div>
            <div className="relative overflow-hidden rounded-lg">
              <ShimmerPreview shimmer={shimmerRight} color={shimmerColor} />
            </div>
          </div>,
        )}
      />
    </div>
  );
};