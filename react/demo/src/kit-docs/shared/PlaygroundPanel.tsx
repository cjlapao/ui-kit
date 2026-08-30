import React, {
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { MultiToggle, Panel, Select, Toggle } from "@cjlapao/ui-kit";
import type { MultiToggleOption } from "@cjlapao/ui-kit";
import backdropLight from "@assets/images/backdrop_demo_light.png";
import backdropDark from "@assets/images/backdrop_demo_dark.png";

/**
 * The applied theme is `class="dark"` on `<html>`, which `DocsApp`'s
 * `useTheme()` instance maintains (per-instance hook state, no context —
 * a second `useTheme()` call would only see its own stale mount-time
 * state and never react to the header toggle). Subscribe to the root
 * class directly, so the backdrop swaps live for whatever drives the
 * class: the header toggle or an OS preference change in system mode.
 */
const subscribeToRootTheme = (onStoreChange: () => void) => {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
};

const getRootIsDark = () =>
  document.documentElement.classList.contains("dark");

/**
 * What the playground backdrop renders when the header's background toggle is
 * on: the theme-aware demo photo, or a gradient template that simulates the
 * kind of app background glass components would sit over in product.
 */
export type BackdropType = "image" | "gradient";

interface GradientTemplate {
  id: string;
  label: string;
  light: string;
  dark: string;
}

/**
 * Muted, low-saturation gradient templates (slate/greys/warm neutrals) —
 * deliberately not colourful: they stand in for real app content backdrops,
 * so translucent components can be judged the way they would be in product.
 * Each template carries light and dark variants so it swaps with the theme,
 * like the demo photo does.
 */
export const GRADIENT_TEMPLATES: GradientTemplate[] = [
  {
    id: "slate",
    label: "Slate",
    light:
      "radial-gradient(1100px 560px at 18% -8%, #e2e8f0 0%, rgba(226,232,240,0) 62%), linear-gradient(135deg, #f8fafc 0%, #e2e8f0 55%, #cbd5e1 100%)",
    dark: "radial-gradient(1100px 560px at 18% -8%, #334155 0%, rgba(51,65,85,0) 62%), linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #334155 100%)",
  },
  {
    id: "mist",
    label: "Mist",
    light:
      "radial-gradient(900px 500px at 82% 8%, #dbeafe 0%, rgba(219,234,254,0) 58%), linear-gradient(160deg, #f8fafc 0%, #e6edf5 55%, #d3dde9 100%)",
    dark: "radial-gradient(900px 500px at 82% 8%, #16304f 0%, rgba(22,48,79,0) 58%), linear-gradient(160deg, #0b1220 0%, #16202e 55%, #1f2c3d 100%)",
  },
  {
    id: "stone",
    label: "Stone",
    light:
      "radial-gradient(1000px 560px at 14% 108%, #e7e5e4 0%, rgba(231,229,228,0) 62%), linear-gradient(135deg, #fafaf9 0%, #e7e5e4 55%, #d6d3d1 100%)",
    dark: "radial-gradient(1000px 560px at 14% 108%, #292524 0%, rgba(41,37,36,0) 62%), linear-gradient(135deg, #1c1917 0%, #292524 55%, #44403c 100%)",
  },
  {
    id: "dune",
    label: "Dune",
    light:
      "radial-gradient(900px 480px at 50% 118%, #ece7df 0%, rgba(236,231,223,0) 60%), linear-gradient(180deg, #f7f4ef 0%, #ece7df 55%, #ded5c8 100%)",
    dark: "radial-gradient(900px 480px at 50% 118%, #221e1a 0%, rgba(34,30,26,0) 60%), linear-gradient(180deg, #141210 0%, #221e1a 55%, #35302a 100%)",
  },
  {
    id: "fog",
    label: "Fog",
    light:
      "radial-gradient(820px 420px at 50% 118%, #e2e8f0 0%, rgba(226,232,240,0) 60%), linear-gradient(120deg, #f5f7fa 0%, #e8edf3 50%, #f5f7fa 100%)",
    dark: "radial-gradient(820px 420px at 50% 118%, #1e293b 0%, rgba(30,41,59,0) 60%), linear-gradient(120deg, #0f1420 0%, #1a2332 50%, #0f1420 100%)",
  },
  {
    id: "graphite",
    label: "Graphite",
    light:
      "radial-gradient(1000px 520px at 22% -10%, #d1d5db 0%, rgba(209,213,219,0) 60%), linear-gradient(135deg, #e5e7eb 0%, #d1d5db 45%, #9ca3af 100%)",
    dark: "radial-gradient(1000px 520px at 22% -10%, #3f3f46 0%, rgba(63,63,70,0) 60%), linear-gradient(135deg, #18181b 0%, #27272a 45%, #3f3f46 100%)",
  },
];

interface PlaygroundPanelProps {
  /** Controls column (left on wide screens). */
  controls: ReactNode;
  /** The live demo (right on wide screens). No code is shown here. */
  preview: ReactNode;
  /** Extra classes for the preview stage. */
  previewClassName?: string;
  /**
   * Hide the header's background-image toggle for playgrounds that supply
   * their own backdrop (GlassBackground draws one itself, so a second
   * would fight it).
   */
  hideBackgroundToggle?: boolean;
  /** Never rendered — present only so the guard below can catch it. */
  children?: ReactNode;
}

/**
 * The interactive playground at the top of every component page:
 * controls on the left, the live result on the right. Deliberately
 * carries no code — the copy-paste source lives in the ExampleCards
 * further down the page.
 *
 * The header's "Background image" toggle (same as the legacy docs)
 * paints a theme-aware backdrop behind the preview so translucent and
 * glass components can be judged over a real backdrop. Once on, two
 * selects let the page swap the demo photo for one of the muted
 * `GRADIENT_TEMPLATES` (default Slate) — a stand-in for the app
 * backgrounds these components would sit over in product.
 */
export const PlaygroundPanel: React.FC<PlaygroundPanelProps> = ({
  controls,
  preview,
  previewClassName = "",
  hideBackgroundToggle = false,
  children,
}) => {
  // The Vite demo build does not type-check, so a missing `preview` (e.g. the
  // demo passed as `children`) would otherwise render an empty, unexplained
  // panel. Fail loudly instead.
  if (preview == null) {
    throw new Error(
      `PlaygroundPanel: the live demo must be passed as the "preview" prop (got children=${
        children != null
      }) — the panel renders its preview prop, not its children.`,
    );
  }
  const isDark = useSyncExternalStore(subscribeToRootTheme, getRootIsDark);
  const [showBackground, setShowBackground] = useState(false);
  const [backdropType, setBackdropType] = useState<BackdropType>("image");
  const [templateId, setTemplateId] = useState("slate");

  const template =
    GRADIENT_TEMPLATES.find((entry) => entry.id === templateId) ??
    GRADIENT_TEMPLATES[0];

  const previewBackgroundStyle = useMemo<React.CSSProperties | undefined>(
    () => {
      if (!showBackground) return undefined;
      if (backdropType === "image") {
        return {
          backgroundImage: `url(${isDark ? backdropDark : backdropLight})`,
        };
      }
      return { background: isDark ? template.dark : template.light };
    },
    [showBackground, backdropType, template, isDark],
  );

  return (
    <Panel variant="outlined" padding="none" scrollable={false}>
      <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
            Playground
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
            Tweak the controls — the preview updates live.
          </p>
        </div>
        {!hideBackgroundToggle && (
          <div className="flex flex-wrap items-center gap-3">
            <Toggle
              size="sm"
              alignLabel="left"
              color="blue"
              label="Background image"
              checked={showBackground}
              onChange={(event) => setShowBackground(event.target.checked)}
            />
            {showBackground && (
              <>
                <div className="w-28">
                  <Select
                    size="sm"
                    aria-label="Backdrop type"
                    value={backdropType}
                    onChange={(event) =>
                      setBackdropType(event.target.value as BackdropType)
                    }
                  >
                    <option value="image">Image</option>
                    <option value="gradient">Gradient</option>
                  </Select>
                </div>
                {backdropType === "gradient" && (
                  <div className="w-32">
                    <Select
                      size="sm"
                      aria-label="Backdrop template"
                      value={templateId}
                      onChange={(event) => setTemplateId(event.target.value)}
                    >
                      {GRADIENT_TEMPLATES.map((entry) => (
                        <option key={entry.id} value={entry.id}>
                          {entry.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <div className="grid lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
        <div className="space-y-4 border-b border-neutral-100 p-5 dark:border-neutral-800 lg:border-b-0 lg:border-r">
          {controls}
        </div>
        <div
          className={`flex min-h-44 flex-wrap items-start justify-center gap-4 p-6 ${
            showBackground
              ? "overflow-hidden bg-cover bg-center bg-no-repeat"
              : ""
          } ${previewClassName}`}
          style={previewBackgroundStyle}
        >
          {preview}
        </div>
      </div>
    </Panel>
  );
};

/** A labelled control block: small caps label on top, control below. */
export const Control: React.FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => (
  <div className="space-y-1.5">
    <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
      {label}
    </span>
    {children}
  </div>
);

/**
 * A labelled dropdown, for option lists too long for a segmented MultiToggle
 * (the kit's Select, which wraps a native <select>).
 */
export const SelectControl: React.FC<{
  label: string;
  options: MultiToggleOption[];
  value: string;
  onChange: (value: string) => void;
}> = ({ label, options, value, onChange }) => (
  <Control label={label}>
    <Select
      size="sm"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  </Control>
);

/**
 * Picks the control that suits the number of options: a segmented
 * `MultiToggle` for a short list, a `Select` once there are enough entries
 * that segments would be unreadably narrow. Always full width, so the controls
 * column stays a single tidy stack.
 */
export const CHOICE_CONTROL_MAX_SEGMENTS = 4;

export const ChoiceControl: React.FC<{
  label: string;
  options: MultiToggleOption[];
  value: string;
  onChange: (value: string) => void;
}> = ({ label, options, value, onChange }) => (
  <Control label={label}>
    {options.length < CHOICE_CONTROL_MAX_SEGMENTS ? (
      <MultiToggle
        fullWidth
        size="sm"
        options={options}
        value={value}
        onChange={onChange}
      />
    ) : (
      <Select
        size="sm"
        className="w-full"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    )}
  </Control>
);

/** A single on/off row for the playground controls column. */
export const ToggleRow: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center justify-between gap-2 text-sm text-neutral-700 dark:text-neutral-300">
    <span>{label}</span>
    <Toggle
      size="sm"
      color="blue"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  </label>
);
