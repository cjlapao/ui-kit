import { SurfaceToneControl } from "../../shared/SurfaceToneControl";
import type { SurfaceTone, SurfaceVariant } from "@cjlapao/ui-kit";
import React, { useState } from "react";
import { NotificationModal, NOTIFICATION_TYPES, Button } from "@cjlapao/ui-kit";
import type { NotificationType, TrueColor } from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, Control, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { trueColorOptions, surfaceVariantOptions } from "../../shared/options";

const typeOptions = NOTIFICATION_TYPES.map((value) => ({ label: value, value }));

export const NotificationModalPlayground: React.FC = () => {
  const [surfaceVariant, setSurfaceVariant] = useState<SurfaceVariant>("elevated");
  const [surfaceTone, setSurfaceTone] = useState<SurfaceTone>("none");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<NotificationType>("info");
  const [tone, setTone] = useState<TrueColor | "">("");
  const [withSecondary, setWithSecondary] = useState(false);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "options",
                title: "Options",
                controls: (
                  <>
                    <SurfaceToneControl label="Surface tone" value={surfaceTone} onChange={setSurfaceTone} />
                    <SelectControl label="Surface variant" options={surfaceVariantOptions} value={surfaceVariant} onChange={value => setSurfaceVariant(value as SurfaceVariant)} />
                    <SelectControl label="Type" options={typeOptions} value={type}
                      onChange={(v) => setType(v as NotificationType)} />
                    <SelectControl label="Tone override"
                      options={[{ label: "(from type)", value: "" }, ...trueColorOptions]}
                      value={tone} onChange={(v) => setTone(v as TrueColor | "")} />
                    <Control label="Actions">
                      <ToggleRow label="Secondary action" checked={withSecondary} onChange={setWithSecondary} />
                    </Control>
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            <code>error</code> and <code>warning</code> now use different
            glyphs — both mapped to <code>Warning</code>, so a failure and a
            caution were indistinguishable. The message takes its colour from
            the surface; it was a bare <code>text-gray-600</code> with no
            dark-mode partner.
          </p>
        </div>
      }
      preview={
        <>
          <Button onClick={() => setOpen(true)}>Open notification</Button>
          <NotificationModal
            surfaceTone={surfaceTone}
            variant={surfaceVariant}
            isOpen={open}
            onClose={() => setOpen(false)}
            type={type}
            tone={tone || undefined}
            title="Deployment finished"
            message="All three capsules are running in eu-west-1."
            secondaryActionLabel={withSecondary ? "View logs" : undefined}
          />
        </>
      }
    />
  );
};
