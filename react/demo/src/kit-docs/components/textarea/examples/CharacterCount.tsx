import { useState } from "react";
import { Textarea } from "@cjlapao/ui-kit";

export default function CharacterCount() {
  const [value, setValue] = useState("A bio with a hard limit of 120 characters.");

  return (
    <div className="w-full max-w-sm">
      <Textarea
        label="Bio"
        helpText="The counter turns red once you hit the limit."
        maxLength={120}
        showCount
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
}
