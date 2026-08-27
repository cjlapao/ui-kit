import { useState } from "react";
import { MultiToggle } from "@cjlapao/ui-kit";

/**
 * `tone` is the accent — it used to be `color`, which is the name no other
 * control in the kit uses. `color` still works and is deprecated.
 *
 * The tokens are generated from the theme. The 21-entry map they replaced had
 * `green` painting **emerald** classes and `red` painting **rose**, so those
 * two rendered as their neighbours while the other nineteen were correct.
 */
export default function Tones() {
  const [value, setValue] = useState("b");
  return (
    <div className="flex flex-wrap gap-4">
      {(["red", "green", "blue", "violet", "amber"] as const).map((color) => (
        <div key={color} className="flex flex-col items-center gap-1">
          <MultiToggle
            tone={color}
            value={value}
            onChange={setValue}
            options={[
              { value: "a", label: "A" },
              { value: "b", label: "B" },
            ]}
          />
          <span className="text-[11px] opacity-60">{color}</span>
        </div>
      ))}
    </div>
  );
}
