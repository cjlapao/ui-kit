import { Input } from "@cjlapao/ui-kit";

export default function FillVsTone() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {/*
        The pairing the prop exists for: `tone="blue"` stays in charge of
        every state colour — focus border, ring, icon highlight, the glow, and
        `ghost`'s hover rim — while `backgroundColor="rose"` moves only the
        fill, so all four fields rest in rose and still focus blue. Shown in
        four variants because the fill follows each variant's own recipe in the
        new hue — the pale wash of `flat`, the sheer blur of `glass`, the
        wash-and-rim ladder of `ghost`, the translucent fill under the
        `gradient`'s glow — not one fixed tone step. Hover the ghost field:
        its wash deepens in rose and its edge comes up in blue, because the rim
        is an affordance and the affordances belong to `tone`. `underline`
        paints no box, so there the prop does nothing; `neutral` restores the
        variant's own resting fill.
      */}
      <Input
        variant="flat"
        tone="blue"
        backgroundColor="rose"
        placeholder="Flat — rose fill, blue focus"
      />
      <Input
        variant="glass"
        tone="blue"
        backgroundColor="rose"
        placeholder="Glass — sheer rose, blue focus"
      />
      <Input
        variant="ghost"
        tone="blue"
        backgroundColor="rose"
        placeholder="Ghost — rose wash, blue hover rim"
      />
      <Input
        variant="gradient"
        tone="blue"
        backgroundColor="rose"
        placeholder="Gradient — rose fill, blue glow"
      />
    </div>
  );
}
