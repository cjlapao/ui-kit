import { useState } from "react";
import { KeyValueArrayField } from "@cjlapao/ui-kit";
import type { KeyValuePair } from "@cjlapao/ui-kit";

const INITIAL: KeyValuePair[] = [
  { key: "ENV", value: "production" },
  { key: "DEBUG", value: "false" },
  { key: "host", value: "localhost" },
  { key: "port", value: "27017" },
];

export default function EnvironmentVariables() {
  const [pairs, setPairs] = useState(INITIAL);

  return (
    <div className="w-full">
      <KeyValueArrayField
        label="Metadata"
        hint="Store extra settings via key/value pairs"
        help="Use this field to supply extra environment variables or service metadata. Keys must be unique — a duplicate silently overwrites the earlier value once the map is serialised."
        value={pairs}
        onChange={setPairs}
        tone="blue"
        variant="outlined"
      />
    </div>
  );
}
