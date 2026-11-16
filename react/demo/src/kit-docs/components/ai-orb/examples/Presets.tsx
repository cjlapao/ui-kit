import { AiOrb } from "@cjlapao/ui-kit";

export default function Presets() {
  return <>{(["solar", "ion", "ember"] as const).map(preset => (
    <div key={preset} style={{ background: "#0a1019", borderRadius: 16, textAlign: "center", paddingBottom: 16, color: "#b4c0cd" }}>
      <AiOrb preset={preset} state="speaking" size={220} label={`${preset} assistant`} />
      <p>{preset}</p>
    </div>
  ))}</>;
}
