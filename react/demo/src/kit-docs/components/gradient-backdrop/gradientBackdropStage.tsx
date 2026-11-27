import React from "react";
import {
  Panel,
  resolveGradientBackdropTheme,
  type GradientBackdropColors,
  type GradientBackdropRole,
  type GradientBackdropTemplateId,
  type GradientBackdropTheme,
} from "@cjlapao/ui-kit";
import type { PlaygroundState } from "../../shared/playground/schema";

/**
 * The pieces of the Gradient Backdrop stage that are not the component: the
 * sample theme the colour pickers edit, the glass panel sitting on the
 * backdrop, and the resolved-colour readout.
 *
 * `themeFor` is the single source: the preview mounts what it returns and the
 * Code view prints it, so a colour on screen and a colour in the snippet are
 * the same string.
 */

export const ROLES: GradientBackdropRole[] = ["glow", "from", "via", "to"];

/**
 * How big the stage is. The component has no height of its own — the root is a
 * plain `relative` div (GradientBackdrop.tsx:79) — so a backdrop with no size
 * paints nothing, and a snippet that leaves the size out is not the screen it
 * claims to reproduce. Hence the field that prints it is `alwaysEmit`.
 */
export const STAGE_CLASS = "flex min-h-64 items-center justify-center rounded-xl p-8";

export const STAGE_OPTIONS = [
  { value: STAGE_CLASS, label: "Card — min-h-64, centred" },
  { value: "flex min-h-32 items-center rounded-xl px-6", label: "Banner — min-h-32" },
  { value: "min-h-[26rem] rounded-xl", label: "Tall — min-h-[26rem]" },
];

export const ROLE_LABELS: Record<GradientBackdropRole, string> = {
  glow: "Glow",
  from: "From",
  via: "Via",
  to: "To",
};

/** The docs' sample theme, per side. A side the reader hides is left undefined. */
export const SAMPLE: Record<"light" | "dark", GradientBackdropColors> = {
  light: { glow: "#fde68a", from: "#fffbeb", via: "#fef3c7", to: "#fcd34d" },
  dark: { glow: "#221e1a", from: "#141210", via: "#221e1a", to: "#35302a" },
};

const stateKey = (side: "light" | "dark", role: GradientBackdropRole): string =>
  `${side}${role[0].toUpperCase()}${role.slice(1)}`;

/** The colours one scheme ends up wearing, as the pickers left them. */
export const colorsFor = (
  state: PlaygroundState,
  side: "light" | "dark",
): GradientBackdropColors =>
  Object.fromEntries(
    ROLES.map((role) => [role, String(state[stateKey(side, role)] ?? SAMPLE[side][role])]),
  ) as unknown as GradientBackdropColors;

/** What `theme` holds right now: a template id, or the sample theme minus the hidden side. */
export const themeFor = (
  state: PlaygroundState,
): GradientBackdropTemplateId | GradientBackdropTheme => {
  if (String(state.source ?? "template") !== "custom") {
    return (state.template ?? "slate") as GradientBackdropTemplateId;
  }
  const sides = String(state.sides ?? "light");
  return {
    light: sides === "dark" ? undefined : colorsFor(state, "light"),
    dark: sides === "light" ? undefined : colorsFor(state, "dark"),
  };
};

/** The panel on the backdrop — the component's children. */
export const overlayFor = (): React.ReactElement => (
  <Panel
    variant="glass"
    title="Glass over the backdrop"
    subtitle="The theme follows the page's light / dark mode"
  >
    <p className="text-sm">
      Switch the docs theme in the header — the backdrop swaps with no JavaScript.
    </p>
  </Panel>
);

/** The docs' own readout: what the two schemes resolved to, derived side included. */
export const Readout: React.FC<{ state: PlaygroundState }> = ({ state }) => {
  const resolved = resolveGradientBackdropTheme(themeFor(state));
  const custom = String(state.source ?? "template") === "custom";
  return (
    <div className="flex flex-wrap gap-6" aria-label="Resolved colours">
      {(["light", "dark"] as const).map((side) => (
        <div key={side} className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {side}{" "}
            {custom &&
            (side === "light"
              ? String(state.sides ?? "light") === "dark"
              : String(state.sides ?? "light") === "light") ? (
              <span className="normal-case tracking-normal text-sky-600 dark:text-sky-400">
                · derived
              </span>
            ) : null}
          </span>
          <div className="flex gap-1.5">
            {ROLES.map((role) => (
              <span key={role} className="flex flex-col items-center gap-0.5">
                <span
                  className="h-6 w-6 rounded border border-black/10 dark:border-white/10"
                  style={{ background: resolved[side][role] }}
                />
                <code className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                  {resolved[side][role]}
                </code>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/** One hex of the sample theme, edited with the platform's colour picker. */
export const ColorLever: React.FC<{
  role: GradientBackdropRole;
  value: unknown;
  side: "light" | "dark";
  onChange: (hex: string) => void;
}> = ({ role, value, side, onChange }) => (
  <label className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
    <input
      type="color"
      value={String(value ?? SAMPLE[side][role])}
      onChange={(event) => onChange(event.target.value)}
      className="h-7 w-9 cursor-pointer rounded border border-neutral-200 bg-transparent dark:border-neutral-700"
    />
    <span className="w-10">{ROLE_LABELS[role]}</span>
    <code className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
      {String(value ?? SAMPLE[side][role])}
    </code>
  </label>
);
