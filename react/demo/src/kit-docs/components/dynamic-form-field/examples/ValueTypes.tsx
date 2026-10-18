import { useState } from "react";
import { DynamicFormField } from "@cjlapao/ui-kit";
import type { DynamicFormFieldValue } from "@cjlapao/ui-kit";
import { PARAMETERS } from "./sampleParameters";

/**
 * One parameter of every value type a blueprint can declare — including `List`
 * and `Map`, which used to fall through to nothing and render an empty
 * bordered card.
 */
export default function ValueTypes() {
  const [values, setValues] = useState<Record<string, DynamicFormFieldValue>>({
    replicas: 2,
    region: "eu-west-1",
  });

  return (
    <div className="grid w-full gap-3 lg:grid-cols-2">
      {PARAMETERS.map((parameter) => (
        <DynamicFormField
          key={parameter.key}
          parameter={parameter}
          value={values[parameter.key]}
          onChange={(_service, key, value) =>
            setValues((current) => ({ ...current, [key]: value }))
          }
        />
      ))}
    </div>
  );
}
