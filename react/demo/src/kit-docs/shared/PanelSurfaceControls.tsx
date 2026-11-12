import type { SurfaceTone, SurfaceVariant } from "@cjlapao/ui-kit";
import { ChoiceControl, Control, ToggleRow } from "./PlaygroundPanel";
import { SurfaceToneSwatches } from "./SurfaceToneControl";
import { surfaceVariantOptions } from "./options";

/**
 * Dropdown-card surface controls shared by the field playgrounds
 * (Picker, TagPicker, Combobox): variant and tone, both defaulting to
 * `"auto"` (follow the field).
 */
export function PanelSurfaceControls({
  panelVariant,
  onPanelVariant,
  panelTone,
  onPanelTone,
}: {
  panelVariant: "auto" | SurfaceVariant;
  onPanelVariant: (v: "auto" | SurfaceVariant) => void;
  panelTone: "auto" | SurfaceTone;
  onPanelTone: (v: "auto" | SurfaceTone) => void;
}) {
  return (
    <>
      <ChoiceControl
        label="Dropdown surface"
        options={[{ label: "Auto", value: "auto" }, ...surfaceVariantOptions]}
        value={panelVariant}
        onChange={(v) => onPanelVariant(v as "auto" | SurfaceVariant)}
      />
      <Control label="Dropdown tone">
        <SurfaceToneSwatches
          value={panelTone === "auto" ? "none" : panelTone}
          onSelect={onPanelTone}
        />
      </Control>
      {/* The swatches cannot show "auto" — this drives it. */}
      <ToggleRow
        label="Dropdown tone follows field"
        checked={panelTone === "auto"}
        onChange={(v) => onPanelTone(v ? "auto" : "none")}
      />
    </>
  );
}
