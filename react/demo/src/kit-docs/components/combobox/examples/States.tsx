import { useState } from "react";
import { VALIDATION_STATUSES, Combobox } from "@cjlapao/ui-kit";

/**
 * `validationStatus` is the kit's one field-status scale — it used to be
 * declared six separate times across the form controls, so the day one changed
 * the other five would not have. `loading`, `disabled` and `readOnly` complete
 * the set.
 */
export default function States() {
  const [value, setValue] = useState("");
  const options = ["Alpha", "Beta", "Gamma"];

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {VALIDATION_STATUSES.map((validationStatus) => (
        <label key={validationStatus} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            {validationStatus}
          </span>
          <Combobox
            options={options}
            value={value}
            onChange={setValue}
            validationStatus={validationStatus}
            placeholder="Type to filter…"
          />
        </label>
      ))}
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
          loading
        </span>
        <Combobox options={[]} value="" onChange={() => {}} loading />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
          disabled
        </span>
        <Combobox options={options} value="Alpha" onChange={() => {}} disabled />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
          read-only
        </span>
        <Combobox options={options} value="Beta" onChange={() => {}} readOnly />
      </label>
    </div>
  );
}
