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
    subtitle: "func · GraphExplorer.tsx:88",
    icon: "Search",
  },
];

/**
 * Where a Picker actually lives: a toolbar, beside fields of its own
 * height. Its two-line trigger (title + subtitle) sets the control band of
 * the `FieldRow`, and the combobox and the button fill it — no `lines`,
 * no `h-full`, no manual alignment.
 */
export default function InRow() {
  const [symbol, setSymbol] = useState("aeon/cmd/aeon/action.go");
  const [kind, setKind] = useState("");

  return (
    <div className="w-full rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
      <FieldRow gap="sm">
        <FormField label="Symbol" className="w-80 max-w-full">
          <Picker
            items={SYMBOLS}
            selectedId={symbol}
            onSelect={(item) => setSymbol(item.id)}
            placeholder="Search a symbol…"
            variant="ghost"
            tone="neutral"
          />
        </FormField>
        <FormField label="Kind" className="w-40 shrink-0">
          <Combobox
            options={["function", "method", "type", "file"]}
            value={kind}
            onChange={setKind}
            placeholder="Any kind"
            variant="ghost"
            tone="neutral"
          />
        </FormField>
        <Button color="blue" disabled={symbol.trim() === ""}>
          Explore
        </Button>
      </FieldRow>
    </div>
  );
}
