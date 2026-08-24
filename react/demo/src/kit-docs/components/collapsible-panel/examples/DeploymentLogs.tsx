import { Button, CollapsiblePanel } from "@cjlapao/ui-kit";

const LOG_LINES = Array.from(
  { length: 14 },
  (_, index) =>
    `[12:0${index % 10}:31] step ${index + 1} — pulling layer sha256:${(
      index * 7919
    )
      .toString(16)
      .padStart(6, "0")}`,
);

export default function DeploymentLogs() {
  return (
    <div className="w-full">
      <CollapsiblePanel
        title="Deployment logs"
        subtitle="Last updated 5 minutes ago"
        defaultExpanded
        actions={
          <Button size="xs" variant="ghost" color="neutral">
            Copy logs
          </Button>
        }
      >
        <pre className="whitespace-pre-wrap font-mono text-xs">
          {LOG_LINES.join("\n")}
        </pre>
      </CollapsiblePanel>
    </div>
  );
}
