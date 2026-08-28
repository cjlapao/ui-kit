import { DatePicker, FormField } from "@cjlapao/ui-kit";

const start = new Date();
const inDays = (n: number) =>
  new Date(start.getFullYear(), start.getMonth(), start.getDate() + n);

export default function FormFieldExample() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <FormField
        label="Start date"
        description="When the engagement begins."
      >
        <DatePicker placeholder="Pick a date" defaultValue={inDays(7)} />
      </FormField>
      <FormField
        label="Contract window"
        description="Open ranges show only the start until the end is picked."
      >
        <DatePicker
          selectionMode="range"
          placeholder="Pick a range"
          defaultValue={[inDays(7), inDays(40)]}
        />
      </FormField>
    </div>
  );
}
