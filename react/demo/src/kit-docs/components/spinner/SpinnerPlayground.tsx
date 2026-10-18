import React, { useState } from "react";
import { MultiToggle, Panel, Spinner } from "@cjlapao/ui-kit";
import type { SpinnerSize, SpinnerThickness, SpinnerVariant, TrueColor } from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  controlSizeOptions,
  spinnerThicknessOptions,
  spinnerVariantOptions,
  trueColorOptions,
} from "../../shared/options";

export const SpinnerPlayground: React.FC = () => {
  const [size, setSize] = useState<SpinnerSize>("md");
  const [color, setColor] = useState<TrueColor>("blue");
  const [variant, setVariant] = useState<SpinnerVariant>("solid");
  const [thickness, setThickness] = useState<SpinnerThickness>("normal");
  const [showLabel, setShowLabel] = useState(true);
  const [onGlass, setOnGlass] = useState(false);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <Control label="Size">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={controlSizeOptions}
                        value={size}
                        onChange={(v) => setSize(v as SpinnerSize)}
                      />
                    </Control>
                    <SelectControl
                      label="Tone"
                      options={trueColorOptions}
                      value={color}
                      onChange={(v) => setColor(v as TrueColor)}
                    />
                    <Control label="Variant">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={spinnerVariantOptions}
                        value={variant}
                        onChange={(v) => setVariant(v as SpinnerVariant)}
                      />
                    </Control>
                    <Control label="Thickness">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={spinnerThicknessOptions}
                        value={thickness}
                        onChange={(v) => setThickness(v as SpinnerThickness)}
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "options",
                title: "Options",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow label="Label" checked={showLabel} onChange={setShowLabel} />
                    <ToggleRow label="On a glass panel" checked={onGlass} onChange={setOnGlass} />
                  </div>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            Without a <strong>label</strong> the ring announces
            &ldquo;Loading&rdquo;; with one, the visible text is the
            announcement — the old sr-only copy would have said it twice. The
            ring stops spinning under <code>prefers-reduced-motion</code>.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? color : "neutral"}
            padding="md"
          >
            <div className="flex w-full max-w-md flex-col gap-4">
              <Spinner
                size={size}
                color={color}
                variant={variant}
                thickness={thickness}
                label={showLabel ? "Deploying update" : undefined}
              />
            </div>
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
