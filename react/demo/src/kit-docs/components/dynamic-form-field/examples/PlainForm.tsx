import { useState } from "react";
import { DynamicFormField, Panel } from "@cjlapao/ui-kit";
import type { DynamicFormFieldValue } from "@cjlapao/ui-kit";
import { PARAMETERS } from "./sampleParameters";

/**
 * `variant="plain"` drops the per-field card, so a form reads as one surface
 * instead of a stack of boxes. Previously every field forced its own bordered
 * card with no way to turn it off.
 */
export default function PlainForm() {
  const [values, setValues] = useState<Record<string, DynamicFormFieldValue>>({});

  return (
    <Panel variant="outlined" padding="lg" title="Deploy settings">
      <div className="flex flex-col gap-4">
        {PARAMETERS.slice(0, 5).map((parameter) => (
          <DynamicFormField
            key={parameter.key}
            parameter={parameter}
            variant="plain"
            size="sm"
            value={values[parameter.key]}
            onChange={(_service, key, value) =>
              setValues((current) => ({ ...current, [key]: value }))
            }
          />
        ))}
      </div>
    </Panel>
  );
}
