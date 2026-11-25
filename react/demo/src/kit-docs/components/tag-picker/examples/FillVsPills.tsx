import { TagPicker } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "prod", label: "prod" },
  { id: "gpu", label: "gpu" },
  { id: "spot", label: "spot" },
];

/**
 * Three hues, three owners — the composite where the distinction is easiest to
 * lose, because a TagPicker visibly contains two families of surface. `tone`
 * runs every affordance (focus border, ring, the caret); `inputFillTone` paints
 * the trigger's fill and nothing else; the pills the picker accumulates inside
 * that trigger answer `itemColor`, falling back to `tone` — never to the fill.
 * The lower field leaves `itemColor` unset to show that fallback: a rose trigger
 * with blue pills, not a rose one with rose pills. Open either one and the menu
 * stays neutral, because the menu is `panelTone`'s.
 */
export default function FillVsPills() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <TagPicker
        items={ITEMS}
        value={["prod", "gpu"]}
        onChange={() => {}}
        tone="blue"
        inputFillTone="rose"
        itemColor="amber"
        placeholder="Rose trigger, blue focus, amber pills"
      />
      <TagPicker
        items={ITEMS}
        value={["prod", "gpu"]}
        onChange={() => {}}
        tone="blue"
        inputFillTone="rose"
        placeholder="Same trigger; with no itemColor the pills follow tone"
      />
    </div>
  );
}
