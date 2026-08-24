import { useState, type ReactNode } from "react";
import { MultiSelectPills } from "@cjlapao/ui-kit";
import type { MultiSelectPillOption } from "@cjlapao/ui-kit";

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const ENVIRONMENTS: MultiSelectPillOption[] = [
  { value: "dev", label: "Development", icon: "Rocket" },
  { value: "staging", label: "Staging", icon: "Globe" },
  { value: "prod", label: "Production", icon: "Host" },
];

const SingleChoice = () => {
  const [selected, setSelected] = useState<string[]>(["prod"]);

  return (
    <div className="flex w-full flex-col gap-3">
      <MultiSelectPills
        name="environment"
        options={ENVIRONMENTS}
        value={selected}
        onChange={setSelected}
        selectionMode="single"
        checkmark
        color="violet"
        legend="Target environment"
        description="Single choice — picking another swaps it."
      />
      <Caption>Selected</Caption>
      <code className="rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10">
        {selected.length
          ? selected.map((value) => `environment[]=${value}`).join("&")
          : "— nothing selected —"}
      </code>
    </div>
  );
};

export default SingleChoice;
