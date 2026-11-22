import { InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * The row is a disclosure: the whole main line — icon, title, value,
 * chevron — is the trigger (click, Enter or Space), and the body unfolds
 * with the same grid-rows animation `CollapsiblePanel` uses. The body is
 * whatever the app puts in it; a collapsed one is `inert`, not `hidden`, so
 * the transition can play and the content never lands in the tab order.
 * The copy button and any other controls inside the value cluster keep
 * their own clicks — activating them never toggles the row.
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
        body={
          <p>
            The payload is verified with the signing secret before the run is
            queued.
          </p>
        }
      />
    </Panel>
  );
}
