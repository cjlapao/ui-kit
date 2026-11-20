import {
  Combobox,
  FormField,
  Input,
  Picker,
  type PickerItem,
} from "@cjlapao/ui-kit";

const ITEMS: PickerItem[] = [
  { id: "a", title: "aeon/cmd/aeon/action.go", subtitle: "file · action.go:1" },
];

/**
 * Without a `FieldRow` there is no shared band to join, so the controls
 * reserve their two-line height themselves: `lines={2}` floors each box at
 * the size's two-line height — the same token the row uses — while the
 * picker auto-detects it from its subtitle items.
 */
export default function EscapeHatch() {
  return (
    <div className="flex w-full flex-wrap items-end gap-3 rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
      <div className="w-72 max-w-full">
        <FormField label="Symbol">
          <Picker items={ITEMS} variant="ghost" tone="neutral" />
        </FormField>
      </div>
      <div className="w-44">
        <FormField label="Kind">
          <Combobox
            options={["function", "file", "type"]}
            value=""
            onChange={() => undefined}
            placeholder="Any kind"
            variant="ghost"
            tone="neutral"
            lines={2}
          />
        </FormField>
      </div>
      <div className="w-44">
        <FormField label="Filter">
          <Input placeholder="name…" variant="ghost" lines={2} />
        </FormField>
      </div>
    </div>
  );
}
