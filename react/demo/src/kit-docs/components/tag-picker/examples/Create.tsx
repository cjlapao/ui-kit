import { useState } from "react";
import { TagPicker } from "@cjlapao/ui-kit";

/**
 * With `allowCreate`, a query matching nothing offers a create row. Values
 * added during this session are highlighted so the user can see what they just
 * did — both in the trigger pills and in the list.
 */
export default function Create() {
  const [value, setValue] = useState<string[]>(["prod"]);
  return (
    <div className="w-full max-w-sm">
      <TagPicker
        allowCreate
        items={[
          { id: "prod", label: "prod" },
          { id: "staging", label: "staging" },
        ]}
        value={value}
        onChange={setValue}
      />
    </div>
  );
}
