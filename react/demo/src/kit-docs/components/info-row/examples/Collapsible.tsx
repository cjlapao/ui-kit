import { InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * The row is a disclosure: the whole control — main line, sub-items and all —
 * is the trigger (click, Enter or Space), and the body unfolds with the same
 * grid-rows animation `CollapsiblePanel` uses. The body is whatever the app
 * puts in it; a collapsed one is `inert`, not `hidden`, so the transition can
 * play and the content never lands in the tab order. The copy button and the
 * open body keep their own clicks, and any link or input in the row activates
 * itself — none of them fold the row shut.
 */
export default function Collapsible() {
  return (
    <Panel variant="outlined" padding="sm" scrollable={false}>
      <InfoRow
        variant="plain"
        icon="Info"
        label="Blueprint, secret, workspace and scope are ready"
        defaultExpanded
        body={
          <ul className="list-disc space-y-1 pl-5">
            <li>Blueprint pinned to revision 41</li>
            <li>Secret resolved from the workspace vault</li>
            <li>Scope limited to the triggering repository</li>
          </ul>
        }
      />
      <InfoRow
        variant="plain"
        icon="Link"
        label="Trigger: webhook"
        value="POST /hooks/deploy"
        mono
        subItems={[
          { text: "Delivers to", value: "Deploy queue" },
          { text: "Verified with", value: "signing secret", mono: true },
        ]}
        body={
          <p>
            The payload is verified with the signing secret before the run is
            queued. Clicking anywhere on this row — the title, the value or
            either sub-item line — opens it.
          </p>
        }
      />
    </Panel>
  );
}
