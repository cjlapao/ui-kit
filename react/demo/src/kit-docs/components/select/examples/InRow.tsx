import { useState } from "react";
import {
  Button,
  FieldRow,
  FormField,
  Picker,
  Select,
  type PickerItem,
} from "@cjlapao/ui-kit";

const ITEMS: PickerItem[] = [
  {
    id: "aeon/cmd/aeon/action.go",
    title: "aeon/cmd/aeon/action.go",
    subtitle: "file · aeon/cmd/aeon/action.go:1",
    icon: "File",
  },
];

/**
 * A native `Select` in the same row as a two-line `Picker`: the select
 * grows to the control band and its text and caret ride the vertical
 * centre. No `lines` prop needed inside a row — the band is the contract.
 */
export default function InRow() {
  const [symbol, setSymbol] = useState("aeon/cmd/aeon/action.go");
  const [kind, setKind] = useState("");

  return (
    <div className="w-full rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
      <FieldRow gap="sm">
        <FormField label="Symbol" className="w-80 max-w-full">
          <Picker
            items={ITEMS}
            selectedId={symbol}
            onSelect={(item) => setSymbol(item.id)}
            variant="ghost"
            tone="neutral"
          />
        </FormField>
        <FormField label="Kind" className="w-40 shrink-0">
          <Select
            value={kind}
            onChange={(event) => setKind(event.target.value)}
            placeholder="Any kind"
            variant="ghost"
            tone="neutral"
          >
            <option value="function">function</option>
            <option value="method">method</option>
            <option value="file">file</option>
          </Select>
        </FormField>
        <Button color="blue">Explore</Button>
      </FieldRow>
    </div>
  );
}
