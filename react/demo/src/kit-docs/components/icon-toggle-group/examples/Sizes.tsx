import { useState } from "react";
import { CONTROL_SIZES, IconToggleGroup } from "@cjlapao/ui-kit";

/**
 * The full shared control scale. The buttons size themselves through the
 * same `ControlSize` tokens as `IconButton`, so a group lines up with the
 * `IconButton` or `Button` beside it — the track only adds the padding and
 * the gap.
 */
export default function Sizes() {
  const [value, setValue] = useState("rows");
  return (
    <div className="flex flex-col items-start gap-3">
      {CONTROL_SIZES.map((size) => (
        <IconToggleGroup
          key={size}
          size={size}
          value={value}
          onChange={setValue}
          options={[
            { value: "grid", icon: "ViewGrid", label: "Grid view" },
            { value: "rows", icon: "ViewRows", label: "Row view" },
            { value: "board", icon: "Dashboard", label: "Board view" },
          ]}
        />
      ))}
    </div>
  );
}
