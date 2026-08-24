import { Pill } from "@cjlapao/ui-kit";

const StatusBoard = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap items-center gap-2">
      <Pill tone="emerald" variant="soft">
        Operational
      </Pill>
      <Pill tone="amber" variant="soft" icon="Warning">
        Degraded
      </Pill>
      <Pill tone="rose" variant="soft" icon="Warning">
        Offline
      </Pill>
      <Pill tone="blue" variant="outline" icon="Cog">
        Maintenance
      </Pill>
      <Pill tone="slate" variant="solid" dot label="Standby" />
      <Pill tone="slate" variant="soft" size="sm">
        Standby
      </Pill>
    </div>
    <p className="text-xs opacity-70">
      A row of service states: filled, icon-led, outlined and a bare status
      dot. Each carries its own tone, so colour does the status work.
    </p>
  </div>
);

export default StatusBoard;
