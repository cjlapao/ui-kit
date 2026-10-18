import { useState } from "react";
import { Button, MeterGroup } from "@cjlapao/ui-kit";
import type { MeterGroupLabelPosition } from "@cjlapao/ui-kit";

const ITEMS = [
  { label: "Apps", value: 16, color: "emerald" as const },
  { label: "Messages", value: 8, color: "amber" as const },
  { label: "Media", value: 24, color: "blue" as const },
  { label: "System", value: 10, color: "violet" as const },
];

export const Labels = () => {
  const [position, setPosition] = useState<MeterGroupLabelPosition>("end");
  const [vertical, setVertical] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={position === "end" ? "solid" : "outline"} onClick={() => setPosition("end")}>
          Labels end
        </Button>
        <Button size="sm" variant={position === "start" ? "solid" : "outline"} onClick={() => setPosition("start")}>
          Labels start
        </Button>
        <Button size="sm" variant={vertical ? "solid" : "outline"} onClick={() => setVertical(!vertical)}>
          List {vertical ? "vertical" : "horizontal"}
        </Button>
      </div>
      <MeterGroup
        items={ITEMS}
        labelPosition={position}
        labelOrientation={vertical ? "vertical" : "horizontal"}
        ariaLabel="Storage usage"
      />
    </div>
  );
};

export default Labels;
