import React, { useState } from "react";
import { Badge, BadgeIcon, Input, MultiToggle, Select, Toggle } from "@cjlapao/ui-kit";
import type { MultiToggleOption, TrueColor } from "@cjlapao/ui-kit";
import { PlaygroundSection } from "../PlaygroundSection";
import { trueColorOptions } from "../constants";

type BadgePosition = "top-start" | "top-end" | "bottom-start" | "bottom-end";

const positionOptions: MultiToggleOption[] = [
  { label: "Top start", value: "top-start" },
  { label: "Top end", value: "top-end" },
  { label: "Bottom start", value: "bottom-start" },
  { label: "Bottom end", value: "bottom-end" },
];

/** A representative spread rather than all 21, so the row stays scannable. */
const TONE_SAMPLE: TrueColor[] = [
  "neutral",
  "slate",
  "red",
  "rose",
  "orange",
  "amber",
  "green",
  "emerald",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
];

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
    {children}
  </span>
);

export const BadgeIconDemo: React.FC = () => {
  const [count, setCount] = useState(5);
  const [maxCount, setMaxCount] = useState(99);
  const [position, setPosition] = useState<BadgePosition>("top-end");
  const [dot, setDot] = useState(false);
  const [badgeTone, setBadgeTone] = useState<TrueColor>("red");
  const [iconColor, setIconColor] = useState<TrueColor>("neutral");

  const badgeProps = { tone: badgeTone, maxCount };

  return (
    <PlaygroundSection
      title="BadgeIcon"
      label="[BadgeIcon]"
      description="An icon button with a badge indicator — badge tone, icon colour, count, overflow and placement."
      controls={
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Badge tone
              </span>
              <Select
                size="sm"
                value={badgeTone}
                onChange={(e) => setBadgeTone(e.target.value as TrueColor)}
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
                Icon colour
              </span>
              <Select
                size="sm"
                value={iconColor}
                onChange={(e) => setIconColor(e.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Count
              </span>
              <Input
                size="sm"
                type="number"
                value={count.toString()}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Max count
              </span>
              <Input
                size="sm"
                type="number"
                value={maxCount.toString()}
                onChange={(e) => setMaxCount(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
              Position
            </span>
            <MultiToggle
              fullWidth
              size="sm"
              options={positionOptions}
              value={position}
              onChange={(value) => setPosition(value as BadgePosition)}
            />
          </div>
          <Toggle
            label="Dot only"
            checked={dot}
            onChange={(e) => setDot(e.target.checked)}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            A count above <strong>max count</strong> renders as{" "}
            <code>{maxCount}+</code>. A count of <code>0</code> hides the badge
            unless <strong>dot only</strong> is on.
          </p>
        </div>
      }
      preview={
        <div className="space-y-8 p-4">
          <div className="space-y-3">
            <Caption>Live</Caption>
            <div className="flex items-center gap-8">
              {(["Notification", "Chat", "Users"] as const).map((icon) => (
                <BadgeIcon
                  key={icon}
                  icon={icon}
                  srLabel={icon}
                  color={iconColor}
                  badgeCount={count}
                  badgeDot={dot}
                  badgePosition={position}
                  badgeProps={badgeProps}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Caption>Badge tones</Caption>
            <div className="flex flex-wrap items-center gap-2">
              {TONE_SAMPLE.map((tone) => (
                <Badge key={tone} count={count || 5} tone={tone} />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {TONE_SAMPLE.map((tone) => (
                <Badge key={tone} dot tone={tone} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Caption>Counts and overflow</Caption>
            <div className="flex flex-wrap items-center gap-2">
              {[1, 5, 9, 10, 42, 99, 100, 1000].map((n) => (
                <Badge key={n} count={n} tone={badgeTone} maxCount={maxCount} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Caption>Placement</Caption>
            <div className="flex items-center gap-8">
              {positionOptions.map((option) => (
                <div key={String(option.value)} className="flex flex-col items-center gap-1">
                  <BadgeIcon
                    icon="Notification"
                    srLabel={String(option.label)}
                    color={iconColor}
                    badgeCount={count}
                    badgeDot={dot}
                    badgePosition={option.value as BadgePosition}
                    badgeProps={badgeProps}
                    onClick={() => {}}
                  />
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
};
