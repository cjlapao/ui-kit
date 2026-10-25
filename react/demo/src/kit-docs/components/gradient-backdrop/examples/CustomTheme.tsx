import { GradientBackdrop, Panel, type GradientBackdropTheme } from "@cjlapao/ui-kit";

/**
 * Bring your own colours. Only the light side is given here — the dark side
 * is derived from it (same hue, the lightness mirrored by the formula fitted
 * on the built-in templates), so the backdrop still works in dark mode.
 */
const SUNRISE: GradientBackdropTheme = {
  label: "Sunrise",
  light: { glow: "#fde68a", from: "#fffbeb", via: "#fef3c7", to: "#fcd34d" },
  shape: { angle: 160, glowX: 80, glowY: -10 },
};

export default function CustomTheme() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      <GradientBackdrop theme={SUNRISE} scheme="light" className="flex min-h-40 items-center justify-center rounded-xl p-6">
        <Panel variant="glass" title="Light — as given" />
      </GradientBackdrop>
      <GradientBackdrop theme={SUNRISE} scheme="dark" className="dark flex min-h-40 items-center justify-center rounded-xl p-6">
        <Panel variant="glass" title="Dark — derived" />
      </GradientBackdrop>
    </div>
  );
}
