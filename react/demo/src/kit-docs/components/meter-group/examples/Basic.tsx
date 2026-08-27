import { MeterGroup } from "@cjlapao/ui-kit";

const ITEMS = [
  { label: "Apps", value: 16, color: "emerald" as const },
  { label: "Messages", value: 8, color: "amber" as const },
  { label: "Media", value: 24, color: "blue" as const },
  { label: "System", value: 10, color: "violet" as const },
];

export const Basic = () => <MeterGroup items={ITEMS} ariaLabel="Storage usage" />;

export default Basic;
