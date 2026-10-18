import { useState } from "react";
import { Button, MeterGroup } from "@cjlapao/ui-kit";

const ITEMS = [
  { label: "Apps", value: 16, color: "emerald" as const },
  { label: "Messages", value: 8, color: "amber" as const },
  { label: "Media", value: 24, color: "blue" as const },
];

const States = () => {
  const [state, setState] = useState<"normal" | "loading" | "empty" | "error">("normal");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={state === "normal" ? "solid" : "outline"} onClick={() => setState("normal")}>Normal</Button>
        <Button size="sm" variant={state === "loading" ? "solid" : "outline"} onClick={() => setState("loading")}>Loading</Button>
        <Button size="sm" variant={state === "empty" ? "solid" : "outline"} onClick={() => setState("empty")}>Empty</Button>
        <Button size="sm" variant={state === "error" ? "solid" : "outline"} onClick={() => setState("error")}>Error</Button>
      </div>

      <MeterGroup
        items={state === "empty" ? [] : ITEMS}
        loading={state === "loading"}
        error={state === "error" ? "Failed to load the meter. Please try again." : undefined}
        emptyMessage="No segments to display."
        ariaLabel="Storage usage"
      />
    </div>
  );
};

export default States;
