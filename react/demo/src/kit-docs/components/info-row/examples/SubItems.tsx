import { InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * A verdict row: the check icon carries the tone's colour, the title says
 * what passed, and the policy that granted it hangs below as a sub-item —
 * muted lead-in, monospaced detail, indented to the title's edge. These
 * rows have no main value at all, and a row with sub-items is never hidden
 * by `hideIfEmpty`, so they survive on their content alone (`emptyText=""`
 * keeps the placeholder off the right edge).
 */
const CHECKS = [
  { label: "Workspace access", policy: "trigger_access.all-agents.sdsd.allow" },
  { label: "Secrets read", policy: "vault.read.workspace-scope.allow" },
  { label: "Outbound webhook", policy: "network.egress.allowlist.allow" },
  { label: "Tool invocation", policy: "tools.shell.deny-list.deny" },
  { label: "Audit trail", policy: "audit.append-only.workspace.allow" },
];

export default function SubItems() {
  return (
    <Panel variant="outlined" padding="sm" scrollable={false}>
      {CHECKS.map((row) => (
        <InfoRow
          key={row.label}
          variant="plain"
          icon="Check"
          tone="emerald"
          label={row.label}
          emptyText=""
          subItems={[{ text: "Policy:", value: row.policy, mono: true }]}
        />
      ))}
    </Panel>
  );
}
