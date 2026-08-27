import { InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * The copy button is a real `IconButton`, so it carries the kit's focus ring
 * and hit area. It is revealed on hover *and* on keyboard focus — an
 * `opacity-0` button is still in the tab order, so a keyboard user used to land
 * on something invisible.
 *
 * A missing clipboard (any non-secure context) and a rejected write (the
 * document is not focused — very ordinary) both report a failure now instead
 * of throwing or leaving an unhandled rejection.
 */
export default function Copy() {
  return (
    <Panel variant="outlined" padding="sm" className="w-full">
      <InfoRow
        label="Digest"
        mono
        value="sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
        onCopy={(text) => console.log("copied", text.slice(0, 12))}
      />
      <InfoRow label="Endpoint" value="https://api.example.com/v1/capsules" mono />
      <InfoRow label="Verified" value={true} />
      <InfoRow label="Notes" value={<em>rendered node — no copy button</em>} />
    </Panel>
  );
}
