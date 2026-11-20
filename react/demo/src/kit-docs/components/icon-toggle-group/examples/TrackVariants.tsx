import { useState } from "react";
import {
  IconToggleGroup,
  Panel,
  ICON_TOGGLE_GROUP_VARIANTS,
} from "@cjlapao/ui-kit";

const OPTIONS = [
  { value: "grid", icon: "ViewGrid", label: "Grid view" },
  { value: "rows", icon: "ViewRows", label: "Row view" },
];

/**
 * The **track** takes the Panel surface family — the same variants, so a
 * group reads identically beside a card at the same tone. Each column here
 * pairs the track with the `Panel` it is matching.
 *
 * There is no indicator to match: the selected option is an `IconButton`
 * wearing its own `active` state. And `none` is the one honest exception —
 * on a track it means *no track*, just the buttons, so its paired card
 * shows what nothing looks like.
 */
export default function TrackVariants() {
  const [value, setValue] = useState("rows");
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ICON_TOGGLE_GROUP_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wide opacity-50">
            {variant}
          </span>
          <Panel
            variant={variant}
            tone={variant === "none" ? "none" : "violet"}
            padding="sm"
            corner="rounded-lg"
          >
            <span className="text-xs">Panel</span>
          </Panel>
          <IconToggleGroup
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
  );
}
