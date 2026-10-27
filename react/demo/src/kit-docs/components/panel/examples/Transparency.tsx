import { Panel, SURFACE_TRANSPARENCIES } from "@cjlapao/ui-kit";

/** A contrasting backdrop makes background bleed-through easy to compare. */
export default function Transparency() {
  return <div className="grid gap-4 rounded-xl p-5 sm:grid-cols-2" style={{backgroundImage:"repeating-linear-gradient(135deg, #c7d2fe 0px, #c7d2fe 24px, #fbcfe8 24px, #fbcfe8 48px)"}}>
    {SURFACE_TRANSPARENCIES.map(transparency => <Panel key={transparency} variant="tonal" tone="blue" transparency={transparency} title={transparency} padding="sm">
      {transparency === "none" ? "Opaque tint. The backdrop stays behind the panel." : transparency === "high" ? "The original transparency, with no increase beyond it." : "A step between opaque and the original transparency."}
    </Panel>)}
  </div>;
}
