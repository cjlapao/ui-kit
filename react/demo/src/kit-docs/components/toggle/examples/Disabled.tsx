import { Toggle } from "@cjlapao/ui-kit";

export default function Disabled() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Toggle color="blue" label="Enabled" defaultChecked />
      <Toggle color="blue" label="Disabled on" defaultChecked disabled />
      <Toggle color="blue" label="Disabled off" disabled />
    </div>
  );
}
