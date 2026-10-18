import { MeterGroup } from "@cjlapao/ui-kit";

const ITEMS = [
  { label: "Apps", value: 16, color: "emerald" as const, icon: "Dashboard" },
  { label: "Messages", value: 8, color: "amber" as const, icon: "Chat" },
  { label: "Media", value: 24, color: "blue" as const, icon: "Details" },
  { label: "System", value: 10, color: "violet" as const, icon: "Cog" },
];

export const Icons = () => (
  <MeterGroup items={ITEMS} ariaLabel="Storage usage" />
);

export default Icons;
