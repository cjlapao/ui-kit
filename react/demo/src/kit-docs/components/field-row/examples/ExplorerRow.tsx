import { useState } from "react";
import {
  Button,
  Combobox,
  FieldRow,
  FormField,
  Picker,
  type PickerItem,
} from "@cjlapao/ui-kit";

const SYMBOLS: PickerItem[] = [
  {
    id: "aeon/cmd/aeon/action.go",
    title: "aeon/cmd/aeon/action.go",
    subtitle: "file · aeon/cmd/aeon/action.go:1",
    icon: "File",
  },
  {
    id: "Explore",
    title: "Explore",
    subtitle: "func · aeon/ui/src/features/settings/system/GraphExplorer.tsx:88",
    icon: "Search",
  },
];
const KINDS = ["function", "method", "type", "file"];

/**
 * The GraphExplorer toolbar from `aeon`, both ways.
 *
 * The first row is the old composition — a `flex items-end` of fixed-width
 * `FormField` wrappers. The picker's two-line trigger (title + subtitle)
 * grows that box and nothing else follows: the combobox and the button sit
 * on the baseline, smaller, top-heavy.
 *
 * The second row is the same controls inside a `FieldRow`. The tallest
 * control sets the control band, every other control fills it, and the
 * bare button lands at field height instead of shrinking to its label-less
 * content.
 */
export default function ExplorerRow() {
  const [symbol, setSymbol] = useState("aeon/cmd/aeon/action.go");
  const [kind, setKind] = useState("");

  const picker = (
    <Picker
      items={SYMBOLS}
      selectedId={symbol}
      onSelect={(item) => setSymbol(item.id)}
      placeholder="Search a symbol…"
      searchPlaceholder="Search a symbol…"
      variant="ghost"
      tone="neutral"
    />
  );
  const combobox = (
    <Combobox
      options={KINDS}
      value={kind}
      onChange={setKind}
      placeholder="Any kind"
      variant="ghost"
      tone="neutral"
    />
  );

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Plain <code>flex items-end</code> — the picker drives its own
          height and the row drifts around it.
        </p>
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
          <div className="w-80 max-w-full">
            <FormField label="Symbol">{picker}</FormField>
          </div>
          <div className="w-40 shrink-0">
            <FormField label="Kind">{combobox}</FormField>
          </div>
          <Button color="blue" disabled={symbol.trim() === ""}>
            Explore
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          The same children in a <code>FieldRow</code> — one shared control
          band, the button included.
        </p>
        <div className="rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
          <FieldRow gap="sm">
            <FormField label="Symbol" className="w-80 max-w-full">
              {picker}
            </FormField>
            <FormField label="Kind" className="w-40 shrink-0">
              {combobox}
            </FormField>
            <Button color="blue" disabled={symbol.trim() === ""}>
              Explore
            </Button>
          </FieldRow>
        </div>
      </div>
    </div>
  );
}
