import { Panel } from "@cjlapao/ui-kit";

/**
 * The same tonal card five times, with its hues pulled apart.
 *
 * By default a card speaks one hue: `tone` is the surface, the rim and wash
 * when it is selected, and the glow when it pulses. `activeTone` lets the
 * selected state dress itself, and `pulseTone` lets the attention call stay
 * urgent on a card whose brand is not. Both default into the card's own hue —
 * the glow's is the selection's — so an untuned card looks exactly as it always
 * did, and a card that is both selected and pulsing still says one thing.
 *
 * The fifth card is the one to put a pointer on. `activeTone` is not only the
 * colour of the rim and the wash once a card is chosen: while it *is* chosen the
 * hover wears that hue too, so the pointer never contradicts the state. The
 * follow is the state's, not the hue's — and that gate is the whole point in a
 * group, where every card is handed the same `activeTone` and a grid of unchosen
 * cards hovering in a state they do not have would be the same mistake wearing a
 * costume. `hoverColor` is the way back for a card that should keep hovering in
 * its brand hue.
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
      <Panel
        variant="tonal"
        tone="cyan"
        active
        activeTone="violet"
        onClick={() => {}}
        title="Put a pointer on this one"
        subtitle="it is chosen, so its hover arrives violet — not cyan"
      >
        The card is selected, so its hover wears the hue its rim already wears and
        nothing under the pointer contradicts the state. Unchosen cards keep
        hovering in their own tone even with the same `activeTone` set. Pass
        `hoverColor` to pin a card's hover back to its brand hue while the
        selection stays elsewhere.
      </Panel>
    </div>
  );
}
