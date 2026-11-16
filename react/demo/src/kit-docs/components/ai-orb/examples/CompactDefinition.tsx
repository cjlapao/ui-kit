import { AiOrb } from "@cjlapao/ui-kit";

/** Automatic definition follows actual container width, including responsive shrinkage. */
export default function CompactDefinition() {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: 24, borderRadius: 16, background: "#161616", color: "#c6c6c6" }}>
    {([48, 64, 96, 128] as const).map(size => <div key={size} style={{ textAlign: "center" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center", minHeight: 128 }}>
        <AiOrb size={size} state="listening" label={`Listening at ${size} pixels`} />
        <AiOrb size={size} state="speaking" label={`Speaking at ${size} pixels`} />
      </div>
      <p style={{ fontSize: 12 }}>{size}px · listening / speaking</p>
    </div>)}
  </div>;
}
