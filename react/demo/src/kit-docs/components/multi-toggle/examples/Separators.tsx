import { useState } from "react";
import { MultiToggle } from "@cjlapao/ui-kit";
import type { MultiToggleOption } from "@cjlapao/ui-kit";

// A review-queue filter row: segments floating on the page with no track,
// and the "All" counter behind a rule. The rule's own padding — not the item
// gap — is what spaces it, so "Discarded" never pays gap *plus* separator.
const OPTIONS: MultiToggleOption[] = [
  { value: "waiting", label: "Waiting" },
  { value: "committed", label: "Committed" },
  { value: "rejected", label: "Rejected" },
  { value: "discarded", label: "Discarded" },
  { type: "separator" },
  { value: "all", label: "All" },
];

/**
 * `background={false}` drops the track surface, `gap` spaces the segments,
 * and a `{ type: "separator" }` option draws a hairline wherever a group
 * boundary belongs — as many as the row needs.
 */
export default function Separators() {
  const [value, setValue] = useState("waiting");
  return (
    <MultiToggle
      options={OPTIONS}
      value={value}
      onChange={setValue}
      background={false}
      gap={18}
      separatorPadding={10}
      tone="red"
      indicator="tonal"
    />
  );
}
