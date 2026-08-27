import { StatCard } from "@cjlapao/ui-kit";

/**
 * The label and the value carry their own tone and their own type scale, both
 * falling back to the card's `size` when not set.
 *
 * They used to share one `valueTone`, so a card could not have a muted label
 * over a coloured figure — which is the common case.
 */
export default function Typography() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Inherited" value="1.42M" size="md" />
      <StatCard label="Bigger value" value="1.42M" valueSize="xl" labelSize="xs" />
      <StatCard label="Toned value" value="1.42M" valueTone="emerald" />
      <StatCard
        label="Both toned"
        value="1.42M"
        labelTone="sky"
        valueTone="violet"
      />
    </div>
  );
}
