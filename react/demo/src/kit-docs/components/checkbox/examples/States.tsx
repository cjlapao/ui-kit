import { Checkbox } from "@cjlapao/ui-kit";

export default function States() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        tone="blue"
        label="Checked and disabled"
        defaultChecked
        disabled
      />
      <Checkbox tone="blue" label="Unchecked and disabled" disabled />
      <Checkbox tone="blue" label="Some items selected" indeterminate />
    </div>
  );
}
