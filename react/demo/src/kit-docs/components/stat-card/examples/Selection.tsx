import { StatCard } from "@cjlapao/ui-kit";

/**
 * The card's state, drawn by the surface underneath it.
 *
 * `active` ignites the selection rim and wash; `pulse` breathes a glow inward
 * from the rim — the same props `Panel` answers, forwarded untouched, so every
 * Stat tile in the family takes them the same way. `activeTone` and `pulseTone`
 * let those two states wear hues the card itself does not: an urgent rose on a
 * blue card is a different message from a blue card.
 *
 * The pointer card is the one to try. `activeTone` is not only the colour of the
 * rim and wash once the card is chosen — while it *is* chosen the hover wears
 * that hue too, so the pointer never contradicts the state. The follow belongs to
 * the state, not to the hue: an unchosen card keeps hovering in its own tone.
 * `hoverable` is what lets a card answer the pointer without being clickable, and
 * `hoverColor` pins a card's hover back to its brand hue when the selection has
 * gone somewhere else.
 *
 * The last card is the honest caveat. A `gradient` card paints its own
 * background, which outranks the active wash the way `backgroundColor` does —
 * so on the wash the selection arrives as rim and glow only. That is the right
 * hierarchy: the gradient is the card's identity, the rim is its state.
 */
export default function Selection() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label="Quota used"
        value="62%"
        icon="Database"
        tone="cyan"
        subtitle="across 3 regions"
      />
      <StatCard
        label="Selected"
        value="us-east-1"
        icon="Globe"
        tone="cyan"
        active
        subtitle="the filter in play"
      />
      <StatCard
        label="Selected in its own hue"
        value="amber"
        icon="Filter"
        tone="cyan"
        active
        activeTone="amber"
        subtitle="rim and wash move together"
      />
      <StatCard
        label="Demanding attention"
        value="7"
        icon="AlertTriangle"
        tone="cyan"
        pulse
        pulseTone="rose"
        subtitle="urgent without repainting"
      />
      <StatCard
        label="Put a pointer on this one"
        value="violet"
        icon="Clock"
        tone="cyan"
        hoverable
        active
        activeTone="violet"
        subtitle="the hover wears the chosen hue"
      />
      <StatCard
        label="On the gradient wash"
        value="99.98%"
        icon="Activity"
        tone="cyan"
        gradient
        active
        pulse
        subtitle="rim and glow only"
      />
    </div>
  );
}
