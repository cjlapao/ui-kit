import { Toggle } from "@cjlapao/ui-kit";

export default function Sizes() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Toggle size="xs" tone="blue" label="Extra small" defaultChecked />
      <Toggle size="sm" tone="blue" label="Small" defaultChecked />
      <Toggle size="md" tone="blue" label="Medium" defaultChecked />
      <Toggle size="lg" tone="blue" label="Large" defaultChecked />
      <Toggle size="xl" tone="blue" label="Extra large" defaultChecked />
    </div>
  );
}
