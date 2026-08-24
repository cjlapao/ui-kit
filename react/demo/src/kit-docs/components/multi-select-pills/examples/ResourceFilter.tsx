import { useState, type ReactNode } from "react";
import { MultiSelectPills } from "@cjlapao/ui-kit";
import type { MultiSelectPillOption } from "@cjlapao/ui-kit";

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const OPTIONS: MultiSelectPillOption[] = [
  { value: "containers", label: "Containers", icon: "Container", description: "42" },
  { value: "images", label: "Images", icon: "Docker", description: "17" },
  { value: "volumes", label: "Volumes", icon: "Save", description: "8" },
  { value: "networks", label: "Networks", icon: "Globe", description: "3" },
  { value: "secrets", label: "Secrets", icon: "Key", description: "0" },
];

const ResourceFilter = () => {
  const [selected, setSelected] = useState<string[]>(["containers", "images"]);

  return (
    <div className="flex w-full flex-col gap-3">
      <MultiSelectPills
        name="resources"
        options={OPTIONS}
        value={selected}
        onChange={setSelected}
        legend="Resources to include"
        description="Pick what the backup job should snapshot."
        color="blue"
      />
      <Caption>Selected</Caption>
      <code className="rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10">
        {selected.length
          ? selected.map((value) => `resources[]=${value}`).join("&")
          : "— nothing selected —"}
      </code>
    </div>
  );
};

export default ResourceFilter;
