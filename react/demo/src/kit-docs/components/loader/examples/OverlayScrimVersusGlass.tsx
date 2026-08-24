import { Loader, Panel } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const OverlayHost = ({ children }: { children: ReactNode }) => (
  <div className="relative h-44 overflow-hidden">
    <Panel variant="outlined" padding="sm">
      <div className="space-y-2 text-sm opacity-80">
        <p>Quarterly revenue, by region</p>
        <p className="opacity-70">
          The overlay fills this card — blur and scrim included — while the
          content behind stays in place.
        </p>
      </div>
    </Panel>
    {children}
  </div>
);

const OverlayScrimVersusGlass = () => (
  <div className="grid w-full gap-6 md:grid-cols-2">
    <OverlayHost>
      <Loader overlay title="Working…" size="md" />
    </OverlayHost>
    <OverlayHost>
      <Loader overlay title="Working…" size="md" glass />
    </OverlayHost>
  </div>
);

export default OverlayScrimVersusGlass;
