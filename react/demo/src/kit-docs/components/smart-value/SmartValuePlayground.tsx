import React, { useState } from "react";
import { SmartValue } from "@cjlapao/ui-kit";
import type { SmartVariableGroup, TrueColor } from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, Control, ToggleRow } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { trueColorOptions } from "../../shared/options";

const GROUPS: SmartVariableGroup[] = [
  {
    id: "app",
    label: "Environment",
    tone: "violet",
    variables: [
      { key: "REGION", value: "eu-west-1" },
      { key: "EMPTY", value: "" },
      { key: "SECRET", value: "s3cr3t", secret: true },
    ],
  },
];

const modeOptions = ["token", "value"].map((v) => ({ label: v, value: v }));

export const SmartValuePlayground: React.FC = () => {
  const [tone, setTone] = useState<TrueColor>("blue");
  const [mode, setMode] = useState<"token" | "value">("token");
  const [flagMissing, setFlagMissing] = useState(true);
  const [alwaysShow, setAlwaysShow] = useState(true);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <SelectControl label="Tone" options={trueColorOptions} value={tone}
                      onChange={(v) => setTone(v as TrueColor)} />
                    <SelectControl label="Opens in" options={modeOptions} value={mode}
                      onChange={(v) => setMode(v as "token" | "value")} />
                  </>
                ),
              },
              {
                id: "behaviour",
                title: "Behaviour",
                controls: (
                  <Control label="Behaviour">
                    <div className="space-y-1.5">
                      <ToggleRow label="Flag unresolvable" checked={flagMissing} onChange={setFlagMissing} />
                      <ToggleRow label="Always show toggle" checked={alwaysShow} onChange={setAlwaysShow} />
                    </div>
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Press the eye to switch between the token and what it resolves to.
            Note the three outcomes: a resolved value, a declared-but-{" "}
            <strong>empty</strong> one, and a token that does not exist at all
            — they render distinctly, where they used to look identical. A
            secret is masked rather than printed.
          </p>
        </div>
      }
      preview={
        <div className="max-w-lg text-sm">
          <SmartValue
            key={mode}
            value="region {{env::app::REGION}}, empty {{env::app::EMPTY}}, secret {{var::app::SECRET}}, unknown {{env::app::NOPE}}"
            groups={GROUPS}
            defaultViewMode={mode}
            flagMissing={flagMissing}
            alwaysShowToggle={alwaysShow}
            tone={tone}
          />
        </div>
      }
    />
  );
};
