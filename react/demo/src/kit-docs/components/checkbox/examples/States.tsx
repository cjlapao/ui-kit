import { Checkbox } from "@cjlapao/ui-kit";

export default function States() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox color="blue" label="Checked and disabled" defaultChecked disabled />
      <Checkbox color="blue" label="Unchecked and disabled" disabled />
      <Checkbox color="blue" label="Some items selected" indeterminate />
    </div>
  );
}
