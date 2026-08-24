import React, { useState } from "react";
import { Button, MultiToggle } from "@cjlapao/ui-kit";
import type { TooltipPosition } from "@cjlapao/ui-kit";
import { Control, PlaygroundPanel, ToggleRow } from "../../shared/PlaygroundPanel";
import { Tooltip } from "@cjlapao/ui-kit";

const positionOptions = [
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
];

const delayOptions = [
  { label: "0ms", value: "0" },
  { label: "500ms", value: "500" },
  { label: "1000ms", value: "1000" },
];

export const TooltipPlayground: React.FC = () => {
  const [position, setPosition] = useState<TooltipPosition>("top");
  const [delay, setDelay] = useState<number>(500);
  const [solid, setSolid] = useState(true);

  return (
    <PlaygroundPanel
      controls={
        <>
          <Control label="Position">
            <MultiToggle
              fullWidth
              size="sm"
              options={positionOptions}
              value={position}
              onChange={(value) => setPosition(value as TooltipPosition)}
            />
          </Control>
          <Control label="Delay">
            <MultiToggle
              fullWidth
              size="sm"
              options={delayOptions}
              value={String(delay)}
              onChange={(value) => setDelay(Number(value))}
            />
          </Control>
          <ToggleRow
            label="Solid trigger"
            checked={solid}
            onChange={setSolid}
          />
        </>
      }
      preview={
        <Tooltip
          text={`I appear ${position === "top" ? "above" : "below"} the trigger after ${delay}ms.`}
          position={position}
          delay={delay}
        >
          <Button variant={solid ? "solid" : "soft"} color="blue">
            Hover me
          </Button>
        </Tooltip>
      }
    >
    </PlaygroundPanel>
  );
};
