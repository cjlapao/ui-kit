import { Toggle } from "@cjlapao/ui-kit";

export default function Sizes() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Toggle size="xs" color="blue" label="Extra small" defaultChecked />
      <Toggle size="sm" color="blue" label="Small" defaultChecked />
      <Toggle size="md" color="blue" label="Medium" defaultChecked />
      <Toggle size="lg" color="blue" label="Large" defaultChecked />
      <Toggle size="xl" color="blue" label="Extra large" defaultChecked />
    </div>
  );
}
