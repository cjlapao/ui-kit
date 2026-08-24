import { Toggle } from "@cjlapao/ui-kit";

export default function Icons() {
  return (
    <div className="flex w-full max-w-xs flex-col items-start gap-3">
      <Toggle iconOn="Sun" iconOff="Moon" defaultChecked label="Light mode" />
      <Toggle iconOn="Sun" iconOff="Moon" label="Dark mode" />
    </div>
  );
}
