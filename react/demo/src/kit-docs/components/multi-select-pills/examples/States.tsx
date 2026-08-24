import { useState, type ReactNode } from "react";
import { MultiSelectPills } from "@cjlapao/ui-kit";
import type { MultiSelectPillOption } from "@cjlapao/ui-kit";

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const OPTIONS: MultiSelectPillOption[] = [
  { value: "daily", label: "Daily", icon: "Calendar" },
  { value: "weekly", label: "Weekly", icon: "Calendar" },
  { value: "monthly", label: "Monthly", icon: "Calendar" },
  { value: "custom", label: "Custom", icon: "Cog", disabled: true },
];

const States = () => {
  const [required, setRequired] = useState<string[]>(["daily"]);
  const [whole, setWhole] = useState<string[]>(["weekly"]);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Caption>Required choice — allowDeselect off, so it can't be emptied</Caption>
        <MultiSelectPills
          name="schedule"
          options={OPTIONS}
          value={required}
          onChange={setRequired}
          selectionMode="single"
          allowDeselect={false}
          checkmark
          color="emerald"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Caption>Whole group disabled — "Custom" is also disabled per-option</Caption>
        <MultiSelectPills
          name="schedule-disabled"
          options={OPTIONS}
          value={whole}
          onChange={setWhole}
          disabled
          color="slate"
        />
      </div>
    </div>
  );
};

export default States;
