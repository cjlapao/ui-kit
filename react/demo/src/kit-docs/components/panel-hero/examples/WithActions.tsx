import React from "react";
import { Button, PanelHero } from "@cjlapao/ui-kit";

const WithActions: React.FC = () => (
  <PanelHero
    title="Index 7 of 42 failed"
    subtitle="runner-3 exited with code 1 after 8m 12s"
    icon="Warning"
    tone="rose"
    titleAs="h2"
  >
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        View logs
      </Button>
      <Button variant="soft" size="sm">
        Re-run job
      </Button>
    </div>
  </PanelHero>
);

export default WithActions;
