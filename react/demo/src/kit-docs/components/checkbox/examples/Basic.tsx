import { Checkbox } from "@cjlapao/ui-kit";

export default function Basic() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox color="blue" label="Accept the terms and conditions" defaultChecked />
      <Checkbox color="blue" label="Subscribe to the newsletter" />
    </div>
  );
}
