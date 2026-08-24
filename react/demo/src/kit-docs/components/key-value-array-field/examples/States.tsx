import { useState } from "react";
import { KeyValueArrayField } from "@cjlapao/ui-kit";
import type { KeyValuePair } from "@cjlapao/ui-kit";

export default function States() {
  const [emptyPairs, setEmptyPairs] = useState<KeyValuePair[]>([]);
  const [cappedPairs, setCappedPairs] = useState([
    { key: "A", value: "1" },
    { key: "B", value: "2" },
    { key: "C", value: "3" },
  ]);

  return (
    <div className="grid w-full gap-4 xl:grid-cols-2">
      <div className="flex flex-col gap-2">
        <KeyValueArrayField
          label="Headers"
          value={emptyPairs}
          onChange={setEmptyPairs}
          emptyState="No custom headers yet."
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Empty — the dashed placeholder, with a custom message.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <KeyValueArrayField
          label="Limits"
          value={cappedPairs}
          onChange={setCappedPairs}
          maxRows={3}
          error="At least one entry is required."
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Capped at three rows — the add button disables at the limit — with a
          field-level error.
        </p>
      </div>
    </div>
  );
}
