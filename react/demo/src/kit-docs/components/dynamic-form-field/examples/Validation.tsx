import { DynamicFormField } from "@cjlapao/ui-kit";
import { CapsuleBlueprintValueType } from "@cjlapao/ui-kit";

/**
 * The label, the required marker, the hint and the error all come from
 * `FormField`. They were hand-rolled per branch before — three times,
 * inconsistently — and the boolean branch had no error rendering at all, so a
 * failed checkbox validated silently.
 */
export default function Validation() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      <DynamicFormField
        parameter={{
          name: "Service name",
          key: "name",
          value_type: CapsuleBlueprintValueType.String,
          is_required: true,
        }}
        value=""
        onChange={() => {}}
        error="A service name is required."
      />
      <DynamicFormField
        parameter={{
          name: "Accept the terms",
          key: "terms",
          value_type: CapsuleBlueprintValueType.Boolean,
          hint: "Required before the first deploy.",
        }}
        value={false}
        onChange={() => {}}
        error="You must accept the terms."
      />
    </div>
  );
}
