import { type ReactNode } from "react";
import { MultiSelectPills, Panel } from "@cjlapao/ui-kit";
import type { MultiSelectPillOption } from "@cjlapao/ui-kit";

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const OPTIONS: MultiSelectPillOption[] = [
  { value: "containers", label: "Containers", icon: "Container" },
  { value: "images", label: "Images", icon: "Docker" },
  { value: "volumes", label: "Volumes", icon: "Save" },
  { value: "networks", label: "Networks", icon: "Globe" },
];

const UncontrolledAndGlass = () => (
  <div className="flex w-full flex-col gap-5">
    <div className="flex flex-col gap-2">
      <Caption>Uncontrolled — it keeps its own state</Caption>
      <MultiSelectPills
        name="uncontrolled"
        options={OPTIONS}
        defaultValue={["volumes"]}
        color="blue"
      />
    </div>
    <div className="flex flex-col gap-2">
      <Caption>Glass variant on a glass panel</Caption>
      <Panel variant="liquid-glass" tone="blue" padding="md">
        <MultiSelectPills
          name="glass"
          options={OPTIONS}
          defaultValue={["containers", "networks"]}
          variant="liquid-glass"
          unselectedVariant="glass"
          color="blue"
        />
      </Panel>
    </div>
  </div>
);

export default UncontrolledAndGlass;
