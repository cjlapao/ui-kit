import { useState } from "react";
import { CONTROL_SIZES, MultiToggle } from "@cjlapao/ui-kit";

/**
 * The full shared control scale. It used to declare its own
 * `"sm" | "md" | "lg"`, so a toggle could not line up with the `xs` or `xl`
 * Button beside it.
 */
export default function Sizes() {
  const [value, setValue] = useState("b");
  return (
    <div className="flex flex-col items-start gap-3">
      {CONTROL_SIZES.map((size) => (
        <MultiToggle
          key={size}
          size={size}
          value={value}
          onChange={setValue}
          options={[
            { value: "a", label: "One" },
            { value: "b", label: "Two" },
            { value: "c", label: "Three" },
          ]}
        />
      ))}
    </div>
  );
}
