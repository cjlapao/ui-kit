import { useState } from "react";
import { Combobox } from "@cjlapao/ui-kit";
import type { ComboboxOption } from "@cjlapao/ui-kit";

/**
 * An option can be a bare string or an object with a label, a description, an
 * icon and a disabled flag. The keyboard skips a disabled row rather than
 * landing on it and refusing.
 */
const REGIONS: ComboboxOption[] = [
  { value: "eu-west-1", label: "Ireland", description: "eu-west-1", icon: "Globe" },
  { value: "eu-central-1", label: "Frankfurt", description: "eu-central-1", icon: "Globe" },
  { value: "us-east-1", label: "N. Virginia", description: "us-east-1", icon: "Globe" },
  {
    value: "ap-southeast-2",
    label: "Sydney",
    description: "Not enabled for this account",
    icon: "Globe",
    disabled: true,
  },
];

export default function RichOptions() {
  const [value, setValue] = useState("eu-west-1");
  return (
    <div className="w-full max-w-sm">
      <Combobox
        options={REGIONS}
        value={value}
        onChange={setValue}
        leadingIcon="Globe"
        placeholder="Choose a region…"
      />
    </div>
  );
}
