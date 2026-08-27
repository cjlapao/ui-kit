import React, { useState } from "react";
import { BadgeIcon, Input, MultiToggle } from "@cjlapao/ui-kit";
import type { TrueColor } from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { trueColorOptions } from "../../shared/options";

const iconOptions = [
  { label: "Bell", value: "Notification" },
  { label: "Chat", value: "Chat" },
  { label: "Users", value: "Users" },
  { label: "Star", value: "Star" },
];

type BadgePosition = "top-start" | "top-end" | "bottom-start" | "bottom-end";

const positionOptions: { label: string; value: BadgePosition }[] = [
  { label: "Top start", value: "top-start" },
  { label: "Top end", value: "top-end" },
  { label: "Bottom start", value: "bottom-start" },
  { label: "Bottom end", value: "bottom-end" },
];

export const BadgeIconPlayground: React.FC = () => {
  const [icon, setIcon] = useState("Notification");
  const [badgeTone, setBadgeTone] = useState<TrueColor>("red");
  const [iconColor, setIconColor] = useState<TrueColor>("blue");
  const [count, setCount] = useState(5);
  const [maxCount, setMaxCount] = useState(99);
  const [position, setPosition] = useState<BadgePosition>("top-end");
  const [dot, setDot] = useState(false);

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
                    <Control label="Icon">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={iconOptions}
                        value={icon}
                        onChange={(value) => setIcon(value as string)}
                      />
                    </Control>
                    <SelectControl
                      label="Badge tone"
                      options={trueColorOptions}
                      value={badgeTone}
                      onChange={(value) => setBadgeTone(value as TrueColor)}
                    />
                  </>
                ),
              },
              {
                id: "icons",
                title: "Icons",
                controls: (
                  <SelectControl
                    label="Icon color"
                    options={trueColorOptions}
                    value={iconColor}
                    onChange={(value) => setIconColor(value as TrueColor)}
                  />
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <div className="grid grid-cols-2 gap-3">
                    <Control label="Count">
                      <Input
                        size="sm"
                        type="number"
                        value={count}
                        onChange={(event) => setCount(Number(event.target.value))}
                      />
                    </Control>
                    <Control label="Max count">
                      <Input
                        size="sm"
                        type="number"
                        value={maxCount}
                        onChange={(event) => setMaxCount(Number(event.target.value))}
                      />
                    </Control>
                  </div>
                ),
              },
              {
                id: "layout",
                title: "Layout",
                controls: (
                  <Control label="Position">
                    <MultiToggle
                      fullWidth
                      size="sm"
                      options={positionOptions}
                      value={position}
                      onChange={(value) => setPosition(value as BadgePosition)}
                    />
                  </Control>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: <ToggleRow label="Dot only" checked={dot} onChange={setDot} />,
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            A count above max count renders as {maxCount}+. A count of 0 hides
            the badge unless Dot only is on.
          </p>
        </div>
      }
      preview={
        <div className="flex h-40 w-40 items-center justify-center">
          <BadgeIcon
            icon={icon}
            srLabel="Badge icon preview"
            color={iconColor}
            badgeCount={count}
            badgeDot={dot}
            badgePosition={position}
            badgeProps={{ tone: badgeTone, maxCount }}
          />
        </div>
      }
    />
  );
};
