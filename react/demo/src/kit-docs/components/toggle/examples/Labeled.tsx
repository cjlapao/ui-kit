import { Toggle } from "@cjlapao/ui-kit";

export default function Labeled() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Toggle
        tone="blue"
        label="Receive email digests"
        description="A summary of activity, once a day."
        defaultChecked
      />
      <Toggle
        tone="emerald"
        label="Compact view"
        description="Fit more rows on screen."
        descriptionPlacement="inline"
      />
    </div>
  );
}
