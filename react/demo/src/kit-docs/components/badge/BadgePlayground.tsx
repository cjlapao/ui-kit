import React, { useState } from "react";
import { Badge, BADGE_VARIANTS, MultiToggle, Panel } from "@cjlapao/ui-kit";
import type { BadgeVariant, ControlSize, TrueColor } from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { trueColorOptions } from "../../shared/options";

const sizeOptions = [
  { label: "Xs", value: "xs" },
  { label: "Sm", value: "sm" },
  { label: "Md", value: "md" },
  { label: "Lg", value: "lg" },
  { label: "Xl", value: "xl" },
];

const variantOptions = BADGE_VARIANTS.map((value) => ({
  label: value.charAt(0).toUpperCase() + value.slice(1),
  value,
}));

export const BadgePlayground: React.FC = () => {
  const [tone, setTone] = useState<TrueColor>("rose");
  const [variant, setVariant] = useState<BadgeVariant>("solid");
  const [size, setSize] = useState<ControlSize>("sm");
  const [count, setCount] = useState(7);
  const [maxCount, setMaxCount] = useState(99);
  const [dot, setDot] = useState(false);
  const [ring, setRing] = useState(true);
  const [pulse, setPulse] = useState(false);
  const [showZero, setShowZero] = useState(false);
  const [onGlass, setOnGlass] = useState(false);

  return (
    <PlaygroundPanel
      controls={
        <>
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={tone}
            onChange={(value) => setTone(value as TrueColor)}
          />
          <Control label="Variant">
            <MultiToggle
              fullWidth
              size="sm"
              options={variantOptions}
              value={variant}
              onChange={(value) => setVariant(value as BadgeVariant)}
            />
          </Control>
          <Control label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={sizeOptions}
              value={size}
              onChange={(value) => setSize(value as ControlSize)}
            />
          </Control>
          <div className="grid grid-cols-2 gap-3">
            <Control label={`Count — ${count}`}>
              <input
                type="range"
                min={0}
                max={250}
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
                className="w-full accent-blue-500"
                aria-label="Badge count"
              />
            </Control>
            <Control label={`Max count — ${maxCount}`}>
              <input
                type="range"
                min={5}
                max={999}
                value={maxCount}
                onChange={(event) => setMaxCount(Number(event.target.value))}
                className="w-full accent-blue-500"
                aria-label="Badge max count"
              />
            </Control>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ToggleRow label="Dot only" checked={dot} onChange={setDot} />
            <ToggleRow label="Show zero" checked={showZero} onChange={setShowZero} />
            <ToggleRow label="Ring" checked={ring} onChange={setRing} />
            <ToggleRow label="Pulse" checked={pulse} onChange={setPulse} />
            <ToggleRow
              label="On a glass panel"
              checked={onGlass}
              onChange={setOnGlass}
            />
          </div>
          <p className="text-xs opacity-70">
            Drop the count to <strong>0</strong> — the badge disappears unless{" "}
            <strong>Show zero</strong> is on. A count badge is announced by
            screen readers; a bare dot is treated as decoration unless you give
            it a <code>label</code>.
          </p>
        </>
      }
      preview={
        <div className="w-full">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? tone : "neutral"}
            padding="md"
          >
            <div className="flex items-center gap-4">
              <Badge
                count={dot ? undefined : count}
                dot={dot}
                tone={tone}
                variant={variant}
                size={size}
                maxCount={maxCount}
                showZero={showZero}
                ring={ring}
                pulse={pulse}
              />
              <span className="text-xs opacity-60">
                {dot ? "dot" : `count ${count}`}
              </span>
            </div>
          </Panel>
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
