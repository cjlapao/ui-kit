import { useState } from "react";
import {
  Button,
  FieldRow,
  FormField,
  Input,
  Picker,
  type PickerItem,
} from "@cjlapao/ui-kit";

const REGION: PickerItem[] = [
  { id: "eu", title: "eu-west-1", subtitle: "Ireland" },
  { id: "us", title: "us-east-1", subtitle: "N. Virginia" },
];

/**
 * The three bands the row shares: labels, controls, notes. Each field here
 * carries a different amount of top matter (a wrapping label, a
 * description, none) and different notes below (a hint, none) — with
 * per-field flex the controls would land on three different baselines. The
 * row sizes each band once, from the tallest member, and every control
 * still starts at the same line.
 */
export default function Bands() {
  const [region, setRegion] = useState("eu");

  return (
    <div className="w-full rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
      <FieldRow gap="md">
        <FormField
          label="Deployment region with a long wrapping label"
          description="Pick where the workload lands."
          hint="Regions near your users."
          className="w-72 max-w-full"
        >
          <Picker
            items={REGION}
            selectedId={region}
            onSelect={(item) => setRegion(item.id)}
            variant="ghost"
            tone="neutral"
          />
        </FormField>
        <FormField label="Name" className="w-48">
          <Input placeholder="service-name" variant="ghost" />
        </FormField>
        <FormField label="Replicas" className="w-28" helpText="1–20">
          <Input defaultValue="2" variant="ghost" />
        </FormField>
        <Button variant="solid" color="blue">
          Deploy
        </Button>
      </FieldRow>
    </div>
  );
}
