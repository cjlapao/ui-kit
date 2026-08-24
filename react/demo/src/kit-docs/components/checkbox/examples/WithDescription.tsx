import { Checkbox } from "@cjlapao/ui-kit";

export default function WithDescription() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Checkbox
        color="blue"
        label="Two-factor authentication"
        description="Adds a second step when signing in from a new device."
      />
      <Checkbox
        color="emerald"
        label="Public profile"
        description="Other members can find you by name."
        descriptionPlacement="inline"
        defaultChecked
      />
    </div>
  );
}
