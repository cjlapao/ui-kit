import { InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * A row that is still loading, or that failed, has something to say even with
 * no value — so `hideIfEmpty` no longer wins over either. An error is
 * announced politely rather than left as an "—" indistinguishable from a value
 * that is genuinely empty.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Panel variant="outlined" padding="sm">
        <InfoRow label="Digest" loading loaderType="skeleton" />
        <InfoRow label="Region" loading loaderType="spinner" />
        <InfoRow label="Replicas" value={3} />
      </Panel>
      <Panel variant="outlined" padding="sm">
        <InfoRow label="Digest" error="Registry unreachable" />
        <InfoRow label="Region" value="" hideIfEmpty={false} />
        <InfoRow label="Replicas" value={3} />
      </Panel>
    </div>
  );
}
