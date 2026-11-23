import { Panel } from "@cjlapao/ui-kit";

/**
 * The same tonal card four times, with its hues pulled apart.
 *
 * By default a card speaks one hue: `tone` is the surface, the rim and wash
 * when it is selected, and the glow when it pulses. `activeTone` lets the
 * selected state dress itself, and `pulseTone` lets the attention call stay
 * urgent on a card whose brand is not. Both default into the card's own hue —
 * the glow's is the selection's — so an untuned card looks exactly as it always
 * did, and a card that is both selected and pulsing still says one thing.
 */
export default function Hues() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      <Panel
        variant="tonal"
        tone="blue"
        active
        title="Selected in its own hue"
        subtitle="activeTone unset — rim and wash follow tone"
      >
        The selection and the card agree, which is the default and usually the
        right answer.
      </Panel>
      <Panel
        variant="tonal"
        tone="blue"
        active
        activeTone="amber"
        title="Selected in amber"
        subtitle="activeTone dresses rim and wash together"
      >
        One decision, one colour: the outline never disagrees with the fill
        beneath it.
      </Panel>
      <Panel
        variant="tonal"
        tone="blue"
        pulse
        pulseTone="rose"
        title="Pulsing in rose"
        subtitle="pulseTone — urgency need not wear the brand"
      >
        The glow rides a custom property, so it brightens in the dark theme the
        way every other hue does.
      </Panel>
      <Panel
        variant="tonal"
        tone="cyan"
        active
        activeTone="emerald"
        pulse
        title="Both at once, in one hue"
        subtitle="pulseTone unset — the glow follows the selection"
      >
        Selected and demanding attention, and still one colour — until a caller
        asks otherwise.
      </Panel>
    </div>
  );
}
