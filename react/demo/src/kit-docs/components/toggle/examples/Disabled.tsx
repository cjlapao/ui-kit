import { Toggle } from "@cjlapao/ui-kit";

export default function Disabled() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Toggle tone="blue" label="Enabled" defaultChecked />
      <Toggle tone="blue" label="Disabled on" defaultChecked disabled />
      <Toggle tone="blue" label="Disabled off" disabled />
    </div>
  );
}
