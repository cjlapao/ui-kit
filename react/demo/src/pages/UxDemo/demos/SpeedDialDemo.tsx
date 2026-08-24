// @ts-nocheck
import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  SpeedDial,
  MultiToggle,
  Toggle,
  Input,
  ButtonVariant,
  ButtonColor,
  ButtonSize,
  SpeedDialType,
  SpeedDialDirection,
  SpeedDialItem,
} from "@cjlapao/ui-kit";
import {
  buttonVariantOptions,
  buttonSizeOptions,
  colorOptions,
  speedDialTypeOptions,
  speedDialDirectionOptions,
} from "../constants";

const DIAL_ITEMS: SpeedDialItem[] = [
  { icon: "Edit", label: "Edit" },
  { icon: "Refresh", label: "Refresh" },
  { icon: "Trash", label: "Delete" },
  { icon: "Copy", label: "Copy" },
];

const MINI_ITEMS: SpeedDialItem[] = [
  { icon: "Edit", label: "Edit" },
  { icon: "Refresh", label: "Refresh" },
  { icon: "Trash", label: "Delete" },
];

export const SpeedDialDemo: React.FC = () => {
  const [dialType, setDialType] = useState<SpeedDialType>("linear");
  const [dialDirection, setDialDirection] =
    useState<SpeedDialDirection>("up");
  const [dialRadius, setDialRadius] = useState(0);
  const [dialDelay, setDialDelay] = useState(30);
  const [dialMask, setDialMask] = useState(false);
  const [dialVariant, setDialVariant] = useState<ButtonVariant>("solid");
  const [dialColor, setDialColor] = useState<ButtonColor>("blue");
  const [dialSize, setDialSize] = useState<ButtonSize>("lg");
  const [dialLabels, setDialLabels] = useState(true);
  const [dialLiquid, setDialLiquid] = useState(false);
  const [itemStyles, setItemStyles] = useState<
    Array<{ variant: ButtonVariant; color: ButtonColor }>
  >([
    { variant: "soft", color: "blue" },
    { variant: "soft", color: "blue" },
    { variant: "soft", color: "blue" },
    { variant: "soft", color: "blue" },
  ]);

  const updateItemStyle = (
    index: number,
    patch: { variant?: ButtonVariant; color?: ButtonColor },
  ) =>
    setItemStyles((prev) =>
      prev.map((style, i) => (i === index ? { ...style, ...patch } : style)),
    );

  const dialItems: SpeedDialItem[] = DIAL_ITEMS.map((item, index) => ({
    ...item,
    ...itemStyles[index],
  }));

  const handleTypeChange = (value: string) => {
    const next = value as SpeedDialType;
    setDialType(next);
    const valid = speedDialDirectionOptions[next].map((o) => o.value);
    if (!valid.includes(dialDirection)) {
      setDialDirection(speedDialDirectionOptions[next][0].value);
    }
  };

  return (
    <PlaygroundSection
      title="Speed Dial"
      label="[SpeedDial]"
      description="Floating action button that reveals a menu of related actions — linear, semi-circle, quarter-circle and circle layouts in the kit's button styling, glass included."
      controls={
        <div className="space-y-4 text-sm">
          <label className="flex flex-col gap-2">
            <span>Type</span>
            <MultiToggle
              fullWidth
              size="sm"
              options={speedDialTypeOptions}
              value={dialType}
              onChange={handleTypeChange}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Direction</span>
            <MultiToggle
              fullWidth
              size="sm"
              options={speedDialDirectionOptions[dialType]}
              value={dialDirection}
              onChange={(value) => setDialDirection(value as SpeedDialDirection)}
            />
            {dialType === "circle" && (
              <span className="text-xs text-slate-400">
                The ring is direction-agnostic.
              </span>
            )}
          </label>
          <label className="flex flex-col gap-2">
            <span>Radius (0 = auto)</span>
            <Input
              size="sm"
              type="number"
              min={0}
              value={dialRadius}
              onChange={(event) =>
                setDialRadius(Math.max(0, Number(event.target.value) || 0))
              }
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Transition delay ({dialDelay}ms)</span>
            <input
              type="range"
              min={0}
              max={150}
              step={10}
              value={dialDelay}
              onChange={(event) => setDialDelay(Number(event.target.value))}
              className="w-full accent-blue-500"
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            <span>Labels</span>
            <Toggle
              size="sm"
              checked={dialLabels}
              onChange={(event) => setDialLabels(event.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            <span>Mask</span>
            <Toggle
              size="sm"
              checked={dialMask}
              onChange={(event) => setDialMask(event.target.checked)}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Variant</span>
            <MultiToggle
              fullWidth
              size="sm"
              options={buttonVariantOptions}
              value={dialVariant}
              onChange={(value) => setDialVariant(value as ButtonVariant)}
            />
          </label>
          {dialVariant === "glass" && (
            <label className="flex items-center justify-between gap-2">
              <span>Liquid glass</span>
              <Toggle
                size="sm"
                checked={dialLiquid}
                onChange={(event) => setDialLiquid(event.target.checked)}
              />
            </label>
          )}
          <label className="flex flex-col gap-2">
            <span>Color</span>
            <MultiToggle
              fullWidth
              size="sm"
              options={colorOptions}
              value={dialColor}
              onChange={(value) => setDialColor(value as ButtonColor)}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Size</span>
            <MultiToggle
              fullWidth
              size="sm"
              options={buttonSizeOptions}
              value={dialSize}
              onChange={(value) => setDialSize(value as ButtonSize)}
            />
          </label>
          <div className="space-y-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <span className="block">Item styles (per button)</span>
            {DIAL_ITEMS.map((item, index) => (
              <div key={item.icon} className="space-y-2">
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                  {item.label}
                </span>
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={buttonVariantOptions}
                  value={itemStyles[index].variant}
                  onChange={(value) =>
                    updateItemStyle(index, { variant: value as ButtonVariant })
                  }
                />
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={colorOptions}
                  value={itemStyles[index].color}
                  onChange={(value) =>
                    updateItemStyle(index, { color: value as ButtonColor })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      }
      preview={
        <div className="flex flex-col gap-6">
          <div className="relative h-[420px] overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40">
            <span className="pointer-events-none absolute inset-x-0 top-3 text-center text-xs text-slate-400">
              Anchored bottom-right with room for the fan — expand from the button
            </span>
            <SpeedDial
              className={
                dialType === "circle"
                  ? "absolute bottom-36 right-28"
                  : "absolute bottom-8 right-24"
              }
              items={dialItems}
              type={dialType}
              direction={dialDirection}
              radius={dialRadius}
              transitionDelay={dialDelay}
              mask={dialMask}
              showLabels={dialLabels}
              variant={dialVariant}
              color={dialColor}
              size={dialSize}
              vibrancy={dialLiquid ? "high" : undefined}
              glassOpacity={dialLiquid ? "light" : undefined}
              specularMode={dialLiquid ? "classic" : undefined}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative h-56 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40">
              <span className="absolute left-3 top-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                Glass
              </span>
              <SpeedDial
                className="absolute bottom-5 right-5"
                items={MINI_ITEMS}
                variant="glass"
                color="blue"
                size="md"
              />
            </div>
            <div className="relative h-56 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40">
              <span className="absolute left-3 top-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                Per-item variants
              </span>
              <SpeedDial
                className="absolute bottom-5 right-5"
                items={[
                  { icon: "Edit", label: "Edit", variant: "solid", color: "emerald" },
                  { icon: "Refresh", label: "Refresh", variant: "outline", color: "rose" },
                  { icon: "Trash", label: "Delete", variant: "soft", color: "amber" },
                ]}
                size="md"
              />
            </div>
            <div className="relative h-56 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40">
              <span className="absolute left-3 top-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                Glass rose · circle
              </span>
              <SpeedDial
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                items={DIAL_ITEMS}
                type="circle"
                radius={72}
                variant="glass"
                color="rose"
                size="sm"
              />
            </div>
          </div>
        </div>
      }
    />
  );
};
