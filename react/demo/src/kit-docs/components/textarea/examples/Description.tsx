import { useState } from "react";
import { Textarea } from "@cjlapao/ui-kit";

export default function Description() {
  const [value, setValue] = useState("A short intro shown on your profile.");

  return (
    <div className="w-full max-w-sm">
      <Textarea
        label="Description"
        helpText="Markdown is supported."
        maxLength={200}
        showCount
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Tell people about yourself…"
      />
    </div>
  );
}
