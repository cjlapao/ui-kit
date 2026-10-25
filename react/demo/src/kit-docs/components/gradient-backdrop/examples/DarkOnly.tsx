import { GradientBackdrop, resolveGradientBackdropTheme, type GradientBackdropTheme } from "@cjlapao/ui-kit";

/**
 * It works the other way too: a dark-first app passes only `dark`, and the
 * light side is derived. `resolveGradientBackdropTheme` shows the colours the
 * component will use, if you want to store or show them.
 */
const NIGHT_SHIFT: GradientBackdropTheme = {
  dark: { glow: "#3b2a5a", from: "#120d1c", via: "#1d1530", to: "#2c2142" },
};

export default function DarkOnly() {
  const { light } = resolveGradientBackdropTheme(NIGHT_SHIFT);
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <GradientBackdrop theme={NIGHT_SHIFT} scheme="dark" className="h-28 rounded-xl" aria-label="Dark — as given" />
        <GradientBackdrop theme={NIGHT_SHIFT} scheme="light" className="h-28 rounded-xl" aria-label="Light — derived" />
      </div>
      <code className="text-xs text-neutral-500 dark:text-neutral-400">derived light: {JSON.stringify(light)}</code>
    </div>
  );
}
