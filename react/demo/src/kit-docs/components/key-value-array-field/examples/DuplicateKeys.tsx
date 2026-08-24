import { useState } from "react";
import { KeyValueArrayField } from "@cjlapao/ui-kit";
import type { KeyValuePair } from "@cjlapao/ui-kit";

const INITIAL: KeyValuePair[] = [
  { key: "region", value: "eu-west-1" },
  { key: "REPLICAS", value: "3" },
  { key: "region", value: "us-east-1" },
];

export default function DuplicateKeys() {
  const [pairs, setPairs] = useState(INITIAL);

  return (
    <div className="w-full">
      <KeyValueArrayField
        label="Deployment config"
        value={pairs}
        onChange={setPairs}
        tone="amber"
        variant="tonal"
      />
      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        Two rows share the key <code>region</code> — both are flagged, because
        the second one would silently win when the map is serialised.
      </p>
    </div>
  );
}
