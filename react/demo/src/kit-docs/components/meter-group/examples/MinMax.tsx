import { MeterGroup } from "@cjlapao/ui-kit";

const ITEMS = [
  { label: "Planned", value: 72, color: "sky" as const },
  { label: "In review", value: 31, color: "amber" as const },
  { label: "Blocked", value: 18, color: "rose" as const },
];

export const MinMax = () => (
  <MeterGroup items={ITEMS} min={0} max={200} ariaLabel="Sprint capacity" />
);

export default MinMax;
