import { InfoRow } from "@cjlapao/ui-kit";

/**
 * `bottomBorder` turns each row into a section edge — the rules of a simple
 * key/value table, honoured by the `simple` and `none` variants only (the
 * surfaced variants already draw a frame, and `plain` keeps its
 * sibling-matched hairline so the last row stays bare). Each rule is
 * full-width, including under the sub-items; the table ends where the
 * caller stops opting in.
 */
export default function BottomBorder() {
  return (
    <div className="flex w-full max-w-md flex-col">
      <InfoRow
        variant="none"
        label="Trigger"
        value="webhook"
        icon="Link"
        bottomBorder
        body={
          <p>
            Verified against the signing secret; the run is queued only for
            pushes to the default branch.
          </p>
        }
      />
      <InfoRow variant="none" label="Method" value="POST" bottomBorder />
      <InfoRow
        variant="none"
        label="Endpoint"
        value="/api/hooks/deploy"
        mono
        bottomBorder
      />
      <InfoRow
        variant="none"
        label="Token"
        value="sk_live_9f2c81ab44de0c73a41d"
        mono
        icon="Key"
        bottomBorder
      />
    </div>
  );
}
