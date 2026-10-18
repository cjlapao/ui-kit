import React, { useState } from "react";
import { NotificationModal, NOTIFICATION_TYPES, Button } from "@cjlapao/ui-kit";
import type { NotificationType, TrueColor } from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, Control, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { trueColorOptions } from "../../shared/options";

const typeOptions = NOTIFICATION_TYPES.map((value) => ({ label: value, value }));

export const NotificationModalPlayground: React.FC = () => {
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
