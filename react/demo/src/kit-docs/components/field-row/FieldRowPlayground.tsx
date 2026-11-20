import { useState } from "react";
import {
  Button,
  Combobox,
  FieldRow,
  FormField,
  Picker,
  type ControlSize,
  type PickerItem,
} from "@cjlapao/ui-kit";
import {
  ControlAccordion,
} from "../../shared/ControlAccordion";
import {
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { controlSizeOptions } from "../../shared/options";

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
const KINDS = ["function", "method", "type", "file"];

export const FieldRowPlayground: React.FC = () => {
  const [gap, setGap] = useState<ControlSize>("md");
  const [size, setSize] = useState<ControlSize>("md");
  const [richItems, setRichItems] = useState(true);
  const [symbol, setSymbol] = useState("aeon/cmd/aeon/action.go");
  const [kind, setKind] = useState("");

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "row",
                title: "Row",
                controls: (
                  <>
                    <SelectControl
                      label="Gap"
                      options={controlSizeOptions}
                      value={gap}
                      onChange={(v) => setGap(v as ControlSize)}
                    />
                    <SelectControl
                      label="Field size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <ToggleRow
                    label="Picker options have subtitles (2-line)"
                    checked={richItems}
                    onChange={setRichItems}
                  />
                ),
              },
            ]}
          />
        </div>
      }
      previewClassName="overflow-x-auto"
      preview={
        <FieldRow gap={gap} className="w-full">
          <FormField label="Symbol" className="w-64 max-w-full">
            <Picker
              items={
                richItems
                  ? SYMBOLS
                  : SYMBOLS.map((item) => ({ id: item.id, title: item.title, icon: item.icon }))
              }
              selectedId={symbol}
              onSelect={(item) => setSymbol(item.id)}
              placeholder="Search a symbol…"
              size={size}
              variant="ghost"
              tone="neutral"
            />
          </FormField>
          <FormField label="Kind" className="w-40 shrink-0">
            <Combobox
              options={KINDS}
              value={kind}
              onChange={setKind}
              placeholder="Any kind"
              size={size}
              variant="ghost"
              tone="neutral"
            />
          </FormField>
          <Button color="blue" size={size}>
            Explore
          </Button>
        </FieldRow>
      }
    />
  );
};

export default FieldRowPlayground;
