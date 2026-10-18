import { useState } from "react";
import { INPUT_VARIANTS, Combobox } from "@cjlapao/ui-kit";

/**
 * It renders `Input`, so the box is the kit's entry box: every entry variant,
 * every control size, the same focus ring and the same validation treatment as
 * the `Select` beside it. The previous version drew its own `border px-3 py-2
 * text-sm` and had no size prop at all.
 */
export default function Variants() {
  const [value, setValue] = useState("");
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {INPUT_VARIANTS.map((variant) => (
        <label key={variant} className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            {variant}
          </span>
          <Combobox
            options={["Alpha", "Beta", "Gamma"]}
            value={value}
            onChange={setValue}
            variant={variant}
            placeholder="Type to filter…"
          />
        </label>
      ))}
    </div>
  );
}
