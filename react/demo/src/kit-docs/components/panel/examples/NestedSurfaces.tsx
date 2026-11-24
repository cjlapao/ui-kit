import { Panel } from "@cjlapao/ui-kit";

export default function NestedSurfaces() {
  return (
    <div className="space-y-3">
      <Panel variant="simple" tone="neutral" title="Workspace activity">
        <Panel variant="simple" tone="neutral">Ada rotated the signing keys</Panel>
        <Panel variant="simple" tone="neutral">Sales Bot closed as won</Panel>
        <Panel variant="simple" tone="neutral" nestedSurface={false}>Unchanged surface</Panel>
      </Panel>
      {/* Not nested — and it still rests one step off the page. raisedSurface
        forces the ladder's first wash, which is what keeps a neutral card
        visible when its fill agrees with the background beneath it. */}
      <Panel variant="tonal" tone="neutral" raisedSurface>Raised on the page</Panel>
    </div>
  );
}
