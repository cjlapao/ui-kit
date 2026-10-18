import { MeterGroup } from "@cjlapao/ui-kit";

const ITEMS = [
  { label: "Apps", value: 38, color: "emerald" as const },
  { label: "Messages", value: 22, color: "amber" as const },
  { label: "Media", value: 27, color: "blue" as const },
];

export const Vertical = () => (
  <div className="flex justify-center">
    <MeterGroup
      items={ITEMS}
      orientation="vertical"
      labelOrientation="vertical"
      height="220px"
      ariaLabel="Storage usage"
    />
  </div>
);

export default Vertical;
