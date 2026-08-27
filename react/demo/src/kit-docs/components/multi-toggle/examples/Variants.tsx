import { useState } from "react";
import {
  MultiToggle,
  Panel,
  MULTI_TOGGLE_VARIANTS,
  MULTI_TOGGLE_INDICATORS,
} from "@cjlapao/ui-kit";

const OPTIONS = [
  { value: "a", label: "Day" },
  { value: "b", label: "Week" },
];

/**
 * The **track** takes the Panel surface family — the same eight variants, so a
 * toggle reads identically beside a card at the same tone. Each row here pairs
 * the toggle with the `Panel` it is matching.
 *
 * The **indicator** is a separate scale. It is what the old `variant` union
 * (`theme | solid | soft`) was actually describing: how the *active segment*
 * is drawn, which has nothing to do with the surface underneath it.
 */
export default function Variants() {
  const [value, setValue] = useState("b");
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MULTI_TOGGLE_VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wide opacity-50">
              {variant}
            </span>
            <Panel variant={variant} tone="violet" padding="sm" corner="rounded-lg">
              <span className="text-xs">Panel</span>
            </Panel>
            <MultiToggle
              options={OPTIONS}
              value={value}
              onChange={setValue}
              variant={variant}
              tone="violet"
              size="sm"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-6">
        {MULTI_TOGGLE_INDICATORS.map((indicator) => (
          <div key={indicator} className="flex flex-col items-center gap-1">
            <MultiToggle
              options={OPTIONS}
              value={value}
              onChange={setValue}
              indicator={indicator}
              tone="violet"
            />
            <span className="text-[10px] uppercase tracking-wide opacity-50">
              indicator: {indicator}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
