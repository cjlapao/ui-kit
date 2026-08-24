import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  Badge,
  MultiToggle,
  Panel,
  Select,
  Toggle,
  BADGE_VARIANTS,
  TRUE_COLORS,
} from "@cjlapao/ui-kit";
import type { BadgeSize, BadgeVariant, TrueColor } from "@cjlapao/ui-kit";
import { trueColorOptions } from "../constants";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-medium uppercase tracking-wide opacity-70">
      {label}
    </span>
    {children}
  </label>
);

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const variantOptions = BADGE_VARIANTS.map((value) => ({
  label: titleCase(value),
  value,
}));

const sizeOptions: { label: string; value: BadgeSize }[] = [
  { label: "XS", value: "xs" },
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
  { label: "XL", value: "xl" },
];

export const BadgeDemo: React.FC = () => {
  const [tone, setTone] = useState<TrueColor>("rose");
  const [variant, setVariant] = useState<BadgeVariant>("solid");
  const [size, setSize] = useState<BadgeSize>("sm");
  const [count, setCount] = useState(5);
  const [maxCount, setMaxCount] = useState(99);
  const [dot, setDot] = useState(false);
  const [ring, setRing] = useState(true);
  const [pulse, setPulse] = useState(false);
  const [showZero, setShowZero] = useState(false);
  const [onGlass, setOnGlass] = useState(false);

  const shared = { tone, variant, size, ring, pulse, maxCount, showZero };

  const preview = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Caption>Current settings</Caption>
        <div className="flex flex-wrap items-center gap-4">
          <Badge {...shared} dot={dot} count={dot ? undefined : count} />
          <span className="text-xs opacity-60">
            {dot ? "dot" : `count ${count}`}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every tone</Caption>
        <div className="flex flex-wrap gap-2">
          {TRUE_COLORS.map((each) => (
            <Badge key={each} {...shared} tone={each} count={count} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Every variant</Caption>
        <div className="flex flex-wrap items-center gap-3">
          {BADGE_VARIANTS.map((each) => (
            <span key={each} className="flex items-center gap-1.5">
              <Badge {...shared} variant={each} count={count} />
              <span className="text-xs opacity-60">{each}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Size ladder — count and dot</Caption>
        <div className="flex flex-wrap items-center gap-4">
          {sizeOptions.map(({ value }) => (
            <span key={value} className="flex items-center gap-1.5">
              <Badge {...shared} size={value} count={count} />
              <Badge {...shared} size={value} dot />
              <span className="text-xs opacity-60">{value}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Overflow at maxCount {maxCount}</Caption>
        <div className="flex flex-wrap items-center gap-3">
          {[1, maxCount - 1, maxCount, maxCount + 1, maxCount * 20].map((n) => (
            <Badge key={n} {...shared} count={n} />
          ))}
          <Badge {...shared} count="new" />
          <span className="text-xs opacity-60">
            a non-numeric value is left alone
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Caption>Overlapping a target — what the ring is for</Caption>
        <div className="flex flex-wrap items-center gap-6">
          {["Ring on", "Ring off"].map((label, index) => (
            <span key={label} className="flex items-center gap-2">
              <span className="relative inline-flex">
                <span className="h-9 w-9 rounded-lg bg-blue-500" />
                <span className="absolute -right-1.5 -top-1.5">
                  <Badge
                    {...shared}
                    ring={index === 0}
                    count={dot ? undefined : count}
                    dot={dot}
                  />
                </span>
              </span>
              <span className="text-xs opacity-60">{label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Badge"
      label="[Badge]"
      description="Notification counts and status dots. Three variants, the full tone set, and a ring that keeps it legible where it overlaps something."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Tone">
              <Select
                value={tone}
                onChange={(event) => setTone(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Variant">
              <MultiToggle
                fullWidth
                size="sm"
                options={variantOptions}
                value={variant}
                onChange={(value) => setVariant(value as BadgeVariant)}
              />
            </Field>
          </div>

          <Field label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={sizeOptions}
              value={size}
              onChange={(value) => setSize(value as BadgeSize)}
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label={`Count — ${count}`}>
              <input
                type="range"
                min={0}
                max={250}
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
                className="w-full accent-blue-500"
              />
            </Field>
            <Field label={`Max count — ${maxCount}`}>
              <input
                type="range"
                min={5}
                max={999}
                value={maxCount}
                onChange={(event) => setMaxCount(Number(event.target.value))}
                className="w-full accent-blue-500"
              />
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Dot"
              checked={dot}
              onChange={(event) => setDot(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Ring"
              checked={ring}
              onChange={(event) => setRing(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Pulse"
              checked={pulse}
              onChange={(event) => setPulse(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Show zero"
              checked={showZero}
              onChange={(event) => setShowZero(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="On a glass panel"
              checked={onGlass}
              onChange={(event) => setOnGlass(event.target.checked)}
            />
          </div>

          <p className="text-xs opacity-70">
            Drop the count to <strong>0</strong> — the badge disappears unless{" "}
            <strong>Show zero</strong> is on. A count badge is announced by
            screen readers; a bare dot is treated as decoration unless you give
            it a <code>label</code>.
          </p>
        </div>
      }
      preview={
        <div className="p-4">
          <Panel
            variant={onGlass ? "liquid-glass" : "outlined"}
            tone={onGlass ? tone : "neutral"}
            padding="md"
          >
            {preview}
          </Panel>
        </div>
      }
    />
  );
};
