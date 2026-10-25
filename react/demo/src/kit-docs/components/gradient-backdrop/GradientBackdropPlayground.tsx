import React, { useMemo, useState } from "react";
import {
  GRADIENT_BACKDROP_TEMPLATES,
  GradientBackdrop,
  Panel,
  resolveGradientBackdropTheme,
  type GradientBackdropColors,
  type GradientBackdropRole,
  type GradientBackdropScheme,
  type GradientBackdropTemplateId,
  type GradientBackdropTheme,
} from "@cjlapao/ui-kit";
import { ChoiceControl, Control, PlaygroundPanel, SelectControl } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { gradientBackdropSchemeOptions, gradientBackdropTemplateOptions } from "../../shared/options";

const ROLES: GradientBackdropRole[] = ["glow", "from", "via", "to"];
const ROLE_LABELS: Record<GradientBackdropRole, string> = {
  glow: "Glow",
  from: "From",
  via: "Via",
  to: "To",
};
const SIDE_OPTIONS = [
  { label: "Light only", value: "light" },
  { label: "Dark only", value: "dark" },
  { label: "Both", value: "both" },
];

const ColorRow: React.FC<{
  role: GradientBackdropRole;
  value: string;
  onChange: (hex: string) => void;
}> = ({ role, value, onChange }) => (
  <label className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 w-9 cursor-pointer rounded border border-neutral-200 bg-transparent dark:border-neutral-700"
    />
    <span className="w-10">{ROLE_LABELS[role]}</span>
    <code className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">{value}</code>
  </label>
);

/** The colours a scheme ended up with — given, or derived (marked). */
const Swatches: React.FC<{ title: string; colors: GradientBackdropColors; derived: boolean }> = ({
  title,
  colors,
  derived,
}) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
      {title} {derived && <span className="normal-case tracking-normal text-sky-600 dark:text-sky-400">· derived</span>}
    </span>
    <div className="flex gap-1.5">
      {ROLES.map((r) => (
        <span key={r} className="flex flex-col items-center gap-0.5">
          <span className="h-6 w-6 rounded border border-black/10 dark:border-white/10" style={{ background: colors[r] }} />
          <code className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">{colors[r]}</code>
        </span>
      ))}
    </div>
  </div>
);

export const GradientBackdropPlayground: React.FC = () => {
  const [source, setSource] = useState<"template" | "custom">("template");
  const [templateId, setTemplateId] = useState<GradientBackdropTemplateId>("mist");
  const [scheme, setScheme] = useState<GradientBackdropScheme>("auto");
  const [sides, setSides] = useState<"light" | "dark" | "both">("light");
  const [light, setLight] = useState<GradientBackdropColors>({
    glow: "#fde68a",
    from: "#fffbeb",
    via: "#fef3c7",
    to: "#fcd34d",
  });
  const [dark, setDark] = useState<GradientBackdropColors>(GRADIENT_BACKDROP_TEMPLATES.dune.dark);

  const theme: GradientBackdropTemplateId | GradientBackdropTheme =
    source === "template"
      ? templateId
      : {
          light: sides === "dark" ? undefined : light,
          dark: sides === "light" ? undefined : dark,
        };
  const resolved = useMemo(() => resolveGradientBackdropTheme(theme), [JSON.stringify(theme)]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PlaygroundPanel
      hideBackgroundToggle
      controls={
        <ControlAccordion
          groups={[
            {
              id: "theme",
              title: "Theme",
              controls: (
                <>
                  <ChoiceControl
                    label="Source"
                    options={[
                      { label: "Template", value: "template" },
                      { label: "Custom", value: "custom" },
                    ]}
                    value={source}
                    onChange={(v) => setSource(v as "template" | "custom")}
                  />
                  {source === "template" ? (
                    <SelectControl
                      label="Template"
                      options={gradientBackdropTemplateOptions}
                      value={templateId}
                      onChange={(v) => setTemplateId(v as GradientBackdropTemplateId)}
                    />
                  ) : (
                    <>
                      <ChoiceControl
                        label="Colours given"
                        options={SIDE_OPTIONS}
                        value={sides}
                        onChange={(v) => setSides(v as "light" | "dark" | "both")}
                      />
                      {sides !== "dark" && (
                        <Control label="Light">
                          <div className="space-y-1">
                            {ROLES.map((r) => (
                              <ColorRow key={r} role={r} value={light[r]} onChange={(hex) => setLight({ ...light, [r]: hex })} />
                            ))}
                          </div>
                        </Control>
                      )}
                      {sides !== "light" && (
                        <Control label="Dark">
                          <div className="space-y-1">
                            {ROLES.map((r) => (
                              <ColorRow key={r} role={r} value={dark[r]} onChange={(hex) => setDark({ ...dark, [r]: hex })} />
                            ))}
                          </div>
                        </Control>
                      )}
                    </>
                  )}
                </>
              ),
            },
            {
              id: "scheme",
              title: "Scheme",
              controls: (
                <ChoiceControl
                  label="Scheme"
                  options={gradientBackdropSchemeOptions}
                  value={scheme}
                  onChange={(v) => setScheme(v as GradientBackdropScheme)}
                />
              ),
            },
          ]}
        />
      }
      preview={
        <div className="flex w-full flex-col gap-4">
          <GradientBackdrop theme={theme} scheme={scheme} className="flex min-h-64 items-center justify-center rounded-xl p-8">
            <Panel variant="glass" title="Glass over the backdrop" subtitle="The theme follows the page's light / dark mode">
              <p className="text-sm">Switch the docs theme in the header — the backdrop swaps with no JavaScript.</p>
            </Panel>
          </GradientBackdrop>
          <div className="grid grid-cols-2 gap-3">
            <GradientBackdrop theme={theme} scheme="light" className="h-24 rounded-lg" aria-label="Light scheme" />
            <GradientBackdrop theme={theme} scheme="dark" className="h-24 rounded-lg" aria-label="Dark scheme" />
          </div>
          <div className="flex flex-wrap gap-6">
            <Swatches title="Light" colors={resolved.light} derived={source === "custom" && sides === "dark"} />
            <Swatches title="Dark" colors={resolved.dark} derived={source === "custom" && sides === "light"} />
          </div>
        </div>
      }
    />
  );
};
